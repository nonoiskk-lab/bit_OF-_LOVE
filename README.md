# LOVBITES — When Hunger Strikes

An awards-inspired restaurant experience for LOVBITES Hospitality Group (Hirapur, Dhanbad, Jharkhand): an editorial homepage built around "choose your mood," the full digital menu, online ordering, private cottage booking, table booking, and catering — built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To use the admin dashboard (`/admin`), copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (a generator command is in the file).

## What's implemented

- **Homepage** — the 16-section structure from the brief: hero, mood selector, the LOVBITES Edit (signatures), Protein Lab, Coffee, Chicken Basket micro-brand, menu journey, fine dine transition, private cottages, date night, catering, events, Instagram wall, reviews, location, final CTA.
- **Digital menu** (`/menu`) — every item from the LOVBITES menu workbook, transcribed as-is (no invented items, no altered prices), organized by a sticky category rail with scroll-spy, editorial category headers, and a product detail modal. `?group=<nav-group>` deep-links into a category; `?mood=date` shows the curated date-night picks.
- **Ordering** (`/order`) — cart → delivery/pickup → customer details → payment method → confirmation, backed by `POST /api/orders`.
- **Private cottage booking** (`/cottages`) — date → live availability for both cottages → guest count/occasion/custom request → details → confirmation with calendar (.ics), WhatsApp and email share links. `POST /api/cottage-booking` rejects a conflicting cottage+date+time booking (409), so double-booking is actually prevented, not just visually discouraged.
- **Table booking** (`/table`) — separate from cottage inventory, as the brief requires.
- **Catering** (`/catering`) — quote request form.
- **Admin** (`/admin`) — password-gated dashboard over orders, table bookings, cottage bookings, catering leads, and WhatsApp marketing broadcasts. Login is a signed, HttpOnly session cookie (`src/lib/server/admin-auth.ts`, no extra dependency); the `GET` handlers for orders/table-bookings/catering-leads return `401` without a valid session, and the public cottage-availability endpoint strips customer name/phone for unauthenticated callers so a booking page visitor never sees other guests' details.
- **WhatsApp marketing** (`/admin` → "WhatsApp Marketing" tab, backed by `POST /api/admin/whatsapp` and `src/lib/server/whatsapp.ts`) — bulk-sends a Meta-approved WhatsApp template message to selected customers (deduped from orders/bookings/catering leads), and logs each send's per-recipient result. Always goes through the Cloud API's template endpoint (never free text), since WhatsApp's Business Policy requires marketing messages to use a pre-approved template and reach only opted-in recipients. Needs `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` from a Meta WhatsApp Business Cloud API app (see `.env.example`); the tab shows a clear "not configured" state until those are set.

## Deliberate scope decisions

This brief describes a full production platform (payments, a CMS-driven admin, real photography, analytics, a provisioned database). Within this session:

- **Persistence** is a JSON file store (`src/lib/server/file-store.ts`, data in `/data`, gitignored) so every flow above is real and testable end-to-end. It has no locking and won't survive a read-only serverless filesystem — swap it for Supabase/Postgres before shipping.
- **Payment** is captured as a preference (UPI/Card/COD) and recorded on the order; no payment gateway is wired up. Add Razorpay before taking real money.
- **Photography** is an art-directed placeholder system (`src/components/ui/FoodImage.tsx`) — mood-tinted gradients standing in for a real shoot. The brief explicitly rules out AI-generated or stock food photography as a substitute for the real thing, so this is deliberate, not a shortcut: drop in the real shoot before launch.
- **Reviews** are intentionally empty with a note in place of the section — no fabricated quotes, per the brief's own anti-pattern list. Wire up Google Reviews/Zomato before launch.
- **Admin auth** is one shared password (env-configured), not per-user accounts — fine for a small team, not for a multi-staff rollout. Swap for Supabase Auth (or similar) with row-level security when you outgrow a single shared login. A Supabase migration for this project was attempted in this session but blocked on the connected account's 2-project free-tier limit (both existing projects are already in active use) — provisioning it is a five-minute follow-up once a project slot is free, and everything here (the `file-store` module, the auth boundary on each route) is already shaped to drop straight into Postgres/RLS without changing the API surface.
- Analytics (GA4/Meta Pixel) and a real Google Maps API embed need real credentials this environment doesn't have — the location map uses the credential-free Google Maps embed URL, and the footer/sticky-bar WhatsApp/call links use placeholder numbers to swap in. The WhatsApp *marketing* integration is real code (see above) but also needs real Meta credentials and at least one approved template to actually send anything.

## Tech

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand (cart state, persisted to `localStorage`).
