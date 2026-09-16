"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import LovbitesLogo from "@/components/ui/LovbitesLogo";
import LovbitesWaiter from "@/components/ui/LovbitesWaiter";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/menu?group=protein", label: "Protein" },
  { href: "/menu?group=coffee", label: "Coffee" },
  { href: "/cottages", label: "Cottages" },
  { href: "/catering", label: "Catering" },
  { href: "/#about", label: "About" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-lb-off-white/95 backdrop-blur border-b border-lb-charcoal/10">
        <div className="mx-auto max-w-[1600px] px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" aria-label="LOVBITES home">
            <LovbitesLogo size="sm" showTagline={false} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-body text-sm font-semibold uppercase tracking-wide">
            {LINKS.slice(0, 6).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-lb-red transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/table"
              className="rounded-full border border-lb-charcoal/20 px-5 py-2.5 text-sm font-semibold hover:border-lb-red hover:text-lb-red transition-colors"
            >
              Book a Table
            </Link>
            <Link
              href="/order"
              className="rounded-full bg-lb-red px-5 py-2.5 text-sm font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
            >
              Order Now
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LovbitesWaiter size="sm" />
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="h-10 w-10 flex flex-col items-center justify-center gap-1.5 rounded-full border border-lb-charcoal/15"
            >
              <span
                className={`block h-[2px] w-5 bg-lb-charcoal transition-transform ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-lb-charcoal transition-transform ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>

          <div className="hidden md:flex ml-3">
            <LovbitesWaiter size="lg" />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-white text-lb-charcoal flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display font-extrabold uppercase text-5xl sm:text-6xl leading-[1.05] hover:text-lb-red transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <Link
                href="/cottages"
                onClick={() => setOpen(false)}
                className="rounded-full bg-lb-red px-6 py-3 text-sm font-semibold text-lb-cream"
              >
                Book Private Cottage
              </Link>
              <a
                href="tel:+919031627293"
                className="rounded-full border border-lb-charcoal/20 px-6 py-3 text-sm font-semibold hover:border-lb-red hover:text-lb-red transition-colors"
              >
                Call LOVBITES
              </a>
            </motion.div>
            <p className="mt-10 font-body text-xs uppercase tracking-[0.3em] text-lb-neutral">
              Hirapur • Dhanbad, Jharkhand
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
