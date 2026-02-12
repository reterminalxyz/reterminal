import { useState, useCallback, useRef, useEffect } from "react";
import type { SkillKey } from "@shared/schema";

export function useGrantSkill() {
  const [pendingSkill, setPendingSkill] = useState<SkillKey | null>(null);
  const grantedRef = useRef<Set<string>>(new Set());
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    const token = localStorage.getItem("liberta_token");
    if (!token) return;
    fetch(`/api/skills/${token}`)
      .then(r => r.ok ? r.json() : [])
      .then((skills: { skillKey: string }[]) => {
        skills.forEach(s => grantedRef.current.add(s.skillKey));
      })
      .catch(() => {});
  }, []);

  const grantSkill = useCallback(async (skillKey: SkillKey): Promise<boolean> => {
    const token = localStorage.getItem("liberta_token");
    if (!token) return false;
    if (grantedRef.current.has(skillKey)) return false;

    try {
      const res = await fetch("/api/skills/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, skillKey }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.granted) {
        grantedRef.current.add(skillKey);
        setPendingSkill(skillKey);
        return true;
      }
      grantedRef.current.add(skillKey);
    } catch {
    }

    return false;
  }, []);

  const dismissPopup = useCallback(() => {
    setPendingSkill(null);
  }, []);

  return { grantSkill, pendingSkill, dismissPopup };
}
