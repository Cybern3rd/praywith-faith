import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { verifyToken } from '@clerk/backend';
import * as db from '../db';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Try to get Clerk session token from cookie
    const cookies = opts.req.headers.cookie;
    if (cookies) {
      const sessionToken = cookies.split(';').find(c => c.trim().startsWith('__session='))?.split('=')[1];
      
      if (sessionToken && CLERK_SECRET_KEY) {
        const payload = await verifyToken(sessionToken, {
          secretKey: CLERK_SECRET_KEY,
        });

        if (payload && payload.sub) {
          const clerkUserId = payload.sub;
          const email = (payload.email as string) || '';
          const name = ((payload as any).name as string) || ((payload as any).firstName as string) || '';

          // Sync user to database
          await db.upsertUser({
            openId: clerkUserId,
            name: name || null,
            email: email || null,
            loginMethod: 'clerk',
            lastSignedIn: new Date(),
          });

          user = await db.getUserByOpenId(clerkUserId);
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error('[Clerk Auth] Authentication failed:', error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
