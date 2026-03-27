import { r as reactExports } from "./index-vju8O4pi.js";
const STORAGE_KEY = "focusflow_sessions";
function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function persistSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
  }
}
function useFocusSessions() {
  const [sessions, setSessions] = reactExports.useState(loadSessions);
  const saveSession = reactExports.useCallback((session) => {
    const newSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      persistSessions(updated);
      return updated;
    });
  }, []);
  const clearSessions = reactExports.useCallback(() => {
    setSessions([]);
    persistSessions([]);
  }, []);
  return { sessions, saveSession, clearSessions };
}
export {
  useFocusSessions as u
};
