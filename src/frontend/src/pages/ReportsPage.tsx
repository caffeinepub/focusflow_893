import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import {
  BarChart3,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  ListTodo,
  LogIn,
  SmilePlus,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

function GoalsSummaryCard({ goals }: { goals: Goal[] }) {
  const active = goals.filter((g) => g.status === GoalStatus.active).length;
  const completed = goals.filter(
    (g) => g.status === GoalStatus.completed,
  ).length;
  const avgProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
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
            Goals Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
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
}: {
  months: 3 | 6;
  tasks: Task[];
  projects: { id: string; name: string; color: string }[];
  goals: Goal[];
  isLoading: boolean;
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
      <GoalsSummaryCard goals={goals} />

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
    </div>
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
}: {
  tasks: Task[];
  isLoading: boolean;
  journalEntries: JournalEntry[];
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
          </>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [], isLoading: loadingTasks } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { data: goals = [], isLoading: loadingGoals } = useAllGoals();
  const { data: journalEntries = [] } = useAllJournalEntries();

  const [periodTab, setPeriodTab] = useState<"weekly" | "3mo" | "6mo">(
    "weekly",
  );

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
        className="mb-6"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Reports
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Your productivity summary across time periods
        </p>
      </motion.div>

      {/* Period tabs */}
      <div className="flex items-center gap-1 mb-6 bg-card border border-border rounded-lg p-1 w-fit">
        {[
          {
            key: "weekly" as const,
            label: "Weekly",
            ocid: "reports.weekly.tab",
          },
          { key: "3mo" as const, label: "3 Months", ocid: "reports.3mo.tab" },
          { key: "6mo" as const, label: "6 Months", ocid: "reports.6mo.tab" },
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

      {/* Content */}
      {periodTab === "weekly" && (
        <WeeklyView
          tasks={tasks}
          isLoading={loadingTasks}
          journalEntries={journalEntries}
        />
      )}
      {periodTab === "3mo" && (
        <PeriodView
          months={3}
          tasks={tasks}
          projects={projects}
          goals={goals}
          isLoading={loadingTasks || loadingGoals}
        />
      )}
      {periodTab === "6mo" && (
        <PeriodView
          months={6}
          tasks={tasks}
          projects={projects}
          goals={goals}
          isLoading={loadingTasks || loadingGoals}
        />
      )}
    </div>
  );
}
