import MenuPreviewSection from "./MenuPreviewSection";

export default function CoffeeExperience() {
  return (
    <MenuPreviewSection
      number="05"
      eyebrow="Coffee"
      title="Need a Little Boost?"
      subtitle="From a straight espresso to the Signature Cold Coffee that put LOVBITES on the map."
      navGroups={["coffee"]}
      mood="warm-dark"
      dark
      icon="☕"
      cta="Explore Coffee"
      href="/menu?group=coffee"
      limit={4}
    />
  );
}
