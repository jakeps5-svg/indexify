import { Router } from "express";

const router = Router();

router.post("/charge", async (req, res) => {
  try {
    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) throw new Error("YOCO_SECRET_KEY is not configured");

    const { token, amountInCents, service } = req.body as {
      token: string;
      amountInCents: number;
      service: string;
    };

    if (!token || !amountInCents) {
      return res.status(400).json({ error: "Missing token or amountInCents" });
    }

    const chargeRes = await fetch("https://online.yoco.com/v1/charges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Secret-Key": secretKey,
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency: "ZAR",
        metadata: { service },
      }),
    });

    const chargeData = await chargeRes.json() as {
      id?: string;
      status?: string;
      errorCode?: string;
      errorMessage?: string;
      displayMessage?: string;
    };

    if (!chargeRes.ok || chargeData.status !== "successful") {
      const msg =
        chargeData.displayMessage ??
        chargeData.errorMessage ??
        `Charge failed (${chargeRes.status})`;
      console.error("[charge] Yoco error:", chargeData);
      return res.status(402).json({ error: msg });
    }

    console.log(`[charge] success id=${chargeData.id} service="${service}" amount=${amountInCents}`);
    return res.json({ chargeId: chargeData.id, status: "successful" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[charge] error:", message);
    return res.status(500).json({ error: message });
  }
});

interface YocoCheckoutRequest {
  amountInCents: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  metadata?: Record<string, string>;
}

interface YocoCheckoutResponse {
  id: string;
  redirectUrl: string;
  status: string;
}

async function createYocoCheckout(body: YocoCheckoutRequest): Promise<YocoCheckoutResponse> {
  const secretKey = process.env.YOCO_SECRET_KEY;
  if (!secretKey) throw new Error("YOCO_SECRET_KEY is not configured");

  const res = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: body.amountInCents,
      currency: body.currency ?? "ZAR",
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      failureUrl: body.failureUrl,
      metadata: body.metadata ?? {},
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Yoco API error ${res.status}: ${err}`);
  }

  return res.json() as Promise<YocoCheckoutResponse>;
}

router.post("/checkout", async (req, res) => {
  try {
    const { service, amountInCents, successUrl, cancelUrl, failureUrl, metadata } = req.body as {
      service: string;
      amountInCents: number;
      successUrl: string;
      cancelUrl: string;
      failureUrl: string;
      metadata?: Record<string, string>;
    };

    if (!service || !amountInCents || !successUrl || !cancelUrl || !failureUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (amountInCents < 100) {
      return res.status(400).json({ error: "Amount must be at least R1 (100 cents)" });
    }

    const checkout = await createYocoCheckout({
      amountInCents,
      currency: "ZAR",
      successUrl,
      cancelUrl,
      failureUrl,
      metadata: { service, ...(metadata ?? {}) },
    });

    return res.json({ redirectUrl: checkout.redirectUrl, checkoutId: checkout.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[checkout] error:", message);
    return res.status(500).json({ error: message });
  }
});

router.get("/checkout/:id/verify", async (req, res) => {
  try {
    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) throw new Error("YOCO_SECRET_KEY is not configured");

    const apiRes = await fetch(`https://payments.yoco.com/api/checkouts/${req.params.id}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      throw new Error(`Yoco verify error ${apiRes.status}: ${err}`);
    }

    const data = await apiRes.json() as { status: string; id: string };
    return res.json({ status: data.status, id: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

export default router;
