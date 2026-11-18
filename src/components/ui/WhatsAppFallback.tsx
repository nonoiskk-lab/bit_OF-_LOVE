import { SITE } from "@/lib/site";

/**
 * Shown when an order/booking could not be saved online. Gives the customer a
 * one-tap way to send exactly the same details to the restaurant on WhatsApp,
 * so a failed submission never becomes a lost sale.
 */
export default function WhatsAppFallback({ error, message }: { error: string; message: string }) {
  const href = `${SITE.whatsappUrl}?text=${encodeURIComponent(message)}`;
  return (
    <div role="alert" className="rounded-xl border border-lb-red/30 bg-lb-red/5 p-4 text-sm">
      <p className="text-lb-red-deep mb-3">{error}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full bg-[#1f8f4e] px-5 py-2.5 font-semibold text-white hover:opacity-90"
        >
          Send on WhatsApp
        </a>
        <a
          href={`tel:${SITE.phoneE164}`}
          className="inline-flex rounded-full border border-lb-charcoal/20 px-5 py-2.5 font-semibold hover:border-lb-red hover:text-lb-red"
        >
          Call {SITE.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
