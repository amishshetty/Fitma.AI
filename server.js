import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
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

// Serve frontend static files
app.use(express.static(path.join(__dirname, "dist")));

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

/* ---------------------------------------------------------
                    REACT ROUTING
--------------------------------------------------------- */

// Fallback to React index.html for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* ---------------------------------------------------------
                    SERVER START
--------------------------------------------------------- */

app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("💚 Fitma.ai");
  console.log("🤖 Liva AI Companion");
  console.log(`🚀 Server Running : ${PORT}`);
  console.log(`🧠 AI : ${genAI ? "Gemini Connected" : "Mock Mode"}`);
  console.log("========================================");
});
