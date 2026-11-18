import clsx from "clsx";
import SmartImage, { FrameRatio } from "./SmartImage";

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
  bold: "from-[#f0806a] via-[#d6331c] to-[#7c1c10]",
  elegant: "from-[#4a2e26] via-[#2a1815] to-[#160d0b]",
  playful: "from-[#f6c9d0] via-[#e88fa0] to-[#c65670]",
  romantic: "from-[#e3696a] via-[#a82712] to-[#3d0f08]",
  hero: "from-[#d6331c] via-[#8f2113] to-[#1c1714]",
};

interface FoodImageProps {
  mood?: ImageMood;
  label?: string;
  icon?: string;
  className?: string;
  ratio?: "square" | "card" | "portrait" | "wide" | "cinematic" | "auto";
  /** Real photo. When set it auto-fits the frame; the art-directed placeholder is the fallback. */
  src?: string | null;
  alt?: string;
  /** CSS object-position for the photo's crop, e.g. "50% 30%". */
  focus?: string;
  sizes?: string;
  priority?: boolean;
}

const FRAME: Record<NonNullable<FoodImageProps["ratio"]>, FrameRatio> = {
  square: "square",
  card: "card",
  portrait: "portrait",
  wide: "wide",
  cinematic: "cinematic",
  auto: "fill",
};

/** Art-directed, non-photographic placeholder (no stock or AI food imagery). */
function Placeholder({ mood, icon, label }: { mood: ImageMood; icon: string; label?: string }) {
  return (
    <div aria-hidden="true" className={clsx("absolute inset-0 bg-gradient-to-br", MOOD_GRADIENTS[mood])}>
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl md:text-6xl opacity-70 drop-shadow-lg select-none">{icon}</span>
      </div>
      {label && (
        <span className="absolute bottom-3 left-3 font-body text-[10px] tracking-[0.2em] uppercase text-white/70">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Every food/brand image frame on the site. With `src` it renders the photo through
 * SmartImage (auto-fit, cover crop, AVIF/WebP, lazy loading); without one — or if the
 * file fails to load — it shows the art-directed placeholder, so a frame is never empty.
 */
export default function FoodImage({
  mood = "bold",
  label,
  icon = "🍽",
  className,
  ratio = "square",
  src,
  alt = "",
  focus,
  sizes,
  priority,
}: FoodImageProps) {
  return (
    <SmartImage
      src={src}
      alt={alt}
      ratio={FRAME[ratio]}
      focus={focus}
      sizes={sizes}
      priority={priority}
      className={className}
      fallback={<Placeholder mood={mood} icon={icon} label={label} />}
    />
  );
}
