import { c as createLucideIcon, j as jsxRuntimeExports, m as motion, a as cn, C as CalendarDays, B as Button, r as reactExports } from "./index-KUZIGbRE.js";
import { C as Checkbox } from "./checkbox-DDIjYZLl.js";
import { P as Priority } from "./backend.d-B4qOwcQE.js";
import { P as Pencil } from "./pencil-BytB0amP.js";
import { T as Trash2 } from "./trash-2-DOWwhJJN.js";
import { I as Input } from "./input-tMArz861.js";
import { L as Label } from "./label-CxoZgpdH.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cp9_pTl0.js";
import { T as Textarea } from "./textarea-NIPTfkO7.js";
import { L as LoaderCircle } from "./loader-circle-BhKk3dLb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
  ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
  ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
  ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }]
];
const Repeat = createLucideIcon("repeat", __iconNode);
function getPriorityLabel(priority) {
  switch (priority) {
    case Priority.high:
      return "High";
    case Priority.medium:
      return "Medium";
    case Priority.low:
      return "Low";
  }
}
function getPriorityClass(priority) {
  switch (priority) {
    case Priority.high:
      return "bg-priority-high";
    case Priority.medium:
      return "bg-priority-medium";
    case Priority.low:
      return "bg-priority-low";
  }
}
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = /* @__PURE__ */ new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diff = taskDate.getTime() - today.getTime();
  const days = Math.round(diff / (1e3 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days < 7) return `in ${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function isOverdue(dateStr) {
  const date = new Date(dateStr);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
function TaskCard({
  task,
  projects,
  index,
  recurrence = "none",
  onToggle,
  onEdit,
  onDelete
}) {
  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null;
  const overdue = task.dueDate && !task.completed && isOverdue(task.dueDate);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8, scale: 0.97 },
      transition: { duration: 0.18, delay: index * 0.03 },
      "data-ocid": `task.item.${index + 1}`,
      className: cn(
        "group flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card card-hover",
        task.completed && "opacity-60"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: task.completed,
            onCheckedChange: () => onToggle(task.id),
            "data-ocid": `task.checkbox.${index + 1}`,
            className: "border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-sm font-medium leading-snug",
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                ),
                children: task.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0",
                  getPriorityClass(task.priority)
                ),
                children: getPriorityLabel(task.priority)
              }
            ),
            recurrence !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 bg-primary/10 text-primary border border-primary/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "w-3 h-3" }),
              recurrence === "daily" ? "Daily" : "Weekly"
            ] })
          ] }),
          task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-1", children: task.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5 flex-wrap", children: [
            task.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "flex items-center gap-1 text-xs",
                  overdue ? "text-destructive" : "text-muted-foreground"
                ),
                children: [
                  overdue ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3" }),
                  formatDate(task.dueDate)
                ]
              }
            ),
            project && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-2 h-2 rounded-full flex-shrink-0",
                  style: { backgroundColor: project.color }
                }
              ),
              project.name
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 text-muted-foreground hover:text-foreground",
              onClick: () => onEdit(task),
              "data-ocid": `task.edit_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 text-muted-foreground hover:text-destructive",
              onClick: () => onDelete(task.id),
              "data-ocid": `task.delete_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function TaskForm({
  initialData,
  initialRecurrence = "none",
  projects,
  onSubmit,
  isPending,
  onCancel
}) {
  const [title, setTitle] = reactExports.useState((initialData == null ? void 0 : initialData.title) ?? "");
  const [desc, setDesc] = reactExports.useState((initialData == null ? void 0 : initialData.description) ?? "");
  const [priority, setPriority] = reactExports.useState(
    (initialData == null ? void 0 : initialData.priority) ?? Priority.medium
  );
  const [dueDate, setDueDate] = reactExports.useState(
    (initialData == null ? void 0 : initialData.dueDate) ? initialData.dueDate.split("T")[0] : ""
  );
  const [notes, setNotes] = reactExports.useState((initialData == null ? void 0 : initialData.notes) ?? "");
  const [projectId, setProjectId] = reactExports.useState(
    (initialData == null ? void 0 : initialData.projectId) ?? "none"
  );
  const [recurrence, setRecurrence] = reactExports.useState(initialRecurrence);
  reactExports.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDesc(initialData.description);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? initialData.dueDate.split("T")[0] : "");
      setNotes(initialData.notes);
      setProjectId(initialData.projectId ?? "none");
    }
    setRecurrence(initialRecurrence);
  }, [initialData, initialRecurrence]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      desc: desc.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      notes: notes.trim(),
      projectId: projectId === "none" ? null : projectId,
      recurrence
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-title", children: "Title *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "task-title",
          placeholder: "What needs to be done?",
          value: title,
          onChange: (e) => setTitle(e.target.value),
          "data-ocid": "task.title.input",
          required: true,
          autoFocus: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-desc", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "task-desc",
          placeholder: "Add more details...",
          value: desc,
          onChange: (e) => setDesc(e.target.value),
          rows: 2,
          className: "resize-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: priority,
            onValueChange: (v) => setPriority(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "task.priority.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Priority.high, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(0.65_0.22_25)] inline-block" }),
                  "High"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Priority.medium, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(0.75_0.18_75)] inline-block" }),
                  "Medium"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Priority.low, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(0.72_0.19_156)] inline-block" }),
                  "Low"
                ] }) })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-duedate", children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "task-duedate",
            type: "date",
            value: dueDate,
            onChange: (e) => setDueDate(e.target.value),
            "data-ocid": "task.duedate.input",
            className: "[color-scheme:dark]"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "w-3.5 h-3.5 text-muted-foreground" }),
        "Repeat"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: recurrence,
          onValueChange: (v) => setRecurrence(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "task.recurrence.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Does not repeat" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "Daily" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekly", children: "Weekly" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Project" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: projectId, onValueChange: setProjectId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "task.project.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No project" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No project" }),
          projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-2 h-2 rounded-full inline-block flex-shrink-0",
                style: { backgroundColor: p.color }
              }
            ),
            p.name
          ] }) }, p.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-notes", children: "Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "task-notes",
          placeholder: "Additional notes...",
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          rows: 2,
          className: "resize-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          onClick: onCancel,
          className: "flex-1",
          "data-ocid": "task.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          className: "flex-1",
          disabled: isPending || !title.trim(),
          "data-ocid": "task.submit_button",
          children: [
            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            initialData ? "Update Task" : "Create Task"
          ]
        }
      )
    ] })
  ] });
}
const STORAGE_KEY = "focusflow_task_completions";
function getStoredDates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
function todayISODate() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function calcCurrentStreak(dates) {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort().reverse();
  const today = todayISODate();
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  let startDate = null;
  if (unique[0] === today) {
    startDate = today;
  } else if (unique[0] === yesterdayStr) {
    startDate = yesterdayStr;
  } else {
    return 0;
  }
  let streak = 0;
  let current = new Date(startDate);
  const dateSet = new Set(unique);
  while (true) {
    const d = current.toISOString().slice(0, 10);
    if (dateSet.has(d)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
function calcLongestStreak(dates) {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = diffMs / (1e3 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}
function useTaskStreak() {
  const [dates, setDates] = reactExports.useState(getStoredDates);
  reactExports.useEffect(() => {
    const handler = () => setDates(getStoredDates());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const recordCompletion = reactExports.useCallback(() => {
    const today = todayISODate();
    const current = getStoredDates();
    if (!current.includes(today)) {
      const updated = [...current, today];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDates(updated);
    }
  }, []);
  const currentStreak = calcCurrentStreak(dates);
  const longestStreak = calcLongestStreak(dates);
  const todayCompleted = dates.includes(todayISODate());
  return { recordCompletion, currentStreak, longestStreak, todayCompleted };
}
export {
  TaskCard as T,
  TaskForm as a,
  useTaskStreak as u
};
