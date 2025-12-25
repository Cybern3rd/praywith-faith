import { verifyToken } from '@clerk/backend';
import type { Request, Response, NextFunction } from 'express';
import * as db from '../db';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  throw new Error('Missing CLERK_SECRET_KEY environment variable');
}

export async function clerkAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, continue as unauthenticated
      return next();
    }

    const token = authHeader.substring(7);

    // Verify token with Clerk
    const payload = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
    });

    if (payload && payload.sub) {
      // Sync user to database
      const clerkUserId = payload.sub;
      const email = (payload.email as string) || '';
      const name = (payload.name as string) || (payload.firstName as string) || '';

      await db.upsertUser({
        openId: clerkUserId,
        name: name || null,
        email: email || null,
        loginMethod: 'clerk',
        lastSignedIn: new Date(),
      });

      // Attach user info to request
      (req as any).auth = {
        userId: clerkUserId,
        email,
        name,
      };
    }

    next();
  } catch (error) {
    console.error('[Clerk Auth] Token verification failed:', error);
    // Continue as unauthenticated on error
    next();
  }
}
