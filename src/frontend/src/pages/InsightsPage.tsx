import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Flame,
  Lightbulb,
  LogIn,
  RefreshCw,
  Smile,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Goal,
  GoalStatus,
  type JournalEntry,
  JournalMood,
  type Task,
  useAllGoals,
  useAllJournalEntries,
  useAllTasks,
} from "../hooks/useQueries";

// ─── Habit type ───────────────────────────────────────────────────────────────
interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDates: string[];
}

// ─── Metrics ──────────────────────────────────────────────────────────────────
interface InsightMetrics {
  // Tasks
  taskCompletionRate7d: number;
  taskCompletionRate30d: number;
  tasksCompletedThisWeek: number;
  tasksByDayOfWeek: { day: string; count: number }[];
  // Goals
  activeGoals: number;
  completedGoals: number;
  pausedGoals: number;
  avgActiveGoalProgress: number;
  stalledGoals: number;
  stalledGoalNames: string[];
  topGoals: { name: string; progress: number }[];
  // Habits
  bestStreak: number;
  bestStreakHabitName: string;
  habitsCompletedToday: number;
  totalHabits: number;
  avgHabitCompletionRate30d: number;
  // Journal / Mood
  moodDistribution: { mood: string; count: number; color: string }[];
  mostCommonMood: string;
  positiveMoodPct: number;
  negativeMoodPct: number;
  journalEntriesThisWeek: number;
}

// ─── Analysis helpers ─────────────────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function computeMetrics(
  tasks: Task[],
  goals: Goal[],
  habits: Habit[],
  journalEntries: JournalEntry[],
): InsightMetrics {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const ago7 = daysAgo(7);
  const ago30 = daysAgo(30);

  // Tasks
  const recentTasks7 = tasks.filter((t) => {
    const due = t.dueDate?.[0];
    if (!due) return false;
    return new Date(due) >= ago7;
  });
  const recentTasks30 = tasks.filter((t) => {
    const due = t.dueDate?.[0];
    if (!due) return false;
    return new Date(due) >= ago30;
  });
  const completedThisWeek = tasks.filter((t) => {
    const due = t.dueDate?.[0];
    return t.completed && due && new Date(due) >= ago7;
  });

  const taskCompletionRate7d =
    recentTasks7.length > 0
      ? Math.round(
          (recentTasks7.filter((t) => t.completed).length /
            recentTasks7.length) *
            100,
        )
      : tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.completed).length / tasks.length) * 100,
          )
        : 0;

  const taskCompletionRate30d =
    recentTasks30.length > 0
      ? Math.round(
          (recentTasks30.filter((t) => t.completed).length /
            recentTasks30.length) *
            100,
        )
      : taskCompletionRate7d;

  // Tasks by day of week (completed tasks)
  const tasksByDay: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };
  for (const t of tasks.filter((t) => t.completed && t.dueDate?.[0])) {
    const d = new Date(t.dueDate![0]!);
    const name = DAY_NAMES[d.getDay()];
    if (name) tasksByDay[name] = (tasksByDay[name] ?? 0) + 1;
  }
  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const tasksByDayOfWeek = dayOrder.map((day) => ({
    day,
    count: tasksByDay[day] ?? 0,
  }));

  // Goals
  const activeGoals = goals.filter((g) => g.status === GoalStatus.active);
  const completedGoalsList = goals.filter(
    (g) => g.status === GoalStatus.completed,
  );
  const pausedGoalsList = goals.filter((g) => g.status === GoalStatus.paused);
  const avgActiveGoalProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((s, g) => s + Number(g.progress), 0) /
            activeGoals.length,
        )
      : 0;
  const stalledGoalsList = activeGoals.filter((g) => Number(g.progress) < 20);
  const topGoals = [...goals]
    .sort((a, b) => Number(b.progress) - Number(a.progress))
    .slice(0, 5)
    .map((g) => ({ name: g.title, progress: Number(g.progress) }));

  // Habits
  let bestStreak = 0;
  let bestStreakHabitName = "";
  let habitsCompletedToday = 0;
  let totalHabitDays = 0;
  let totalPossibleHabitDays = 0;

  for (const h of habits) {
    if (h.streak > bestStreak) {
      bestStreak = h.streak;
      bestStreakHabitName = h.name;
    }
    if (h.completedDates.includes(today)) habitsCompletedToday++;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      totalPossibleHabitDays++;
      if (h.completedDates.includes(ds)) totalHabitDays++;
    }
  }
  const avgHabitCompletionRate30d =
    totalPossibleHabitDays > 0
      ? Math.round((totalHabitDays / totalPossibleHabitDays) * 100)
      : 0;

  // Journal / Mood
  const recent30Journal = journalEntries.filter(
    (e) => new Date(e.date) >= ago30,
  );
  const moodCounts: Record<string, number> = {};
  for (const e of recent30Journal) {
    let key: string;
    if (!e.mood) {
      key = "neutral";
    } else if (typeof e.mood === "string") {
      key = e.mood;
    } else {
      key = Object.keys(e.mood as object)[0] ?? "neutral";
    }
    moodCounts[key] = (moodCounts[key] ?? 0) + 1;
  }
  const moodColors: Record<string, string> = {
    happy: "var(--color-chart-1)",
    energized: "var(--color-chart-2)",
    neutral: "var(--color-chart-3)",
    sad: "var(--color-chart-4)",
    stressed: "var(--color-chart-5)",
  };
  const moodLabels: Record<string, string> = {
    happy: "Happy",
    energized: "Energized",
    neutral: "Neutral",
    sad: "Sad",
    stressed: "Stressed",
  };
  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: moodLabels[mood] ?? mood,
    count,
    color: moodColors[mood] ?? "var(--color-chart-1)",
  }));

  let mostCommonMood = "None";
  let maxMoodCount = 0;
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxMoodCount) {
      maxMoodCount = count;
      mostCommonMood = moodLabels[mood] ?? mood;
    }
  }

  const positiveCount = (moodCounts.happy ?? 0) + (moodCounts.energized ?? 0);
  const negativeCount = (moodCounts.sad ?? 0) + (moodCounts.stressed ?? 0);
  const totalMoods = recent30Journal.length;
  const positiveMoodPct =
    totalMoods > 0 ? Math.round((positiveCount / totalMoods) * 100) : 0;
  const negativeMoodPct =
    totalMoods > 0 ? Math.round((negativeCount / totalMoods) * 100) : 0;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const journalEntriesThisWeek = journalEntries.filter(
    (e) => new Date(e.date) >= weekStart,
  ).length;

  return {
    taskCompletionRate7d,
    taskCompletionRate30d,
    tasksCompletedThisWeek: completedThisWeek.length,
    tasksByDayOfWeek,
    activeGoals: activeGoals.length,
    completedGoals: completedGoalsList.length,
    pausedGoals: pausedGoalsList.length,
    avgActiveGoalProgress,
    stalledGoals: stalledGoalsList.length,
    stalledGoalNames: stalledGoalsList.map((g) => g.title),
    topGoals,
    bestStreak,
    bestStreakHabitName,
    habitsCompletedToday,
    totalHabits: habits.length,
    avgHabitCompletionRate30d,
    moodDistribution,
    mostCommonMood,
    positiveMoodPct,
    negativeMoodPct,
    journalEntriesThisWeek,
  };
}

