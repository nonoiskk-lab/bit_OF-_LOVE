"use client";

import { motion } from "framer-motion";
import FoodImage, { ImageMood } from "@/components/ui/FoodImage";

const MOODS: ImageMood[] = ["bold", "warm-dark", "romantic", "clean", "playful", "elegant"];
const ICONS = ["🍗", "☕", "❤️", "💪", "🍰", "🍛"];

export default function InstagramWall() {
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-lb-off-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
      >
        <div>
          <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
            13 — Social
          </p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95]">
            @LovbitesDhanbad
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex self-start rounded-full border border-lb-charcoal/20 px-6 py-3 text-sm font-semibold hover:border-lb-red hover:text-lb-red transition-colors"
        >
          Follow LOVBITES
        </a>
      </motion.div>

      <div className="mx-auto max-w-6xl grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {MOODS.map((mood, i) => (
          <FoodImage key={i} mood={mood} ratio="square" icon={ICONS[i]} className="rounded-lg" />
        ))}
      </div>
    </section>
  );
}
