import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CheckSquare, ListChecks, LogIn, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Priority,
  useAllTasks,
  useCreateTask,
  useDeleteTask,
  useToggleTaskCompletion,
} from "../hooks/useQueries";

type FilterType = "all" | "active" | "done";

export default function TodoPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: tasks = [], isLoading } = useAllTasks();
  const createTask = useCreateTask();
  const toggleTask = useToggleTaskCompletion();
  const deleteTask = useDeleteTask();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  async function handleAdd() {
    const title = input.trim();
    if (!title) return;
    try {
      await createTask.mutateAsync({
        id: crypto.randomUUID(),
        title,
        desc: "",
        priority: Priority.low,
        dueDate: null,
        notes: "",
        projectId: null,
      });
      setInput("");
      toast.success("To-do added!");
    } catch {
      toast.error("Failed to add to-do");
    }
  }

  async function handleToggle(taskId: string) {
    try {
      await toggleTask.mutateAsync(taskId);
    } catch {
      toast.error("Failed to update to-do");
    }
  }

  async function handleDelete(taskId: string) {
    try {
      await deleteTask.mutateAsync(taskId);
      toast.success("To-do removed");
    } catch {
      toast.error("Failed to delete to-do");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ListChecks className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Your To Do List
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Sign in to start tracking your to-dos and stay on top of your day.
          </p>
        </div>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          data-ocid="auth.login_button"
        >
          <LogIn className="w-4 h-4 mr-2" />
          {isLoggingIn ? "Signing in..." : "Sign in to continue"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            To Do List
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          {activeCount === 0
            ? "All caught up! 🎉"
            : `${activeCount} item${activeCount !== 1 ? "s" : ""} remaining`}
        </p>
      </div>

      {/* Add input */}
      <div className="flex gap-2 mb-6">
        <Input
          data-ocid="todo.input"
          placeholder="Add a to-do..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
          disabled={createTask.isPending}
        />
        <Button
          data-ocid="todo.add_button"
          onClick={handleAdd}
          disabled={createTask.isPending || !input.trim()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-border">
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
            {f === "all" && tasks.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs h-4 px-1">
                {tasks.length}
              </Badge>
            )}
            {f === "active" && activeCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs h-4 px-1">
                {activeCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div data-ocid="todo.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          data-ocid="todo.empty_state"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <CheckSquare className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">
            {filter === "done"
              ? "No completed items yet"
              : filter === "active"
                ? "No active items"
                : "No to-dos yet"}
          </p>
          <p className="text-muted-foreground/60 text-sm mt-1">
            {filter === "all" && "Add your first to-do above to get started"}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence initial={false}>
          <ul className="space-y-2">
            {filteredTasks.map((task, index) => (
              <motion.li
                key={task.id}
                data-ocid={`todo.item.${index + 1}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors group"
              >
                <Checkbox
                  data-ocid={`todo.checkbox.${index + 1}`}
                  checked={task.completed}
                  onCheckedChange={() => handleToggle(task.id)}
                  disabled={toggleTask.isPending}
                  className="flex-shrink-0"
                />
                <span
                  className={cn(
                    "flex-1 text-sm transition-colors",
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {task.title}
                </span>
                <button
                  type="button"
                  data-ocid={`todo.delete_button.${index + 1}`}
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteTask.isPending}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-md hover:bg-destructive/10"
                  aria-label="Delete to-do"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}
    </div>
  );
}
