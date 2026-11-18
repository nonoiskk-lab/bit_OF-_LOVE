#!/usr/bin/env node
/**
 * Smart Image Auto-Fit — manifest generator.
 *
 * Drop a photo into public/menu/ named after the menu item's id and it shows up
 * on every card, modal and homepage section for that dish. No resizing or cropping
 * by hand: the site renders it with object-fit: cover into each frame, and this
 * script works out where the food is so the crop keeps it in view.
 *
 *   public/menu/butter-chicken-half.jpg      → Butter Chicken (Half) only
 *   public/menu/butter-chicken.jpg           → every Butter Chicken variant (Half + Full)
 *   public/menu/virgin-mojito--top.webp      → force the crop focus (see FOCUS_WORDS)
 *   public/menu/farmhouse-pizza--50-35.jpg   → force focus to x=50%, y=35%
 *
 * Runs automatically before `npm run dev` and `npm run build` (package.json
 * predev/prebuild), so on Vercel a pushed image is live on the next deploy.
 * Run `npm run menu:images` to see which ids exist and which still have no photo.
 *
 * Output: src/lib/menu-images.generated.ts (committed; regenerated on every build).
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_DIR = path.join(ROOT, "public", "menu");
const MENU_FILE = path.join(ROOT, "src", "lib", "menu-data.ts");
const OUT_FILE = path.join(ROOT, "src", "lib", "menu-images.generated.ts");

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const MAX_BYTES = 8 * 1024 * 1024; // larger files slow the build; compress first
const MIN_SIDE = 600; // smaller than this looks soft on retina cards
const FOCUS_WORDS = {
  center: "50% 50%",
  top: "50% 20%",
  bottom: "50% 80%",
  left: "20% 50%",
  right: "80% 50%",
  "top-left": "20% 20%",
  "top-right": "80% 20%",
  "bottom-left": "20% 80%",
  "bottom-right": "80% 80%",
};
/** Variant suffixes the menu adds to one dish (Half/Full, Small/Large, 4/8 Pcs). */
const VARIANT_SUFFIX = /-(half|full|small|medium|large|\d+-pcs?)$/;

const listOnly = process.argv.includes("--list");
const warn = (msg) => console.warn(`  ⚠ ${msg}`);

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    return null; // still works: images render centred, just without auto-focus
  }
}

