"use client";

import { formatPrice } from "@/lib/utils";
import FoodImage, { ImageMood } from "@/components/ui/FoodImage";
import { DietDot, Pill } from "@/components/ui/Badge";
import { MenuItem } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  item: MenuItem;
  categoryTitle: string;
  mood: ImageMood;
  onOpen: () => void;
}

export default function ProductCard({ item, categoryTitle, mood, onOpen }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group rounded-2xl overflow-hidden bg-lb-off-white border border-lb-charcoal/8">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="relative">
          <FoodImage
            mood={mood}
            ratio="square"
            icon={item.datePick ? "❤️" : item.protein ? "💪" : "🍽"}
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {item.hero && <Pill tone="red">⭐ Signature</Pill>}
            {item.datePick && <Pill tone="dark">❤️ Date Pick</Pill>}
            {item.protein && !item.hero && !item.datePick && <Pill tone="cream">💪 Protein</Pill>}
          </div>
        </div>
      </button>
      <div className="p-4">
        <div className="flex items-start gap-2 mb-1">
          <DietDot diet={item.diet} />
          <button onClick={onOpen} className="text-left flex-1">
            <h3 className="font-display font-semibold uppercase text-sm leading-snug">
              {item.name}
            </h3>
          </button>
        </div>
        {item.description && (
          <p className="text-xs text-lb-neutral mb-2 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-number font-semibold text-lb-red">{formatPrice(item.price)}</span>
          <button
            onClick={() => addItem(item, categoryTitle)}
            className="rounded-full bg-lb-red text-lb-cream text-xs font-semibold px-4 py-2 hover:bg-lb-red-deep transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
