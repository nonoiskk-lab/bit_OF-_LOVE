"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MENU, NAV_GROUP_ORDER, NAV_GROUP_LABELS } from "@/lib/menu-data";
import { MenuItem, NavGroup } from "@/lib/types";
import CategoryRail from "@/components/menu/CategoryRail";
import ProductCard from "@/components/menu/ProductCard";
import ProductModal from "@/components/menu/ProductModal";
import CategoryHeader from "@/components/menu/CategoryHeader";
import { searchMenu } from "@/lib/menu-search";
import { SITE } from "@/lib/site";
import clsx from "clsx";
import { ImageMood } from "@/components/ui/FoodImage";
import Link from "next/link";

interface MenuClientProps {
  initialGroup?: string;
  mood?: string;
}

type SelectedItem = (MenuItem & { categoryTitle: string }) | null;

export default function MenuClient({ initialGroup, mood }: MenuClientProps) {
  const [active, setActive] = useState<string>(initialGroup ?? NAV_GROUP_ORDER[0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedItem>(null);
  const [query, setQuery] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const subRailRef = useRef<HTMLDivElement | null>(null);
  /** While a tab/chip click is smooth-scrolling, don't let scroll tracking flicker the rails. */
  const scrollLock = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockTracking = () => {
    const release = () => {
      if (scrollLock.current) clearTimeout(scrollLock.current);
      scrollLock.current = null;
      window.removeEventListener("scrollend", release);
    };
    if (scrollLock.current) clearTimeout(scrollLock.current);
    // Released when the smooth scroll finishes (scrollend), or after 3 s where unsupported.
    window.addEventListener("scrollend", release, { once: true });
    scrollLock.current = setTimeout(release, 3000);
  };

  const results = useMemo(() => searchMenu(query), [query]);
  const searching = query.trim().length > 0;

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

  /** Scroll so the target sits just below the sticky header + rails, whatever their height. */
  const scrollToElement = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const stickyBottom = stickyRef.current?.getBoundingClientRect().bottom ?? 150;
    const y = el.getBoundingClientRect().top + window.scrollY - stickyBottom - 12;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const scrollToGroup = (group: string) => {
    setActive(group);
    setActiveCategory(grouped.get(group as NavGroup)?.[0]?.id ?? null);
    lockTracking();
    scrollToElement(sectionRefs.current[group]);
  };
  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    lockTracking();
    scrollToElement(document.getElementById(`cat-${id}`));
  };

  const activeCategories = grouped.get(active as NavGroup) ?? [];

  // Keep the active sub-category chip visible inside its horizontal rail.
  useEffect(() => {
    if (!activeCategory) return;
    // Scroll only the rail horizontally (scrollIntoView would also fight the page's own smooth scroll).
    const rail = subRailRef.current;
    const chip = rail?.querySelector<HTMLElement>(`[data-cat="${activeCategory}"]`);
    if (!rail || !chip) return;
    rail.scrollTo({ left: chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [activeCategory]);

  useEffect(() => {
    if (initialGroup) {
      requestAnimationFrame(() => scrollToElement(sectionRefs.current[initialGroup]));
    }
  }, [initialGroup, scrollToElement]);

  // Track which tab and sub-category the reader is in from the scroll position:
  // the last section whose top has passed the bottom of the sticky rails is active.
  useEffect(() => {
    if (mood === "date" || searching) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (scrollLock.current) return;
      const line = (stickyRef.current?.getBoundingClientRect().bottom ?? 150) + 24;
      let group: string | null = null;
      for (const g of NAV_GROUP_ORDER) {
        const el = sectionRefs.current[g];
        if (el && el.getBoundingClientRect().top <= line) group = g;
      }
      let cat: string | null = null;
      document.querySelectorAll<HTMLElement>("[data-category]").forEach((el) => {
        if (el.getBoundingClientRect().top <= line) cat = el.id.replace(/^cat-/, "");
      });
      if (group) setActive(group);
      if (cat) setActiveCategory(cat);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mood, searching]);

  if (mood === "date") {
    return (
      <div className="pt-16 md:pt-20">
        <div className="px-5 md:px-8 py-14 md:py-20 bg-white text-lb-charcoal text-center">
          <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-red mb-3">
            Curated for two
          </p>
          <h1 className="font-display font-black uppercase text-4xl sm:text-5xl mb-4">
            The Date Night Picks
          </h1>
          <p className="text-lb-neutral max-w-md mx-auto mb-2">
            Everything LOVBITES has built for a date — pair it with a private cottage.
          </p>
          <Link href="/cottages" className="underline text-sm font-semibold text-lb-red">
            Book a cottage for tonight →
          </Link>
        </div>
        <div className="px-5 md:px-8 py-12 grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
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
      <div className="px-5 md:px-8 pt-10 pb-6 md:pt-14 md:pb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p className="font-number text-xs tracking-[0.3em] uppercase text-lb-red mb-3">
            The Digital Menu
          </p>
          <h1 className="font-display font-black uppercase text-4xl sm:text-5xl leading-[0.95]">
            What Do You Feel Like Eating?
          </h1>
        </div>
        <div role="search" className="w-full lg:max-w-sm">
          <label htmlFor="menu-search" className="sr-only">
            Search the menu
          </label>
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-lb-neutral">
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes — biryani, paneer, pizza…"
              autoComplete="off"
              className="w-full rounded-full border border-lb-charcoal/15 bg-white pl-11 pr-11 py-3.5 text-base md:text-sm placeholder:text-lb-neutral/80 focus:outline-none focus:border-lb-red focus:ring-2 focus:ring-lb-red/20"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full text-lb-neutral hover:text-lb-red hover:bg-lb-cream-soft"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {searching ? (
        <section aria-live="polite" className="px-5 md:px-8 pb-20">
          <p className="text-sm text-lb-neutral mb-6">
            {results.length === 0
              ? `No dishes match “${query.trim()}”.`
              : `${results.length} dish${results.length === 1 ? "" : "es"} match “${query.trim()}”.`}
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl bg-lb-cream-soft p-8 text-center max-w-lg">
              <p className="font-display font-bold uppercase text-lg mb-2">Can&apos;t find it?</p>
              <p className="text-sm text-lb-neutral mb-5">
                Try a shorter word, or ask us — the kitchen may still make it for you.
              </p>
              <a
                href={`${SITE.whatsappUrl}?text=${encodeURIComponent(`Hi LOVBITES, do you have "${query.trim()}"?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-lb-red px-6 py-3 text-sm font-semibold text-lb-cream hover:bg-lb-red-deep transition-colors"
              >
                Ask on WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map(({ item, category }) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  categoryTitle={category.title}
                  availability={category.availability}
                  mood={category.mood as ImageMood}
                  onOpen={() => setSelected({ ...item, categoryTitle: category.title })}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <div
            ref={stickyRef}
            className="sticky top-16 md:top-20 z-20 bg-lb-off-white/95 backdrop-blur border-b border-lb-charcoal/10"
          >
            <CategoryRail active={active} onSelect={scrollToGroup} />
            {activeCategories.length > 0 && (
              <div
                ref={subRailRef}
                aria-label={`${NAV_GROUP_LABELS[active]} categories`}
                className="relative flex gap-1.5 overflow-x-auto no-scrollbar px-5 md:px-8 pb-3 -mt-1"
              >
                {activeCategories.map((c) => (
                  <button
                    key={c.id}
                    data-cat={c.id}
                    onClick={() => scrollToCategory(c.id)}
                    aria-current={activeCategory === c.id ? "true" : undefined}
                    className={clsx(
                      "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                      activeCategory === c.id
                        ? "border-lb-charcoal bg-lb-charcoal text-lb-cream"
                        : "border-lb-charcoal/15 text-lb-charcoal/80 hover:border-lb-red hover:text-lb-red"
                    )}
                  >
                    {c.title}
                    <span className="ml-1.5 font-number opacity-60">{c.items.length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {NAV_GROUP_ORDER.map((group) => {
            const categories = grouped.get(group) ?? [];
            if (categories.length === 0) return null;
            return (
              <section
                key={group}
                data-group={group}
                aria-labelledby={`group-${group}`}
                ref={(el) => {
                  sectionRefs.current[group] = el;
                }}
                className="px-5 md:px-8 py-14 md:py-20"
              >
                <h2
                  id={`group-${group}`}
                  className="font-display font-black uppercase text-2xl md:text-3xl mb-10 text-lb-neutral/60"
                >
                  {NAV_GROUP_LABELS[group]}
                </h2>
                <div className="space-y-16 md:space-y-24">
                  {categories.map((category) => (
                    <div key={category.id} id={`cat-${category.id}`} data-category className="scroll-mt-48">
                      <CategoryHeader category={category} />
                      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
              </section>
            );
          })}
        </>
      )}

      <ProductModal
        item={selected}
        mood={(selected && MENU.find((c) => c.title === selected.categoryTitle)?.mood) || "bold"}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
