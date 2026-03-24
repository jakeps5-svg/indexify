import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

interface GadsMetrics {
  status: "connected" | "not_linked" | "pending_oauth" | "error";
  customerId?: string;
  accountName?: string;
  dateRange?: string;
  campaigns?: CampaignRow[];
  totals?: Totals;
  error?: string;
}

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

async function fetchGoogleAdsMetrics(customerId: string): Promise<GadsMetrics> {
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const managerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID;

  if (!devToken || !clientId || !clientSecret || !refreshToken) {
    return { status: "pending_oauth", customerId };
  }

  try {
    // Step 1: Refresh the access token
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

    // Step 2: Query Google Ads API
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

    return {
      status: "connected",
      customerId,
      dateRange: "Last 30 days",
      campaigns,
      totals,
    };
  } catch (err: any) {
    return { status: "error", customerId, error: err?.message ?? "Unknown error" };
  }
}

router.get("/portal/google-ads", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
    if (!user?.googleAdsCustomerId) {
      return res.json({ status: "not_linked" });
    }
    const data = await fetchGoogleAdsMetrics(user.googleAdsCustomerId);
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

export default router;
