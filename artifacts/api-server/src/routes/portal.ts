import { Router } from "express";
import { db } from "@workspace/db";
import {
  subscriptionsTable, invoicesTable, chatMessagesTable,
  meetingRequestsTable, usersTable, serviceUpdatesTable,
} from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth.js";
import { sendInvoiceEmail, sendMeetingRequestFromPortal, sendChatNotificationToAdmin } from "../lib/email.js";

const router = Router();

router.get("/portal/dashboard", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
    const subscriptions = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.userId, uid));
    const invoices = await db.select().from(invoicesTable)
      .where(eq(invoicesTable.userId, uid))
      .orderBy(desc(invoicesTable.createdAt))
      .limit(5);
    const unread = await db.select().from(chatMessagesTable)
      .where(and(eq(chatMessagesTable.userId, uid), eq(chatMessagesTable.sender, "admin"), eq(chatMessagesTable.read, false)));
    res.json({ user, subscriptions, recentInvoices: invoices, unreadMessages: unread.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

router.get("/portal/invoices", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const invoices = await db.select().from(invoicesTable)
      .where(eq(invoicesTable.userId, uid))
      .orderBy(desc(invoicesTable.createdAt));
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to load invoices" });
  }
});

router.get("/portal/chat", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const messages = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.userId, uid))
      .orderBy(chatMessagesTable.createdAt);
    await db.update(chatMessagesTable)
      .set({ read: true })
      .where(and(eq(chatMessagesTable.userId, uid), eq(chatMessagesTable.sender, "admin")));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chat" });
  }
});

router.post("/portal/chat", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const { message } = req.body as { message: string };
    if (!message?.trim()) return res.status(400).json({ error: "Message required" });
    const [msg] = await db.insert(chatMessagesTable).values({
      userId: uid,
      message: message.trim(),
      sender: "customer",
      read: false,
    }).returning();
    res.json(msg);
    // Fire-and-forget admin notification
    db.select({ name: usersTable.name, email: usersTable.email })
      .from(usersTable).where(eq(usersTable.id, uid)).then(([user]) => {
        if (user) {
          sendChatNotificationToAdmin({
            clientName: user.name,
            clientEmail: user.email,
            userId: uid,
            messagePreview: message.trim().slice(0, 200),
          }).catch(() => {});
        }
      }).catch(() => {});
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.post("/portal/meeting", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const { preferredDate, preferredTime, meetingType, notes } = req.body as {
      preferredDate: string; preferredTime: string; meetingType: string; notes?: string;
    };
    if (!preferredDate || !preferredTime) return res.status(400).json({ error: "Date and time required" });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
    const [meeting] = await db.insert(meetingRequestsTable).values({
      userId: uid, preferredDate, preferredTime,
      meetingType: meetingType ?? "google-meet",
      notes: notes ?? "",
      status: "pending",
    }).returning();
    try {
      await sendMeetingRequestFromPortal({
        name: user.name, email: user.email, phone: user.phone ?? "",
        preferredDate, preferredTime, meetingType: meetingType ?? "google-meet",
        notes: notes ?? "",
      });
    } catch (e) { console.warn("Meeting email error:", e); }
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit meeting request" });
  }
});

router.get("/portal/updates", requireAuth, async (req, res) => {
  try {
    const uid = req.auth!.userId;
    const updates = await db.select({
      id: serviceUpdatesTable.id,
      title: serviceUpdatesTable.title,
      content: serviceUpdatesTable.content,
      createdAt: serviceUpdatesTable.createdAt,
      serviceName: subscriptionsTable.serviceName,
      subscriptionId: serviceUpdatesTable.subscriptionId,
    }).from(serviceUpdatesTable)
      .leftJoin(subscriptionsTable, eq(serviceUpdatesTable.subscriptionId, subscriptionsTable.id))
      .where(eq(serviceUpdatesTable.userId, uid))
      .orderBy(desc(serviceUpdatesTable.createdAt));
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: "Failed to load updates" });
  }
});

export default router;
