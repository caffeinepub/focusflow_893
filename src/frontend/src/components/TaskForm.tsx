import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Priority, type Project, type Task } from "../hooks/useQueries";

interface TaskFormProps {
  initialData?: Task;
  projects: Project[];
  onSubmit: (data: {
    title: string;
    desc: string;
    priority: Priority;
    dueDate: string | null;
    notes: string;
    projectId: string | null;
  }) => void;
  isPending: boolean;
  onCancel: () => void;
}

export default function TaskForm({
  initialData,
  projects,
  onSubmit,
  isPending,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [desc, setDesc] = useState(initialData?.description ?? "");
  const [priority, setPriority] = useState<Priority>(
    initialData?.priority ?? Priority.medium,
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.split("T")[0] : "",
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [projectId, setProjectId] = useState<string>(
    initialData?.projectId ?? "none",
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDesc(initialData.description);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? initialData.dueDate.split("T")[0] : "");
      setNotes(initialData.notes);
      setProjectId(initialData.projectId ?? "none");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      desc: desc.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      notes: notes.trim(),
      projectId: projectId === "none" ? null : projectId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="task-title">Title *</Label>
        <Input
          id="task-title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-ocid="task.title.input"
          required
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-desc">Description</Label>
        <Textarea
          id="task-desc"
          placeholder="Add more details..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as Priority)}
          >
            <SelectTrigger data-ocid="task.priority.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Priority.high}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.22_25)] inline-block" />
                  High
                </span>
              </SelectItem>
              <SelectItem value={Priority.medium}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_75)] inline-block" />
                  Medium
                </span>
              </SelectItem>
              <SelectItem value={Priority.low}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.19_156)] inline-block" />
                  Low
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="task-duedate">Due Date</Label>
          <Input
            id="task-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            data-ocid="task.duedate.input"
            className="[color-scheme:dark]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Project</Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger data-ocid="task.project.select">
            <SelectValue placeholder="No project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No project</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-notes">Notes</Label>
        <Textarea
          id="task-notes"
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
          data-ocid="task.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isPending || !title.trim()}
          data-ocid="task.submit_button"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
