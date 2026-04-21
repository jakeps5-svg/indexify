import { useState, useEffect, useCallback } from "react";

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

function getStoredUser(): PortalUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as PortalUser;
  } catch {}
  return null;
}

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function usePortalAuth() {
  // Initialise synchronously from localStorage so the very first render already
  // has the correct user.  No async gap → no spurious redirect to /login.
  const [user, setUser] = useState<PortalUser | null>(getStoredUser);
  // loading=true only while we are validating a stored token with the server
  const [loading, setLoading] = useState<boolean>(() => !!getStoredToken());

  const validateToken = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      // No token at all — we're done, user stays null
      setLoading(false);
      return;
    }

    // We have a token. Validate it silently in the background.
    try {
      const res = await fetch(`/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401) {
        // Server explicitly rejected the token — clear everything
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } else if (res.ok) {
        const u: PortalUser = await res.json();
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        setUser(u);
      }
      // Any other status (500, network hiccup) → keep the cached user
    } catch {
      // Network error — keep cached user, do not log out
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const login = async (email: string, password: string, recaptchaToken?: string): Promise<PortalUser> => {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, recaptchaToken }),
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
    setLoading(false);
  };

  const authFetch = async (url: string, opts: RequestInit = {}) => {
    const t = getStoredToken();
    return fetch(url, {
      ...opts,
      headers: {
        ...(opts.headers ?? {}),
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
    });
  };

  return { user, loading, login, logout, authFetch };
}
