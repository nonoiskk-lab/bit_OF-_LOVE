import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "LOVBITES catering for birthdays, office events, parties and celebrations in Dhanbad. Request a quote in minutes.",
  alternates: { canonical: "/catering" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
