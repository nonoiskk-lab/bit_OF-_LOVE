"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import FoodImage, { ImageMood } from "@/components/ui/FoodImage";
import { DietDot, Pill } from "@/components/ui/Badge";
import { MenuItem } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

interface ProductModalProps {
  item: (MenuItem & { categoryTitle: string }) | null;
  mood: ImageMood;
  onClose: () => void;
}

export default function ProductModal({ item, mood, onClose }: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const close = () => {
    setQty(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-lb-charcoal/60"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 md:inset-0 z-[70] md:flex md:items-center md:justify-center md:p-6"
          >
            <div className="bg-lb-off-white rounded-t-3xl md:rounded-3xl overflow-hidden w-full md:max-w-3xl md:grid md:grid-cols-2 max-h-[92svh] md:max-h-[85vh] overflow-y-auto">
              <div className="relative">
                <FoodImage
                  mood={mood}
                  ratio="wide"
                  icon={item.datePick ? "❤️" : "🍽"}
                  className="h-56 md:h-full"
                />
                <button
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-lb-off-white/90 flex items-center justify-center"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.hero && <Pill tone="red">⭐ Signature</Pill>}
                  {item.datePick && <Pill tone="dark">❤️ Date Pick</Pill>}
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col">
                <p className="text-xs uppercase tracking-widest text-lb-neutral mb-2">
                  {item.categoryTitle}
                </p>
                <h2 className="font-display font-bold uppercase text-2xl leading-tight mb-2">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <DietDot diet={item.diet} />
                  <span className="text-xs text-lb-neutral capitalize">
                    {item.diet === "nonveg" ? "Non-Veg" : item.diet === "egg" ? "Contains Egg" : "Veg"}
                  </span>
                  {item.protein && <Pill tone="cream">💪 Protein</Pill>}
                </div>
                <p className="text-sm text-lb-neutral mb-6">
                  {item.description ?? "Made fresh to order at LOVBITES, Hirapur."}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-number text-2xl font-bold text-lb-red">
                      {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="h-9 w-9 rounded-full border border-lb-charcoal/20"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="font-number w-5 text-center">{qty}</span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="h-9 w-9 rounded-full border border-lb-charcoal/20"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addItem(item, item.categoryTitle, qty);
                      close();
                    }}
                    className="w-full rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
                  >
                    Add {qty > 1 ? `${qty} ` : ""}to Cart — {formatPrice(item.price * qty)}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
