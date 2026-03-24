import { Router, type Request } from "express";
import jwt from "jsonwebtoken";
import { db, pool } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "indexify-secret-key-2026";

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
  // Honour reverse-proxy headers so this works correctly on indexify.co.za and any other domain
  const proto = (req.headers["x-forwarded-proto"] as string) ?? req.protocol ?? "https";
  const host = (req.headers["x-forwarded-host"] as string) ?? req.headers.host ?? "indexify.co.za";
  return `${proto}://${host}`;
}

function getRedirectUri(req: Request): string {
  return process.env.GOOGLE_ADS_REDIRECT_URI ?? `${getBaseUrl(req)}/api/auth/google-ads/callback`;
}

/**
 * After the OAuth callback completes we redirect the user's browser back to the
 * portal/admin UI.  We derive the site origin from GOOGLE_ADS_REDIRECT_URI so
 * the redirect always lands on the correct domain (e.g. indexify.co.za) even
 * when the callback request arrives via Replit's internal proxy.
 */
function getSiteBaseUrl(req: Request): string {
  const configuredUri = process.env.GOOGLE_ADS_REDIRECT_URI;
  if (configuredUri) {
    try {
      const u = new URL(configuredUri);
      return `${u.protocol}//${u.host}`;
    } catch {}
  }
  return getBaseUrl(req);
}

async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ access_token?: string; refresh_token?: string; error?: string; error_description?: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json() as { access_token?: string };
  return data.access_token ?? null;
}

async function listFirstCustomerId(accessToken: string): Promise<string | null> {
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!devToken) return null;
  try {
    const res = await fetch("https://googleads.googleapis.com/v17/customers:listAccessibleCustomers", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": devToken,
      },
    });
    const data = await res.json() as { resourceNames?: string[] };
    const first = data.resourceNames?.[0];
    return first ? first.replace("customers/", "") : null;
  } catch {
    return null;
  }
}

async function fetchMetricsWithToken(
  accessToken: string,
  customerId: string,
  managerId?: string
): Promise<GadsMetrics> {
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!devToken) return { status: "error", error: "Developer token not configured" };

  const cleanId = customerId.replace(/-/g, "");
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
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
    return { status: "error", customerId, error: String(gadsData.error?.message ?? JSON.stringify(gadsData.error)) };
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
}

async function fetchGoogleAdsMetrics(user: { id: number; googleAdsCustomerId: string | null; googleAdsRefreshToken: string | null }): Promise<GadsMetrics> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

  // ── Client has their own connected account ──
  if (user.googleAdsRefreshToken && user.googleAdsCustomerId) {
    if (!clientId || !clientSecret) return { status: "pending_oauth" };
    const accessToken = await refreshAccessToken(user.googleAdsRefreshToken);
    if (!accessToken) return { status: "error", error: "Could not refresh your Google Ads token. Try reconnecting." };
    return fetchMetricsWithToken(accessToken, user.googleAdsCustomerId);
  }

  // ── Client has a Customer ID set by admin but no personal refresh token ──
  if (user.googleAdsCustomerId && !user.googleAdsRefreshToken) {
    // Fall back to agency-level credentials
    const agencyRefresh = process.env.GOOGLE_ADS_REFRESH_TOKEN ?? await getSetting("google_ads_refresh_token");
    const managerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID;
    if (!clientId || !clientSecret || !agencyRefresh) return { status: "pending_oauth", customerId: user.googleAdsCustomerId };
    const accessToken = await refreshAccessToken(agencyRefresh);
    if (!accessToken) return { status: "error", error: "Agency token refresh failed" };
    return fetchMetricsWithToken(accessToken, user.googleAdsCustomerId, managerId);
  }

  // ── Nothing linked ──
  return { status: "not_linked" };
}

// ── Client portal: get metrics ──
router.get("/portal/google-ads", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });
    const data = await fetchGoogleAdsMetrics(user);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Failed to fetch Google Ads data" });
  }
});

// ── Client portal: get OAuth URL (returns JSON, client then redirects) ──
router.get("/portal/google-ads/auth-url", requireAuth, (req, res) => {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ error: "Google Ads integration not configured yet. Contact your account manager." });
  }

  const redirectUri = getRedirectUri(req);
  const userId = req.auth!.userId;

  // Sign a short-lived token containing userId + the exact redirectUri used here.
  // The callback verifies this signature — no database lookup needed, works across environments.
  const statePayload = jwt.sign({ userId, redirectUri }, JWT_SECRET, { expiresIn: "15m" });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "https://www.googleapis.com/auth/adwords");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", `client_${statePayload}`);
  res.json({ url: url.toString() });
});

