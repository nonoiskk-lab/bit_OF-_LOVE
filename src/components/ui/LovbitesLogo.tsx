import Image from "next/image";
import clsx from "clsx";

/**
 * Real LOVBITES brand mark, cropped from the official reference design
 * (public/logo.png = wordmark + tagline, public/logo-mark.png = wordmark only).
 */

interface LovbitesLogoProps {
  size?: "sm" | "lg";
  showTagline?: boolean;
  align?: "center" | "start";
  className?: string;
}

const SIZE = {
  sm: "h-8 md:h-9",
  lg: "h-16 sm:h-20 md:h-24",
} as const;

export default function LovbitesLogo({
  size = "lg",
  showTagline = true,
  align = "center",
  className,
}: LovbitesLogoProps) {
  return (
    <div
      className={clsx(
        "flex",
        align === "center" ? "justify-center" : "justify-start",
        className
      )}
    >
      {showTagline ? (
        <Image
          src="/logo.png"
          alt="LOVBITES — Cafe & Kitchen | 8 AM Onwards"
          width={392}
          height={130}
          priority
          className={clsx("w-auto", SIZE[size])}
        />
      ) : (
        <Image
          src="/logo-mark.png"
          alt="LOVBITES"
          width={392}
          height={94}
          priority
          className={clsx("w-auto", SIZE[size])}
        />
      )}
    </div>
  );
}
