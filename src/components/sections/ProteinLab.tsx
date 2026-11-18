import MenuPreviewSection from "./MenuPreviewSection";

export default function ProteinLab() {
  return (
    <MenuPreviewSection
      number="04"
      eyebrow="Protein Lab"
      title="Good Food. Stronger Choices."
      subtitle="Egg-house omelettes, scrambles and an extra egg boost — protein-first, all day."
      navGroups={["protein"]}
      mood="clean"
      icon="💪"
      cta="Enter Protein Lab"
      href="/menu?group=protein"
      limit={4}
    />
  );
}
