import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { isWhatsAppConfigured, sendBulkTemplateMessages } from "@/lib/server/whatsapp";
import { WhatsAppBroadcastRecord } from "@/lib/types";

const MAX_RECIPIENTS_PER_REQUEST = 250;

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  const broadcasts = await readCollection<WhatsAppBroadcastRecord>("whatsapp-broadcasts");
  return NextResponse.json({ configured: isWhatsAppConfigured(), broadcasts: broadcasts.reverse() });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }

  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      { error: "WhatsApp API is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const rawRecipients: string[] = Array.isArray(body?.recipients)
    ? body.recipients.filter((p: unknown): p is string => typeof p === "string" && p.trim().length > 0)
    : [];
  const recipients: string[] = Array.from(new Set(rawRecipients));
  const templateName: string = typeof body?.templateName === "string" ? body.templateName.trim() : "";
  const languageCode: string =
    typeof body?.languageCode === "string" && body.languageCode.trim() ? body.languageCode.trim() : "en";
  const bodyParams: string[] | undefined = Array.isArray(body?.bodyParams)
    ? body.bodyParams.map((p: unknown) => String(p))
    : undefined;

  if (recipients.length === 0) {
    return NextResponse.json({ error: "At least one recipient is required." }, { status: 400 });
  }
  if (!templateName) {
    return NextResponse.json(
      { error: "A pre-approved WhatsApp message template name is required — marketing messages can't be sent as free text." },
      { status: 400 }
    );
  }
  if (recipients.length > MAX_RECIPIENTS_PER_REQUEST) {
    return NextResponse.json(
      { error: `Send in batches of ${MAX_RECIPIENTS_PER_REQUEST} or fewer per request.` },
      { status: 400 }
    );
  }

  const results = await sendBulkTemplateMessages(recipients, templateName, languageCode, bodyParams);
  const successCount = results.filter((r) => r.ok).length;

  const record: WhatsAppBroadcastRecord = {
    id: generateId("LB-WA"),
    createdAt: new Date().toISOString(),
    templateName,
    languageCode,
    bodyParams,
    recipientCount: recipients.length,
    successCount,
    failureCount: results.length - successCount,
    results,
  };
  await appendToCollection("whatsapp-broadcasts", record);

  return NextResponse.json({ broadcast: record }, { status: 201 });
}
