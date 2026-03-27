import { c as createLucideIcon, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, m as motion, e as Repeat2, B as Button, A as AnimatePresence, f as ue, a as cn } from "./index-vju8O4pi.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Da8qF1Au.js";
import { B as Badge } from "./badge-CDWfs0gz.js";
import { C as Card, a as CardContent } from "./card-AQ15DKBE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, d as DialogFooter } from "./label-BXfrP8r1.js";
import { P as Plus, I as Input } from "./input-C2d6PDhd.js";
import { P as Progress } from "./progress-DEDDMeMJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bb-oz2da.js";
import { T as Textarea } from "./textarea-Bxr3KB38.js";
import { u as useHabits } from "./useHabits-DpT1FNxy.js";
import { C as CircleCheck } from "./circle-check-_WIxX-RB.js";
import { P as Pencil } from "./pencil-ByWKpQL-.js";
import { T as Trash2 } from "./trash-2-cFZOQrOB.js";
import { F as Flame } from "./flame-D7HtZxtY.js";
import "./index-CuTA09c_.js";
import "./index-BYhKemf-.js";
import "./index-2WWr-EBF.js";
import "./index-cyt5o4B7.js";
import "./index-ClcQs7Ut.js";
import "./index-7WiiG0mP.js";
import "./chevron-down-BJPyXQTG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
const PRESET_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];
function HabitForm({
  initialData,
  onSubmit,
  onCancel,
  isPending
}) {
  const [name, setName] = reactExports.useState((initialData == null ? void 0 : initialData.name) ?? "");
  const [description, setDescription] = reactExports.useState(
    (initialData == null ? void 0 : initialData.description) ?? ""
  );
  const [color, setColor] = reactExports.useState((initialData == null ? void 0 : initialData.color) ?? PRESET_COLORS[0]);
  const [frequency, setFrequency] = reactExports.useState(
    (initialData == null ? void 0 : initialData.frequency) ?? "daily"
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description, color, frequency });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "habit-name", children: "Name *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "habit-name",
          placeholder: "e.g. Morning meditation",
          value: name,
          onChange: (e) => setName(e.target.value),
          required: true,
          autoFocus: true,
          "data-ocid": "habit.name.input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "habit-desc", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "habit-desc",
          placeholder: "Why is this habit important?",
          value: description,
          onChange: (e) => setDescription(e.target.value),
          rows: 2,
          "data-ocid": "habit.description.textarea"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: PRESET_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setColor(c),
          className: cn(
            "w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            color === c && "ring-2 ring-offset-2 ring-offset-background scale-110"
          ),
          style: { backgroundColor: c },
          "aria-label": `Color ${c}`
        },
        c
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Frequency" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: frequency,
          onValueChange: (v) => setFrequency(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "habit.frequency.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "Daily" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekly", children: "Weekly" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          onClick: onCancel,
          "data-ocid": "habit.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: isPending || !name.trim(),
          "data-ocid": "habit.submit_button",
          children: initialData ? "Save Changes" : "Add Habit"
        }
      )
    ] })
  ] });
}
function HabitCard({
  habit,
  index,
  completed,
  currentStreak,
  longestStreak,
  onToggle,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 12, scale: 0.97 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2, delay: index * 0.04 },
      "data-ocid": `habits.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: cn(
            "group border-border bg-card card-hover overflow-hidden relative transition-all duration-300",
            completed && "ring-1 ring-inset"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                style: { backgroundColor: habit.color }
              }
            ),
            completed && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 opacity-[0.03] rounded-xl",
                style: { backgroundColor: habit.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pl-5 pr-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onToggle,
                  "data-ocid": `habit.toggle.${index + 1}`,
                  className: cn(
                    "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border-2",
                    completed ? "border-transparent text-white" : "border-border hover:border-current"
                  ),
                  style: completed ? { backgroundColor: habit.color } : { color: habit.color },
                  "aria-label": completed ? "Mark incomplete" : "Mark complete",
                  children: completed && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: cn(
                          "font-display font-semibold text-sm leading-snug",
                          completed ? "text-muted-foreground line-through" : "text-foreground"
                        ),
                        children: habit.name
                      }
                    ),
                    habit.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: habit.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                        onClick: onEdit,
                        "data-ocid": `habit.edit_button.${index + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                        onClick: onDelete,
                        "data-ocid": `habit.delete_button.${index + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs border-border text-muted-foreground capitalize",
                      children: habit.frequency
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Flame,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: currentStreak > 0 ? "#f59e0b" : void 0 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "font-semibold tabular-nums",
                          currentStreak > 0 ? "text-amber-400" : "text-muted-foreground"
                        ),
                        children: currentStreak
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "streak" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3 h-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                      longestStreak,
                      " best"
                    ] })
                  ] })
                ] }),
                currentStreak >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: cn(
                      "text-xs font-bold",
                      currentStreak >= 30 ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : currentStreak >= 14 ? "bg-violet-500/20 text-violet-300 border-violet-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    ),
                    variant: "outline",
                    children: [
                      "🔥",
                      " ",
                      currentStreak >= 30 ? "30-day streak!" : currentStreak >= 14 ? "14-day streak!" : "7-day streak!"
                    ]
                  }
                ) })
              ] })
            ] }) })
          ]
        }
      )
    }
  );
}
function HabitsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompletedToday,
    getCurrentStreak,
    getLongestStreak,
    getTodayCompletionCount
  } = useHabits();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editHabit, setEditHabit] = reactExports.useState(null);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const { completed: todayCompleted, total: todayTotal } = getTodayCompletionCount();
  const progressPct = todayTotal > 0 ? todayCompleted / todayTotal * 100 : 0;
  const handleAdd = (data) => {
    addHabit(data);
    setAddOpen(false);
    ue.success("Habit added!");
  };
  const handleEdit = (data) => {
    if (!editHabit) return;
    updateHabit(editHabit.id, data);
    setEditHabit(null);
    ue.success("Habit updated");
  };
  const handleDelete = (id) => {
    deleteHabit(id);
    setDeleteConfirm(null);
    ue.success("Habit deleted");
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Habits Tracker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: "Sign in to build daily habits, track streaks, and stay consistent." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use the Sign in button in the sidebar to get started." })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl md:text-3xl font-bold text-foreground", children: "Habits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
              habits.length,
              " habit",
              habits.length !== 1 ? "s" : "",
              " tracked"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), "data-ocid": "habit.add_button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Habit"
          ] })
        ]
      }
    ),
    habits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.08 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Today's Progress" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground tabular-nums", children: [
              todayCompleted,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                "/ ",
                todayTotal
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progressPct, className: "h-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: todayCompleted === todayTotal && todayTotal > 0 ? "🎉 All habits completed today!" : `${todayTotal - todayCompleted} habit${todayTotal - todayCompleted !== 1 ? "s" : ""} left to complete` })
        ] }) })
      }
    ),
    habits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "border border-dashed border-border rounded-xl p-16 text-center",
        "data-ocid": "habits.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat2, { className: "w-10 h-10 text-primary mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No habits yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-4", children: "Start building consistent daily routines. Add your first habit." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setAddOpen(true),
              "data-ocid": "habit.add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
                "Add your first habit"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: habits.map((habit, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      HabitCard,
      {
        habit,
        index: i,
        completed: isCompletedToday(habit.id),
        currentStreak: getCurrentStreak(habit.id),
        longestStreak: getLongestStreak(habit.id),
        onToggle: () => toggleCompletion(habit.id),
        onEdit: () => setEditHabit(habit),
        onDelete: () => setDeleteConfirm(habit.id)
      },
      habit.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "habit.dialog", className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Habit" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HabitForm, { onSubmit: handleAdd, onCancel: () => setAddOpen(false) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editHabit, onOpenChange: (o) => !o && setEditHabit(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "habit.dialog", className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Habit" }) }),
      editHabit && /* @__PURE__ */ jsxRuntimeExports.jsx(
        HabitForm,
        {
          initialData: editHabit,
          onSubmit: handleEdit,
          onCancel: () => setEditHabit(null)
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteConfirm,
        onOpenChange: (o) => !o && setDeleteConfirm(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "habit.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Habit?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently delete the habit and all completion history." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "habit.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: () => deleteConfirm && handleDelete(deleteConfirm),
                className: "bg-destructive hover:bg-destructive/90",
                "data-ocid": "habit.confirm_button",
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  HabitsPage as default
};
