import { NextRequest, NextResponse } from "next/server";
import { appendToCollection, generateId, readCollection } from "@/lib/server/file-store";
import { OrderRecord } from "@/lib/types";

export async function GET() {
  const orders = await readCollection<OrderRecord>("orders");
  return NextResponse.json({ orders: orders.reverse() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.lines?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!body.customer?.name || !body.customer?.phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }
  if (body.fulfilment === "delivery" && !body.customer?.address) {
    return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
  }

  const total = body.lines.reduce(
    (sum: number, l: { price: number; quantity: number }) => sum + l.price * l.quantity,
    0
  );

  const order: OrderRecord = {
    id: generateId("LB-ORD"),
    createdAt: new Date().toISOString(),
    fulfilment: body.fulfilment === "pickup" ? "pickup" : "delivery",
    status: "NEW",
    lines: body.lines,
    total,
    customer: body.customer,
    paymentMethod: body.paymentMethod ?? "cod",
  };

  await appendToCollection("orders", order);
  return NextResponse.json({ order }, { status: 201 });
}
