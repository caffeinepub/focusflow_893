import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DashboardSummary {
    overdueTasks: bigint;
    totalTasks: bigint;
    completedTasks: bigint;
    pendingTasks: bigint;
}
export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: string;
    mood: JournalMood;
    createdAt: string;
    tags: Array<string>;
}
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
export interface UserProfile {
    name: string;
}
export interface Goal {
    id: string;
    status: GoalStatus;
    title: string;
    description: string;
    progress: bigint;
    targetDate?: string;
    notes: string;
    category: GoalCategory;
}
export enum GoalCategory {
    other = "other",
    learning = "learning",
    work = "work",
    personal = "personal",
    health = "health"
}
export enum GoalStatus {
    active = "active",
    completed = "completed",
    paused = "paused"
}
export enum JournalMood {
    sad = "sad",
    happy = "happy",
    energized = "energized",
    stressed = "stressed",
    neutral = "neutral"
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
    createGoal(id: string, title: string, description: string, category: GoalCategory, targetDate: string | null, notes: string): Promise<void>;
    createJournalEntry(id: string, title: string, content: string, mood: JournalMood, tags: Array<string>, date: string, createdAt: string): Promise<void>;
    createProject(id: string, name: string, color: string): Promise<void>;
    createTask(id: string, title: string, desc: string, priority: Priority, dueDate: string | null, notes: string, projectId: string | null): Promise<void>;
    deleteGoal(goalId: string): Promise<void>;
    deleteJournalEntry(entryId: string): Promise<void>;
    deleteProject(projectId: string): Promise<void>;
    deleteTask(taskId: string): Promise<void>;
    getAllGoals(): Promise<Array<Goal>>;
    getAllJournalEntries(): Promise<Array<JournalEntry>>;
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
    updateGoal(id: string, title: string, description: string, category: GoalCategory, targetDate: string | null, status: GoalStatus, progress: bigint, notes: string): Promise<void>;
    updateJournalEntry(id: string, title: string, content: string, mood: JournalMood, tags: Array<string>, date: string, createdAt: string): Promise<void>;
    updateProject(id: string, name: string, color: string): Promise<void>;
    updateTask(id: string, title: string, desc: string, priority: Priority, dueDate: string | null, notes: string, projectId: string | null): Promise<void>;
}
