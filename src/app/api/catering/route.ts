import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { CateringLead } from "@/lib/types";

export async function GET() {
  const leads = await readCollection<CateringLead>("catering-leads");
  return NextResponse.json({ leads: leads.reverse() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.phone || !body.eventType || !body.guestCount) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const lead: CateringLead = {
    id: generateId("LB-CAT"),
    createdAt: new Date().toISOString(),
    name: body.name,
    phone: body.phone,
    email: body.email,
    eventDate: body.eventDate,
    eventType: body.eventType,
    guestCount: Number(body.guestCount),
    budget: body.budget,
    foodPreference: body.foodPreference ?? "mixed",
    message: body.message,
  };

  await appendToCollection("catering-leads", lead);
  return NextResponse.json({ lead }, { status: 201 });
}
