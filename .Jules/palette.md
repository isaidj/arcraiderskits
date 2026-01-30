## 2025-02-17 - Implicit Labels via Placeholders
**Learning:** Components like `SearchBar` were relying solely on `placeholder` attributes for context, which is insufficient for screen readers and disappears on input.
**Action:** Always add `aria-label` props to input components that lack visible labels, defaulting to the placeholder text if no specific label is provided.
