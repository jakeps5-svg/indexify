import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken, requireAuth } from "../middlewares/auth.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../lib/email.js";

const router = Router();

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken({ userId: user.id, role: user.role as "customer" | "admin", email: user.email });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body as {
      name: string; email: string; password: string;
      phone?: string; company?: string;
    };
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
    if (existing.length > 0) return res.status(409).json({ error: "An account with this email already exists. Please log in." });

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      role: "customer",
    }).returning();

    await sendWelcomeEmail({ name: user.name, email: user.email }).catch(console.error);

    const token = signToken({ userId: user.id, role: "customer", email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ error: "Email required" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await db.update(usersTable)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(usersTable.id, user.id));

    const frontendUrl = process.env.FRONTEND_URL || "https://indexify.co.za";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail({ name: user.name, email: user.email, resetLink }).catch(console.error);

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body as { token: string; password: string };
    if (!token || !password) return res.status(400).json({ error: "Token and new password required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.resetToken, token));
    if (!user || !user.resetTokenExpiry) return res.status(400).json({ error: "Invalid or expired reset link" });
    if (new Date() > user.resetTokenExpiry) return res.status(400).json({ error: "Reset link has expired. Please request a new one." });

    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(usersTable.id, user.id));

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.auth!.userId));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, company: user.company, phone: user.phone });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
