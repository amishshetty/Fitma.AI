import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "../backend/routes/chatRoutes.js";
import visionRoutes from "../backend/routes/visionRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Chat API Route
app.use("/api", chatRoutes);

// Vision API Route
app.use("/api/vision", visionRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    assistant: "Liva (Vercel Serverless)",
    timestamp: new Date(),
    version: "1.0 MVP",
  });
});

export default app;
