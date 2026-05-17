## 2024-05-22 - Accessibility in Filter Components
**Learning:** Found a pattern of icon-only toggle buttons using `title` for tooltips but lacking `aria-label` and `aria-pressed` states. Also, loading states were purely visual ("...").
**Action:** When working on filter components, always check for programmatic state indicators (`aria-pressed`, `aria-checked`) and ensure loading states use `role="status"` or `aria-live` regions.
