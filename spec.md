# FocusFlow

## Current State
ReportsPage has three period tabs: Weekly, 3 Months, 6 Months. Each tab renders either WeeklyView or PeriodView (which accepts a `months` prop). The tab state type is `"weekly" | "3mo" | "6mo"`.

## Requested Changes (Diff)

### Add
- **1 Month tab** on Reports: add `"1mo"` tab that renders `<PeriodView months={1} .../>` 
- **1 Year tab** on Reports: add `"12mo"` tab that renders `<PeriodView months={12} .../>`  
- **AI Summary section**: a card below the tab row (visible on all tabs) that computes a natural-language productivity summary from the user's live data (tasks, goals, habits, journal entries, focus sessions). This is a frontend-only computed summary — no LLM call. It reads all data and outputs 3–5 bullet-point insights (e.g. task completion rate, most productive day, streak status, mood trend, goal progress). Include a "Refresh" button to re-trigger computation. Label it "AI Summary" with a Sparkles icon.

### Modify
- `periodTab` state type extended to include `"1mo"` and `"12mo"`
- Tab row array to include the two new tabs in order: Weekly, 1 Month, 3 Months, 6 Months, 1 Year
- Login prompt description updated to mention all periods

### Remove
- Nothing removed

## Implementation Plan
1. Extend `periodTab` type and add `1mo` / `12mo` tab buttons in the tab row
2. Add conditional renders for `periodTab === "1mo"` and `periodTab === "12mo"` using `<PeriodView months={1}/>` and `<PeriodView months={12}/>`
3. Build `AISummary` component that computes insights from tasks/goals/journalEntries/focusSessions/habits data and renders them as bullet points with a Sparkles icon header and Refresh button
4. Place `<AISummary>` below tab row, above content, visible on all tabs
5. Validate build
