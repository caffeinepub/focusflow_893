import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart3,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileDown,
  FileSpreadsheet,
  FileText,
  FileType,
  Flame,
  ListTodo,
  LogIn,
  Printer,
  RefreshCw,
  Repeat2,
  SmilePlus,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import * as XLSX from "xlsx";
import { type FocusSession, useFocusSessions } from "../hooks/useFocusSessions";
import { type Habit, useHabits } from "../hooks/useHabits";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Goal,
  GoalStatus,
  type JournalEntry,
  JournalMood,
  type Task,
  useAllGoals,
  useAllJournalEntries,
  useAllProjects,
  useAllTasks,
} from "../hooks/useQueries";

// ─── Week helpers ─────────────────────────────────────────────────────────────

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

function addWeeks(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}

function formatWeekRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `Week of ${startStr} – ${endStr}`;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// ─── Monthly helpers ──────────────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

// ─── Weekly stats ─────────────────────────────────────────────────────────────

interface DayStats {
  day: string;
  date: string;
  due: number;
  completed: number;
  pending: number;
}

interface WeekStats {
  completedCount: number;
  createdCount: number;
  highPriorityCompleted: number;
  completionRate: number;
  perDay: DayStats[];
  hasAnyTasks: boolean;
}

function computeWeekStats(tasks: Task[], weekStart: Date): WeekStats {
  const weekEnd = getWeekEnd(weekStart);
  const days: DayStats[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return {
      day: DAY_NAMES[i],
      date: toDateKey(d),
      due: 0,
      completed: 0,
      pending: 0,
    };
  });

  let completedCount = 0;
  let createdCount = 0;
  let highPriorityCompleted = 0;

  for (const task of tasks) {
    if (!task.dueDate) continue;
    const dueDate = new Date(task.dueDate);
    if (dueDate < weekStart || dueDate > weekEnd) continue;
    createdCount++;
    const dayIndex = days.findIndex((d) => d.date === toDateKey(dueDate));
    if (dayIndex !== -1) {
      days[dayIndex].due++;
      if (task.completed) {
        days[dayIndex].completed++;
        completedCount++;
        if (task.priority === "high") highPriorityCompleted++;
      } else {
        days[dayIndex].pending++;
      }
    }
  }

  const completionRate =
    createdCount > 0 ? Math.round((completedCount / createdCount) * 100) : 0;

  return {
    completedCount,
    createdCount,
    highPriorityCompleted,
    completionRate,
    perDay: days,
    hasAnyTasks: createdCount > 0,
  };
}

// ─── Monthly stats ────────────────────────────────────────────────────────────

interface MonthStats {
  month: string;
  due: number;
  completed: number;
}

interface PeriodStats {
  totalDue: number;
  totalCompleted: number;
  avgCompletionRate: number;
  perMonth: MonthStats[];
}

function computePeriodStats(tasks: Task[], months: number): PeriodStats {
  const now = new Date();
  const periodStart = getMonthStart(addMonths(now, -(months - 1)));
  const periodEnd = getMonthEnd(now);

  // Build month buckets
  const monthBuckets: MonthStats[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = addMonths(now, -i);
    monthBuckets.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      due: 0,
      completed: 0,
    });
  }

  let totalDue = 0;
  let totalCompleted = 0;

  for (const task of tasks) {
    if (!task.dueDate) continue;
    const d = new Date(task.dueDate);
    if (d < periodStart || d > periodEnd) continue;
    // Find which month bucket
    const monthKey = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const bucket = monthBuckets.find((b) => b.month === monthKey);
    if (bucket) {
      bucket.due++;
      totalDue++;
      if (task.completed) {
        bucket.completed++;
        totalCompleted++;
      }
    }
  }

  const avgCompletionRate =
    totalDue > 0 ? Math.round((totalCompleted / totalDue) * 100) : 0;

  return {
    totalDue,
    totalCompleted,
    avgCompletionRate,
    perMonth: monthBuckets,
  };
}

function computeProjectPeriodStats(
  tasks: Task[],
  projects: { id: string; name: string; color: string }[],
  months: number,
) {
  const now = new Date();
  const periodStart = getMonthStart(addMonths(now, -(months - 1)));
  const periodEnd = getMonthEnd(now);

  return projects
    .map((p) => {
      const projectTasks = tasks.filter(
        (t) =>
          t.projectId === p.id &&
          t.dueDate &&
          new Date(t.dueDate) >= periodStart &&
          new Date(t.dueDate) <= periodEnd,
      );
      const total = projectTasks.length;
      const completed = projectTasks.filter((t) => t.completed).length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...p, total, completed, rate };
    })
    .filter((p) => p.total > 0);
}

// ─── Chart configs ────────────────────────────────────────────────────────────

const weeklyChartConfig: ChartConfig = {
  completed: { label: "Completed", color: "oklch(var(--chart-1))" },
  pending: { label: "Pending", color: "oklch(var(--chart-3))" },
};

