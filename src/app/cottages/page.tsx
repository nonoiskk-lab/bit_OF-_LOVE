import type { Metadata } from "next";
import CottagesClient from "./CottagesClient";

export const metadata: Metadata = {
  title: "Private Cottages",
  description:
    "Book one of two private cottages at LOVBITES, Hirapur — for dates, birthdays, anniversaries and celebrations.",
};

interface CottagesPageProps {
  searchParams: Promise<{ select?: string }>;
}

export default async function CottagesPage({ searchParams }: CottagesPageProps) {
  const params = await searchParams;
  return <CottagesClient initialSelect={params.select} />;
}
