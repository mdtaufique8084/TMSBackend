import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ message: "Task Manager API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Only listen locally (not in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
