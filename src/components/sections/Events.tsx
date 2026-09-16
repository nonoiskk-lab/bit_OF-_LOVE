"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EVENTS = [
  { emoji: "🎂", label: "Birthday" },
  { emoji: "💍", label: "Anniversary" },
  { emoji: "❤️", label: "Date" },
  { emoji: "🏢", label: "Corporate" },
  { emoji: "🎓", label: "College Event" },
  { emoji: "👥", label: "Private Gathering" },
];

export default function Events() {
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-lb-off-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
          12 — Events
        </p>
        <h2 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-12">
          Make It a LOVBITES Moment.
        </h2>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {EVENTS.map((e) => (
            <span
              key={e.label}
              className="inline-flex items-center gap-2 rounded-full border border-lb-charcoal/15 px-5 py-2.5 text-sm font-medium"
            >
              <span>{e.emoji}</span>
              {e.label}
            </span>
          ))}
        </div>

        <Link
          href="/catering"
          className="inline-flex rounded-full bg-lb-red text-lb-cream px-8 py-4 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
        >
          Plan Your Event
        </Link>
      </motion.div>
    </section>
  );
}
