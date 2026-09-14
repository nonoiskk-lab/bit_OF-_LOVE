"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ALL_ITEMS } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import FoodImage, { ImageMood } from "@/components/ui/FoodImage";
import { DietDot } from "@/components/ui/Badge";
import { NavGroup } from "@/lib/types";

interface MenuPreviewSectionProps {
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  navGroups: NavGroup[];
  mood: ImageMood;
  dark?: boolean;
  cta: string;
  href: string;
  icon?: string;
  limit?: number;
}

export default function MenuPreviewSection({
  number,
  eyebrow,
  title,
  subtitle,
  navGroups,
  mood,
  dark = false,
  cta,
  href,
  icon = "🍽",
  limit = 4,
}: MenuPreviewSectionProps) {
  const items = ALL_ITEMS.filter((i) => navGroups.includes(i.navGroup)).slice(0, limit);

  return (
    <section
      className={`px-5 md:px-8 py-20 md:py-28 ${
        dark ? "bg-lb-charcoal text-lb-cream" : "bg-lb-cream-soft text-lb-charcoal"
      }`}
    >
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className={`font-number text-xs md:text-sm tracking-[0.3em] uppercase mb-3 ${
              dark ? "text-lb-cream/50" : "text-lb-red"
            }`}
          >
            {number} — {eyebrow}
          </p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-[0.95] mb-5">
            {title}
          </h2>
          <p className={`max-w-md mb-8 ${dark ? "text-lb-cream/70" : "text-lb-neutral"}`}>
            {subtitle}
          </p>
          <Link
            href={href}
            className={`inline-flex rounded-full px-7 py-3.5 text-sm font-semibold transition-colors ${
              dark
                ? "bg-lb-red text-lb-cream hover:bg-lb-red-deep"
                : "bg-lb-charcoal text-lb-cream hover:bg-lb-charcoal-soft"
            }`}
          >
            {cta}
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl overflow-hidden"
            >
              <FoodImage mood={mood} ratio="square" icon={icon} />
              <div
                className={`p-3 ${dark ? "bg-lb-charcoal-soft" : "bg-lb-off-white"} rounded-b-xl`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <DietDot diet={item.diet} />
                  <p className="text-xs font-medium truncate">{item.name}</p>
                </div>
                <p className="font-number text-sm font-semibold text-lb-red">
                  {formatPrice(item.price)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
