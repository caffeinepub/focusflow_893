# FocusFlow

## Current State
ReportsPage.tsx already exports Tasks, Goals, Journal (as journal entries), and Focus Sessions to PDF, Word, and Excel. The export functions build tables from those four data sources only.

Projects (from `useAllProjects`), To-Do List (from `localStorage` key `focusflow_todos`), and Habits (from `useHabits` hook / `localStorage` key `focusflow_habits`) are NOT included in any export.

## Requested Changes (Diff)

### Add
- Import `useHabits` and `Habit` type from `../hooks/useHabits`
- Read `focusflow_todos` from localStorage inside the page to get `TodoItem[]`
- Projects data already available via `useAllProjects` -- just wire it into exports
- In PDF export: add three new sections -- Projects table (name, description/color, tasks total/completed), To-Do List table (title, status done/active), Habits table (name, frequency, streak)
- In Word (.doc) export: add Projects, To-Do List, and Habits sections with the same columns
- In Excel (.xlsx) export: add three new sheets -- "Projects", "To-Do List", "Habits" -- with matching columns
- In the on-screen report view (all tabs): add summary cards/sections for Projects, To-Do List summary, and Habits so the data is visible when viewing reports in-app too

### Modify
- `exportToPDF`, `exportToWord`, `exportToExcel` functions to include the three new data sources
- The report view to show Projects progress, To-Do completion, and Habits streak overview

### Remove
- Nothing

## Implementation Plan
1. Add `useHabits` import and read todos from localStorage inside `ReportsPage`
2. Pass projects, todos, habits into the export functions
3. Update PDF export to add Projects, To-Do List, Habits tables
4. Update Word export similarly
5. Update Excel export with new sheets
6. Add in-page summary sections (cards) for Projects, To-Do List, and Habits visible in the report tabs
7. Validate and deploy
