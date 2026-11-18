import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Table",
  description:
    "Reserve a table at LOVBITES, Police Line Road, Dhanbad. Indoor or outdoor seating — pick your date, time and party size.",
  alternates: { canonical: "/table" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
