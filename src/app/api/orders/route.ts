import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { OrderLine, OrderRecord } from "@/lib/types";
import { MENU } from "@/lib/menu-data";
import { LIMITS, indianPhone, intInRange, oneOf, readJson, storageErrorResponse, str } from "@/lib/server/validate";
import { isAdminRequest } from "@/lib/server/admin-auth";

const MENU_ITEMS_BY_ID = new Map(MENU.flatMap((c) => c.items).map((i) => [i.id, i]));

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  const orders = await readCollection<OrderRecord>("orders");
  return NextResponse.json({ orders: orders.reverse() });
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const rawLines = Array.isArray(body.lines) ? body.lines.slice(0, 60) : [];
  if (!rawLines.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Never trust prices/names from the browser: rebuild every line from the real menu.
  const lines: OrderLine[] = [];
  for (const raw of rawLines as Array<Record<string, unknown>>) {
    const item = MENU_ITEMS_BY_ID.get(String(raw?.itemId ?? ""));
    const quantity = intInRange(raw?.quantity, 1, 50);
    if (!item || !quantity) {
      return NextResponse.json(
        { error: "One of the items in your cart is no longer available. Please refresh the menu." },
        { status: 400 }
      );
    }
    lines.push({ itemId: item.id, name: item.name, price: item.price, quantity });
  }

  const customerIn = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(customerIn.name, LIMITS.name);
  const phone = indianPhone(customerIn.phone);
  const fulfilment = body.fulfilment === "pickup" ? "pickup" : "delivery";
  const address = str(customerIn.address, LIMITS.address);

  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!phone) {
    return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
  }
  if (fulfilment === "delivery" && !address) {
    return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
  }

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const order: OrderRecord = {
    id: generateId("LB-ORD"),
    createdAt: new Date().toISOString(),
    fulfilment,
    status: "NEW",
    lines,
    total,
    customer: { name, phone, address: fulfilment === "delivery" ? address : undefined },
    paymentMethod: oneOf(body.paymentMethod, ["upi", "card", "cod"] as const) ?? "cod",
  };

  try {
    await appendToCollection("orders", order);
  } catch (err) {
    return storageErrorResponse(err);
  }
  return NextResponse.json({ order }, { status: 201 });
}
