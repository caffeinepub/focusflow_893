# FocusFlow

## Current State
FocusFlow has a Reports page with weekly/3-month/6-month views showing task/project stats, and a Journal page where users can write entries with mood tags (Happy, Neutral, Sad, Stressed, Energized).

## Requested Changes (Diff)

### Add
- Weekly Reflection Summary section on the Reports page
  - Mood trend visualization (bar or pie chart showing mood distribution for the week)
  - Journal entry count for the current week
  - Most common mood badge
  - Brief mood trend description text

### Modify
- ReportsPage.tsx: Add a WeeklyReflection section that reads from journalEntries (localStorage or same store as JournalPage) and displays mood stats and entry count for the current week

### Remove
- Nothing

## Implementation Plan
1. Read journal entries from localStorage (same key as JournalPage uses)
2. Filter entries from the current week (Mon-Sun)
3. Count entries and tally mood frequency
4. Display a summary card with entry count, mood distribution chart, and dominant mood badge in the Reports weekly view
