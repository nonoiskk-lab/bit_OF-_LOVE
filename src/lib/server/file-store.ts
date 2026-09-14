import fs from "node:fs/promises";
import path from "node:path";

/**
 * Minimal JSON-file persistence so booking/order flows are real and
 * testable without provisioning a database in this environment.
 * Swap for Supabase/Postgres before production — this has no locking
 * and won't survive a serverless read-only filesystem (e.g. Vercel).
 */
const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function filePath(collection: string) {
  await ensureDataDir();
  return path.join(DATA_DIR, `${collection}.json`);
}

export async function readCollection<T>(collection: string): Promise<T[]> {
  const file = await filePath(collection);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  const file = await filePath(collection);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function appendToCollection<T>(collection: string, record: T): Promise<T> {
  const items = await readCollection<T>(collection);
  items.push(record);
  await writeCollection(collection, items);
  return record;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}
