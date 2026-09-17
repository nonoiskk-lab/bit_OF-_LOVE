# LOVBITES — Full Project Reference & Rebuild Playbook

One file with everything about how this website is built: the stack, every
file's job, the design system, how data flows, how deployment works, and a
step-by-step playbook for building another site the same way. Read this
before editing the site, and reuse it as a template the next time you (or
an agent) build a similar restaurant/business site from scratch.

---

## 1. What this project is

**LOVBITES** — a restaurant website for LOVBITES Hospitality Group
(Cafe & Kitchen, Ground Floor, Om Sai Plaza, Police Line Road, Near HDFC
Bank, Dhanbad, Jharkhand – 826001). It's a real, working Next.js app, not a
static mockup:

- Editorial homepage with mood-based navigation
- Full digital menu with categories, moods, deep-linking
- Online ordering with a real cart → checkout flow
- Private cottage booking with live availability and double-booking
  prevention
- Table booking
- Catering quote requests
- A password-gated admin dashboard over all of the above
- A branded "waiter" mascot in the header that doubles as the cart button

Live at: `https://bit-of-love.vercel.app` (auto-deploys from the
`claude/hopeful-franklin-c3fvas` branch on every push — see §8).

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | File-based routing, API routes in the same project, fast builds |
| Language | **TypeScript** | Every file is typed; `src/lib/types.ts` is the single source of truth for data shapes |
| Styling | **Tailwind CSS v4** | Utility classes + a small custom token layer (see §4) via `@theme inline` in `globals.css` — no separate `tailwind.config` file needed in v4 |
| Animation | **Framer Motion** (`framer-motion` v13) | All motion — page transitions, scroll reveals, the waiter's choreography — uses this one library, never raw CSS keyframes or a second animation library |
| State | **Zustand** (+ `persist` middleware) | Only used for the cart (`src/lib/cart-store.ts`); it's global, minimal boilerplate, and persists to `localStorage` automatically |
| Persistence | **JSON files on disk** (`src/lib/server/file-store.ts`) | Stand-in for a real database — see §7 for why and how to replace it |
| Auth | **Hand-rolled HMAC-signed cookie** (`src/lib/server/admin-auth.ts`) | One shared admin password, no external auth library — see §6 |
| Hosting | **Vercel** (git integration) | Push to the tracked branch → automatic production deploy |
| Fonts | Unbounded (display), Plus Jakarta Sans (body), Space Grotesk (numbers) — all via `next/font/google` in `layout.tsx` |

No database, no payment gateway, no CMS, no analytics are wired up. That's
deliberate — see §7 "What's not real yet."

---

## 3. Folder structure — what every file does

