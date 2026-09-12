# PLANX 1.0 — Personal Command Center

PLANX is a local-first productivity application for tasks, projects, goals, habits, notes, calendar planning, focus sessions and reviews.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm run preview
```

## What's implemented

- Dashboard with live progress, overdue/upcoming counts and weekly chart
- Tasks with search, filters, priorities, categories, projects, tags and subtasks
- Quick Add modal and keyboard shortcut `N`
- Task completion, undo, duplicate, archive and permanent delete
- Board view (To Do / In Progress / Done)
- Calendar month view using the same task data
- Today view grouped by time
- Projects with live progress
- Goals
- Habits with daily check-ins
- Notes
- Completed and Archive
- Focus mode with timer
- Command palette with `Ctrl/Cmd + K`
- Keyboard shortcuts: `N`, `/`, `T`, `C`, `P`, `Esc`
- Dark / Light / System themes
- Responsive mobile layout
- Browser notification permission toggle
- JSON backup/import
- CSV task export
- Local-first persistence
- Explicit placeholders only through settings/future architecture; no fake API calls

## Theme fix

Theme is applied to both `html` and `body` using CSS variables. The earlier version used a selector that depended on a descendant `.dark` element, which could leave the page background unchanged. This version uses `html.dark, body.dark` variables and updates both elements from the persisted theme setting.

## Storage

Data is stored in browser `localStorage` under:

`planx-data-v2`

The Zustand store is the single source of truth. Calendar, Dashboard, Today, Projects, Completed, Archive and Search read the same task objects.

## Backend later

Create repository interfaces around the existing entity types in `src/types/index.ts`, then replace the local `save/load` layer in `src/store/usePlanxStore.ts` with API persistence. Keep the Zustand store as the client state layer. Add authentication before enabling cloud synchronization.

## Data safety

Import validates required arrays before replacing data and asks for confirmation. Export a JSON backup before destructive operations.
