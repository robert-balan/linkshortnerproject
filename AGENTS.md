# Agent Instructions - Link Shortener Project

This file is the entry point for LLM agent coding standards. All agents working on this project **must** adhere to the guidelines defined in this file.

## Project Summary

- **Name:** Link Shortener
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** shadcn/ui + Tailwind CSS v4 + Lucide React icons
- **Auth:** Clerk (`@clerk/nextjs`)
- **Database:** Neon (PostgreSQL) via Drizzle ORM
- **Runtime:** React 19

## Quick Command Reference

| Task             | Command                    |
| ---------------- | -------------------------- |
| Dev server       | `npm run dev`              |
| Build            | `npm run build`            |
| Lint             | `npm run lint`             |
| DB migrations    | `npx drizzle-kit generate` |
| Apply migrations | `npx drizzle-kit migrate`  |
| DB Studio        | `npx drizzle-kit studio`   |

## Key Technical Constraints

Agents **must always** follow these rules without exception:

- Next.js App Router only — no pages directory
- React 19 compatible APIs only
- Tailwind v4 syntax — no v3 `tailwind.config.js` JIT classes
- Drizzle ORM for all database access — no raw SQL queries except within Drizzle's `sql` tag
- Clerk v7 APIs — use `@clerk/nextjs/server` for server-side, hooks for client-side
- `@/*` path alias maps to project root per `tsconfig.json`
- All UI must use shadcn/ui components — do not create custom components
- **NEVER use `middleware.ts`** — it is deprecated in this version of Next.js. Use `proxy.ts` instead for all middleware logic

## Project Structure

| Location         | Purpose                              |
| ---------------- | ------------------------------------ |
| `app/`           | Next.js App Router routes and layout |
| `components/ui/` | shadcn/ui components (do not modify) |
| `db/schema.ts`   | Drizzle ORM schema definitions       |
| `db/index.ts`    | Database client                      |
| `lib/`           | Shared utility functions             |
| `public/`        | Static assets                        |

- Server actions should be colocated in the relevant route folder
- API routes go under `app/api/`
