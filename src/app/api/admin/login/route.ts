import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, checkPassword, createSessionToken } from "@/lib/server/admin-auth";

/**
 * Best-effort brute-force protection: max 5 failed attempts per IP per 15 minutes.
 * In-memory, so it resets when a serverless instance is recycled — it slows an
 * attacker down rather than being a hard guarantee. A strong ADMIN_PASSWORD is
 * still the real defence.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const failures = new Map<string, { count: number; first: number }>();

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isLocked(ip: string): boolean {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILS;
}

function recordFailure(ip: string) {
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    failures.set(ip, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
  if (failures.size > 5000) failures.clear(); // memory guard
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isLocked(ip)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || password.length > 200 || !checkPassword(password)) {
    recordFailure(ip);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  failures.delete(ip);
  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Admin login isn't configured on this server (ADMIN_SESSION_SECRET missing)." },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
