import Link from "next/link";
import LovbitesLogo from "@/components/ui/LovbitesLogo";

export default function SiteFooter() {
  return (
    <footer className="bg-white text-lb-charcoal border-t border-lb-charcoal/10">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8 py-14 md:py-20 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <LovbitesLogo size="sm" showTagline={false} align="start" />
          <p className="mt-3 max-w-sm text-sm text-lb-neutral">
            When hunger strikes, you know where to go. Dhanbad, Jharkhand —
            food, coffee, protein and private cottages, all in one address.
          </p>
        </div>
        <div>
          <p className="font-number text-xs uppercase tracking-[0.25em] text-lb-neutral/70 mb-4">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/menu" className="hover:text-lb-red">Digital Menu</Link></li>
            <li><Link href="/order" className="hover:text-lb-red">Order Online</Link></li>
            <li><Link href="/cottages" className="hover:text-lb-red">Private Cottages</Link></li>
            <li><Link href="/table" className="hover:text-lb-red">Book a Table</Link></li>
            <li><Link href="/catering" className="hover:text-lb-red">Catering</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-number text-xs uppercase tracking-[0.25em] text-lb-neutral/70 mb-4">
            Visit
          </p>
          <ul className="space-y-2 text-sm text-lb-neutral">
            <li>Ground Floor, Om Sai Plaza</li>
            <li>Police Line Road, Near HDFC Bank</li>
            <li>Dhanbad, Jharkhand – 826001</li>
            <li>
              <a
                href="https://maps.app.goo.gl/TyxkmDjfmrHax2Ne9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lb-red underline underline-offset-2"
              >
                Get Directions
              </a>
            </li>
            <li><a href="tel:+919031627293" className="hover:text-lb-red">+91 90316 27293</a></li>
            <li>
              <a
                href="https://wa.me/919031627293"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lb-red"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-lb-charcoal/10 py-6 px-5 md:px-8 text-xs text-lb-neutral/60 flex flex-col md:flex-row gap-2 md:gap-6 justify-between mx-auto max-w-[1600px]">
        <p>© {new Date().getFullYear()} LOVBITES Hospitality Group.</p>
        <p>Menu prices in ₹ INR. Availability subject to change.</p>
      </div>
    </footer>
  );
}
