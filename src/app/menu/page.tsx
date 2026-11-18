import type { Metadata } from "next";
import MenuClient from "./MenuClient";
import { ALL_ITEMS, MENU } from "@/lib/menu-data";
import { getMenuImage } from "@/lib/menu-images";
import { SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/menu" },
  title: "Digital Menu",
  description: `The full LOVBITES menu — ${ALL_ITEMS.length} dishes: desi breakfast, kebabs & tandoor, curries, biryani, Indo-Chinese, pizza, pasta, burgers, shakes, mocktails and desserts. Hirapur, Dhanbad.`,
};

/** schema.org Menu built from the same data the page renders — prices only where real. */
function menuJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${SITE.name} Menu`,
    url: `${SITE_URL}/menu`,
    inLanguage: "en-IN",
    hasMenuSection: MENU.map((category) => ({
      "@type": "MenuSection",
      name: category.title,
      ...(category.availability ? { description: `Available ${category.availability}` } : {}),
      hasMenuItem: category.items.map((item) => {
        const photo = getMenuImage(item.id);
        return {
          "@type": "MenuItem",
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
          ...(photo ? { image: `${SITE_URL}${photo.src}` } : {}),
          ...(item.diet === "veg" ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
          ...(item.askPrice
            ? {}
            : { offers: { "@type": "Offer", price: item.price, priceCurrency: "INR" } }),
        };
      }),
    })),
  };
}

interface MenuPageProps {
  searchParams: Promise<{ group?: string; mood?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd()).replace(/</g, "\\u003c") }}
      />
      <MenuClient initialGroup={params.group} mood={params.mood} />
    </>
  );
}
