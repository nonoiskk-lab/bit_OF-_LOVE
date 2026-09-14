import clsx from "clsx";

export type ImageMood =
  | "bright"
  | "clean"
  | "warm-dark"
  | "bold"
  | "elegant"
  | "playful"
  | "romantic"
  | "hero";

const MOOD_GRADIENTS: Record<ImageMood, string> = {
  bright: "from-[#fbe6c2] via-[#f4c98f] to-[#e8a15a]",
  clean: "from-[#dce8d8] via-[#a9c2a0] to-[#5f7a56]",
  "warm-dark": "from-[#6b4530] via-[#432a1e] to-[#1e130d]",
  bold: "from-[#f0806a] via-[#d3341f] to-[#7c1c10]",
  elegant: "from-[#4a2e26] via-[#2a1815] to-[#160d0b]",
  playful: "from-[#f6c9d0] via-[#e88fa0] to-[#c65670]",
  romantic: "from-[#e3696a] via-[#a82712] to-[#3d0f08]",
  hero: "from-[#d3341f] via-[#8f2113] to-[#1c1714]",
};

interface FoodImageProps {
  mood?: ImageMood;
  label?: string;
  icon?: string;
  className?: string;
  ratio?: "square" | "portrait" | "wide" | "cinematic" | "auto";
}

const RATIO: Record<NonNullable<FoodImageProps["ratio"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
  cinematic: "aspect-[21/9]",
  auto: "",
};

/**
 * Art-directed placeholder standing in for real LOVBITES photography.
 * Deliberately not photographic (no AI-generated or stock food imagery,
 * per the brief's anti-pattern list) — swap for the real shoot before launch.
 */
export default function FoodImage({
  mood = "bold",
  label,
  icon = "🍽",
  className,
  ratio = "square",
}: FoodImageProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-gradient-to-br",
        MOOD_GRADIENTS[mood],
        RATIO[ratio],
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl md:text-6xl opacity-70 drop-shadow-lg select-none">
          {icon}
        </span>
      </div>
      {label && (
        <span className="absolute bottom-3 left-3 font-body text-[10px] tracking-[0.2em] uppercase text-white/70">
          {label}
        </span>
      )}
    </div>
  );
}
