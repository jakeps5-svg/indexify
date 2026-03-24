import { Router, type Request } from "express";
import { db, pool } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

interface CampaignRow {
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  costMicros: number;
}

interface Totals {
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  costZar: number;
  roas: number;
}

interface GadsMetrics {
  status: "connected" | "not_linked" | "pending_oauth" | "error";
  customerId?: string;
  dateRange?: string;
  campaigns?: CampaignRow[];
  totals?: Totals;
  error?: string;
}

async function getSetting(key: string): Promise<string | null> {
  try {
    const r = await pool.query("SELECT value FROM portal_settings WHERE key = $1", [key]);
    return r.rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

async function setSetting(key: string, value: string): Promise<void> {
  await pool.query(`
    INSERT INTO portal_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `, [key, value]);
}

function getBaseUrl(req: Request): string {
  const domain = process.env.REPLIT_DEV_DOMAIN;
  return domain ? `https://${domain}` : `${req.protocol}://${req.get("host")}`;
}

function getRedirectUri(req: Request): string {
  return `${getBaseUrl(req)}/api/auth/google-ads/callback`;
}

async function fetchGoogleAdsMetrics(customerId: string, req?: Request): Promise<GadsMetrics> {
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const managerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID;

  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN || await getSetting("google_ads_refresh_token");

  if (!devToken || !clientId || !clientSecret || !refreshToken) {
    return { status: "pending_oauth", customerId };
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) {
      return { status: "error", customerId, error: "OAuth token refresh failed" };
    }

    const cleanId = customerId.replace(/-/g, "");
    const headers: Record<string, string> = {
      Authorization: `Bearer ${tokenData.access_token}`,
      "developer-token": devToken,
      "Content-Type": "application/json",
    };
    if (managerId) headers["login-customer-id"] = managerId.replace(/-/g, "");

    const query = `
      SELECT
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.average_cpc,
        metrics.conversions,
        metrics.cost_micros
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
      LIMIT 20
    `;

    const gadsRes = await fetch(
      `https://googleads.googleapis.com/v17/customers/${cleanId}/googleAds:search`,
      { method: "POST", headers, body: JSON.stringify({ query }) }
    );
    const gadsData = await gadsRes.json() as { results?: any[]; error?: any };

    if (gadsData.error) {
      return { status: "error", customerId, error: JSON.stringify(gadsData.error?.message ?? gadsData.error) };
    }

    const rows = gadsData.results ?? [];
    const campaigns: CampaignRow[] = rows.map((r: any) => ({
      name: r.campaign?.name ?? "Unknown",
      status: r.campaign?.status ?? "UNKNOWN",
      impressions: Number(r.metrics?.impressions ?? 0),
      clicks: Number(r.metrics?.clicks ?? 0),
      ctr: Number((r.metrics?.ctr ?? 0) * 100),
      avgCpc: Number((r.metrics?.average_cpc ?? 0)) / 1_000_000,
      conversions: Number(r.metrics?.conversions ?? 0),
      costMicros: Number(r.metrics?.cost_micros ?? 0),
    }));

    const totals: Totals = campaigns.reduce(
      (acc, c) => ({
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        ctr: 0,
        avgCpc: 0,
        conversions: acc.conversions + c.conversions,
        costZar: acc.costZar + c.costMicros / 1_000_000,
        roas: 0,
      }),
      { impressions: 0, clicks: 0, ctr: 0, avgCpc: 0, conversions: 0, costZar: 0, roas: 0 }
    );
    totals.ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    totals.avgCpc = totals.clicks > 0 ? totals.costZar / totals.clicks : 0;
    totals.roas = totals.costZar > 0 ? (totals.conversions * 500) / totals.costZar : 0;

    return { status: "connected", customerId, dateRange: "Last 30 days", campaigns, totals };
  } catch (err: any) {
    return { status: "error", customerId, error: err?.message ?? "Unknown error" };
  }
}

router.get("/portal/google-ads", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
    if (!user?.googleAdsCustomerId) return res.json({ status: "not_linked" });
    const data = await fetchGoogleAdsMetrics(user.googleAdsCustomerId, req);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Failed to fetch Google Ads data" });
  }
});

router.patch("/admin/customers/:id/google-ads", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { googleAdsCustomerId } = req.body as { googleAdsCustomerId: string | null };
    const [updated] = await db
      .update(usersTable)
      .set({ googleAdsCustomerId: googleAdsCustomerId ?? null })
      .where(eq(usersTable.id, id))
      .returning();
    res.json({ ok: true, googleAdsCustomerId: updated.googleAdsCustomerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update Google Ads customer ID" });
  }
});

router.get("/admin/google-ads/status", requireAdmin, async (_req, res) => {
  try {
    const hasEnvToken = !!process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const hasDbToken = !!(await getSetting("google_ads_refresh_token"));
    const hasClientId = !!process.env.GOOGLE_ADS_CLIENT_ID;
    const hasClientSecret = !!process.env.GOOGLE_ADS_CLIENT_SECRET;
    const hasDevToken = !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const connected = (hasEnvToken || hasDbToken) && hasClientId && hasClientSecret && hasDevToken;
    res.json({
      connected,
      source: hasEnvToken ? "env" : hasDbToken ? "db" : "none",
      hasClientId,
      hasClientSecret,
      hasDevToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get status" });
  }
});

router.get("/auth/google-ads", requireAdmin, (req, res) => {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!clientId) {
    return res.status(400).send("GOOGLE_ADS_CLIENT_ID environment variable is not set. Please add it first.");
  }
  const redirectUri = getRedirectUri(req);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "https://www.googleapis.com/auth/adwords");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  res.redirect(url.toString());
});

router.get("/auth/google-ads/callback", async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const { code, error } = req.query as { code?: string; error?: string };

  if (error || !code) {
    return res.redirect(`${baseUrl}/admin?gads=error&msg=${encodeURIComponent(error ?? "No authorisation code received")}`);
  }

  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.redirect(`${baseUrl}/admin?gads=error&msg=${encodeURIComponent("Client credentials not configured")}`);
  }

  try {
    const redirectUri = getRedirectUri(req);
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json() as { refresh_token?: string; error?: string; error_description?: string };

    if (!tokenData.refresh_token) {
      const msg = tokenData.error_description ?? tokenData.error ?? "No refresh token returned";
      return res.redirect(`${baseUrl}/admin?gads=error&msg=${encodeURIComponent(msg)}`);
    }

    await setSetting("google_ads_refresh_token", tokenData.refresh_token);
    res.redirect(`${baseUrl}/admin?gads=connected`);
  } catch (err: any) {
    console.error("[gads-callback]", err);
    res.redirect(`${baseUrl}/admin?gads=error&msg=${encodeURIComponent(err?.message ?? "Unexpected error")}`);
  }
});

export default router;