```
src/
  app/                          # Next.js App Router — one folder = one route
    layout.tsx                  # Root HTML shell: fonts, <Navigation>, <SiteFooter>,
                                 #   <MobileStickyBar>, <CartDrawer> — these four are
                                 #   global and render on every page
    page.tsx                    # Homepage — just a list of <Section /> components in order
    globals.css                 # Design tokens + Tailwind import (see §4)
    menu/
      page.tsx                  # Server wrapper for the menu route
      MenuClient.tsx             # Actual menu UI (client component): category rail,
                                 #   scroll-spy, mood filter, product grid
    order/page.tsx               # Cart → fulfilment → customer details → payment → confirm
    cottages/
      page.tsx
      CottagesClient.tsx         # Date picker → live availability → booking form
    table/page.tsx               # Table booking form
    catering/page.tsx            # Catering quote-request form
    admin/page.tsx               # Password-gated dashboard (orders/bookings/leads)
    api/
      orders/route.ts            # POST create order, GET list (admin-only)
      table-booking/route.ts     # POST create booking, GET list (admin-only)
      cottage-booking/route.ts   # POST create (409 on conflict), GET list
                                 #   (public sees stripped data, admin sees full)
      catering/route.ts          # POST create lead, GET list (admin-only)
      admin/login/route.ts       # POST password → sets signed session cookie
      admin/logout/route.ts      # POST → clears cookie

  components/
    Navigation.tsx               # Fixed header: logo, nav links, Book a Table /
                                 #   Order Now buttons, <LovbitesWaiter>, mobile menu
    SiteFooter.tsx                # Footer: logo, links, real address (tap-through to
                                 #   Google Maps), phone, WhatsApp
    MobileStickyBar.tsx           # Bottom bar on mobile only: Order / Book / Call / WhatsApp
    CartDrawer.tsx                # Slide-in cart panel, reads the Zustand store directly
    menu/
      CategoryRail.tsx            # Sticky horizontal category chips with scroll-spy
      ProductCard.tsx             # One menu item card + "Add" button
      ProductModal.tsx            # Item detail popup (description, add-to-cart)
    sections/                     # One file per homepage section, in the order
                                 #   they're rendered in app/page.tsx — e.g. Hero.tsx,
                                 #   MoodSelector.tsx, Signatures.tsx, ProteinLab.tsx,
                                 #   CoffeeExperience.tsx, ChickenBasket.tsx,
                                 #   BrandStory.tsx, MenuJourney.tsx,
                                 #   FineDineTransition.tsx, PrivateCottages.tsx,
                                 #   DateNight.tsx, Catering.tsx, Events.tsx,
                                 #   InstagramWall.tsx, Reviews.tsx, Location.tsx,
                                 #   OurStory.tsx (editorial closing section)
    ui/                            # Reusable, presentational-only primitives
      LovbitesLogo.tsx             # Real logo image + real text tagline (see §5)
      LovbitesWaiter.tsx           # The animated header mascot / cart button (see §5)
      FoodImage.tsx                # Placeholder mood-tinted image block (real photography
                                 #   not shot yet — see §7)
      Button.tsx, Badge.tsx, SectionHeading.tsx

  lib/
    types.ts                      # Every data shape in the app — MenuItem, MenuCategory,
                                 #   Cottage, OrderRecord, TableBookingRecord,
                                 #   CottageBookingRecord, CateringLead, etc.
    menu-data.ts                  # The entire menu, transcribed as static TS data
                                 #   (~580 lines) — categories → items
    cottages-data.ts              # The 2 cottages, static data
    moods-data.ts                 # Homepage "mood" cards (I'm Hungry / Eating Fit / …)
                                 #   each linking to a pre-filtered /menu?group=… view
    cart-store.ts                  # Zustand cart store — see §5
    utils.ts                       # formatPrice(), getMealContext() (time-of-day logic)
    server/
      file-store.ts                # JSON-file persistence (see §7)
      admin-auth.ts                 # Password check + signed session cookie (see §6)

public/
  logo-mark.png, logo.png          # Real cropped logo assets
  waiter-full.png, waiter-face.png # Real waiter character, background removed (see §5)
```

---

## 4. Design system (the part to copy for a new brand)

Everything lives in `src/app/globals.css`, inside `:root` and Tailwind's
`@theme inline` block. This is the **only place** color/font decisions are
made — components reference the tokens, never raw hex codes.

```css
:root {
  --lb-red: #d3341f;          /* primary brand color */
  --lb-red-deep: #a82712;     /* hover/active state of red */
  --lb-cream: #faf3e6;
  --lb-cream-soft: #f6ece0;
  --lb-off-white: #fdfbf7;    /* body/header background */
  --lb-charcoal: #1c1714;     /* primary text color */
  --lb-charcoal-soft: #2a231f;
  --lb-neutral: #8a7f74;      /* secondary/muted text */
  --lb-neutral-soft: #d8cfc3;
  --lb-green: #4f6a4a;
  --lb-coffee: #3f2a1f;
  --lb-gold-muted: #b98a4a;
}
```

Each `--lb-*` token is re-exposed as a Tailwind color via `@theme inline`
(`--color-lb-red: var(--lb-red)`, etc.), so every component just writes
`bg-lb-red`, `text-lb-charcoal/80`, `border-lb-charcoal/15`, etc. — normal
Tailwind opacity modifiers work on these custom colors too.

**Fonts** (loaded in `layout.tsx` via `next/font/google`, exposed the same
way):
- `font-display` (Unbounded) — headings, the logo wordmark
- `font-body` (Plus Jakarta Sans) — everything else (this is also the
  unnamed default on `<body>`)
- `font-number` (Space Grotesk) — prices, counts, eyebrow labels

**To reskin this for a different brand**: change the 11 `--lb-*` hex
values and the three Google Fonts in `layout.tsx`/`globals.css`. Nothing
else needs to change — every component already reads through the tokens.

