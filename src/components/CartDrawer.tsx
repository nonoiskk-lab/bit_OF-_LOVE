"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { lines, isOpen, close, setQuantity } = useCartStore();
  const total = cartTotal(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-lb-charcoal/50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed right-0 top-0 z-[70] h-full w-full sm:w-[420px] bg-lb-off-white flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-lb-charcoal/10">
              <h2 className="font-display font-bold uppercase text-xl">Your Cart</h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="h-9 w-9 rounded-full border border-lb-charcoal/15 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <span className="text-4xl mb-4">🛍</span>
                <p className="font-display font-bold uppercase text-lg mb-2">
                  Your Cravings Are Waiting
                </p>
                <p className="text-sm text-lb-neutral mb-6">
                  Nothing in your cart yet — go find something to love.
                </p>
                <Link
                  href="/menu"
                  onClick={close}
                  className="rounded-full bg-lb-red px-6 py-3 text-sm font-semibold text-lb-cream"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {lines.map((line) => (
                    <div key={line.item.id} className="flex gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{line.item.name}</p>
                        <p className="text-xs text-lb-neutral">{line.categoryTitle}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(line.item.id, line.quantity - 1)}
                            className="h-7 w-7 rounded-full border border-lb-charcoal/20 text-sm"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="font-number text-sm w-4 text-center">{line.quantity}</span>
                          <button
                            onClick={() => setQuantity(line.item.id, line.quantity + 1)}
                            className="h-7 w-7 rounded-full border border-lb-charcoal/20 text-sm"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="font-number text-sm font-semibold text-lb-red whitespace-nowrap">
                        {formatPrice(line.item.price * line.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-5 border-t border-lb-charcoal/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-lb-neutral">Subtotal</span>
                    <span className="font-number text-lg font-bold">{formatPrice(total)}</span>
                  </div>
                  <Link
                    href="/order"
                    onClick={close}
                    className="flex items-center justify-center rounded-full bg-lb-red px-6 py-3.5 text-sm font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
                  >
                    Go to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
