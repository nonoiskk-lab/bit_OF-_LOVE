"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO_EDIT } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import FoodImage, { ImageMood } from "@/components/ui/FoodImage";
import { Pill } from "@/components/ui/Badge";
import SectionHeading from "@/components/ui/SectionHeading";

const MOOD_BY_GROUP: Record<string, ImageMood> = {
  breakfast: "bright",
  protein: "clean",
  coffee: "warm-dark",
  chicken: "bold",
  "fine-dine": "elegant",
  biryani: "elegant",
  mocktails: "romantic",
  dessert: "playful",
  combos: "bold",
};

export default function Signatures() {
  return (
    <section className="py-20 md:py-28 bg-lb-off-white">
      <div className="px-5 md:px-8 flex items-end justify-between gap-6 mb-10 md:mb-14">
        <SectionHeading eyebrow="03 — The LOVBITES Edit" title="Twelve Dishes. Zero Doubt." />
        <Link
          href="/menu"
          className="hidden sm:inline-block whitespace-nowrap rounded-full border border-lb-charcoal/20 px-5 py-2.5 text-sm font-semibold hover:border-lb-red hover:text-lb-red transition-colors"
        >
          View Full Menu →
        </Link>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar px-5 md:px-8 pb-2 snap-x snap-mandatory">
        {HERO_EDIT.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className="snap-start shrink-0 w-[70vw] sm:w-[300px] md:w-[320px]"
          >
            <Link href="/menu" className="group block">
              <div className="relative rounded-2xl overflow-hidden">
                <FoodImage
                  mood={MOOD_BY_GROUP[item.navGroup] ?? "bold"}
                  ratio="portrait"
                  icon={item.datePick ? "❤️" : "⭐"}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.hero && <Pill tone="red">⭐ Signature</Pill>}
                  {item.datePick && <Pill tone="dark">❤️ Date Pick</Pill>}
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold uppercase text-base md:text-lg leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-lb-neutral mt-1">{item.categoryTitle}</p>
                </div>
                <span className="font-number font-semibold text-lb-red whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
