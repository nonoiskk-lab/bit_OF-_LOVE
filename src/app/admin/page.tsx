"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  CateringLead,
  CottageBookingRecord,
  OrderRecord,
  TableBookingRecord,
  WhatsAppBroadcastRecord,
} from "@/lib/types";

type Tab = "orders" | "tables" | "cottages" | "catering" | "marketing";
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

  const [waConfigured, setWaConfigured] = useState(false);
  const [broadcasts, setBroadcasts] = useState<WhatsAppBroadcastRecord[]>([]);
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());
  const [templateName, setTemplateName] = useState("");
  const [languageCode, setLanguageCode] = useState("en");
  const [bodyParamsText, setBodyParamsText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    const [o, t, c, k, w] = await Promise.all([
      fetch("/api/orders"),
      fetch("/api/table-booking"),
      fetch("/api/cottage-booking"),
      fetch("/api/catering"),
      fetch("/api/admin/whatsapp"),
    ]);

    if ([o, t, c, k, w].some((r) => r.status === 401)) {
      setAuth("signed-out");
      setLoading(false);
      return;
    }

    const [oj, tj, cj, kj, wj] = await Promise.all([o.json(), t.json(), c.json(), k.json(), w.json()]);
    setOrders(oj.orders ?? []);
    setTables(tj.bookings ?? []);
    setCottages(cj.bookings ?? []);
    setCatering(kj.leads ?? []);
    setWaConfigured(Boolean(wj.configured));
    setBroadcasts(wj.broadcasts ?? []);
    setAuth("signed-in");
    setLoading(false);
  }

  // Every customer we hold a phone number for, deduped, as candidate WhatsApp recipients.
  const customers = new Map<string, string>();
  for (const o of orders) customers.set(o.customer.phone, o.customer.name);
  for (const t of tables) customers.set(t.customer.phone, t.customer.name);
  for (const c of cottages) customers.set(c.customer.phone, c.customer.name);
  for (const k of catering) customers.set(k.phone, k.name);
  const customerList = [...customers.entries()].map(([phone, name]) => ({ phone, name }));

  function toggleRecipient(phone: string) {
    setSelectedPhones((prev) => {
      const next = new Set(prev);
      if (next.has(phone)) next.delete(phone);
      else next.add(phone);
      return next;
    });
  }

  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    setSendError(null);
    setSending(true);
    try {
      const bodyParams = bodyParamsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: [...selectedPhones],
          templateName,
          languageCode,
          bodyParams: bodyParams.length ? bodyParams : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendError(data.error ?? "Send failed.");
        return;
      }
      setBroadcasts((prev) => [data.broadcast, ...prev]);
      setSelectedPhones(new Set());
    } finally {
      setSending(false);
    }
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
    setBroadcasts([]);
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
    { id: "marketing", label: "WhatsApp Marketing", count: broadcasts.length },
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
          {tab === "marketing" && (
            <MarketingTab
              customers={customerList}
              selectedPhones={selectedPhones}
              onToggle={toggleRecipient}
              onSelectAll={() => setSelectedPhones(new Set(customerList.map((c) => c.phone)))}
              onClearSelection={() => setSelectedPhones(new Set())}
              templateName={templateName}
              onTemplateNameChange={setTemplateName}
              languageCode={languageCode}
              onLanguageCodeChange={setLanguageCode}
              bodyParamsText={bodyParamsText}
              onBodyParamsTextChange={setBodyParamsText}
              onSubmit={handleSendBroadcast}
              sending={sending}
              sendError={sendError}
              configured={waConfigured}
              broadcasts={broadcasts}
            />
          )}
        </div>
      )}
    </div>
  );
}

