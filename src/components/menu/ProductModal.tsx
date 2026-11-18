"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { askPriceWhatsAppUrl, formatPrice, itemPriceLabel } from "@/lib/utils";
import MenuItemImage from "@/components/menu/MenuItemImage";
import { ImageMood } from "@/components/ui/FoodImage";
import { DietDot, Pill } from "@/components/ui/Badge";
import { MenuItem } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { MENU } from "@/lib/menu-data";
import { AvailabilityBadge } from "@/components/menu/CategoryHeader";

interface ProductModalProps {
  item: (MenuItem & { categoryTitle: string }) | null;
  mood: ImageMood;
  onClose: () => void;
}

export default function ProductModal({ item, mood, onClose }: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const availability = item ? MENU.find((c) => c.title === item.categoryTitle)?.availability : undefined;

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
                <MenuItemImage
                  item={item}
                  mood={mood}
                  ratio="wide"
                  context={item.categoryTitle}
                  icon={item.datePick ? "❤️" : "🍽"}
                  sizes="(min-width: 768px) 384px, 100vw"
                  priority
                  className="md:h-full md:aspect-auto md:min-h-[22rem]"
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
                  {item.popular && !item.hero && !item.datePick && (
                    <Pill tone="cream">🔥 Popular</Pill>
                  )}
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
                {availability && (
                  <div className="mb-4">
                    <AvailabilityBadge availability={availability} />
                  </div>
                )}
                <p className="text-sm text-lb-neutral mb-6">
                  {item.description ?? "Made fresh to order at LOVBITES, Hirapur."}
                </p>

                {item.askPrice ? (
                  <div className="mt-auto">
                    <p className="font-number text-2xl font-bold text-lb-red mb-5">{itemPriceLabel(item)}</p>
                    <a
                      href={askPriceWhatsAppUrl(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
                    >
                      Ask for Price on WhatsApp
                    </a>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
