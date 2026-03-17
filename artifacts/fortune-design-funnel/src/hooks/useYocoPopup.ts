import { useState, useEffect } from "react";

const PUBLIC_KEY = import.meta.env.VITE_YOCO_PUBLIC_KEY as string;
const API_BASE = import.meta.env.VITE_API_URL ?? "";

declare global {
  interface Window {
    YocoSDK: new (opts: { publicKey: string }) => YocoSDKInstance;
  }
}

interface YocoSDKInstance {
  showPopup(opts: {
    amountInCents: number;
    currency: string;
    name: string;
    description?: string;
    callback: (result: { id?: string; error?: { message: string } }) => void;
  }): void;
}

let sdkLoadPromise: Promise<void> | null = null;

function loadYocoSDK(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;
  if (typeof window.YocoSDK !== "undefined") return Promise.resolve();

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Yoco SDK"));
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

export interface PopupOptions {
  amountInCents: number;
  name: string;
  description?: string;
  service: string;
  onSuccess?: (chargeId: string) => void;
  onError?: (message: string) => void;
}

export function useYocoPopup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadYocoSDK().catch(() => {});
  }, []);

  async function showPopup(opts: PopupOptions) {
    setLoading(true);
    setError(null);

    try {
      await loadYocoSDK();
    } catch {
      setError("Could not load payment form. Please try again.");
      setLoading(false);
      return;
    }

    const sdk = new window.YocoSDK({ publicKey: PUBLIC_KEY });

    sdk.showPopup({
      amountInCents: opts.amountInCents,
      currency: "ZAR",
      name: opts.name,
      description: opts.description,
      callback: async (result) => {
        if (result.error) {
          setError(result.error.message ?? "Payment was declined. Please try again.");
          setLoading(false);
          opts.onError?.(result.error.message);
          return;
        }

        const token = result.id;
        if (!token) {
          setError("No payment token received. Please try again.");
          setLoading(false);
          return;
        }

        try {
          const res = await fetch(`${API_BASE}/api/charge`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              amountInCents: opts.amountInCents,
              service: opts.service,
            }),
          });

          const data = await res.json() as { chargeId?: string; error?: string };

          if (!res.ok) {
            throw new Error(data.error ?? `Payment failed (${res.status})`);
          }

          setLoading(false);
          opts.onSuccess?.(data.chargeId ?? "");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Payment processing failed. Please try again.";
          setError(msg);
          setLoading(false);
          opts.onError?.(msg);
        }
      },
    });

    setLoading(false);
  }

  return { showPopup, loading, error, clearError: () => setError(null) };
}
