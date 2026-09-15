import { NextRequest, NextResponse } from "next/server";
import { generateId, readCollection, writeCollection } from "@/lib/server/file-store";
import { CottageBookingRecord } from "@/lib/types";
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
  const body = await req.json();

  if (!body.cottageId || !body.date || !body.time || !body.guests || !body.occasion) {
    return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
  }
  if (!body.customer?.name || !body.customer?.phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const all = await readCollection<CottageBookingRecord>("cottage-bookings");
  const conflict = all.find(
    (b) =>
      b.status !== "CANCELLED" &&
      b.cottageId === body.cottageId &&
      b.date === body.date &&
      b.time === body.time
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
    cottageId: body.cottageId,
    date: body.date,
    time: body.time,
    guests: Number(body.guests),
    occasion: body.occasion,
    customRequest: body.customRequest,
    customer: body.customer,
    advancePaid: body.advancePaid ?? 0,
    status: "CONFIRMED",
  };

  all.push(booking);
  await writeCollection("cottage-bookings", all);

  return NextResponse.json({ booking }, { status: 201 });
}