// ─── Reflection summaries ─────────────────────────────────────────────────────
function generateWeeklySummary(m: InsightMetrics): string {
  const taskPart =
    m.taskCompletionRate7d >= 70
      ? `You had a strong week — completing ${m.taskCompletionRate7d}% of your tasks.`
      : m.taskCompletionRate7d >= 40
        ? `You completed ${m.taskCompletionRate7d}% of your tasks this week — room to push further.`
        : `Task completion this week was ${m.taskCompletionRate7d}%, which is lower than ideal. Consider reducing your load or breaking tasks into smaller steps.`;

  const habitPart =
    m.totalHabits === 0
      ? "No habits are set up yet — try adding a daily routine to build momentum."
      : m.bestStreak >= 7
        ? `Your ${
            m.bestStreakHabitName
          } habit is on fire with a ${m.bestStreak}-day streak — keep it going!`
        : m.bestStreak >= 3
          ? `Your best habit streak is ${m.bestStreak} days. You're building consistency.`
          : "Habit consistency is still early-stage. Focus on showing up daily, even briefly.";

  const moodPart =
    m.positiveMoodPct >= 60
      ? `Your mood has been largely positive (${m.positiveMoodPct}% positive entries) — that's a great foundation for productivity.`
      : m.negativeMoodPct >= 40
        ? `There's been some stress or low mood in your journal this week. Take note and consider small recovery habits.`
        : m.journalEntriesThisWeek === 0
          ? "No journal entries this week — reflection helps you spot patterns over time."
          : `Your mood is balanced — ${m.mostCommonMood} was your most common state this week.`;

  const goalPart =
    m.activeGoals === 0
      ? "No active goals this week."
      : m.avgActiveGoalProgress >= 50
        ? `Your ${m.activeGoals} active goal(s) are progressing well at ${m.avgActiveGoalProgress}% average completion.`
        : m.stalledGoals > 0
          ? `${m.stalledGoals} goal(s) have stalled below 20% — they may need attention or re-scoping.`
          : `Your active goals are at ${m.avgActiveGoalProgress}% average progress. Keep making incremental moves.`;

  return `${taskPart} ${habitPart} ${moodPart} ${goalPart}`;
}

