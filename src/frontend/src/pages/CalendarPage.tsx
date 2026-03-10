import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle2, Circle, Clock, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { DayButtonProps } from "react-day-picker";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type Task, useAllTasks } from "../hooks/useQueries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateKey(iso: string): string {
  // ISO string from backend may be full datetime; we just want YYYY-MM-DD
  const d = new Date(iso);
  return toDateKey(d);
}

function priorityLabel(p: string): string {
  if (p === "high") return "High";
  if (p === "medium") return "Medium";
  return "Low";
}

function priorityClass(p: string): string {
  if (p === "high") return "bg-priority-high";
  if (p === "medium") return "bg-priority-medium";
  return "bg-priority-low";
}

// ─── Custom Day Button with dot indicator ─────────────────────────────────────

function DotDayButton({
  day,
  modifiers,
  className,
  children,
  hasTask,
  ...props
}: DayButtonProps & { hasTask: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex flex-col items-center justify-center aspect-square w-full min-w-8 rounded-md text-sm font-normal transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        modifiers.selected &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        modifiers.today &&
          !modifiers.selected &&
          "bg-accent text-accent-foreground font-semibold",
        modifiers.outside && "text-muted-foreground opacity-50",
        modifiers.disabled &&
          "text-muted-foreground opacity-50 pointer-events-none",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {hasTask && (
        <span
          className={cn(
            "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
            modifiers.selected ? "bg-primary-foreground" : "bg-primary",
          )}
        />
      )}
    </button>
  );
}

// ─── Task Item ─────────────────────────────────────────────────────────────────

function CalendarTaskItem({
  task,
  index,
}: {
  task: Task;
  index: number;
}) {
  const ocid = `calendar.task.item.${index + 1}` as const;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      data-ocid={ocid}
      className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors group"
    >
      <div className="flex-shrink-0 mt-0.5">
        {task.completed ? (
          <CheckCircle2 className="w-4 h-4 text-primary" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-foreground truncate",
            task.completed && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {task.description}
          </p>
        )}
      </div>
      <Badge
        className={cn(
          "text-xs flex-shrink-0 border-none font-medium",
          priorityClass(task.priority),
        )}
      >
        {priorityLabel(task.priority)}
      </Badge>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [], isLoading } = useAllTasks();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [month, setMonth] = useState<Date>(new Date());

  // Build a map: dateKey -> Task[]
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const key = parseDateKey(task.dueDate);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, task]);
    }
    return map;
  }, [tasks]);

  // Dates that have tasks
  const datesWithTasks = useMemo(
    () => new Set(tasksByDate.keys()),
    [tasksByDate],
  );

  // Tasks for the currently selected date
  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = toDateKey(selectedDate);
    return tasksByDate.get(key) ?? [];
  }, [selectedDate, tasksByDate]);

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No date selected";

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <CalendarDays className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Calendar View
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Sign in to see your tasks on a calendar and stay on top of
            deadlines.
          </p>
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            data-ocid="auth.login_button"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? "Signing in..." : "Sign in to continue"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto" data-ocid="calendar.page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Calendar
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          View and manage tasks by due date
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
          <Skeleton className="h-80 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start"
        >
          {/* Calendar */}
          <Card className="border-border bg-card overflow-hidden">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={month}
                onMonthChange={setMonth}
                components={{
                  DayButton: (props) => {
                    const dateKey = toDateKey(props.day.date);
                    const hasTask = datesWithTasks.has(dateKey);
                    return <DotDayButton {...props} hasTask={hasTask} />;
                  },
                }}
                classNames={{
                  button_previous: cn(
                    "size-8 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                  ),
                  button_next: cn(
                    "size-8 p-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                  ),
                }}
              />
              {/* Nav button markers - these are rendered by the Calendar component */}
              <div className="sr-only">
                <span data-ocid="calendar.prev_month.button" />
                <span data-ocid="calendar.next_month.button" />
              </div>
            </CardContent>
          </Card>

          {/* Day panel */}
          <Card
            className="border-border bg-card"
            data-ocid="calendar.day_tasks.panel"
          >
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {selectedDateLabel}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {selectedDateTasks.length} task
                {selectedDateTasks.length !== 1 ? "s" : ""} due
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedDateTasks.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-14 text-center"
                  data-ocid="calendar.empty_state"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-3">
                    <CalendarDays className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No tasks due
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedDate
                      ? "Select another day or add tasks with a due date."
                      : "Select a day to see tasks."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateTasks.map((task, i) => (
                    <CalendarTaskItem key={task.id} task={task} index={i} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            Tasks due on this day
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-8 h-5 rounded-md bg-accent inline-block" />
            Today
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-8 h-5 rounded-md bg-primary inline-block" />
            Selected
          </div>
        </motion.div>
      )}
    </div>
  );
}
