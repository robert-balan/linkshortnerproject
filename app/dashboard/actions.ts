'use server';

import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';

/**
 * Derives a shortcode from the URL's domain and path segments.
 * - Max 12 characters total
 * - Words separated by `-`
 * - Always appends a 3-character random suffix (e.g. `-a3x`) to avoid collisions
 * - Falls back to a random nanoid(8) if the URL yields nothing usable
 */
function generateShortCode(url: string): string {
  // 3-char random suffix using lowercase alphanumeric only
  const suffix =
    '-' +
    nanoid(3)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, 'x');

  // URL-derived slug can use at most 12 - suffix.length (= 8) characters
  const maxSlugLength = 12 - suffix.length;

  try {
    const parsed = new URL(url);
    const parts: string[] = [];

    // Domain without www. prefix, first label only (no TLD)
    const hostname = parsed.hostname.replace(/^www\./, '');
    const domain = hostname
      .split('.')[0]
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase();
    if (domain) parts.push(domain);

    // Cleaned path segments
    const pathSegments = parsed.pathname
      .split('/')
      .filter(Boolean)
      .map((seg) => seg.replace(/[^a-z0-9]/gi, '').toLowerCase())
      .filter((s) => s.length > 0);

    parts.push(...pathSegments);

    // Build slug up to maxSlugLength chars, words joined by -
    let slug = '';
    for (const part of parts) {
      if (slug === '') {
        slug = part.slice(0, maxSlugLength);
      } else {
        const remaining = maxSlugLength - slug.length - 1; // 1 for the dash
        if (remaining >= 2) {
          slug += '-' + part.slice(0, remaining);
        } else {
          break;
        }
      }
    }

    if (slug.length >= 2) return slug + suffix;
  } catch {
    // malformed URL — fall through to random
  }

  return nanoid(8);
}
import {
  countRecentLinksByUser,
  createLink,
  deleteLink,
  shortCodeExists,
  updateLink,
} from '@/data/links';

const RATE_LIMIT_MAX = 20; // max links per user per hour

/**
 * Returns true when the URL's hostname resolves to a private, loopback,
 * link-local, or otherwise non-routable address. Such destinations must
 * be rejected to prevent the service being used to redirect users to
 * internal network resources.
 */
function isPrivateOrReservedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);

    // Loopback / unspecified hostnames
    if (
      hostname === 'localhost' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      return true;
    }

    // IPv4 private/reserved ranges
    const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4) {
      const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
      // 0.x.x.x, 10.x.x.x, 127.x.x.x
      if (a === 0 || a === 10 || a === 127) return true;
      // 169.254.x.x (link-local)
      if (a === 169 && b === 254) return true;
      // 172.16.x.x – 172.31.x.x
      if (a === 172 && b >= 16 && b <= 31) return true;
      // 192.168.x.x
      if (a === 192 && b === 168) return true;
    }

    return false;
  } catch {
    return true; // treat unparseable URLs as blocked
  }
}

const urlField = z
  .string()
  .url('Please enter a valid URL')
  .max(2048, 'URL must be 2048 characters or fewer')
  .refine(
    (url) => {
      try {
        const { protocol } = new URL(url);
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Only http and https URLs are allowed' },
  )
  .refine((url) => !isPrivateOrReservedUrl(url), {
    message: 'URLs pointing to private or reserved addresses are not allowed',
  });

const createLinkSchema = z.object({
  originalUrl: urlField,
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
  originalUrl: urlField,
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

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<{ success: true; shortCode: string } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const result = createLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  // Rate limiting: max RATE_LIMIT_MAX links created per user in the last hour
  try {
    const recentCount = await countRecentLinksByUser(userId, 60);
    if (recentCount >= RATE_LIMIT_MAX) {
      return {
        error: 'Rate limit exceeded. Please wait before creating more links.',
      };
    }
  } catch (err) {
    console.error('[createLinkAction] rate limit check failed:', err);
  }

  let shortCode: string;

  if (result.data.shortCode) {
    // Custom short code: reject immediately if already taken
    if (await shortCodeExists(result.data.shortCode)) {
      return {
        error:
          'That short code is already taken. Please choose a different one.',
      };
    }
    shortCode = result.data.shortCode;
  } else {
    // Auto-generated: retry until a unique code is found (max 5 attempts)
    let attempts = 0;
    do {
      shortCode = generateShortCode(result.data.originalUrl);
      attempts++;
      if (attempts > 5) {
        return {
          error: 'Failed to generate a unique short code. Please try again.',
        };
      }
    } while (await shortCodeExists(shortCode));
  }

  try {
    await createLink({
      clerkUserId: userId,
      shortCode,
      originalUrl: result.data.originalUrl,
    });
    return { success: true, shortCode };
  } catch (err) {
    console.error('[createLinkAction] failed to create link:', err);
    return { error: 'Failed to create link. Please try again.' };
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
  } catch (err) {
    console.error('[updateLinkAction] failed to update link:', err);
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
  } catch (err) {
    console.error('[deleteLinkAction] failed to delete link:', err);
    return { error: 'Failed to delete link.' };
  }
}
