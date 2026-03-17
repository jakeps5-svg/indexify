import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const SITE_BASE = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}`;

export interface CheckoutOptions {
  service: string;
  amountInCents: number;
  type: string;
  metadata?: Record<string, string>;
  ref?: string;
}

export function useYocoCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(opts: CheckoutOptions) {
    setLoading(true);
    setError(null);

    const refParam = opts.ref ? `&ref=${opts.ref}` : "";
    const successUrl = `${SITE_BASE}/payment-success?type=${opts.type}${refParam}`;
    const cancelUrl = `${SITE_BASE}/payment-cancelled?type=${opts.type}${refParam}`;
    const failureUrl = `${SITE_BASE}/payment-cancelled?type=${opts.type}${refParam}&failed=1`;

    try {
      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: opts.service,
          amountInCents: opts.amountInCents,
          successUrl,
          cancelUrl,
          failureUrl,
          metadata: opts.metadata,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      const data = await res.json() as { redirectUrl: string };
      window.location.href = data.redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(msg);
      setLoading(false);
    }
  }

  return { startCheckout, loading, error };
}
