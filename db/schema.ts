import { pgTable, text, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const senderEnum = pgEnum("sender", ["ADMIN", "USER"]);

export const companies = pgTable("companies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export interface TimelineEntryRow {
  title: string;
  description: string;
}

export interface MemoryRow {
  src: string;
  caption: string;
}

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  employeeId: text("employee_id").notNull().unique(),
  name: text("name").notNull(),
  team: text("team"),
  quote: text("quote"),
  photo: text("photo"),
  message: json("message").notNull().$type<string[]>(),
  timeline: json("timeline").notNull().$type<TimelineEntryRow[]>(),
  memories: json("memories").notNull().$type<MemoryRow[]>(),
  gratitude: json("gratitude").notNull().$type<string[]>(),
  firstOpenedAt: timestamp("first_opened_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
});

export const threadMessages = pgTable("thread_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  body: text("body").notNull(),
  sender: senderEnum("sender").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  threadMessages: many(threadMessages),
}));

export const threadMessagesRelations = relations(threadMessages, ({ one }) => ({
  user: one(users, { fields: [threadMessages.userId], references: [users.id] }),
}));
