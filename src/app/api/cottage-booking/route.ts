import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { CottageBookingRecord, Occasion } from "@/lib/types";
import { COTTAGES, OCCASIONS, SLOT_TIMES } from "@/lib/cottages-data";
import { LIMITS, email, futureDate, indianPhone, intInRange, oneOf, readJson, storageErrorResponse, str } from "@/lib/server/validate";
import { isAdminRequest } from "@/lib/server/admin-auth";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const all = await readCollection<CottageBookingRecord>("cottage-bookings");
  const active = all.filter((b) => b.status !== "CANCELLED");
  const bookings = date ? active.filter((b) => b.date === date) : active;

  // Anyone booking a cottage needs to see live availability, so this stays public —
  // but only admins get customer names/phone numbers back.
  if (isAdminRequest(req)) {
    return NextResponse.json({ bookings });
  }
  const publicBookings = bookings.map(({ id, cottageId, date, time, status }) => ({
    id,
    cottageId,
    date,
    time,
    status,
  }));
  return NextResponse.json({ bookings: publicBookings });
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const cottage = COTTAGES.find((c) => c.id === body.cottageId);
  const date = futureDate(body.date, 90);
  const time = oneOf(body.time, SLOT_TIMES);
  const occasion = oneOf(body.occasion, OCCASIONS.map((o) => o.id) as Occasion[]);
  const guests = cottage ? intInRange(body.guests, 1, cottage.capacity) : undefined;

  if (!cottage || !date || !time || !occasion || !guests) {
    return NextResponse.json({ error: "Missing or invalid booking details." }, { status: 400 });
  }

  const customerIn = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(customerIn.name, LIMITS.name);
  const phone = indianPhone(customerIn.phone);
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Please enter your name and a valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  let all: CottageBookingRecord[];
  try {
    all = await readCollection<CottageBookingRecord>("cottage-bookings");
  } catch (err) {
    return storageErrorResponse(err);
  }
  const conflict = all.find(
    (b) => b.status !== "CANCELLED" && b.cottageId === cottage.id && b.date === date && b.time === time
  );

  if (conflict) {
    return NextResponse.json(
      { error: "This cottage is already booked for that date and time." },
      { status: 409 }
    );
  }

  const booking: CottageBookingRecord = {
    id: generateId("LB-COT"),
    createdAt: new Date().toISOString(),
    cottageId: cottage.id,
    date,
    time,
    guests,
    occasion,
    customRequest: str(body.customRequest, LIMITS.note),
    customer: { name, phone, email: email(customerIn.email) },
    // No payment gateway is connected, so nothing has been paid yet. Never accept
    // a paid amount from the browser — staff collect the advance when confirming.
    advancePaid: 0,
    status: "CONFIRMED",
  };

  try {
    await appendToCollection("cottage-bookings", booking);
  } catch (err) {
    return storageErrorResponse(err);
  }

  return NextResponse.json({ booking }, { status: 201 });
}
