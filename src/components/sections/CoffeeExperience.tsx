import MenuPreviewSection from "./MenuPreviewSection";

export default function CoffeeExperience() {
  return (
    <MenuPreviewSection
      number="05"
      eyebrow="Coffee"
      title="Need a Little Boost?"
      subtitle="Masala tea, cappuccino, mocktails and thick shakes — whatever the day needs."
      navGroups={["coffee"]}
      mood="warm-dark"
      icon="☕"
      cta="Explore Beverages"
      href="/menu?group=coffee"
      limit={4}
    />
  );
}
