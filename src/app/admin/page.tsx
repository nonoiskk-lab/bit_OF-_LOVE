"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  CateringLead,
  CottageBookingRecord,
  OrderRecord,
  TableBookingRecord,
} from "@/lib/types";

type Tab = "orders" | "tables" | "cottages" | "catering";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [tables, setTables] = useState<TableBookingRecord[]>([]);
  const [cottages, setCottages] = useState<CottageBookingRecord[]>([]);
  const [catering, setCatering] = useState<CateringLead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [o, t, c, k] = await Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/table-booking").then((r) => r.json()),
      fetch("/api/cottage-booking").then((r) => r.json()),
      fetch("/api/catering").then((r) => r.json()),
    ]);
    setOrders(o.orders ?? []);
    setTables(t.bookings ?? []);
    setCottages(c.bookings ?? []);
    setCatering(k.leads ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // Fetch-on-mount: loads all four collections once when the dashboard opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "orders", label: "Orders", count: orders.length },
    { id: "tables", label: "Table Bookings", count: tables.length },
    { id: "cottages", label: "Cottage Bookings", count: cottages.length },
    { id: "catering", label: "Catering Leads", count: catering.length },
  ];

  return (
    <div className="pt-16 md:pt-20 px-5 md:px-8 py-10 max-w-5xl mx-auto">
      <div className="rounded-xl bg-lb-red/10 border border-lb-red/30 text-sm text-lb-red-deep px-4 py-3 mb-8">
        Internal demo dashboard — read-only, no authentication. Wire up real auth and a
        production database (e.g. Supabase with RLS) before exposing this outside the team.
      </div>

      <h1 className="font-display font-black uppercase text-3xl mb-8">LOVBITES Admin</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              tab === t.id ? "bg-lb-charcoal text-lb-cream" : "bg-lb-cream-soft"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
        <button
          onClick={loadAll}
          className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide border border-lb-charcoal/20 ml-auto"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-lb-neutral">Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          {tab === "orders" && (
            <Table
              rows={orders}
              empty="No orders yet."
              columns={["ID", "Status", "Fulfilment", "Items", "Total", "Customer", "Placed"]}
              render={(o) => [
                o.id,
                o.status,
                o.fulfilment,
                o.lines.map((l) => `${l.quantity}× ${l.name}`).join(", "),
                formatPrice(o.total),
                `${o.customer.name} · ${o.customer.phone}`,
                new Date(o.createdAt).toLocaleString("en-IN"),
              ]}
            />
          )}
          {tab === "tables" && (
            <Table
              rows={tables}
              empty="No table bookings yet."
              columns={["ID", "Date", "Time", "Guests", "Seating", "Customer", "Status"]}
              render={(b) => [
                b.id,
                b.date,
                b.time,
                String(b.guests),
                b.seating,
                `${b.customer.name} · ${b.customer.phone}`,
                b.status,
              ]}
            />
          )}
          {tab === "cottages" && (
            <Table
              rows={cottages}
              empty="No cottage bookings yet."
              columns={["ID", "Cottage", "Date", "Time", "Guests", "Occasion", "Customer", "Status"]}
              render={(b) => [
                b.id,
                b.cottageId,
                b.date,
                b.time,
                String(b.guests),
                b.occasion,
                `${b.customer.name} · ${b.customer.phone}`,
                b.status,
              ]}
            />
          )}
          {tab === "catering" && (
            <Table
              rows={catering}
              empty="No catering leads yet."
              columns={["ID", "Name", "Event", "Date", "Guests", "Preference", "Contact"]}
              render={(l) => [
                l.id,
                l.name,
                l.eventType,
                l.eventDate ?? "—",
                String(l.guestCount),
                l.foodPreference,
                l.phone,
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Table<T>({
  rows,
  columns,
  render,
  empty,
}: {
  rows: T[];
  columns: string[];
  render: (row: T) => string[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-lb-neutral py-10 text-center">{empty}</p>;
  }
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-lb-neutral border-b border-lb-charcoal/10">
          {columns.map((c) => (
            <th key={c} className="py-2.5 pr-4 font-semibold whitespace-nowrap">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-lb-charcoal/5">
            {render(row).map((cell, j) => (
              <td key={j} className="py-2.5 pr-4 whitespace-nowrap max-w-xs truncate">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
