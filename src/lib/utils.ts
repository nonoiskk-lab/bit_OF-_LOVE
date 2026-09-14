export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export type MealContext = "morning" | "midday" | "biryani" | "chicken-basket" | "night";

/** Time-based menu logic (brief §48) — purely presentational, never blocks ordering. */
export function getMealContext(date: Date = new Date()): MealContext {
  const hour = date.getHours();
  if (hour >= 8 && hour < 13) return "morning";
  if (hour >= 13 && hour < 17) return "biryani";
  if (hour >= 17 && hour < 23) return "chicken-basket";
  if (hour >= 13 && hour < 24) return "midday";
  return "night";
}

export const MEAL_CONTEXT_COPY: Record<
  MealContext,
  { headline: string; cta: string; href: string }
> = {
  morning: {
    headline: "Good morning, Dhanbad.",
    cta: "Order Breakfast",
    href: "/menu?group=breakfast",
  },
  midday: {
    headline: "When hunger strikes.",
    cta: "Order Online",
    href: "/menu",
  },
  biryani: {
    headline: "Biryani time.",
    cta: "Order Biryani",
    href: "/menu?group=biryani",
  },
  "chicken-basket": {
    headline: "The Chicken Basket is open.",
    cta: "Order Chicken Basket",
    href: "/menu?group=chicken",
  },
  night: {
    headline: "Now the night begins.",
    cta: "Order Fine Dine",
    href: "/menu?group=fine-dine",
  },
};

export function slugToId(slug: string): string {
  return slug.trim().toLowerCase().replace(/\s+/g, "-");
}
