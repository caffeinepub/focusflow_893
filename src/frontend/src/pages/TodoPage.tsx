import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Calculator,
  CheckSquare,
  ListChecks,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FilterType = "all" | "active" | "done";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface BudgetEntry {
  id: string;
  label: string;
  amount: number;
  type: "income" | "expense";
}

function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const raw = localStorage.getItem("focusflow_todos");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("focusflow_todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo(title: string) {
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return { todos, addTodo, toggleTodo, deleteTodo };
}

function useBudget() {
  const [entries, setEntries] = useState<BudgetEntry[]>(() => {
    try {
      const raw = localStorage.getItem("focusflow_todo_budget");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("focusflow_todo_budget", JSON.stringify(entries));
  }, [entries]);

  function addEntry(label: string, amount: number, type: "income" | "expense") {
    setEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label, amount, type },
    ]);
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  return {
    entries,
    addEntry,
    deleteEntry,
    totalIncome,
    totalExpenses,
    balance,
  };
}

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TodoPage() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const {
    entries,
    addEntry,
    deleteEntry,
    totalIncome,
    totalExpenses,
    balance,
  } = useBudget();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Budget form state
  const [bLabel, setBLabel] = useState("");
  const [bAmount, setBAmount] = useState("");
  const [bType, setBType] = useState<"income" | "expense">("expense");

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
    toast.success("To-do added!");
  }

  function handleAddBudget() {
    const label = bLabel.trim();
    const amount = Number.parseFloat(bAmount);
    if (!label || Number.isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid label and amount");
      return;
    }
    addEntry(label, amount, bType);
    setBLabel("");
    setBAmount("");
    toast.success(`${bType === "income" ? "Income" : "Expense"} added`);
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-primary" />
          To Do List
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeCount === 0
            ? "All caught up!"
            : `${activeCount} item${activeCount !== 1 ? "s" : ""} remaining`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── To Do Panel ── */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Checklist</h2>
          </div>

          {/* Add input */}
          <div className="flex gap-2">
            <Input
              data-ocid="todo.input"
              placeholder="Add a to-do..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Button
              data-ocid="todo.add_button"
              onClick={handleAdd}
              disabled={!input.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 border-b border-border">
            {(["all", "active", "done"] as FilterType[]).map((f) => (
              <button
                key={f}
                type="button"
                data-ocid="todo.filter.tab"
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
                  filter === f
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
                {f === "all" && todos.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 text-xs h-4 px-1"
                  >
                    {todos.length}
                  </Badge>
                )}
                {f === "active" && activeCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 text-xs h-4 px-1"
                  >
                    {activeCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          {filteredTodos.length === 0 ? (
            <div
              data-ocid="todo.empty_state"
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <CheckSquare className="w-9 h-9 text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground text-sm">
                {filter === "done"
                  ? "No completed items yet"
                  : filter === "active"
                    ? "No active items"
                    : "Add your first to-do above"}
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <ul className="space-y-2">
                {filteredTodos.map((todo, index) => (
                  <motion.li
                    key={todo.id}
                    data-ocid={`todo.item.${index + 1}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:bg-accent/30 transition-colors group"
                  >
                    <Checkbox
                      data-ocid={`todo.checkbox.${index + 1}`}
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="flex-shrink-0"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      data-ocid={`todo.delete_button.${index + 1}`}
                      onClick={() => {
                        deleteTodo(todo.id);
                        toast.success("Removed");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-md hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </AnimatePresence>
          )}
        </div>

        {/* ── Budget Calculator Panel ── */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Budget Calculator</h2>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Income</p>
              <p className="text-sm font-bold text-emerald-500">
                ${fmt(totalIncome)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Expenses</p>
              <p className="text-sm font-bold text-red-400">
                ${fmt(totalExpenses)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p
                className={cn(
                  "text-sm font-bold",
                  balance >= 0 ? "text-primary" : "text-red-400",
                )}
              >
                ${fmt(balance)}
              </p>
            </div>
          </div>

          {/* Add entry form */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBType("income")}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors",
                  bType === "income"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                    : "border-border text-muted-foreground hover:border-emerald-500/50",
                )}
              >
                + Income
              </button>
              <button
                type="button"
                onClick={() => setBType("expense")}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors",
                  bType === "expense"
                    ? "bg-red-400/20 border-red-400 text-red-400"
                    : "border-border text-muted-foreground hover:border-red-400/50",
                )}
              >
                − Expense
              </button>
            </div>
            <Input
              placeholder="Label (e.g. Groceries)"
              value={bLabel}
              onChange={(e) => setBLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddBudget()}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={bAmount}
                onChange={(e) => setBAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddBudget()}
                className="flex-1"
              />
              <Button
                onClick={handleAddBudget}
                size="sm"
                disabled={!bLabel.trim() || !bAmount}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Entries list */}
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calculator className="w-9 h-9 text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground text-sm">No entries yet</p>
            </div>
          ) : (
            <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-background group"
                >
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      entry.type === "income"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-red-400/20 text-red-400",
                    )}
                  >
                    {entry.type === "income" ? (
                      <Plus className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                  </span>
                  <span className="flex-1 text-sm text-foreground truncate">
                    {entry.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium flex-shrink-0",
                      entry.type === "income"
                        ? "text-emerald-500"
                        : "text-red-400",
                    )}
                  >
                    {entry.type === "income" ? "+" : "-"}${fmt(entry.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-md hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
