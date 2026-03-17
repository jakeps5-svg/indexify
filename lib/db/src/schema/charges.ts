import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chargesTable = pgTable("charges", {
  id: serial("id").primaryKey(),
  chargeId: text("charge_id").notNull(),
  unlockToken: text("unlock_token").notNull().unique(),
  service: text("service").notNull(),
  amountInCents: integer("amount_in_cents").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  domain: text("domain"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChargeSchema = createInsertSchema(chargesTable).omit({ id: true, createdAt: true });
export type InsertCharge = z.infer<typeof insertChargeSchema>;
export type Charge = typeof chargesTable.$inferSelect;
