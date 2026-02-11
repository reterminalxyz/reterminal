import { db } from "./db";
import { sessions, users, type Session, type InsertSession, type User } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: number): Promise<Session | undefined>;
  updateSession(id: number, actionId: string, scoreDelta: number, nextStepId: string): Promise<Session>;
  syncUser(token: string): Promise<User>;
  saveProgress(token: string, progress: { currentModuleId: string | null; currentStepIndex: number; totalSats: number; independenceProgress: number }): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return session;
  }

  async updateSession(id: number, actionId: string, scoreDelta: number, nextStepId: string): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set({
        independenceScore: sql`${sessions.independenceScore} + ${scoreDelta}`,
        currentStepId: nextStepId,
        history: sql`${sessions.history} || ${JSON.stringify([actionId])}::jsonb`
      })
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }
  async syncUser(token: string): Promise<User> {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.token, token));
    if (existing) return existing;

    const [newUser] = await db
      .insert(users)
      .values({ token, xp: 0, level: 1 })
      .returning();
    return newUser;
  }

  async saveProgress(token: string, progress: { currentModuleId: string | null; currentStepIndex: number; totalSats: number; independenceProgress: number }): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({
        currentModuleId: progress.currentModuleId,
        currentStepIndex: progress.currentStepIndex,
        totalSats: progress.totalSats,
        independenceProgress: progress.independenceProgress,
      })
      .where(eq(users.token, token))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
