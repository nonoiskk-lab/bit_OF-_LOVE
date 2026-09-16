import { Fredoka } from "next/font/google";
import clsx from "clsx";

/**
 * Brand wordmark, recreated from the supplied LOVBITES logo reference
 * (heart-with-face-and-fork "o" in "Lov", rounded red wordmark).
 * This is a faithful recreation, not the original vector file — if the
 * real SVG/PNG asset exists, swap it in here instead of this markup.
 */
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fredoka",
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
    <div className={clsx("flex flex-col items-center", fredoka.variable, className)}>
      <div
        className={clsx(
          "flex items-center justify-center font-bold text-lb-red leading-none",
          s.text
        )}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        <span>L</span>
        <HeartMark className={clsx(s.icon, "mx-[0.02em] translate-y-[0.05em]")} />
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
        className="text-lb-red"
      />
      {/* closed-eye smiling face */}
      <path
        d="M8.7 9.6c.5-.5 1.3-.5 1.8 0M13.5 9.6c.5-.5 1.3-.5 1.8 0"
        stroke="white"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M9 12.4c.9.9 2.1 1.3 3 1.3s2.1-.4 3-1.3"
        stroke="white"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
      {/* peeking fork */}
      <g stroke="white" strokeWidth="0.8" strokeLinecap="round">
        <path d="M16.2 13.2v3.4" />
        <path d="M15.1 13.2v1.6M16.2 13.2v1.6M17.3 13.2v1.6" />
      </g>
    </svg>
  );
}
