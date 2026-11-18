# LOVBITES — Handoff for Claude Code (read this first)

Branch with all audit fixes: `claude/production-audit-fixes`
(based on the live branch `claude/hopeful-franklin-c3fvas`, which Vercel deploys to production).

Status on 18 Nov 2026: the fixes are built and tested on a **Vercel preview**. They are **not live yet**.
No database has been set up yet: the owner chose to connect a new domain first.

---

## 1. Paste this into Claude Code

```
Read HANDOFF.md and PROJECT_GUIDE.md first. Work on branch claude/production-audit-fixes.
Goal: make the LOVBITES site live on my new domain <MY-DOMAIN>.
1. Run npm install, npm run lint, npm run build and fix anything that fails.
2. Set NEXT_PUBLIC_SITE_URL=https://<MY-DOMAIN> for Production in the Vercel project "bit-of-love".
3. Add <MY-DOMAIN> and www.<MY-DOMAIN> to the Vercel project "bit-of-love" and tell me the exact
   DNS records to add at my domain registrar. Make www redirect to the main domain.
4. After I confirm, merge claude/production-audit-fixes into claude/hopeful-franklin-c3fvas
   (this deploys production), then verify the live domain: all pages 200, robots.txt,
   sitemap.xml, canonical URLs on the new domain, HTTPS working.
Ask me before any production change.
```

---

## 2. Connecting the new domain (step by step)

1. **Vercel → project `bit-of-love` → Settings → Domains → Add**: add `yourdomain.com` and `www.yourdomain.com`.
   Set one of them to redirect to the other (recommended: `www` → apex).
2. **At your domain registrar (GoDaddy, Hostinger, etc.)**: add exactly the DNS records Vercel shows
   on that Domains screen (usually an `A` record for the apex and a `CNAME` for `www`).
   Use the values Vercel shows, because they can differ per project.
3. Wait for Vercel to show **Valid Configuration**. HTTPS is issued automatically.
4. **Vercel → Settings → Environment Variables**: add `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
   (Production). Every canonical URL, Open Graph link, `robots.txt` and `sitemap.xml` follows this
   automatically (see `src/lib/site.ts`).
5. Deploy the fixes (merge the branch, see the prompt above), then submit
   `https://yourdomain.com/sitemap.xml` in Google Search Console.

**Duplicate project:** `bit_of-_love` (with underscores) is a second Vercel project that deploys the
same branch. Attach the domain only to **`bit-of-love`**. Consider deleting the duplicate from the
Vercel dashboard to avoid confusion.

---

## 3. Still needed before taking real orders (owner decisions)

| # | Item | Why | How |
|---|------|-----|-----|
| 1 | **Database** (Critical) | Vercel's disk is read-only, so orders, table and cottage bookings and catering requests **cannot be saved** without it. Until then, the forms show a pre-filled **"Send on WhatsApp"** and **Call** fallback instead of a fake "confirmed". | Create a Supabase project (Mumbai) → run `supabase/schema.sql` → add `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` to Vercel (Production + Preview) → redeploy. Then `/admin` shows real data. |
| 2 | Instagram link | The "Follow LOVBITES" button points to instagram.com's homepage. | Put the real handle in `src/components/sections/InstagramWall.tsx`. |
| 3 | Payment gateway | UPI/Card are only recorded as a preference, and nothing is charged. | Razorpay or similar. |
| 4 | Real food photos | Menu cards use colour placeholders on purpose (no stock/AI photos). | Real photo shoot → replace `FoodImage`. |
| 5 | Admin password | One shared password. | Keep it strong in Vercel env `ADMIN_PASSWORD`. |
| 6 | Open PR #1 | `claude/festive-maxwell-5jov8h` (WhatsApp bulk broadcasts) was never merged. | Review separately. |

`brand/lovbites-logo-original.jpg` is the high-resolution official logo (2481×1754) supplied by the
owner. It can be used to regenerate a crisper `public/logo-mark.png` if wanted.

---

## 4. Audit summary (what was fixed on this branch)

**Critical / security**
- Order API trusted prices sent by the browser, so anyone could order at any price. Prices and
  names are now rebuilt from `menu-data.ts` on the server.
- Cottage bookings recorded the full price as "advance paid" though nothing was paid. Now `0`.
- Storage on Vercel would fail (read-only filesystem). There's now a Supabase backend switch plus an
  honest 503 and WhatsApp fallback.
- All APIs: safe JSON parsing, length caps, Indian mobile validation, India-time date checks,
  allow-lists. Admin login locks out after 5 wrong attempts for 15 minutes.
- Security headers (nosniff, frame, referrer, permissions, HSTS), `no-store` on APIs.

**SEO**: the site URL was `lovbites.example`, so all OG and canonical links were wrong. That's fixed,
and there are now canonical URLs, an OG/Twitter image, Restaurant JSON-LD, `robots.txt`,
`sitemap.xml`, unique titles for Order/Table/Catering, `noindex` on `/admin`, and a homepage H1.

**Responsive / accessibility**: the homepage scrolled sideways on phones and tablets (up to 198px).
Fixed and verified at 320/375/430/768/1024/1440/1920 on all 7 pages. The header no longer wraps on
laptops. Form labels are linked to their inputs, with a skip link and visible focus rings.

**Verified on the preview build** (`next build` + TypeScript passed; 18 routes):
- 10 API tests passed, including a price-tampering attempt being rejected and the admin lockout (429).
- The order flow from menu → cart → checkout → WhatsApp fallback works end to end.
- Warm load: TTFB ~90 ms, LCP ~0.55 s, CLS 0.

**Not verified yet:** ESLint (not run by `next build` in Next 16, and npm wasn't reachable in the audit
sandbox). Saving to a real database (none configured). Production and custom domain (not deployed).
