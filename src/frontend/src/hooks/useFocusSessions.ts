import { useCallback, useState } from "react";

export interface FocusSession {
  id: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  taskId: string | null;
  taskTitle: string | null;
  projectId: string | null;
  projectName: string | null;
}

const STORAGE_KEY = "focusflow_sessions";

function loadSessions(): FocusSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FocusSession[]) : [];
  } catch {
    return [];
  }
}

function persistSessions(sessions: FocusSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore storage errors
  }
}

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>(loadSessions);

  const saveSession = useCallback((session: Omit<FocusSession, "id">) => {
    const newSession: FocusSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      persistSessions(updated);
      return updated;
    });
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
    persistSessions([]);
  }, []);

  return { sessions, saveSession, clearSessions };
}
