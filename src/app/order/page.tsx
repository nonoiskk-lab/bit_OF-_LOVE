"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

type Step = "cart" | "details" | "confirmed";

export default function OrderPage() {
  const { lines, setQuantity, clear } = useCartStore();
  const [step, setStep] = useState<Step>("cart");
  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = cartTotal(lines);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfilment,
          paymentMethod,
          lines: lines.map((l) => ({
            itemId: l.item.id,
            name: l.item.name,
            price: l.item.price,
            quantity: l.quantity,
          })),
          customer: { name, phone, address: fulfilment === "delivery" ? address : undefined },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setOrderId(data.order.id);
      clear();
      setStep("confirmed");
    } catch {
      setError("Couldn't reach the kitchen. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "confirmed" && orderId) {
    return (
      <div className="pt-16 md:pt-20 min-h-[70vh] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-5">❤️</span>
          <h1 className="font-display font-black uppercase text-3xl mb-3">Order Confirmed</h1>
          <p className="text-lb-neutral mb-6">
            Order <span className="font-number font-semibold text-lb-charcoal">{orderId}</span> is
            in the kitchen. We&apos;ll call {phone} to confirm{" "}
            {fulfilment === "delivery" ? "delivery" : "pickup"}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="rounded-full bg-lb-red text-lb-cream px-6 py-3 text-sm font-semibold">
              Order More
            </Link>
            <Link href="/" className="rounded-full border border-lb-charcoal/20 px-6 py-3 text-sm font-semibold">
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="pt-16 md:pt-20 min-h-[70vh] flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <span className="text-5xl block mb-5">🛍</span>
          <h1 className="font-display font-black uppercase text-2xl mb-3">
            Your Cravings Are Waiting
          </h1>
          <p className="text-lb-neutral mb-6">Your cart is empty — go find something to love.</p>
          <Link href="/menu" className="rounded-full bg-lb-red text-lb-cream px-6 py-3 text-sm font-semibold">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 px-5 md:px-8 py-10 md:py-16 max-w-2xl mx-auto">
      <h1 className="font-display font-black uppercase text-3xl md:text-4xl mb-8">
        {step === "cart" ? "Your Order" : "Checkout"}
      </h1>

      {step === "cart" && (
        <>
          <div className="flex gap-3 mb-8">
            {(["delivery", "pickup"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFulfilment(f)}
                className={`flex-1 rounded-xl border py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  fulfilment === f
                    ? "border-lb-red bg-lb-red text-lb-cream"
                    : "border-lb-charcoal/15 text-lb-charcoal"
                }`}
              >
                {f === "delivery" ? "Delivery" : "Pickup"}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            {lines.map((line) => (
              <div key={line.item.id} className="flex items-center gap-4 border-b border-lb-charcoal/10 pb-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{line.item.name}</p>
                  <p className="text-xs text-lb-neutral">{line.categoryTitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(line.item.id, line.quantity - 1)}
                    className="h-8 w-8 rounded-full border border-lb-charcoal/20"
                  >
                    −
                  </button>
                  <span className="font-number w-4 text-center">{line.quantity}</span>
                  <button
                    onClick={() => setQuantity(line.item.id, line.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-lb-charcoal/20"
                  >
                    +
                  </button>
                </div>
                <span className="font-number font-semibold text-lb-red w-20 text-right">
                  {formatPrice(line.item.price * line.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="font-semibold">Subtotal</span>
            <span className="font-number text-xl font-bold">{formatPrice(total)}</span>
          </div>

          <button
            onClick={() => setStep("details")}
            className="w-full rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold hover:bg-lb-red-deep transition-colors"
          >
            Continue to Checkout
          </button>
        </>
      )}

      {step === "details" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Full Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm focus:border-lb-red focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm focus:border-lb-red focus:outline-none"
            />
          </div>
          {fulfilment === "delivery" && (
            <div>
              <label className="block text-sm font-semibold mb-1.5">Delivery Address</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-lb-charcoal/20 px-4 py-3 text-sm focus:border-lb-red focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Payment</label>
            <div className="grid grid-cols-3 gap-2">
              {(["upi", "card", "cod"] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`rounded-lg border py-2.5 text-xs font-semibold uppercase transition-colors ${
                    paymentMethod === m
                      ? "border-lb-red bg-lb-red text-lb-cream"
                      : "border-lb-charcoal/15"
                  }`}
                >
                  {m === "upi" ? "UPI" : m === "card" ? "Card" : "Cash on Delivery"}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-lb-red">{error}</p>}

          <div className="flex items-center justify-between py-4 border-t border-lb-charcoal/10">
            <span className="font-semibold">Total</span>
            <span className="font-number text-xl font-bold">{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-lb-red text-lb-cream py-4 text-sm font-semibold hover:bg-lb-red-deep transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing Order…" : `Place Order — ${formatPrice(total)}`}
          </button>
          <button
            type="button"
            onClick={() => setStep("cart")}
            className="w-full text-sm text-lb-neutral underline"
          >
            Back to cart
          </button>
        </form>
      )}
    </div>
  );
}
