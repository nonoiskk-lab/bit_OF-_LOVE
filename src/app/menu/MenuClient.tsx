"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MENU, NAV_GROUP_ORDER, NAV_GROUP_LABELS } from "@/lib/menu-data";
import { MenuItem, NavGroup } from "@/lib/types";
import CategoryRail from "@/components/menu/CategoryRail";
import ProductCard from "@/components/menu/ProductCard";
import ProductModal from "@/components/menu/ProductModal";
import { ImageMood } from "@/components/ui/FoodImage";
import Link from "next/link";

interface MenuClientProps {
  initialGroup?: string;
  mood?: string;
}

type SelectedItem = (MenuItem & { categoryTitle: string }) | null;

export default function MenuClient({ initialGroup, mood }: MenuClientProps) {
  const [active, setActive] = useState<string>(initialGroup ?? NAV_GROUP_ORDER[0]);
  const [selected, setSelected] = useState<SelectedItem>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const grouped = useMemo(() => {
    const map = new Map<NavGroup, typeof MENU>();
    for (const group of NAV_GROUP_ORDER) map.set(group, []);
    for (const category of MENU) {
      map.get(category.navGroup)?.push(category);
    }
    return map;
  }, []);

  const datePicks = useMemo(
    () =>
      MENU.flatMap((c) =>
        c.items
          .filter((i) => i.datePick)
          .map((i) => ({ ...i, categoryTitle: c.title, catMood: c.mood }))
      ),
    []
  );

  const scrollToGroup = (group: string) => {
    const el = sectionRefs.current[group];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 152;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    if (initialGroup) {
      requestAnimationFrame(() => scrollToGroup(initialGroup));
    }
  }, [initialGroup]);

  useEffect(() => {
    if (mood === "date") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.getAttribute("data-group") ?? active);
          }
        }
      },
      { rootMargin: "-160px 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  if (mood === "date") {
    return (
      <div className="pt-16 md:pt-20">
        <div className="px-5 md:px-8 py-14 md:py-20 bg-gradient-to-b from-lb-charcoal to-[#3a1410] text-lb-cream text-center">
          <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-cream/50 mb-3">
            Curated for two
          </p>
          <h1 className="font-display font-black uppercase text-4xl sm:text-5xl mb-4">
            The Date Night Picks
          </h1>
          <p className="text-lb-cream/70 max-w-md mx-auto mb-2">
            Everything LOVBITES has built for a date — pair it with a private cottage.
          </p>
          <Link href="/cottages" className="underline text-sm font-semibold">
            Book a cottage for tonight →
          </Link>
        </div>
        <div className="px-5 md:px-8 py-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {datePicks.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              categoryTitle={item.categoryTitle}
              mood={item.catMood as ImageMood}
              onOpen={() => setSelected(item)}
            />
          ))}
        </div>
        <ProductModal
          item={selected}
          mood={(selected && MENU.find((c) => c.title === selected.categoryTitle)?.mood) || "romantic"}
          onClose={() => setSelected(null)}
        />
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      <div className="px-5 md:px-8 pt-10 pb-6 md:pt-14 md:pb-8">
        <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-red mb-3">
          The Digital Menu
        </p>
        <h1 className="font-display font-black uppercase text-4xl sm:text-5xl leading-[0.95]">
          What Do You Feel Like Eating?
        </h1>
      </div>

      <CategoryRail active={active} onSelect={scrollToGroup} />

      {NAV_GROUP_ORDER.map((group) => {
        const categories = grouped.get(group) ?? [];
        if (categories.length === 0) return null;
        return (
          <div
            key={group}
            data-group={group}
            ref={(el) => {
              sectionRefs.current[group] = el;
            }}
            className="px-5 md:px-8 py-14 md:py-20"
          >
            <h2 className="font-display font-black uppercase text-2xl md:text-3xl mb-10 text-lb-neutral/60">
              {NAV_GROUP_LABELS[group]}
            </h2>
            <div className="space-y-16 md:space-y-24">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 mb-8">
                    <span className="font-number text-5xl md:text-7xl text-lb-charcoal/10 font-bold leading-none">
                      {category.number}
                    </span>
                    <div>
                      <h3 className="font-display font-bold uppercase text-2xl md:text-3xl">
                        {category.title}
                      </h3>
                      <p className="text-lb-neutral text-sm md:text-base mt-1">
                        {category.emotionalLine}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {category.items.map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        categoryTitle={category.title}
                        mood={category.mood as ImageMood}
                        onOpen={() => setSelected({ ...item, categoryTitle: category.title })}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <ProductModal
        item={selected}
        mood={(selected && MENU.find((c) => c.title === selected.categoryTitle)?.mood) || "bold"}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
