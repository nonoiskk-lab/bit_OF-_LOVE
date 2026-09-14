import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx(align === "center" ? "text-center mx-auto" : "text-left", className)}>
      {eyebrow && (
        <p
          className={clsx(
            "font-number text-xs md:text-sm tracking-[0.3em] uppercase mb-3",
            light ? "text-lb-cream/60" : "text-lb-red"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "font-display font-bold uppercase leading-[0.95] text-4xl sm:text-5xl md:text-6xl",
          light ? "text-lb-cream" : "text-lb-charcoal"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-4 max-w-xl text-base md:text-lg",
            light ? "text-lb-cream/70" : "text-lb-neutral",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
