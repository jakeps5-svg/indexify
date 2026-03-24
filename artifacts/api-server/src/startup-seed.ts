/**
 * Startup seed — runs once at server boot.
 *
 * Creates the admin user if they don't exist in portal_users.
 * The DB schema is pushed during the production build step, so tables
 * already exist by the time this runs.
 *
 * The password hash is pre-computed (bcrypt cost=12) so no bcrypt dep needed.
 * Re-generate with: node -e "require('bcryptjs').hash('PASSWORD',12).then(console.log)"
 */
import { pool } from "@workspace/db";

const ADMIN_EMAIL = "info@fortunedesign.co.za";
const ADMIN_NAME  = "Fortune Design";
const ADMIN_COMPANY = "Fortune Design";
// bcrypt hash of "FortuneD21!@" at cost=12
const ADMIN_HASH  = "$2b$12$ScwsHIk.cUAhIL/ezME.Kugkwtqpas/KzlBk.xptVQNACOjajvoEy";

export async function runStartupSeed(): Promise<void> {
  let client;
  try {
    client = await pool.connect();

    // Ensure the enum types and table exist (no-op if already created)
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('customer', 'admin');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      DO $$ BEGIN
        CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      DO $$ BEGIN
        CREATE TYPE invoice_status AS ENUM ('pending', 'sent', 'paid', 'overdue');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      DO $$ BEGIN
        CREATE TYPE chat_sender AS ENUM ('customer', 'admin');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      DO $$ BEGIN
        CREATE TYPE meeting_status AS ENUM ('pending', 'confirmed', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      CREATE TABLE IF NOT EXISTS portal_users (
        id               SERIAL PRIMARY KEY,
        name             TEXT NOT NULL,
        email            TEXT NOT NULL UNIQUE,
        phone            TEXT,
        company          TEXT,
        password_hash    TEXT NOT NULL,
        role             user_role NOT NULL DEFAULT 'customer',
        reset_token      TEXT,
        reset_token_expiry TIMESTAMPTZ,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portal_subscriptions (
        id                SERIAL PRIMARY KEY,
        user_id           INTEGER NOT NULL REFERENCES portal_users(id),
        service_name      TEXT NOT NULL,
        service_slug      TEXT NOT NULL,
        price_rands       NUMERIC(10,2) NOT NULL,
        status            subscription_status NOT NULL DEFAULT 'active',
        start_date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        next_invoice_date TIMESTAMPTZ NOT NULL,
        notes             TEXT,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portal_invoices (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER NOT NULL REFERENCES portal_users(id),
        subscription_id INTEGER REFERENCES portal_subscriptions(id),
        invoice_number TEXT NOT NULL UNIQUE,
        amount_rands   NUMERIC(10,2) NOT NULL,
        description    TEXT NOT NULL,
        status         invoice_status NOT NULL DEFAULT 'pending',
        due_date       TIMESTAMPTZ NOT NULL,
        sent_at        TIMESTAMPTZ,
        paid_at        TIMESTAMPTZ,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portal_chat_messages (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER NOT NULL REFERENCES portal_users(id),
        message         TEXT NOT NULL,
        sender          chat_sender NOT NULL,
        read            BOOLEAN NOT NULL DEFAULT FALSE,
        attachment_url  TEXT,
        attachment_name TEXT,
        attachment_mime TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portal_meeting_requests (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER NOT NULL REFERENCES portal_users(id),
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        meeting_type   TEXT NOT NULL,
        notes          TEXT,
        status         meeting_status NOT NULL DEFAULT 'pending',
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_ads_customer_id TEXT;
      ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_ads_refresh_token TEXT;

      CREATE TABLE IF NOT EXISTS portal_settings (
        key        TEXT PRIMARY KEY,
        value      TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portal_service_updates (
        id              SERIAL PRIMARY KEY,
        user_id         INTEGER NOT NULL REFERENCES portal_users(id),
        subscription_id INTEGER REFERENCES portal_subscriptions(id),
        title           TEXT NOT NULL,
        content         TEXT NOT NULL,
        attachment_url  TEXT,
        attachment_name TEXT,
        attachment_mime TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Ensure the admin user exists (upsert: always refresh the password hash)
    await client.query(`
      INSERT INTO portal_users (name, email, password_hash, role, company)
      VALUES ($1, $2, $3, 'admin', $4)
      ON CONFLICT (email) DO UPDATE
        SET password_hash = EXCLUDED.password_hash,
            role          = 'admin'
    `, [ADMIN_NAME, ADMIN_EMAIL, ADMIN_HASH, ADMIN_COMPANY]);

    console.log("[seed] schema and admin user ready");
  } catch (err) {
    // Non-fatal — log and continue. If tables truly can't be created the
    // individual API routes will surface specific errors.
    console.error("[seed] startup seed error:", err);
  } finally {
    client?.release();
  }
}
