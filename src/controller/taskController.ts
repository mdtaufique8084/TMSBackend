import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth";

// Get all tasks for the logged-in user
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await prisma.task.create({
      data: { title, description, status, userId },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { title, description, status } = req.body;

    const existing = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId)
      return res.status(404).json({ message: "Task not found" });

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId)
      return res.status(404).json({ message: "Task not found" });

    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
