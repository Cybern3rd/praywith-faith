import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { notificationSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const notificationRouter = router({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const settings = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, ctx.user.id))
      .limit(1);

    if (settings.length === 0) {
      // Return default settings if none exist
      return {
        enabled: false,
        time: "08:00",
        timezone: "UTC",
      };
    }

    return {
      enabled: settings[0].enabled === 1,
      time: settings[0].time,
      timezone: settings[0].timezone,
    };
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        enabled: z.boolean(),
        time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:MM format
        timezone: z.string().optional().default("UTC"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      
      // Check if settings exist
      const existing = await db
        .select()
        .from(notificationSettings)
        .where(eq(notificationSettings.userId, ctx.user.id))
        .limit(1);

      const settingsData = {
        userId: ctx.user.id,
        enabled: input.enabled ? 1 : 0,
        time: input.time,
        timezone: input.timezone,
        updatedAt: new Date(),
      };

      if (existing.length === 0) {
        // Insert new settings
        await db.insert(notificationSettings).values({
          ...settingsData,
          createdAt: new Date(),
        });
      } else {
        // Update existing settings
        await db
          .update(notificationSettings)
          .set(settingsData)
          .where(eq(notificationSettings.userId, ctx.user.id));
      }

      return { success: true };
    }),
});
