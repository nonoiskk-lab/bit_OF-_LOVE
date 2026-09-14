"use client";

import { motion } from "framer-motion";

/**
 * No reviews are hardcoded here on purpose (brief §67/§103: real reviews only,
 * never fabricated). Wire this up to the Google Business Profile / Zomato API
 * once credentials exist, and it will render real quotes in this same layout.
 */
export default function Reviews() {
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-lb-cream-soft">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
          14 — Reviews
        </p>
        <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] mb-6">
          ★★★★★
        </h2>
        <p className="text-lb-neutral">
          Real LOVBITES reviews will appear here once connected to Google Reviews —
          we don&apos;t publish anything we can&apos;t stand behind.
        </p>
      </motion.div>
    </section>
  );
}
