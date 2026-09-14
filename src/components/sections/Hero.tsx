"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import FoodImage from "@/components/ui/FoodImage";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <FoodImage mood="hero" ratio="auto" className="h-full w-full" icon="🔥" />
        <div className="absolute inset-0 bg-gradient-to-t from-lb-charcoal via-lb-charcoal/40 to-lb-charcoal/10" />
      </motion.div>

      <motion.div
        style={{ opacity, y: textY }}
        className="relative h-full flex flex-col justify-end px-5 md:px-10 pb-24 md:pb-20"
      >
        <p className="font-number text-xs md:text-sm tracking-[0.4em] uppercase text-lb-cream/70 mb-4">
          Hirapur • Dhanbad
        </p>
        <h1 className="font-display font-black uppercase text-lb-cream leading-[0.85] text-[15vw] sm:text-[12vw] md:text-[9vw] lg:text-[8rem]">
          When
          <br />
          Hunger
          <br />
          <span className="text-lb-red">Strikes.</span>
        </h1>

        <div className="mt-8 md:mt-10 flex flex-wrap gap-3 md:gap-4">
          <Link
            href="/order"
            className="rounded-full bg-lb-red px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
          >
            Order Online
          </Link>
          <Link
            href="/table"
            className="rounded-full border border-lb-cream/50 px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-semibold text-lb-cream hover:bg-lb-cream/10 transition-colors"
          >
            Book a Table
          </Link>
          <Link
            href="/cottages"
            className="rounded-full border border-lb-cream/50 px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-semibold text-lb-cream hover:bg-lb-cream/10 transition-colors"
          >
            Private Cottage
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 right-6 hidden md:flex flex-col items-center gap-2 text-lb-cream/60"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="h-10 w-px bg-lb-cream/40" />
      </motion.div>
    </section>
  );
}
