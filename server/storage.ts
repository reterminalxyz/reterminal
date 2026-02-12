import { db } from "./db";
import { sessions, users, userSkills, type Session, type InsertSession, type User, type UserSkill } from "@shared/schema";
import { eq, sql, and } from "drizzle-orm";

function getDb() {
  if (!db) throw new Error("Database is not available. Check DATABASE_URL.");
  return db;
}

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: number): Promise<Session | undefined>;
  updateSession(id: number, actionId: string, scoreDelta: number, nextStepId: string): Promise<Session>;
  syncUser(token: string): Promise<User>;
  saveProgress(token: string, progress: { currentModuleId: string | null; currentStepIndex: number; totalSats: number; independenceProgress: number }): Promise<User | undefined>;
  getUserSkills(userId: number): Promise<UserSkill[]>;
  grantSkill(userId: number, skillKey: string): Promise<UserSkill | null>;
}

export class DatabaseStorage implements IStorage {
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await getDb()
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await getDb()
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return session;
  }

  async updateSession(id: number, actionId: string, scoreDelta: number, nextStepId: string): Promise<Session> {
    const [session] = await getDb()
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
    const [existing] = await getDb()
      .select()
      .from(users)
      .where(eq(users.token, token));
    if (existing) return existing;

    const [newUser] = await getDb()
      .insert(users)
      .values({ token, xp: 0, level: 1 })
      .returning();
    return newUser;
  }

  async saveProgress(token: string, progress: { currentModuleId: string | null; currentStepIndex: number; totalSats: number; independenceProgress: number }): Promise<User | undefined> {
    const [updated] = await getDb()
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

  async getUserSkills(userId: number): Promise<UserSkill[]> {
    return getDb().select().from(userSkills).where(eq(userSkills.userId, userId));
  }

  async grantSkill(userId: number, skillKey: string): Promise<UserSkill | null> {
    const [existing] = await getDb()
      .select()
      .from(userSkills)
      .where(and(eq(userSkills.userId, userId), eq(userSkills.skillKey, skillKey)));
    if (existing) return null;

    const [skill] = await getDb()
      .insert(userSkills)
      .values({ userId, skillKey })
      .returning();
    return skill;
  }
}

export const storage = new DatabaseStorage();
