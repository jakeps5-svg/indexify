import { Router } from "express";
import { db } from "@workspace/db";
import { chargesTable } from "@workspace/db/schema";
import { sendProposalUnlockEmail, sendServicePurchaseEmail, sendInternalNotification } from "../lib/email";

const router = Router();

function generateToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "FD-";
  for (let i = 0; i < 8; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

function formatAmount(cents: number): string {
  return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;
}

router.post("/charge", async (req, res) => {
  try {
    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) throw new Error("YOCO_SECRET_KEY is not configured");

    const {
      token,
      amountInCents,
      service,
      name,
      email,
      phone,
      company,
      domain,
      type,
    } = req.body as {
      token: string;
      amountInCents: number;
      service: string;
      name: string;
      email: string;
      phone?: string;
      company?: string;
      domain?: string;
      type?: string;
    };

    if (!token || !amountInCents || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Charge via Yoco
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
        metadata: { service, name, email },
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
        `Payment declined (${chargeRes.status})`;
      console.error("[charge] Yoco error:", chargeData);
      return res.status(402).json({ error: msg });
    }

    const chargeId = chargeData.id ?? "unknown";

    // 2. Generate unlock token
    const unlockToken = generateToken();
    const amountFormatted = formatAmount(amountInCents);
    const isProposal = type === "proposal";

    // 3. Save to database
    await db.insert(chargesTable).values({
      chargeId,
      unlockToken,
      service,
      amountInCents,
      name,
      email,
      phone: phone ?? null,
      company: company ?? null,
      domain: domain ?? null,
    });

    // 4. Send emails (non-blocking)
    void (async () => {
      try {
        if (isProposal) {
          await sendProposalUnlockEmail({
            to: email,
            name,
            domain: domain ?? "your website",
            token: unlockToken,
            amountPaid: amountFormatted,
          });
        } else {
          await sendServicePurchaseEmail({
            to: email,
            name,
            service,
            amountPaid: amountFormatted,
            phone,
            company,
          });
        }

        await sendInternalNotification({
          service,
          name,
          email,
          phone,
          company,
          domain,
          amountPaid: amountFormatted,
          token: isProposal ? unlockToken : undefined,
        });
      } catch (emailErr) {
        console.error("[charge] email error:", emailErr);
      }
    })();

    console.log(`[charge] success chargeId=${chargeId} token=${unlockToken} service="${service}" name="${name}"`);
    return res.json({ chargeId, status: "successful", unlockToken, isProposal });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[charge] error:", message);
    return res.status(500).json({ error: message });
  }
});

router.get("/validate-token", async (req, res) => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) return res.status(400).json({ valid: false });

    const { eq } = await import("drizzle-orm");
    const rows = await db
      .select()
      .from(chargesTable)
      .where(eq(chargesTable.unlockToken, token.toUpperCase().trim()))
      .limit(1);

    if (rows.length === 0) return res.json({ valid: false });
    return res.json({ valid: true, service: rows[0].service });
  } catch (err) {
    return res.status(500).json({ valid: false });
  }
});

export default router;