function MarketingTab({
  customers,
  selectedPhones,
  onToggle,
  onSelectAll,
  onClearSelection,
  templateName,
  onTemplateNameChange,
  languageCode,
  onLanguageCodeChange,
  bodyParamsText,
  onBodyParamsTextChange,
  onSubmit,
  sending,
  sendError,
  configured,
  broadcasts,
}: {
  customers: { phone: string; name: string }[];
  selectedPhones: Set<string>;
  onToggle: (phone: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  templateName: string;
  onTemplateNameChange: (v: string) => void;
  languageCode: string;
  onLanguageCodeChange: (v: string) => void;
  bodyParamsText: string;
  onBodyParamsTextChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  sendError: string | null;
  configured: boolean;
  broadcasts: WhatsAppBroadcastRecord[];
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-lb-red/10 border border-lb-red/30 text-sm text-lb-red-deep px-4 py-3">
        Marketing messages must use a WhatsApp template pre-approved by Meta, and can only go to
        customers who&apos;ve opted in to receive them — sending unsolicited bulk messages violates
        WhatsApp&apos;s Business Policy and risks the number being banned. This sends the exact
        template name and variables you enter below; it never sends free-text bulk messages.
      </div>

      {!configured && (
        <div className="rounded-xl bg-lb-charcoal/5 border border-lb-charcoal/15 text-sm px-4 py-3">
          WhatsApp API isn&apos;t configured on this server yet. Set{" "}
          <code className="font-mono text-xs">WHATSAPP_ACCESS_TOKEN</code> and{" "}
          <code className="font-mono text-xs">WHATSAPP_PHONE_NUMBER_ID</code> (from a Meta WhatsApp
          Business Cloud API app) in the environment, then reload this page.
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide">
            Recipients ({selectedPhones.size} selected of {customers.length})
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border border-lb-charcoal/20"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border border-lb-charcoal/20"
            >
              Clear
            </button>
          </div>
        </div>
        {customers.length === 0 ? (
          <p className="text-sm text-lb-neutral py-4">
            No customer phone numbers yet — they show up here once orders, bookings, or catering
            leads come in.
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto border border-lb-charcoal/10 rounded-lg divide-y divide-lb-charcoal/5">
            {customers.map((c) => (
              <label key={c.phone} className="flex items-center gap-3 px-4 py-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPhones.has(c.phone)}
                  onChange={() => onToggle(c.phone)}
                />
                <span>
                  {c.name} · {c.phone}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Template name</label>
          <input
            type="text"
            required
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            placeholder="e.g. weekend_offer"
            className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-2.5 text-sm"
          />
          <p className="text-xs text-lb-neutral mt-1">
            Must exactly match a template already approved in Meta Business Manager.
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Language code</label>
          <input
            type="text"
            value={languageCode}
            onChange={(e) => onLanguageCodeChange(e.target.value)}
            placeholder="en"
            className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Template body variables (comma-separated, optional)
          </label>
          <input
            type="text"
            value={bodyParamsText}
            onChange={(e) => onBodyParamsTextChange(e.target.value)}
            placeholder="e.g. 20% off, Sunday"
            className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-2.5 text-sm"
          />
          <p className="text-xs text-lb-neutral mt-1">
            Fills the template&apos;s {"{{1}}"}, {"{{2}}"}, … placeholders in order, if it has any.
          </p>
        </div>
        {sendError && <p className="text-sm text-lb-red">{sendError}</p>}
        <button
          type="submit"
          disabled={sending || !configured || selectedPhones.size === 0 || !templateName}
          className="rounded-full bg-lb-red text-lb-cream px-6 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {sending ? "Sending…" : `Send to ${selectedPhones.size} recipient(s)`}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-sm uppercase tracking-wide mb-3">Send History</h2>
        {broadcasts.length === 0 ? (
          <p className="text-sm text-lb-neutral">No broadcasts sent yet.</p>
        ) : (
          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div key={b.id} className="border border-lb-charcoal/10 rounded-lg px-4 py-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{b.templateName}</span>
                  <span className="text-xs text-lb-neutral">
                    {new Date(b.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-lb-neutral">
                  {b.successCount}/{b.recipientCount} delivered to the API successfully
                  {b.failureCount > 0 ? `, ${b.failureCount} failed` : ""}.
                </p>
                {b.failureCount > 0 && (
                  <ul className="mt-1.5 text-xs text-lb-red space-y-0.5">
                    {b.results
                      .filter((r) => !r.ok)
                      .map((r) => (
                        <li key={r.to}>
                          {r.to}: {r.error}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