function generateMonthlySummary(m: InsightMetrics): string {
  const taskPart =
    m.taskCompletionRate30d >= 70
      ? `Over the past month, you completed ${m.taskCompletionRate30d}% of your tasks — a solid productivity record.`
      : m.taskCompletionRate30d >= 40
        ? `Over the past month you completed ${m.taskCompletionRate30d}% of your tasks. There's clear opportunity to improve consistency.`
        : `Your 30-day task completion rate is ${m.taskCompletionRate30d}%. Prioritization strategies could help here.`;

  const goalPart =
    m.completedGoals > 0
      ? `You've completed ${m.completedGoals} goal(s) — that's real progress to celebrate.`
      : m.avgActiveGoalProgress >= 50
        ? `Your active goals are over halfway through on average (${m.avgActiveGoalProgress}%). You're in the stretch run.`
        : m.stalledGoals > 0
          ? `${m.stalledGoals} goal(s) have made little progress this month. Review whether they're still aligned with your priorities.`
          : `Your ${m.activeGoals} active goal(s) are at ${m.avgActiveGoalProgress}% average. Aim to push at least one across the finish line next month.`;

  const habitPart =
    m.avgHabitCompletionRate30d >= 70
      ? `Your habit consistency over 30 days is excellent at ${m.avgHabitCompletionRate30d}%.`
      : m.avgHabitCompletionRate30d >= 40
        ? `You maintained habits ${m.avgHabitCompletionRate30d}% of the time this month. Aim for 70%+ for lasting change.`
        : `Habit tracking has been inconsistent this month (${m.avgHabitCompletionRate30d}%). Start with one non-negotiable daily habit.`;

  const moodPart =
    m.positiveMoodPct >= 60
      ? `Your mood has been predominantly positive (${m.positiveMoodPct}%) — a healthy foundation.`
      : m.negativeMoodPct >= 40
        ? `Nearly ${m.negativeMoodPct}% of your journal moods were negative this month. Consider adding recovery and rest into your schedule.`
        : `Mood data shows a mixed month — ${m.mostCommonMood} was most common. Keep journaling to track trends.`;

  return `${taskPart} ${goalPart} ${habitPart} ${moodPart}`;
}

// ─── Strengths & Weaknesses ───────────────────────────────────────────────────
interface InsightItem {
  label: string;
  detail: string;
}

function getStrengths(m: InsightMetrics): InsightItem[] {
  const items: InsightItem[] = [];
  if (m.taskCompletionRate7d >= 70)
    items.push({
      label: "High Task Completion",
      detail: `You're completing ${m.taskCompletionRate7d}% of your tasks this week.`,
    });
  if (m.bestStreak >= 7)
    items.push({
      label: "Strong Habit Consistency",
      detail: `Your ${m.bestStreakHabitName} streak is ${m.bestStreak} days and counting.`,
    });
  if (m.positiveMoodPct >= 60)
    items.push({
      label: "Positive Mindset",
      detail: `${m.positiveMoodPct}% of your journal entries show a positive mood.`,
    });
  if (m.avgActiveGoalProgress >= 50)
    items.push({
      label: "Goal Momentum",
      detail: `Your active goals are ${m.avgActiveGoalProgress}% complete on average.`,
    });
  if (m.tasksCompletedThisWeek >= 5)
    items.push({
      label: "Productive Week",
      detail: `You've knocked out ${m.tasksCompletedThisWeek} tasks this week alone.`,
    });
  if (m.completedGoals > 0)
    items.push({
      label: "Goals Achieved",
      detail: `You've completed ${m.completedGoals} goal(s) — results you can be proud of.`,
    });
  return items;
}

