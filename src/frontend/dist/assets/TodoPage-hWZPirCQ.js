import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Z as ListChecks, B as Button, a as cn, _ as SquareCheckBig, A as AnimatePresence, m as motion, f as ue } from "./index-vju8O4pi.js";
import { B as Badge } from "./badge-CDWfs0gz.js";
import { C as Checkbox } from "./checkbox-BXpDGZnQ.js";
import { I as Input, P as Plus } from "./input-C2d6PDhd.js";
import { T as Trash2 } from "./trash-2-cFZOQrOB.js";
import "./index-CuTA09c_.js";
import "./index-BYhKemf-.js";
import "./index-7WiiG0mP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }]
];
const Calculator = createLucideIcon("calculator", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function useTodos() {
  const [todos, setTodos] = reactExports.useState(() => {
    try {
      const raw = localStorage.getItem("focusflow_todos");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  reactExports.useEffect(() => {
    localStorage.setItem("focusflow_todos", JSON.stringify(todos));
  }, [todos]);
  function addTodo(title) {
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now()
      },
      ...prev
    ]);
  }
  function toggleTodo(id) {
    setTodos(
      (prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }
  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }
  return { todos, addTodo, toggleTodo, deleteTodo };
}
function useBudget() {
  const [entries, setEntries] = reactExports.useState(() => {
    try {
      const raw = localStorage.getItem("focusflow_todo_budget");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  reactExports.useEffect(() => {
    localStorage.setItem("focusflow_todo_budget", JSON.stringify(entries));
  }, [entries]);
  function addEntry(label, amount, type) {
    setEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label, amount, type }
    ]);
  }
  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }
  const totalIncome = entries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  return {
    entries,
    addEntry,
    deleteEntry,
    totalIncome,
    totalExpenses,
    balance
  };
}
function fmt(n) {
  return n.toLocaleString(void 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function TodoPage() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const {
    entries,
    addEntry,
    deleteEntry,
    totalIncome,
    totalExpenses,
    balance
  } = useBudget();
  const [input, setInput] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [bLabel, setBLabel] = reactExports.useState("");
  const [bAmount, setBAmount] = reactExports.useState("");
  const [bType, setBType] = reactExports.useState("expense");
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });
  const activeCount = todos.filter((t) => !t.completed).length;
  function handleAdd() {
    const title = input.trim();
    if (!title) return;
    addTodo(title);
    setInput("");
    ue.success("To-do added!");
  }
  function handleAddBudget() {
    const label = bLabel.trim();
    const amount = Number.parseFloat(bAmount);
    if (!label || Number.isNaN(amount) || amount <= 0) {
      ue.error("Enter a valid label and amount");
      return;
    }
    addEntry(label, amount, bType);
    setBLabel("");
    setBAmount("");
    ue.success(`${bType === "income" ? "Income" : "Expense"} added`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-8 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-display font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-6 h-6 text-primary" }),
        "To Do List"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: activeCount === 0 ? "All caught up!" : `${activeCount} item${activeCount !== 1 ? "s" : ""} remaining` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Checklist" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "todo.input",
              placeholder: "Add a to-do...",
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleAdd(),
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "todo.add_button",
              onClick: handleAdd,
              disabled: !input.trim(),
              size: "sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
                "Add"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b border-border", children: ["all", "active", "done"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "todo.filter.tab",
            onClick: () => setFilter(f),
            className: cn(
              "px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              filter === f ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            ),
            children: [
              f,
              f === "all" && todos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "ml-1.5 text-xs h-4 px-1",
                  children: todos.length
                }
              ),
              f === "active" && activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "ml-1.5 text-xs h-4 px-1",
                  children: activeCount
                }
              )
            ]
          },
          f
        )) }),
        filteredTodos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "todo.empty_state",
            className: "flex flex-col items-center justify-center py-10 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-9 h-9 text-muted-foreground/40 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: filter === "done" ? "No completed items yet" : filter === "active" ? "No active items" : "Add your first to-do above" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: filteredTodos.map((todo, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.li,
          {
            "data-ocid": `todo.item.${index + 1}`,
            initial: { opacity: 0, y: -6 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.15 },
            className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  "data-ocid": `todo.checkbox.${index + 1}`,
                  checked: todo.completed,
                  onCheckedChange: () => toggleTodo(todo.id),
                  className: "flex-shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "flex-1 text-sm",
                    todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                  ),
                  children: todo.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `todo.delete_button.${index + 1}`,
                  onClick: () => {
                    deleteTodo(todo.id);
                    ue.success("Removed");
                  },
                  className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-md hover:bg-destructive/10",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ]
          },
          todo.id
        )) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Budget Calculator" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Income" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-emerald-500", children: [
              "$",
              fmt(totalIncome)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Expenses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-red-400", children: [
              "$",
              fmt(totalExpenses)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: cn(
                  "text-sm font-bold",
                  balance >= 0 ? "text-primary" : "text-red-400"
                ),
                children: [
                  "$",
                  fmt(balance)
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setBType("income"),
                className: cn(
                  "flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors",
                  bType === "income" ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : "border-border text-muted-foreground hover:border-emerald-500/50"
                ),
                children: "+ Income"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setBType("expense"),
                className: cn(
                  "flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors",
                  bType === "expense" ? "bg-red-400/20 border-red-400 text-red-400" : "border-border text-muted-foreground hover:border-red-400/50"
                ),
                children: "− Expense"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Label (e.g. Groceries)",
              value: bLabel,
              onChange: (e) => setBLabel(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleAddBudget()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                placeholder: "Amount",
                value: bAmount,
                onChange: (e) => setBAmount(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleAddBudget(),
                className: "flex-1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleAddBudget,
                size: "sm",
                disabled: !bLabel.trim() || !bAmount,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
                  "Add"
                ]
              }
            )
          ] })
        ] }),
        entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-9 h-9 text-muted-foreground/40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No entries yet" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 max-h-64 overflow-y-auto pr-1", children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-background group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                    entry.type === "income" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-400/20 text-red-400"
                  ),
                  children: entry.type === "income" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm text-foreground truncate", children: entry.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: cn(
                    "text-sm font-medium flex-shrink-0",
                    entry.type === "income" ? "text-emerald-500" : "text-red-400"
                  ),
                  children: [
                    entry.type === "income" ? "+" : "-",
                    "$",
                    fmt(entry.amount)
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteEntry(entry.id),
                  className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-md hover:bg-destructive/10",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ]
          },
          entry.id
        )) })
      ] })
    ] })
  ] });
}
export {
  TodoPage as default
};
