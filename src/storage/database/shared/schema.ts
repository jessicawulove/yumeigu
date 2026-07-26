import { pgTable, serial, timestamp, varchar, text, numeric, boolean, jsonb, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const crm_contacts = pgTable(
  "crm_contacts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    company: varchar("company", { length: 256 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 64 }),
    country: varchar("country", { length: 64 }),
    title: varchar("title", { length: 128 }),
    tags: jsonb("tags"),
    notes: text("notes"),
    owner: varchar("owner", { length: 128 }),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("crm_contacts_country_idx").on(table.country),
    index("crm_contacts_is_active_idx").on(table.is_active),
  ]
);

export const crm_deals = pgTable(
  "crm_deals",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 256 }).notNull(),
    contact_id: varchar("contact_id", { length: 36 }).references(() => crm_contacts.id),
    stage: varchar("stage", { length: 32 }).notNull().default("qualification"),
    amount: numeric("amount", { precision: 12, scale: 2 }).default("0"),
    probability: numeric("probability", { precision: 5, scale: 2 }).default("0"),
    expected_close_date: varchar("expected_close_date", { length: 32 }),
    owner: varchar("owner", { length: 128 }),
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("crm_deals_contact_id_idx").on(table.contact_id),
    index("crm_deals_stage_idx").on(table.stage),
  ]
);

export const crm_leads = pgTable(
  "crm_leads",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    company: varchar("company", { length: 256 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 64 }),
    country: varchar("country", { length: 64 }),
    source: varchar("source", { length: 64 }),
    status: varchar("status", { length: 32 }).notNull().default("new"),
    score: numeric("score", { precision: 5, scale: 2 }).default("0"),
    owner: varchar("owner", { length: 128 }),
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("crm_leads_status_idx").on(table.status),
    index("crm_leads_country_idx").on(table.country),
  ]
);
