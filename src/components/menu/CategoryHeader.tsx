import { MenuCategory } from "@/lib/types";

export function AvailabilityBadge({ availability }: { availability?: string }) {
  if (!availability) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-lb-cream-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-lb-charcoal/80">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Available </span>
      {availability}
    </span>
  );
}

/** Category heading on the menu page: number, the sheet's section, title, timing and line. */
export default function CategoryHeader({ category }: { category: MenuCategory }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-8 mb-8">
      <span
        aria-hidden="true"
        className="font-number text-5xl md:text-7xl text-lb-charcoal/10 font-bold leading-none"
      >
        {category.number}
      </span>
      <div className="min-w-0">
        {category.section && (
          <p className="font-number text-[11px] md:text-xs tracking-[0.25em] uppercase text-lb-red mb-2">
            {category.section}
          </p>
        )}
        <h3 className="font-display font-bold uppercase text-2xl md:text-3xl break-words">
          {category.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <AvailabilityBadge availability={category.availability} />
          <p className="text-lb-neutral text-sm md:text-base">{category.emotionalLine}</p>
        </div>
      </div>
    </div>
  );
}
