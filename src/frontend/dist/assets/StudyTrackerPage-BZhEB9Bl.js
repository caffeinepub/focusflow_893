import { r as reactExports, j as jsxRuntimeExports, m as motion, G as GraduationCap, B as Button, C as CalendarDays, d as BookOpen, A as AnimatePresence, f as ue } from "./index-vju8O4pi.js";
import { B as Badge } from "./badge-CDWfs0gz.js";
import { C as Card, a as CardContent } from "./card-AQ15DKBE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, d as DialogFooter } from "./label-BXfrP8r1.js";
import { P as Plus, I as Input } from "./input-C2d6PDhd.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bb-oz2da.js";
import { T as Textarea } from "./textarea-Bxr3KB38.js";
import { a as useAllProjects, u as useAllTasks } from "./useQueries-Cw60qAAe.js";
import { C as Clock } from "./clock-CH_yy3mz.js";
import { F as Flame } from "./flame-D7HtZxtY.js";
import { S as Search } from "./search-CHzfjRz4.js";
import { F as Funnel } from "./funnel-CA0pILPO.js";
import { P as Pencil } from "./pencil-ByWKpQL-.js";
import { T as Trash2 } from "./trash-2-cFZOQrOB.js";
import "./index-BYhKemf-.js";
import "./index-CuTA09c_.js";
import "./index-2WWr-EBF.js";
import "./index-cyt5o4B7.js";
import "./index-ClcQs7Ut.js";
import "./index-7WiiG0mP.js";
import "./chevron-down-BJPyXQTG.js";
const LS_SESSIONS = "focusflow_study_sessions";
const LS_STREAK = "focusflow_study_streak";
const SUBJECT_COLORS = [
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
];
function hashSubject(subject) {
  let h = 0;
  for (let i = 0; i < subject.length; i++) {
    h = h * 31 + subject.charCodeAt(i) >>> 0;
  }
  return h % SUBJECT_COLORS.length;
}
function subjectColor(subject) {
  return SUBJECT_COLORS[hashSubject(subject)];
}
function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(LS_SESSIONS) ?? "[]");
  } catch {
    return [];
  }
}
function saveSessions(sessions) {
  localStorage.setItem(LS_SESSIONS, JSON.stringify(sessions));
}
function loadStreak() {
  try {
    return JSON.parse(
      localStorage.getItem(LS_STREAK) ?? '{"currentStreak":0,"lastStudyDate":null}'
    );
  } catch {
    return { currentStreak: 0, lastStudyDate: null };
  }
}
function computeStreak(sessions) {
  const studyDays = new Set(sessions.map((s) => s.date));
  if (studyDays.size === 0) return { currentStreak: 0, lastStudyDate: null };
  const sortedDays = Array.from(studyDays).sort().reverse();
  const today = todayISO();
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) {
    return { currentStreak: 0, lastStudyDate: sortedDays[0] };
  }
  let streak = 0;
  let checkDate = sortedDays[0] === today ? today : yesterday;
  for (const day of sortedDays) {
    if (day === checkDate) {
      streak++;
      const prev = new Date(new Date(checkDate).getTime() - 864e5);
      checkDate = prev.toISOString().split("T")[0];
    } else {
      break;
    }
  }
  return { currentStreak: streak, lastStudyDate: sortedDays[0] };
}
const blankForm = () => ({
  subject: "",
  topic: "",
  durationMinutes: 30,
  date: todayISO(),
  linkedProjectId: null,
  linkedTaskId: null,
  notes: ""
});
function StudyTrackerPage() {
  const [sessions, setSessions] = reactExports.useState(loadSessions);
  const [streak, setStreak] = reactExports.useState(loadStreak);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(blankForm());
  const [formHours, setFormHours] = reactExports.useState(0);
  const [formMins, setFormMins] = reactExports.useState(30);
  const [search, setSearch] = reactExports.useState("");
  const [filterSubject, setFilterSubject] = reactExports.useState("all");
  const [filterProject, setFilterProject] = reactExports.useState("all");
  const { data: projects = [] } = useAllProjects();
  const { data: tasks = [] } = useAllTasks();
  reactExports.useEffect(() => {
    saveSessions(sessions);
    const newStreak = computeStreak(sessions);
    setStreak(newStreak);
    localStorage.setItem(LS_STREAK, JSON.stringify(newStreak));
  }, [sessions]);
  const filteredTasks = reactExports.useMemo(() => {
    if (!form.linkedProjectId) return tasks;
    return tasks.filter((t) => {
      const pid = Array.isArray(t.projectId) ? t.projectId[0] : t.projectId;
      return pid === form.linkedProjectId;
    });
  }, [tasks, form.linkedProjectId]);
  const subjects = reactExports.useMemo(
    () => Array.from(new Set(sessions.map((s) => s.subject))).filter(Boolean),
    [sessions]
  );
  const stats = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const todayStr = todayISO();
    const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString().split("T")[0];
    const todayMins = sessions.filter((s) => s.date === todayStr).reduce((a, s) => a + s.durationMinutes, 0);
    const weekMins = sessions.filter((s) => s.date >= weekAgo).reduce((a, s) => a + s.durationMinutes, 0);
    const allMins = sessions.reduce((a, s) => a + s.durationMinutes, 0);
    return {
      todayMins,
      weekMins,
      allMins,
      total: sessions.length
    };
  }, [sessions]);
  const displayed = reactExports.useMemo(() => {
    return sessions.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.subject.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q);
      const matchSubject = filterSubject === "all" || s.subject === filterSubject;
      const matchProject = filterProject === "all" || s.linkedProjectId === filterProject;
      return matchSearch && matchSubject && matchProject;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions, search, filterSubject, filterProject]);
  function openNew() {
    setEditingId(null);
    setForm(blankForm());
    setFormHours(0);
    setFormMins(30);
    setDialogOpen(true);
  }
  function openEdit(session) {
    setEditingId(session.id);
    setForm({
      subject: session.subject,
      topic: session.topic,
      durationMinutes: session.durationMinutes,
      date: session.date,
      linkedProjectId: session.linkedProjectId,
      linkedTaskId: session.linkedTaskId,
      notes: session.notes
    });
    setFormHours(Math.floor(session.durationMinutes / 60));
    setFormMins(session.durationMinutes % 60);
    setDialogOpen(true);
  }
  function handleSave() {
    const totalMins = formHours * 60 + formMins;
    if (!form.subject.trim()) {
      ue.error("Subject is required");
      return;
    }
    if (!form.topic.trim()) {
      ue.error("Topic is required");
      return;
    }
    if (totalMins <= 0) {
      ue.error("Duration must be greater than 0");
      return;
    }
    const updated = { ...form, durationMinutes: totalMins };
    if (editingId) {
      setSessions(
        (prev) => prev.map(
          (s) => s.id === editingId ? { ...updated, id: editingId } : s
        )
      );
      ue.success("Session updated");
    } else {
      const newSession = {
        ...updated,
        id: crypto.randomUUID()
      };
      setSessions((prev) => [newSession, ...prev]);
      ue.success("Study session logged!");
    }
    setDialogOpen(false);
  }
  function handleDelete(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    ue.success("Session deleted");
  }
  function getProjectName(id) {
    var _a;
    if (!id) return null;
    return ((_a = projects.find((p) => p.id === id)) == null ? void 0 : _a.name) ?? null;
  }
  function getTaskName(id) {
    var _a;
    if (!id) return null;
    return ((_a = tasks.find((t) => t.id === id)) == null ? void 0 : _a.title) ?? null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25 },
          className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Study Tracker" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: stats.total === 0 ? "No sessions yet — start tracking your study time" : `${stats.total} session${stats.total !== 1 ? "s" : ""} logged` })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: openNew,
                className: "gap-2",
                "data-ocid": "study.open_modal_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Log Session"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25, delay: 0.05 },
          className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
          children: [
            {
              label: "Today",
              value: formatDuration(stats.todayMins) || "0m",
              icon: Clock,
              ocid: "study.today.card"
            },
            {
              label: "This Week",
              value: formatDuration(stats.weekMins) || "0m",
              icon: CalendarDays,
              ocid: "study.week.card"
            },
            {
              label: "All Time",
              value: formatDuration(stats.allMins) || "0m",
              icon: BookOpen,
              ocid: "study.alltime.card"
            },
            {
              label: "Sessions",
              value: String(stats.total),
              icon: GraduationCap,
              ocid: "study.sessions.card"
            }
          ].map(({ label, value, icon: Icon, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": ocid, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-muted-foreground/60" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: value })
          ] }) }, label))
        }
      ),
      streak.currentStreak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          className: "flex items-center gap-2",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4" }),
            streak.currentStreak,
            " day study streak"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2, delay: 0.1 },
          className: "flex flex-col sm:flex-row gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search subject or topic…",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "pl-9",
                  "data-ocid": "study.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterSubject, onValueChange: setFilterSubject, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", "data-ocid": "study.subject.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All subjects" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All subjects" }),
                  subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterProject, onValueChange: setFilterProject, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", "data-ocid": "study.project.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All projects" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All projects" }),
                  projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id))
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: displayed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
          "data-ocid": "study.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-8 h-8 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: search || filterSubject !== "all" || filterProject !== "all" ? "No sessions match your filters" : "No study sessions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: search || filterSubject !== "all" || filterProject !== "all" ? "Try adjusting the search or filters" : 'Click "Log Session" to track your first study block' })
            ] }),
            !search && filterSubject === "all" && filterProject === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: openNew,
                className: "gap-2 mt-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Log your first session"
                ]
              }
            )
          ]
        },
        "empty"
      ) : displayed.map((session, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          layout: true,
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, scale: 0.97 },
          transition: { duration: 0.18, delay: i * 0.03 },
          "data-ocid": `study.item.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group hover:border-primary/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs font-semibold ${subjectColor(session.subject)}`,
                    children: session.subject
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground truncate", children: session.topic })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                  formatDuration(session.durationMinutes)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
                  session.date
                ] }),
                getProjectName(session.linkedProjectId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" }),
                  getProjectName(session.linkedProjectId)
                ] }),
                getTaskName(session.linkedTaskId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary/70", children: [
                  "→ ",
                  getTaskName(session.linkedTaskId)
                ] })
              ] }),
              session.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground line-clamp-2", children: session.notes })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "w-8 h-8 text-muted-foreground hover:text-foreground",
                  onClick: () => openEdit(session),
                  "data-ocid": `study.edit_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "w-8 h-8 text-muted-foreground hover:text-destructive",
                  onClick: () => handleDelete(session.id),
                  "data-ocid": `study.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }) }) })
        },
        session.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "study.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingId ? "Edit Study Session" : "Log Study Session" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "study-subject", children: "Subject *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "study-subject",
              list: "subjects-list",
              placeholder: "e.g. Math, Programming, History",
              value: form.subject,
              onChange: (e) => setForm((p) => ({ ...p, subject: e.target.value })),
              "data-ocid": "study.subject.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "subjects-list", children: subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "study-topic", children: "Topic *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "study-topic",
              placeholder: "e.g. Quadratic Equations, React Hooks",
              value: form.topic,
              onChange: (e) => setForm((p) => ({ ...p, topic: e.target.value })),
              "data-ocid": "study.topic.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duration *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 23,
                  value: formHours,
                  onChange: (e) => setFormHours(
                    Math.max(0, Number.parseInt(e.target.value) || 0)
                  ),
                  className: "w-20",
                  "data-ocid": "study.hours.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "hrs" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 59,
                  value: formMins,
                  onChange: (e) => setFormMins(
                    Math.min(
                      59,
                      Math.max(0, Number.parseInt(e.target.value) || 0)
                    )
                  ),
                  className: "w-20",
                  "data-ocid": "study.minutes.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "min" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "study-date", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "study-date",
              type: "date",
              value: form.date,
              onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
              "data-ocid": "study.date.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Link to Project (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.linkedProjectId ?? "none",
              onValueChange: (v) => setForm((p) => ({
                ...p,
                linkedProjectId: v === "none" ? null : v,
                linkedTaskId: null
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "study.link_project.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No project" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No project" }),
                  projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Link to Task (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.linkedTaskId ?? "none",
              onValueChange: (v) => setForm((p) => ({
                ...p,
                linkedTaskId: v === "none" ? null : v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "study.link_task.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No task" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No task" }),
                  filteredTasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.title }, t.id))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "study-notes", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "study-notes",
              placeholder: "What did you study? Any key takeaways?",
              rows: 3,
              value: form.notes,
              onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
              "data-ocid": "study.notes.textarea"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDialogOpen(false),
            "data-ocid": "study.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, "data-ocid": "study.submit_button", children: editingId ? "Save Changes" : "Log Session" })
      ] })
    ] }) })
  ] });
}
export {
  StudyTrackerPage as default
};
