import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { CateringLead } from "@/lib/types";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { LIMITS, email, futureDate, indianPhone, intInRange, oneOf, readJson, storageErrorResponse, str } from "@/lib/server/validate";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  const leads = await readCollection<CateringLead>("catering-leads");
  return NextResponse.json({ leads: leads.reverse() });
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const name = str(body.name, LIMITS.name);
  const phone = indianPhone(body.phone);
  const eventType = str(body.eventType, LIMITS.shortText);
  const guestCount = intInRange(body.guestCount, 1, 5000);

  if (!name || !eventType || !guestCount) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
  }

  const lead: CateringLead = {
    id: generateId("LB-CAT"),
    createdAt: new Date().toISOString(),
    name,
    phone,
    email: email(body.email),
    eventDate: futureDate(body.eventDate, 730),
    eventType,
    guestCount,
    budget: str(body.budget, LIMITS.shortText),
    foodPreference: oneOf(body.foodPreference, ["veg", "nonveg", "mixed"] as const) ?? "mixed",
    message: str(body.message, LIMITS.note),
  };

  try {
    await appendToCollection("catering-leads", lead);
  } catch (err) {
    return storageErrorResponse(err);
  }
  return NextResponse.json({ lead }, { status: 201 });
}
