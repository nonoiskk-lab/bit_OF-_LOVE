"use client";

import { motion } from "framer-motion";

const THREAD = ["Food", "Youth", "Protein", "Coffee", "Community", "Dhanbad"];

export default function BrandStory() {
  return (
    <section id="about" className="px-5 md:px-8 py-20 md:py-28 bg-lb-off-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
          Why LOVBITES?
        </p>
        <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl leading-snug mb-6">
          Not just a place to eat. A food destination.
        </h2>
        <p className="text-lb-neutral max-w-xl mx-auto">
          LOVBITES started as a simple idea: Dhanbad deserved a place where a
          protein bowl, a proper cold coffee and a private table for two could all
          live under one roof. Everything on this menu is built around that.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs uppercase tracking-widest text-lb-neutral/70">
          {THREAD.map((t, i) => (
            <span key={t} className="flex items-center gap-3">
              {t}
              {i < THREAD.length - 1 && <span className="text-lb-red">→</span>}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
