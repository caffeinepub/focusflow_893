import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  FolderOpen,
  ListTodo,
  Plus,
  Repeat2,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { type Habit, useHabits } from "../hooks/useHabits";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Goal,
  GoalCategory,
  GoalStatus,
  type JournalEntry,
  JournalMood,
  type Priority,
  type Task,
  useAllGoals,
  useAllJournalEntries,
  useAllProjects,
  useAllTasks,
  useCreateTask,
  useDeleteTask,
  useToggleTaskCompletion,
  useUpdateTask,
} from "../hooks/useQueries";
import { useTaskStreak } from "../hooks/useTaskStreak";

const MOOD_EMOJI: Record<JournalMood, string> = {
  [JournalMood.happy]: "😊",
  [JournalMood.neutral]: "😐",
  [JournalMood.sad]: "😢",
  [JournalMood.stressed]: "😰",
  [JournalMood.energized]: "⚡",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

type StatModalType =
  | "total"
  | "completed"
  | "pending"
  | "overdue"
  | "streak"
  | "habits"
  | null;

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  ocid,
  delay,
  onClick,
  clickable,
}: {
  label: string;
  value: bigint | number | string | undefined;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  ocid: string;
  delay: number;
  onClick?: () => void;
  clickable?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      data-ocid={ocid}
      onClick={onClick}
      className={cn(clickable && "cursor-pointer")}
    >
      <Card
        className={cn(
          "border-border bg-card relative overflow-hidden group card-hover",
          clickable &&
            "hover:border-primary/40 hover:shadow-md transition-all duration-200",
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                {label}
              </p>
              <p className="text-3xl font-display font-bold text-foreground">
                {value !== undefined ? (
                  value.toString()
                ) : (
                  <Skeleton className="h-8 w-12" />
                )}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className={cn("p-2.5 rounded-lg", iconColor)}>
                <Icon className="w-5 h-5" />
              </div>
              {clickable && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
      </Card>
    </motion.div>
  );
}

function TaskDrilldownModal({
  open,
  onClose,
  title,
  tasks,
  emptyMessage,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  tasks: Task[];
  emptyMessage: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" data-ocid="dashboard.stat.modal">
        <DialogHeader className="flex flex-row items-center justify-between pr-6">
          <DialogTitle className="font-display">{title}</DialogTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
        </DialogHeader>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          data-ocid="dashboard.stat.modal.close_button"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        {tasks.length === 0 ? (
          <div
            className="py-10 text-center"
            data-ocid="dashboard.stat.modal.empty_state"
          >
            <CheckCircle2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-1">
            <div className="space-y-2 py-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                      task.completed ? "bg-emerald-400" : "bg-amber-400",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        task.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-1.5 py-0 h-4",
                          PRIORITY_STYLES[task.priority] ?? "",
                        )}
                      >
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StreakModal({
  open,
  onClose,
  currentStreak,
  completedTasks,
}: {
  open: boolean;
  onClose: () => void;
  currentStreak: number;
  completedTasks: Task[];
}) {
  const todayCompleted = completedTasks.filter((t) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // tasks don't have a completedAt, so show all completed tasks as context
    return t.completed;
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="dashboard.streak.modal">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Day Streak
          </DialogTitle>
        </DialogHeader>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          data-ocid="dashboard.streak.modal.close_button"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="space-y-4 py-1">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-display font-bold text-amber-400">
                {currentStreak}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStreak === 1 ? "day streak" : "day streak"}
              </p>
            </div>
          </div>

          {currentStreak >= 7 && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-center">
              <p className="text-sm font-semibold text-amber-400">
                🔥{" "}
                {currentStreak >= 30
                  ? "30-day milestone!"
                  : currentStreak >= 14
                    ? "14-day milestone!"
                    : "7-day milestone!"}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-muted/50 px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              {currentStreak === 0
                ? "Complete tasks daily to build your streak."
                : "Keep completing tasks every day to grow your streak!"}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {todayCompleted.length}
              </span>{" "}
              task{todayCompleted.length !== 1 ? "s" : ""} completed in total
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HabitsModal({
  open,
  onClose,
  habits,
  isCompletedToday,
  getCurrentStreak,
  habitsCompleted,
  habitsTotal,
}: {
  open: boolean;
  onClose: () => void;
  habits: Habit[];
  isCompletedToday: (id: string) => boolean;
  getCurrentStreak: (id: string) => number;
  habitsCompleted: number;
  habitsTotal: number;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" data-ocid="dashboard.habits.modal">
        <DialogHeader className="flex flex-row items-center justify-between pr-6">
          <DialogTitle className="font-display flex items-center gap-2">
            <Repeat2 className="w-5 h-5 text-teal-400" />
            Habits Today
          </DialogTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {habitsCompleted}/{habitsTotal} done
          </span>
        </DialogHeader>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          data-ocid="dashboard.habits.modal.close_button"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        {habits.length === 0 ? (
          <div
            className="py-10 text-center"
            data-ocid="dashboard.habits.modal.empty_state"
          >
            <Repeat2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No habits yet. Add some in the Habits page.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-1">
            <div className="space-y-2 py-1">
              {habits.map((habit, i) => {
                const done = isCompletedToday(habit.id);
                const streak = getCurrentStreak(habit.id);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                    data-ocid={`dashboard.habits.modal.item.${i + 1}`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          done
                            ? "line-through text-muted-foreground"
                            : "text-foreground",
                        )}
                      >
                        {habit.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <Flame className="w-3 h-3" />
                          {streak} day streak
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0 h-4 border-border text-muted-foreground capitalize"
                        >
                          {habit.frequency}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {done ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Done
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

const CATEGORY_LABELS: Record<GoalCategory, string> = {
  [GoalCategory.personal]: "Personal",
  [GoalCategory.work]: "Work",
  [GoalCategory.health]: "Health",
  [GoalCategory.learning]: "Learning",
  [GoalCategory.other]: "Other",
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  [GoalCategory.personal]:
    "bg-violet-500/15 text-violet-400 border-violet-500/20",
  [GoalCategory.work]: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  [GoalCategory.health]:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  [GoalCategory.learning]: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  [GoalCategory.other]: "bg-muted text-muted-foreground",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

function MiniCalendar({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Build map: day -> tasks
  const tasksByDay: Record<number, Task[]> = {};
  for (const task of tasks) {
    if (task.dueDate) {
      const due = new Date(Number(task.dueDate) / 1_000_000);
      if (due.getFullYear() === year && due.getMonth() === month) {
        const d = due.getDate();
        tasksByDay[d] = tasksByDay[d] ? [...tasksByDay[d], task] : [task];
      }
    }
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.36 }}
    >
      <Card className="border-border bg-card h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-primary/15">
              <CalendarDays className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-sm text-foreground">
              {monthName}
            </h3>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-[10px] font-medium text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
            {cells.map((day, idx) => {
              const cellKey = day
                ? `day-${day}`
                : `empty-${idx < 7 ? "pre" : "post"}-${idx}`;
              if (!day) return <div key={cellKey} />;
              const isToday = day === today.getDate();
              const dayTasks = tasksByDay[day] ?? [];
              const hasTasks = dayTasks.length > 0;
              const topPriorities = dayTasks
                .slice(0, 3)
                .map((t) => String(t.priority ?? "low"));
              const title = hasTasks
                ? dayTasks.map((t) => t.title).join(", ")
                : undefined;

              return (
                <div
                  key={day}
                  title={title}
                  className="flex flex-col items-center py-0.5 gap-0.5 cursor-default"
                >
                  <span
                    className={cn(
                      "text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted/60",
                    )}
                  >
                    {day}
                  </span>
                  {hasTasks && (
                    <div className="flex gap-0.5">
                      {topPriorities.map((p, dotIdx) => {
                        const dotKey = `${p}${dotIdx}`;
                        return (
                          <span
                            key={dotKey}
                            className={cn(
                              "w-1 h-1 rounded-full",
                              PRIORITY_DOT[p] ?? "bg-primary",
                            )}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Low
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GoalsTimeline({ goals }: { goals: Goal[] }) {
  const now = new Date();
  const threeMonthsLater = new Date(
    now.getFullYear(),
    now.getMonth() + 3,
    now.getDate(),
  );

  const upcoming = goals.filter((g) => {
    if (!g.targetDate) return false;
    const target = new Date(Number(g.targetDate) / 1_000_000);
    return target >= now && target <= threeMonthsLater;
  });

  // Group by month label
  const byMonth: Record<string, Goal[]> = {};
  for (const g of upcoming) {
    const target = new Date(Number(g.targetDate) / 1_000_000);
    const label = target.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    byMonth[label] = byMonth[label] ? [...byMonth[label], g] : [g];
  }

  const monthEntries = Object.entries(byMonth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-border bg-card h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-primary/15">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-sm text-foreground">
              Goals Timeline
            </h3>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Next 3 months
            </span>
          </div>
          {monthEntries.length === 0 ? (
            <div
              data-ocid="dashboard.goals_timeline.empty_state"
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <TrendingUp className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming goals</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Add goals with a target date to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthEntries.map(([month, monthGoals]) => (
                <div key={month}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {month}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-2">
                    {monthGoals.map((goal, i) => (
                      <div
                        key={goal.id != null ? String(goal.id) : `goal-${i}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border font-medium whitespace-nowrap",
                            CATEGORY_COLORS[goal.category as GoalCategory] ??
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {CATEGORY_LABELS[goal.category as GoalCategory] ??
                            "Other"}
                        </span>
                        <span className="text-xs text-foreground truncate flex-1 min-w-0">
                          {goal.title}
                        </span>
                        <div className="w-16 shrink-0">
                          <Progress
                            value={Number(goal.progress ?? 0)}
                            className="h-1.5"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-7 text-right shrink-0">
                          {Number(goal.progress ?? 0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: tasks, isLoading: loadingTasks } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { data: goals = [], isLoading: loadingGoals } = useAllGoals();
  const { data: journalEntries = [], isLoading: loadingJournal } =
    useAllJournalEntries();
  const createTask = useCreateTask();
  const toggleTask = useToggleTaskCompletion();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const { recordCompletion, currentStreak } = useTaskStreak();
  const {
    habits,
    getTodayCompletionCount,
    isCompletedToday,
    getCurrentStreak: getHabitStreak,
  } = useHabits();
  const { completed: habitsCompleted, total: habitsTotal } =
    getTodayCompletionCount();

  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [todoInput, setTodoInput] = useState("");
  const [activeStatModal, setActiveStatModal] = useState<StatModalType>(null);

  // Compute all task lists locally so stat cards and drill-downs always match
  const allTasks = tasks ?? [];
  const overdueTasks = allTasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date(),
  );
  const overdueIds = new Set(overdueTasks.map((t) => t.id));
  const pendingTasks = allTasks.filter(
    (t) => !t.completed && !overdueIds.has(t.id),
  );
  const completedTasks = allTasks.filter((t) => t.completed);

  // Use locally derived counts so numbers always match the drill-down lists
  const totalCount = loadingTasks ? undefined : allTasks.length;
  const completedCount = loadingTasks ? undefined : completedTasks.length;
  const pendingCount = loadingTasks ? undefined : pendingTasks.length;
  const overdueCount = loadingTasks ? undefined : overdueTasks.length;

  const statModalConfig: Record<
    Exclude<StatModalType, "streak" | "habits" | null>,
    { title: string; tasks: Task[]; emptyMessage: string }
  > = {
    total: {
      title: "All Tasks",
      tasks: allTasks,
      emptyMessage: "No tasks created yet.",
    },
    completed: {
      title: "Completed Tasks",
      tasks: completedTasks,
      emptyMessage: "No completed tasks yet. Keep going!",
    },
    pending: {
      title: "Pending Tasks",
      tasks: pendingTasks,
      emptyMessage: "No pending tasks — all done or overdue!",
    },
    overdue: {
      title: "Overdue Tasks",
      tasks: overdueTasks,
      emptyMessage: "No overdue tasks. Great work!",
    },
  };

  // Today's tasks: due today or overdue and not completed
  const todayTasks = allTasks.filter((t) => {
    if (t.completed) return false;
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return due <= today;
  });

  // Completed tasks due today or overdue
  const todayCompletedTasks = allTasks.filter((t) => {
    if (!t.completed) return false;
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return due <= today;
  });

  // Quick to-do: tasks with no due date (undated tasks treated as quick todos)
  const quickTodos = allTasks.filter((t) => !t.dueDate).slice(0, 8);

  // Recent journal entries (last 3)
  const recentJournal = [...journalEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Active goals with progress
  const activeGoals = goals
    .filter((g) => g.status === GoalStatus.active)
    .slice(0, 4);

  // Projects progress: top 5 by task count
  const projectsWithProgress = projects
    .map((p) => {
      const projectTasks = allTasks.filter((t) => t.projectId === p.id);
      const total = projectTasks.length;
      const completed = projectTasks.filter((t) => t.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...p, total, completed, progress };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const handleCreate = async (data: {
    title: string;
    desc: string;
    priority: Priority;
    dueDate: string | null;
    notes: string;
    projectId: string | null;
  }) => {
    try {
      await createTask.mutateAsync({ id: crypto.randomUUID(), ...data });
      setAddOpen(false);
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleUpdate = async (data: {
    title: string;
    desc: string;
    priority: Priority;
    dueDate: string | null;
    notes: string;
    projectId: string | null;
  }) => {
    if (!editTask) return;
    try {
      await updateTask.mutateAsync({ id: editTask.id, ...data });
      setEditTask(null);
      toast.success("Task updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleToggle = async (id: string) => {
    const task = allTasks.find((t) => t.id === id);
    try {
      await toggleTask.mutateAsync(id);
      if (task && !task.completed) {
        recordCompletion();
      }
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleAddTodo = async () => {
    const title = todoInput.trim();
    if (!title) return;
    try {
      await createTask.mutateAsync({
        id: crypto.randomUUID(),
        title,
        desc: "",
        priority: "low" as Priority,
        dueDate: null,
        notes: "",
        projectId: null,
      });
      setTodoInput("");
      toast.success("To-do added");
    } catch {
      toast.error("Failed to add to-do");
    }
  };

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
            <ListTodo className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Welcome to FocusFlow
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Sign in to manage your tasks, projects, and focus sessions. Stay
            productive and organized.
          </p>
          <p className="text-xs text-muted-foreground">
            Use the Sign in button in the sidebar to get started.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="task.add_button">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </motion.div>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Tasks"
            value={totalCount}
            icon={ListTodo}
            iconColor="bg-primary/15 text-primary"
            ocid="dashboard.stat.total.open_modal_button"
            delay={0.05}
            clickable
            onClick={() => setActiveStatModal("total")}
          />
          <StatCard
            label="Completed"
            value={completedCount}
            icon={CheckCircle2}
            iconColor="bg-emerald-500/15 text-emerald-400"
            ocid="dashboard.stat.completed.open_modal_button"
            delay={0.1}
            clickable
            onClick={() => setActiveStatModal("completed")}
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            icon={Clock}
            iconColor="bg-amber-500/15 text-amber-400"
            ocid="dashboard.stat.pending.open_modal_button"
            delay={0.15}
            clickable
            onClick={() => setActiveStatModal("pending")}
          />
          <StatCard
            label="Overdue"
            value={overdueCount}
            icon={AlertTriangle}
            iconColor="bg-destructive/15 text-destructive"
            ocid="dashboard.stat.overdue.open_modal_button"
            delay={0.2}
            clickable
            onClick={() => setActiveStatModal("overdue")}
          />
        </div>
        {/* Streak pill under task stats */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setActiveStatModal("streak")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
            type="button"
            data-ocid="dashboard.streak.open_modal_button"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">
              {currentStreak} day streak
            </span>
          </button>
          <span className="text-xs text-muted-foreground">
            Keep completing tasks daily!
          </span>
        </div>
      </section>

      {/* Three-column widgets: To-Do, Journal, Goals */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quick To-Do */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            data-ocid="dashboard.todo.section"
          >
            <Card className="border-border bg-card h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-primary/15">
                    <ListTodo className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    To-Do List
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {quickTodos.filter((t) => !t.completed).length} left
                  </span>
                </div>

                {/* Add input */}
                <div className="flex gap-1.5 mb-3">
                  <Input
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                    placeholder="Add a to-do..."
                    className="text-xs h-8"
                    data-ocid="dashboard.todo.input"
                  />
                  <Button
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleAddTodo}
                    disabled={!todoInput.trim() || createTask.isPending}
                    data-ocid="dashboard.todo.add_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* List */}
                {loadingTasks ? (
                  <div
                    className="space-y-2"
                    data-ocid="dashboard.todo.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-6 w-full rounded" />
                    ))}
                  </div>
                ) : quickTodos.length === 0 ? (
                  <div
                    className="text-center py-6"
                    data-ocid="dashboard.todo.empty_state"
                  >
                    <p className="text-xs text-muted-foreground">
                      No to-dos yet. Add one above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                    {quickTodos.map((task, i) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 group"
                        data-ocid={`dashboard.todo.item.${i + 1}`}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggle(task.id)}
                          className="h-3.5 w-3.5 flex-shrink-0"
                          data-ocid={`dashboard.todo.checkbox.${i + 1}`}
                        />
                        <span
                          className={cn(
                            "text-xs flex-1 min-w-0 truncate",
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground",
                          )}
                        >
                          {task.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          data-ocid={`dashboard.todo.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Journal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            data-ocid="dashboard.journal.section"
          >
            <Card className="border-border bg-card h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-violet-500/15">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                  </div>
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Journal
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {journalEntries.length} entries
                  </span>
                </div>

                {loadingJournal ? (
                  <div
                    className="space-y-3"
                    data-ocid="dashboard.journal.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                ) : recentJournal.length === 0 ? (
                  <div
                    className="text-center py-6"
                    data-ocid="dashboard.journal.empty_state"
                  >
                    <BookOpen className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      No journal entries yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentJournal.map((entry: JournalEntry, i: number) => (
                      <div
                        key={entry.id}
                        className="rounded-lg bg-muted/50 px-3 py-2"
                        data-ocid={`dashboard.journal.item.${i + 1}`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-medium text-foreground truncate flex-1 mr-2">
                            {entry.title}
                          </span>
                          <span className="text-base leading-none flex-shrink-0">
                            {MOOD_EMOJI[entry.mood]}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {entry.content && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {entry.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            data-ocid="dashboard.goals.section"
          >
            <Card className="border-border bg-card h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-emerald-500/15">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Goals
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {activeGoals.length} active
                  </span>
                </div>

                {loadingGoals ? (
                  <div
                    className="space-y-3"
                    data-ocid="dashboard.goals.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                ) : activeGoals.length === 0 ? (
                  <div
                    className="text-center py-6"
                    data-ocid="dashboard.goals.empty_state"
                  >
                    <Target className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      No active goals yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activeGoals.map((goal: Goal, i: number) => (
                      <div
                        key={goal.id}
                        className="rounded-lg bg-muted/50 px-3 py-2"
                        data-ocid={`dashboard.goals.item.${i + 1}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate flex-1 mr-2">
                            {goal.title}
                          </span>
                          <span className="text-xs font-semibold text-emerald-400 flex-shrink-0">
                            {goal.progress}%
                          </span>
                        </div>
                        <Progress
                          value={Number(goal.progress)}
                          className="h-1.5"
                        />
                        {goal.targetDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due{" "}
                            {new Date(goal.targetDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {/* Habits Widget */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            data-ocid="dashboard.habits.section"
          >
            <Card
              className="border-border bg-card h-full cursor-pointer hover:border-teal-500/40 transition-colors"
              onClick={() => setActiveStatModal("habits")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-teal-500/15">
                    <Repeat2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    Habits
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {habitsCompleted}/{habitsTotal} done
                  </span>
                </div>
                {habits.length === 0 ? (
                  <div
                    className="text-center py-6"
                    data-ocid="dashboard.habits.empty_state"
                  >
                    <Repeat2 className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      No habits yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {habits.slice(0, 6).map((habit, i) => {
                      const done = isCompletedToday(habit.id);
                      const streak = getHabitStreak(habit.id);
                      return (
                        <div
                          key={habit.id}
                          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                          data-ocid={`dashboard.habits.item.${i + 1}`}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: habit.color ?? "#14b8a6",
                            }}
                          />
                          <span
                            className={`text-xs flex-1 truncate ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {habit.name}
                          </span>
                          {streak > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-amber-400 flex-shrink-0">
                              <Flame className="w-3 h-3" />
                              {streak}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Mini Calendar + Goals Timeline */}
      <section data-ocid="dashboard.calendar_timeline.section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mini Calendar */}
          <MiniCalendar tasks={tasks ?? []} />
          {/* Goals Timeline */}
          <GoalsTimeline goals={goals} />
        </div>
      </section>

      {/* Projects Progress */}
      <section data-ocid="dashboard.projects_progress.section">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Projects Progress
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {projectsWithProgress.length} project
              {projectsWithProgress.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingTasks ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : projectsWithProgress.length === 0 ? (
            <div
              className="border border-dashed border-border rounded-xl p-8 text-center"
              data-ocid="dashboard.projects_progress.empty_state"
            >
              <FolderOpen className="w-7 h-7 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                No projects yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a project to track progress.
              </p>
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {projectsWithProgress.map((project, i) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 px-5 py-3.5"
                      data-ocid={`dashboard.projects_progress.item.${i + 1}`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium text-foreground min-w-0 truncate flex-1">
                        {project.name}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {project.completed} / {project.total} tasks
                        </span>
                        <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{
                              duration: 0.6,
                              delay: 0.1 + i * 0.06,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground tabular-nums w-9 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </section>

      {/* Today's Tasks */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Today's Focus
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingTasks ? (
            <div className="space-y-2" data-ocid="dashboard.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : todayTasks.length === 0 ? (
            <div
              className="border border-dashed border-border rounded-xl p-10 text-center"
              data-ocid="dashboard.empty_state"
            >
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                All clear for today!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No tasks due today. Add one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={projects}
                  index={i}
                  onToggle={handleToggle}
                  onEdit={setEditTask}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Completed Today */}
      {todayCompletedTasks.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Completed Today
              </h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {todayCompletedTasks.length} task
                {todayCompletedTasks.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-2 opacity-70">
              {todayCompletedTasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={projects}
                  index={i}
                  onToggle={handleToggle}
                  onEdit={setEditTask}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Add task dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="task.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projects={projects}
            onSubmit={handleCreate}
            isPending={createTask.isPending}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit task dialog */}
      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent data-ocid="task.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <TaskForm
              initialData={editTask}
              projects={projects}
              onSubmit={handleUpdate}
              isPending={updateTask.isPending}
              onCancel={() => setEditTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Task stat drill-down modal */}
      {activeStatModal &&
        activeStatModal !== "streak" &&
        activeStatModal !== "habits" && (
          <TaskDrilldownModal
            open
            onClose={() => setActiveStatModal(null)}
            title={statModalConfig[activeStatModal].title}
            tasks={statModalConfig[activeStatModal].tasks}
            emptyMessage={statModalConfig[activeStatModal].emptyMessage}
          />
        )}

      {/* Streak modal */}
      <StreakModal
        open={activeStatModal === "streak"}
        onClose={() => setActiveStatModal(null)}
        currentStreak={currentStreak}
        completedTasks={completedTasks}
      />

      {/* Habits Today modal */}
      <HabitsModal
        open={activeStatModal === "habits"}
        onClose={() => setActiveStatModal(null)}
        habits={habits}
        isCompletedToday={isCompletedToday}
        getCurrentStreak={getHabitStreak}
        habitsCompleted={habitsCompleted}
        habitsTotal={habitsTotal}
      />
    </div>
  );
}
