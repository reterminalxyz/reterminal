import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { randomBytes } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.sessions.create.path, async (req, res) => {
    try {
      const nodeId = req.body.nodeId || `#RE_CHAIN_${randomBytes(2).toString('hex').toUpperCase()}`;
      const session = await storage.createSession({
        nodeId,
        independenceScore: 0,
        currentStepId: "step_0",
      });
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.sessions.update.path, async (req, res) => {
    try {
      const { actionId, scoreDelta, nextStepId } = api.sessions.update.input.parse(req.body);
      const session = await storage.updateSession(
        Number(req.params.id),
        actionId,
        scoreDelta,
        nextStepId
      );
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.sessions.get.path, async (req, res) => {
    const session = await storage.getSession(Number(req.params.id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  });

  app.post('/api/sync-user', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token is required" });
      }
      const user = await storage.syncUser(token);
      res.json({ level: user.level, xp: user.xp });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
