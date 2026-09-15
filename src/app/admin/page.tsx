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
type AuthState = "checking" | "signed-out" | "signed-in";

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [tables, setTables] = useState<TableBookingRecord[]>([]);
  const [cottages, setCottages] = useState<CottageBookingRecord[]>([]);
  const [catering, setCatering] = useState<CateringLead[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [o, t, c, k] = await Promise.all([
      fetch("/api/orders"),
      fetch("/api/table-booking"),
      fetch("/api/cottage-booking"),
      fetch("/api/catering"),
    ]);

    if ([o, t, c, k].some((r) => r.status === 401)) {
      setAuth("signed-out");
      setLoading(false);
      return;
    }

    const [oj, tj, cj, kj] = await Promise.all([o.json(), t.json(), c.json(), k.json()]);
    setOrders(oj.orders ?? []);
    setTables(tj.bookings ?? []);
    setCottages(cj.bookings ?? []);
    setCatering(kj.leads ?? []);
    setAuth("signed-in");
    setLoading(false);
  }

  useEffect(() => {
    // Fetch-on-mount: an authenticated admin session already carries the cookie,
    // so this doubles as the initial auth check.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLoginError(data.error ?? "Login failed.");
        return;
      }
      setPassword("");
      await loadAll();
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setOrders([]);
    setTables([]);
    setCottages([]);
    setCatering([]);
    setAuth("signed-out");
  }

  if (auth === "checking") {
    return (
      <div className="pt-16 md:pt-20 min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-lb-neutral">Checking session…</p>
      </div>
    );
  }

  if (auth === "signed-out") {
    return (
      <div className="pt-16 md:pt-20 min-h-[70vh] flex items-center justify-center px-5">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="font-display font-black uppercase text-2xl mb-2">Admin Login</h1>
          <p className="text-sm text-lb-neutral mb-6">
            LOVBITES staff only — orders and bookings contain customer contact details.
          </p>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm mb-4"
          />
          {loginError && <p className="text-sm text-lb-red mb-4">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-full bg-lb-red text-lb-cream py-3.5 text-sm font-semibold disabled:opacity-60"
          >
            {loggingIn ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "orders", label: "Orders", count: orders.length },
    { id: "tables", label: "Table Bookings", count: tables.length },
    { id: "cottages", label: "Cottage Bookings", count: cottages.length },
    { id: "catering", label: "Catering Leads", count: catering.length },
  ];

  return (
    <div className="pt-16 md:pt-20 px-5 md:px-8 py-10 max-w-5xl mx-auto">
      <div className="rounded-xl bg-lb-red/10 border border-lb-red/30 text-sm text-lb-red-deep px-4 py-3 mb-8">
        Password-gated internal dashboard. For a multi-staff rollout, swap this single shared
        password for per-user accounts (e.g. Supabase Auth) before handing out access widely.
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-black uppercase text-3xl">LOVBITES Admin</h1>
        <button
          onClick={handleLogout}
          className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide border border-lb-charcoal/20"
        >
          Sign Out
        </button>
      </div>

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
