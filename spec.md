# FocusFlow

## Current State
FocusFlow has a full Tasks page with CRUD, filters, search, priority, projects, and streak tracking. The app has Dashboard, Tasks, Projects, Goals, AI Insights, Habits, Journal, Focus Timer, Calendar, and Reports pages. Backend supports task CRUD via createTask, toggleTaskCompletion, deleteTask, getAllTasks.

## Requested Changes (Diff)

### Add
- New "To Do" page at `/todo` with a simple, focused to-do list UI
  - Text input + Add button to quickly add items
  - List of to-do items each with a checkbox to mark done and a delete button
  - Filter tabs: All, Active, Done
  - Uses existing backend task APIs (createTask with default priority=low, toggleTaskCompletion, deleteTask, getAllTasks)
  - Simple and minimal -- no projects, priority, or notes fields
- "To Do" nav item in the sidebar (ListChecks icon)

### Modify
- App.tsx: add `/todo` route and import TodoPage, add nav item

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/TodoPage.tsx` with quick-add input, checkbox list, filter tabs
2. Update `App.tsx` to add nav item and route for TodoPage
