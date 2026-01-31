## 2026-01-31 - Accessibility of Interactive Elements
**Learning:** Found a pattern of interactive elements (icon-only buttons) relying solely on `title` attributes for explanation, which is insufficient for screen readers. Also, decorative icons inside these buttons were not hidden from assistive technology.
**Action:** Always pair `title` with `aria-label` for icon-only buttons, and apply `aria-hidden="true"` to decorative icons to prevent redundant or confusing announcements.
