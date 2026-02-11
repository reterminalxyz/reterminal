import { useState, useCallback } from "react";
import type { SkillKey } from "@shared/schema";

export function useGrantSkill() {
  const [pendingSkill, setPendingSkill] = useState<SkillKey | null>(null);

  const grantSkill = useCallback(async (skillKey: SkillKey): Promise<boolean> => {
    const token = localStorage.getItem("liberta_token");
    if (!token) return false;

    setPendingSkill(skillKey);

    try {
      await fetch("/api/skills/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, skillKey }),
      });
    } catch {
    }

    return true;
  }, []);

  const dismissPopup = useCallback(() => {
    setPendingSkill(null);
  }, []);

  return { grantSkill, pendingSkill, dismissPopup };
}
