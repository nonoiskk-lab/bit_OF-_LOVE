"use client";

import Image from "next/image";
import clsx from "clsx";
import { ReactNode, useState } from "react";

/** Frame shapes used across the site. Every image in a grid shares one frame. */
export type FrameRatio = "square" | "card" | "portrait" | "wide" | "cinematic" | "fill";

export const FRAME_RATIO_CLASS: Record<FrameRatio, string> = {
  square: "aspect-square", // 1:1 tiles
  card: "aspect-[4/3]", // menu cards
  portrait: "aspect-[4/5]", // tall feature tiles
  wide: "aspect-[16/9]", // featured dishes, banners, modal header
  cinematic: "aspect-[21/9]",
  fill: "h-full w-full", // parent decides the size
};

export interface SmartImageProps {
  src?: string | null;
  alt: string;
  ratio?: FrameRatio;
  /** CSS object-position, e.g. "50% 30%". Defaults to centre. */
  focus?: string;
  /** Responsive `sizes` hint so the browser downloads the right width. */
  sizes?: string;
  /** Above-the-fold images: load eagerly with high priority. */
  priority?: boolean;
  /** Rendered when there's no src or the file fails to load — never an empty frame. */
  fallback: ReactNode;
  className?: string;
  imageClassName?: string;
}

/**
 * Smart Image Auto-Fit: any photo — portrait, landscape, square, any resolution —
 * fills 100% of its frame (object-fit: cover), keeps its proportions, is cropped
 * around its focal point, and is served by next/image as AVIF/WebP at the width
 * the device needs. The frame's aspect ratio is fixed by `ratio`, so cards in a
 * grid always line up and nothing shifts while images load.
 */
export default function SmartImage({
  src,
  alt,
  ratio = "card",
  focus = "50% 50%",
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
  priority = false,
  fallback,
  className,
  imageClassName,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={clsx("menu-image-container", FRAME_RATIO_CLASS[ratio], className)}>
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={85}
          onError={() => setFailed(true)}
          className={clsx("menu-image", imageClassName)}
          style={{ objectPosition: focus }}
        />
      ) : (
        <div className="absolute inset-0">{fallback}</div>
      )}
    </div>
  );
}
