import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  InsertUser, users,
  prayers, InsertPrayer,
  savedPrayers, InsertSavedPrayer,
  journalEntries, InsertJournalEntry,
  chatSessions, InsertChatSession,
  chatMessages, InsertChatMessage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const queryClient = postgres(process.env.DATABASE_URL!);
      _db = drizzle(queryClient);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Prayer Helpers
 */
export async function getTodayPrayer(language: "en" | "es" | "fr" | "pt", date: string) {
  const db = await getDb();
  console.log("[getTodayPrayer] db instance:", !!db, "language:", language, "date:", date);
  if (!db) {
    console.log("[getTodayPrayer] Database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(prayers)
      .where(and(eq(prayers.language, language), eq(prayers.date, date)))
      .limit(1);
    
    console.log("[getTodayPrayer] Query result:", result.length, "rows");
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[getTodayPrayer] Query error:", error);
    return undefined;
  }
}

export async function createPrayer(prayer: InsertPrayer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(prayers).values(prayer);
  return result;
}

export async function savePrayerForUser(userId: number, prayerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(savedPrayers).values({ userId, prayerId });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Prayer already saved" };
  }
}

export async function getUserSavedPrayers(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: savedPrayers.id,
      prayerId: savedPrayers.prayerId,
      createdAt: savedPrayers.createdAt,
      prayer: prayers,
    })
    .from(savedPrayers)
    .leftJoin(prayers, eq(savedPrayers.prayerId, prayers.id))
    .where(eq(savedPrayers.userId, userId))
    .orderBy(savedPrayers.createdAt);

  return result;
}

export async function getAvailablePrayerDates(language: "en" | "es" | "fr" | "pt") {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ date: prayers.date })
    .from(prayers)
    .where(eq(prayers.language, language))
    .orderBy(prayers.date);

  return result.map(r => r.date);
}

/**
 * Journal Helpers
 */
export async function getUserJournalEntries(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(journalEntries.createdAt);

  return result;
}

export async function createJournalEntry(entry: InsertJournalEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(journalEntries).values(entry);
  return result;
}

/**
 * Chat Helpers
 */
export async function getUserChatSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(chatSessions.updatedAt);

  return result;
}

export async function createChatSession(session: InsertChatSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(chatSessions).values(session);
  
  // Return the most recent session for this user
  const result = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, session.userId))
    .orderBy(chatSessions.createdAt)
    .limit(1);
  
  return result[0];
}

export async function getChatMessages(sessionId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.createdAt);

  return result;
}

export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(chatMessages).values(message);
  return result;
}
