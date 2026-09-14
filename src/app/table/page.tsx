"use client";

import { useState } from "react";
import Link from "next/link";
import { SLOT_TIMES } from "@/lib/cottages-data";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
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
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) {
      setError("Please choose a time.");
      return;
    }
    setError(null);
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
        return;
      }
      setConfirmedId(data.booking.id);
    } catch {
      setError("Something went wrong. Please try again.");
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
            <label className="block text-sm font-semibold mb-1.5">Date</label>
            <input
              type="date"
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Guests</label>
            <input
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
          <label className="block text-sm font-semibold mb-2">Time</label>
          <div className="flex flex-wrap gap-2">
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
          <label className="block text-sm font-semibold mb-2">Seating</label>
          <div className="flex gap-2">
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
            <label className="block text-sm font-semibold mb-1.5">Full Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Phone</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Special Request (optional)</label>
          <textarea
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
          />
        </div>

        {error && <p className="text-sm text-lb-red">{error}</p>}

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
