import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Loader2, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Priority,
  type Task,
  useAllProjects,
  useAllTasks,
  useCreateTask,
  useDeleteTask,
  useSearchTasks,
  useToggleTaskCompletion,
  useUpdateTask,
} from "../hooks/useQueries";

type FilterTab = "all" | "active" | "completed";

export default function TasksPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: tasks = [], isLoading } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTaskCompletion();

  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const { data: searchResults, isFetching: isSearching } =
    useSearchTasks(searchQuery);

  const filteredTasks = useMemo(() => {
    const base = searchQuery.trim() ? (searchResults ?? []) : tasks;

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
    priorityFilter,
  ]);

  const handleCreate = async (data: {
    title: string;
    desc: string;
    priority: Priority;
    dueDate: string | null;
    notes: string;
    projectId: string | null;
  }) => {
    try {
      await createTask.mutateAsync({ id: crypto.randomUUID(), ...data });
      setAddOpen(false);
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleUpdate = async (data: {
    title: string;
    desc: string;
    priority: Priority;
    dueDate: string | null;
    notes: string;
    projectId: string | null;
  }) => {
    if (!editTask) return;
    try {
      await updateTask.mutateAsync({ id: editTask.id, ...data });
      setEditTask(null);
      toast.success("Task updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask.mutateAsync(id);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <p className="text-muted-foreground">Sign in to view your tasks.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Tasks
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {tasks.length} total tasks
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="task.add_button">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            data-ocid="task.search_input"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          )}
        </div>

        {/* Tab filters + dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <Tabs
            value={filterTab}
            onValueChange={(v) => setFilterTab(v as FilterTab)}
          >
            <TabsList className="bg-muted h-9">
              <TabsTrigger
                value="all"
                className="text-xs"
                data-ocid="task.filter.tab"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-xs"
                data-ocid="task.filter.tab"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="text-xs"
                data-ocid="task.filter.tab"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 ml-auto">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-9 text-xs w-36">
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9 text-xs w-32">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value={Priority.high}>High</SelectItem>
                <SelectItem value={Priority.medium}>Medium</SelectItem>
                <SelectItem value={Priority.low}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Task list */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2" data-ocid="task.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-dashed border-border rounded-xl p-12 text-center"
            data-ocid="task.empty_state"
          >
            <p className="text-sm font-medium text-foreground">
              No tasks found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery
                ? "Try a different search term."
                : "Add a task to get started."}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                projects={projects}
                index={i}
                onToggle={handleToggle}
                onEdit={setEditTask}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="task.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projects={projects}
            onSubmit={handleCreate}
            isPending={createTask.isPending}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent data-ocid="task.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <TaskForm
              initialData={editTask}
              projects={projects}
              onSubmit={handleUpdate}
              isPending={updateTask.isPending}
              onCancel={() => setEditTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
