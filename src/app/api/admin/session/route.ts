import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";

/**
 * Lightweight session check for the /admin page. Always answers 200 so a
 * signed-out visitor doesn't trigger 401 errors in the browser console.
 */
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { authenticated: isAdminRequest(req) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
