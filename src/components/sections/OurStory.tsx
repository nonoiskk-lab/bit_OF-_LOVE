"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FoodImage from "@/components/ui/FoodImage";

type Block = { text: string; emphasis?: boolean };

const STORY: Block[] = [
  {
    text: "We live in a world that's constantly moving, staring at screens, and rushing to the next thing.",
  },
  { text: "But the best moments in life?", emphasis: true },
  {
    text: "They happen when we slow down, pull up a chair, and actually connect.",
  },
  {
    text: "LovBites wasn't born just to feed you, it was born to bring us back together.",
    emphasis: true,
  },
  {
    text: "We believe that a restaurant shouldn't just be a place you eat; it should be a feeling.",
    emphasis: true,
  },
  {
    text: "It's the spark of a new conversation, the laugh that makes your stomach hurt, and the comfort of sharing great food with your favorite people.",
  },
  {
    text: "Our menu is built for the way we love to eat today: bold, bite-sized, and made for sharing.",
  },
  { text: "Every dish is crafted to be a conversation starter.", emphasis: true },
  { text: "We don't do stuffy, and we don't do boring." },
  {
    text: "We do high energy, incredible flavors, and space where you can truly unplug and be yourself.",
  },
  { text: "When you walk through our doors, you're not just ordering a meal." },
  {
    text: "You're stepping into an atmosphere where the music is right, the energy is electric, and the connection is real.",
    emphasis: true,
  },
];

const PHILOSOPHY = ["Slow Down", "Sit Together", "Share More", "Eat Well", "Feel Something"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function OurStory() {
  return (
    <section className="bg-white px-5 md:px-8 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 md:mb-20"
        >
          <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
            Our Story
          </p>
          <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.95] max-w-2xl">
            The LovBites Story
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="md:sticky md:top-28"
          >
            <div className="group overflow-hidden rounded-2xl">
              <FoodImage
                mood="romantic"
                ratio="portrait"
                icon="❤️"
                label="A real LOVBITES table — photography coming soon"
                className="transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </motion.div>

          <div className="max-w-[600px]">
            {STORY.map((block, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.06, ease: EASE }}
                className={
                  block.emphasis
                    ? "font-display font-semibold text-xl sm:text-2xl leading-snug text-lb-red mb-6"
                    : "text-base md:text-lg leading-relaxed text-lb-charcoal/80 mb-6"
                }
              >
                {block.text}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                href="/order"
                className="rounded-full bg-lb-red px-7 py-3.5 text-sm font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
              >
                Discover LovBites
              </Link>
              <Link
                href="/menu"
                className="rounded-full border border-lb-charcoal/15 px-7 py-3.5 text-sm font-semibold text-lb-charcoal hover:border-lb-red hover:text-lb-red transition-colors"
              >
                View Our Menu
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.92 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20 md:mt-28 flex flex-wrap justify-center items-center gap-x-3 gap-y-3 text-center"
        >
          {PHILOSOPHY.map((word, i) => (
            <span key={word} className="flex items-center gap-3">
              <span className="font-number text-xs md:text-sm tracking-[0.2em] uppercase text-lb-charcoal/60">
                {word}
              </span>
              {i < PHILOSOPHY.length - 1 && <span className="h-1 w-1 rounded-full bg-lb-red" />}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
