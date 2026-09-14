import clsx from "clsx";
import { Diet } from "@/lib/types";

export function DietDot({ diet }: { diet: Diet }) {
  const color =
    diet === "veg" ? "border-lb-green" : diet === "egg" ? "border-lb-gold-muted" : "border-lb-red";
  const dot = diet === "veg" ? "bg-lb-green" : diet === "egg" ? "bg-lb-gold-muted" : "bg-lb-red";
  return (
    <span
      className={clsx("inline-flex h-3.5 w-3.5 items-center justify-center border", color)}
      title={diet === "veg" ? "Veg" : diet === "egg" ? "Contains egg" : "Non-veg"}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", dot)} />
    </span>
  );
}

export function Pill({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "red" | "cream";
}) {
  const toneClass =
    tone === "red"
      ? "bg-lb-red text-lb-cream"
      : tone === "cream"
      ? "bg-lb-cream text-lb-charcoal"
      : "bg-lb-charcoal text-lb-cream";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        toneClass
      )}
    >
      {children}
    </span>
  );
}
