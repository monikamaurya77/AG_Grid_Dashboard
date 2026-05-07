# FactWise People Dashboard

A production-grade employee analytics dashboard built with **React 18** and **AG Grid Community (client-side)**.

## Features

| Feature | Details |
|---|---|
| **AG Grid** | Client-side rendering, sorting, filtering, pagination, CSV export |
| **Quick Search** | Real-time search across all columns via AG Grid's `quickFilterText` |
| **Toolbar Filters** | Department + Status dropdowns pre-filter `rowData` before AG Grid |
| **Column Filters** | Per-column filters (text, number, set, date) via header menus |
| **Custom Renderers** | Name+Avatar, Department badge, Star rating, Salary tier, Skill pills, Projects bar, Date tenure |
| **KPI Cards** | Total employees, avg performance, avg salary, top earner — reactive to active filters |
| **Dept Breakdown** | Animated bar chart showing headcount per department |
| **CSV Export** | One-click export of currently visible rows |
| **Animations** | Staggered page-load reveals, row animations |

## Tech Stack

- React 18
- AG Grid Community v31 (`ag-grid-community` + `ag-grid-react`)
- Pure CSS (no UI library) — DM Serif Display + Outfit + DM Mono
- Create React App

## Setup

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Project Structure

```
src/
  App.js                  # Main dashboard, AG Grid config, filter logic
  index.js                # Entry point
  index.css               # Global styles + AG Grid theme overrides
  data/
    employees.js          # 20-row dataset
  components/
    StatCard.js           # KPI metric card
    DeptBreakdown.js      # Horizontal bar chart by department
    CellRenderers.js      # All AG Grid cell renderer components
```

## Design Decisions

- **Warm editorial palette** (`#f5f3ee` parchment background) — distinguishes from the typical cold-grey SaaS dashboard
- **DM Serif Display** for numerics and headings — gives financial/editorial weight
- **Pinned "Employee" column** so name stays visible on horizontal scroll
- **Toolbar filters** (dept/status) run _before_ AG Grid as a `rowData` memo for clean separation; **quick search** runs _inside_ AG Grid via `quickFilterText`; **column header filters** are AG Grid's native filters — three layers, zero conflicts
- **Reactive KPIs** — stats update when the department or status filter changes, showing relevant averages
