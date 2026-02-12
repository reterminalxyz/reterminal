import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { randomBytes } from "crypto";
import { SKILL_KEYS } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", async (_req, res) => {
    try {
      const { dbReady, dbError, pool } = await import("./db");
      if (!pool || !dbReady) {
        return res.status(200).json({ status: "degraded", database: "disconnected", error: dbError || "No pool" });
      }
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      res.status(200).json({ status: "ok", database: "connected" });
    } catch (err: any) {
      res.status(200).json({ status: "degraded", database: "disconnected", error: err.message });
    }
  });

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
    try {
      const session = await storage.getSession(Number(req.params.id));
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/sync-user', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token is required" });
      }
      const user = await storage.syncUser(token);
      res.json({
        level: user.level,
        xp: user.xp,
        currentModuleId: user.currentModuleId,
        currentStepIndex: user.currentStepIndex,
        totalSats: user.totalSats,
        independenceProgress: user.independenceProgress,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/skills/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const user = await storage.syncUser(token);
      const skills = await storage.getUserSkills(user.id);
      res.json(skills.map(s => ({ skillKey: s.skillKey, grantedAt: s.grantedAt })));
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/skills/grant', async (req, res) => {
    try {
      const { token, skillKey } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token is required" });
      }
      if (!skillKey || typeof skillKey !== 'string' || !SKILL_KEYS.includes(skillKey as any)) {
        return res.status(400).json({ message: "Invalid skill key" });
      }
      const user = await storage.syncUser(token);
      const skill = await storage.grantSkill(user.id, skillKey);
      if (!skill) {
        return res.json({ granted: false, message: "Skill already granted" });
      }
      res.json({ granted: true, skill: { skillKey: skill.skillKey, grantedAt: skill.grantedAt } });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/save-progress', async (req, res) => {
    try {
      const { token, currentModuleId, currentStepIndex, totalSats, independenceProgress } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Token is required" });
      }
      const user = await storage.saveProgress(token, {
        currentModuleId: currentModuleId ?? null,
        currentStepIndex: typeof currentStepIndex === 'number' ? currentStepIndex : 0,
        totalSats: typeof totalSats === 'number' ? totalSats : 0,
        independenceProgress: typeof independenceProgress === 'number' ? independenceProgress : 0,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
