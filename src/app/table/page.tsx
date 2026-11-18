"use client";

import { useState } from "react";
import Link from "next/link";
import { SLOT_TIMES } from "@/lib/cottages-data";
import WhatsAppFallback from "@/components/ui/WhatsAppFallback";

/** Today's date in India time (YYYY-MM-DD) — same on server and browser, so no
 * hydration mismatch and no "yesterday" bookings between 00:00–05:30 IST. */
function todayStr() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export default function TableBookingPage() {
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState<string | undefined>();
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState<"indoor" | "outdoor">("indoor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) {
      setError("Please choose a time.");
      return;
    }
    setError(null);
    setOffline(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/table-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          guests,
          seating,
          customer: { name, phone },
          specialRequest,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't confirm that booking.");
        setOffline(res.status >= 500);
        return;
      }
      setConfirmedId(data.booking.id);
    } catch {
      setError("We couldn't reach our booking system. Send your booking on WhatsApp or call us instead.");
      setOffline(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedId) {
    return (
      <div className="pt-16 md:pt-20 min-h-[70vh] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-5">🎉</span>
          <h1 className="font-display font-black uppercase text-3xl mb-3">Table Reserved</h1>
          <p className="text-lb-neutral mb-6">
            Booking <span className="font-number font-semibold text-lb-charcoal">{confirmedId}</span>{" "}
            for {guests} guests on {date} at {time}. We&apos;ll call {phone} to confirm.
          </p>
          <Link href="/" className="rounded-full bg-lb-red text-lb-cream px-6 py-3 text-sm font-semibold">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 px-5 md:px-8 py-12 md:py-16 max-w-xl mx-auto">
      <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-red mb-3">Book a Table</p>
      <h1 className="font-display font-black uppercase text-3xl md:text-4xl mb-8">
        Save Your Seat.
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="table-date" className="block text-sm font-semibold mb-1.5">Date</label>
            <input
              id="table-date"
              type="date"
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="table-guests" className="block text-sm font-semibold mb-1.5">Guests</label>
            <input
              id="table-guests"
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <p id="table-time-label" className="block text-sm font-semibold mb-2">Time</p>
          <div role="group" aria-labelledby="table-time-label" className="flex flex-wrap gap-2">
            {SLOT_TIMES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTime(t)}
                className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${
                  time === t ? "border-lb-red bg-lb-red text-lb-cream" : "border-lb-charcoal/15"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p id="table-seating-label" className="block text-sm font-semibold mb-2">Seating</p>
          <div role="group" aria-labelledby="table-seating-label" className="flex gap-2">
            {(["indoor", "outdoor"] as const).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSeating(s)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold capitalize ${
                  seating === s ? "border-lb-red bg-lb-red text-lb-cream" : "border-lb-charcoal/15"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="table-full-name" className="block text-sm font-semibold mb-1.5">Full Name</label>
            <input
              id="table-full-name"
              autoComplete="name"
              maxLength={80}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="table-phone" className="block text-sm font-semibold mb-1.5">Phone</label>
            <input
              id="table-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={16}
              placeholder="10-digit mobile number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="table-special-request-optional" className="block text-sm font-semibold mb-1.5">Special Request (optional)</label>
          <textarea
              id="table-special-request-optional"
              maxLength={600}
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
          />
        </div>

        {error &&
          (offline ? (
            <WhatsAppFallback
              error={error}
              message={[
                "Hi LOVBITES, I'd like to book a table:",
                `Date: ${date}`,
                `Time: ${time ?? "-"}`,
                `Guests: ${guests} (${seating})`,
                `Name: ${name}`,
                `Phone: ${phone}`,
                ...(specialRequest ? [`Request: ${specialRequest}`] : []),
              ].join("\n")}
            />
          ) : (
            <p role="alert" className="text-sm text-lb-red">{error}</p>
          ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "Booking…" : "Confirm Table"}
        </button>
      </form>
    </div>
  );
}
