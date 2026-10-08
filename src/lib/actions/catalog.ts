'use server';

import { z } from 'zod';
import { EXPERIENCE_CATEGORIES } from '~/lib/experiences';
import { normalizeCatalogTitle } from '~/lib/catalog-seed';
import { getServerAuthSession } from '~/server/auth';
import { catalogDatabase } from '~/server/experience-catalog';
import { submitStoredCatalogIdea } from '~/server/catalog-store';

const submissionSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.enum(EXPERIENCE_CATEGORIES),
});

export async function submitCatalogIdea(input: { title: string; category: string }) {
  const session = await getServerAuthSession();
  if (!session?.user.id) throw new Error('Sign in to submit an idea for review.');
  const parsed = submissionSchema.parse(input);
  if (!normalizeCatalogTitle(parsed.title)) throw new Error('Give your idea a title.');
  try {
    return await submitStoredCatalogIdea(
      catalogDatabase(),
      session.user.id,
      parsed.title,
      parsed.category
    );
  } catch (error) {
    if (
      error instanceof Error &&
      /no such table: (ExperienceCatalog|CatalogSubmission)/.test(error.message)
    ) {
      throw new Error('Shared submissions are not set up yet. Your private list is unchanged.');
    }
    throw error;
  }
}