// ── Client portal: disconnect Google Ads ──
router.delete("/portal/google-ads", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    await db.update(usersTable)
      .set({ googleAdsRefreshToken: null, googleAdsCustomerId: null })
      .where(eq(usersTable.id, uid));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to disconnect" });
  }
});

// ── Admin: set Google Ads Customer ID for a client ──
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

// ── Admin: agency-level connection status ──
router.get("/admin/google-ads/status", requireAdmin, async (_req, res) => {
  try {
    const hasEnvToken = !!process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const hasDbToken = !!(await getSetting("google_ads_refresh_token"));
    const hasClientId = !!process.env.GOOGLE_ADS_CLIENT_ID;
    const hasClientSecret = !!process.env.GOOGLE_ADS_CLIENT_SECRET;
    const hasDevToken = !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const connected = (hasEnvToken || hasDbToken) && hasClientId && hasClientSecret && hasDevToken;
    res.json({ connected, source: hasEnvToken ? "env" : hasDbToken ? "db" : "none", hasClientId, hasClientSecret, hasDevToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get status" });
  }
});

// ── Admin: get agency-level OAuth URL (returns JSON, dashboard then redirects) ──
router.get("/admin/google-ads/auth-url", requireAdmin, (req, res) => {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!clientId) return res.status(503).json({ error: "GOOGLE_ADS_CLIENT_ID not configured." });
  const redirectUri = getRedirectUri(req);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "https://www.googleapis.com/auth/adwords");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", "admin");
  res.json({ url: url.toString() });
});

// ── Shared OAuth callback (handles both admin and client flows) ──
router.get("/auth/google-ads/callback", async (req, res) => {
  const baseUrl = getSiteBaseUrl(req);
  const { code, state, error } = req.query as { code?: string; state?: string; error?: string };

  if (error || !code) {
    const msg = encodeURIComponent(error ?? "No authorisation code received");
    const dest = state?.startsWith("client_") ? "portal" : "admin";
    return res.redirect(`${baseUrl}/${dest}?gads=error&msg=${msg}`);
  }

  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    const dest = state?.startsWith("client_") ? "portal" : "admin";
    return res.redirect(`${baseUrl}/${dest}?gads=error&msg=${encodeURIComponent("OAuth credentials not configured")}`);
  }

  const redirectUri = getRedirectUri(req);

  // ── CLIENT FLOW ──
  if (state?.startsWith("client_")) {
    const stateToken = state.slice("client_".length);

    let userId: number;
    let storedRedirectUri: string;
    try {
      const decoded = jwt.verify(stateToken, JWT_SECRET) as { userId: number; redirectUri: string };
      userId = decoded.userId;
      storedRedirectUri = decoded.redirectUri;
    } catch {
      return res.redirect(`${baseUrl}/portal?gads=error&msg=${encodeURIComponent("Session expired or invalid. Please try connecting again.")}`);
    }

    try {
      // Use the exact same redirectUri that was in the auth request (critical for token exchange)
      const tokens = await exchangeCodeForTokens(code, storedRedirectUri);
      if (!tokens.access_token || !tokens.refresh_token) {
        const msg = tokens.error_description ?? tokens.error ?? "No tokens returned — try connecting again.";
        return res.redirect(`${baseUrl}/portal?gads=error&msg=${encodeURIComponent(msg)}`);
      }

      // Auto-discover the first accessible Google Ads customer account
      const customerId = await listFirstCustomerId(tokens.access_token);

      await db.update(usersTable)
        .set({ googleAdsRefreshToken: tokens.refresh_token, googleAdsCustomerId: customerId })
        .where(eq(usersTable.id, userId));

      return res.redirect(`${baseUrl}/portal?gads=connected`);
    } catch (err: any) {
      console.error("[gads-client-callback]", err);
      return res.redirect(`${baseUrl}/portal?gads=error&msg=${encodeURIComponent(err?.message ?? "Unexpected error")}`);
    }
  }

  // ── ADMIN FLOW ──
  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    if (!tokens.refresh_token) {
      const msg = tokens.error_description ?? tokens.error ?? "No refresh token returned";
      return res.redirect(`${baseUrl}/admin?gads=error&msg=${encodeURIComponent(msg)}`);
    }
    await setSetting("google_ads_refresh_token", tokens.refresh_token);
    res.redirect(`${baseUrl}/admin?gads=connected`);
  } catch (err: any) {
    console.error("[gads-admin-callback]", err);
    res.redirect(`${baseUrl}/admin?gads=error&msg=${encodeURIComponent(err?.message ?? "Unexpected error")}`);
  }
});

export default router;
