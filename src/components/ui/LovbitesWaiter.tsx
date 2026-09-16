"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCartStore, cartCount, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

/**
 * The LOVBITES header "waiter" — a real interface to the existing cart
 * (useCartStore), not a decorative extra. It replaces the old plain
 * cart-icon button: same store, same drawer, same checkout flow.
 */

interface LovbitesWaiterProps {
  size?: "sm" | "lg";
  className?: string;
}

const DIAMETER: Record<"sm" | "lg", number> = { sm: 40, lg: 64 };

export default function LovbitesWaiter({ size = "lg", className }: LovbitesWaiterProps) {
  const lines = useCartStore((s) => s.lines);
  const toggle = useCartStore((s) => s.toggle);
  const count = cartCount(lines);
  const total = cartTotal(lines);
  const hasItems = count > 0;

  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const prevCount = useRef(count);
  const mounted = useRef(false);
  const [justAdded, setJustAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prevCount.current = count;
      return;
    }
    if (count > prevCount.current) {
      setJustAdded(true);
      if (!prefersReducedMotion) {
        controls.start({
          rotate: [0, -4, 3, 0],
          transition: { duration: 0.5, ease: "easeInOut" },
        });
      }
      const t = setTimeout(() => setJustAdded(false), 2200);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count, controls, prefersReducedMotion]);

  const diameter = DIAMETER[size];
  const label = hasItems
    ? `Open your order. ${count} item${count === 1 ? "" : "s"} in cart.`
    : "Open your order. Cart is empty.";

  return (
    <div
      className={`relative flex items-center ${className ?? ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {size === "lg" && hasItems && (
        <button
          type="button"
          onClick={toggle}
          aria-label={label}
          className="hidden lg:flex flex-col items-end leading-tight rounded-2xl border border-lb-charcoal/10 bg-white px-3 py-1.5 mr-2 text-right shadow-sm hover:border-lb-red/40 transition-colors"
        >
          <span className="font-number text-[10px] uppercase tracking-[0.15em] text-lb-neutral whitespace-nowrap">
            {count} item{count === 1 ? "" : "s"} &middot; {formatPrice(total)}
          </span>
          <span className="font-display text-[11px] font-bold uppercase text-lb-red">
            View Order
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className="relative flex items-center justify-center rounded-full border border-lb-charcoal/15 bg-white shadow-sm hover:border-lb-red/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lb-red focus-visible:outline-offset-2 transition-colors"
        style={{ height: diameter, width: diameter }}
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -1.5, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ width: diameter * 0.72, height: diameter * 0.72 }}
        >
          <motion.div animate={controls} className="h-full w-full">
            <WaiterGlyph />
          </motion.div>
        </motion.div>

        {hasItems && (
          <motion.span
            key={count}
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.08, 1] }}
            transition={{ duration: 0.3 }}
            className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-lb-red text-[10px] font-bold text-lb-cream flex items-center justify-center"
          >
            {count}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {size === "lg" && hovered && !hasItems && !justAdded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute -bottom-9 right-0 whitespace-nowrap rounded-full border border-lb-charcoal/10 bg-white px-3 py-1.5 text-xs font-semibold text-lb-charcoal shadow-md"
          >
            Your order <span className="text-lb-red">&hearts;</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {justAdded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="absolute -bottom-9 right-0 z-10 whitespace-nowrap rounded-full bg-lb-charcoal px-3 py-1.5 text-xs font-semibold text-lb-cream shadow-md"
          >
            Added to your order <span className="text-lb-red">&hearts;</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WaiterGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" role="presentation" aria-hidden="true">
      <path d="M32 10c-8 0-13 6-13 13v3h26v-3c0-7-5-13-13-13z" fill="#2a231f" />
      <circle cx="32" cy="26" r="10" fill="#e7b98c" />
      <circle cx="28.2" cy="25.5" r="1.3" fill="#2a231f" />
      <circle cx="35.8" cy="25.5" r="1.3" fill="#2a231f" />
      <path
        d="M28 30c1.3 1.4 3 2 4 2s2.7-.6 4-2"
        stroke="#a8654a"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 58c0-10.5 8-16.5 18-16.5S50 47.5 50 58"
        fill="#fdfbf7"
        stroke="#e5ddd2"
        strokeWidth="1"
      />
      <path d="M22 42c0-2 4-3.5 10-3.5s10 1.5 10 3.5l-2 16H24z" fill="#d3341f" />
      <path
        d="M32 47.2c-.9-1.1-2.6-1.1-3.3 0-.7 1-.4 2.3.7 3.3l2.6 2.3 2.6-2.3c1.1-1 1.4-2.3.7-3.3-.7-1.1-2.4-1.1-3.3 0z"
        fill="#fdfbf7"
      />
      <circle cx="49" cy="44" r="3.4" fill="#e7b98c" />
      <g transform="translate(50 33) rotate(8)">
        <rect x="0" y="0" width="11" height="14" rx="1.5" fill="#fdfbf7" stroke="#e5ddd2" strokeWidth="1" />
        <rect x="2" y="3" width="7" height="1.3" rx="0.6" fill="#d3341f" />
        <rect x="2" y="6" width="7" height="1" rx="0.5" fill="#cfc6ba" />
        <rect x="2" y="8.4" width="5" height="1" rx="0.5" fill="#cfc6ba" />
      </g>
    </svg>
  );
}
