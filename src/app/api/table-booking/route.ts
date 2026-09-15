import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { TableBookingRecord } from "@/lib/types";
import { isAdminRequest } from "@/lib/server/admin-auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  const bookings = await readCollection<TableBookingRecord>("table-bookings");
  return NextResponse.json({ bookings: bookings.reverse() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.date || !body.time || !body.guests) {
    return NextResponse.json({ error: "Date, time and guest count are required." }, { status: 400 });
  }
  if (!body.customer?.name || !body.customer?.phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const booking: TableBookingRecord = {
    id: generateId("LB-TBL"),
    createdAt: new Date().toISOString(),
    date: body.date,
    time: body.time,
    guests: Number(body.guests),
    seating: body.seating === "outdoor" ? "outdoor" : "indoor",
    customer: body.customer,
    specialRequest: body.specialRequest,
    status: "PENDING",
  };

  await appendToCollection("table-bookings", booking);
  return NextResponse.json({ booking }, { status: 201 });
}
