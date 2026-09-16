import Image from "next/image";
import clsx from "clsx";
import type { CSSProperties } from "react";

/**
 * Real LOVBITES brand mark, cropped from the official reference design
 * (public/logo.png = wordmark + tagline, public/logo-mark.png = wordmark only).
 * Sized via inline style (not Tailwind classes) so the max render size is
 * guaranteed regardless of class purge/ordering — the source is a low-res
 * crop and blows up into visible pixelation if it renders too large.
 */

interface LovbitesLogoProps {
  size?: "sm" | "lg";
  showTagline?: boolean;
  align?: "center" | "start";
  className?: string;
}

const MAX_WIDTH: Record<"sm" | "lg", string> = {
  sm: "clamp(130px, 18vw, 180px)",
  lg: "clamp(280px, 36vw, 460px)",
};

export default function LovbitesLogo({
  size = "lg",
  showTagline = true,
  align = "center",
  className,
}: LovbitesLogoProps) {
  const imgStyle: CSSProperties = {
    width: "100%",
    height: "auto",
    maxWidth: MAX_WIDTH[size],
  };

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
          width={784}
          height={260}
          priority
          style={imgStyle}
        />
      ) : (
        <Image
          src="/logo-mark.png"
          alt="LOVBITES"
          width={784}
          height={188}
          priority
          style={imgStyle}
        />
      )}
    </div>
  );
}
