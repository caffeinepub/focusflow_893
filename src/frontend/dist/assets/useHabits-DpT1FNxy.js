import { r as reactExports } from "./index-vju8O4pi.js";
const STORAGE_KEY = "focusflow_habits";
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { habits: [], completions: {} };
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.habits)) return parsed;
    return { habits: [], completions: {} };
  } catch {
    return { habits: [], completions: {} };
  }
}
function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
function calcCurrentStreak(dates) {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort().reverse();
  const today = todayStr();
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().slice(0, 10);
  if (unique[0] !== today && unique[0] !== yesterdayIso) return 0;
  let streak = 0;
  let current = new Date(unique[0]);
  const dateSet = new Set(unique);
  while (true) {
    const d = current.toISOString().slice(0, 10);
    if (dateSet.has(d)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
function calcLongestStreak(dates) {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort();
  if (unique.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diff = Math.round(
      (curr.getTime() - prev.getTime()) / (1e3 * 60 * 60 * 24)
    );
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}
function useHabits() {
  const [store, setStore] = reactExports.useState(loadStore);
  reactExports.useEffect(() => {
    const handler = () => setStore(loadStore());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const update = reactExports.useCallback((updater) => {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  }, []);
  const addHabit = reactExports.useCallback(
    (habit) => {
      update((s) => ({
        ...s,
        habits: [
          ...s.habits,
          {
            ...habit,
            id: crypto.randomUUID(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        ]
      }));
    },
    [update]
  );
  const updateHabit = reactExports.useCallback(
    (id, updates) => {
      update((s) => ({
        ...s,
        habits: s.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
      }));
    },
    [update]
  );
  const deleteHabit = reactExports.useCallback(
    (id) => {
      update((s) => {
        const completions = { ...s.completions };
        delete completions[id];
        return { habits: s.habits.filter((h) => h.id !== id), completions };
      });
    },
    [update]
  );
  const toggleCompletion = reactExports.useCallback(
    (habitId, date) => {
      const d = date ?? todayStr();
      update((s) => {
        const existing = s.completions[habitId] ?? [];
        const has = existing.includes(d);
        return {
          ...s,
          completions: {
            ...s.completions,
            [habitId]: has ? existing.filter((x) => x !== d) : [...existing, d]
          }
        };
      });
    },
    [update]
  );
  const isCompletedToday = reactExports.useCallback(
    (habitId) => {
      return (store.completions[habitId] ?? []).includes(todayStr());
    },
    [store]
  );
  const getCurrentStreak = reactExports.useCallback(
    (habitId) => {
      return calcCurrentStreak(store.completions[habitId] ?? []);
    },
    [store]
  );
  const getLongestStreak = reactExports.useCallback(
    (habitId) => {
      return calcLongestStreak(store.completions[habitId] ?? []);
    },
    [store]
  );
  const getTodayCompletionCount = reactExports.useCallback(() => {
    const today = todayStr();
    const completed = store.habits.filter(
      (h) => (store.completions[h.id] ?? []).includes(today)
    ).length;
    return { completed, total: store.habits.length };
  }, [store]);
  return {
    habits: store.habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompletedToday,
    getCurrentStreak,
    getLongestStreak,
    getTodayCompletionCount
  };
}
export {
  useHabits as u
};
