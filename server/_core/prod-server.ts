import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// Manus OAuth removed - using Clerk authentication instead
import { appRouter } from "../routers";
import { createContext } from "./context";

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Configure CORS for production
  app.use(cors({
    origin: [
      "https://praywith.faith",
      "https://praywith-faith.pages.dev",
      "http://localhost:3000",
      "http://5.161.49.163",
      /\.praywith-faith\.pages\.dev$/
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Clerk authentication is handled via cookies from frontend
  // No OAuth callback routes needed
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const port = parseInt(process.env.PORT || "3001");

  server.listen(port, () => {
    console.log(`Production API server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
