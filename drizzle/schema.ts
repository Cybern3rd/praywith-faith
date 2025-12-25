import { int, mysqlTable, mysqlEnum, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = mysqlEnum("role", ["user", "admin"]);
export const languageEnum = mysqlEnum("language", ["en", "es", "fr", "pt"]);
export const chatRoleEnum = mysqlEnum("chat_role", ["user", "assistant", "system"]);

export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").primaryKey().autoincrement(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum.default("user").notNull(),
  preferredLanguage: languageEnum.default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Prayers table - stores all generated prayers
 */
export const prayers = mysqlTable("prayers", {
  id: int("id").primaryKey().autoincrement(),
  language: languageEnum.notNull(),
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
export const savedPrayers = mysqlTable("saved_prayers", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  prayerId: int("prayerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedPrayer = typeof savedPrayers.$inferSelect;
export type InsertSavedPrayer = typeof savedPrayers.$inferInsert;

/**
 * Journal entries - user's personal reflections
 */
export const journalEntries = mysqlTable("journal_entries", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  prayerId: int("prayerId"), // Optional link to a prayer
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Chat sessions - conversation threads
 */
export const chatSessions = mysqlTable("chat_sessions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  prayerId: int("prayerId"), // Optional link to a prayer
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

/**
 * Chat messages - individual messages in conversations
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").primaryKey().autoincrement(),
  sessionId: int("sessionId").notNull(),
  role: chatRoleEnum.notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Notification settings - user preferences for email notifications
 */
export const notificationSettings = mysqlTable("notification_settings", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().unique(),
  enabled: int("enabled").default(0).notNull(), // 0 = false, 1 = true (MySQL boolean as int)
  time: varchar("time", { length: 5 }).default("08:00").notNull(), // HH:MM format
  timezone: varchar("timezone", { length: 50 }).default("UTC").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type NotificationSetting = typeof notificationSettings.$inferSelect;
export type InsertNotificationSetting = typeof notificationSettings.$inferInsert;
