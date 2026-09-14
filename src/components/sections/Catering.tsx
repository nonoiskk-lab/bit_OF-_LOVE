"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const AUDIENCES = [
  "Corporate",
  "College & IIT/University Events",
  "Birthdays",
  "Weddings",
  "Engagements",
  "Private Parties",
  "Gym Events",
  "Seminars & Workshops",
];

export default function Catering() {
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-lb-charcoal text-lb-cream">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
            11 — Catering
          </p>
          <h2 className="font-display font-black uppercase text-5xl sm:text-6xl leading-[0.9] mb-6">
            LOVBITES,
            <br />
            Off-Site.
          </h2>
          <p className="max-w-md text-lb-cream/60 mb-8">
            From a college fest to a corporate seminar, we bring the full LOVBITES
            menu to your event.
          </p>
          <Link
            href="/catering"
            className="inline-flex rounded-full bg-lb-red px-7 py-3.5 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
          >
            Get Catering Quote
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-x-6 gap-y-4 content-center"
        >
          {AUDIENCES.map((a) => (
            <p key={a} className="text-sm text-lb-cream/70 border-b border-lb-cream/10 pb-3">
              {a}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
