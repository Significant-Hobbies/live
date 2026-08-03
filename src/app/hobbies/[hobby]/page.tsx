import { desc, eq } from 'drizzle-orm';
import { ArrowRight, BookOpen, Compass, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HobbyRoadmapCard } from '~/components/hobby-roadmap-card';
import { JsonLd } from '~/components/json-ld';
import { Badge } from '~/components/ui/badge';
import { timelines, users } from '~/db/schema';
import { getEditorialArticlesForHobby } from '~/lib/editorial-content';
import { journeysForHobby } from '~/lib/famous-journeys';
import { getCategoryForHobby, HOBBY_CATEGORIES } from '~/lib/hobbies';
import { getRelatedHobbies } from '~/lib/hobby-affinities';
import { getResourcesForHobby } from '~/lib/hobby-resources';
import { getRoadmapForHobby } from '~/lib/hobby-roadmap';
import { safeDecodeURIComponent } from '~/lib/slug';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '~/lib/site-metadata';
import { getTimelineUrl } from '~/lib/timeline-url';
import type { Phase } from '~/lib/types';
import { parseJSONColumn } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';

interface Props {
  params: Promise<{ hobby: string }>;
}

function slugToHobby(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export const revalidate = 3600; // 1 hour ISR
export const dynamicParams = false;

const CATEGORY_COLORS: Record<string, string> = {
  Creative: 'bg-[#c5abfa]',
  Music: 'bg-[#f2a4bc]',
  Physical: 'bg-[#b5d98f]',
  Intellectual: 'bg-[#b9dcf5]',
  Gaming: 'bg-[#ff9d7d]',
  Outdoor: 'bg-[#b5d98f]',
  Culinary: 'bg-[#f7c36f]',
  Collecting: 'bg-[#c5abfa]',
  Making: 'bg-[#ff9d7d]',
  Social: 'bg-[#b9dcf5]',
};

export async function generateStaticParams() {
  return HOBBY_CATEGORIES.flatMap((c) =>
    c.hobbies.map((h) => ({
      hobby: h.toLowerCase().replace(/\s+/g, '-'),
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { hobby } = await params;
  const decoded = safeDecodeURIComponent(hobby);
  if (!decoded) return {};
  const name = slugToHobby(decoded);
  const canonical = `${SITE_URL}/hobbies/${encodeURIComponent(decoded)}`;
  const description = `Explore ${name} — see community timelines, find tools and resources, and discover related hobbies on Significant Hobbies.`;
  return {
    title: { absolute: `${name}: roadmap, resources, and ideas` },
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name}: roadmap, resources, and ideas`,
      description,
      url: canonical,
      images: [{ url: DEFAULT_SOCIAL_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name}: roadmap, resources, and ideas`,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export default async function HobbyDetailPage({ params }: Props) {
  const { hobby: hobbySlug } = await params;
  const decoded = safeDecodeURIComponent(hobbySlug);
  if (!decoded) notFound();
  const hobbyName = slugToHobby(decoded);

  const category = getCategoryForHobby(hobbyName);
  if (!category) notFound();

  const session = await getServerAuthSession();
  const isLoggedIn = !!session?.user;

  // Find public timelines that include this hobby
  const rawTimelines = await loadRecentPublicTimelines();

  const matchingTimelines = rawTimelines.filter((t) => {
    const phases = parseJSONColumn<Phase[]>(t.phases, [], 'hobby-detail:filter:phases');
    return phases.some((p) =>
      p.hobbies.some((h) => h.name.toLowerCase() === hobbyName.toLowerCase())
    );
  });

  const popularityCount = matchingTimelines.length;

  const otherHobbies = category.hobbies.filter((h) => h.toLowerCase() !== hobbyName.toLowerCase());

  const resources = getResourcesForHobby(hobbyName);
  const roadmap = getRoadmapForHobby(hobbyName);
  const crossCategoryHobbies = getRelatedHobbies(hobbyName);

  const relatedPosts = getEditorialArticlesForHobby(hobbyName);
  const mentions = journeysForHobby(hobbyName);

  const categoryImage = `/categories/${category.name.toLowerCase()}-1200.webp`;
  const categoryColor = CATEGORY_COLORS[category.name] ?? 'bg-[#f7e957]';

  return (
    <main className="bg-[#fbf8ef] pb-20 text-[#211e18]">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Hobbies',
              item: 'https://significanthobbies.com/hobbies',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: hobbyName,
              item: `https://significanthobbies.com/hobbies/${hobbySlug}`,
            },
          ],
        }}
      />
      <section className="px-4 pb-10 pt-6 sm:pb-14 sm:pt-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-[0_22px_60px_rgba(65,55,28,0.14)]">
          <div className="grid min-h-[34rem] lg:grid-cols-[1.08fr_0.92fr]">
            <div className={`${categoryColor} flex flex-col justify-between p-7 sm:p-10 lg:p-14`}>
              <Link
                href="/hobbies"
                className="inline-flex w-fit items-center gap-2 text-sm font-bold hover:underline"
              >
                <Compass className="size-4" /> All hobbies
              </Link>

              <div className="my-14 max-w-3xl">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em]">
                  {category.emoji} {category.name}
                </p>
                <h1 className="font-serif text-6xl font-medium leading-[0.88] tracking-[-0.045em] text-balance sm:text-8xl">
                  {hobbyName}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#39352d]">
                  You do not need a five-year plan. You need one honest beginning and enough
                  curiosity to return tomorrow.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/timeline/new"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#211e18] px-6 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Begin this hobby <ArrowRight className="size-4" />
                </Link>
                <span className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white/55 px-4 text-sm font-semibold">
                  <Users className="size-4" />
                  {popularityCount === 0
                    ? 'Be the first public story'
                    : `${popularityCount} public ${popularityCount === 1 ? 'story' : 'stories'}`}
                </span>
              </div>
            </div>

            <div className="relative min-h-80 lg:min-h-full">
              <Image
                src={categoryImage}
                alt={`${category.name} hobbies in motion`}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211e18]/35 via-transparent to-transparent" />
              <p className="absolute bottom-7 left-7 right-7 max-w-md font-serif text-2xl leading-tight text-white drop-shadow-sm sm:bottom-10 sm:left-10">
                Start small enough that beginning feels almost obvious.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        {!isLoggedIn && (
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-[#f7e957] px-6 py-5 sm:flex-row sm:items-center">
            <p className="font-serif text-xl">
              Keep your {hobbyName.toLowerCase()} story private on this device.
            </p>
            <Link href="/timeline/new" className="shrink-0 text-sm font-bold hover:underline">
              Build a timeline →
            </Link>
          </div>
        )}

        {/* Roadmap: concrete next-step path from today → 3 months */}
        <div className="mb-12">
          <HobbyRoadmapCard roadmap={roadmap} />
        </div>

        {/* Resources */}
        {resources.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-serif text-3xl font-medium">
              Tools & resources for {hobbyName}
            </h2>
            <div className="space-y-3">
              {resources.map((r, i) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 rounded-2xl border border-[#d8d0bd] bg-white transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    i === 0 ? 'p-5' : 'px-5 py-3'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-foreground group-hover:text-foreground transition-colors ${i === 0 ? 'text-base' : 'text-sm'}`}
                      >
                        {r.name}
                      </span>
                      {r.type === 'own' && (
                        <span className="rounded-full bg-foreground/10 border border-foreground/20 px-2 py-0.5 text-[10px] font-medium text-foreground">
                          by SignificantHobbies
                        </span>
                      )}
                      {r.type === 'sponsored' && (
                        <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-medium text-foreground">
                          sponsored
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-muted-foreground ${i === 0 ? 'text-sm mt-0.5' : 'text-xs'}`}
                    >
                      {r.description}
                    </p>
                  </div>
                  <span className="text-subtle group-hover:text-foreground transition-colors text-sm">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Who else picked this up.
          famous-journeys.ts is the largest content file in the repo and its
          only inbound link was from /hobbies, which is not in the nav — two
          hops from anywhere and effectively invisible. Each of these 122 pages
          is now a door into it, and a named person who did the thing is a
          better argument than any feature copy. */}
        {mentions.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-serif text-3xl font-medium">Who else picked this up</h2>
            <ul className="divide-y divide-border border-border border-t">
              {mentions.map((m) => (
                <li key={m.slug} className="py-3">
                  <Link
                    href={`/journeys/${m.slug}`}
                    prefetch={false}
                    className="text-base text-foreground underline underline-offset-4"
                  >
                    {m.emoji} {m.name}
                  </Link>
                  <span className="text-base text-muted-foreground">
                    {' '}
                    — {m.phase.toLowerCase()}
                    {m.as.toLowerCase() !== hobbyName.toLowerCase() ? `, as “${m.as}”` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-3xl font-medium">
              <BookOpen className="size-6" /> Related reading
            </h2>
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} prefetch={false}>
                  <div className="group rounded-2xl bg-[#b9dcf5] p-5 transition-transform hover:-translate-y-0.5">
                    <h3 className="font-medium text-foreground group-hover:text-foreground transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{post.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Community timelines */}
        <section className="mb-12">
          <h2 className="mb-4 font-serif text-3xl font-medium">
            Community timelines featuring {hobbyName}
          </h2>
          {matchingTimelines.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {matchingTimelines.map((t) => {
                const phases = parseJSONColumn<Phase[]>(t.phases, [], 'hobby-detail:render:phases');
                const totalHobbies = new Set(phases.flatMap((p) => p.hobbies.map((h) => h.name)))
                  .size;
                return (
                  <Link
                    key={t.id}
                    href={getTimelineUrl({
                      id: t.id,
                      slug: t.slug,
                      user: t.userUsername ? { username: t.userUsername } : null,
                    })}
                    prefetch={false}
                  >
                    <div className="group rounded-2xl border border-[#d8d0bd] bg-white p-5 transition-transform hover:-translate-y-0.5">
                      <h3 className="font-medium text-foreground group-hover:text-foreground transition-colors">
                        {t.title ?? 'Hobby Timeline'}
                      </h3>
                      {t.userName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          @{t.userUsername ?? t.userName}
                        </p>
                      )}
                      <p className="text-xs text-subtle mt-1.5">
                        {phases.length} phases · {totalHobbies} hobbies
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#f2a4bc] p-8 text-center">
              <p className="text-[#49333a]">No public timelines feature {hobbyName} yet.</p>
              <Link href="/timeline/new">
                <button className="mt-3 text-sm text-foreground hover:text-foreground">
                  Be the first →
                </button>
              </Link>
            </div>
          )}
        </section>

        {/* Related hobbies in same category */}
        {otherHobbies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-serif text-3xl font-medium">
              Other {category.name.toLowerCase()} hobbies
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherHobbies.map((h) => (
                <Link
                  key={h}
                  href={`/hobbies/${encodeURIComponent(h.toLowerCase().replace(/\s+/g, '-'))}`}
                  prefetch={false}
                >
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground cursor-pointer transition-colors"
                  >
                    {h}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cross-category related hobbies */}
        {crossCategoryHobbies.length > 0 && (
          <section>
            <h2 className="mb-1 font-serif text-3xl font-medium">You might also like</h2>
            <p className="mb-4 text-xs text-subtle">
              Hobbies people pair with {hobbyName.toLowerCase()}, often from a completely different
              direction.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {crossCategoryHobbies.map((affinity) => {
                const affinityCategory = getCategoryForHobby(affinity.name);
                const slug = affinity.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={affinity.name}
                    href={`/hobbies/${encodeURIComponent(slug)}`}
                    className="block h-full"
                    prefetch={false}
                  >
                    <div className="h-full rounded-2xl bg-[#c5abfa] p-5 transition-transform hover:-translate-y-0.5">
                      <div className="mb-1">
                        <span className="font-semibold text-foreground text-sm group-hover:text-foreground transition-colors">
                          {affinity.name}
                        </span>
                        {affinityCategory && (
                          <span className="ml-2 text-xs text-[#3f3747]">
                            {affinityCategory.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#3f3747]">{affinity.reason}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

async function loadRecentPublicTimelines() {
  try {
    return await db
      .select({
        id: timelines.id,
        title: timelines.title,
        slug: timelines.slug,
        phases: timelines.phases,
        updatedAt: timelines.updatedAt,
        userName: users.name,
        userUsername: users.username,
      })
      .from(timelines)
      .leftJoin(users, eq(timelines.userId, users.id))
      .where(eq(timelines.visibility, 'PUBLIC'))
      .orderBy(desc(timelines.updatedAt))
      .limit(50);
  } catch (error) {
    console.error('[hobby-detail] public timeline query failed', error);
    return [];
  }
}
