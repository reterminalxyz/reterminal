import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertSession, type SessionResponse } from "@shared/schema";

// GET /api/sessions/:id
export function useSession(id: number | null) {
  return useQuery({
    queryKey: [api.sessions.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.sessions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch session");
      return api.sessions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/sessions
export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { nodeId?: string } = {}) => {
      const res = await fetch(api.sessions.create.path, {
        method: api.sessions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create session");
      return api.sessions.create.responses[201].parse(await res.json());
    },
    // We don't invalidate list because we don't list sessions, but we return the new session
  });
}

// POST /api/sessions/:id/action
export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      id, 
      actionId, 
      scoreDelta, 
      nextStepId 
    }: { 
      id: number; 
      actionId: string; 
      scoreDelta: number; 
      nextStepId: string; 
    }) => {
      const url = buildUrl(api.sessions.update.path, { id });
      const res = await fetch(url, {
        method: api.sessions.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId, scoreDelta, nextStepId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update session");
      return api.sessions.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Update local cache for the specific session
      queryClient.setQueryData([api.sessions.get.path, data.id], data);
    },
  });
}