function getWeaknesses(m: InsightMetrics): InsightItem[] {
  const items: InsightItem[] = [];
  if (m.taskCompletionRate7d < 40)
    items.push({
      label: "Low Task Completion",
      detail: `Only ${m.taskCompletionRate7d}% of tasks are getting done this week.`,
    });
  if (m.stalledGoals > 0)
    items.push({
      label: "Stalled Goals",
      detail: `${m.stalledGoals} goal(s) have less than 20% progress and need attention.`,
    });
  if (m.totalHabits > 0 && m.habitsCompletedToday === 0)
    items.push({
      label: "Habit Gap",
      detail: "No habits have been tracked today — don't break the chain.",
    });
  if (m.negativeMoodPct >= 40)
    items.push({
      label: "Mood Dip",
      detail: `${m.negativeMoodPct}% of recent entries show stress or sadness.`,
    });
  if (m.journalEntriesThisWeek === 0)
    items.push({
      label: "Reflection Gap",
      detail:
        "No journal entries written this week — try a 5-minute daily recap.",
    });
  if (m.avgHabitCompletionRate30d < 30 && m.totalHabits > 0)
    items.push({
      label: "Low Habit Consistency",
      detail: `Only ${m.avgHabitCompletionRate30d}% average habit completion over 30 days.`,
    });
  return items;
}

function getAdvice(m: InsightMetrics): string[] {
  const tips: string[] = [];
  if (m.taskCompletionRate7d < 50)
    tips.push(
      "Try time-blocking: assign specific hours to your most important tasks.",
    );
  if (m.stalledGoals > 0)
    tips.push(
      "Review your stalled goals and break them into smaller weekly milestones.",
    );
  if (m.bestStreak < 3 && m.totalHabits > 0)
    tips.push(
      "Start with just one keystone habit. Consistency beats intensity.",
    );
  if (m.negativeMoodPct >= 40)
    tips.push(
      "Consider a 5-minute mindfulness break during peak stress hours.",
    );
  if (m.journalEntriesThisWeek === 0)
    tips.push(
      "Set a daily journal reminder — even a single sentence counts as a reflection.",
    );
  if (m.avgActiveGoalProgress < 30 && m.activeGoals > 0)
    tips.push(
      "Pick ONE goal to sprint on this week. Focused effort moves the needle.",
    );
  tips.push(
    "Review your weekly progress every Sunday to set clear intentions for the week ahead.",
  );
  return tips.slice(0, 5);
}

// ─── Chart configs ────────────────────────────────────────────────────────────
const tasksChartConfig: ChartConfig = {
  count: { label: "Tasks", color: "hsl(var(--chart-1))" },
};

const goalsChartConfig: ChartConfig = {
  progress: { label: "Progress %", color: "hsl(var(--chart-2))" },
};

