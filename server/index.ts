import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import { config } from "dotenv";
import { app, server, io, memorySpamReports, memoryStats } from "./store";

config();

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Use memory store fallback if no MongoDB URL
export const useMongo = !!MONGODB_URI;

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", usingMongo: useMongo });
});

// Import backend features
import spamRouter from "./routes/spam";
import statsRouter from "./routes/stats";
import "./realtime/socket";

app.use("/api/spam", spamRouter);
app.use("/api/stats", statsRouter);

async function startServer() {
  if (useMongo && MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
    }
  } else {
    console.log("Running without MongoDB (In-Memory Mock Mode)");
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // In Express v4, must cast slightly or just use it, but `app.use(vite.middlewares)` works.
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
