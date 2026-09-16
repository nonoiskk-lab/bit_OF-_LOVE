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
  className?: string;
}

const SIZE = {
  sm: { text: "text-2xl md:text-3xl", icon: "h-6 w-6 md:h-7 md:w-7", tagline: "text-[10px]" },
  lg: {
    text: "text-6xl sm:text-7xl md:text-8xl",
    icon: "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16",
    tagline: "text-sm md:text-base tracking-[0.15em]",
  },
} as const;

export default function LovbitesLogo({
  size = "lg",
  showTagline = true,
  className,
}: LovbitesLogoProps) {
  const s = SIZE[size];
  return (
    <div className={clsx("flex flex-col items-center", baloo.variable, className)}>
      <div
        className={clsx(
          "flex items-center justify-center font-extrabold text-lb-red leading-none",
          s.text
        )}
        style={{ fontFamily: "var(--font-baloo)" }}
      >
        <span>L</span>
        <HeartMark className={clsx(s.icon, "mx-[0.03em] -translate-y-[0.02em]")} />
        <span>vBites</span>
      </div>
      {showTagline && (
        <p
          className={clsx(
            "mt-3 uppercase text-lb-neutral font-medium tracking-[0.2em]",
            s.tagline
          )}
        >
          Cafe &amp; Kitchen <span className="text-lb-red/60 mx-1.5">|</span> 8 AM Onwards
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
      {/* fork peeking out bottom-right */}
      <g stroke="white" strokeWidth="1.6" strokeLinecap="round">
        <path d="M22.5 18.5v9" />
        <path d="M20.3 18.5v3.2M22.5 18.5v3.2M24.7 18.5v3.2" />
      </g>
    </svg>
  );
}
