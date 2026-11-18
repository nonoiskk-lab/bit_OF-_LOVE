import { MENU_IMAGE_MANIFEST } from "./menu-images.generated";

export interface MenuImageEntry {
  /** Public path, e.g. /menu/butter-chicken-half.jpg */
  src: string;
  /** Intrinsic size read at build time (null if it couldn't be read). */
  width: number | null;
  height: number | null;
  /** CSS object-position: automatic (salient-region detection) or from the filename. */
  focus: string;
}

/** Variant suffixes that belong to one dish (Half/Full, Small/Large, 4/8 Pcs). */
const VARIANT_SUFFIX = /-(half|full|small|medium|large|\d+-pcs?)$/;

/**
 * Photo for a menu item, if one has been added to public/menu/.
 * An exact id match wins; otherwise a photo named after the dish (without the
 * Half/Full or Small/Large suffix) is shared by all its variants — the same dish,
 * so it's the same photo. Different dishes never share a photo.
 */
export function getMenuImage(itemId: string): MenuImageEntry | undefined {
  return MENU_IMAGE_MANIFEST[itemId] ?? MENU_IMAGE_MANIFEST[itemId.replace(VARIANT_SUFFIX, "")];
}
