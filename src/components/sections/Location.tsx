"use client";

import { motion } from "framer-motion";

export default function Location() {
  return (
    <section id="location" className="px-5 md:px-8 py-20 md:py-28 bg-lb-off-white">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-number text-xs md:text-sm tracking-[0.3em] uppercase text-lb-red mb-3">
            15 — Location
          </p>
          <h2 className="font-display font-black uppercase text-4xl sm:text-5xl leading-[0.95] mb-6">
            Find Your Way
            <br />
            to LOVBITES.
          </h2>
          <address className="not-italic text-lb-neutral space-y-1 mb-8">
            <p>LOVBITES</p>
            <p>Hirapur, Dhanbad</p>
            <p>Jharkhand, India</p>
          </address>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Hirapur%2C+Dhanbad%2C+Jharkhand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-lb-charcoal text-lb-cream px-7 py-3.5 text-sm font-semibold hover:bg-lb-charcoal-soft transition-colors"
          >
            Get Directions
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden h-72 md:h-96 border border-lb-charcoal/10"
        >
          <iframe
            title="LOVBITES location map"
            src="https://www.google.com/maps?q=Hirapur,Dhanbad,Jharkhand&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
