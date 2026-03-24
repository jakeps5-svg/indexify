import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const TOKEN_KEY = "indexify_portal_token";
const USER_KEY = "indexify_portal_user";

export interface PortalUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  company?: string;
  phone?: string;
}

export function usePortalAuth() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const token = () => localStorage.getItem(TOKEN_KEY);

  const fetchMe = useCallback(async () => {
    const t = token();
    if (!t) {
      const cached = localStorage.getItem(USER_KEY);
      if (cached) { try { setUser(JSON.parse(cached)); } catch {} }
      setLoading(false); return;
    }
    try {
      const res = await fetch(`${BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } else {
        const u = await res.json();
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        setUser(u);
      }
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Login failed");
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user as PortalUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const authFetch = async (url: string, opts: RequestInit = {}) => {
    const t = token();
    return fetch(`${BASE}${url}`, {
      ...opts,
      headers: { ...(opts.headers ?? {}), Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
    });
  };

  return { user, loading, login, logout, authFetch };
}
