import { db } from "./db";
import { sessions, type Session, type InsertSession } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: number): Promise<Session | undefined>;
  updateSession(id: number, actionId: string, scoreDelta: number, nextStepId: string): Promise<Session>;
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
}

export const storage = new DatabaseStorage();
