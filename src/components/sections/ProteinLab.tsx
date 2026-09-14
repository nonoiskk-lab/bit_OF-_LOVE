import MenuPreviewSection from "./MenuPreviewSection";

export default function ProteinLab() {
  return (
    <MenuPreviewSection
      number="04"
      eyebrow="Protein Lab"
      title="Good Food. Stronger Choices."
      subtitle="Protein breakfasts, power bowls and whey shakes — built for people who train as hard as they eat."
      navGroups={["protein"]}
      mood="clean"
      icon="💪"
      cta="Enter Protein Lab"
      href="/menu?group=protein"
      limit={4}
    />
  );
}
