"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FineDineTransition() {
  return (
    <section className="relative bg-lb-charcoal text-lb-cream px-5 md:px-8 py-28 md:py-36 overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(211,52,31,0.25),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-cream/50 mb-4">
          08 — Fine Dine
        </p>
        <h2 className="font-display font-black uppercase text-5xl sm:text-6xl md:text-7xl leading-[0.9]">
          Now the Night
          <br />
          <span className="text-lb-red">Begins.</span>
        </h2>
        <p className="mt-6 max-w-lg mx-auto text-lb-cream/60">
          Kebabs off the tandoor, slow-cooked curries, sizzlers and biryani —
          LOVBITES after dark.
        </p>
        <Link
          href="/menu?group=fine-dine"
          className="mt-9 inline-flex rounded-full bg-lb-red px-8 py-4 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
        >
          Explore Fine Dine
        </Link>
      </motion.div>
    </section>
  );
}