const moodChartConfig: ChartConfig = {
  count: { label: "Entries", color: "hsl(var(--chart-1))" },
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function InsightsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: tasks = [], isLoading: tasksLoading } = useAllTasks();
  const { data: goals = [], isLoading: goalsLoading } = useAllGoals();
  const { data: journalEntries = [], isLoading: journalLoading } =
    useAllJournalEntries();

  const isLoading = tasksLoading || goalsLoading || journalLoading;

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("focusflow_habits") ?? "[]");
    } catch {
      return [];
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey intentionally triggers re-read
  useEffect(() => {
    try {
      setHabits(JSON.parse(localStorage.getItem("focusflow_habits") ?? "[]"));
    } catch {
      setHabits([]);
    }
  }, [refreshKey]);

  const metrics = useMemo(() => {
    try {
      return computeMetrics(tasks, goals, habits, journalEntries);
    } catch {
      return computeMetrics([], [], [], []);
    }
  }, [tasks, goals, habits, journalEntries]);

  const strengths = useMemo(() => getStrengths(metrics), [metrics]);
  const weaknesses = useMemo(() => getWeaknesses(metrics), [metrics]);
  const advice = useMemo(() => getAdvice(metrics), [metrics]);
  const weeklySummary = useMemo(
    () => generateWeeklySummary(metrics),
    [metrics],
  );
  const monthlySummary = useMemo(
    () => generateMonthlySummary(metrics),
    [metrics],
  );

  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const isEmpty =
    tasks.length === 0 &&
    goals.length === 0 &&
    habits.length === 0 &&
    journalEntries.length === 0;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">
            Sign in to see your insights
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            AI Reflection & Insights analyzes your tasks, goals, habits, and
            journal to surface personalized patterns.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <LogIn className="h-4 w-4" />
            <span>Use the Sign In button in the sidebar</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div data-ocid="insights.loading_state" className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        data-ocid="insights.empty_state"
        className="flex flex-1 items-center justify-center p-8"
      >
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">No data to analyze yet</h2>
          <p className="text-muted-foreground text-sm">
            Start adding tasks, goals, habits, and journal entries. Once you
            have some activity, the AI will surface insights about your
            productivity patterns.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2">
            {["Add tasks", "Set goals", "Track habits", "Write in journal"].map(
              (tip) => (
                <div
                  key={tip}
                  className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-2"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {tip}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              AI Reflection & Insights
            </h1>
            <p className="text-sm text-muted-foreground">
              Analyzing your tasks, goals, habits, and journal
            </p>
          </div>
        </div>
        <Button
          data-ocid="insights.refresh_button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <Sparkles className="h-3.5 w-3.5" />
          Refresh Analysis
        </Button>
      </div>

      {/* Tab switcher */}
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "weekly" | "monthly")}
      >
        <TabsList className="grid w-[240px] grid-cols-2">
          <TabsTrigger data-ocid="insights.weekly_tab" value="weekly">
            Weekly
          </TabsTrigger>
          <TabsTrigger data-ocid="insights.monthly_tab" value="monthly">
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card
            data-ocid="insights.completion_card"
            className="border-border/60"
          >
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Task Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">
                {tab === "weekly"
                  ? metrics.taskCompletionRate7d
                  : metrics.taskCompletionRate30d}
                %
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tab === "weekly" ? "Last 7 days" : "Last 30 days"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card data-ocid="insights.goals_card" className="border-border/60">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">{metrics.activeGoals}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {metrics.avgActiveGoalProgress}% avg progress
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card data-ocid="insights.streak_card" className="border-border/60">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                Best Habit Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">{metrics.bestStreak}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {metrics.bestStreakHabitName || "No habits yet"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card data-ocid="insights.mood_card" className="border-border/60">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Smile className="h-3.5 w-3.5" />
                Mood Score
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-3xl font-bold">{metrics.positiveMoodPct}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Positive entries (30d)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 2 — Reflection Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card
          data-ocid="insights.reflection_panel"
          className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Reflection — {tab === "weekly" ? "This Week" : "This Month"}
              <Badge variant="secondary" className="ml-auto text-xs">
                AI Generated
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/80">
              {tab === "weekly" ? weeklySummary : monthlySummary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 3 — Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            data-ocid="insights.strengths_panel"
            className="border-emerald-500/20 bg-emerald-500/5 h-full"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strengths.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Keep tracking your activity — strengths will appear as
                  patterns emerge.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {strengths.map((s) => (
                    <li key={s.label} className="text-sm">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        {s.label}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {s.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            data-ocid="insights.weaknesses_panel"
            className="border-amber-500/20 bg-amber-500/5 h-full"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weaknesses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No significant weaknesses detected — great work!
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {weaknesses.map((w) => (
                    <li key={w.label} className="text-sm">
                      <span className="font-medium text-amber-700 dark:text-amber-400">
                        {w.label}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        — {w.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 4 — Practical Advice */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card data-ocid="insights.advice_panel" className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Practical Advice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {advice.map((tip, i) => (
                <li key={tip.slice(0, 30)} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80 pt-0.5">{tip}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 5 — Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card data-ocid="insights.tasks_chart" className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Tasks Completed by Day of Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={tasksChartConfig} className="h-48 w-full">
                <BarChart
                  data={metrics.tasksByDayOfWeek}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card data-ocid="insights.goals_chart" className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Goal Progress (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.topGoals.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No goals yet</p>
                </div>
              ) : (
                <ChartContainer
                  config={goalsChartConfig}
                  className="h-48 w-full"
                >
                  <BarChart
                    data={metrics.topGoals}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      className="stroke-border"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: string) =>
                        v.length > 10 ? `${v.slice(0, 10)}…` : v
                      }
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="progress"
                      fill="var(--color-progress)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 6 — Mood Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card data-ocid="insights.mood_chart" className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Mood Distribution (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.moodDistribution.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No journal entries in the last 30 days
                </p>
              </div>
            ) : (
              <ChartContainer config={moodChartConfig} className="h-48 w-full">
                <BarChart
                  data={metrics.moodDistribution}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="mood"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {metrics.moodDistribution.map((entry) => (
                      <Cell key={entry.mood} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
