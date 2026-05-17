## 2024-05-22 - Accessible Search and Keyboard Shortcuts

**Learning:** Search inputs are critical navigation tools but often lack accessibility labels and power-user features. Combining `aria-label` with a standard keyboard shortcut (Cmd+K) and a visual hint improves both accessibility (for screen readers) and efficiency (for keyboard users).

**Action:** When implementing search components, always:
1. Ensure the input has a descriptive `aria-label`.
2. specific icons as `aria-hidden="true"` if decorative.
3. Consider adding a `Cmd+K` / `Ctrl+K` shortcut with a visual hint to teach users the interaction.
