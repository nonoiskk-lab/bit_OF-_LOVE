# LOVBITES — When Hunger Strikes

An awards-inspired restaurant experience for LOVBITES Hospitality Group (Hirapur, Dhanbad, Jharkhand): an editorial homepage built around "choose your mood," the full digital menu, online ordering, private cottage booking, table booking, and catering — built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's implemented

- **Homepage** — the 16-section structure from the brief: hero, mood selector, the LOVBITES Edit (signatures), Protein Lab, Coffee, Chicken Basket micro-brand, menu journey, fine dine transition, private cottages, date night, catering, events, Instagram wall, reviews, location, final CTA.
- **Digital menu** (`/menu`) — every item from the LOVBITES menu workbook, transcribed as-is (no invented items, no altered prices), organized by a sticky category rail with scroll-spy, editorial category headers, and a product detail modal. `?group=<nav-group>` deep-links into a category; `?mood=date` shows the curated date-night picks.
- **Ordering** (`/order`) — cart → delivery/pickup → customer details → payment method → confirmation, backed by `POST /api/orders`.
- **Private cottage booking** (`/cottages`) — date → live availability for both cottages → guest count/occasion/custom request → details → confirmation with calendar (.ics), WhatsApp and email share links. `POST /api/cottage-booking` rejects a conflicting cottage+date+time booking (409), so double-booking is actually prevented, not just visually discouraged.
- **Table booking** (`/table`) — separate from cottage inventory, as the brief requires.
- **Catering** (`/catering`) — quote request form.
- **Admin** (`/admin`) — read-only dashboard over orders, table bookings, cottage bookings and catering leads.

## Deliberate scope decisions

This brief describes a full production platform (payments, a CMS-driven admin, real photography, analytics, a provisioned database). Within this session:

- **Persistence** is a JSON file store (`src/lib/server/file-store.ts`, data in `/data`, gitignored) so every flow above is real and testable end-to-end. It has no locking and won't survive a read-only serverless filesystem — swap it for Supabase/Postgres before shipping.
- **Payment** is captured as a preference (UPI/Card/COD) and recorded on the order; no payment gateway is wired up. Add Razorpay before taking real money.
- **Photography** is an art-directed placeholder system (`src/components/ui/FoodImage.tsx`) — mood-tinted gradients standing in for a real shoot. The brief explicitly rules out AI-generated or stock food photography as a substitute for the real thing, so this is deliberate, not a shortcut: drop in the real shoot before launch.
- **Reviews** are intentionally empty with a note in place of the section — no fabricated quotes, per the brief's own anti-pattern list. Wire up Google Reviews/Zomato before launch.
- **Admin** is read-only and has no authentication. Add real auth (and a real database with row-level security) before exposing it outside the team.
- Analytics (GA4/Meta Pixel), a real Google Maps API embed, and WhatsApp Business integration all need real credentials this environment doesn't have — the location map uses the credential-free Google Maps embed URL, and WhatsApp/call links use placeholder numbers to swap in.

## Tech

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand (cart state, persisted to `localStorage`).
