"use client";

import { NAV_GROUP_ORDER, NAV_GROUP_LABELS } from "@/lib/menu-data";
import clsx from "clsx";

interface CategoryRailProps {
  active: string;
  onSelect: (group: string) => void;
}

export default function CategoryRail({ active, onSelect }: CategoryRailProps) {
  return (
    <div className="sticky top-16 md:top-20 z-20 bg-lb-off-white/95 backdrop-blur border-b border-lb-charcoal/10">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 md:px-8 py-3">
        {NAV_GROUP_ORDER.map((group) => (
          <button
            key={group}
            onClick={() => onSelect(group)}
            className={clsx(
              "shrink-0 rounded-full px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wide transition-colors",
              active === group
                ? "bg-lb-red text-lb-cream"
                : "bg-lb-cream-soft text-lb-charcoal hover:bg-lb-cream"
            )}
          >
            {NAV_GROUP_LABELS[group]}
          </button>
        ))}
      </div>
    </div>
  );
}
