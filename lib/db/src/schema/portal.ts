import { pgTable, serial, text, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "paused", "cancelled"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["pending", "sent", "paid", "overdue"]);
export const chatSenderEnum = pgEnum("chat_sender", ["customer", "admin"]);
export const meetingStatusEnum = pgEnum("meeting_status", ["pending", "confirmed", "cancelled"]);

export const usersTable = pgTable("portal_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  googleAdsCustomerId: text("google_ads_customer_id"),
  googleAdsRefreshToken: text("google_ads_refresh_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptionsTable = pgTable("portal_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  serviceName: text("service_name").notNull(),
  serviceSlug: text("service_slug").notNull(),
  priceRands: decimal("price_rands", { precision: 10, scale: 2 }).notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  nextInvoiceDate: timestamp("next_invoice_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoicesTable = pgTable("portal_invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  subscriptionId: integer("subscription_id").references(() => subscriptionsTable.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amountRands: decimal("amount_rands", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  status: invoiceStatusEnum("status").notNull().default("pending"),
  dueDate: timestamp("due_date").notNull(),
  sentAt: timestamp("sent_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessagesTable = pgTable("portal_chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  message: text("message").notNull(),
  sender: chatSenderEnum("sender").notNull(),
  read: boolean("read").notNull().default(false),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  attachmentMime: text("attachment_mime"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const serviceUpdatesTable = pgTable("portal_service_updates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  subscriptionId: integer("subscription_id").references(() => subscriptionsTable.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  attachmentMime: text("attachment_mime"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingRequestsTable = pgTable("portal_meeting_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  meetingType: text("meeting_type").notNull().default("google-meet"),
  notes: text("notes"),
  status: meetingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({ id: true, createdAt: true });
export const insertChatSchema = createInsertSchema(chatMessagesTable).omit({ id: true, createdAt: true });

export type User = typeof usersTable.$inferSelect;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type Invoice = typeof invoicesTable.$inferSelect;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
export type MeetingRequest = typeof meetingRequestsTable.$inferSelect;
export type ServiceUpdate = typeof serviceUpdatesTable.$inferSelect;
