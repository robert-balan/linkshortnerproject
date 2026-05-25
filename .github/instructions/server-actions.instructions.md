---
description: Read this file before creating or modifying server actions for data mutations in the project.
---

# Server Actions instructions

## General Rule

- **All data mutations** (create, update, delete) must go through Next.js server actions — no exceptions

## File Conventions

- Every `actions.ts` must begin with `"use server"` (Next.js App Router requirement)
- Files **must** be named `actions.ts` and colocated in the same directory as the client component that calls them

## Client-Server Boundary

- Server actions **MUST** be called from client components
- Add `"use server"` directive at the top of action files
- Add `"use client"` directive at the top of any component calling server actions

## Type Safety

- All parameters must have explicit TypeScript types — define an interface or type for each action's input
- **Never** use the `FormData` type as a parameter type

## Validation

- Use **Zod** to validate all input data before any processing or DB access
- Parse with `.safeParse()` and return early on failure

```ts
const schema = z.object({ url: z.string().url() });

const result = schema.safeParse(input);
if (!result.success) return { error: 'Invalid input' };
```

## Authentication

- Check for a logged-in Clerk user **before** anything else
- Return an error immediately if no user is found — never reach DB code unauthenticated

```ts
const { userId } = await auth();
if (!userId) return { error: 'Unauthorized' };
```

## Error Handling

- Server actions must **never** throw errors
- Always return a typed result object with either a `success` or `error` property

```ts
// ✅ Correct
return { success: true };
return { error: 'Something went wrong' };

// ❌ Wrong
throw new Error('Something went wrong');
```

## Database Access

- **Never** use Drizzle queries directly in server actions
- All DB operations must call helper functions from the `/data` directory

```ts
// ✅ Correct
import { createLink } from "@/data/links";
await createLink({ userId, url: result.data.url });

// ❌ Wrong — no direct Drizzle in actions.ts
await db.insert(links).values({ ... });
```

---

## Checklist

Before committing any server action, verify:

- [ ] File is named `actions.ts` and starts with `"use server"`
- [ ] Input has a TypeScript type (not `FormData`)
- [ ] Input is validated with Zod using `.safeParse()`
- [ ] Auth check is the first operation
- [ ] Returns `{ success }` or `{ error }` — never throws exceptions
- [ ] No Drizzle queries — only `/data` helper functions used
