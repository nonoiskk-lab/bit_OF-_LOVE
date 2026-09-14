import type { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Digital Menu",
  description:
    "The full LOVBITES menu — breakfast, protein, coffee, pizza, chicken, fine dine, biryani and more. Hirapur, Dhanbad.",
};

interface MenuPageProps {
  searchParams: Promise<{ group?: string; mood?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  return <MenuClient initialGroup={params.group} mood={params.mood} />;
}
