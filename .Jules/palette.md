## 2026-02-05 - Accessible Disabled Tooltips
**Learning:** Disabled UI elements that convey information (like "Coming Soon") must be keyboard accessible. By default, disabled elements are removed from tab order.
**Action:** Use `tabIndex={0}`, `role="button"`, and `aria-disabled="true"` instead of just `disabled`. Ensure tooltips appear on `focus` as well as `hover`.
