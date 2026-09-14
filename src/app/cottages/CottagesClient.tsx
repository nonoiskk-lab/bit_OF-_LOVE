"use client";

import { useEffect, useMemo, useState } from "react";
import { COTTAGES, OCCASIONS, SLOT_TIMES } from "@/lib/cottages-data";
import { CottageBookingRecord, Occasion } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import FoodImage from "@/components/ui/FoodImage";
import clsx from "clsx";

type Step = "date" | "select" | "details" | "confirmed";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function CottagesClient({ initialSelect }: { initialSelect?: string }) {
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState(todayStr());
  const [bookings, setBookings] = useState<CottageBookingRecord[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [cottageId, setCottageId] = useState<string | undefined>(initialSelect);
  const [time, setTime] = useState<string | undefined>();
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState<Occasion>("date");
  const [customRequest, setCustomRequest] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<CottageBookingRecord | null>(null);

  const selectedCottage = COTTAGES.find((c) => c.id === cottageId);

  async function loadAvailability(forDate: string) {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/cottage-booking?date=${forDate}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    // Fetch-on-mount: loads today's cottage availability once when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAvailability(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookedSet = useMemo(
    () => new Set(bookings.map((b) => `${b.cottageId}__${b.time}`)),
    [bookings]
  );

  const availableCottageCount = useMemo(() => {
    return COTTAGES.filter((c) => SLOT_TIMES.some((t) => !bookedSet.has(`${c.id}__${t}`))).length;
  }, [bookedSet]);

  async function handleConfirmDate() {
    await loadAvailability(date);
    setStep("select");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cottageId || !time) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/cottage-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cottageId,
          date,
          time,
          guests,
          occasion,
          customRequest,
          customer: { name, phone, email },
          advancePaid: selectedCottage?.price ?? 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't confirm that booking.");
        if (res.status === 409) {
          await loadAvailability(date);
          setStep("select");
          setTime(undefined);
        }
        return;
      }
      setConfirmed(data.booking);
      setStep("confirmed");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "confirmed" && confirmed) {
    const cottage = COTTAGES.find((c) => c.id === confirmed.cottageId)!;
    const icsBlob = buildICS(confirmed, cottage.name);
    const whatsappText = encodeURIComponent(
      `LOVBITES booking confirmed! ${cottage.name} on ${confirmed.date} at ${confirmed.time} for ${confirmed.guests} guests. Booking ID: ${confirmed.id}`
    );
    return (
      <div className="pt-16 md:pt-20 min-h-[80vh] flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center">
          <span className="text-5xl block mb-5">❤️</span>
          <h1 className="font-display font-black uppercase text-3xl mb-3">Booking Confirmed</h1>
          <div className="text-left bg-lb-cream-soft rounded-2xl p-6 my-6 space-y-2 text-sm">
            <Row label="Booking ID" value={confirmed.id} />
            <Row label="Cottage" value={cottage.name} />
            <Row label="Date" value={confirmed.date} />
            <Row label="Time" value={confirmed.time} />
            <Row label="Guests" value={String(confirmed.guests)} />
            <Row label="Occasion" value={OCCASIONS.find((o) => o.id === confirmed.occasion)?.label ?? confirmed.occasion} />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`data:text/calendar;charset=utf-8,${encodeURIComponent(icsBlob)}`}
              download={`lovbites-${confirmed.id}.ics`}
              className="rounded-full border border-lb-charcoal/20 px-5 py-3 text-sm font-semibold"
            >
              Add to Calendar
            </a>
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-lb-charcoal/20 px-5 py-3 text-sm font-semibold"
            >
              WhatsApp Confirmation
            </a>
            <a
              href={`mailto:?subject=LOVBITES Booking Confirmed&body=${whatsappText}`}
              className="rounded-full border border-lb-charcoal/20 px-5 py-3 text-sm font-semibold"
            >
              Email Confirmation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <FoodImage mood="romantic" ratio="auto" icon="🏡" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-lb-charcoal via-lb-charcoal/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 md:px-8 pb-10 md:pb-14 text-lb-cream">
          <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-cream/60 mb-3">
            Private Cottages
          </p>
          <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.9]">
            Your Table. Your Space.
            <br />
            Your Moment.
          </h1>
        </div>
      </section>

      <div className="px-5 md:px-8 py-12 md:py-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-10 text-xs font-semibold uppercase tracking-wide text-lb-neutral">
          {(["date", "select", "details"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={clsx(
                  "h-6 w-6 rounded-full flex items-center justify-center",
                  step === s ? "bg-lb-red text-lb-cream" : "bg-lb-cream-soft"
                )}
              >
                {i + 1}
              </span>
              <span className={step === s ? "text-lb-charcoal" : ""}>
                {s === "date" ? "Date" : s === "select" ? "Cottage & Time" : "Details"}
              </span>
              {i < 2 && <span className="mx-1 text-lb-neutral/40">—</span>}
            </div>
          ))}
        </div>

        {step === "date" && (
          <div>
            <label className="block text-sm font-semibold mb-2">Select a date</label>
            <input
              type="date"
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm mb-6"
            />
            <button
              onClick={handleConfirmDate}
              className="rounded-full bg-lb-red text-lb-cream px-7 py-3.5 text-sm font-semibold"
            >
              Check Availability
            </button>
          </div>
        )}

        {step === "select" && (
          <div>
            {loadingSlots ? (
              <p className="text-sm text-lb-neutral">Checking availability…</p>
            ) : (
              <>
                <p className="text-sm font-semibold mb-6">
                  {availableCottageCount > 0
                    ? `${availableCottageCount} cottage${availableCottageCount > 1 ? "s" : ""} available on ${date}`
                    : `Both cottages are fully booked on ${date} — try another date.`}
                </p>
                <div className="space-y-6">
                  {COTTAGES.map((cottage) => {
                    const slots = SLOT_TIMES.filter((t) => !bookedSet.has(`${cottage.id}__${t}`));
                    return (
                      <div key={cottage.id} className="rounded-2xl border border-lb-charcoal/10 p-5">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="font-display font-bold uppercase text-lg">{cottage.name}</h3>
                          <span className="font-number text-sm font-semibold text-lb-red">
                            {formatPrice(cottage.price)}
                          </span>
                        </div>
                        <p className="text-xs text-lb-neutral mb-4">
                          Up to {cottage.capacity} guests · {cottage.description}
                        </p>
                        {slots.length === 0 ? (
                          <p className="text-sm text-lb-neutral italic">
                            Looks like this moment is already taken today.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {slots.map((t) => (
                              <button
                                key={t}
                                onClick={() => {
                                  setCottageId(cottage.id);
                                  setTime(t);
                                  setGuests(Math.min(guests, cottage.capacity));
                                  setStep("details");
                                }}
                                className={clsx(
                                  "rounded-full border px-3.5 py-2 text-xs font-semibold",
                                  cottageId === cottage.id && time === t
                                    ? "border-lb-red bg-lb-red text-lb-cream"
                                    : "border-lb-charcoal/15 hover:border-lb-red"
                                )}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <button onClick={() => setStep("date")} className="mt-6 text-sm text-lb-neutral underline">
              Change date
            </button>
          </div>
        )}

        {step === "details" && selectedCottage && time && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl bg-lb-cream-soft p-4 text-sm">
              <strong>{selectedCottage.name}</strong> · {date} · {time}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Guest Count</label>
              <input
                type="number"
                min={1}
                max={selectedCottage.capacity}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    type="button"
                    key={o.id}
                    onClick={() => setOccasion(o.id as Occasion)}
                    className={clsx(
                      "rounded-full border px-3.5 py-2 text-xs font-semibold",
                      occasion === o.id ? "border-lb-red bg-lb-red text-lb-cream" : "border-lb-charcoal/15"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Custom Request (optional)</label>
              <textarea
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                rows={2}
                placeholder="Decoration, cake, dietary notes…"
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
              />
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
              <label className="block text-sm font-semibold mb-1.5">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
              />
            </div>

            {error && <p className="text-sm text-lb-red">{error}</p>}

            <div className="flex items-center justify-between py-4 border-t border-lb-charcoal/10">
              <span className="font-semibold text-sm">Advance to Confirm</span>
              <span className="font-number text-lg font-bold">{formatPrice(selectedCottage.price)}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Confirming…" : "Confirm & Pay Advance"}
            </button>
            <button type="button" onClick={() => setStep("select")} className="w-full text-sm text-lb-neutral underline">
              Change cottage or time
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-lb-neutral">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function buildICS(booking: CottageBookingRecord, cottageName: string) {
  const [time, meridiem] = booking.time.split(" ");
  const [hStr, mStr] = time.split(":");
  let hour = parseInt(hStr, 10) % 12;
  if (meridiem === "PM") hour += 12;
  const start = new Date(`${booking.date}T${String(hour).padStart(2, "0")}:${mStr}:00`);
  const end = new Date(start.getTime() + 90 * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${booking.id}@lovbites`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:LOVBITES — ${cottageName}`,
    `DESCRIPTION:Booking ${booking.id} for ${booking.guests} guests.`,
    "LOCATION:LOVBITES, Hirapur, Dhanbad, Jharkhand",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
