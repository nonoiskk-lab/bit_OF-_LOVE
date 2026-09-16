"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { COTTAGES } from "@/lib/cottages-data";
import { formatPrice } from "@/lib/utils";
import FoodImage from "@/components/ui/FoodImage";

export default function PrivateCottages() {
  return (
    <section id="cottages" className="px-5 md:px-8 py-20 md:py-28 bg-lb-cream-soft">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
            09 — Private Cottages
          </p>
          <h2 className="font-display font-black uppercase text-5xl sm:text-6xl leading-[0.9]">
            Your Table.
            <br />
            Your Space.
            <br />
            Your Moment.
          </h2>
          <p className="mt-5 text-lb-neutral">
            Two private cottages for dates, birthdays, anniversaries and quiet
            celebrations — away from the main floor, entirely yours for the evening.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-8">
          {COTTAGES.map((cottage, i) => (
            <motion.div
              key={cottage.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden bg-lb-off-white"
            >
              <FoodImage mood="romantic" ratio="wide" icon="🏡" label={cottage.name} />
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display font-bold uppercase text-xl">{cottage.name}</h3>
                  <span className="font-number text-lb-red font-semibold">
                    {formatPrice(cottage.price)}
                    <span className="text-xs text-lb-neutral font-body"> /session</span>
                  </span>
                </div>
                <p className="text-sm text-lb-neutral mt-2">{cottage.description}</p>
                <p className="text-xs text-lb-neutral/80 mt-3">
                  Up to {cottage.capacity} guests · min {cottage.minDurationMinutes} mins
                </p>
                <Link
                  href={`/cottages?select=${cottage.id}`}
                  className="mt-5 inline-flex rounded-full bg-lb-red text-lb-cream px-6 py-3 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
                >
                  Book {cottage.name}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
