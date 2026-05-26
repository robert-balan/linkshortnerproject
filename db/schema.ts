import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const shortLinks = pgTable(
  'short_links',
  {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull(),
    shortCode: varchar('short_code', { length: 64 }).notNull().unique(),
    originalUrl: varchar('original_url', { length: 2048 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('short_links_short_code_idx').on(table.shortCode),
    index('short_links_clerk_user_id_created_at_idx').on(
      table.clerkUserId,
      table.createdAt,
    ),
  ],
);
