"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MENU } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import FoodImage from "@/components/ui/FoodImage";
import { Pill } from "@/components/ui/Badge";

export default function ChickenBasket() {
  const category = MENU.find((c) => c.id === "chicken-basket")!;
  const combo = category.items.find((i) => i.hero)!;
  const rest = category.items.filter((i) => !i.hero);

  return (
    <section className="relative bg-lb-charcoal text-lb-cream px-5 md:px-8 py-20 md:py-28 overflow-hidden">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lb-red/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
              06 — Micro-Brand
            </p>
            <h2 className="font-display font-black uppercase text-5xl sm:text-6xl leading-[0.9]">
              Chicken
              <br />
              Basket
            </h2>
            <p className="mt-4 text-lb-cream/60 max-w-sm">
              Crispy. Grilled. Unapologetic. A street-food-style basket, open evenings
              alongside the full LOVBITES menu.
            </p>
          </div>
          <Link
            href="/menu?group=chicken"
            className="inline-flex self-start rounded-full bg-lb-red px-7 py-3.5 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
          >
            Order the Basket
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 relative rounded-2xl overflow-hidden"
          >
            <FoodImage mood="bold" ratio="portrait" icon="🍗" className="h-full" />
            <div className="absolute top-4 left-4">
              <Pill tone="red">⭐ Hero Combo</Pill>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-lb-charcoal via-lb-charcoal/70 to-transparent p-5">
              <h3 className="font-display font-bold uppercase text-2xl">{combo.name}</h3>
              <p className="text-sm text-lb-cream/70 mt-1">{combo.description}</p>
              <p className="font-number text-xl font-bold text-lb-red mt-2">
                {formatPrice(combo.price)}
              </p>
            </div>
          </motion.div>

          <div className="md:col-span-3 grid grid-cols-2 gap-3 md:gap-4">
            {rest.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl bg-lb-charcoal-soft p-4 flex flex-col justify-between"
              >
                <p className="font-display font-semibold uppercase text-sm leading-snug">
                  {item.name}
                </p>
                <p className="font-number text-lb-red font-semibold mt-3">
                  {formatPrice(item.price)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
