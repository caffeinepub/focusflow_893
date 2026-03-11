import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "focusflow_task_completions";

function getStoredDates(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort().reverse();
  const today = todayISODate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Start from today or yesterday
  let startDate: string | null = null;
  if (unique[0] === today) {
    startDate = today;
  } else if (unique[0] === yesterdayStr) {
    startDate = yesterdayStr;
  } else {
    return 0;
  }

  let streak = 0;
  let current = new Date(startDate);
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

function calcLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

export function useTaskStreak() {
  const [dates, setDates] = useState<string[]>(getStoredDates);

  // Sync across tabs
  useEffect(() => {
    const handler = () => setDates(getStoredDates());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const recordCompletion = useCallback(() => {
    const today = todayISODate();
    const current = getStoredDates();
    if (!current.includes(today)) {
      const updated = [...current, today];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDates(updated);
    }
  }, []);

  const currentStreak = calcCurrentStreak(dates);
  const longestStreak = calcLongestStreak(dates);
  const todayCompleted = dates.includes(todayISODate());

  return { recordCompletion, currentStreak, longestStreak, todayCompleted };
}
