import { u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, m as motion, B as Button, F as FolderOpen, A as AnimatePresence, f as ue } from "./index-ByEywl6s.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CAgGI6wq.js";
import { C as Card, a as CardContent } from "./card-0tn5YjuE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, d as DialogFooter } from "./label-Ma4kwGeO.js";
import { P as Plus, I as Input } from "./input-yeCKjczh.js";
import { S as Skeleton } from "./skeleton-C9Mi1Kxn.js";
import { a as useAllProjects, u as useAllTasks, n as useCreateProject, o as useUpdateProject, p as useDeleteProject } from "./useQueries-BzU7bq2r.js";
import { P as Pencil } from "./pencil-CtCQZtY3.js";
import { T as Trash2 } from "./trash-2-Y7N_uk-_.js";
import { L as LoaderCircle } from "./loader-circle-DlG_CQR4.js";
import "./index-B1OTAsPJ.js";
import "./index-CrHuaOeQ.js";
import "./index-Bgnit1vS.js";
import "./index-C-ts0wum.js";
const PROJECT_COLORS = [
  "#10b981",
  // emerald
  "#3b82f6",
  // blue
  "#8b5cf6",
  // violet
  "#f59e0b",
  // amber
  "#ef4444",
  // red
  "#06b6d4",
  // cyan
  "#ec4899",
  // pink
  "#84cc16",
  // lime
  "#f97316",
  // orange
  "#6366f1"
  // indigo
];
function ProjectForm({
  initialData,
  onSubmit,
  isPending,
  onCancel
}) {
  const [name, setName] = reactExports.useState((initialData == null ? void 0 : initialData.name) ?? "");
  const [color, setColor] = reactExports.useState((initialData == null ? void 0 : initialData.color) ?? PROJECT_COLORS[0]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "proj-name", children: "Project Name *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "proj-name",
          placeholder: "e.g. Work, Personal, Side Project",
          value: name,
          onChange: (e) => setName(e.target.value),
          "data-ocid": "project.name.input",
          required: true,
          autoFocus: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", "data-ocid": "project.color.select", children: PROJECT_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setColor(c),
          className: "w-8 h-8 rounded-full transition-all duration-150 hover:scale-110",
          style: {
            backgroundColor: c,
            outline: color === c ? `3px solid ${c}` : "none",
            outlineOffset: "2px"
          }
        },
        c
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          onClick: onCancel,
          "data-ocid": "project.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          disabled: isPending || !name.trim(),
          "data-ocid": "project.submit_button",
          children: [
            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            initialData ? "Update" : "Create",
            " Project"
          ]
        }
      )
    ] })
  ] });
}
function ProjectsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: projects = [], isLoading } = useAllProjects();
  const { data: tasks = [] } = useAllTasks();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editProject, setEditProject] = reactExports.useState(null);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const getTaskCount = (projectId) => tasks.filter((t) => t.projectId === projectId).length;
  const getCompletedCount = (projectId) => tasks.filter((t) => t.projectId === projectId && t.completed).length;
  const handleCreate = async (data) => {
    try {
      await createProject.mutateAsync({ id: crypto.randomUUID(), ...data });
      setAddOpen(false);
      ue.success("Project created");
    } catch {
      ue.error("Failed to create project");
    }
  };
  const handleUpdate = async (data) => {
    if (!editProject) return;
    try {
      await updateProject.mutateAsync({ id: editProject.id, ...data });
      setEditProject(null);
      ue.success("Project updated");
    } catch {
      ue.error("Failed to update project");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteProject.mutateAsync(id);
      setDeleteConfirm(null);
      ue.success("Project deleted");
    } catch {
      ue.error("Failed to delete project");
    }
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sign in to view your projects." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Projects" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
              projects.length,
              " projects"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), "data-ocid": "project.add_button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "New Project"
          ] })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        "data-ocid": "project.loading_state",
        children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-xl" }, i))
      }
    ) : projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "border border-dashed border-border rounded-xl p-14 text-center col-span-3",
        "data-ocid": "project.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-10 h-10 text-primary mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No projects yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Create a project to organize your tasks." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: projects.map((project, i) => {
      const total = getTaskCount(project.id);
      const completed = getCompletedCount(project.id);
      const progress = total > 0 ? completed / total * 100 : 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          layout: true,
          initial: { opacity: 0, scale: 0.95, y: 12 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.2, delay: i * 0.05 },
          "data-ocid": `project.item.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group border-border bg-card card-hover overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1.5 w-full",
                style: { backgroundColor: project.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-3 h-3 rounded-full flex-shrink-0",
                      style: { backgroundColor: project.color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-base leading-tight", children: project.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                      onClick: () => setEditProject(project),
                      "data-ocid": `project.edit_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                      onClick: () => setDeleteConfirm(project.id),
                      "data-ocid": `project.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  completed,
                  " / ",
                  total,
                  " tasks"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  Math.round(progress),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${progress}%` },
                  transition: {
                    duration: 0.6,
                    delay: 0.1 + i * 0.05,
                    ease: "easeOut"
                  },
                  className: "h-full rounded-full",
                  style: { backgroundColor: project.color }
                }
              ) })
            ] })
          ] })
        },
        project.id
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "project.modal", className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Project" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProjectForm,
        {
          onSubmit: handleCreate,
          isPending: createProject.isPending,
          onCancel: () => setAddOpen(false)
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!editProject,
        onOpenChange: (o) => !o && setEditProject(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "project.modal", className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Project" }) }),
          editProject && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProjectForm,
            {
              initialData: editProject,
              onSubmit: handleUpdate,
              isPending: updateProject.isPending,
              onCancel: () => setEditProject(null)
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteConfirm,
        onOpenChange: (o) => !o && setDeleteConfirm(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "project.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Project?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently delete the project. Tasks assigned to this project will remain but become unassigned." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "project.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                onClick: () => deleteConfirm && handleDelete(deleteConfirm),
                className: "bg-destructive hover:bg-destructive/90",
                "data-ocid": "project.confirm_button",
                children: [
                  deleteProject.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  "Delete"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  ProjectsPage as default
};
