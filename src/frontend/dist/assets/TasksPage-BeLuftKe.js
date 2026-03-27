import { u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, A as AnimatePresence, f as ue } from "./index-KUZIGbRE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./label-CxoZgpdH.js";
import { P as Plus, I as Input } from "./input-tMArz861.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Cp9_pTl0.js";
import { S as Skeleton } from "./skeleton-Cj9O6Ive.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-B5VFbQGY.js";
import { u as useTaskStreak, T as TaskCard, a as TaskForm } from "./useTaskStreak-BMW6TNl5.js";
import { u as useAllTasks, a as useAllProjects, d as useCreateTask, g as useUpdateTask, f as useDeleteTask, e as useToggleTaskCompletion, q as useSearchTasks } from "./useQueries-DdSgPhXx.js";
import { F as Flame } from "./flame-CtrcYY0X.js";
import { S as Search } from "./search-To79RElD.js";
import { L as LoaderCircle } from "./loader-circle-BhKk3dLb.js";
import { F as Funnel } from "./funnel-DLOKLu8p.js";
import { P as Priority } from "./backend.d-B4qOwcQE.js";
import "./index-DPBwegNz.js";
import "./index-Bw-USlhe.js";
import "./index-CXMrZaHR.js";
import "./index-DlDp3ZU1.js";
import "./index-BjgAXiUX.js";
import "./index-O3sjHsUa.js";
import "./chevron-down-loKMe_FN.js";
import "./checkbox-DDIjYZLl.js";
import "./pencil-BytB0amP.js";
import "./trash-2-DOWwhJJN.js";
import "./textarea-NIPTfkO7.js";
const STORAGE_KEY = "focusflow_task_recurrence";
function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function useTaskRecurrence() {
  const getRecurrence = (taskId) => {
    return getAll()[taskId] ?? "none";
  };
  const setRecurrence = (taskId, value) => {
    const all = getAll();
    if (value === "none") {
      delete all[taskId];
    } else {
      all[taskId] = value;
    }
    saveAll(all);
  };
  const removeRecurrence = (taskId) => {
    const all = getAll();
    delete all[taskId];
    saveAll(all);
  };
  return { getRecurrence, setRecurrence, removeRecurrence };
}
function TasksPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [], isLoading } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTaskCompletion();
  const { recordCompletion, currentStreak } = useTaskStreak();
  const { getRecurrence, setRecurrence, removeRecurrence } = useTaskRecurrence();
  const [filterTab, setFilterTab] = reactExports.useState("all");
  const [projectFilter, setProjectFilter] = reactExports.useState("all");
  const [priorityFilter, setPriorityFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editTask, setEditTask] = reactExports.useState(null);
  const { data: searchResults, isFetching: isSearching } = useSearchTasks(searchQuery);
  const filteredTasks = reactExports.useMemo(() => {
    const base = searchQuery.trim() ? searchResults ?? [] : tasks;
    return base.filter((t) => {
      if (filterTab === "active" && t.completed) return false;
      if (filterTab === "completed" && !t.completed) return false;
      if (projectFilter !== "all" && t.projectId !== projectFilter)
        return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter)
        return false;
      return true;
    });
  }, [
    tasks,
    searchResults,
    searchQuery,
    filterTab,
    projectFilter,
    priorityFilter
  ]);
  const handleCreate = async (data) => {
    try {
      const newId = crypto.randomUUID();
      await createTask.mutateAsync({ id: newId, ...data });
      setRecurrence(newId, data.recurrence);
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
      setRecurrence(editTask.id, data.recurrence);
      setEditTask(null);
      ue.success("Task updated");
    } catch {
      ue.error("Failed to update task");
    }
  };
  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const wasNotCompleted = task && !task.completed;
    try {
      await toggleTask.mutateAsync(id);
      if (wasNotCompleted) {
        recordCompletion();
        const recur = getRecurrence(id);
        if (recur !== "none" && task) {
          const base = task.dueDate ? new Date(task.dueDate) : /* @__PURE__ */ new Date();
          const offsetDays = recur === "daily" ? 1 : 7;
          base.setDate(base.getDate() + offsetDays);
          const nextDueDate = base.toISOString();
          const newId = crypto.randomUUID();
          await createTask.mutateAsync({
            id: newId,
            title: task.title,
            desc: task.description,
            priority: task.priority,
            dueDate: nextDueDate,
            notes: task.notes,
            projectId: task.projectId ?? null
          });
          setRecurrence(newId, recur);
          ue.success("Task completed! Next occurrence scheduled.");
        }
      }
    } catch {
      ue.error("Failed to update task");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteTask.mutateAsync(id);
      removeRecurrence(id);
      ue.success("Task deleted");
    } catch {
      ue.error("Failed to delete task");
    }
  };
  const milestoneLabel = currentStreak >= 30 ? "🎯 30-day milestone!" : currentStreak >= 14 ? "🎯 14-day milestone!" : currentStreak >= 7 ? "🎯 7-day milestone!" : null;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sign in to view your tasks." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between flex-wrap gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Tasks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
              tasks.length,
              " total tasks"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                "data-ocid": "task.streak.card",
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.1 },
                className: "flex items-center gap-2",
                children: [
                  currentStreak >= 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full px-3 py-1.5 text-sm font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4 text-amber-400" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      currentStreak,
                      " day streak"
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Start your streak today" }),
                  milestoneLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.span,
                    {
                      initial: { opacity: 0, x: 8 },
                      animate: { opacity: 1, x: 0 },
                      className: "text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-1 font-medium",
                      children: milestoneLabel
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), "data-ocid": "task.add_button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
              "Add Task"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 },
        className: "space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search tasks...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 pr-9",
                "data-ocid": "task.search_input"
              }
            ),
            isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tabs,
              {
                value: filterTab,
                onValueChange: (v) => setFilterTab(v),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted h-9", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsTrigger,
                    {
                      value: "all",
                      className: "text-xs",
                      "data-ocid": "task.filter.tab",
                      children: "All"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsTrigger,
                    {
                      value: "active",
                      className: "text-xs",
                      "data-ocid": "task.filter.tab",
                      children: "Active"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TabsTrigger,
                    {
                      value: "completed",
                      className: "text-xs",
                      "data-ocid": "task.filter.tab",
                      children: "Completed"
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: projectFilter, onValueChange: setProjectFilter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All projects" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All projects" }),
                  projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-2 h-2 rounded-full",
                        style: { backgroundColor: p.color }
                      }
                    ),
                    p.name
                  ] }) }, p.id))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: priorityFilter, onValueChange: setPriorityFilter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All priorities" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All priorities" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Priority.high, children: "High" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Priority.medium, children: "Medium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Priority.low, children: "Low" })
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "task.loading_state", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, i)) }) : filteredTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "border border-dashed border-border rounded-xl p-12 text-center",
        "data-ocid": "task.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No tasks found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: searchQuery ? "Try a different search term." : "Add a task to get started." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TaskCard,
      {
        task,
        projects,
        index: i,
        recurrence: getRecurrence(task.id),
        onToggle: handleToggle,
        onEdit: setEditTask,
        onDelete: handleDelete
      },
      task.id
    )) }) }),
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
          initialRecurrence: getRecurrence(editTask.id),
          projects,
          onSubmit: handleUpdate,
          isPending: updateTask.isPending,
          onCancel: () => setEditTask(null)
        }
      )
    ] }) })
  ] });
}
export {
  TasksPage as default
};
