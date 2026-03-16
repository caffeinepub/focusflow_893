import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const REMINDERS_KEY = "focusflow-reminders-enabled";
const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

const MESSAGES = [
  "Don't forget to log your tasks for today!",
  "Have you checked off your habits today?",
  "Time to write a journal entry and reflect.",
  "Log your focus session to track progress.",
  "Update your goal progress — keep the momentum!",
  "A quick to-do check: anything you can tick off?",
];

let messageIndex = 0;

export function useReminders(isAuthenticated: boolean) {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem(REMINDERS_KEY);
    return saved === null ? true : saved === "true";
  });

  const toggleReminders = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(REMINDERS_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;
    const id = setInterval(() => {
      const msg = MESSAGES[messageIndex % MESSAGES.length];
      messageIndex++;
      toast(msg, {
        description: "Tap here to go log it now.",
        duration: 8000,
      });
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, isAuthenticated]);

  return { remindersEnabled: enabled, toggleReminders };
}
