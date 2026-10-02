import Link from 'next/link';

import {
  CardHoverEffect,
  FadeIn,
  GridBackground,
  SpotlightCard,
  StaggerContainer,
  StaggerItem,
} from '~/components/aceternity';
import { Whale } from '~/components/whale';
import { getBucketListCategoryStyle } from '~/lib/bucket-list-category-styles';
import { EXPERIENCE_ENTRIES, EXPERIENCES_BY_CATEGORY } from '~/lib/experiences';
import { experienceMetadata } from '~/lib/experience-seo';
import { FAMOUS_BUCKET_LISTS } from '~/lib/famous-bucket-lists';

// The corpus moved to ~/lib/experiences so the suggestion engine and any
// future surface can read it. This page renders it; it no longer owns it.
const IDEAS_BY_CATEGORY = EXPERIENCES_BY_CATEGORY;
const totalIdeas = Object.values(IDEAS_BY_CATEGORY).reduce((sum, cat) => sum + cat.ideas.length, 0);
const experienceByTitle = new Map(EXPERIENCE_ENTRIES.map((entry) => [entry.title, entry]));
export const metadata = experienceMetadata(
  `${totalIdeas} Bucket List Ideas by Category | Live`,
  `Explore ${totalIdeas} bucket list ideas across travel, creativity, relationships and more. Read practical guides and save ideas privately to your own list.`,
  '/bucket-list-ideas'
);

export default function BucketListIdeasPage() {
  return (
    <div className="bg-card">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-card pt-16 pb-10 px-4">
        <GridBackground />
        <div className="relative mx-auto max-w-4xl">
          <FadeIn>
            {/* Whale in a gold-tinted card */}
            <div className="flex items-center gap-5 rounded-2xl border border-lumi-200 bg-primary/10 px-6 py-5 mb-8 max-w-md shadow-soft">
              <Whale size={80} glow float />
              <div>
                <p className="text-primary text-sm font-semibold mb-1">
                  {totalIdeas} ideas · One personal list
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Places to go, things to make, and experiences to share.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-foreground text-balance">
              Bucket list ideas <span className="text-primary">worth doing before you die</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">
              Browse ideas by category, open one for a closer look, and keep the ones you want to
              do. Start with something small or make room for a longer ambition.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/bucket-list"
                className="inline-flex items-center gap-2 rounded-full bg-[#211e18] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#39352d]"
              >
                Build my bucket list
              </Link>
              <Link
                href="/bucket-lists"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                See famous lists →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Category nav ─────────────────────────────────────────── */}
      <div className="sticky top-14 z-30 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {Object.entries(IDEAS_BY_CATEGORY).map(([key, cat]) => {
              const style = getBucketListCategoryStyle(cat.color);
              return (
                <a
                  key={key}
                  href={`#${key}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${style.bg} ${style.border} ${style.text}`}
                >
                  {cat.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Ideas by category ────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">
        {Object.entries(IDEAS_BY_CATEGORY).map(([key, cat]) => {
          const style = getBucketListCategoryStyle(cat.color);
          return (
            <section key={key} id={key} className="scroll-mt-28 space-y-6">
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-foreground text-balance">{cat.label}</h2>
                  <p className={`text-sm ${style.text} font-medium`}>{cat.ideas.length} ideas</p>
                </div>
              </FadeIn>

              <StaggerContainer className="grid gap-2 sm:grid-cols-2">
                {cat.ideas.map((idea, i) => {
                  const entry = experienceByTitle.get(idea);
                  if (!entry) throw new Error(`Idea missing from the activity catalog: ${idea}`);
                  return (
                    <StaggerItem key={i}>
                      <SpotlightCard
                        className={`border ${style.border} ${style.bg} shadow-soft`}
                        innerClassName="px-4 py-3"
                      >
                        <div className="flex items-start gap-3 group">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                          <Link
                            href={`/experiences/${entry.slug}`}
                            prefetch={false}
                            className="text-sm text-foreground leading-relaxed underline-offset-4 hover:underline"
                          >
                            {idea}
                          </Link>
                        </div>
                      </SpotlightCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>

              {/* Famous person who did something in this category */}
              {(() => {
                const famous = FAMOUS_BUCKET_LISTS.filter((p) =>
                  p.items.some((item) => item.category === key && item.status === 'done')
                ).slice(0, 2);
                if (famous.length === 0) return null;
                return (
                  <FadeIn>
                    <CardHoverEffect className={`border ${style.border} ${style.bg} shadow-soft`}>
                      <div className="px-5 py-4">
                        <p className={`text-sm font-semibold ${style.text} mb-3`}>
                          Famous people who checked {cat.label.toLowerCase()} off their list
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {famous.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/bucket-lists/${p.slug}`}
                              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-foreground font-medium transition-colors"
                              prefetch={false}
                            >
                              <span>{p.name}</span>
                              <span className="text-subtle text-xs">→</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </CardHoverEffect>
                  </FadeIn>
                );
              })()}
            </section>
          );
        })}
      </div>

      {/* ── Whale CTA ─────────────────────────────────────────────── */}
      <section className="bg-primary/10 border-t border-lumi-200">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-6">
          <Whale size={64} glow float className="mx-auto" />
          <h2 className="text-3xl font-bold text-foreground text-balance">
            Found something that speaks to you?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Save the ideas you want to do, mark them fulfilled when you finish, and remember what
            happened in your weekly journal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/bucket-list"
              className="inline-flex items-center gap-2 rounded-full bg-[#211e18] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#39352d]"
            >
              Start my bucket list
            </Link>
            <Link
              href="/bucket-lists"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:border-primary transition-colors"
            >
              Browse famous lists →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
