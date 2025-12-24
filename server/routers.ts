import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { generatePrayer, generateChatResponse } from "./openrouter";
import { notificationRouter } from "./routers/notificationRouter";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  notifications: notificationRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  prayers: router({
    availableDates: publicProcedure
      .input(z.object({
        language: z.enum(["en", "es", "fr", "pt"]).default("en"),
      }))
      .query(async ({ input }) => {
        return await db.getAvailablePrayerDates(input.language);
      }),

    today: publicProcedure
      .input(z.object({
        language: z.enum(["en", "es", "fr", "pt"]).default("en"),
        date: z.string(), // YYYY-MM-DD
      }))
      .query(async ({ input }) => {
        return await db.getTodayPrayer(input.language, input.date);
      }),

    save: protectedProcedure
      .input(z.object({
        prayerId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.savePrayerForUser(ctx.user.id, input.prayerId);
      }),

    saved: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserSavedPrayers(ctx.user.id);
      }),

    generate: publicProcedure
      .input(z.object({
        language: z.enum(["en", "es", "fr", "pt"]).default("en"),
        date: z.string(), // YYYY-MM-DD
        eventType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Check if prayer already exists
        const existing = await db.getTodayPrayer(input.language, input.date);
        if (existing) {
          return existing;
        }

        // Generate new prayer with OpenRouter
        const generated = await generatePrayer({
          language: input.language,
          date: input.date,
          eventType: input.eventType,
        });

        // Save to database
        await db.createPrayer({
          language: input.language,
          date: input.date,
          eventType: input.eventType,
          ...generated,
        });

        // Return the newly created prayer
        return await db.getTodayPrayer(input.language, input.date);
      }),
  }),

  journal: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserJournalEntries(ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        content: z.string(),
        prayerId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createJournalEntry({
          userId: ctx.user.id,
          content: input.content,
          prayerId: input.prayerId,
        });
      }),
  }),

  chat: router({
    sessions: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserChatSessions(ctx.user.id);
      }),

    messages: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getChatMessages(input.sessionId);
      }),

    createSession: protectedProcedure
      .input(z.object({
        title: z.string().optional(),
        prayerId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createChatSession({
          userId: ctx.user.id,
          title: input.title,
          prayerId: input.prayerId,
        });
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Save user message
        await db.createChatMessage({
          sessionId: input.sessionId,
          role: "user",
          content: input.content,
        });

        // Get conversation history
        const messages = await db.getChatMessages(input.sessionId);
        
        // Convert to OpenRouter format
        const conversationHistory = messages.map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        }));

        // Generate AI response with OpenRouter
        const aiResponse = await generateChatResponse({
          messages: conversationHistory,
        });

        // Save AI response
        await db.createChatMessage({
          sessionId: input.sessionId,
          role: "assistant",
          content: aiResponse,
        });

        return { success: true, response: aiResponse };
      }),
  }),
});

export type AppRouter = typeof appRouter;
