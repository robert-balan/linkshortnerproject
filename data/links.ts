import { db } from '@/db';
import { shortLinks } from '@/db/schema';
import { and, count, desc, eq, gte } from 'drizzle-orm';

export async function getUserLinks(clerkUserId: string) {
  return db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.clerkUserId, clerkUserId))
    .orderBy(desc(shortLinks.createdAt));
}

export async function countRecentLinksByUser(
  clerkUserId: string,
  windowMinutes: number,
): Promise<number> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const [row] = await db
    .select({ value: count() })
    .from(shortLinks)
    .where(
      and(
        eq(shortLinks.clerkUserId, clerkUserId),
        gte(shortLinks.createdAt, since),
      ),
    );
  return row?.value ?? 0;
}

export interface CreateLinkInput {
  clerkUserId: string;
  shortCode: string;
  originalUrl: string;
}

export async function createLink(input: CreateLinkInput) {
  const [link] = await db
    .insert(shortLinks)
    .values({
      clerkUserId: input.clerkUserId,
      shortCode: input.shortCode,
      originalUrl: input.originalUrl,
    })
    .returning();
  return link;
}

export interface UpdateLinkInput {
  id: number;
  clerkUserId: string;
  shortCode: string;
  originalUrl: string;
}

export async function updateLink(input: UpdateLinkInput) {
  const [link] = await db
    .update(shortLinks)
    .set({
      shortCode: input.shortCode,
      originalUrl: input.originalUrl,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(shortLinks.id, input.id),
        eq(shortLinks.clerkUserId, input.clerkUserId),
      ),
    )
    .returning();
  return link;
}

export async function deleteLink(id: number, clerkUserId: string) {
  await db
    .delete(shortLinks)
    .where(and(eq(shortLinks.id, id), eq(shortLinks.clerkUserId, clerkUserId)));
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.shortCode, shortCode))
    .limit(1);
  return link ?? null;
}

export async function shortCodeExists(shortCode: string): Promise<boolean> {
  const [row] = await db
    .select({ id: shortLinks.id })
    .from(shortLinks)
    .where(eq(shortLinks.shortCode, shortCode))
    .limit(1);
  return row != null;
}
