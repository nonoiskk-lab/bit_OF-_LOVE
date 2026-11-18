/**
 * Single source of truth for business details used by SEO metadata,
 * structured data, robots.txt and sitemap.xml.
 *
 * SITE_URL: set NEXT_PUBLIC_SITE_URL in Vercel once a custom domain is live
 * (e.g. https://lovbites.in) — every canonical/OG URL follows automatically.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bit-of-love.vercel.app").replace(/\/$/, "");

export const SITE = {
  name: "LOVBITES",
  legalName: "LOVBITES Hospitality Group",
  tagline: "Cafe & Kitchen | 8 AM Onwards",
  phoneDisplay: "+91 90316 27293",
  phoneE164: "+919031627293",
  whatsappUrl: "https://wa.me/919031627293",
  mapsUrl: "https://maps.app.goo.gl/TyxkmDjfmrHax2Ne9",
  address: {
    street: "Ground Floor, Om Sai Plaza, Police Line Road, Near HDFC Bank",
    locality: "Dhanbad",
    region: "Jharkhand",
    postalCode: "826001",
    country: "IN",
  },
  opensAt: "08:00",
} as const;
