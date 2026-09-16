import Image from "next/image";
import clsx from "clsx";
import type { CSSProperties } from "react";

/**
 * Real LOVBITES wordmark (public/logo-mark.png, cropped from the official
 * reference design). The tagline is rendered as real text, not baked into
 * the image, so the mark can scale up large for the hero without the small
 * tagline lettering inside a raster crop turning soft.
 */

interface LovbitesLogoProps {
  size?: "sm" | "lg";
  showTagline?: boolean;
  align?: "center" | "start";
  className?: string;
}

const MAX_WIDTH: Record<"sm" | "lg", string> = {
  sm: "clamp(130px, 18vw, 180px)",
  lg: "clamp(340px, 46vw, 620px)",
};

const TAGLINE_SIZE: Record<"sm" | "lg", string> = {
  sm: "text-[10px]",
  lg: "text-base md:text-lg",
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
        "flex flex-col",
        align === "center" ? "items-center" : "items-start",
        className
      )}
    >
      <Image
        src="/logo-mark.png"
        alt="LOVBITES"
        width={784}
        height={188}
        priority
        style={imgStyle}
      />
      {showTagline && (
        <p
          className={clsx(
            "mt-3 text-lb-charcoal/70 font-normal font-body tracking-[0.04em]",
            TAGLINE_SIZE[size]
          )}
        >
          Cafe &amp; Kitchen <span className="text-lb-red/50 mx-2">|</span> 8 AM Onwards
        </p>
      )}
    </div>
  );
}
