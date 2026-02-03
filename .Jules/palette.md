## 2026-02-03 - Accessible Disabled Tooltips
**Learning:** Disabled elements using `div` with `opacity-50` are invisible to keyboard users and screen readers unless explicitly made accessible.
**Action:** Always add `tabIndex={0}`, `role="button"`, and `aria-disabled="true"` to disabled interactive elements, and ensure tooltips appear on focus (using `group-focus-within` or similar).
