import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';

// Types for Cloudflare Workers environment
export interface Env {
  DB: D1Database;
  OPENROUTER_API_KEY: string;
  JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('/*', cors());

// API routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the frontend build
app.use('/*', serveStatic({ root: './' }));

// Fallback to index.html for client-side routing
app.get('*', serveStatic({ path: './index.html' }));

export default app;
