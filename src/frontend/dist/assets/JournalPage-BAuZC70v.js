import { c as createLucideIcon, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, d as BookOpen, B as Button, L as LogIn, A as AnimatePresence, m as motion, a as cn, f as ue } from "./index-vju8O4pi.js";
import { B as Badge } from "./badge-CDWfs0gz.js";
import { C as Card, a as CardContent } from "./card-AQ15DKBE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, d as DialogFooter } from "./label-BXfrP8r1.js";
import { P as Plus, I as Input } from "./input-C2d6PDhd.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bb-oz2da.js";
import { T as Textarea } from "./textarea-Bxr3KB38.js";
import { c as useAllJournalEntries, k as useCreateJournalEntry, l as useUpdateJournalEntry, m as useDeleteJournalEntry } from "./useQueries-Cw60qAAe.js";
import { J as JournalMood } from "./backend.d-B4qOwcQE.js";
import { S as Search } from "./search-CHzfjRz4.js";
import { L as LoaderCircle } from "./loader-circle-Bd1ht1in.js";
import { T as Trash2 } from "./trash-2-cFZOQrOB.js";
import "./index-BYhKemf-.js";
import "./index-CuTA09c_.js";
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
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
const MOOD_CONFIG = {
  [JournalMood.happy]: {
    emoji: "😊",
    label: "Happy",
    color: "text-yellow-400"
  },
  [JournalMood.neutral]: {
    emoji: "😐",
    label: "Neutral",
    color: "text-blue-400"
  },
  [JournalMood.sad]: { emoji: "😢", label: "Sad", color: "text-indigo-400" },
  [JournalMood.stressed]: {
    emoji: "😰",
    label: "Stressed",
    color: "text-red-400"
  },
  [JournalMood.energized]: {
    emoji: "⚡",
    label: "Energized",
    color: "text-green-400"
  }
};
const todayStr = () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const emptyForm = () => ({
  title: "",
  date: todayStr(),
  mood: JournalMood.neutral,
  content: "",
  tags: ""
});
function JournalPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: entries = [], isLoading } = useAllJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  const [search, setSearch] = reactExports.useState("");
  const [moodFilter, setMoodFilter] = reactExports.useState("all");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editingEntry, setEditingEntry] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = reactExports.useState(null);
  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    if (q && !e.title.toLowerCase().includes(q) && !e.content.toLowerCase().includes(q))
      return false;
    if (moodFilter !== "all" && e.mood !== moodFilter) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));
  function openCreate() {
    setEditingEntry(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }
  function openEdit(entry) {
    setEditingEntry(entry);
    setForm({
      title: entry.title,
      date: entry.date,
      mood: entry.mood,
      content: entry.content,
      tags: entry.tags.join(", ")
    });
    setDialogOpen(true);
  }
  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      ue.error("Title and content are required");
      return;
    }
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (editingEntry) {
      await updateEntry.mutateAsync({
        id: editingEntry.id,
        title: form.title.trim(),
        content: form.content.trim(),
        mood: form.mood,
        tags,
        date: form.date,
        createdAt: editingEntry.createdAt
      });
      ue.success("Entry updated");
    } else {
      await createEntry.mutateAsync({
        id: crypto.randomUUID(),
        title: form.title.trim(),
        content: form.content.trim(),
        mood: form.mood,
        tags,
        date: form.date,
        createdAt: now
      });
      ue.success("Entry saved");
    }
    setDialogOpen(false);
  }
  async function handleDelete(id) {
    await deleteEntry.mutateAsync(id);
    setDeleteConfirmId(null);
    ue.success("Entry deleted");
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "journal.page",
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-2", children: "Your Private Journal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Sign in to start writing private journal entries, track your moods, and reflect on your journey." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: login,
              disabled: isLoggingIn,
              "data-ocid": "auth.login_button",
              size: "lg",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4 mr-2" }),
                isLoggingIn ? "Signing in..." : "Sign in to continue"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "journal.page", className: "p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Journal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
          entries.length,
          " ",
          entries.length === 1 ? "entry" : "entries"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: openCreate,
          "data-ocid": "journal.new_entry.button",
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New Entry"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "journal.search.input",
            placeholder: "Search entries...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: moodFilter,
          onValueChange: (v) => setMoodFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "journal.mood_filter.select",
                className: "w-[160px]",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by mood" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All moods" }),
              Object.entries(MOOD_CONFIG).map(([mood, { emoji, label }]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: mood, children: [
                emoji,
                " ",
                label
              ] }, mood))
            ] })
          ]
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) }),
    !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "journal.empty_state",
        className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: search || moodFilter !== "all" ? "No entries match your filters" : "No journal entries yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: search || moodFilter !== "all" ? "Try adjusting your search or filter" : "Start writing your first entry" })
          ] }),
          !search && moodFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, variant: "outline", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Write first entry"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: filtered.map((entry, index) => {
      const mood = MOOD_CONFIG[entry.mood] ?? MOOD_CONFIG[JournalMood.neutral];
      const itemIndex = index + 1;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { delay: index * 0.04 },
          "data-ocid": `journal.entry.item.${itemIndex}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "card-hover border-border/60 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: mood.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-lg leading-tight", children: entry.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: cn(
                      "text-xs ml-auto sm:ml-0",
                      mood.color
                    ),
                    children: mood.label
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: new Date(entry.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed line-clamp-3", children: entry.content.length > 150 ? `${entry.content.slice(0, 150)}…` : entry.content }),
              entry.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-3", children: entry.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs px-2 py-0.5 bg-primary/10 text-primary border-0",
                  children: [
                    "#",
                    tag
                  ]
                },
                tag
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                  onClick: () => openEdit(entry),
                  "data-ocid": `journal.entry.edit_button.${itemIndex}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                  onClick: () => setDeleteConfirmId(entry.id),
                  "data-ocid": `journal.entry.delete_button.${itemIndex}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }) }) })
        },
        entry.id
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        "data-ocid": "journal.entry_form.dialog",
        className: "max-w-lg max-h-[90vh] overflow-y-auto",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: editingEntry ? "Edit Entry" : "New Journal Entry" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-title", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "entry-title",
                  "data-ocid": "journal.title.input",
                  placeholder: "What's on your mind?",
                  value: form.title,
                  onChange: (e) => setForm((f) => ({ ...f, title: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-date", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "entry-date",
                    "data-ocid": "journal.date.input",
                    type: "date",
                    value: form.date,
                    onChange: (e) => setForm((f) => ({ ...f, date: e.target.value }))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mood" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.mood,
                    onValueChange: (v) => setForm((f) => ({ ...f, mood: v })),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(MOOD_CONFIG).map(
                        ([mood, { emoji, label }]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: mood, children: [
                          emoji,
                          " ",
                          label
                        ] }, mood)
                      ) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-content", children: "Write your thoughts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "entry-content",
                  "data-ocid": "journal.content.textarea",
                  placeholder: "How was your day? What are you feeling? What did you accomplish?",
                  value: form.content,
                  onChange: (e) => setForm((f) => ({ ...f, content: e.target.value })),
                  rows: 7,
                  className: "resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "entry-tags", children: "Tags (comma-separated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "entry-tags",
                  "data-ocid": "journal.tags.input",
                  placeholder: "productivity, gratitude, work...",
                  value: form.tags,
                  onChange: (e) => setForm((f) => ({ ...f, tags: e.target.value }))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDialogOpen(false),
                "data-ocid": "journal.cancel.button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSave,
                disabled: createEntry.isPending || updateEntry.isPending,
                "data-ocid": "journal.save.button",
                children: createEntry.isPending || updateEntry.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  "Saving..."
                ] }) : editingEntry ? "Update Entry" : "Save Entry"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!deleteConfirmId,
        onOpenChange: () => setDeleteConfirmId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Entry" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Are you sure you want to delete this journal entry? This action cannot be undone." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeleteConfirmId(null),
                "data-ocid": "journal.cancel.button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => deleteConfirmId && handleDelete(deleteConfirmId),
                disabled: deleteEntry.isPending,
                "data-ocid": "journal.entry.delete_button.1",
                children: deleteEntry.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  JournalPage as default
};
