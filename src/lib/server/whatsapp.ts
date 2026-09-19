import { WhatsAppSendResult } from "@/lib/types";

/**
 * WhatsApp Cloud API (Meta) client — template messages only.
 *
 * Marketing messages on WhatsApp must use a template pre-approved by Meta
 * and may only be sent to numbers that have opted in; free-form text is
 * only allowed inside the 24h customer-service window after a user writes
 * in first. There is deliberately no free-text bulk-send function here —
 * only sendBulkTemplateMessages, which always goes through the template
 * endpoint, so this can't be used to spam arbitrary text.
 */

const GRAPH_API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";
const SEND_DELAY_MS = 150; // stay comfortably under Cloud API per-second rate limits

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  bodyParams?: string[]
): Promise<WhatsAppSendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return {
      to,
      ok: false,
      error: "WhatsApp API is not configured (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing).",
    };
  }

  const recipient = normalizePhone(to);
  if (!recipient) {
    return { to, ok: false, error: "Invalid phone number." };
  }

  const payload = {
    messaging_product: "whatsapp",
    to: recipient,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(bodyParams?.length
        ? { components: [{ type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) }] }
        : {}),
    },
  };

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.error?.message ?? `WhatsApp API error (HTTP ${res.status}).`;
      return { to: recipient, ok: false, error: message };
    }
    return { to: recipient, ok: true, messageId: data?.messages?.[0]?.id };
  } catch (err) {
    return { to: recipient, ok: false, error: err instanceof Error ? err.message : "Network error." };
  }
}

export async function sendBulkTemplateMessages(
  recipients: string[],
  templateName: string,
  languageCode: string,
  bodyParams?: string[]
): Promise<WhatsAppSendResult[]> {
  const results: WhatsAppSendResult[] = [];
  for (const to of recipients) {
    results.push(await sendTemplateMessage(to, templateName, languageCode, bodyParams));
    await new Promise((r) => setTimeout(r, SEND_DELAY_MS));
  }
  return results;
}
