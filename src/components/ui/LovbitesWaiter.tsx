"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCartStore, cartCount, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

/**
 * The LOVBITES header "waiter" — a real interface to the existing cart
 * (useCartStore), not a decorative extra. It replaces the old plain
 * cart-icon button: same store, same drawer, same checkout flow.
 *
 * The artwork (public/waiter-full.png, public/waiter-face.png) is cropped
 * from the reference character LovBites supplied — background removed,
 * never redrawn or redistorted, object-fit: contain throughout.
 *
 * On first mount each browser session he plays a short "arriving to take
 * your order" entrance (peek from the left edge -> look -> step in ->
 * greet -> present his note), then settles into a barely-there idle loop.
 * Hover, click and add-to-cart each trigger a small, separate reaction on
 * the same character. Everything funnels through one speech-bubble slot
 * so at most one message shows at a time.
 */

interface LovbitesWaiterProps {
  size?: "sm" | "lg";
  className?: string;
}

// public/waiter-face.png (556x600) is a near-square crop of the same
// background-removed reference character, used at both sizes so it can
// fill a perfectly circular badge (object-fit: cover) without letterboxing.
const BADGE = {
  lg: { diameter: 64, src: "/waiter-face.png", intrinsicW: 556, intrinsicH: 600 },
  sm: { diameter: 40, src: "/waiter-face.png", intrinsicW: 556, intrinsicH: 600 },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const INTRO_SEEN_KEY = "lovbites-waiter-intro-seen";

const RESTING = { x: "0%", y: 0, rotate: 0, scale: 1 };

export default function LovbitesWaiter({ size = "lg", className }: LovbitesWaiterProps) {
  const lines = useCartStore((s) => s.lines);
  const toggle = useCartStore((s) => s.toggle);
  const count = cartCount(lines);
  const total = cartTotal(lines);
  const hasItems = count > 0;

  const prefersReducedMotion = useReducedMotion();
  const bodyControls = useAnimation();
  const prevCount = useRef(count);
  const mounted = useRef(false);
  const [phase, setPhase] = useState<"entering" | "idle">("entering");
  const [justAdded, setJustAdded] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Entrance — plays once per browser session, then settles into idle.
  useEffect(() => {
    let cancelled = false;
    const alreadySeen =
      typeof window !== "undefined" && sessionStorage.getItem(INTRO_SEEN_KEY) === "1";

    async function run() {
      if (prefersReducedMotion || alreadySeen) {
        bodyControls.set(RESTING);
        setPhase("idle");
      } else {
        const compact = size === "sm";
        bodyControls.set({ x: "-70%", y: 5, rotate: -7, scale: 0.9 });
        await bodyControls.start({
          x: "-45%",
          y: 3,
          rotate: -4,
          transition: { duration: compact ? 0.25 : 0.4, ease: EASE },
        });
        if (cancelled) return;
        if (!compact) {
          await bodyControls.start({
            x: "-20%",
            y: 1,
            rotate: -2,
            transition: { duration: 0.4, ease: EASE },
          });
          if (cancelled) return;
        }
        await bodyControls.start({
          ...RESTING,
          transition: { duration: compact ? 0.35 : 0.6, ease: EASE },
        });
        if (cancelled) return;
        await bodyControls.start({
          rotate: [0, 3, -2, 0],
          transition: { duration: 0.45, ease: "easeInOut" },
        });
        if (cancelled) return;
        await bodyControls.start({
          scale: [1, 1.04, 1],
          rotate: [0, -2, 0],
          transition: { duration: 0.4 },
        });
        if (cancelled) return;
        setPhase("idle");
        setShowGreeting(true);
        setTimeout(() => setShowGreeting(false), 2600);
      }
      if (typeof window !== "undefined") sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add-to-cart reaction.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prevCount.current = count;
      return;
    }
    if (count > prevCount.current) {
      setJustAdded(true);
      if (!prefersReducedMotion) {
        bodyControls.start({
          rotate: [0, -4, 3, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 0.5, ease: "easeInOut" },
        });
      }
      const t = setTimeout(() => setJustAdded(false), 2200);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const handleEnter = () => {
    setHovered(true);
    if (size === "lg" && phase === "idle" && !prefersReducedMotion) {
      bodyControls.start({ x: "2%", scale: 1.04, transition: { duration: 0.3, ease: EASE } });
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (size === "lg" && phase === "idle" && !prefersReducedMotion) {
      bodyControls.start({ x: "0%", scale: 1, transition: { duration: 0.3, ease: EASE } });
    }
  };

  const handleClick = () => {
    if (!prefersReducedMotion) {
      bodyControls.start({ rotate: [0, -3, 2, 0], transition: { duration: 0.2 } });
    }
    setTimeout(toggle, prefersReducedMotion ? 0 : 180);
  };

  const badge = BADGE[size];
  const label = hasItems
    ? `Open your order. ${count} item${count === 1 ? "" : "s"} in cart.`
    : "Open your order. Cart is empty.";

  const bubble = justAdded
    ? "Added to your order"
    : showGreeting
      ? "Hi there! Ready to order?"
      : size === "lg" && hovered && phase === "idle" && !hasItems
        ? "Your order"
        : null;

  return (
    <div
      className={`relative flex items-center ${className ?? ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {size === "lg" && hasItems && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={label}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:flex flex-col items-end leading-tight rounded-2xl border border-lb-charcoal/10 bg-white px-3 py-1.5 mr-2 text-right shadow-sm hover:border-lb-red/40 transition-colors"
        >
          <span className="font-number text-[10px] uppercase tracking-[0.15em] text-lb-neutral whitespace-nowrap">
            {count} item{count === 1 ? "" : "s"} &middot; {formatPrice(total)}
          </span>
          <span className="font-display text-[11px] font-bold uppercase text-lb-red">
            View Order
          </span>
        </motion.button>
      )}

      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className="relative flex items-center justify-center rounded-full border border-lb-charcoal/15 bg-white shadow-sm hover:border-lb-red/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lb-red focus-visible:outline-offset-2 transition-colors overflow-hidden"
        style={{ height: badge.diameter, width: badge.diameter }}
      >
        <motion.div
          animate={
            phase === "idle" && !prefersReducedMotion ? { y: [0, -1.5, 0] } : undefined
          }
          transition={
            phase === "idle" && !prefersReducedMotion
              ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          style={{ width: "100%", height: "100%", borderRadius: "9999px", overflow: "hidden" }}
        >
          <motion.div animate={bodyControls} initial={RESTING} className="relative h-full w-full">
            <Image
              src={badge.src}
              alt="LOVBITES waiter — open your order"
              width={badge.intrinsicW}
              height={badge.intrinsicH}
              priority
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
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
        {bubble && (
          <motion.div
            key={bubble}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={`hidden md:block absolute -bottom-9 right-0 z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold shadow-md ${
              justAdded
                ? "bg-lb-charcoal text-lb-cream"
                : "border border-lb-charcoal/10 bg-white text-lb-charcoal"
            }`}
          >
            {bubble} <span className="text-lb-red">&hearts;</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
