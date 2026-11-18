import { NextRequest, NextResponse } from "next/server";
import { DuplicateRecordError } from "./file-store";

/**
 * Small, dependency-free input helpers shared by every public API route.
 * Goal: never trust the browser — cap sizes, normalise strings, and reject
 * malformed payloads with a clean 400 instead of a 500.
 */

export const LIMITS = {
  name: 80,
  phone: 20,
  email: 120,
  address: 400,
  note: 600,
  shortText: 60,
} as const;

/** Parse a JSON body without throwing; returns null for invalid/oversized JSON. */
export async function readJson(req: NextRequest, maxBytes = 20_000): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    if (!text || text.length > maxBytes) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Trimmed string capped at `max` chars, or undefined if missing/empty/not a string. */
export function str(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().slice(0, max);
  return v.length ? v : undefined;
}

/** Accepts Indian mobile numbers: 10 digits starting 6-9, optional +91 / 0 / spaces / dashes. */
export function indianPhone(value: unknown): string | undefined {
  const raw = str(value, LIMITS.phone);
  if (!raw) return undefined;
  const digits = raw.replace(/[\s()-]/g, "").replace(/^(\+?91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : undefined;
}

export function email(value: unknown): string | undefined {
  const v = str(value, LIMITS.email);
  return v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : undefined;
}

/** YYYY-MM-DD that is today or later (India time) and within `maxDaysAhead`. */
export function futureDate(value: unknown, maxDaysAhead = 365): string | undefined {
  const v = str(value, 10);
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined;
  const today = indiaToday();
  if (v < today) return undefined;
  const limit = new Date(Date.now() + maxDaysAhead * 86_400_000).toISOString().slice(0, 10);
  return v <= limit ? v : undefined;
}

export function intInRange(value: unknown, min: number, max: number): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : undefined;
}

export function oneOf<T extends string>(value: unknown, options: readonly T[]): T | undefined {
  return typeof value === "string" && (options as readonly string[]).includes(value) ? (value as T) : undefined;
}

/** Today's date in Asia/Kolkata as YYYY-MM-DD (server runs in UTC). */
export function indiaToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

/**
 * Turns storage failures into honest responses: the customer is told the
 * booking was NOT saved and offered WhatsApp/phone instead of a fake success.
 */
export function storageErrorResponse(err: unknown) {
  if (err instanceof DuplicateRecordError) {
    return NextResponse.json(
      { error: "This slot was just taken. Please pick another time." },
      { status: 409 }
    );
  }
  console.error("[storage] could not save record:", err instanceof Error ? err.message : "unknown error");
  return NextResponse.json(
    {
      error:
        "We couldn't save this online right now. Please send it to us on WhatsApp or call us — nothing has been charged.",
      fallback: "whatsapp",
    },
    { status: 503 }
  );
}
