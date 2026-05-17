## 2024-05-22 - Radix UI Popover Focus Management
**Learning:** Radix UI Popover automatically manages focus on open. When adding custom `onFocus` triggers to elements (like a list of items) to open the popover, Radix's default behavior is to move focus *into* the popover content. This disrupts the natural tab flow of the list.
**Action:** Use `onOpenAutoFocus={(e) => e.preventDefault()}` on `PopoverContent` when triggering popovers via focus on list items, ensuring the user can continue tabbing through the list while the popover remains open.
