import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const languageEnum = pgEnum("language", ["en", "es", "fr", "pt"]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant", "system"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  preferredLanguage: languageEnum("preferredLanguage").default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Prayers table - stores all generated prayers
 */
export const prayers = pgTable("prayers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  language: languageEnum("language").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  eventType: varchar("eventType", { length: 100 }), // holiday, season, weekly, regular
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  body: text("body").notNull(),
  affirmation: text("affirmation").notNull(),
  actionStep: text("actionStep").notNull(),
  whisperPrayer: text("whisperPrayer"),
  blessing: text("blessing").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = typeof prayers.$inferInsert;

/**
 * Saved prayers - user's bookmarked prayers
 */
export const savedPrayers = pgTable("saved_prayers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  prayerId: integer("prayerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedPrayer = typeof savedPrayers.$inferSelect;
export type InsertSavedPrayer = typeof savedPrayers.$inferInsert;

/**
 * Journal entries - user's personal reflections
 */
export const journalEntries = pgTable("journal_entries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  prayerId: integer("prayerId"), // Optional link to a prayer
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Chat sessions - conversation threads
 */
export const chatSessions = pgTable("chat_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  prayerId: integer("prayerId"), // Optional link to a prayer
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

/**
 * Chat messages - individual messages in conversations
 */
export const chatMessages = pgTable("chat_messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer("sessionId").notNull(),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
