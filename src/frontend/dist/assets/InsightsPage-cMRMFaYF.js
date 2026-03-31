import { c as createLucideIcon, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, g as Brain, L as LogIn, m as motion, B as Button, T as Target } from "./index-ByEywl6s.js";
import { B as Badge } from "./badge-8RcPkm_m.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-0tn5YjuE.js";
import { S as Sparkles, R as RefreshCw, C as ChartContainer, B as BarChart, a as CartesianGrid, X as XAxis, Y as YAxis, b as ChartTooltip, c as ChartTooltipContent, d as Bar, e as Cell } from "./chart-ZR_hNA_X.js";
import { S as Skeleton } from "./skeleton-C9Mi1Kxn.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-CGRUO7OV.js";
import { u as useAllTasks, b as useAllGoals, c as useAllJournalEntries } from "./useQueries-BzU7bq2r.js";
import { C as CircleCheck } from "./circle-check-CtzGxd9m.js";
import { F as Flame } from "./flame-Wu4md25O.js";
import { T as TriangleAlert } from "./triangle-alert-DVJvP0at.js";
import { G as GoalStatus } from "./backend.d-B4qOwcQE.js";
import "./index-CrHuaOeQ.js";
import "./index-B1OTAsPJ.js";
import "./index-DqkxsEnl.js";
import "./index-Bgnit1vS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Smile = createLucideIcon("smile", __iconNode);
function daysAgo(n) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function computeMetrics(tasks, goals, habits, journalEntries) {
  const now = /* @__PURE__ */ new Date();
  const today = now.toISOString().slice(0, 10);
  const ago7 = daysAgo(7);
  const ago30 = daysAgo(30);
  const recentTasks7 = tasks.filter((t) => {
    var _a;
    const due = (_a = t.dueDate) == null ? void 0 : _a[0];
    if (!due) return false;
    return new Date(due) >= ago7;
  });
  const recentTasks30 = tasks.filter((t) => {
    var _a;
    const due = (_a = t.dueDate) == null ? void 0 : _a[0];
    if (!due) return false;
    return new Date(due) >= ago30;
  });
  const completedThisWeek = tasks.filter((t) => {
    var _a;
    const due = (_a = t.dueDate) == null ? void 0 : _a[0];
    return t.completed && due && new Date(due) >= ago7;
  });
  const taskCompletionRate7d = recentTasks7.length > 0 ? Math.round(
    recentTasks7.filter((t) => t.completed).length / recentTasks7.length * 100
  ) : tasks.length > 0 ? Math.round(
    tasks.filter((t) => t.completed).length / tasks.length * 100
  ) : 0;
  const taskCompletionRate30d = recentTasks30.length > 0 ? Math.round(
    recentTasks30.filter((t) => t.completed).length / recentTasks30.length * 100
  ) : taskCompletionRate7d;
  const tasksByDay = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0
  };
  for (const t of tasks.filter((t2) => {
    var _a;
    return t2.completed && ((_a = t2.dueDate) == null ? void 0 : _a[0]);
  })) {
    const d = new Date(t.dueDate[0]);
    const name = DAY_NAMES[d.getDay()];
    if (name) tasksByDay[name] = (tasksByDay[name] ?? 0) + 1;
  }
  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const tasksByDayOfWeek = dayOrder.map((day) => ({
    day,
    count: tasksByDay[day] ?? 0
  }));
  const activeGoals = goals.filter((g) => g.status === GoalStatus.active);
  const completedGoalsList = goals.filter(
    (g) => g.status === GoalStatus.completed
  );
  const pausedGoalsList = goals.filter((g) => g.status === GoalStatus.paused);
  const avgActiveGoalProgress = activeGoals.length > 0 ? Math.round(
    activeGoals.reduce((s, g) => s + Number(g.progress), 0) / activeGoals.length
  ) : 0;
  const stalledGoalsList = activeGoals.filter((g) => Number(g.progress) < 20);
  const topGoals = [...goals].sort((a, b) => Number(b.progress) - Number(a.progress)).slice(0, 5).map((g) => ({ name: g.title, progress: Number(g.progress) }));
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
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      totalPossibleHabitDays++;
      if (h.completedDates.includes(ds)) totalHabitDays++;
    }
  }
  const avgHabitCompletionRate30d = totalPossibleHabitDays > 0 ? Math.round(totalHabitDays / totalPossibleHabitDays * 100) : 0;
  const recent30Journal = journalEntries.filter(
    (e) => new Date(e.date) >= ago30
  );
  const moodCounts = {};
  for (const e of recent30Journal) {
    let key;
    if (!e.mood) {
      key = "neutral";
    } else if (typeof e.mood === "string") {
      key = e.mood;
    } else {
      key = Object.keys(e.mood)[0] ?? "neutral";
    }
    moodCounts[key] = (moodCounts[key] ?? 0) + 1;
  }
  const moodColors = {
    happy: "var(--color-chart-1)",
    energized: "var(--color-chart-2)",
    neutral: "var(--color-chart-3)",
    sad: "var(--color-chart-4)",
    stressed: "var(--color-chart-5)"
  };
  const moodLabels = {
    happy: "Happy",
    energized: "Energized",
    neutral: "Neutral",
    sad: "Sad",
    stressed: "Stressed"
  };
  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: moodLabels[mood] ?? mood,
    count,
    color: moodColors[mood] ?? "var(--color-chart-1)"
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
  const positiveMoodPct = totalMoods > 0 ? Math.round(positiveCount / totalMoods * 100) : 0;
  const negativeMoodPct = totalMoods > 0 ? Math.round(negativeCount / totalMoods * 100) : 0;
  const weekStart = /* @__PURE__ */ new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const journalEntriesThisWeek = journalEntries.filter(
    (e) => new Date(e.date) >= weekStart
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
    journalEntriesThisWeek
  };
}
function generateWeeklySummary(m) {
  const taskPart = m.taskCompletionRate7d >= 70 ? `You had a strong week — completing ${m.taskCompletionRate7d}% of your tasks.` : m.taskCompletionRate7d >= 40 ? `You completed ${m.taskCompletionRate7d}% of your tasks this week — room to push further.` : `Task completion this week was ${m.taskCompletionRate7d}%, which is lower than ideal. Consider reducing your load or breaking tasks into smaller steps.`;
  const habitPart = m.totalHabits === 0 ? "No habits are set up yet — try adding a daily routine to build momentum." : m.bestStreak >= 7 ? `Your ${m.bestStreakHabitName} habit is on fire with a ${m.bestStreak}-day streak — keep it going!` : m.bestStreak >= 3 ? `Your best habit streak is ${m.bestStreak} days. You're building consistency.` : "Habit consistency is still early-stage. Focus on showing up daily, even briefly.";
  const moodPart = m.positiveMoodPct >= 60 ? `Your mood has been largely positive (${m.positiveMoodPct}% positive entries) — that's a great foundation for productivity.` : m.negativeMoodPct >= 40 ? `There's been some stress or low mood in your journal this week. Take note and consider small recovery habits.` : m.journalEntriesThisWeek === 0 ? "No journal entries this week — reflection helps you spot patterns over time." : `Your mood is balanced — ${m.mostCommonMood} was your most common state this week.`;
  const goalPart = m.activeGoals === 0 ? "No active goals this week." : m.avgActiveGoalProgress >= 50 ? `Your ${m.activeGoals} active goal(s) are progressing well at ${m.avgActiveGoalProgress}% average completion.` : m.stalledGoals > 0 ? `${m.stalledGoals} goal(s) have stalled below 20% — they may need attention or re-scoping.` : `Your active goals are at ${m.avgActiveGoalProgress}% average progress. Keep making incremental moves.`;
  return `${taskPart} ${habitPart} ${moodPart} ${goalPart}`;
}
function generateMonthlySummary(m) {
  const taskPart = m.taskCompletionRate30d >= 70 ? `Over the past month, you completed ${m.taskCompletionRate30d}% of your tasks — a solid productivity record.` : m.taskCompletionRate30d >= 40 ? `Over the past month you completed ${m.taskCompletionRate30d}% of your tasks. There's clear opportunity to improve consistency.` : `Your 30-day task completion rate is ${m.taskCompletionRate30d}%. Prioritization strategies could help here.`;
  const goalPart = m.completedGoals > 0 ? `You've completed ${m.completedGoals} goal(s) — that's real progress to celebrate.` : m.avgActiveGoalProgress >= 50 ? `Your active goals are over halfway through on average (${m.avgActiveGoalProgress}%). You're in the stretch run.` : m.stalledGoals > 0 ? `${m.stalledGoals} goal(s) have made little progress this month. Review whether they're still aligned with your priorities.` : `Your ${m.activeGoals} active goal(s) are at ${m.avgActiveGoalProgress}% average. Aim to push at least one across the finish line next month.`;
  const habitPart = m.avgHabitCompletionRate30d >= 70 ? `Your habit consistency over 30 days is excellent at ${m.avgHabitCompletionRate30d}%.` : m.avgHabitCompletionRate30d >= 40 ? `You maintained habits ${m.avgHabitCompletionRate30d}% of the time this month. Aim for 70%+ for lasting change.` : `Habit tracking has been inconsistent this month (${m.avgHabitCompletionRate30d}%). Start with one non-negotiable daily habit.`;
  const moodPart = m.positiveMoodPct >= 60 ? `Your mood has been predominantly positive (${m.positiveMoodPct}%) — a healthy foundation.` : m.negativeMoodPct >= 40 ? `Nearly ${m.negativeMoodPct}% of your journal moods were negative this month. Consider adding recovery and rest into your schedule.` : `Mood data shows a mixed month — ${m.mostCommonMood} was most common. Keep journaling to track trends.`;
  return `${taskPart} ${goalPart} ${habitPart} ${moodPart}`;
}
function getStrengths(m) {
  const items = [];
  if (m.taskCompletionRate7d >= 70)
    items.push({
      label: "High Task Completion",
      detail: `You're completing ${m.taskCompletionRate7d}% of your tasks this week.`
    });
  if (m.bestStreak >= 7)
    items.push({
      label: "Strong Habit Consistency",
      detail: `Your ${m.bestStreakHabitName} streak is ${m.bestStreak} days and counting.`
    });
  if (m.positiveMoodPct >= 60)
    items.push({
      label: "Positive Mindset",
      detail: `${m.positiveMoodPct}% of your journal entries show a positive mood.`
    });
  if (m.avgActiveGoalProgress >= 50)
    items.push({
      label: "Goal Momentum",
      detail: `Your active goals are ${m.avgActiveGoalProgress}% complete on average.`
    });
  if (m.tasksCompletedThisWeek >= 5)
    items.push({
      label: "Productive Week",
      detail: `You've knocked out ${m.tasksCompletedThisWeek} tasks this week alone.`
    });
  if (m.completedGoals > 0)
    items.push({
      label: "Goals Achieved",
      detail: `You've completed ${m.completedGoals} goal(s) — results you can be proud of.`
    });
  return items;
}
function getWeaknesses(m) {
  const items = [];
  if (m.taskCompletionRate7d < 40)
    items.push({
      label: "Low Task Completion",
      detail: `Only ${m.taskCompletionRate7d}% of tasks are getting done this week.`
    });
  if (m.stalledGoals > 0)
    items.push({
      label: "Stalled Goals",
      detail: `${m.stalledGoals} goal(s) have less than 20% progress and need attention.`
    });
  if (m.totalHabits > 0 && m.habitsCompletedToday === 0)
    items.push({
      label: "Habit Gap",
      detail: "No habits have been tracked today — don't break the chain."
    });
  if (m.negativeMoodPct >= 40)
    items.push({
      label: "Mood Dip",
      detail: `${m.negativeMoodPct}% of recent entries show stress or sadness.`
    });
  if (m.journalEntriesThisWeek === 0)
    items.push({
      label: "Reflection Gap",
      detail: "No journal entries written this week — try a 5-minute daily recap."
    });
  if (m.avgHabitCompletionRate30d < 30 && m.totalHabits > 0)
    items.push({
      label: "Low Habit Consistency",
      detail: `Only ${m.avgHabitCompletionRate30d}% average habit completion over 30 days.`
    });
  return items;
}
function getAdvice(m) {
  const tips = [];
  if (m.taskCompletionRate7d < 50)
    tips.push(
      "Try time-blocking: assign specific hours to your most important tasks."
    );
  if (m.stalledGoals > 0)
    tips.push(
      "Review your stalled goals and break them into smaller weekly milestones."
    );
  if (m.bestStreak < 3 && m.totalHabits > 0)
    tips.push(
      "Start with just one keystone habit. Consistency beats intensity."
    );
  if (m.negativeMoodPct >= 40)
    tips.push(
      "Consider a 5-minute mindfulness break during peak stress hours."
    );
  if (m.journalEntriesThisWeek === 0)
    tips.push(
      "Set a daily journal reminder — even a single sentence counts as a reflection."
    );
  if (m.avgActiveGoalProgress < 30 && m.activeGoals > 0)
    tips.push(
      "Pick ONE goal to sprint on this week. Focused effort moves the needle."
    );
  tips.push(
    "Review your weekly progress every Sunday to set clear intentions for the week ahead."
  );
  return tips.slice(0, 5);
}
const tasksChartConfig = {
  count: { label: "Tasks", color: "hsl(var(--chart-1))" }
};
const goalsChartConfig = {
  progress: { label: "Progress %", color: "hsl(var(--chart-2))" }
};
const moodChartConfig = {
  count: { label: "Entries", color: "hsl(var(--chart-1))" }
};
function InsightsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [tab, setTab] = reactExports.useState("weekly");
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  const { data: tasks = [], isLoading: tasksLoading } = useAllTasks();
  const { data: goals = [], isLoading: goalsLoading } = useAllGoals();
  const { data: journalEntries = [], isLoading: journalLoading } = useAllJournalEntries();
  const isLoading = tasksLoading || goalsLoading || journalLoading;
  const [habits, setHabits] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("focusflow_habits") ?? "[]");
    } catch {
      return [];
    }
  });
  reactExports.useEffect(() => {
    try {
      setHabits(JSON.parse(localStorage.getItem("focusflow_habits") ?? "[]"));
    } catch {
      setHabits([]);
    }
  }, [refreshKey]);
  const metrics = reactExports.useMemo(() => {
    try {
      return computeMetrics(tasks, goals, habits, journalEntries);
    } catch {
      return computeMetrics([], [], [], []);
    }
  }, [tasks, goals, habits, journalEntries]);
  const strengths = reactExports.useMemo(() => getStrengths(metrics), [metrics]);
  const weaknesses = reactExports.useMemo(() => getWeaknesses(metrics), [metrics]);
  const advice = reactExports.useMemo(() => getAdvice(metrics), [metrics]);
  const weeklySummary = reactExports.useMemo(
    () => generateWeeklySummary(metrics),
    [metrics]
  );
  const monthlySummary = reactExports.useMemo(
    () => generateMonthlySummary(metrics),
    [metrics]
  );
  const handleRefresh = reactExports.useCallback(() => setRefreshKey((k) => k + 1), []);
  const isEmpty = tasks.length === 0 && goals.length === 0 && habits.length === 0 && journalEntries.length === 0;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Sign in to see your insights" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "AI Reflection & Insights analyzes your tasks, goals, habits, and journal to surface personalized patterns." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Use the Sign In button in the sidebar" })
      ] })
    ] }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "insights.loading_state", className: "flex-1 p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-36" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" })
      ] })
    ] });
  }
  if (isEmpty) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "insights.empty_state",
        className: "flex flex-1 items-center justify-center p-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "No data to analyze yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Start adding tasks, goals, habits, and journal entries. Once you have some activity, the AI will surface insights about your productivity patterns." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2", children: ["Add tasks", "Set goals", "Track habits", "Write in journal"].map(
            (tip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 bg-muted rounded-lg px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-primary" }),
                  tip
                ]
              },
              tip
            )
          ) })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold tracking-tight", children: "AI Reflection & Insights" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Analyzing your tasks, goals, habits, and journal" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "insights.refresh_button",
              variant: "outline",
              size: "sm",
              onClick: handleRefresh,
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
                "Refresh Analysis"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tabs,
          {
            value: tab,
            onValueChange: (v) => setTab(v),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-[240px] grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { "data-ocid": "insights.weekly_tab", value: "weekly", children: "Weekly" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { "data-ocid": "insights.monthly_tab", value: "monthly", children: "Monthly" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.05 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  "data-ocid": "insights.completion_card",
                  className: "border-border/60",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-1 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                      "Task Completion"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold", children: [
                        tab === "weekly" ? metrics.taskCompletionRate7d : metrics.taskCompletionRate30d,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: tab === "weekly" ? "Last 7 days" : "Last 30 days" })
                    ] })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.goals_card", className: "border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-1 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5" }),
                  "Active Goals"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.activeGoals }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    metrics.avgActiveGoalProgress,
                    "% avg progress"
                  ] })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.15 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.streak_card", className: "border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-1 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }),
                  "Best Habit Streak"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", children: metrics.bestStreak }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: metrics.bestStreakHabitName || "No habits yet" })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.mood_card", className: "border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-1 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-3.5 w-3.5" }),
                  "Mood Score"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold", children: [
                    metrics.positiveMoodPct,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Positive entries (30d)" })
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.25 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                "data-ocid": "insights.reflection_panel",
                className: "border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
                    "AI Reflection — ",
                    tab === "weekly" ? "This Week" : "This Month",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "AI Generated" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground/80", children: tab === "weekly" ? weeklySummary : monthlySummary }) })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -8 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.3 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  "data-ocid": "insights.strengths_panel",
                  className: "border-emerald-500/20 bg-emerald-500/5 h-full",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                      "Strengths"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: strengths.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Keep tracking your activity — strengths will appear as patterns emerge." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: strengths.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-700 dark:text-emerald-400", children: s.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                        " ",
                        "— ",
                        s.detail
                      ] })
                    ] }, s.label)) }) })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 8 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.3 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  "data-ocid": "insights.weaknesses_panel",
                  className: "border-amber-500/20 bg-amber-500/5 h-full",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
                      "Areas to Improve"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: weaknesses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No significant weaknesses detected — great work!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: weaknesses.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-amber-700 dark:text-amber-400", children: w.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                        " ",
                        "— ",
                        w.detail
                      ] })
                    ] }, w.label)) }) })
                  ]
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.35 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.advice_panel", className: "border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-yellow-500" }),
                "Practical Advice"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: advice.map((tip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80 pt-0.5", children: tip })
              ] }, tip.slice(0, 30))) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.4 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.tasks_chart", className: "border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Tasks Completed by Day of Week" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartContainer, { config: tasksChartConfig, className: "h-48 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  BarChart,
                  {
                    data: metrics.tasksByDayOfWeek,
                    margin: { top: 4, right: 8, left: -16, bottom: 0 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CartesianGrid,
                        {
                          strokeDasharray: "3 3",
                          vertical: false,
                          className: "stroke-border"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        XAxis,
                        {
                          dataKey: "day",
                          tick: { fontSize: 11 },
                          tickLine: false,
                          axisLine: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        YAxis,
                        {
                          tick: { fontSize: 11 },
                          tickLine: false,
                          axisLine: false,
                          allowDecimals: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltipContent, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Bar,
                        {
                          dataKey: "count",
                          fill: "var(--color-count)",
                          radius: [4, 4, 0, 0]
                        }
                      )
                    ]
                  }
                ) }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.45 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.goals_chart", className: "border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Goal Progress (Top 5)" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: metrics.topGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No goals yet" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChartContainer,
                  {
                    config: goalsChartConfig,
                    className: "h-48 w-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      BarChart,
                      {
                        data: metrics.topGoals,
                        layout: "vertical",
                        margin: { top: 4, right: 8, left: 0, bottom: 0 },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CartesianGrid,
                            {
                              strokeDasharray: "3 3",
                              horizontal: false,
                              className: "stroke-border"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            XAxis,
                            {
                              type: "number",
                              domain: [0, 100],
                              tick: { fontSize: 11 },
                              tickLine: false,
                              axisLine: false
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            YAxis,
                            {
                              dataKey: "name",
                              type: "category",
                              width: 80,
                              tick: { fontSize: 10 },
                              tickLine: false,
                              axisLine: false,
                              tickFormatter: (v) => v.length > 10 ? `${v.slice(0, 10)}…` : v
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltipContent, {}) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Bar,
                            {
                              dataKey: "progress",
                              fill: "var(--color-progress)",
                              radius: [0, 4, 4, 0]
                            }
                          )
                        ]
                      }
                    )
                  }
                ) })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "insights.mood_chart", className: "border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Mood Distribution (Last 30 Days)" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: metrics.moodDistribution.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No journal entries in the last 30 days" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChartContainer, { config: moodChartConfig, className: "h-48 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                BarChart,
                {
                  data: metrics.moodDistribution,
                  margin: { top: 4, right: 8, left: -16, bottom: 0 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CartesianGrid,
                      {
                        strokeDasharray: "3 3",
                        vertical: false,
                        className: "stroke-border"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "mood",
                        tick: { fontSize: 11 },
                        tickLine: false,
                        axisLine: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        tick: { fontSize: 11 },
                        tickLine: false,
                        axisLine: false,
                        allowDecimals: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltipContent, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", radius: [4, 4, 0, 0], children: metrics.moodDistribution.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, entry.mood)) })
                  ]
                }
              ) }) })
            ] })
          }
        )
      ]
    }
  );
}
export {
  InsightsPage as default
};
