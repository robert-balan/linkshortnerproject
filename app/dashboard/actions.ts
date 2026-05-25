'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { createLink, deleteLink, updateLink } from '@/data/links';

const createLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(1)
    .max(64)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Only letters, numbers, hyphens and underscores are allowed',
    )
    .optional(),
});

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z
    .string()
    .min(1)
    .max(64)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Only letters, numbers, hyphens and underscores are allowed',
    ),
});

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

export interface CreateLinkInput {
  originalUrl: string;
  shortCode?: string;
}

export interface UpdateLinkInput {
  id: number;
  originalUrl: string;
  shortCode: string;
}

export interface DeleteLinkInput {
  id: number;
}

function generateShortCode(url: string): string {
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^www\./, '');
  const pathParts = parsed.pathname.split('/').filter(Boolean);
  const parts = [host, ...pathParts].join('-');
  return parts
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 12)
    .replace(/-$/, '');
}

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<{ success: true; shortCode: string } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const result = createLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const shortCode =
    result.data.shortCode || generateShortCode(result.data.originalUrl);

  try {
    await createLink({
      clerkUserId: userId,
      shortCode,
      originalUrl: result.data.originalUrl,
    });
    return { success: true, shortCode };
  } catch {
    return {
      error: 'Failed to create link. The short code may already be taken.',
    };
  }
}

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const result = updateLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const updated = await updateLink({
      id: result.data.id,
      clerkUserId: userId,
      shortCode: result.data.shortCode,
      originalUrl: result.data.originalUrl,
    });
    if (!updated)
      return {
        error: 'Link not found or you do not have permission to edit it.',
      };
    return { success: true };
  } catch {
    return {
      error: 'Failed to update link. The short code may already be taken.',
    };
  }
}

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const result = deleteLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await deleteLink(result.data.id, userId);
    return { success: true };
  } catch {
    return { error: 'Failed to delete link.' };
  }
}
