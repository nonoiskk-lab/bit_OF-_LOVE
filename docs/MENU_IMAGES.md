# Menu photos — Smart Image Auto-Fit

Add a real photo of a dish and it appears everywhere that dish is shown (menu card,
item pop-up, homepage sections), already fitted to each frame. No resizing or
cropping by hand.

## Add a photo (3 steps)

1. Find the dish's **id**:
   ```bash
   npm run menu:images
   ```
   It prints every dish that still has no photo, e.g. `butter-chicken-half   Butter Chicken (Half)`.
2. Save the photo in **`public/menu/`** named after that id — any of `.jpg`, `.jpeg`,
   `.png`, `.webp`, `.avif`:
   ```
   public/menu/butter-chicken-half.jpg     → Butter Chicken (Half) only
   public/menu/butter-chicken.jpg          → Butter Chicken (Half) and (Full)
   public/menu/farmhouse-pizza.jpg         → Farmhouse Pizza (Small) and (Large)
   ```
   A photo named without the `-half` / `-full` / `-small` / `-large` / `-4-pcs` part is
   shared by every size of that same dish. Different dishes never share a photo.
3. Commit and push. Vercel rebuilds and the photo is live.

Any shape works — portrait, landscape or square, phone photo or 4000px DSLR file.
Best results: at least 1200px on the short side, under 8 MB, the dish reasonably
centred and well lit.

## What happens automatically

| Step | Where | What it does |
| --- | --- | --- |
| Scan | `scripts/sync-menu-images.mjs` (runs before every `dev` and `build`) | Finds photos in `public/menu/`, checks file type, reads the size, warns about unknown ids, tiny images or files over 8 MB, and writes `src/lib/menu-images.generated.ts`. |
| Focus | same script, using `sharp`'s attention detection | Finds where the food is (the most detailed, colourful region) and stores it as the crop focus, so a dish placed off-centre stays in view when the frame crops the photo. |
| Fit | `src/components/ui/SmartImage.tsx` | Fills 100% of the frame with `object-fit: cover`. The photo is never stretched and never letterboxed, and only the minimum needed is trimmed, around the focus point. |
| Deliver | `next/image` (`next.config.ts`) | Serves AVIF or WebP at the width each device needs (srcset/sizes), lazy-loads below the fold, and keeps the original file untouched. |
| Fallback | `src/components/ui/FoodImage.tsx` | If a dish has no photo, or a file fails to load, the branded colour placeholder is shown, never a broken-image icon or an empty frame. |

Frame shapes (`FRAME_RATIO_CLASS` in `SmartImage.tsx`): menu cards 4:3, item pop-up
16:9, Signatures / Date Night 4:5, homepage previews 1:1. Every image in a grid shares
one frame, so cards always line up whatever the photo's original shape.

## Override the crop focus (rarely needed)

If the automatic focus picks the wrong spot, add a suffix after `--` in the filename:

```
virgin-mojito--top.jpg        keep the top in view (tall glasses, garnish)
chicken-platter--bottom.jpg
paneer-tikka-8-pc--left.jpg   also: right, center, top-left, top-right, bottom-left, bottom-right
farmhouse-pizza--50-35.jpg    exact focus: 50% across, 35% down
```

## Non-menu images

Hero banners, cottages, catering and gallery tiles use the same `FoodImage` →
`SmartImage` component. Pass `src` (and optionally `focus`) to swap a placeholder for a
real photo with the same auto-fit behaviour.

## Not supported here

There is no upload button in `/admin`: Vercel's file system is read-only, so uploads
need a storage service (for example Supabase Storage). Until then, photos are added
through `public/menu/` as described above.
