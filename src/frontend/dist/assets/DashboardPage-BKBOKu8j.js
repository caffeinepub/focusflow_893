import { c as createLucideIcon, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, a as cn, d as BookOpen, T as Target, e as Repeat2, F as FolderOpen, f as ue, C as CalendarDays, X } from "./index-vju8O4pi.js";
import { B as Badge } from "./badge-CDWfs0gz.js";
import { C as Card, a as CardContent } from "./card-AQ15DKBE.js";
import { C as Checkbox } from "./checkbox-BXpDGZnQ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./label-BXfrP8r1.js";
import { P as Plus, I as Input } from "./input-C2d6PDhd.js";
import { P as Progress } from "./progress-DEDDMeMJ.js";
import { S as ScrollArea } from "./scroll-area-CmrKDI3q.js";
import { S as Skeleton } from "./skeleton-BJz8bGeu.js";
import { u as useTaskStreak, T as TaskCard, a as TaskForm } from "./useTaskStreak-DPwblOYh.js";
import { u as useHabits } from "./useHabits-DpT1FNxy.js";
import { u as useAllTasks, a as useAllProjects, b as useAllGoals, c as useAllJournalEntries, d as useCreateTask, e as useToggleTaskCompletion, f as useDeleteTask, g as useUpdateTask } from "./useQueries-Cw60qAAe.js";
import { G as GoalStatus, J as JournalMood, a as GoalCategory } from "./backend.d-B4qOwcQE.js";
import { L as ListTodo, T as TrendingUp } from "./trending-up-jY4R55sw.js";
import { C as CircleCheck } from "./circle-check-_WIxX-RB.js";
import { C as Clock } from "./clock-CH_yy3mz.js";
import { T as TriangleAlert } from "./triangle-alert-B6v7vkl4.js";
import { F as Flame } from "./flame-D7HtZxtY.js";
import { T as Trash2 } from "./trash-2-cFZOQrOB.js";
import { C as ChevronRight } from "./chevron-right-B8ptj89J.js";
import "./index-CuTA09c_.js";
import "./index-BYhKemf-.js";
import "./index-7WiiG0mP.js";
import "./index-2WWr-EBF.js";
import "./index-cyt5o4B7.js";
import "./index-ClcQs7Ut.js";
import "./select-Bb-oz2da.js";
import "./chevron-down-BJPyXQTG.js";
import "./pencil-ByWKpQL-.js";
import "./textarea-Bxr3KB38.js";
import "./loader-circle-Bd1ht1in.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
const MOOD_EMOJI = {
  [JournalMood.happy]: "😊",
  [JournalMood.neutral]: "😐",
  [JournalMood.sad]: "😢",
  [JournalMood.stressed]: "😰",
  [JournalMood.energized]: "⚡"
};
const PRIORITY_STYLES = {
  high: "bg-destructive/15 text-destructive border-destructive/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
};
function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  ocid,
  delay,
  onClick,
  clickable
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay },
      "data-ocid": ocid,
      onClick,
      className: cn(clickable && "cursor-pointer"),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: cn(
            "border-border bg-card relative overflow-hidden group card-hover",
            clickable && "hover:border-primary/40 hover:shadow-md transition-all duration-200"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-foreground", children: value !== void 0 ? value.toString() : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-12" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-2.5 rounded-lg", iconColor), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }) }),
                clickable && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                  "View ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" })
          ]
        }
      )
    }
  );
}
function TaskDrilldownModal({
  open,
  onClose,
  title,
  tasks,
  emptyMessage
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "dashboard.stat.modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "flex flex-row items-center justify-between pr-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: [
        tasks.length,
        " task",
        tasks.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity",
        "data-ocid": "dashboard.stat.modal.close_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ]
      }
    ),
    tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "py-10 text-center",
        "data-ocid": "dashboard.stat.modal.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: emptyMessage })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh] pr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 py-1", children: tasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                task.completed ? "bg-emerald-400" : "bg-amber-400"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: cn(
                  "text-sm font-medium leading-snug",
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                ),
                children: task.title
              }
            ),
            task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: task.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: cn(
                    "text-xs px-1.5 py-0 h-4",
                    PRIORITY_STYLES[task.priority] ?? ""
                  ),
                  children: task.priority
                }
              ),
              task.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              ] })
            ] })
          ] })
        ]
      },
      task.id
    )) }) })
  ] }) });
}
function StreakModal({
  open,
  onClose,
  currentStreak,
  completedTasks
}) {
  const todayCompleted = completedTasks.filter((t) => {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    return t.completed;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "dashboard.streak.modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-5 h-5 text-amber-400" }),
      "Day Streak"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity",
        "data-ocid": "dashboard.streak.modal.close_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl font-display font-bold text-amber-400", children: currentStreak }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: currentStreak === 1 ? "day streak" : "day streak" })
      ] }) }),
      currentStreak >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-amber-400", children: [
        "🔥",
        " ",
        currentStreak >= 30 ? "30-day milestone!" : currentStreak >= 14 ? "14-day milestone!" : "7-day milestone!"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/50 px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: currentStreak === 0 ? "Complete tasks daily to build your streak." : "Keep completing tasks every day to grow your streak!" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: todayCompleted.length }),
        " ",
        "task",
        todayCompleted.length !== 1 ? "s" : "",
        " completed in total"
      ] }) })
    ] })
  ] }) });
}
function HabitsModal({
  open,
  onClose,
  habits,
  isCompletedToday,
  getCurrentStreak,
  habitsCompleted,
  habitsTotal
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "dashboard.habits.modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "flex flex-row items-center justify-between pr-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-5 h-5 text-teal-400" }),
        "Habits Today"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: [
        habitsCompleted,
        "/",
        habitsTotal,
        " done"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity",
        "data-ocid": "dashboard.habits.modal.close_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ]
      }
    ),
    habits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "py-10 text-center",
        "data-ocid": "dashboard.habits.modal.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-8 h-8 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No habits yet. Add some in the Habits page." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh] pr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 py-1", children: habits.map((habit, i) => {
      const done = isCompletedToday(habit.id);
      const streak = getCurrentStreak(habit.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5",
          "data-ocid": `dashboard.habits.modal.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-3 h-3 rounded-full flex-shrink-0",
                style: { backgroundColor: habit.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: cn(
                    "text-sm font-medium",
                    done ? "line-through text-muted-foreground" : "text-foreground"
                  ),
                  children: habit.name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-amber-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3" }),
                  streak,
                  " day streak"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs px-1.5 py-0 h-4 border-border text-muted-foreground capitalize",
                    children: habit.frequency
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-emerald-400 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
              "Done"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Pending" }) })
          ]
        },
        habit.id
      );
    }) }) })
  ] }) });
}
const CATEGORY_LABELS = {
  [GoalCategory.personal]: "Personal",
  [GoalCategory.work]: "Work",
  [GoalCategory.health]: "Health",
  [GoalCategory.learning]: "Learning",
  [GoalCategory.other]: "Other"
};
const CATEGORY_COLORS = {
  [GoalCategory.personal]: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  [GoalCategory.work]: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  [GoalCategory.health]: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  [GoalCategory.learning]: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  [GoalCategory.other]: "bg-muted text-muted-foreground"
};
const PRIORITY_DOT = {
  high: "bg-destructive",
  medium: "bg-amber-400",
  low: "bg-emerald-400"
};
function MiniCalendar({ tasks }) {
  const today = /* @__PURE__ */ new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
  const tasksByDay = {};
  for (const task of tasks) {
    if (task.dueDate) {
      const due = new Date(Number(task.dueDate) / 1e6);
      if (due.getFullYear() === year && due.getMonth() === month) {
        const d = due.getDate();
        tasksByDay[d] = tasksByDay[d] ? [...tasksByDay[d], task] : [task];
      }
    }
  }
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.36 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: monthName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-0.5 text-center", children: [
          weekDays.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[10px] font-medium text-muted-foreground py-1",
              children: d
            },
            d
          )),
          cells.map((day, idx) => {
            const cellKey = day ? `day-${day}` : `empty-${idx < 7 ? "pre" : "post"}-${idx}`;
            if (!day) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, cellKey);
            const isToday = day === today.getDate();
            const dayTasks = tasksByDay[day] ?? [];
            const hasTasks = dayTasks.length > 0;
            const topPriorities = dayTasks.slice(0, 3).map((t) => String(t.priority ?? "low"));
            const title = hasTasks ? dayTasks.map((t) => t.title).join(", ") : void 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                title,
                className: "flex flex-col items-center py-0.5 gap-0.5 cursor-default",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium",
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted/60"
                      ),
                      children: day
                    }
                  ),
                  hasTasks && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: topPriorities.map((p, dotIdx) => {
                    const dotKey = `${p}${dotIdx}`;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "w-1 h-1 rounded-full",
                          PRIORITY_DOT[p] ?? "bg-primary"
                        )
                      },
                      dotKey
                    );
                  }) })
                ]
              },
              day
            );
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border flex items-center gap-3 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-destructive inline-block" }),
            "High"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" }),
            "Medium"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" }),
            "Low"
          ] })
        ] })
      ] }) })
    }
  );
}
function GoalsTimeline({ goals }) {
  const now = /* @__PURE__ */ new Date();
  const threeMonthsLater = new Date(
    now.getFullYear(),
    now.getMonth() + 3,
    now.getDate()
  );
  const upcoming = goals.filter((g) => {
    if (!g.targetDate) return false;
    const target = new Date(Number(g.targetDate) / 1e6);
    return target >= now && target <= threeMonthsLater;
  });
  const byMonth = {};
  for (const g of upcoming) {
    const target = new Date(Number(g.targetDate) / 1e6);
    const label = target.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });
    byMonth[label] = byMonth[label] ? [...byMonth[label], g] : [g];
  }
  const monthEntries = Object.entries(byMonth);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Goals Timeline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: "Next 3 months" })
        ] }),
        monthEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "dashboard.goals_timeline.empty_state",
            className: "flex flex-col items-center justify-center py-8 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-8 h-8 text-muted-foreground/40 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No upcoming goals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "Add goals with a target date to see them here" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: monthEntries.map(([month, monthGoals]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: month }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: monthGoals.map((goal, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "text-[10px] px-1.5 py-0.5 rounded border font-medium whitespace-nowrap",
                      CATEGORY_COLORS[goal.category] ?? "bg-muted text-muted-foreground"
                    ),
                    children: CATEGORY_LABELS[goal.category] ?? "Other"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate flex-1 min-w-0", children: goal.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: Number(goal.progress ?? 0),
                    className: "h-1.5"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground w-7 text-right shrink-0", children: [
                  Number(goal.progress ?? 0),
                  "%"
                ] })
              ]
            },
            goal.id != null ? String(goal.id) : `goal-${i}`
          )) })
        ] }, month)) })
      ] }) })
    }
  );
}
function DashboardPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks, isLoading: loadingTasks } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { data: goals = [], isLoading: loadingGoals } = useAllGoals();
  const { data: journalEntries = [], isLoading: loadingJournal } = useAllJournalEntries();
  const createTask = useCreateTask();
  const toggleTask = useToggleTaskCompletion();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const { recordCompletion, currentStreak } = useTaskStreak();
  const {
    habits,
    getTodayCompletionCount,
    isCompletedToday,
    getCurrentStreak: getHabitStreak
  } = useHabits();
  const { completed: habitsCompleted, total: habitsTotal } = getTodayCompletionCount();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editTask, setEditTask] = reactExports.useState(null);
  const [todoInput, setTodoInput] = reactExports.useState("");
  const [activeStatModal, setActiveStatModal] = reactExports.useState(null);
  const allTasks = tasks ?? [];
  const overdueTasks = allTasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < /* @__PURE__ */ new Date()
  );
  const overdueIds = new Set(overdueTasks.map((t) => t.id));
  const pendingTasks = allTasks.filter(
    (t) => !t.completed && !overdueIds.has(t.id)
  );
  const completedTasks = allTasks.filter((t) => t.completed);
  const totalCount = loadingTasks ? void 0 : allTasks.length;
  const completedCount = loadingTasks ? void 0 : completedTasks.length;
  const pendingCount = loadingTasks ? void 0 : pendingTasks.length;
  const overdueCount = loadingTasks ? void 0 : overdueTasks.length;
  const statModalConfig = {
    total: {
      title: "All Tasks",
      tasks: allTasks,
      emptyMessage: "No tasks created yet."
    },
    completed: {
      title: "Completed Tasks",
      tasks: completedTasks,
      emptyMessage: "No completed tasks yet. Keep going!"
    },
    pending: {
      title: "Pending Tasks",
      tasks: pendingTasks,
      emptyMessage: "No pending tasks — all done or overdue!"
    },
    overdue: {
      title: "Overdue Tasks",
      tasks: overdueTasks,
      emptyMessage: "No overdue tasks. Great work!"
    }
  };
  const todayTasks = allTasks.filter((t) => {
    if (t.completed) return false;
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = /* @__PURE__ */ new Date();
    today.setHours(23, 59, 59, 999);
    return due <= today;
  });
  const todayCompletedTasks = allTasks.filter((t) => {
    if (!t.completed) return false;
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = /* @__PURE__ */ new Date();
    today.setHours(23, 59, 59, 999);
    return due <= today;
  });
  const quickTodos = allTasks.filter((t) => !t.dueDate).slice(0, 8);
  const recentJournal = [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const activeGoals = goals.filter((g) => g.status === GoalStatus.active).slice(0, 4);
  const projectsWithProgress = projects.map((p) => {
    const projectTasks = allTasks.filter((t) => t.projectId === p.id);
    const total = projectTasks.length;
    const completed = projectTasks.filter((t) => t.completed).length;
    const progress = total > 0 ? Math.round(completed / total * 100) : 0;
    return { ...p, total, completed, progress };
  }).sort((a, b) => b.total - a.total).slice(0, 5);
  const handleCreate = async (data) => {
    try {
      await createTask.mutateAsync({ id: crypto.randomUUID(), ...data });
      setAddOpen(false);
      ue.success("Task created");
    } catch {
      ue.error("Failed to create task");
    }
  };
  const handleUpdate = async (data) => {
    if (!editTask) return;
    try {
      await updateTask.mutateAsync({ id: editTask.id, ...data });
      setEditTask(null);
      ue.success("Task updated");
    } catch {
      ue.error("Failed to update task");
    }
  };
  const handleToggle = async (id) => {
    const task = allTasks.find((t) => t.id === id);
    try {
      await toggleTask.mutateAsync(id);
      if (task && !task.completed) {
        recordCompletion();
      }
    } catch {
      ue.error("Failed to update task");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteTask.mutateAsync(id);
      ue.success("Task deleted");
    } catch {
      ue.error("Failed to delete task");
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
        priority: "low",
        dueDate: null,
        notes: "",
        projectId: null
      });
      setTodoInput("");
      ue.success("To-do added");
    } catch {
      ue.error("Failed to add to-do");
    }
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center h-full min-h-[60vh] px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4 },
        className: "max-w-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListTodo, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Welcome to FocusFlow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: "Sign in to manage your tasks, projects, and focus sessions. Stay productive and organized." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use the Sign in button in the sidebar to get started." })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), "data-ocid": "task.add_button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Task"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Tasks",
            value: totalCount,
            icon: ListTodo,
            iconColor: "bg-primary/15 text-primary",
            ocid: "dashboard.stat.total.open_modal_button",
            delay: 0.05,
            clickable: true,
            onClick: () => setActiveStatModal("total")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Completed",
            value: completedCount,
            icon: CircleCheck,
            iconColor: "bg-emerald-500/15 text-emerald-400",
            ocid: "dashboard.stat.completed.open_modal_button",
            delay: 0.1,
            clickable: true,
            onClick: () => setActiveStatModal("completed")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            iconColor: "bg-amber-500/15 text-amber-400",
            ocid: "dashboard.stat.pending.open_modal_button",
            delay: 0.15,
            clickable: true,
            onClick: () => setActiveStatModal("pending")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Overdue",
            value: overdueCount,
            icon: TriangleAlert,
            iconColor: "bg-destructive/15 text-destructive",
            ocid: "dashboard.stat.overdue.open_modal_button",
            delay: 0.2,
            clickable: true,
            onClick: () => setActiveStatModal("overdue")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveStatModal("streak"),
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer",
            type: "button",
            "data-ocid": "dashboard.streak.open_modal_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 text-amber-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-amber-400", children: [
                currentStreak,
                " day streak"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Keep completing tasks daily!" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.32 },
          "data-ocid": "dashboard.todo.section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListTodo, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "To-Do List" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full", children: [
                quickTodos.filter((t) => !t.completed).length,
                " left"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: todoInput,
                  onChange: (e) => setTodoInput(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && handleAddTodo(),
                  placeholder: "Add a to-do...",
                  className: "text-xs h-8",
                  "data-ocid": "dashboard.todo.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "h-8 px-2",
                  onClick: handleAddTodo,
                  disabled: !todoInput.trim() || createTask.isPending,
                  "data-ocid": "dashboard.todo.add_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                }
              )
            ] }),
            loadingTasks ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-2",
                "data-ocid": "dashboard.todo.loading_state",
                children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full rounded" }, i))
              }
            ) : quickTodos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center py-6",
                "data-ocid": "dashboard.todo.empty_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No to-dos yet. Add one above." })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-52 overflow-y-auto pr-0.5", children: quickTodos.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 group",
                "data-ocid": `dashboard.todo.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked: task.completed,
                      onCheckedChange: () => handleToggle(task.id),
                      className: "h-3.5 w-3.5 flex-shrink-0",
                      "data-ocid": `dashboard.todo.checkbox.${i + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "text-xs flex-1 min-w-0 truncate",
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      ),
                      children: task.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleDelete(task.id),
                      className: "opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive",
                      "data-ocid": `dashboard.todo.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              task.id
            )) })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.36 },
          "data-ocid": "dashboard.journal.section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-violet-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-violet-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Journal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full", children: [
                journalEntries.length,
                " entries"
              ] })
            ] }),
            loadingJournal ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "dashboard.journal.loading_state",
                children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, i))
              }
            ) : recentJournal.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-6",
                "data-ocid": "dashboard.journal.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-6 h-6 text-muted-foreground mx-auto mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No journal entries yet." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentJournal.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg bg-muted/50 px-3 py-2",
                "data-ocid": `dashboard.journal.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground truncate flex-1 mr-2", children: entry.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none flex-shrink-0", children: MOOD_EMOJI[entry.mood] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  }) }),
                  entry.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: entry.content })
                ]
              },
              entry.id
            )) })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          "data-ocid": "dashboard.goals.section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-emerald-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-emerald-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Goals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full", children: [
                activeGoals.length,
                " active"
              ] })
            ] }),
            loadingGoals ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "dashboard.goals.loading_state",
                children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, i))
              }
            ) : activeGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-6",
                "data-ocid": "dashboard.goals.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-6 h-6 text-muted-foreground mx-auto mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No active goals yet." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: activeGoals.map((goal, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg bg-muted/50 px-3 py-2",
                "data-ocid": `dashboard.goals.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground truncate flex-1 mr-2", children: goal.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-emerald-400 flex-shrink-0", children: [
                      goal.progress,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Progress,
                    {
                      value: Number(goal.progress),
                      className: "h-1.5"
                    }
                  ),
                  goal.targetDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                    "Due",
                    " ",
                    new Date(goal.targetDate).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )
                  ] })
                ]
              },
              goal.id
            )) })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.44 },
          "data-ocid": "dashboard.habits.section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-border bg-card h-full cursor-pointer hover:border-teal-500/40 transition-colors",
              onClick: () => setActiveStatModal("habits"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-teal-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-4 h-4 text-teal-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Habits" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full", children: [
                    habitsCompleted,
                    "/",
                    habitsTotal,
                    " done"
                  ] })
                ] }),
                habits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-center py-6",
                    "data-ocid": "dashboard.habits.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-6 h-6 text-muted-foreground mx-auto mb-2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No habits yet." })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-52 overflow-y-auto", children: habits.slice(0, 6).map((habit, i) => {
                  const done = isCompletedToday(habit.id);
                  const streak = getHabitStreak(habit.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2",
                      "data-ocid": `dashboard.habits.item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                            style: {
                              backgroundColor: habit.color ?? "#14b8a6"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs flex-1 truncate ${done ? "line-through text-muted-foreground" : "text-foreground"}`,
                            children: habit.name
                          }
                        ),
                        streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-amber-400 flex-shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3" }),
                          streak
                        ] })
                      ]
                    },
                    habit.id
                  );
                }) })
              ] })
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "dashboard.calendar_timeline.section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniCalendar, { tasks: tasks ?? [] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsTimeline, { goals })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "dashboard.projects_progress.section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.44 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Projects Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full", children: [
              projectsWithProgress.length,
              " project",
              projectsWithProgress.length !== 1 ? "s" : ""
            ] })
          ] }),
          loadingTasks ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i)) }) : projectsWithProgress.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border border-dashed border-border rounded-xl p-8 text-center",
              "data-ocid": "dashboard.projects_progress.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-7 h-7 text-primary mx-auto mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No projects yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Create a project to track progress." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: projectsWithProgress.map((project, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-4 px-5 py-3.5",
              "data-ocid": `dashboard.projects_progress.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                    style: { backgroundColor: project.color }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground min-w-0 truncate flex-1", children: project.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums whitespace-nowrap", children: [
                    project.completed,
                    " / ",
                    project.total,
                    " tasks"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { width: 0 },
                      animate: { width: `${project.progress}%` },
                      transition: {
                        duration: 0.6,
                        delay: 0.1 + i * 0.06,
                        ease: "easeOut"
                      },
                      className: "h-full rounded-full",
                      style: { backgroundColor: project.color }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground tabular-nums w-9 text-right", children: [
                    project.progress,
                    "%"
                  ] })
                ] })
              ]
            },
            project.id
          )) }) }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Today's Focus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full", children: [
              todayTasks.length,
              " task",
              todayTasks.length !== 1 ? "s" : ""
            ] })
          ] }),
          loadingTasks ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "dashboard.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, i)) }) : todayTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border border-dashed border-border rounded-xl p-10 text-center",
              "data-ocid": "dashboard.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-primary mx-auto mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "All clear for today!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No tasks due today. Add one to get started." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: todayTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TaskCard,
            {
              task,
              projects,
              index: i,
              onToggle: handleToggle,
              onEdit: setEditTask,
              onDelete: handleDelete
            },
            task.id
          )) })
        ]
      }
    ) }),
    todayCompletedTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.6 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Completed Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full", children: [
              todayCompletedTasks.length,
              " task",
              todayCompletedTasks.length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 opacity-70", children: todayCompletedTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TaskCard,
            {
              task,
              projects,
              index: i,
              onToggle: handleToggle,
              onEdit: setEditTask,
              onDelete: handleDelete
            },
            task.id
          )) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "task.modal", className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Task" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskForm,
        {
          projects,
          onSubmit: handleCreate,
          isPending: createTask.isPending,
          onCancel: () => setAddOpen(false)
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editTask, onOpenChange: (o) => !o && setEditTask(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "task.modal", className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Task" }) }),
      editTask && /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskForm,
        {
          initialData: editTask,
          projects,
          onSubmit: handleUpdate,
          isPending: updateTask.isPending,
          onCancel: () => setEditTask(null)
        }
      )
    ] }) }),
    activeStatModal && activeStatModal !== "streak" && activeStatModal !== "habits" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TaskDrilldownModal,
      {
        open: true,
        onClose: () => setActiveStatModal(null),
        title: statModalConfig[activeStatModal].title,
        tasks: statModalConfig[activeStatModal].tasks,
        emptyMessage: statModalConfig[activeStatModal].emptyMessage
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StreakModal,
      {
        open: activeStatModal === "streak",
        onClose: () => setActiveStatModal(null),
        currentStreak,
        completedTasks
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HabitsModal,
      {
        open: activeStatModal === "habits",
        onClose: () => setActiveStatModal(null),
        habits,
        isCompletedToday,
        getCurrentStreak: getHabitStreak,
        habitsCompleted,
        habitsTotal
      }
    )
  ] });
}
export {
  DashboardPage as default
};
