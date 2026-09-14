import type { Metadata, Viewport } from "next";
import { Unbounded, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import MobileStickyBar from "@/components/MobileStickyBar";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lovbites.example"),
  title: {
    default: "LOVBITES — When Hunger Strikes | Hirapur, Dhanbad",
    template: "%s | LOVBITES",
  },
  description:
    "LOVBITES — Dhanbad's food, coffee, protein and private-cottage destination in Hirapur. Order online, book a table, or reserve a private cottage for your next date, birthday or celebration.",
  keywords: [
    "restaurant in Dhanbad",
    "cafe in Dhanbad",
    "restaurant in Hirapur",
    "cafe near IIT ISM",
    "protein cafe Dhanbad",
    "healthy food Dhanbad",
    "coffee shop Dhanbad",
    "chicken restaurant Dhanbad",
    "biryani Dhanbad",
    "couple cafe Dhanbad",
    "private cottage restaurant Dhanbad",
    "birthday restaurant Dhanbad",
    "catering Dhanbad",
  ],
  openGraph: {
    title: "LOVBITES — When Hunger Strikes",
    description:
      "A food, coffee, protein and private-cottage destination in Hirapur, Dhanbad.",
    siteName: "LOVBITES",
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf3e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${jakarta.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lb-off-white text-lb-charcoal">
        <Navigation />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileStickyBar />
        <CartDrawer />
      </body>
    </html>
  );
}
