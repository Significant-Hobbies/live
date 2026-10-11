'use client';

import { ArrowUpRight, Globe2 } from 'lucide-react';

import { externalDreamResearchLinks } from '~/lib/dream-atlas';

export function WiderWorldLinks({ query, compact = false }: { query: string; compact?: boolean }) {
  const links = externalDreamResearchLinks(query);

  return (
    <div className={compact ? 'space-y-2' : 'grid gap-3 sm:grid-cols-3'}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={`group flex min-h-12 items-start justify-between gap-3 rounded-xl border border-border/15 bg-card/70 text-left transition hover:-translate-y-0.5 hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
            compact ? 'px-4 py-3' : 'p-4'
          }`}
        >
          <span>
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Globe2 className="size-4" /> {link.label}
              <span className="sr-only">(opens in a new tab)</span>
            </span>
            {!compact ? (
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {link.detail}
              </span>
            ) : null}
          </span>
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      ))}
    </div>
  );
}
