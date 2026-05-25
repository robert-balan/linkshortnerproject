# Agent Instructions - Link Shortener Project

This file is the entry point for LLM agent coding standards. All agents working on this project **must** adhere to the guidelines defined in this file and the referenced documentation.

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

## Coding Standards Documentation

> **CRITICAL — MANDATORY STEP:** You **MUST** read the relevant file(s) from the `/docs` directory **BEFORE writing a single line of code**. This is non-negotiable. Skipping this step will result in incorrect, non-compliant code. There are no exceptions.

Full coding standards are located in the `/docs` directory. Use the table below to identify which file applies to your task, then read it in full before proceeding. If no relevant doc exists for the task, proceed using the Key Technical Constraints section.

| Topic          | File            |
| -------------- | --------------- |
| Authentication | `/docs/auth.md` |
| UI Components  | `/docs/ui.md`   |

**Do not assume you already know the conventions. Always read the file.**

## Key Technical Constraints

Agents **must always** follow these rules without exception:

- Next.js App Router only — no pages directory
- React 19 compatible APIs only
- Tailwind v4 syntax — no v3 `tailwind.config.js` JIT classes
- Drizzle ORM for all database access — no raw SQL queries except within Drizzle's `sql` tag
- Clerk v7 APIs — use `@clerk/nextjs/server` for server-side, hooks for client-side
- `@/*` path alias maps to project root per `tsconfig.json`
- All UI must use shadcn/ui components — do not create custom components

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