**Whole-site rule that was enforced by hand**: the site is white/off-white
throughout with cherry-red accents — there is no dark section anywhere
(there used to be; it was explicitly converted). If you fork this for
another brand, decide that up front and keep it consistent rather than
mixing light and dark sections.

**Motion convention**: almost every animated element uses the same easing
curve, defined locally per file as:
```ts
const EASE = [0.22, 1, 0.36, 1] as const; // Framer Motion cubic-bezier
```
and the same pattern: `initial` → `whileInView`/`animate` with
`viewport={{ once: true }}` for scroll reveals, staggered by index. Reuse
this constant rather than inventing new easing per component.

**Reduced motion**: handled at two levels — a global CSS media query in
`globals.css` collapses all CSS transition/animation durations to near-zero,
and JS-driven Framer Motion sequences (like the waiter's entrance) check
`useReducedMotion()` explicitly and skip themselves. Do both when adding
new animated components.

---

## 5. Key interactive pieces (worth understanding in detail)

### Cart (`src/lib/cart-store.ts`)

A single Zustand store, the only global client state in the app:

```ts
interface CartState {
  lines: CartLine[];       // { item, categoryTitle, quantity, note? }
  isOpen: boolean;
  addItem, removeItem, setQuantity, clear, open, close, toggle
}
```

`addItem` automatically sets `isOpen: true`, so adding anything opens the
drawer. `cartCount(lines)` sums quantities (not unique items);
`cartTotal(lines)` sums price×quantity. Persisted to `localStorage` under
the key `"lovbites-cart"`. Any component can read/act on the cart with
`useCartStore((s) => s.something)` — no prop drilling, no context provider
needed.

### The waiter (`src/components/ui/LovbitesWaiter.tsx`)

Replaces what would normally be a plain cart icon. It's a real cart
control (reuses `useCartStore` directly) wrapped in a choreographed
character animation:

- **Artwork**: `public/waiter-face.png`, a background-removed crop of a
  character reference image the client supplied (see §9 for how that
  extraction was done — OpenCV GrabCut, not a design tool). Shown inside a
  perfect circle (`object-fit: cover`), 64px on desktop / 40px on mobile.
- **Entrance** (plays once per browser tab via `sessionStorage`): peeks in
  from off-screen-left via `translateX` keyframes → settles → small nod →
  scale "presenting" pulse → a "Hi there! Ready to order? ❤️" speech
  bubble that auto-dismisses.
- **Idle**: a near-imperceptible vertical breathing loop.
- **Hover** (desktop only): leans in slightly, shows a "Your order ❤️"
  tooltip.
- **Click**: small acknowledgment nod (~180ms), then opens the cart
  drawer (`toggle()` from the store).
- **Add-to-cart reaction**: watches `cartCount` via a `useRef` diff — on
  any increase, nods and shows an "Added to your order ❤️" bubble for
  ~2.2s.
- All speech bubbles funnel through **one** slot (`bubble` derived state)
  so only one message ever shows at a time.
- `useReducedMotion()` disables the entrance/idle/hover motion entirely —
  the character still renders, just static.

If you reuse this pattern for another brand: swap the two PNGs, keep the
choreography code (`bodyControls` via Framer Motion's `useAnimation()`)
as-is — it's asset-agnostic.

### Logo (`src/components/ui/LovbitesLogo.tsx`)

Deliberately **not** one flattened image. The wordmark graphic
(`public/logo-mark.png`) scales via `next/image` with an inline
`style={{ maxWidth: 'clamp(...)' }}` (not a Tailwind width class — Tailwind
classes weren't reliably constraining `next/image` render size across
builds). The tagline ("Cafe & Kitchen | 8 AM Onwards") is **real HTML
text**, not baked into the image, specifically so it stays crisp at any
scale instead of blurring when the graphic is enlarged.

---

## 6. Admin auth (`src/lib/server/admin-auth.ts`)

No external auth library. One shared password, set via environment
variable:

1. `POST /api/admin/login` with `{ password }` → `checkPassword()` compares
   against `process.env.ADMIN_PASSWORD` using `crypto.timingSafeEqual`
   (constant-time, so response timing can't leak whether characters
   matched).
2. On success, `createSessionToken()` makes `"<expiry-timestamp>.<hmac>"`
   signed with `process.env.ADMIN_SESSION_SECRET`, set as an **HttpOnly**
   cookie (`lb_admin_session`), 12-hour TTL.
3. Every admin-only API route calls `isAdminRequest(req)`, which re-verifies
   the HMAC and checks expiry, and returns `401` if it fails.
4. The one deliberately-public endpoint with sensitive data
   (`GET /api/cottage-booking`) returns a **different, smaller shape** to
   non-admin callers (id/cottage/date/time/status only — no customer
   name/phone) instead of just blocking the request outright, since the
   booking page itself needs public availability data.

**Required env vars** (`.env.example` documents both):
```
ADMIN_PASSWORD=<any strong string>
ADMIN_SESSION_SECRET=<32+ random chars — generate with:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```
Unset = login always fails closed (secure default, never "no password
required").

To reuse this pattern elsewhere: copy `admin-auth.ts` verbatim, it has no
project-specific code in it.

---

## 7. Data & "what's not real yet"

### Data model

`src/lib/types.ts` is the contract every other file follows. Static
content (menu, cottages, moods) is plain TypeScript data files, not a CMS
— editing the menu means editing `src/lib/menu-data.ts` directly and
redeploying. Transactional data (orders, bookings, catering leads) is
created via the API routes and persisted with `file-store.ts`.

### `file-store.ts` — the one thing to replace before real production use

```ts
const DATA_DIR = path.join(process.cwd(), "data"); // gitignored
```

Plain JSON files, one per collection (`orders.json`, `table-booking.json`,
etc.), read/written whole on every request. This works for local dev and
demoing full flows end-to-end, but:
- **No locking** — concurrent writes can race.
- **Won't survive Vercel's read-only serverless filesystem** in
  production — writes will silently fail or throw once actually deployed
  under load (works today because nothing has hit real concurrent traffic
  yet).

**Replace with Supabase/Postgres** before this takes real orders. The
shape is already right for a 1:1 swap: every route only calls
`readCollection`/`writeCollection`/`appendToCollection`/`generateId` from
this one file, so swapping the implementation (keeping the same function
signatures, backed by SQL instead of JSON) means touching one file, not
every route.

### Other known gaps (see `README.md` "Deliberate scope decisions" for the
full up-to-date list — this repeats the highlights)

- **No payment gateway.** Payment method is captured as a preference
  (UPI/Card/COD) and stored on the order; nothing charges a card. Add
  Razorpay (or similar) before taking real money.
- **No real food photography.** `FoodImage.tsx` renders mood-tinted
  gradient placeholders on purpose — the original brief explicitly
  forbade substituting AI-generated or stock photos. Replace with a real
  shoot.
- **No real reviews.** The Reviews section is intentionally empty with a
  note, not fabricated testimonials.
- **Single shared admin password**, not per-staff accounts.
- **No analytics** (GA4/Meta Pixel) — needs real tracking IDs.
- **Google Maps** uses the credential-free embed URL (`/maps?q=...&output=embed`),
  not the JS API — fine for a static embed, upgrade if you need
  interactive features.

---

## 8. Deployment

- **Host**: Vercel, connected via GitHub git integration (not the Vercel
  CLI) — the project was imported through vercel.com/new because a
  programmatic project-creation attempt hit a GitHub-App-permission issue
  this session couldn't resolve on its own.
- **Trigger**: every `git push` to the tracked branch
  (`claude/hopeful-franklin-c3fvas`) auto-redeploys to production. There
  is no separate staging branch in this setup — the tracked branch *is*
  what's live.
- **Env vars**: set manually in the Vercel dashboard (Project → Settings →
  Environment Variables) — `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` at
  minimum for `/admin` to work. No MCP/CLI tool in this environment can
  set them remotely; it's a manual one-time dashboard step per variable.
- **Build**: standard `next build` (Turbopack), no custom build command
  needed.

To stand up a **new** project the same way: `vercel.com/new` → import the
GitHub repo → let it auto-detect Next.js → add env vars in the dashboard
→ every future push deploys itself.

---

## 9. How real assets were produced (so you can repeat this)

Two things in this project are **real, sourced artwork**, not
AI-generated-from-scratch or hand-drawn by the agent:

1. **The logo** — the client uploaded a design file directly to the GitHub
   repo root (the only reliable file-transfer channel available in this
   sandboxed session — some external upload links were network-blocked).
   It was then cropped and made-transparent locally with Python
   (`Pillow` + `numpy`, diff-masking against the white background), then
   2x-upscaled with Lanczos resampling for crisper large-scale rendering,
   and saved into `public/`.
2. **The waiter character** — same upload-to-repo-root pattern. The
   uploaded file was actually a full **animation mood-board/spec image**
   (a 6-frame peek/look/slide-in/greet/engage/idle reference strip plus
   interaction notes), not an isolated cutout. The usable character was
   extracted with:
   - `cv2.grabCut()` (OpenCV) for initial subject/background separation
   - a flood-fill hole-recovery pass (the clipboard's white paper matched
     the backdrop color and was getting cut out as "background" — holes
     fully enclosed by foreground get filled back in)
   - targeted HSV near-white thresholding to clear a stray
     door-frame/wall sliver GrabCut kept
   - largest-connected-component filtering + a tight bounding-box crop

If a future project supplies its own mascot/hero photo the same way
(upload to repo root, since that's the reliable channel), this same
GrabCut → hole-fill → threshold-cleanup → crop pipeline is the fallback
when no proper background-removal API is reachable — see the session's
Python usage in this repo's git history for the exact working script if
you need to redo it.

---

## 10. Playbook — building another site this way from scratch

1. **Scaffold**: `npx create-next-app@latest` with TypeScript, Tailwind,
   App Router, ESLint.
2. **Design tokens first**: define brand colors and pick 2-3 Google Fonts,
   wire them into `globals.css`/`layout.tsx` exactly like §4, before
   writing any component. Every component should reference tokens, never
   raw hex.
3. **Data model before UI**: write `src/lib/types.ts` for every entity the
   business has (menu items, bookable resources, lead/booking records),
   then static data files for anything that isn't user-generated.
4. **One global state store per genuinely-global concern** (this project
   only needed one: the cart). Don't reach for global state beyond that —
   page-local `useState` is fine for everything else.
5. **API routes are thin**: each one validates input, calls
   `file-store.ts` helpers (or your real DB client), returns JSON. Admin
   auth is checked per-route with one shared `isAdminRequest()` helper,
   never duplicated.
6. **Section-per-file homepage**: one component per homepage section,
   composed in `app/page.tsx` as a flat list — makes reordering, removing,
   or A/B testing individual sections trivial.
7. **Real assets over generated ones whenever the client can provide
   them** — ask for an upload rather than generating a fake logo/mascot.
   GitHub repo root is a dependable upload channel in a sandboxed agent
   session; process what arrives with real image tools (Pillow/OpenCV),
   don't redraw it.
8. **Ship the real flows before the real infrastructure**: it's fine to
   launch on JSON-file persistence and swap to Postgres later, as long as
   every route already goes through one persistence abstraction (so the
   swap is contained) — don't let routes talk to `fs` directly.
9. **Deploy early**: get a real public URL (Vercel git import) as soon as
   there's a homepage, so every subsequent change is checked against the
   live site, not just `localhost`.
10. **Write this file** (or update it) as you go, not at the end — it's
    much easier to describe a decision right after making it than to
    reconstruct why later.

---

## 11. Common edits — quick recipes

| I want to… | Edit this |
|---|---|
| Change a price / add a menu item | `src/lib/menu-data.ts` |
| Change brand colors | `src/app/globals.css` (`:root` block) |
| Change fonts | `src/app/layout.tsx` (font imports) + `globals.css` (`@theme inline`) |
| Add/remove a homepage section | `src/app/page.tsx` (the ordered list) + add/remove the file in `src/components/sections/` |
| Change the phone number / address | `src/components/Navigation.tsx`, `SiteFooter.tsx`, `MobileStickyBar.tsx`, `src/components/sections/Location.tsx` (it's duplicated in a few places — no single source of truth for contact info yet; consider extracting one if you add more) |
| Add a new booking/lead type | New interface in `types.ts` → new `api/<thing>/route.ts` using `file-store.ts` → new page/form |
| Swap JSON storage for a real DB | Rewrite `src/lib/server/file-store.ts` only — every route already calls only its four exported functions |
| Change the admin password | Update `ADMIN_PASSWORD` in Vercel's dashboard env vars, no code change |
| Replace the waiter or logo art | Drop new PNGs into `public/`, same filenames (or update the `src` paths in `LovbitesWaiter.tsx` / `LovbitesLogo.tsx`) |