async function menuItemIds() {
  const src = await readFile(MENU_FILE, "utf8");
  return [...src.matchAll(/\{ id: "([a-z0-9-]+)", name: "([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2] }));
}

/**
 * Focal point via libvips' attention strategy (finds the most salient region).
 * Each axis is measured separately — a narrow vertical window slid left↔right gives x,
 * a short horizontal window slid up↕down gives y — so the result holds for any frame
 * shape (square cards, tall tiles, 16:9 banners).
 */
async function detectFocus(sharp, file, width, height) {
  if (!sharp || !width || !height) return null;
  const axis = async (w, h) => {
    const { info } = await sharp(file)
      .rotate()
      .resize(w, h, { fit: "cover", position: sharp.strategy.attention })
      .toBuffer({ resolveWithObject: true });
    return { left: Math.abs(info.cropOffsetLeft ?? 0), top: Math.abs(info.cropOffsetTop ?? 0) };
  };
  const cw = Math.max(1, Math.round(width * 0.4));
  const ch = Math.max(1, Math.round(height * 0.4));
  const { left } = await axis(cw, height);
  const { top } = await axis(width, ch);
  // Offset of the salient window → CSS object-position percentage.
  const x = Math.round((left / (width - cw)) * 100);
  const y = Math.round((top / (height - ch)) * 100);
  const clamp = (n) => (Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50);
  return `${clamp(x)}% ${clamp(y)}%`;
}

function parseName(file) {
  const ext = path.extname(file).toLowerCase();
  const stem = path.basename(file, path.extname(file)).toLowerCase();
  const [id, focusPart] = stem.split("--");
  let focus = null;
  if (focusPart) {
    if (FOCUS_WORDS[focusPart]) focus = FOCUS_WORDS[focusPart];
    else if (/^\d{1,3}-\d{1,3}$/.test(focusPart)) {
      const [x, y] = focusPart.split("-").map((n) => Math.min(100, Number(n)));
      focus = `${x}% ${y}%`;
    } else warn(`${file}: unknown focus "${focusPart}" — using automatic focus`);
  }
  return { ext, id, focus };
}

async function main() {
  const items = await menuItemIds();
  const ids = new Set(items.map((i) => i.id));
  const baseIds = new Set(items.map((i) => i.id.replace(VARIANT_SUFFIX, "")));

  let files = [];
  try {
    files = (await readdir(IMAGE_DIR)).filter((f) => !f.startsWith("."));
  } catch {
    files = [];
  }

  const sharp = await loadSharp();
  const entries = {};
  for (const file of files.sort()) {
    const full = path.join(IMAGE_DIR, file);
    const { ext, id, focus: forcedFocus } = parseName(file);
    if (!EXTENSIONS.has(ext)) {
      if (ext !== ".md") warn(`${file}: not an image type the site serves (${[...EXTENSIONS].join(", ")}) — skipped`);
      continue;
    }
    if (!ids.has(id) && !baseIds.has(id)) {
      warn(`${file}: no menu item has the id "${id}" — skipped (run npm run menu:images for the list)`);
      continue;
    }
    if (entries[id]) {
      warn(`${file}: a second image for "${id}" — keeping ${entries[id].src.split("/").pop()}`);
      continue;
    }
    const { size } = await stat(full);
    if (size > MAX_BYTES) warn(`${file}: ${(size / 1048576).toFixed(1)} MB — consider compressing below 8 MB`);

    let width = null;
    let height = null;
    let focus = forcedFocus;
    if (sharp) {
      try {
        const meta = await sharp(full).metadata();
        width = meta.autoOrient?.width ?? meta.width ?? null;
        height = meta.autoOrient?.height ?? meta.height ?? null;
        if (width && height && Math.min(width, height) < MIN_SIDE) {
          warn(`${file}: ${width}×${height} is small — it will look soft; ${MIN_SIDE}px+ on the short side is better`);
        }
        if (!focus) focus = await detectFocus(sharp, full, width, height);
      } catch (err) {
        warn(`${file}: could not be read as an image (${err.message}) — skipped`);
        continue;
      }
    }
    entries[id] = { src: `/menu/${file}`, width, height, focus: focus ?? "50% 50%" };
  }

  if (listOnly) {
    const missing = items.filter((i) => !entries[i.id] && !entries[i.id.replace(VARIANT_SUFFIX, "")]);
    console.log(`Menu images: ${items.length - missing.length}/${items.length} items have a photo.\n`);
    console.log("Name a file in public/menu/ after one of these ids (any of .jpg .png .webp .avif):\n");
    for (const i of missing) console.log(`  ${i.id.padEnd(48)} ${i.name}`);
    return;
  }

  const body = JSON.stringify(entries, null, 2);
  const out = `// AUTO-GENERATED by scripts/sync-menu-images.mjs — do not edit by hand.
// Add or remove photos in public/menu/ instead; this file is rebuilt before dev/build.
import type { MenuImageEntry } from "./menu-images";

export const MENU_IMAGE_MANIFEST: Record<string, MenuImageEntry> = ${body};
`;
  let previous = "";
  try {
    previous = await readFile(OUT_FILE, "utf8");
  } catch {}
  if (previous !== out) await writeFile(OUT_FILE, out);
  console.log(`menu images: ${Object.keys(entries).length} photo(s) mapped${sharp ? "" : " (sharp unavailable: centred crop)"}`);
}

main().catch((err) => {
  // Never block a build because of a photo problem: fall back to placeholders.
  console.warn(`menu images: skipped (${err.message})`);
});
