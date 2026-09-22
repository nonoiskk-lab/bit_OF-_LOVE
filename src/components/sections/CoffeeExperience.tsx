import MenuPreviewSection from "./MenuPreviewSection";

export default function CoffeeExperience() {
  return (
    <MenuPreviewSection
      number="05"
      eyebrow="Coffee"
      title="Need a Little Boost?"
      subtitle="Black coffee, cold coffee and fresh coolers — whatever the day needs."
      navGroups={["coffee"]}
      mood="warm-dark"
      icon="☕"
      cta="Explore Coffee"
      href="/menu?group=coffee"
      limit={4}
    />
  );
}
