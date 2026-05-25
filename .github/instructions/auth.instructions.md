---
description: Read this before implementing or modifying authentification in the project.
---

# Authentication — Clerk

This document provides specific guidlines for implementing authentication in this project using Clerk. All auth-related code must adhere to these rules to ensure consistency, security, and maintainability across the codebase.

## Overview

All authentication in this project is handled exclusively by **Clerk** (`@clerk/nextjs`). No other auth libraries, custom JWT logic, or session handling are permitted.

## Non-Negotiable Rules

- **Never** implement custom authentication. Clerk is the only auth provider.
- **Never** use cookies, JWTs, or sessions outside of Clerk's managed APIs.
- Use `@clerk/nextjs/server` for all server-side auth (Server Components, Server Actions, Route Handlers).
- Use Clerk's React hooks (`useUser`, `useAuth`, `useClerk`) for all client-side auth.

## Route Protection

### `/dashboard` — Protected Route

The `/dashboard` page **must** require the user to be signed in. Enforce this in `proxy.ts` using Clerk's `clerkMiddleware` with `createRouteMatcher`:

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

### Homepage Redirect for Signed-In Users

If an authenticated user visits `/`, they must be redirected to `/dashboard`. Handle this in the `/` page (Server Component):

```ts
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');
  // ... render landing page
}
```

## Sign In / Sign Up — Modal Mode Only

Clerk's `<SignIn>` and `<SignUp>` components must **always** be launched as a modal — never as a dedicated page route.

- Set `signInUrl` and `signUpUrl` in `clerkMiddleware` or `ClerkProvider` config to point to the current page using modal mode (e.g. via `?sign-in=true` query param or Clerk's built-in modal props).
- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` for all trigger buttons.

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign Up</button>
</SignUpButton>
```

- Do **not** create `app/sign-in/` or `app/sign-up/` page routes.

## Server-Side Auth Helpers

| Use Case                      | API                                          |
| ----------------------------- | -------------------------------------------- |
| Get current user (server)     | `auth()` from `@clerk/nextjs/server`         |
| Protect a route (server)      | `auth.protect()` from `@clerk/nextjs/server` |
| Get full user object (server) | `currentUser()` from `@clerk/nextjs/server`  |
| Get userId in a Server Action | `auth()` — check `userId` before acting      |

## Client-Side Auth Helpers

| Use Case                   | Hook/Component               |
| -------------------------- | ---------------------------- |
| Check signed-in status     | `useAuth()`                  |
| Access user object         | `useUser()`                  |
| Sign out                   | `useClerk().signOut()`       |
| Render based on auth state | `<SignedIn>` / `<SignedOut>` |
