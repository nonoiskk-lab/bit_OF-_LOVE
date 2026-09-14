export interface MoodCard {
  id: string;
  emoji: string;
  label: string;
  description: string;
  /** query string appended to /menu to land the visitor on the right collection */
  href: string;
}

export const MOODS: MoodCard[] = [
  {
    id: "hungry",
    emoji: "🔥",
    label: "I'm Hungry",
    description: "Burgers, pizza, quick bites — straight to the point.",
    href: "/menu?group=quick-bites",
  },
  {
    id: "fit",
    emoji: "💪",
    label: "I'm Eating Fit",
    description: "Protein bowls, shakes, lean grills.",
    href: "/menu?group=protein",
  },
  {
    id: "caffeine",
    emoji: "☕",
    label: "I Need Coffee",
    description: "From espresso to signature cold coffee.",
    href: "/menu?group=coffee",
  },
  {
    id: "date",
    emoji: "❤️",
    label: "I'm On a Date",
    description: "Red Romance, Date Night Dessert, a cottage for two.",
    href: "/menu?mood=date",
  },
  {
    id: "chicken",
    emoji: "🍗",
    label: "Give Me Chicken",
    description: "Fried chicken, tandoor, the Chicken Basket.",
    href: "/menu?group=chicken",
  },
  {
    id: "celebrate",
    emoji: "🎉",
    label: "I'm Celebrating",
    description: "Combos, thalis, sizzlers for the table.",
    href: "/menu?group=combos",
  },
];