const monthlyChartConfig: ChartConfig = {
  completed: { label: "Completed", color: "oklch(var(--chart-1))" },
  due: { label: "Due", color: "oklch(var(--chart-3))" },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  iconColor,
  ocid,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  ocid: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      data-ocid={ocid}
    >
      <Card className="border-border bg-card card-hover relative overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                {label}
              </p>
              <p className="text-3xl font-display font-bold text-foreground">
                {value}
                {suffix && (
                  <span className="text-lg font-semibold ml-0.5">{suffix}</span>
                )}
              </p>
            </div>
            <div className={cn("p-2.5 rounded-lg", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Goals Summary Card ───────────────────────────────────────────────────────

function GoalsSummaryCard({
  goals,
  months,
}: { goals: Goal[]; months: number }) {
  const now = new Date();
  const periodEnd = new Date(
    now.getFullYear(),
    now.getMonth() + months,
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  const periodGoals = goals.filter((g) => {
    if (!g.targetDate) return false;
    const d = new Date(g.targetDate);
    return d >= now && d <= periodEnd;
  });

  const active = periodGoals.filter(
    (g) => g.status === GoalStatus.active,
  ).length;
  const completed = periodGoals.filter(
    (g) => g.status === GoalStatus.completed,
  ).length;
  const avgProgress =
    periodGoals.length > 0
      ? Math.round(
          periodGoals.reduce((sum, g) => sum + Number(g.progress), 0) /
            periodGoals.length,
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      data-ocid="reports.goals_summary.card"
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Goals Snapshot ({months}-Month Window)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {periodGoals.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl"
              data-ocid="reports.goals_snapshot.empty_state"
            >
              <Target className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No goals due in the next {months} months.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set a target date on your goals to see them here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-amber-400">
                    {active}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-emerald-400">
                    {completed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Completed
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-display font-bold text-foreground">
                    {avgProgress}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Avg Progress
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-1">
                {periodGoals.map((g, i) => (
                  <div
                    key={g.id}
                    className="space-y-1"
                    data-ocid={`reports.goals_snapshot.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground truncate flex-1">
                        {g.title}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge
                          className={cn(
                            "text-[10px] px-1.5 py-0 border-none font-semibold",
                            g.status === GoalStatus.completed
                              ? "bg-emerald-500/15 text-emerald-400"
                              : g.status === GoalStatus.paused
                                ? "bg-muted text-muted-foreground"
                                : "bg-amber-500/15 text-amber-400",
                          )}
                        >
                          {g.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                          {g.progress}%
                        </span>
                      </div>
                    </div>
                    <Progress value={Number(g.progress)} className="h-1.5" />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Period View (3mo / 6mo) ──────────────────────────────────────────────────

function PeriodView({
  months,
  tasks,
  projects,
  goals,
  isLoading,
  todos,
  habits,
  getStreak,
  isCompletedToday,
}: {
  months: 1 | 3 | 6 | 12;
  tasks: Task[];
  projects: { id: string; name: string; color: string }[];
  goals: Goal[];
  isLoading: boolean;
  todos: { id: string; title: string; completed: boolean; createdAt: number }[];
  habits: Habit[];
  getStreak: (id: string) => number;
  isCompletedToday: (id: string) => boolean;
}) {
  const periodStats = useMemo(
    () => computePeriodStats(tasks, months),
    [tasks, months],
  );

  const projectStats = useMemo(
    () => computeProjectPeriodStats(tasks, projects, months),
    [tasks, projects, months],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Due"
          value={periodStats.totalDue}
          icon={ListTodo}
          iconColor="bg-primary/15 text-primary"
          ocid="reports.period_due.card"
          delay={0.05}
        />
        <StatCard
          label="Completed"
          value={periodStats.totalCompleted}
          icon={CheckCircle2}
          iconColor="bg-emerald-500/15 text-emerald-400"
          ocid="reports.period_completed.card"
          delay={0.1}
        />
        <StatCard
          label="Avg Completion"
          value={periodStats.avgCompletionRate}
          suffix="%"
          icon={TrendingUp}
          iconColor="bg-amber-500/15 text-amber-400"
          ocid="reports.period_rate.card"
          delay={0.15}
        />
        <StatCard
          label="Active Goals"
          value={goals.filter((g) => g.status === GoalStatus.active).length}
          icon={Target}
          iconColor="bg-violet-500/15 text-violet-400"
          ocid="reports.period_goals.card"
          delay={0.2}
        />
      </div>

      {/* Monthly chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        data-ocid="reports.monthly_chart.panel"
      >
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">
              Monthly Task Completion
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Last {months} months — due vs completed
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyChartConfig} className="h-56 w-full">
              <BarChart
                data={periodStats.perMonth}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  radius={[4, 4, 0, 0]}
                  stackId="a"
                />
                <Bar
                  dataKey="due"
                  name="Pending"
                  fill="var(--color-due)"
                  radius={[4, 4, 0, 0]}
                  stackId="a"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals summary */}
      <GoalsSummaryCard goals={goals} months={months} />

      {/* Projects within period */}
      {projectStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base">
                Project Completion ({months}-Month Period)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {projectStats.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 px-5 py-3"
                    data-ocid={`reports.projects_period.item.${i + 1}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-sm font-medium text-foreground flex-1 truncate">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {p.completed} / {p.total}
                      </span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.rate}%` }}
                          transition={{
                            duration: 0.5,
                            delay: 0.1 + i * 0.05,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground tabular-nums w-9 text-right">
                        {p.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {/* Extra Data: Projects, Todos, Habits */}
      {!isLoading && (
        <ExtraDataSection
          tasks={tasks}
          projects={projects}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
    </div>
  );
}

// ─── Goals This Week Card ─────────────────────────────────────────────────────

function GoalsThisWeekCard({
  goals,
  weekStart,
  weekEnd,
}: {
  goals: Goal[];
  weekStart: Date;
  weekEnd: Date;
}) {
  const weekGoals = useMemo(() => {
    return goals.filter((g) => {
      if (!g.targetDate) return false;
      const d = new Date(g.targetDate);
      return d >= weekStart && d <= weekEnd;
    });
  }, [goals, weekStart, weekEnd]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      data-ocid="reports.goals_week.card"
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Goals This Week
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Goals with target dates falling this week
          </p>
        </CardHeader>
        <CardContent>
          {weekGoals.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl"
              data-ocid="reports.goals_week.empty_state"
            >
              <Target className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No goals due this week.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Goals with target dates in this week will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {weekGoals.map((g, i) => (
                <div
                  key={g.id}
                  className="space-y-1.5"
                  data-ocid={`reports.goals_week.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground truncate flex-1">
                      {g.title}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge
                        className={cn(
                          "text-[10px] px-1.5 py-0 border-none font-semibold",
                          g.status === GoalStatus.completed
                            ? "bg-emerald-500/15 text-emerald-400"
                            : g.status === GoalStatus.paused
                              ? "bg-muted text-muted-foreground"
                              : "bg-amber-500/15 text-amber-400",
                        )}
                      >
                        {g.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {g.targetDate
                          ? new Date(g.targetDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={Number(g.progress)}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs font-semibold text-foreground tabular-nums w-8 text-right">
                      {g.progress}%
                    </span>
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

// ─── Focus Time This Week Card ────────────────────────────────────────────────

function FocusTimeCard({
  focusSessions,
  weekStart,
  weekEnd,
}: {
  focusSessions: FocusSession[];
  weekStart: Date;
  weekEnd: Date;
}) {
  const weekSessions = useMemo(() => {
    return focusSessions.filter((s) => {
      const d = new Date(s.completedAt);
      return d >= weekStart && d <= weekEnd;
    });
  }, [focusSessions, weekStart, weekEnd]);

  const totalSeconds = weekSessions.reduce(
    (sum, s) => sum + s.durationSeconds,
    0,
  );
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const displayTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const taskBreakdown = useMemo(() => {
    const map: Record<string, { label: string; minutes: number }> = {};
    for (const s of weekSessions) {
      const key = s.taskId ?? "__notask__";
      const label = s.taskTitle ?? "No task linked";
      if (!map[key]) map[key] = { label, minutes: 0 };
      map[key].minutes += Math.round(s.durationSeconds / 60);
    }
    return Object.values(map).sort((a, b) => b.minutes - a.minutes);
  }, [weekSessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      data-ocid="reports.focus_time.card"
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary" />
            Focus Time This Week
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Pomodoro sessions completed this week
          </p>
        </CardHeader>
        <CardContent>
          {weekSessions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl"
              data-ocid="reports.focus_time.empty_state"
            >
              <Clock className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No focus sessions this week.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete a Pomodoro session to see your focus log here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-display font-bold text-primary">
                    {displayTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Total focus time
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-display font-bold text-foreground">
                    {weekSessions.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sessions completed
                  </p>
                </div>
              </div>
              {taskBreakdown.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    By Task
                  </p>
                  {taskBreakdown.map(({ label, minutes }, i) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-2"
                      data-ocid={`reports.focus_time.item.${i + 1}`}
                    >
                      <span className="text-sm text-foreground truncate flex-1">
                        {label}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0"
                      >
                        {minutes}m
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Weekly View ──────────────────────────────────────────────────────────────

// ─── Mood config ──────────────────────────────────────────────────────────────

const MOOD_CONFIG: Record<
  JournalMood,
  { emoji: string; label: string; color: string; bgColor: string }
> = {
  [JournalMood.happy]: {
    emoji: "😊",
    label: "Happy",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/15",
  },
  [JournalMood.neutral]: {
    emoji: "😐",
    label: "Neutral",
    color: "text-blue-400",
    bgColor: "bg-blue-500/15",
  },
  [JournalMood.sad]: {
    emoji: "😢",
    label: "Sad",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/15",
  },
  [JournalMood.stressed]: {
    emoji: "😰",
    label: "Stressed",
    color: "text-red-400",
    bgColor: "bg-red-500/15",
  },
  [JournalMood.energized]: {
    emoji: "⚡",
    label: "Energized",
    color: "text-green-400",
    bgColor: "bg-green-500/15",
  },
};

function WeeklyReflection({
  journalEntries,
  weekStart,
  weekEnd,
}: {
  journalEntries: JournalEntry[];
  weekStart: Date;
  weekEnd: Date;
}) {
  const weekEntries = useMemo(() => {
    return journalEntries.filter((e) => {
      const d = new Date(`${e.date}T00:00:00`);
      return d >= weekStart && d <= weekEnd;
    });
  }, [journalEntries, weekStart, weekEnd]);

  const moodCounts = useMemo(() => {
    const counts: Partial<Record<JournalMood, number>> = {};
    for (const e of weekEntries) {
      counts[e.mood] = (counts[e.mood] ?? 0) + 1;
    }
    return counts;
  }, [weekEntries]);

  const dominantMood = useMemo(() => {
    let best: JournalMood | null = null;
    let bestCount = 0;
    for (const [mood, count] of Object.entries(moodCounts) as [
      JournalMood,
      number,
    ][]) {
      if (count > bestCount) {
        best = mood;
        bestCount = count;
      }
    }
    return best;
  }, [moodCounts]);

  const chartData = useMemo(() => {
    return Object.values(JournalMood).map((mood) => ({
      mood: MOOD_CONFIG[mood].label,
      emoji: MOOD_CONFIG[mood].emoji,
      count: moodCounts[mood] ?? 0,
    }));
  }, [moodCounts]);

  const totalEntries = weekEntries.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      data-ocid="reports.reflection.card"
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </div>
              <CardTitle className="font-display text-base">
                Weekly Reflection
              </CardTitle>
            </div>
            {dominantMood && (
              <Badge
                data-ocid="reports.reflection.mood_badge"
                className={cn(
                  "text-xs font-semibold border-none px-2.5 py-1",
                  MOOD_CONFIG[dominantMood].bgColor,
                  MOOD_CONFIG[dominantMood].color,
                )}
              >
                {MOOD_CONFIG[dominantMood].emoji}{" "}
                {MOOD_CONFIG[dominantMood].label} week
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalEntries === 0
              ? "No journal entries this week yet."
              : dominantMood
                ? `You felt ${MOOD_CONFIG[dominantMood].label.toLowerCase()} most this week with ${totalEntries} journal ${totalEntries === 1 ? "entry" : "entries"}.`
                : `${totalEntries} journal ${totalEntries === 1 ? "entry" : "entries"} this week.`}
          </p>
        </CardHeader>
        <CardContent>
          {totalEntries === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-xl"
              data-ocid="reports.reflection.empty_state"
            >
              <SmilePlus className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Write a journal entry to see your mood trends here.
              </p>
            </div>
          ) : (
            <div
              className="space-y-3"
              data-ocid="reports.reflection.entry_count"
            >
              <div className="grid grid-cols-5 gap-2">
                {chartData.map(({ mood, emoji, count }) => (
                  <div
                    key={mood}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="text-lg">{emoji}</div>
                    <div className="w-full bg-muted rounded-full overflow-hidden h-2">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-700"
                        style={{
                          width:
                            totalEntries > 0
                              ? `${(count / totalEntries) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {count}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight text-center">
                      {mood}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground pt-1">
                <span className="font-semibold text-foreground">
                  {totalEntries}
                </span>{" "}
                {totalEntries === 1 ? "entry" : "entries"} recorded this week
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WeeklyView({
  tasks,
  isLoading,
  journalEntries,
  goals,
  focusSessions,
  projects,
  todos,
  habits,
  getStreak,
  isCompletedToday,
}: {
  tasks: Task[];
  isLoading: boolean;
  journalEntries: JournalEntry[];
  goals: Goal[];
  focusSessions: FocusSession[];
  projects: { id: string; name: string; color: string }[];
  todos: { id: string; title: string; completed: boolean; createdAt: number }[];
  habits: Habit[];
  getStreak: (id: string) => number;
  isCompletedToday: (id: string) => boolean;
}) {
  const [weekStart, setWeekStart] = useState<Date>(() =>
    getWeekStart(new Date()),
  );
  const weekEnd = getWeekEnd(weekStart);
  const stats = useMemo(
    () => computeWeekStats(tasks, weekStart),
    [tasks, weekStart],
  );

  const prevWeek = () => setWeekStart((w) => getWeekStart(addWeeks(w, -1)));
  const nextWeek = () => setWeekStart((w) => getWeekStart(addWeeks(w, 1)));

  return (
    <div className="space-y-6">
      {/* Week selector */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={prevWeek}
          data-ocid="reports.prev_week.button"
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 px-2 py-1">
          <CalendarRange className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground whitespace-nowrap">
            {formatWeekRange(weekStart, weekEnd)}
          </span>
        </div>
        <button
          type="button"
          onClick={nextWeek}
          data-ocid="reports.next_week.button"
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Completed"
              value={stats.completedCount}
              icon={CheckCircle2}
              iconColor="bg-emerald-500/15 text-emerald-400"
              ocid="reports.completed_card.card"
              delay={0.05}
            />
            <StatCard
              label="Due This Week"
              value={stats.createdCount}
              icon={ListTodo}
              iconColor="bg-primary/15 text-primary"
              ocid="reports.created_card.card"
              delay={0.1}
            />
            <StatCard
              label="High Priority Done"
              value={stats.highPriorityCompleted}
              icon={Flame}
              iconColor="bg-destructive/15 text-destructive"
              ocid="reports.high_priority_card.card"
              delay={0.15}
            />
            <StatCard
              label="Completion Rate"
              value={stats.completionRate}
              suffix="%"
              icon={TrendingUp}
              iconColor="bg-amber-500/15 text-amber-400"
              ocid="reports.completion_rate_card.card"
              delay={0.2}
            />
          </div>

          {!stats.hasAnyTasks ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl"
              data-ocid="reports.empty_state"
            >
              <div className="w-14 h-14 rounded-xl bg-muted/60 flex items-center justify-center mb-3">
                <BarChart3 className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No tasks for this week
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Tasks with due dates in this week will appear here.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Bar chart */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                data-ocid="reports.weekly_chart.panel"
              >
                <Card className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">
                      Daily Task Completion
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Completed vs pending tasks per day
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={weeklyChartConfig}
                      className="h-56 w-full"
                    >
                      <BarChart
                        data={stats.perDay}
                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        barCategoryGap="30%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="oklch(var(--border))"
                        />
                        <XAxis
                          dataKey="day"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="completed"
                          fill="var(--color-completed)"
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                        <Bar
                          dataKey="pending"
                          fill="var(--color-pending)"
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Breakdown table */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">
                      Daily Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table data-ocid="reports.breakdown_table.table">
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="pl-6 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                            Day
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                            Tasks Due
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                            Completed
                          </TableHead>
                          <TableHead className="pr-6 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                            Pending
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.perDay.map((day, idx) => (
                          <TableRow
                            key={day.day}
                            className={cn(
                              "border-border transition-colors hover:bg-muted/30",
                              day.due === 0 && "opacity-50",
                            )}
                            data-ocid={`reports.breakdown_table.row.${idx + 1}`}
                          >
                            <TableCell className="pl-6 font-medium text-foreground py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{day.day}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    `${day.date}T00:00:00`,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <span className="font-mono text-sm">
                                {day.due}
                              </span>
                            </TableCell>
                            <TableCell className="py-3">
                              {day.completed > 0 ? (
                                <Badge className="bg-emerald-500/15 text-emerald-400 border-none text-xs font-semibold">
                                  {day.completed}
                                </Badge>
                              ) : (
                                <span className="font-mono text-sm text-muted-foreground">
                                  0
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="pr-6 py-3">
                              {day.pending > 0 ? (
                                <Badge className="bg-amber-500/15 text-amber-400 border-none text-xs font-semibold">
                                  {day.pending}
                                </Badge>
                              ) : (
                                <span className="font-mono text-sm text-muted-foreground">
                                  0
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
          <>
            {/* Weekly Reflection */}
            <WeeklyReflection
              journalEntries={journalEntries}
              weekStart={weekStart}
              weekEnd={weekEnd}
            />

            {/* Goals This Week */}
            <GoalsThisWeekCard
              goals={goals}
              weekStart={weekStart}
              weekEnd={weekEnd}
            />

            {/* Focus Time This Week */}
            <FocusTimeCard
              focusSessions={focusSessions}
              weekStart={weekStart}
              weekEnd={weekEnd}
            />
          </>
        </>
      )}
      {/* Extra Data: Projects, Todos, Habits */}
      {!isLoading && (
        <ExtraDataSection
          tasks={tasks}
          projects={projects}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
    </div>
  );
}

// ─── Extra Data Section ───────────────────────────────────────────────────────

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

function ExtraDataSection({
  tasks,
  projects,
  todos,
  habits,
  getStreak,
  isCompletedToday,
}: {
  tasks: Task[];
  projects: { id: string; name: string; color: string }[];
  todos: TodoItem[];
  habits: Habit[];
  getStreak: (id: string) => number;
  isCompletedToday: (id: string) => boolean;
}) {
  const projectStats = projects.map((p) => {
    const pt = tasks.filter((t) => t.projectId === p.id);
    const c = pt.filter((t) => t.completed).length;
    const rate = pt.length > 0 ? Math.round((c / pt.length) * 100) : 0;
    return { ...p, total: pt.length, completed: c, rate };
  });

  const doneTodos = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 mt-6">
      {/* Projects Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        data-ocid="reports.projects_overview.card"
      >
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Projects Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectStats.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl"
                data-ocid="reports.projects_overview.empty_state"
              >
                <Target className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No projects yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projectStats.map((p, i) => (
                  <div
                    key={p.id}
                    className="space-y-1.5"
                    data-ocid={`reports.projects_overview.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-sm font-medium text-foreground truncate">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {p.completed}/{p.total} tasks
                        </span>
                        <Badge
                          className={`text-[10px] px-1.5 py-0 border-none font-semibold ${p.rate >= 80 ? "bg-emerald-500/15 text-emerald-400" : p.rate >= 40 ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`}
                        >
                          {p.rate}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={p.rate} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* To-Do Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        data-ocid="reports.todos_summary.card"
      >
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-primary" />
              To-Do Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-foreground">
                  {todos.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-emerald-400">
                  {doneTodos}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-amber-400">
                  {todos.length - doneTodos}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Active</p>
              </div>
            </div>
            {todos.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-4 text-center border border-dashed border-border rounded-xl"
                data-ocid="reports.todos_summary.empty_state"
              >
                <ListTodo className="w-5 h-5 text-muted-foreground mb-1.5" />
                <p className="text-sm text-muted-foreground">
                  No to-do items yet.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {todos.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors"
                    data-ocid={`reports.todos_summary.item.${i + 1}`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 ${t.completed ? "text-emerald-400" : "text-muted-foreground/40"}`}
                    />
                    <span
                      className={`text-sm flex-1 truncate ${t.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {t.title}
                    </span>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 border-none flex-shrink-0 ${t.completed ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}
                    >
                      {t.completed ? "Done" : "Active"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Habits Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        data-ocid="reports.habits_overview.card"
      >
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Repeat2 className="w-4 h-4 text-primary" />
              Habits Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl"
                data-ocid="reports.habits_overview.empty_state"
              >
                <Repeat2 className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No habits tracked yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {habits.map((h, i) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/40 transition-colors"
                    data-ocid={`reports.habits_overview.item.${i + 1}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: h.color }}
                    />
                    <span className="text-sm font-medium text-foreground flex-1 truncate">
                      {h.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 flex-shrink-0 capitalize"
                    >
                      {h.frequency}
                    </Badge>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        {getStreak(h.id)}
                      </span>
                    </div>
                    {isCompletedToday(h.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 flex items-center justify-center text-muted-foreground/40 flex-shrink-0 text-sm">
                        —
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── AI Summary ───────────────────────────────────────────────────────────────

function AISummary({
  tasks,
  goals,
  journalEntries,
  focusSessions,
  refreshKey,
  onRefresh,
}: {
  tasks: Task[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  focusSessions: FocusSession[];
  refreshKey: number;
  onRefresh: () => void;
}) {
  const insights = useMemo(() => {
    const _ = refreshKey; // trigger recompute on refresh
    const results: { icon: string; text: string; color: string }[] = [];

    // Task completion rate
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    results.push({
      icon: "✅",
      color: "text-emerald-500",
      text: `Task completion rate: ${rate}% (${completed} of ${total} tasks completed)`,
    });

    // Tasks completed this week vs last week
    const now = new Date();
    const weekStart = getWeekStart(now);
    const prevWeekStart = addWeeks(weekStart, -1);
    const thisWeekDone = tasks.filter((t) => {
      if (!t.completed || !t.dueDate) return false;
      const d = new Date(Number(t.dueDate) / 1_000_000);
      return d >= weekStart;
    }).length;
    const lastWeekDone = tasks.filter((t) => {
      if (!t.completed || !t.dueDate) return false;
      const d = new Date(Number(t.dueDate) / 1_000_000);
      return d >= prevWeekStart && d < weekStart;
    }).length;
    const trendSymbol = thisWeekDone >= lastWeekDone ? "📈" : "📉";
    results.push({
      icon: trendSymbol,
      color: thisWeekDone >= lastWeekDone ? "text-blue-500" : "text-orange-500",
      text: `This week: ${thisWeekDone} tasks completed (${lastWeekDone} last week)`,
    });

    // Active goals
    const activeGoals = goals.filter(
      (g) => g.status === GoalStatus.active || g.status === GoalStatus.paused,
    );
    const avgProgress =
      activeGoals.length > 0
        ? Math.round(
            activeGoals.reduce((sum, g) => sum + Number(g.progress), 0) /
              activeGoals.length,
          )
        : 0;
    results.push({
      icon: "🎯",
      color: "text-purple-500",
      text: `${activeGoals.length} active goal${activeGoals.length !== 1 ? "s" : ""} — average progress ${avgProgress}%`,
    });

    // Mood trend from last 7 journal entries
    const moodMap: Record<string, number> = {
      [JournalMood.happy]: 2,
      [JournalMood.energized]: 2,
      [JournalMood.neutral]: 1,
      [JournalMood.sad]: 0,
      [JournalMood.stressed]: 0,
    };
    const recentMoods = [...journalEntries]
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 7)
      .map((e) => moodMap[e.mood as string] ?? 1);
    if (recentMoods.length > 0) {
      const avgMood =
        recentMoods.reduce((s, v) => s + v, 0) / recentMoods.length;
      const moodLabel =
        avgMood >= 1.5 ? "Positive 😊" : avgMood >= 1 ? "Neutral 😐" : "Low 😔";
      results.push({
        icon: "📓",
        color: "text-amber-500",
        text: `Mood trend (last ${recentMoods.length} entries): ${moodLabel}`,
      });
    }

    // Total focus time
    const totalMins = focusSessions.reduce(
      (sum, s) => sum + Math.round(s.durationSeconds / 60),
      0,
    );
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const focusLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    results.push({
      icon: "⏱️",
      color: "text-cyan-500",
      text: `Total focus time logged: ${focusLabel} across ${focusSessions.length} session${focusSessions.length !== 1 ? "s" : ""}`,
    });

    // Longest streak
    const maxStreak = tasks.reduce(
      (max, t) => Math.max(max, Number((t as any).streak ?? 0)),
      0,
    );
    if (maxStreak > 0) {
      results.push({
        icon: "🔥",
        color: "text-red-500",
        text: `Longest task streak: ${maxStreak} day${maxStreak !== 1 ? "s" : ""}`,
      });
    }

    return results;
  }, [tasks, goals, journalEntries, focusSessions, refreshKey]);

  return (
    <Card
      data-ocid="reports.ai_summary.card"
      className="mb-6 border-primary/20 bg-card/80 backdrop-blur-sm"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              AI Summary
            </CardTitle>
          </div>
          <button
            type="button"
            data-ocid="reports.ai_summary.button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Generated from your app data
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight) => (
            <li key={insight.text} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 text-base leading-none">
                {insight.icon}
              </span>
              <span className="text-foreground/85 leading-snug">
                {insight.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [], isLoading: loadingTasks } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { data: goals = [], isLoading: loadingGoals } = useAllGoals();
  const { data: journalEntries = [] } = useAllJournalEntries();
  const { sessions: focusSessions } = useFocusSessions();
  const { habits, getCurrentStreak: getStreak, isCompletedToday } = useHabits();
  const [todos] = useState<
    { id: string; title: string; completed: boolean; createdAt: number }[]
  >(() => {
    try {
      const raw = localStorage.getItem("focusflow_todos");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [periodTab, setPeriodTab] = useState<
    "weekly" | "1mo" | "3mo" | "6mo" | "12mo"
  >("weekly");
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportMenu]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const taskRows = tasks.map((t) => ({
      Title: t.title,
      Status: t.completed ? "Completed" : "Pending",
      Priority: t.priority || "normal",
      DueDate: t.dueDate
        ? new Date(Number(t.dueDate) / 1_000_000).toLocaleDateString()
        : "",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(taskRows),
      "Tasks",
    );
    const goalRows = goals.map((g) => ({
      Title: g.title,
      Status: g.status,
      Progress: `${g.progress || 0}%`,
      TargetDate: g.targetDate
        ? new Date(Number(g.targetDate) / 1_000_000).toLocaleDateString()
        : "",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(goalRows),
      "Goals",
    );
    const journalRows = journalEntries.map((j) => ({
      Date: new Date(Number(j.createdAt) / 1_000_000).toLocaleDateString(),
      Mood: j.mood,
      Tags: Array.isArray(j.tags) ? j.tags.join(", ") : "",
      Content: j.content?.slice(0, 200) || "",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(journalRows),
      "Journal",
    );
    const sessionRows = focusSessions.map((s) => ({
      Task: s.taskTitle || "",
      DurationMins: Math.round((s.durationSeconds || 0) / 60),
      Date: new Date(Number(s.startedAt) / 1_000_000).toLocaleDateString(),
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(sessionRows),
      "Focus Sessions",
    );
    // Projects sheet
    const projectRows = projects.map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const completedCount = projectTasks.filter((t) => t.completed).length;
      const rate =
        projectTasks.length > 0
          ? Math.round((completedCount / projectTasks.length) * 100)
          : 0;
      return {
        Name: p.name,
        "Total Tasks": projectTasks.length,
        Completed: completedCount,
        "Completion %": `${rate}%`,
      };
    });
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(projectRows),
      "Projects",
    );
    // To-Do List sheet
    const todoRows = todos.map((t) => ({
      Title: t.title,
      Status: t.completed ? "Done" : "Active",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(todoRows),
      "To-Do List",
    );
    // Habits sheet
    const habitRows = habits.map((h) => ({
      Name: h.name,
      Frequency: h.frequency,
      "Current Streak": getStreak(h.id),
      "Done Today": isCompletedToday(h.id) ? "Yes" : "No",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(habitRows),
      "Habits",
    );
    XLSX.writeFile(
      wb,
      `FocusFlow_Report_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("FocusFlow Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} | Period: ${periodTab}`,
      14,
      28,
    );
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.filter((t) => !t.completed).length;
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Task Summary", 14, 40);
    autoTable(doc, {
      startY: 44,
      head: [["Metric", "Value"]],
      body: [
        ["Total Tasks", String(tasks.length)],
        ["Completed", String(completed)],
        ["Pending", String(pending)],
        ["Total Goals", String(goals.length)],
        ["Journal Entries", String(journalEntries.length)],
        ["Focus Sessions", String(focusSessions.length)],
      ],
    });
    const finalY1 = (doc as any).lastAutoTable?.finalY || 100;
    doc.text("Tasks", 14, finalY1 + 10);
    autoTable(doc, {
      startY: finalY1 + 14,
      head: [["Title", "Status", "Priority", "Due Date"]],
      body: tasks.map((t) => [
        t.title,
        t.completed ? "Completed" : "Pending",
        t.priority || "normal",
        t.dueDate
          ? new Date(Number(t.dueDate) / 1_000_000).toLocaleDateString()
          : "-",
      ]),
    });
    doc.addPage();
    doc.text("Goals", 14, 20);
    autoTable(doc, {
      startY: 24,
      head: [["Title", "Status", "Progress"]],
      body: goals.map((g) => [g.title, g.status, `${g.progress || 0}%`]),
    });
    const finalY2 = (doc as any).lastAutoTable?.finalY || 140;
    const remaining2 = 297 - finalY2;
    if (remaining2 < 40) doc.addPage();
    const projectsY = remaining2 < 40 ? 20 : finalY2 + 10;
    doc.text("Projects", 14, projectsY);
    autoTable(doc, {
      startY: projectsY + 4,
      head: [["Name", "Total Tasks", "Completed", "Completion %"]],
      body: projects.map((p) => {
        const pt = tasks.filter((t) => t.projectId === p.id);
        const c = pt.filter((t) => t.completed).length;
        return [
          p.name,
          String(pt.length),
          String(c),
          pt.length > 0 ? `${Math.round((c / pt.length) * 100)}%` : "0%",
        ];
      }),
    });
    const finalY3 = (doc as any).lastAutoTable?.finalY || 160;
    const remaining3 = 297 - finalY3;
    if (remaining3 < 40) doc.addPage();
    const todosY = remaining3 < 40 ? 20 : finalY3 + 10;
    doc.text("To-Do List", 14, todosY);
    autoTable(doc, {
      startY: todosY + 4,
      head: [["Title", "Status"]],
      body: todos.map((t) => [t.title, t.completed ? "Done" : "Active"]),
    });
    doc.addPage();
    doc.text("Habits", 14, 20);
    autoTable(doc, {
      startY: 24,
      head: [["Name", "Frequency", "Current Streak", "Done Today"]],
      body: habits.map((h) => [
        h.name,
        h.frequency,
        String(getStreak(h.id)),
        isCompletedToday(h.id) ? "Yes" : "No",
      ]),
    });
    doc.save(`FocusFlow_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    setShowExportMenu(false);
  };

  const exportToWord = () => {
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.filter((t) => !t.completed).length;
    const html = `<html><head><meta charset="utf-8"><style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      h1 { color: #1a1a1a; } h2 { color: #333; margin-top: 24px; }
      table { border-collapse: collapse; width: 100%; margin-top: 8px; }
      th { background: #f0f0f0; padding: 6px 10px; text-align: left; border: 1px solid #ccc; }
      td { padding: 5px 10px; border: 1px solid #ddd; }
    </style></head><body>
    <h1>FocusFlow Report</h1>
    <p>Generated: ${new Date().toLocaleDateString()} | Period: ${periodTab}</p>
    <h2>Summary</h2>
    <table><tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Tasks</td><td>${tasks.length}</td></tr>
      <tr><td>Completed</td><td>${completed}</td></tr>
      <tr><td>Pending</td><td>${pending}</td></tr>
      <tr><td>Total Goals</td><td>${goals.length}</td></tr>
      <tr><td>Journal Entries</td><td>${journalEntries.length}</td></tr>
      <tr><td>Focus Sessions</td><td>${focusSessions.length}</td></tr>
    </table>
    <h2>Tasks</h2>
    <table><tr><th>Title</th><th>Status</th><th>Priority</th><th>Due Date</th></tr>
      ${tasks.map((t) => `<tr><td>${t.title}</td><td>${t.completed ? "Completed" : "Pending"}</td><td>${t.priority || "normal"}</td><td>${t.dueDate ? new Date(Number(t.dueDate) / 1_000_000).toLocaleDateString() : "-"}</td></tr>`).join("")}
    </table>
    <h2>Goals</h2>
    <table><tr><th>Title</th><th>Status</th><th>Progress</th></tr>
      ${goals.map((g) => `<tr><td>${g.title}</td><td>${g.status}</td><td>${g.progress || 0}%</td></tr>`).join("")}
    </table>
    <h2>Journal Entries</h2>
    <table><tr><th>Date</th><th>Mood</th><th>Tags</th></tr>
      ${journalEntries.map((j) => `<tr><td>${new Date(Number(j.createdAt) / 1_000_000).toLocaleDateString()}</td><td>${j.mood}</td><td>${Array.isArray(j.tags) ? j.tags.join(", ") : ""}</td></tr>`).join("")}
    </table>
    <h2>Projects</h2>
    <table><tr><th>Name</th><th>Total Tasks</th><th>Completed</th><th>Completion %</th></tr>
      ${projects
        .map((p) => {
          const pt = tasks.filter((t) => t.projectId === p.id);
          const c = pt.filter((t) => t.completed).length;
          const rate = pt.length > 0 ? Math.round((c / pt.length) * 100) : 0;
          return `<tr><td>${p.name}</td><td>${pt.length}</td><td>${c}</td><td>${rate}%</td></tr>`;
        })
        .join("")}
    </table>
    <h2>To-Do List</h2>
    <table><tr><th>Title</th><th>Status</th></tr>
      ${todos.map((t) => `<tr><td>${t.title}</td><td>${t.completed ? "Done" : "Active"}</td></tr>`).join("")}
    </table>
    <h2>Habits</h2>
    <table><tr><th>Name</th><th>Frequency</th><th>Current Streak</th><th>Done Today</th></tr>
      ${habits.map((h) => `<tr><td>${h.name}</td><td>${h.frequency}</td><td>${getStreak(h.id)}</td><td>${isCompletedToday(h.id) ? "Yes" : "No"}</td></tr>`).join("")}
    </table>
    </body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FocusFlow_Report_${new Date().toISOString().slice(0, 10)}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
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
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Reports
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Sign in to view weekly, 3-month, and 6-month productivity reports.
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
    <div className="p-6 md:p-8 max-w-6xl mx-auto" data-ocid="reports.page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Reports
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your productivity summary across time periods
          </p>
        </div>
        <div className="relative print:hidden" ref={exportMenuRef}>
          <button
            type="button"
            data-ocid="reports.export.button"
            onClick={() => setShowExportMenu((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Export
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                type="button"
                data-ocid="reports.export_pdf.button"
                onClick={exportToPDF}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <FileText className="w-4 h-4 text-red-500" />
                Export PDF
              </button>
              <button
                type="button"
                data-ocid="reports.export_word.button"
                onClick={exportToWord}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <FileType className="w-4 h-4 text-blue-500" />
                Export Word
              </button>
              <button
                type="button"
                data-ocid="reports.export_excel.button"
                onClick={exportToExcel}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
                Export Excel
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Period tabs */}
      <div className="flex items-center gap-1 mb-6 bg-card border border-border rounded-lg p-1 w-fit">
        {[
          {
            key: "weekly" as const,
            label: "Weekly",
            ocid: "reports.weekly.tab",
          },
          { key: "1mo" as const, label: "1 Month", ocid: "reports.1mo.tab" },
          { key: "3mo" as const, label: "3 Months", ocid: "reports.3mo.tab" },
          { key: "6mo" as const, label: "6 Months", ocid: "reports.6mo.tab" },
          { key: "12mo" as const, label: "1 Year", ocid: "reports.12mo.tab" },
        ].map(({ key, label, ocid }) => (
          <button
            key={key}
            type="button"
            data-ocid={ocid}
            onClick={() => setPeriodTab(key)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-semibold transition-all",
              periodTab === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* AI Summary */}
      <AISummary
        tasks={tasks}
        goals={goals}
        journalEntries={journalEntries}
        focusSessions={focusSessions}
        refreshKey={summaryRefreshKey}
        onRefresh={() => setSummaryRefreshKey((k) => k + 1)}
      />

      {/* Content */}
      {periodTab === "weekly" && (
        <WeeklyView
          tasks={tasks}
          isLoading={loadingTasks}
          journalEntries={journalEntries}
          goals={goals}
          focusSessions={focusSessions}
          projects={projects}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
      {periodTab === "3mo" && (
        <PeriodView
          months={3}
          tasks={tasks}
          projects={projects}
          goals={goals}
          isLoading={loadingTasks || loadingGoals}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
      {periodTab === "6mo" && (
        <PeriodView
          months={6}
          tasks={tasks}
          projects={projects}
          goals={goals}
          isLoading={loadingTasks || loadingGoals}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
      {periodTab === "1mo" && (
        <PeriodView
          months={1}
          tasks={tasks}
          projects={projects}
          goals={goals}
          isLoading={loadingTasks || loadingGoals}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
      {periodTab === "12mo" && (
        <PeriodView
          months={12}
          tasks={tasks}
          projects={projects}
          goals={goals}
          isLoading={loadingTasks || loadingGoals}
          todos={todos}
          habits={habits}
          getStreak={getStreak}
          isCompletedToday={isCompletedToday}
        />
      )}
    </div>
  );
}
