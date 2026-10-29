import { renderPublicExploreSource } from './public-editorial-source';
import { renderPublicExperiencesSource } from './public-editorial-source';
import { renderPublicSearchSource } from './public-editorial-source';
import { randomHobbyMessage } from './public-button-copy';
import { renderPublicBlogSource } from './public-editorial-source';
import { renderPublicHobbySource, renderPublicCategorySource } from './public-editorial-source';
import {
  renderPublicExperienceSource,
  renderPublicBucketListSource,
  renderPublicCollectionSource,
} from './public-editorial-source';
import { and, desc, eq } from 'drizzle-orm';
import { renderPublicEditorialSource, renderPublicJourneySource } from './public-editorial-source';
import { publicHomeMarkdown } from './public-home-source';

import { timelines, users } from '~/db/schema';
import { parseJSONColumn } from '~/lib/utils';
import { db } from '~/server/db';
import type { Phase } from '~/lib/types';

const SITE_URL = 'https://significanthobbies.com';

export async function renderPublicRouteMarkdown(pathname: string): Promise<string | null> {
  const path = normalizePath(pathname);
  const source = `${SITE_URL}${path === '/' ? '' : path}`;

  if (path === '/') return publicHomeMarkdown();
  if (path === '/search') return renderPublicSearchSource();
  if (path === '/hobbies/random') return page('Random hobby', source, randomHobbyMessage);
  const editorial = renderPublicEditorialSource(path);
  if (editorial) return editorial;

  if (path === '/explore') return renderPublicExploreSource();
  if (path === '/experiences') return renderPublicExperiencesSource();

  const categoryMatch = path.match(/^\/hobbies\/category\/([^/]+)$/);
  if (categoryMatch) return renderPublicCategorySource(categoryMatch[1]!);

  const hobbyMatch = path.match(/^\/hobbies\/([^/]+)$/);
  if (hobbyMatch) return renderPublicHobbySource(hobbyMatch[1]!);

  const collectionMatch = path.match(/^\/experiences\/collections\/([^/]+)$/);
  if (collectionMatch) return renderPublicCollectionSource(collectionMatch[1]!);

  const experienceMatch = path.match(/^\/experiences\/([^/]+)$/);
  if (experienceMatch) return renderPublicExperienceSource(experienceMatch[1]!);

  const journeyMatch = path.match(/^\/journeys\/([^/]+)$/);
  if (journeyMatch) return renderPublicJourneySource(journeyMatch[1]!);

  const bucketListMatch = path.match(/^\/bucket-lists\/([^/]+)$/);
  if (bucketListMatch) return renderPublicBucketListSource(bucketListMatch[1]!);

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return renderPublicBlogSource(blogMatch[1]!);

  const profileMatch = path.match(/^\/u\/([^/]+)$/);
  if (profileMatch) return renderPublicProfile(profileMatch[1]!, source);

  return null;
}

async function renderPublicProfile(rawUsername: string, source: string) {
  try {
    const username = decodeURIComponent(rawUsername);
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
      columns: { id: true, name: true, username: true, bio: true, website: true, creed: true },
    });
    if (!user?.username) return null;
    const rows = await db
      .select({ title: timelines.title, slug: timelines.slug, phases: timelines.phases })
      .from(timelines)
      .where(and(eq(timelines.userId, user.id), eq(timelines.visibility, 'PUBLIC')))
      .orderBy(desc(timelines.updatedAt));
    if (rows.length === 0) return null;
    const sections = rows.map((row) => {
      const phases = parseJSONColumn<Phase[]>(row.phases, [], `agent-profile:${user.id}`);
      return `## ${plain(row.title ?? 'Untitled timeline')}\n\n${phases
        .map(
          (phase) =>
            `### ${plain(phase.label)}\n\n${phase.hobbies.map((hobby) => `- ${plain(hobby.name)}`).join('\n')}`
        )
        .join('\n\n')}`;
    });
    const summary = [user.bio, user.creed]
      .filter((value): value is string => Boolean(value))
      .map(plain)
      .join(' ');
    return page(
      user.name ? `${plain(user.name)} (@${user.username})` : `@${user.username}`,
      source,
      summary || 'An opt-in public Significant Hobbies profile.',
      sections,
      false
    );
  } catch {
    return null;
  }
}

function page(
  title: string,
  source: string,
  summary: string,
  items: string[] = [],
  listItems = true
) {
  const content = items
    .filter(Boolean)
    .map((item) => (listItems ? `- ${item}` : item))
    .join('\n\n');
  return `# ${plain(title)}\n\n> Source: ${source}\n\n${plain(summary)}${content ? `\n\n${content}` : ''}\n`;
}

function plain(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  return `/${pathname}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
}
