import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, u as useInternetIdentity, r as reactExports, m as motion, k as ChartColumn, L as LogIn, T as Target, d as BookOpen, l as Timer } from "./index-vju8O4pi.js";
import { B as Badge } from "./badge-CDWfs0gz.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-AQ15DKBE.js";
import { S as Sparkles, R as RefreshCw, C as ChartContainer, B as BarChart, a as CartesianGrid, X as XAxis, Y as YAxis, b as ChartTooltip, c as ChartTooltipContent, d as Bar } from "./chart-C5FNfjBs.js";
import { P as Progress } from "./progress-DEDDMeMJ.js";
import { S as Skeleton } from "./skeleton-BJz8bGeu.js";
import { u as useFocusSessions } from "./useFocusSessions-C-EJEX6I.js";
import { u as useAllTasks, a as useAllProjects, b as useAllGoals, c as useAllJournalEntries } from "./useQueries-Cw60qAAe.js";
import { G as GoalStatus, J as JournalMood } from "./backend.d-B4qOwcQE.js";
import { C as ChevronLeft } from "./chevron-left-CBxP1Xz2.js";
import { C as ChevronRight } from "./chevron-right-B8ptj89J.js";
import { C as CircleCheck } from "./circle-check-_WIxX-RB.js";
import { L as ListTodo, T as TrendingUp } from "./trending-up-jY4R55sw.js";
import { F as Flame } from "./flame-D7HtZxtY.js";
import { C as Clock } from "./clock-CH_yy3mz.js";
import "./index-CuTA09c_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M17 14h-6", key: "bkmgh3" }],
  ["path", { d: "M13 18H7", key: "bb0bb7" }],
  ["path", { d: "M7 14h.01", key: "1qa3f1" }],
  ["path", { d: "M17 18h.01", key: "1bdyru" }]
];
const CalendarRange = createLucideIcon("calendar-range", __iconNode$2);
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
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M22 11v1a10 10 0 1 1-9-10", key: "ew0xw9" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }],
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }]
];
const SmilePlus = createLucideIcon("smile-plus", __iconNode);
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function getWeekEnd(weekStart) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}
function addWeeks(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}
function formatWeekRange(start, end) {
  const opts = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `Week of ${startStr} – ${endStr}`;
}
function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}
function getMonthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}
function computeWeekStats(tasks, weekStart) {
  const weekEnd = getWeekEnd(weekStart);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return {
      day: DAY_NAMES[i],
      date: toDateKey(d),
      due: 0,
      completed: 0,
      pending: 0
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
  const completionRate = createdCount > 0 ? Math.round(completedCount / createdCount * 100) : 0;
  return {
    completedCount,
    createdCount,
    highPriorityCompleted,
    completionRate,
    perDay: days,
    hasAnyTasks: createdCount > 0
  };
}
function computePeriodStats(tasks, months) {
  const now = /* @__PURE__ */ new Date();
  const periodStart = getMonthStart(addMonths(now, -(months - 1)));
  const periodEnd = getMonthEnd(now);
  const monthBuckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = addMonths(now, -i);
    monthBuckets.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      due: 0,
      completed: 0
    });
  }
  let totalDue = 0;
  let totalCompleted = 0;
  for (const task of tasks) {
    if (!task.dueDate) continue;
    const d = new Date(task.dueDate);
    if (d < periodStart || d > periodEnd) continue;
    const monthKey = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
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
  const avgCompletionRate = totalDue > 0 ? Math.round(totalCompleted / totalDue * 100) : 0;
  return {
    totalDue,
    totalCompleted,
    avgCompletionRate,
    perMonth: monthBuckets
  };
}
function computeProjectPeriodStats(tasks, projects, months) {
  const now = /* @__PURE__ */ new Date();
  const periodStart = getMonthStart(addMonths(now, -(months - 1)));
  const periodEnd = getMonthEnd(now);
  return projects.map((p) => {
    const projectTasks = tasks.filter(
      (t) => t.projectId === p.id && t.dueDate && new Date(t.dueDate) >= periodStart && new Date(t.dueDate) <= periodEnd
    );
    const total = projectTasks.length;
    const completed = projectTasks.filter((t) => t.completed).length;
    const rate = total > 0 ? Math.round(completed / total * 100) : 0;
    return { ...p, total, completed, rate };
  }).filter((p) => p.total > 0);
}
const weeklyChartConfig = {
  completed: { label: "Completed", color: "oklch(var(--chart-1))" },
  pending: { label: "Pending", color: "oklch(var(--chart-3))" }
};
const monthlyChartConfig = {
  completed: { label: "Completed", color: "oklch(var(--chart-1))" },
  due: { label: "Due", color: "oklch(var(--chart-3))" }
};
function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  iconColor,
  ocid,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay },
      "data-ocid": ocid,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card card-hover relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-display font-bold text-foreground", children: [
            value,
            suffix && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold ml-0.5", children: suffix })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-2.5 rounded-lg", iconColor), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }) })
      ] }) }) })
    }
  );
}
function GoalsSummaryCard({
  goals,
  months
}) {
  const now = /* @__PURE__ */ new Date();
  const periodEnd = new Date(
    now.getFullYear(),
    now.getMonth() + months,
    now.getDate(),
    23,
    59,
    59,
    999
  );
  const periodGoals = goals.filter((g) => {
    if (!g.targetDate) return false;
    const d = new Date(g.targetDate);
    return d >= now && d <= periodEnd;
  });
  const active = periodGoals.filter(
    (g) => g.status === GoalStatus.active
  ).length;
  const completed = periodGoals.filter(
    (g) => g.status === GoalStatus.completed
  ).length;
  const avgProgress = periodGoals.length > 0 ? Math.round(
    periodGoals.reduce((sum, g) => sum + Number(g.progress), 0) / periodGoals.length
  ) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 },
      "data-ocid": "reports.goals_summary.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-primary" }),
          "Goals Snapshot (",
          months,
          "-Month Window)"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: periodGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl",
            "data-ocid": "reports.goals_snapshot.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-6 h-6 text-muted-foreground mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "No goals due in the next ",
                months,
                " months."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Set a target date on your goals to see them here." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-amber-400", children: active }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-emerald-400", children: completed }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-display font-bold text-foreground", children: [
                avgProgress,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Avg Progress" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-1", children: periodGoals.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-1",
              "data-ocid": `reports.goals_snapshot.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate flex-1", children: g.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: cn(
                          "text-[10px] px-1.5 py-0 border-none font-semibold",
                          g.status === GoalStatus.completed ? "bg-emerald-500/15 text-emerald-400" : g.status === GoalStatus.paused ? "bg-muted text-muted-foreground" : "bg-amber-500/15 text-amber-400"
                        ),
                        children: g.status
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums w-8 text-right", children: [
                      g.progress,
                      "%"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: Number(g.progress), className: "h-1.5" })
              ]
            },
            g.id
          )) })
        ] }) })
      ] })
    }
  );
}
function PeriodView({
  months,
  tasks,
  projects,
  goals,
  isLoading
}) {
  const periodStats = reactExports.useMemo(
    () => computePeriodStats(tasks, months),
    [tasks, months]
  );
  const projectStats = reactExports.useMemo(
    () => computeProjectPeriodStats(tasks, projects, months),
    [tasks, projects, months]
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Due",
          value: periodStats.totalDue,
          icon: ListTodo,
          iconColor: "bg-primary/15 text-primary",
          ocid: "reports.period_due.card",
          delay: 0.05
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Completed",
          value: periodStats.totalCompleted,
          icon: CircleCheck,
          iconColor: "bg-emerald-500/15 text-emerald-400",
          ocid: "reports.period_completed.card",
          delay: 0.1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Avg Completion",
          value: periodStats.avgCompletionRate,
          suffix: "%",
          icon: TrendingUp,
          iconColor: "bg-amber-500/15 text-amber-400",
          ocid: "reports.period_rate.card",
          delay: 0.15
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Goals",
          value: goals.filter((g) => g.status === GoalStatus.active).length,
          icon: Target,
          iconColor: "bg-violet-500/15 text-violet-400",
          ocid: "reports.period_goals.card",
          delay: 0.2
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.25 },
        "data-ocid": "reports.monthly_chart.panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Monthly Task Completion" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Last ",
              months,
              " months — due vs completed"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartContainer, { config: monthlyChartConfig, className: "h-56 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BarChart,
            {
              data: periodStats.perMonth,
              margin: { top: 4, right: 4, left: -20, bottom: 0 },
              barCategoryGap: "30%",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CartesianGrid,
                  {
                    strokeDasharray: "3 3",
                    vertical: false,
                    stroke: "oklch(var(--border))"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "month",
                    tickLine: false,
                    axisLine: false,
                    tick: { fontSize: 11 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    tickLine: false,
                    axisLine: false,
                    tick: { fontSize: 11 },
                    allowDecimals: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltipContent, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "completed",
                    fill: "var(--color-completed)",
                    radius: [4, 4, 0, 0],
                    stackId: "a"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "due",
                    name: "Pending",
                    fill: "var(--color-due)",
                    radius: [4, 4, 0, 0],
                    stackId: "a"
                  }
                )
              ]
            }
          ) }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsSummaryCard, { goals, months }),
    projectStats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.35 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base", children: [
            "Project Completion (",
            months,
            "-Month Period)"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: projectStats.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-4 px-5 py-3",
              "data-ocid": `reports.projects_period.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                    style: { backgroundColor: p.color }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground flex-1 truncate", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                    p.completed,
                    " / ",
                    p.total
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { width: 0 },
                      animate: { width: `${p.rate}%` },
                      transition: {
                        duration: 0.5,
                        delay: 0.1 + i * 0.05,
                        ease: "easeOut"
                      },
                      className: "h-full rounded-full",
                      style: { backgroundColor: p.color }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground tabular-nums w-9 text-right", children: [
                    p.rate,
                    "%"
                  ] })
                ] })
              ]
            },
            p.id
          )) }) })
        ] })
      }
    )
  ] });
}
function GoalsThisWeekCard({
  goals,
  weekStart,
  weekEnd
}) {
  const weekGoals = reactExports.useMemo(() => {
    return goals.filter((g) => {
      if (!g.targetDate) return false;
      const d = new Date(g.targetDate);
      return d >= weekStart && d <= weekEnd;
    });
  }, [goals, weekStart, weekEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.45 },
      "data-ocid": "reports.goals_week.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-primary" }),
            "Goals This Week"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Goals with target dates falling this week" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: weekGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl",
            "data-ocid": "reports.goals_week.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-6 h-6 text-muted-foreground mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No goals due this week." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Goals with target dates in this week will appear here." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: weekGoals.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "space-y-1.5",
            "data-ocid": `reports.goals_week.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate flex-1", children: g.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: cn(
                        "text-[10px] px-1.5 py-0 border-none font-semibold",
                        g.status === GoalStatus.completed ? "bg-emerald-500/15 text-emerald-400" : g.status === GoalStatus.paused ? "bg-muted text-muted-foreground" : "bg-amber-500/15 text-amber-400"
                      ),
                      children: g.status
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums", children: g.targetDate ? new Date(g.targetDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  }) : "" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: Number(g.progress),
                    className: "h-1.5 flex-1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground tabular-nums w-8 text-right", children: [
                  g.progress,
                  "%"
                ] })
              ] })
            ]
          },
          g.id
        )) }) })
      ] })
    }
  );
}
function FocusTimeCard({
  focusSessions,
  weekStart,
  weekEnd
}) {
  const weekSessions = reactExports.useMemo(() => {
    return focusSessions.filter((s) => {
      const d = new Date(s.completedAt);
      return d >= weekStart && d <= weekEnd;
    });
  }, [focusSessions, weekStart, weekEnd]);
  const totalSeconds = weekSessions.reduce(
    (sum, s) => sum + s.durationSeconds,
    0
  );
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const displayTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const taskBreakdown = reactExports.useMemo(() => {
    const map = {};
    for (const s of weekSessions) {
      const key = s.taskId ?? "__notask__";
      const label = s.taskTitle ?? "No task linked";
      if (!map[key]) map[key] = { label, minutes: 0 };
      map[key].minutes += Math.round(s.durationSeconds / 60);
    }
    return Object.values(map).sort((a, b) => b.minutes - a.minutes);
  }, [weekSessions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.5 },
      "data-ocid": "reports.focus_time.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-4 h-4 text-primary" }),
            "Focus Time This Week"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pomodoro sessions completed this week" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: weekSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-xl",
            "data-ocid": "reports.focus_time.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-6 h-6 text-muted-foreground mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No focus sessions this week." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Complete a Pomodoro session to see your focus log here." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 rounded-xl p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-primary", children: displayTime }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total focus time" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-xl p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: weekSessions.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Sessions completed" })
            ] })
          ] }),
          taskBreakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "By Task" }),
            taskBreakdown.map(({ label, minutes }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-2",
                "data-ocid": `reports.focus_time.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate flex-1", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs flex-shrink-0",
                      children: [
                        minutes,
                        "m"
                      ]
                    }
                  )
                ]
              },
              label
            ))
          ] })
        ] }) })
      ] })
    }
  );
}
const MOOD_CONFIG = {
  [JournalMood.happy]: {
    emoji: "😊",
    label: "Happy",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/15"
  },
  [JournalMood.neutral]: {
    emoji: "😐",
    label: "Neutral",
    color: "text-blue-400",
    bgColor: "bg-blue-500/15"
  },
  [JournalMood.sad]: {
    emoji: "😢",
    label: "Sad",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/15"
  },
  [JournalMood.stressed]: {
    emoji: "😰",
    label: "Stressed",
    color: "text-red-400",
    bgColor: "bg-red-500/15"
  },
  [JournalMood.energized]: {
    emoji: "⚡",
    label: "Energized",
    color: "text-green-400",
    bgColor: "bg-green-500/15"
  }
};
function WeeklyReflection({
  journalEntries,
  weekStart,
  weekEnd
}) {
  const weekEntries = reactExports.useMemo(() => {
    return journalEntries.filter((e) => {
      const d = /* @__PURE__ */ new Date(`${e.date}T00:00:00`);
      return d >= weekStart && d <= weekEnd;
    });
  }, [journalEntries, weekStart, weekEnd]);
  const moodCounts = reactExports.useMemo(() => {
    const counts = {};
    for (const e of weekEntries) {
      counts[e.mood] = (counts[e.mood] ?? 0) + 1;
    }
    return counts;
  }, [weekEntries]);
  const dominantMood = reactExports.useMemo(() => {
    let best = null;
    let bestCount = 0;
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > bestCount) {
        best = mood;
        bestCount = count;
      }
    }
    return best;
  }, [moodCounts]);
  const chartData = reactExports.useMemo(() => {
    return Object.values(JournalMood).map((mood) => ({
      mood: MOOD_CONFIG[mood].label,
      emoji: MOOD_CONFIG[mood].emoji,
      count: moodCounts[mood] ?? 0
    }));
  }, [moodCounts]);
  const totalEntries = weekEntries.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4 },
      "data-ocid": "reports.reflection.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Weekly Reflection" })
            ] }),
            dominantMood && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                "data-ocid": "reports.reflection.mood_badge",
                className: cn(
                  "text-xs font-semibold border-none px-2.5 py-1",
                  MOOD_CONFIG[dominantMood].bgColor,
                  MOOD_CONFIG[dominantMood].color
                ),
                children: [
                  MOOD_CONFIG[dominantMood].emoji,
                  " ",
                  MOOD_CONFIG[dominantMood].label,
                  " week"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: totalEntries === 0 ? "No journal entries this week yet." : dominantMood ? `You felt ${MOOD_CONFIG[dominantMood].label.toLowerCase()} most this week with ${totalEntries} journal ${totalEntries === 1 ? "entry" : "entries"}.` : `${totalEntries} journal ${totalEntries === 1 ? "entry" : "entries"} this week.` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: totalEntries === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-xl",
            "data-ocid": "reports.reflection.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SmilePlus, { className: "w-8 h-8 text-muted-foreground mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Write a journal entry to see your mood trends here." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "space-y-3",
            "data-ocid": "reports.reflection.entry_count",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: chartData.map(({ mood, emoji, count }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg", children: emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full overflow-hidden h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-2 rounded-full bg-primary transition-all duration-700",
                        style: {
                          width: totalEntries > 0 ? `${count / totalEntries * 100}%` : "0%"
                        }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: count }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground leading-tight text-center", children: mood })
                  ]
                },
                mood
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: totalEntries }),
                " ",
                totalEntries === 1 ? "entry" : "entries",
                " recorded this week"
              ] })
            ]
          }
        ) })
      ] })
    }
  );
}
function WeeklyView({
  tasks,
  isLoading,
  journalEntries,
  goals,
  focusSessions
}) {
  const [weekStart, setWeekStart] = reactExports.useState(
    () => getWeekStart(/* @__PURE__ */ new Date())
  );
  const weekEnd = getWeekEnd(weekStart);
  const stats = reactExports.useMemo(
    () => computeWeekStats(tasks, weekStart),
    [tasks, weekStart]
  );
  const prevWeek = () => setWeekStart((w) => getWeekStart(addWeeks(w, -1)));
  const nextWeek = () => setWeekStart((w) => getWeekStart(addWeeks(w, 1)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-card border border-border rounded-lg p-1 w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: prevWeek,
          "data-ocid": "reports.prev_week.button",
          className: "flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
          "aria-label": "Previous week",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "w-3.5 h-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground whitespace-nowrap", children: formatWeekRange(weekStart, weekEnd) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: nextWeek,
          "data-ocid": "reports.next_week.button",
          className: "flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
          "aria-label": "Next week",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Completed",
            value: stats.completedCount,
            icon: CircleCheck,
            iconColor: "bg-emerald-500/15 text-emerald-400",
            ocid: "reports.completed_card.card",
            delay: 0.05
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Due This Week",
            value: stats.createdCount,
            icon: ListTodo,
            iconColor: "bg-primary/15 text-primary",
            ocid: "reports.created_card.card",
            delay: 0.1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "High Priority Done",
            value: stats.highPriorityCompleted,
            icon: Flame,
            iconColor: "bg-destructive/15 text-destructive",
            ocid: "reports.high_priority_card.card",
            delay: 0.15
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Completion Rate",
            value: stats.completionRate,
            suffix: "%",
            icon: TrendingUp,
            iconColor: "bg-amber-500/15 text-amber-400",
            ocid: "reports.completion_rate_card.card",
            delay: 0.2
          }
        )
      ] }),
      !stats.hasAnyTasks ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.25 },
          className: "flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl",
          "data-ocid": "reports.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl bg-muted/60 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-7 h-7 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No tasks for this week" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Tasks with due dates in this week will appear here." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.25 },
            "data-ocid": "reports.weekly_chart.panel",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Daily Task Completion" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Completed vs pending tasks per day" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChartContainer,
                {
                  config: weeklyChartConfig,
                  className: "h-56 w-full",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    BarChart,
                    {
                      data: stats.perDay,
                      margin: { top: 4, right: 4, left: -20, bottom: 0 },
                      barCategoryGap: "30%",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CartesianGrid,
                          {
                            strokeDasharray: "3 3",
                            vertical: false,
                            stroke: "oklch(var(--border))"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          XAxis,
                          {
                            dataKey: "day",
                            tickLine: false,
                            axisLine: false,
                            tick: { fontSize: 12 }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          YAxis,
                          {
                            tickLine: false,
                            axisLine: false,
                            tick: { fontSize: 12 },
                            allowDecimals: false
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltipContent, {}) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Bar,
                          {
                            dataKey: "completed",
                            fill: "var(--color-completed)",
                            radius: [4, 4, 0, 0],
                            stackId: "a"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Bar,
                          {
                            dataKey: "pending",
                            fill: "var(--color-pending)",
                            radius: [4, 4, 0, 0],
                            stackId: "a"
                          }
                        )
                      ]
                    }
                  )
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.35 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Daily Breakdown" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "reports.breakdown_table.table", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border hover:bg-transparent", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "pl-6 text-muted-foreground text-xs font-semibold uppercase tracking-wide", children: "Day" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-muted-foreground text-xs font-semibold uppercase tracking-wide", children: "Tasks Due" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-muted-foreground text-xs font-semibold uppercase tracking-wide", children: "Completed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "pr-6 text-muted-foreground text-xs font-semibold uppercase tracking-wide", children: "Pending" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: stats.perDay.map((day, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    className: cn(
                      "border-border transition-colors hover:bg-muted/30",
                      day.due === 0 && "opacity-50"
                    ),
                    "data-ocid": `reports.breakdown_table.row.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-6 font-medium text-foreground py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: day.day }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: (/* @__PURE__ */ new Date(
                          `${day.date}T00:00:00`
                        )).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        }) })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: day.due }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: day.completed > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/15 text-emerald-400 border-none text-xs font-semibold", children: day.completed }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "0" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-6 py-3", children: day.pending > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-500/15 text-amber-400 border-none text-xs font-semibold", children: day.pending }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "0" }) })
                    ]
                  },
                  day.day
                )) })
              ] }) })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          WeeklyReflection,
          {
            journalEntries,
            weekStart,
            weekEnd
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GoalsThisWeekCard,
          {
            goals,
            weekStart,
            weekEnd
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusTimeCard,
          {
            focusSessions,
            weekStart,
            weekEnd
          }
        )
      ] })
    ] })
  ] });
}
function AISummary({
  tasks,
  goals,
  journalEntries,
  focusSessions,
  refreshKey,
  onRefresh
}) {
  const insights = reactExports.useMemo(() => {
    const results = [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const rate = total > 0 ? Math.round(completed / total * 100) : 0;
    results.push({
      icon: "✅",
      color: "text-emerald-500",
      text: `Task completion rate: ${rate}% (${completed} of ${total} tasks completed)`
    });
    const now = /* @__PURE__ */ new Date();
    const weekStart = getWeekStart(now);
    const prevWeekStart = addWeeks(weekStart, -1);
    const thisWeekDone = tasks.filter((t) => {
      if (!t.completed || !t.dueDate) return false;
      const d = new Date(Number(t.dueDate) / 1e6);
      return d >= weekStart;
    }).length;
    const lastWeekDone = tasks.filter((t) => {
      if (!t.completed || !t.dueDate) return false;
      const d = new Date(Number(t.dueDate) / 1e6);
      return d >= prevWeekStart && d < weekStart;
    }).length;
    const trendSymbol = thisWeekDone >= lastWeekDone ? "📈" : "📉";
    results.push({
      icon: trendSymbol,
      color: thisWeekDone >= lastWeekDone ? "text-blue-500" : "text-orange-500",
      text: `This week: ${thisWeekDone} tasks completed (${lastWeekDone} last week)`
    });
    const activeGoals = goals.filter(
      (g) => g.status === GoalStatus.active || g.status === GoalStatus.paused
    );
    const avgProgress = activeGoals.length > 0 ? Math.round(
      activeGoals.reduce((sum, g) => sum + Number(g.progress), 0) / activeGoals.length
    ) : 0;
    results.push({
      icon: "🎯",
      color: "text-purple-500",
      text: `${activeGoals.length} active goal${activeGoals.length !== 1 ? "s" : ""} — average progress ${avgProgress}%`
    });
    const moodMap = {
      [JournalMood.happy]: 2,
      [JournalMood.energized]: 2,
      [JournalMood.neutral]: 1,
      [JournalMood.sad]: 0,
      [JournalMood.stressed]: 0
    };
    const recentMoods = [...journalEntries].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 7).map((e) => moodMap[e.mood] ?? 1);
    if (recentMoods.length > 0) {
      const avgMood = recentMoods.reduce((s, v) => s + v, 0) / recentMoods.length;
      const moodLabel = avgMood >= 1.5 ? "Positive 😊" : avgMood >= 1 ? "Neutral 😐" : "Low 😔";
      results.push({
        icon: "📓",
        color: "text-amber-500",
        text: `Mood trend (last ${recentMoods.length} entries): ${moodLabel}`
      });
    }
    const totalMins = focusSessions.reduce(
      (sum, s) => sum + Math.round(s.durationSeconds / 60),
      0
    );
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const focusLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    results.push({
      icon: "⏱️",
      color: "text-cyan-500",
      text: `Total focus time logged: ${focusLabel} across ${focusSessions.length} session${focusSessions.length !== 1 ? "s" : ""}`
    });
    const maxStreak = tasks.reduce(
      (max, t) => Math.max(max, Number(t.streak ?? 0)),
      0
    );
    if (maxStreak > 0) {
      results.push({
        icon: "🔥",
        color: "text-red-500",
        text: `Longest task streak: ${maxStreak} day${maxStreak !== 1 ? "s" : ""}`
      });
    }
    return results;
  }, [tasks, goals, journalEntries, focusSessions, refreshKey]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      "data-ocid": "reports.ai_summary.card",
      className: "mb-6 border-primary/20 bg-card/80 backdrop-blur-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "AI Summary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "reports.ai_summary.button",
                onClick: onRefresh,
                className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                  "Refresh"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Generated from your app data" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: insights.map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-base leading-none", children: insight.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/85 leading-snug", children: insight.text })
        ] }, insight.text)) }) })
      ]
    }
  );
}
function ReportsPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [], isLoading: loadingTasks } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { data: goals = [], isLoading: loadingGoals } = useAllGoals();
  const { data: journalEntries = [] } = useAllJournalEntries();
  const { sessions: focusSessions } = useFocusSessions();
  const [periodTab, setPeriodTab] = reactExports.useState("weekly");
  const [summaryRefreshKey, setSummaryRefreshKey] = reactExports.useState(0);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center h-full min-h-[60vh] px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4 },
        className: "max-w-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: "Sign in to view weekly, 3-month, and 6-month productivity reports." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: login,
              disabled: isLoggingIn,
              className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50",
              "data-ocid": "auth.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
                isLoggingIn ? "Signing in..." : "Sign in to continue"
              ]
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto", "data-ocid": "reports.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "mb-6 flex items-start justify-between gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Reports" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Your productivity summary across time periods" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "reports.export_pdf.button",
              onClick: () => window.print(),
              className: "flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors print:hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4" }),
                "Export PDF"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-6 bg-card border border-border rounded-lg p-1 w-fit", children: [
      {
        key: "weekly",
        label: "Weekly",
        ocid: "reports.weekly.tab"
      },
      { key: "1mo", label: "1 Month", ocid: "reports.1mo.tab" },
      { key: "3mo", label: "3 Months", ocid: "reports.3mo.tab" },
      { key: "6mo", label: "6 Months", ocid: "reports.6mo.tab" },
      { key: "12mo", label: "1 Year", ocid: "reports.12mo.tab" }
    ].map(({ key, label, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": ocid,
        onClick: () => setPeriodTab(key),
        className: cn(
          "px-4 py-2 rounded-md text-sm font-semibold transition-all",
          periodTab === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        ),
        children: label
      },
      key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AISummary,
      {
        tasks,
        goals,
        journalEntries,
        focusSessions,
        refreshKey: summaryRefreshKey,
        onRefresh: () => setSummaryRefreshKey((k) => k + 1)
      }
    ),
    periodTab === "weekly" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      WeeklyView,
      {
        tasks,
        isLoading: loadingTasks,
        journalEntries,
        goals,
        focusSessions
      }
    ),
    periodTab === "3mo" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PeriodView,
      {
        months: 3,
        tasks,
        projects,
        goals,
        isLoading: loadingTasks || loadingGoals
      }
    ),
    periodTab === "6mo" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PeriodView,
      {
        months: 6,
        tasks,
        projects,
        goals,
        isLoading: loadingTasks || loadingGoals
      }
    ),
    periodTab === "1mo" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PeriodView,
      {
        months: 1,
        tasks,
        projects,
        goals,
        isLoading: loadingTasks || loadingGoals
      }
    ),
    periodTab === "12mo" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PeriodView,
      {
        months: 12,
        tasks,
        projects,
        goals,
        isLoading: loadingTasks || loadingGoals
      }
    )
  ] });
}
export {
  ReportsPage as default
};
