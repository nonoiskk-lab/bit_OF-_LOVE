"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MOODS } from "@/lib/moods-data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function MoodSelector() {
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-lb-off-white">
      <SectionHeading
        eyebrow="02 — Choose Your Mood"
        title="What's Your Mood?"
        subtitle="LOVBITES isn't one menu. It's a craving, waiting to be matched."
        align="center"
        className="mb-12 md:mb-16"
      />

      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {MOODS.map((mood, i) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link
              href={mood.href}
              className="group block h-full rounded-2xl border border-lb-charcoal/10 bg-lb-cream p-5 md:p-7 hover:border-lb-red hover:shadow-[0_8px_30px_rgba(211,52,31,0.12)] transition-all duration-300"
            >
              <span className="text-4xl md:text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                {mood.emoji}
              </span>
              <h3 className="font-display font-bold uppercase text-lg md:text-xl leading-tight">
                {mood.label}
              </h3>
              <p className="mt-2 text-sm text-lb-neutral">{mood.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
