import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  usersTable, subscriptionsTable, invoicesTable,
  chatMessagesTable, meetingRequestsTable, serviceUpdatesTable,
} from "@workspace/db/schema";
import { eq, and, desc, ne } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";
import { sendInvoiceEmail } from "../lib/email.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Safe path resolution that works in both ESM (dev/tsx) and CJS (esbuild production bundle).
const UPLOADS_DIR = (() => {
  try {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../uploads");
  } catch {
    return path.resolve(process.cwd(), "artifacts/api-server/uploads");
  }
})();

const router = Router();

// ── Customers ──────────────────────────────────────────────────────────────

router.get("/admin/customers", requireAdmin, async (req, res) => {
  try {
    const customers = await db.select().from(usersTable).where(ne(usersTable.role, "admin")).orderBy(desc(usersTable.createdAt));
    const result = await Promise.all(customers.map(async (c) => {
      const subs = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.userId, c.id));
      const invoiceList = await db.select().from(invoicesTable).where(eq(invoicesTable.userId, c.id));
      const unread = await db.select().from(chatMessagesTable)
        .where(and(eq(chatMessagesTable.userId, c.id), eq(chatMessagesTable.sender, "customer"), eq(chatMessagesTable.read, false)));
      return { ...c, subscriptions: subs, invoices: invoiceList, unreadMessages: unread.length };
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load customers" });
  }
});

router.post("/admin/customers", requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, company, password } = req.body as {
      name: string; email: string; phone?: string; company?: string; password: string;
    };
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password required" });
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      name, email: email.toLowerCase().trim(), phone: phone ?? null,
      company: company ?? null, passwordHash, role: "customer",
    }).returning();
    res.json(user);
  } catch (err: any) {
    if (err?.code === "23505") return res.status(409).json({ error: "Email already exists" });
    console.error(err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

router.delete("/admin/customers/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Cascade: chat → meetings → service updates → invoices → subscriptions → user
    await db.delete(chatMessagesTable).where(eq(chatMessagesTable.userId, id));
    await db.delete(meetingRequestsTable).where(eq(meetingRequestsTable.userId, id));
    await db.delete(serviceUpdatesTable).where(eq(serviceUpdatesTable.userId, id));
    await db.delete(invoicesTable).where(eq(invoicesTable.userId, id));
    await db.delete(subscriptionsTable).where(eq(subscriptionsTable.userId, id));
    await db.delete(usersTable).where(eq(usersTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

// ── Subscriptions ──────────────────────────────────────────────────────────

router.post("/admin/subscriptions", requireAdmin, async (req, res) => {
  try {
    const { userId, serviceName, serviceSlug, priceRands, notes } = req.body as {
      userId: number; serviceName: string; serviceSlug: string; priceRands: string; notes?: string;
    };
    const nextInvoiceDate = new Date();
    nextInvoiceDate.setMonth(nextInvoiceDate.getMonth() + 1);
    const [sub] = await db.insert(subscriptionsTable).values({
      userId, serviceName, serviceSlug, priceRands,
      status: "active", nextInvoiceDate, notes: notes ?? null,
    }).returning();
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

router.patch("/admin/subscriptions/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, serviceName, serviceSlug, priceRands, notes } = req.body as {
      status?: "active" | "paused" | "cancelled";
      serviceName?: string; serviceSlug?: string; priceRands?: string; notes?: string;
    };
    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (serviceName !== undefined) updates.serviceName = serviceName;
    if (serviceSlug !== undefined) updates.serviceSlug = serviceSlug;
    if (priceRands !== undefined) updates.priceRands = priceRands;
    if (notes !== undefined) updates.notes = notes;
    const [sub] = await db.update(subscriptionsTable).set(updates).where(eq(subscriptionsTable.id, id)).returning();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: "Failed to update subscription" });
  }
});

router.delete("/admin/subscriptions/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(serviceUpdatesTable).where(eq(serviceUpdatesTable.subscriptionId, id));
    await db.delete(invoicesTable).where(eq(invoicesTable.subscriptionId, id));
    await db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subscription" });
  }
});

// ── Invoices ───────────────────────────────────────────────────────────────

router.get("/admin/invoices", requireAdmin, async (req, res) => {
  try {
    const invoices = await db.select({
      id: invoicesTable.id,
      invoiceNumber: invoicesTable.invoiceNumber,
      amountRands: invoicesTable.amountRands,
      description: invoicesTable.description,
      status: invoicesTable.status,
      dueDate: invoicesTable.dueDate,
      sentAt: invoicesTable.sentAt,
      paidAt: invoicesTable.paidAt,
      createdAt: invoicesTable.createdAt,
      userId: invoicesTable.userId,
      subscriptionId: invoicesTable.subscriptionId,
      customerName: usersTable.name,
      customerEmail: usersTable.email,
    }).from(invoicesTable)
      .leftJoin(usersTable, eq(invoicesTable.userId, usersTable.id))
      .orderBy(desc(invoicesTable.createdAt));
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to load invoices" });
  }
});

router.post("/admin/invoices", requireAdmin, async (req, res) => {
  try {
    const { userId, subscriptionId, amountRands, description, dueDate } = req.body as {
      userId: number; subscriptionId?: number; amountRands: string; description: string; dueDate: string;
    };
    const count = await db.select().from(invoicesTable);
    const invoiceNumber = `INV-${String(count.length + 1).padStart(4, "0")}`;
    const [invoice] = await db.insert(invoicesTable).values({
      userId, subscriptionId: subscriptionId ?? null,
      invoiceNumber, amountRands, description,
      status: "pending", dueDate: new Date(dueDate),
    }).returning();
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

router.post("/admin/invoices/:id/send", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, invoice.userId));
    if (!user) return res.status(404).json({ error: "User not found" });
    await sendInvoiceEmail({
      to: user.email, name: user.name, invoiceNumber: invoice.invoiceNumber,
      description: invoice.description, amountRands: String(invoice.amountRands),
      dueDate: new Date(invoice.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }),
    });
    const [updated] = await db.update(invoicesTable)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(invoicesTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send invoice" });
  }
});

