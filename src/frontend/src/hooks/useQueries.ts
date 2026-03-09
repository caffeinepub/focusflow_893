import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type DashboardSummary,
  Priority,
  type Project,
  type Task,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export { Priority };
export type { Task, Project, DashboardSummary };

// ─── Queries ────────────────────────────────────────────────────────────────

export function useDashboardSummary() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      if (!actor)
        return {
          totalTasks: BigInt(0),
          completedTasks: BigInt(0),
          pendingTasks: BigInt(0),
          overdueTasks: BigInt(0),
        };
      return actor.getDashboardSummary();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAllTasks() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAllProjects() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useTasksByProject(projectId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Task[]>({
    queryKey: ["tasks", "project", projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasksByProject(projectId);
    },
    enabled: !!actor && !isFetching && !!identity && !!projectId,
  });
}

export function useSearchTasks(searchTerm: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Task[]>({
    queryKey: ["tasks", "search", searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchTasks(searchTerm);
    },
    enabled:
      !!actor && !isFetching && !!identity && searchTerm.trim().length > 0,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      id: string;
      title: string;
      desc: string;
      priority: Priority;
      dueDate: string | null;
      notes: string;
      projectId: string | null;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createTask(
        params.id,
        params.title,
        params.desc,
        params.priority,
        params.dueDate,
        params.notes,
        params.projectId,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      id: string;
      title: string;
      desc: string;
      priority: Priority;
      dueDate: string | null;
      notes: string;
      projectId: string | null;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateTask(
        params.id,
        params.title,
        params.desc,
        params.priority,
        params.dueDate,
        params.notes,
        params.projectId,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
}

export function useToggleTaskCompletion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.toggleTaskCompletion(taskId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
    },
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; name: string; color: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createProject(params.id, params.name, params.color);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; name: string; color: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateProject(params.id, params.name, params.color);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProject(projectId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["projects"] });
      void qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
