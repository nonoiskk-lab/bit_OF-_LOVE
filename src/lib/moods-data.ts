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
    description: "Starters, curries, kebabs — straight to the point.",
    href: "/menu?group=fine-dine",
  },
  {
    id: "fit",
    emoji: "💪",
    label: "I'm Eating Fit",
    description: "Egg-house omelettes, scrambles, protein boosts.",
    href: "/menu?group=protein",
  },
  {
    id: "caffeine",
    emoji: "☕",
    label: "I Need Coffee",
    description: "Masala tea, cappuccino, mocktails and shakes.",
    href: "/menu?group=coffee",
  },
  {
    id: "date",
    emoji: "❤️",
    label: "I'm On a Date",
    description: "Kebabs, signature curries, a cottage for two.",
    href: "/cottages",
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
    description: "Biryani and shareable mains for the table.",
    href: "/menu?group=biryani",
  },
];
