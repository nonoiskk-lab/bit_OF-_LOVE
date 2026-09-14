"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO_EDIT } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import FoodImage from "@/components/ui/FoodImage";

export default function DateNight() {
  const datePicks = HERO_EDIT.filter((i) => i.datePick);

  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-gradient-to-b from-lb-off-white to-[#fbe9e6]">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
            10 — Date Night
          </p>
          <h2 className="font-display font-black uppercase text-5xl sm:text-6xl leading-[0.9]">
            Plan Your
            <br />
            <span className="text-lb-red">Date.</span>
          </h2>
          <p className="mt-5 max-w-sm text-lb-neutral">
            Red Romance, a shared dessert, a private cottage. Everything LOVBITES
            builds for two.
          </p>
          <Link
            href="/cottages"
            className="mt-8 inline-flex rounded-full bg-lb-red px-7 py-3.5 text-sm font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
          >
            Plan Your Date
          </Link>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {datePicks.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <FoodImage mood="romantic" ratio="portrait" icon="❤️" className="rounded-xl" />
              <p className="mt-3 text-xs md:text-sm font-semibold leading-tight">{item.name}</p>
              <p className="font-number text-lb-red text-sm font-semibold">
                {formatPrice(item.price)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
