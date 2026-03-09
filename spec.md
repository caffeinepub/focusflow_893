# FocusFlow - Productivity App

## Current State
New project. No existing code or features.

## Requested Changes (Diff)

### Add
- **Task Management**: Create, read, update, delete tasks with title, description, priority (low/medium/high), due date, and completion status
- **Projects**: Organize tasks into named projects/categories
- **Dashboard**: Overview showing task stats (total, completed, pending, overdue)
- **Filters & Views**: Filter tasks by status (all, active, completed), priority, and project
- **Focus Timer (Pomodoro)**: 25-minute work sessions with 5-minute breaks, session counter
- **Notes**: Quick notes/scratch pad area per task or standalone

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- `Task` type: id, title, description, priority, dueDate, projectId, completed, createdAt, notes
- `Project` type: id, name, color, createdAt
- CRUD operations for tasks and projects
- Query: get tasks by project, get tasks by status, get overdue tasks
- Stats query: counts by status and priority

### Frontend (React)
- Sidebar navigation: Dashboard, Tasks, Projects, Focus Timer
- Dashboard page: stat cards (total/completed/pending/overdue), today's task list
- Tasks page: full task list with filters, add/edit task modal, priority badges, due date display
- Projects page: project cards with task counts, add/edit project
- Focus Timer page: Pomodoro timer with start/pause/reset, session counter, task selector
- Shared components: TaskCard, TaskForm, ProjectBadge, PriorityBadge
- Responsive layout with collapsible sidebar on mobile
