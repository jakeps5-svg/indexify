const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const SECRET = process.env.RECAPTCHA_SECRET_KEY ?? "";
const SCORE_THRESHOLD = 0.5;

export async function verifyRecaptcha(token: string | undefined, action?: string): Promise<{ ok: boolean; score?: number; reason?: string }> {
  if (!SECRET) {
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping verification");
    return { ok: true };
  }
  if (!token) {
    return { ok: false, reason: "Missing reCAPTCHA token" };
  }
  try {
    const body = new URLSearchParams({ secret: SECRET, response: token });
    const res = await fetch(RECAPTCHA_VERIFY_URL, { method: "POST", body });
    const data = await res.json() as {
      success: boolean;
      score: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      return { ok: false, reason: `reCAPTCHA failed: ${(data["error-codes"] ?? []).join(", ")}` };
    }
    if (action && data.action && data.action !== action) {
      return { ok: false, reason: `reCAPTCHA action mismatch: expected ${action}, got ${data.action}` };
    }
    if (data.score < SCORE_THRESHOLD) {
      return { ok: false, score: data.score, reason: `reCAPTCHA score too low: ${data.score}` };
    }
    return { ok: true, score: data.score };
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return { ok: false, reason: "reCAPTCHA verification request failed" };
  }
}
