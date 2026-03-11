import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  FolderOpen,
  ListTodo,
  Plus,
  Repeat2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useHabits } from "../hooks/useHabits";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Priority,
  type Task,
  useAllProjects,
  useAllTasks,
  useCreateTask,
  useDashboardSummary,
  useDeleteTask,
  useToggleTaskCompletion,
  useUpdateTask,
} from "../hooks/useQueries";
import { useTaskStreak } from "../hooks/useTaskStreak";

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  ocid,
  delay,
}: {
  label: string;
  value: bigint | number | string | undefined;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  ocid: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      data-ocid={ocid}
    >
      <Card className="border-border bg-card relative overflow-hidden group card-hover">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                {label}
              </p>
              <p className="text-3xl font-display font-bold text-foreground">
                {value !== undefined ? (
                  value.toString()
                ) : (
                  <Skeleton className="h-8 w-12" />
                )}
              </p>
            </div>
            <div className={cn("p-2.5 rounded-lg", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: summary, isLoading: loadingSummary } = useDashboardSummary();
  const { data: tasks, isLoading: loadingTasks } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const createTask = useCreateTask();
  const toggleTask = useToggleTaskCompletion();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const { recordCompletion, currentStreak } = useTaskStreak();
  const { getTodayCompletionCount } = useHabits();
  const { completed: habitsCompleted, total: habitsTotal } =
    getTodayCompletionCount();

  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Today's tasks: due today or overdue and not completed
  const todayTasks = (tasks ?? []).filter((t) => {
    if (t.completed) return false;
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return due <= today;
  });

  // Projects progress: top 5 by task count
  const projectsWithProgress = projects
    .map((p) => {
      const projectTasks = (tasks ?? []).filter((t) => t.projectId === p.id);
      const total = projectTasks.length;
      const completed = projectTasks.filter((t) => t.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...p, total, completed, progress };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

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
    const task = (tasks ?? []).find((t) => t.id === id);
    try {
      await toggleTask.mutateAsync(id);
      // If task was not completed before, record streak completion
      if (task && !task.completed) {
        recordCompletion();
      }
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
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <ListTodo className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Welcome to FocusFlow
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Sign in to manage your tasks, projects, and focus sessions. Stay
            productive and organized.
          </p>
          <p className="text-xs text-muted-foreground">
            Use the Sign in button in the sidebar to get started.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="task.add_button">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </motion.div>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard
            label="Total Tasks"
            value={loadingSummary ? undefined : summary?.totalTasks}
            icon={ListTodo}
            iconColor="bg-primary/15 text-primary"
            ocid="dashboard.total.card"
            delay={0.05}
          />
          <StatCard
            label="Completed"
            value={loadingSummary ? undefined : summary?.completedTasks}
            icon={CheckCircle2}
            iconColor="bg-emerald-500/15 text-emerald-400"
            ocid="dashboard.completed.card"
            delay={0.1}
          />
          <StatCard
            label="Pending"
            value={loadingSummary ? undefined : summary?.pendingTasks}
            icon={Clock}
            iconColor="bg-amber-500/15 text-amber-400"
            ocid="dashboard.pending.card"
            delay={0.15}
          />
          <StatCard
            label="Overdue"
            value={loadingSummary ? undefined : summary?.overdueTasks}
            icon={AlertTriangle}
            iconColor="bg-destructive/15 text-destructive"
            ocid="dashboard.overdue.card"
            delay={0.2}
          />
          <StatCard
            label="Day Streak"
            value={currentStreak}
            icon={Flame}
            iconColor="bg-amber-500/15 text-amber-400"
            ocid="dashboard.streak.card"
            delay={0.25}
          />
          <StatCard
            label="Habits Today"
            value={`${habitsCompleted}/${habitsTotal}`}
            icon={Repeat2}
            iconColor="bg-teal-500/15 text-teal-400"
            ocid="dashboard.habits.card"
            delay={0.3}
          />
        </div>
      </section>

      {/* Projects Progress */}
      <section data-ocid="dashboard.projects_progress.section">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Projects Progress
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {projectsWithProgress.length} project
              {projectsWithProgress.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingTasks ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : projectsWithProgress.length === 0 ? (
            <div
              className="border border-dashed border-border rounded-xl p-8 text-center"
              data-ocid="dashboard.projects_progress.empty_state"
            >
              <FolderOpen className="w-7 h-7 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                No projects yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a project to track progress.
              </p>
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {projectsWithProgress.map((project, i) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 px-5 py-3.5"
                      data-ocid={`dashboard.projects_progress.item.${i + 1}`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium text-foreground min-w-0 truncate flex-1">
                        {project.name}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {project.completed} / {project.total} tasks
                        </span>
                        <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{
                              duration: 0.6,
                              delay: 0.1 + i * 0.06,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground tabular-nums w-9 text-right">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </section>

      {/* Today's Tasks */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Today's Focus
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingTasks ? (
            <div className="space-y-2" data-ocid="dashboard.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : todayTasks.length === 0 ? (
            <div
              className="border border-dashed border-border rounded-xl p-10 text-center"
              data-ocid="dashboard.empty_state"
            >
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                All clear for today!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No tasks due today. Add one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task, i) => (
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
            </div>
          )}
        </motion.div>
      </section>

      {/* Add task dialog */}
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

      {/* Edit task dialog */}
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
