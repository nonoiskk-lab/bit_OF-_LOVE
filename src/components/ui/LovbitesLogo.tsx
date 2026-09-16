import { Baloo_2 } from "next/font/google";
import clsx from "clsx";

/**
 * Brand wordmark, recreated from the supplied LOVBITES logo reference
 * (heart-with-face-and-fork "o" in "Lov", rounded red wordmark).
 * This is a faithful recreation, not the original vector file — if the
 * real SVG/PNG asset exists, swap it in here instead of this markup.
 */
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-baloo",
});

interface LovbitesLogoProps {
  size?: "sm" | "lg";
  showTagline?: boolean;
  align?: "center" | "start";
  className?: string;
}

const SIZE = {
  sm: { text: "text-2xl md:text-3xl", icon: "h-7 w-7 md:h-8 md:w-8", tagline: "text-[10px]" },
  lg: {
    text: "text-6xl sm:text-7xl md:text-8xl",
    icon: "h-14 w-14 sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]",
    tagline: "text-base md:text-lg tracking-[0.04em]",
  },
} as const;

export default function LovbitesLogo({
  size = "lg",
  showTagline = true,
  align = "center",
  className,
}: LovbitesLogoProps) {
  const s = SIZE[size];
  return (
    <div
      className={clsx(
        "flex flex-col",
        align === "center" ? "items-center" : "items-start",
        baloo.variable,
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center font-extrabold text-lb-red leading-none",
          s.text
        )}
        style={{ fontFamily: "var(--font-baloo)" }}
      >
        <span>L</span>
        <HeartMark className={clsx(s.icon, "mx-[0.01em] -translate-y-[0.03em]")} />
        <span>vBites</span>
      </div>
      {showTagline && (
        <p
          className={clsx("mt-3 text-lb-charcoal/70 font-normal", s.tagline)}
          style={{ fontFamily: "var(--font-body)" }}
        >
          Cafe &amp; Kitchen <span className="text-lb-red/50 mx-2">|</span> 8 AM Onwards
        </p>
      )}
    </div>
  );
}

function HeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {/* plump heart body */}
      <path
        d="M16 28.5C9.5 23.2 2 17.2 2 10.2 2 5.3 5.7 1.5 10.4 1.5c2.6 0 5 1.2 6.6 3.1 1.6-1.9 4-3.1 6.6-3.1C28.3 1.5 32 5.3 32 10.2c0 7-7.5 13-14 18.3l-1 .8-1-.8z"
        fill="currentColor"
        className="text-lb-red"
        transform="translate(-1 0)"
      />
      {/* closed happy eyes */}
      <path
        d="M9.6 12.6c.9-1 2.5-1 3.4 0M18.6 12.6c.9-1 2.5-1 3.4 0"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* smile */}
      <path
        d="M10.5 16.8c1.3 1.5 3.2 2.3 5 2.3s3.7-.8 5-2.3"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* fork peeking out bottom-right, tilted */}
      <g
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        transform="rotate(22 22 21)"
      >
        <path d="M22 17v10" />
        <path d="M19.8 17v3.2M22 17v3.2M24.2 17v3.2" />
      </g>
    </svg>
  );
}
