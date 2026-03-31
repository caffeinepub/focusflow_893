import { c as createLucideIcon, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, g as Brain, a as cn, A as AnimatePresence } from "./index-ByEywl6s.js";
import { B as Badge } from "./badge-8RcPkm_m.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-0tn5YjuE.js";
import { S as ScrollArea } from "./scroll-area-DgCxUNEu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DfJSUuUu.js";
import { u as useFocusSessions } from "./useFocusSessions-CRM_Z5xM.js";
import { u as useAllTasks, a as useAllProjects } from "./useQueries-BzU7bq2r.js";
import { P as Pause } from "./pause-PUP4_G3R.js";
import { C as CircleCheck } from "./circle-check-CtzGxd9m.js";
import { C as Clock } from "./clock-CfHRfS8U.js";
import { T as Trash2 } from "./trash-2-Y7N_uk-_.js";
import "./index-B1OTAsPJ.js";
import "./index-CrHuaOeQ.js";
import "./index-Bgnit1vS.js";
import "./index-DqkxsEnl.js";
import "./index-C-ts0wum.js";
import "./index-BO8C1sgF.js";
import "./chevron-down-MsxvGo1P.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M14 2v2", key: "6buw04" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      key: "pwadti"
    }
  ],
  ["path", { d: "M6 2v2", key: "colzsn" }]
];
const Coffee = createLucideIcon("coffee", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
function TimerRing({
  progress,
  isBreak,
  children
}) {
  const size = 260;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const color = isBreak ? "oklch(0.65 0.18 220)" : "oklch(0.72 0.19 156)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size,
        height: size,
        className: "-rotate-90",
        style: { filter: `drop-shadow(0 0 12px ${color}55)` },
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: size / 2,
              cy: size / 2,
              r: radius,
              fill: "none",
              stroke: "oklch(0.22 0.008 265)",
              strokeWidth
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: size / 2,
              cy: size / 2,
              r: radius,
              fill: "none",
              stroke: color,
              strokeWidth,
              strokeLinecap: "round",
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              style: { transition: "stroke-dashoffset 0.5s ease" }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children })
  ] });
}
function FocusPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [] } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { sessions, saveSession, clearSessions } = useFocusSessions();
  const [mode, setMode] = reactExports.useState("work");
  const [secondsLeft, setSecondsLeft] = reactExports.useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const [sessionCount, setSessionCount] = reactExports.useState(0);
  const [linkedTaskId, setLinkedTaskId] = reactExports.useState("none");
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  const startedAtRef = reactExports.useRef(null);
  const totalSeconds = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const progress = secondsLeft / totalSeconds;
  const activeTasks = tasks.filter((t) => !t.completed);
  const linkedTask = linkedTaskId !== "none" ? tasks.find((t) => t.id === linkedTaskId) : null;
  const stopTimer = reactExports.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const handleSessionComplete = reactExports.useCallback(() => {
    const completedAt = (/* @__PURE__ */ new Date()).toISOString();
    const startedAt = startedAtRef.current ?? new Date(Date.now() - WORK_SECONDS * 1e3).toISOString();
    const project = (linkedTask == null ? void 0 : linkedTask.projectId) ? projects.find((p) => p.id === linkedTask.projectId) : null;
    saveSession({
      startedAt,
      completedAt,
      durationSeconds: WORK_SECONDS,
      taskId: (linkedTask == null ? void 0 : linkedTask.id) ?? null,
      taskTitle: (linkedTask == null ? void 0 : linkedTask.title) ?? null,
      projectId: (project == null ? void 0 : project.id) ?? null,
      projectName: (project == null ? void 0 : project.name) ?? null
    });
    startedAtRef.current = null;
  }, [linkedTask, projects, saveSession]);
  reactExports.useEffect(() => {
    if (isRunning) {
      if (!startedAtRef.current) {
        startedAtRef.current = (/* @__PURE__ */ new Date()).toISOString();
      }
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            setIsRunning(false);
            if (mode === "work") {
              setSessionCount((s) => s + 1);
              handleSessionComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [isRunning, stopTimer, mode, handleSessionComplete]);
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    startedAtRef.current = null;
    setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };
  const switchMode = (newMode) => {
    setIsRunning(false);
    startedAtRef.current = null;
    setMode(newMode);
    setSecondsLeft(newMode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };
  const isBreak = mode === "break";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Focus Timer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Pomodoro technique for deep focus" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowHistory((v) => !v),
              className: "gap-2",
              "data-ocid": "focus.history.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-3.5 h-3.5" }),
                "History",
                sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs px-1.5 py-0", children: sessions.length })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 },
        className: "flex gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: !isBreak ? "default" : "outline",
              size: "sm",
              onClick: () => switchMode("work"),
              className: "gap-2",
              "data-ocid": "focus.work_mode.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-3.5 h-3.5" }),
                "Focus"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: isBreak ? "default" : "outline",
              size: "sm",
              onClick: () => switchMode("break"),
              className: "gap-2",
              "data-ocid": "focus.break_mode.toggle",
              style: isBreak ? { backgroundColor: "oklch(0.65 0.18 220)", color: "white" } : {},
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coffee, { className: "w-3.5 h-3.5" }),
                "Break"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.1 },
        className: "flex flex-col items-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "timer-glow rounded-full p-1",
                isBreak && "timer-break-glow"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimerRing, { progress, isBreak, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0.7, scale: 0.97 },
                    animate: { opacity: 1, scale: 1 },
                    className: "font-display text-5xl font-bold text-foreground tabular-nums",
                    children: formatTime(secondsLeft)
                  },
                  secondsLeft
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 uppercase tracking-widest", children: isBreak ? "Break" : "Focus" })
              ] }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "h-11 w-11 rounded-full",
                onClick: handleReset,
                "data-ocid": "focus.reset_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" })
              }
            ),
            isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                className: "h-14 w-14 rounded-full p-0",
                onClick: handlePause,
                "data-ocid": "focus.pause_button",
                style: isBreak ? { backgroundColor: "oklch(0.65 0.18 220)" } : {},
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-5 h-5" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                className: "h-14 w-14 rounded-full p-0",
                onClick: handleStart,
                "data-ocid": "focus.start_button",
                style: isBreak ? { backgroundColor: "oklch(0.65 0.18 220)" } : {},
                disabled: secondsLeft === 0,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 ml-0.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-full border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: sessionCount }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: sessionCount === 0 ? "Start your first session" : `${sessionCount} session${sessionCount !== 1 ? "s" : ""} completed today` })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.15 },
        "data-ocid": "focus.session.card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
            "Session Info"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
              Array.from({ length: Math.max(sessionCount, 4) }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all",
                    i < sessionCount ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground"
                  ),
                  children: i < sessionCount ? "✓" : i + 1
                },
                i
              )),
              sessionCount > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                "+",
                sessionCount - 4,
                " more"
              ] })
            ] }),
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Working on:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: linkedTaskId,
                  onValueChange: setLinkedTaskId,
                  "data-ocid": "focus.task.select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Link a task (optional)" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No task linked" }),
                      activeTasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.title }, t.id))
                    ] })
                  ]
                }
              ),
              linkedTask && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: "auto" },
                  className: "flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground font-medium truncate", children: linkedTask.title })
                  ]
                }
              )
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
        transition: { delay: 0.2 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-primary", children: "25" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "min focus" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: "5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "min break" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: sessionCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "sessions done" })
          ] })
        ] }) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showHistory && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.25 },
        "data-ocid": "focus.history.panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary" }),
              "Session History"
            ] }),
            sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: clearSessions,
                className: "text-muted-foreground hover:text-destructive gap-1.5 h-7 px-2",
                "data-ocid": "focus.history.delete_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  "Clear history"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: sessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-10 text-center",
              "data-ocid": "focus.history.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-muted-foreground mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No sessions recorded yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Complete a focus session to see it here." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: sessions.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 px-5 py-3",
              "data-ocid": `focus.history.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-3.5 h-3.5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: s.taskTitle ?? "No task linked" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    s.projectName ?? "—",
                    " ·",
                    " ",
                    new Date(s.completedAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    ),
                    " ",
                    new Date(s.completedAt).toLocaleTimeString(
                      "en-US",
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-xs flex-shrink-0",
                    children: formatDuration(s.durationSeconds)
                  }
                )
              ]
            },
            s.id
          )) }) }) })
        ] })
      }
    ) })
  ] });
}
export {
  FocusPage as default
};
