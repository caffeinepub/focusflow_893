import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Project,
  useAllProjects,
  useAllTasks,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "../hooks/useQueries";

const PROJECT_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
];

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: { name: string; color: string }) => void;
  isPending: boolean;
  onCancel: () => void;
}

function ProjectForm({
  initialData,
  onSubmit,
  isPending,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [color, setColor] = useState(initialData?.color ?? PROJECT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="proj-name">Project Name *</Label>
        <Input
          id="proj-name"
          placeholder="e.g. Work, Personal, Side Project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-ocid="project.name.input"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2" data-ocid="project.color.select">
          {PROJECT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full transition-all duration-150 hover:scale-110"
              style={{
                backgroundColor: c,
                outline: color === c ? `3px solid ${c}` : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          data-ocid="project.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !name.trim()}
          data-ocid="project.submit_button"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? "Update" : "Create"} Project
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function ProjectsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: projects = [], isLoading } = useAllProjects();
  const { data: tasks = [] } = useAllTasks();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getTaskCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId).length;

  const getCompletedCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId && t.completed).length;

  const handleCreate = async (data: { name: string; color: string }) => {
    try {
      await createProject.mutateAsync({ id: crypto.randomUUID(), ...data });
      setAddOpen(false);
      toast.success("Project created");
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleUpdate = async (data: { name: string; color: string }) => {
    if (!editProject) return;
    try {
      await updateProject.mutateAsync({ id: editProject.id, ...data });
      setEditProject(null);
      toast.success("Project updated");
    } catch {
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      setDeleteConfirm(null);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <p className="text-muted-foreground">Sign in to view your projects.</p>
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
            Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {projects.length} projects
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="project.add_button">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="project.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-dashed border-border rounded-xl p-14 text-center col-span-3"
          data-ocid="project.empty_state"
        >
          <FolderOpen className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create a project to organize your tasks.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {projects.map((project, i) => {
              const total = getTaskCount(project.id);
              const completed = getCompletedCount(project.id);
              const progress = total > 0 ? (completed / total) * 100 : 0;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  data-ocid={`project.item.${i + 1}`}
                >
                  <Card className="group border-border bg-card card-hover overflow-hidden">
                    {/* Color stripe */}
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <h3 className="font-display font-semibold text-foreground text-base leading-tight">
                            {project.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => setEditProject(project)}
                            data-ocid={`project.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteConfirm(project.id)}
                            data-ocid={`project.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>
                          {completed} / {total} tasks
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{
                            duration: 0.6,
                            delay: 0.1 + i * 0.05,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="project.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleCreate}
            isPending={createProject.isPending}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editProject}
        onOpenChange={(o) => !o && setEditProject(null)}
      >
        <DialogContent data-ocid="project.modal" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Project</DialogTitle>
          </DialogHeader>
          {editProject && (
            <ProjectForm
              initialData={editProject}
              onSubmit={handleUpdate}
              isPending={updateProject.isPending}
              onCancel={() => setEditProject(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <AlertDialogContent data-ocid="project.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project. Tasks assigned to this
              project will remain but become unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="project.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
              data-ocid="project.confirm_button"
            >
              {deleteProject.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
