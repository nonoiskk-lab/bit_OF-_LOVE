import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Order LOVBITES food online for delivery or pickup in Hirapur, Dhanbad — breakfast, protein bowls, coffee, chicken, biryani and more.",
  alternates: { canonical: "/order" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
