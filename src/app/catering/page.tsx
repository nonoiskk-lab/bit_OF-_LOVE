"use client";

import { useState } from "react";
import FoodImage from "@/components/ui/FoodImage";

const EVENT_TYPES = [
  "Corporate",
  "College / University",
  "Birthday",
  "Wedding",
  "Engagement",
  "Private Party",
  "Gym Event",
  "Seminar / Workshop",
  "Other",
];

export default function CateringPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [guestCount, setGuestCount] = useState(50);
  const [budget, setBudget] = useState("");
  const [foodPreference, setFoodPreference] = useState<"veg" | "nonveg" | "mixed">("mixed");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          eventDate,
          eventType,
          guestCount,
          budget,
          foodPreference,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-16 md:pt-20">
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <FoodImage mood="bold" ratio="auto" icon="🎉" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-lb-charcoal via-lb-charcoal/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 md:px-8 pb-10 text-lb-cream">
          <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-cream/60 mb-3">
            Catering
          </p>
          <h1 className="font-display font-black uppercase text-4xl sm:text-5xl leading-[0.9]">
            LOVBITES, Off-Site.
          </h1>
        </div>
      </section>

      <div className="px-5 md:px-8 py-12 md:py-16 max-w-2xl mx-auto">
        {submitted ? (
          <div className="text-center py-10">
            <span className="text-5xl block mb-5">🎉</span>
            <h2 className="font-display font-black uppercase text-2xl mb-3">Quote Request Sent</h2>
            <p className="text-lb-neutral">
              Thanks {name || "there"} — our catering team will reach out within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Guest Count</label>
                <input
                  type="number"
                  min={1}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Food Preference</label>
              <div className="flex gap-2">
                {(["veg", "nonveg", "mixed"] as const).map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFoodPreference(f)}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold capitalize ${
                      foodPreference === f
                        ? "border-lb-red bg-lb-red text-lb-cream"
                        : "border-lb-charcoal/15"
                    }`}
                  >
                    {f === "nonveg" ? "Non-Veg" : f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Budget (optional)</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. ₹300 per plate"
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm"
              />
            </div>

            {error && <p className="text-sm text-lb-red">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Get Catering Quote"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
