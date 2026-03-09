import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
    description: string;
    projectId?: string;
    notes: string;
    priority: Priority;
}
export interface Project {
    id: string;
    name: string;
    color: string;
}
export interface DashboardSummary {
    overdueTasks: bigint;
    totalTasks: bigint;
    completedTasks: bigint;
    pendingTasks: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(id: string, name: string, color: string): Promise<void>;
    createTask(id: string, title: string, desc: string, priority: Priority, dueDate: string | null, notes: string, projectId: string | null): Promise<void>;
    deleteProject(projectId: string): Promise<void>;
    deleteTask(taskId: string): Promise<void>;
    getAllProjects(): Promise<Array<Project>>;
    getAllTasks(): Promise<Array<Task>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardSummary(): Promise<DashboardSummary>;
    getTasksByCompletion(isCompleted: boolean): Promise<Array<Task>>;
    getTasksByProject(projectId: string): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTasks(searchTerm: string): Promise<Array<Task>>;
    toggleTaskCompletion(taskId: string): Promise<void>;
    updateProject(id: string, name: string, color: string): Promise<void>;
    updateTask(id: string, title: string, desc: string, priority: Priority, dueDate: string | null, notes: string, projectId: string | null): Promise<void>;
}
