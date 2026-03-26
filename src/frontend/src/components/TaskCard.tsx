import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarDays,
  Pencil,
  Repeat,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { Priority, type Project, type Task } from "../hooks/useQueries";

type Recurrence = "none" | "daily" | "weekly";

interface TaskCardProps {
  task: Task;
  projects: Project[];
  index: number;
  recurrence?: Recurrence;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function getPriorityLabel(priority: Priority) {
  switch (priority) {
    case Priority.high:
      return "High";
    case Priority.medium:
      return "Medium";
    case Priority.low:
      return "Low";
  }
}

function getPriorityClass(priority: Priority) {
  switch (priority) {
    case Priority.high:
      return "bg-priority-high";
    case Priority.medium:
      return "bg-priority-medium";
    case Priority.low:
      return "bg-priority-low";
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diff = taskDate.getTime() - today.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days < 7) return `in ${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export default function TaskCard({
  task,
  projects,
  index,
  recurrence = "none",
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const project = task.projectId
    ? projects.find((p) => p.id === task.projectId)
    : null;
  const overdue = task.dueDate && !task.completed && isOverdue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      data-ocid={`task.item.${index + 1}`}
      className={cn(
        "group flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card card-hover",
        task.completed && "opacity-60",
      )}
    >
      <div className="mt-0.5 flex-shrink-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          data-ocid={`task.checkbox.${index + 1}`}
          className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span
            className={cn(
              "text-sm font-medium leading-snug",
              task.completed
                ? "line-through text-muted-foreground"
                : "text-foreground",
            )}
          >
            {task.title}
          </span>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0",
              getPriorityClass(task.priority),
            )}
          >
            {getPriorityLabel(task.priority)}
          </span>
          {recurrence !== "none" && (
            <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 bg-primary/10 text-primary border border-primary/20">
              <Repeat className="w-3 h-3" />
              {recurrence === "daily" ? "Daily" : "Weekly"}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                overdue ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {overdue ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <CalendarDays className="w-3 h-3" />
              )}
              {formatDate(task.dueDate)}
            </span>
          )}
          {project && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(task)}
          data-ocid={`task.edit_button.${index + 1}`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task.id)}
          data-ocid={`task.delete_button.${index + 1}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
