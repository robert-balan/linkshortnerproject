## Plan: Strict Minimal Link Storage Schema

Define a single Drizzle table with exactly the required fields only: createdAt, updatedAt, clerkUserId, shortCode, and url. Use timezone-aware timestamps in PostgreSQL, no click tracking fields, and no soft-delete columns. Deletes will physically remove rows.

**Steps**

1. Create one table in db/schema.ts named short_links with only five columns:

- clerkUserId (text/varchar, not null)
- shortCode (varchar, not null)
- url (text, not null)
- createdAt (timestamp with time zone, not null, default now)
- updatedAt (timestamp with time zone, not null, default now)

2. Enforce uniqueness and lookup performance:

- Make shortCode unique.
- Add index on shortCode for redirect resolution.
- Add index on clerkUserId + createdAt for user dashboard ordering.

3. Set timezone behavior explicitly in Drizzle types by using PostgreSQL timestamp with timezone.
4. Keep deletion semantics hard-delete only:

- Do not add deletedAt.
- Do not add isDeleted.

5. Generate and inspect migration output, then apply migration.

**Relevant files**

- /Users/2033943/Documents/Repozitories/linkshortnerproject/db/schema.ts — define short_links table, constraints, indexes.
- /Users/2033943/Documents/Repozitories/linkshortnerproject/db/index.ts — unchanged, existing db client remains valid.

**Verification**

1. Run npx drizzle-kit generate and verify migration contains only the five required columns.
2. Confirm created_at and updated_at are generated as timestamp with time zone.
3. Confirm short_code unique constraint and expected indexes are present.
4. Run npx drizzle-kit migrate and verify successful apply.
5. In DB studio, insert and delete a record to confirm hard delete behavior (row removed, no soft-delete fields involved).

**Decisions**

- Included scope: strict five-field schema only.
- Primary key choice: shortCode is the primary key.
- Excluded scope: id column, click count/events, expiration, title, tags, soft delete.
- Ownership model: required Clerk user id per row.
- Time policy: all date columns must be timezone-aware.

**Further Considerations**

1. Primary key choice recommendation: either make shortCode the primary key for maximum minimalism, or add a separate id only if future integrations need stable immutable row ids.
2. updatedAt maintenance recommendation: update this field in write paths (or DB trigger) so it always reflects last modification time.
