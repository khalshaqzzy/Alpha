import { Router } from "express";
import { z } from "zod";
import { chatController } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const chatRoutes = Router();

// All chat routes require authentication
chatRoutes.use(authMiddleware);

// Validation schemas
const createChatSchema = z.object({
    title: z.string().max(200).optional(),
});

const updateChatSchema = z.object({
    title: z.string().max(200).optional(),
    chartState: z.any().optional(),
    status: z.enum(["CREATED", "ACTIVE", "IDLE", "ARCHIVED"]).optional(),
});

// Routes
chatRoutes.get("/", chatController.list);
chatRoutes.post("/", validate({ body: createChatSchema }), chatController.create);
chatRoutes.get("/:id", chatController.get);
chatRoutes.patch("/:id", validate({ body: updateChatSchema }), chatController.update);
chatRoutes.delete("/:id", chatController.remove);

// AI message endpoint — Phase 2
chatRoutes.post("/:id/messages", chatController.sendMessage);
