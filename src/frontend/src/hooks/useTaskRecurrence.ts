type Recurrence = "none" | "daily" | "weekly";

const STORAGE_KEY = "focusflow_task_recurrence";

function getAll(): Record<string, Recurrence> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, Recurrence>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useTaskRecurrence() {
  const getRecurrence = (taskId: string): Recurrence => {
    return getAll()[taskId] ?? "none";
  };

  const setRecurrence = (taskId: string, value: Recurrence) => {
    const all = getAll();
    if (value === "none") {
      delete all[taskId];
    } else {
      all[taskId] = value;
    }
    saveAll(all);
  };

  const removeRecurrence = (taskId: string) => {
    const all = getAll();
    delete all[taskId];
    saveAll(all);
  };

  return { getRecurrence, setRecurrence, removeRecurrence };
}