router.patch("/admin/invoices/:id/paid", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [updated] = await db.update(invoicesTable)
      .set({ status: "paid", paidAt: new Date() })
      .where(eq(invoicesTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark invoice as paid" });
  }
});

// ── Chat ───────────────────────────────────────────────────────────────────

router.get("/admin/chat/:userId", requireAdmin, async (req, res) => {
  try {
    const uid = Number(req.params.userId);
    const messages = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.userId, uid))
      .orderBy(chatMessagesTable.createdAt);
    await db.update(chatMessagesTable)
      .set({ read: true })
      .where(and(eq(chatMessagesTable.userId, uid), eq(chatMessagesTable.sender, "customer")));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chat" });
  }
});

router.post("/admin/chat/:userId", requireAdmin, async (req, res) => {
  try {
    const uid = Number(req.params.userId);
    const { message, attachmentUrl, attachmentName, attachmentMime } = req.body as {
      message: string; attachmentUrl?: string; attachmentName?: string; attachmentMime?: string;
    };
    if (!message?.trim() && !attachmentUrl) return res.status(400).json({ error: "Message or attachment required" });
    const [msg] = await db.insert(chatMessagesTable).values({
      userId: uid,
      message: message?.trim() || "",
      sender: "admin",
      read: false,
      attachmentUrl: attachmentUrl ?? null,
      attachmentName: attachmentName ?? null,
      attachmentMime: attachmentMime ?? null,
    }).returning();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ── File Uploads ───────────────────────────────────────────────────────────

router.post("/admin/uploads", requireAdmin, async (req, res) => {
  try {
    const { attachmentBase64, attachmentName, attachmentMime } = req.body as {
      attachmentBase64: string; attachmentName: string; attachmentMime?: string;
    };
    if (!attachmentBase64 || !attachmentName) {
      return res.status(400).json({ error: "attachmentBase64 and attachmentName required" });
    }
    const buf = Buffer.from(attachmentBase64, "base64");
    const ext = attachmentName.split(".").pop()?.toLowerCase() ?? "bin";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, safeName), buf);
    res.json({ url: `/api/uploads/${safeName}`, name: attachmentName, mime: attachmentMime ?? "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// ── Meetings ───────────────────────────────────────────────────────────────

router.get("/admin/meetings", requireAdmin, async (req, res) => {
  try {
    const meetings = await db.select({
      id: meetingRequestsTable.id,
      preferredDate: meetingRequestsTable.preferredDate,
      preferredTime: meetingRequestsTable.preferredTime,
      meetingType: meetingRequestsTable.meetingType,
      notes: meetingRequestsTable.notes,
      status: meetingRequestsTable.status,
      createdAt: meetingRequestsTable.createdAt,
      userId: meetingRequestsTable.userId,
      customerName: usersTable.name,
      customerEmail: usersTable.email,
    }).from(meetingRequestsTable)
      .leftJoin(usersTable, eq(meetingRequestsTable.userId, usersTable.id))
      .orderBy(desc(meetingRequestsTable.createdAt));
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: "Failed to load meetings" });
  }
});

router.patch("/admin/meetings/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status: "pending" | "confirmed" | "cancelled" };
    const [updated] = await db.update(meetingRequestsTable)
      .set({ status })
      .where(eq(meetingRequestsTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update meeting" });
  }
});

// ── Service Updates ────────────────────────────────────────────────────────

router.get("/admin/updates", requireAdmin, async (req, res) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const query = db.select({
      id: serviceUpdatesTable.id,
      userId: serviceUpdatesTable.userId,
      subscriptionId: serviceUpdatesTable.subscriptionId,
      title: serviceUpdatesTable.title,
      content: serviceUpdatesTable.content,
      attachmentUrl: serviceUpdatesTable.attachmentUrl,
      attachmentName: serviceUpdatesTable.attachmentName,
      attachmentMime: serviceUpdatesTable.attachmentMime,
      createdAt: serviceUpdatesTable.createdAt,
      serviceName: subscriptionsTable.serviceName,
      customerName: usersTable.name,
    }).from(serviceUpdatesTable)
      .leftJoin(subscriptionsTable, eq(serviceUpdatesTable.subscriptionId, subscriptionsTable.id))
      .leftJoin(usersTable, eq(serviceUpdatesTable.userId, usersTable.id))
      .orderBy(desc(serviceUpdatesTable.createdAt));
    const rows = userId
      ? await query.where(eq(serviceUpdatesTable.userId, userId))
      : await query;
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load updates" });
  }
});

router.post("/admin/updates", requireAdmin, async (req, res) => {
  try {
    const { userId, subscriptionId, title, content, attachmentUrl, attachmentName, attachmentMime } = req.body as {
      userId: number; subscriptionId?: number; title: string; content: string;
      attachmentUrl?: string; attachmentName?: string; attachmentMime?: string;
    };
    if (!userId || !title || !content) return res.status(400).json({ error: "userId, title and content required" });
    const [update] = await db.insert(serviceUpdatesTable).values({
      userId, subscriptionId: subscriptionId ?? null, title, content,
      attachmentUrl: attachmentUrl ?? null,
      attachmentName: attachmentName ?? null,
      attachmentMime: attachmentMime ?? null,
    }).returning();
    res.status(201).json(update);
  } catch (err) {
    res.status(500).json({ error: "Failed to create update" });
  }
});

router.delete("/admin/updates/:id", requireAdmin, async (req, res) => {
  try {
    await db.delete(serviceUpdatesTable).where(eq(serviceUpdatesTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete update" });
  }
});

export default router;
