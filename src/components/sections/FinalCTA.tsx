"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FoodImage from "@/components/ui/FoodImage";

export default function FinalCTA() {
  return (
    <section className="relative px-5 md:px-8 py-28 md:py-40 overflow-hidden text-center">
      <FoodImage mood="hero" ratio="auto" className="absolute inset-0" icon="❤️" />
      <div className="absolute inset-0 bg-lb-charcoal/70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-3xl mx-auto"
      >
        <h2 className="font-display font-black uppercase text-lb-cream text-4xl sm:text-5xl md:text-6xl leading-[0.95]">
          When Hunger Strikes,
          <br />
          You Know Where to Go.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
          <Link
            href="/order"
            className="rounded-full bg-lb-red px-7 py-4 text-sm font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
          >
            Order Online
          </Link>
          <Link
            href="/table"
            className="rounded-full border border-lb-cream/50 px-7 py-4 text-sm font-semibold text-lb-cream hover:bg-lb-cream/10 transition-colors"
          >
            Book a Table
          </Link>
          <Link
            href="/cottages"
            className="rounded-full border border-lb-cream/50 px-7 py-4 text-sm font-semibold text-lb-cream hover:bg-lb-cream/10 transition-colors"
          >
            Book Private Cottage
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
