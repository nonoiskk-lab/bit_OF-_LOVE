import fs from "node:fs/promises";
import path from "node:path";

/**
 * Persistence for orders, bookings and catering leads.
 *
 * Two interchangeable backends behind the same four functions:
 *
 * 1. Supabase (production) — used automatically when SUPABASE_URL and
 *    SUPABASE_SERVICE_ROLE_KEY are set. Talks to Supabase's REST API with plain
 *    `fetch` (no extra npm dependency). All records live in one table,
 *    `lovbites_records` (see supabase/schema.sql). The service-role key is
 *    server-only — it is never sent to the browser.
 *
 * 2. JSON files in ./data (local development only). Vercel's serverless
 *    filesystem is read-only, so this backend CANNOT store anything in
 *    production — `isPersistentStorageConfigured()` lets routes fail loudly
 *    instead of pretending an order was saved.
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "lovbites_records";

const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Thrown when a unique constraint rejects a record (e.g. a cottage slot already taken). */
export class DuplicateRecordError extends Error {}

/** Thrown when there is nowhere durable to save data (file store on a read-only server). */
export class StorageUnavailableError extends Error {}

export function isPersistentStorageConfigured(): boolean {
  return useSupabase || !process.env.VERCEL;
}

// ---------------------------------------------------------------- Supabase

async function supabase(pathAndQuery: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 409) throw new DuplicateRecordError("Duplicate record");
  if (!res.ok) {
    // Log status only — never log customer data or keys.
    console.error(`[storage] Supabase request failed: ${res.status}`);
    throw new StorageUnavailableError(`Storage request failed (${res.status})`);
  }
  return res;
}

// ---------------------------------------------------------------- JSON files

const DATA_DIR = path.join(process.cwd(), "data");

async function filePath(collection: string) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  return path.join(DATA_DIR, `${collection}.json`);
}

function assertWritableFileStore() {
  if (process.env.VERCEL) {
    throw new StorageUnavailableError(
      "No database configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel."
    );
  }
}

// ---------------------------------------------------------------- Public API

export async function readCollection<T>(collection: string): Promise<T[]> {
  if (useSupabase) {
    const res = await supabase(
      `${TABLE}?select=data&collection=eq.${encodeURIComponent(collection)}&order=created_at.asc&limit=5000`
    );
    const rows = (await res.json()) as { data: T }[];
    return rows.map((r) => r.data);
  }
  try {
    const raw = await fs.readFile(await filePath(collection), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function appendToCollection<T extends { id: string }>(collection: string, record: T): Promise<T> {
  if (useSupabase) {
    await supabase(TABLE, {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ id: record.id, collection, data: record }),
    });
    return record;
  }
  assertWritableFileStore();
  const items = await readCollection<T>(collection);
  items.push(record);
  await fs.writeFile(await filePath(collection), JSON.stringify(items, null, 2), "utf-8");
  return record;
}

/** Replaces a whole collection. File backend only (kept for local tooling). */
export async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  if (useSupabase) {
    throw new Error("writeCollection is not supported with Supabase — use appendToCollection.");
  }
  assertWritableFileStore();
  await fs.writeFile(await filePath(collection), JSON.stringify(data, null, 2), "utf-8");
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}
