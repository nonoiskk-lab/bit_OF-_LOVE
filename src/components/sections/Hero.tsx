"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LovbitesLogo from "@/components/ui/LovbitesLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative min-h-[92svh] flex flex-col items-center justify-center bg-white px-5 py-28 md:py-32 text-center overflow-hidden">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-lb-charcoal/50 mb-8 md:mb-10"
      >
        Hirapur • Dhanbad
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
      >
        <LovbitesLogo size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
        className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-3 md:gap-4"
      >
        <Link
          href="/order"
          className="rounded-full bg-lb-red px-8 py-4 text-sm md:text-base font-semibold text-lb-cream shadow-sm hover:bg-lb-red-deep hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
        >
          Order Online
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/table"
            className="rounded-full border border-lb-charcoal/15 px-6 py-4 text-sm md:text-base font-semibold text-lb-charcoal hover:border-lb-red hover:text-lb-red transition-colors duration-200"
          >
            Book a Table
          </Link>
          <Link
            href="/cottages"
            className="rounded-full border border-lb-charcoal/15 px-6 py-4 text-sm md:text-base font-semibold text-lb-charcoal hover:border-lb-red hover:text-lb-red transition-colors duration-200"
          >
            Private Cottage
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 hidden md:flex flex-col items-center gap-2 text-lb-charcoal/30"
      >
        <span className="h-10 w-px bg-lb-charcoal/20" />
      </motion.div>
    </section>
  );
}
