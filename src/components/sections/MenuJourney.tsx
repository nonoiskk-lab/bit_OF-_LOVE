"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NAV_GROUP_ORDER, NAV_GROUP_LABELS } from "@/lib/menu-data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function MenuJourney() {
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-lb-off-white">
      <SectionHeading
        eyebrow="07 — The Full Menu"
        title="One Menu. Every Craving."
        subtitle="146 dishes, organized so you never have to scroll blindly. Pick a category, or let your mood decide."
        className="mb-12 md:mb-14"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {NAV_GROUP_ORDER.map((group, i) => (
          <motion.div
            key={group}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <Link
              href={`/menu?group=${group}`}
              className="group flex flex-col justify-between h-28 md:h-32 rounded-xl border border-lb-charcoal/10 bg-lb-cream-soft p-4 hover:border-lb-red hover:bg-lb-red hover:text-lb-cream transition-colors duration-300"
            >
              <span className="font-number text-xs opacity-50 group-hover:opacity-80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display font-bold uppercase text-sm md:text-base leading-tight">
                {NAV_GROUP_LABELS[group]}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/menu"
          className="inline-flex rounded-full bg-lb-charcoal text-lb-cream px-8 py-4 text-sm font-semibold hover:bg-lb-charcoal-soft transition-colors"
        >
          Open Full Digital Menu
        </Link>
      </div>
    </section>
  );
}
