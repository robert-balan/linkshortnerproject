# UI Standards

## Library

All UI elements **must** use [shadcn/ui](https://ui.shadcn.com/) components. Do **not** create custom components.

## Rules

- **Always** use shadcn/ui components for any UI element (buttons, inputs, dialogs, cards, etc.)
- **Never** build custom UI components from scratch — if a shadcn/ui component exists for the use case, use it
- Install new shadcn/ui components via `npx shadcn@latest add <component>`
- Installed components live in `components/ui/` — do not modify them directly
- Compose complex UIs by combining shadcn/ui primitives, not by writing custom markup
- Use Lucide React icons (already bundled with shadcn/ui) for all iconography

## Tailwind

- Use Tailwind CSS v4 utility classes for layout and spacing adjustments on top of shadcn/ui components
- Do not override shadcn/ui component internals with arbitrary Tailwind classes unless absolutely necessary
