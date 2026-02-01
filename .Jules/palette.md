## 2024-05-22 - Accessible View Toggles
**Learning:** Icon-only toggle buttons in this codebase often rely on `title` attributes which are insufficient for accessibility.
**Action:** When auditing components, specifically check view toggles for `aria-label`, `aria-pressed`, and proper focus styles (`focus:ring-2`). Use `role="group"` to group related toggles.
