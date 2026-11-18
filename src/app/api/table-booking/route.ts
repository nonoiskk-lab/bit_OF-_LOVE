import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { TableBookingRecord } from "@/lib/types";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { SLOT_TIMES } from "@/lib/cottages-data";
import { LIMITS, futureDate, indianPhone, intInRange, oneOf, readJson, storageErrorResponse, str } from "@/lib/server/validate";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  const bookings = await readCollection<TableBookingRecord>("table-bookings");
  return NextResponse.json({ bookings: bookings.reverse() });
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const date = futureDate(body.date, 90);
  const time = oneOf(body.time, SLOT_TIMES);
  const guests = intInRange(body.guests, 1, 20);
  if (!date || !time || !guests) {
    return NextResponse.json(
      { error: "Please choose a valid date (today or later), time and guest count (1–20)." },
      { status: 400 }
    );
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

  const booking: TableBookingRecord = {
    id: generateId("LB-TBL"),
    createdAt: new Date().toISOString(),
    date,
    time,
    guests,
    seating: body.seating === "outdoor" ? "outdoor" : "indoor",
    customer: { name, phone },
    specialRequest: str(body.specialRequest, LIMITS.note),
    status: "PENDING",
  };

  try {
    await appendToCollection("table-bookings", booking);
  } catch (err) {
    return storageErrorResponse(err);
  }
  return NextResponse.json({ booking }, { status: 201 });
}
