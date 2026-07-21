import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { genAI } from "./backend/services/chatService.js";
import chatRoutes from "./backend/routes/chatRoutes.js";
import visionRoutes from "./backend/routes/visionRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Serve frontend static files ONLY if they exist (for Vercel/Local)
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

/* ---------------------------------------------------------
                    ROUTES
--------------------------------------------------------- */

// Chat API Route
app.use("/api", chatRoutes);

// Vision API Route
app.use("/api/vision", visionRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    assistant: "Liva",
    ai: genAI ? "Gemini Connected" : "Mock Mode",
    timestamp: new Date(),
    version: "1.0 MVP",
  });
});

app.get("/api/debug-key", (req, res) => {
  const key = process.env.GEMINI_API_KEY || "";
  res.json({ 
    hasKey: !!key, 
    length: key.length, 
    start: key.substring(0, 5), 
    end: key.substring(key.length - 5) 
  });
});

/* ---------------------------------------------------------
                    REACT ROUTING
--------------------------------------------------------- */

// Fallback for root route
app.use((req, res) => {
  const indexPath = path.join(__dirname, "dist", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send("Fitma AI Backend API is running perfectly! 🚀");
  }
});

/* ---------------------------------------------------------
                    SERVER START
--------------------------------------------------------- */

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("");
    console.log("========================================");
    console.log("💚 Fitma.ai");
    console.log("🤖 Liva AI Companion");
    console.log(`🚀 Server Running : ${PORT}`);
    console.log(`🧠 AI : ${genAI ? "Gemini Connected" : "Mock Mode"}`);
    console.log("========================================");
  });
}

export default app;
