import Link from 'next/link';
import { GitHubIcon } from '@/components/github-icon';

const groups = [
  {
    title: 'Start here',
    links: [
      ['Explore', '/experiences'],
      ['My list', '/bucket-list'],
      ['Weekly journal', '/journal'],
    ],
  },
  {
    title: 'Possibilities',
    links: [
      ['Things to try', '/experiences'],
      ['Bucket list ideas', '/bucket-list-ideas'],
      ['Life Bingo', '/life-bingo'],
      ['Side quests', '/side-quests'],
    ],
  },
  {
    title: 'Explore',
    links: [
      ['Life in weeks', '/life-in-weeks'],
      ['Travel bucket list', '/travel-bucket-list'],
    ],
  },
  {
    title: 'About',
    links: [
      ['Blog', '/blog'],
      ['Manifesto', '/manifesto'],
      ['Changelog', '/changelog'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer data-site-footer className="bg-field-sun px-4 py-10 text-foreground">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-brand bg-card shadow-[0_18px_45px_color-mix(in_srgb,var(--scrim)_10%,transparent)]">
        <div className="grid gap-9 p-7 sm:p-10 lg:grid-cols-[1.25fr_3fr]">
          <div>
            <div className="flex size-11 items-center justify-center rounded-full bg-field-sun font-serif text-xl font-bold">
              SH
            </div>
            <p className="mt-4 font-serif text-2xl font-semibold">Significant Hobbies</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A companion for living intentionally—because life is finite and the rest is still
              unwritten.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-bold">{group.title}</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        prefetch={false}
                        className="inline-flex min-h-11 items-center hover:text-foreground hover:underline hover:underline-offset-4 sm:min-h-0"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-border bg-background px-7 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span>
            Made by{' '}
            <a
              href="https://sarthakagrawal.dev"
              className="font-semibold text-foreground hover:underline"
            >
              Sarthak
            </a>
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="https://github.com/Significant-Hobbies/live/issues"
              className="inline-flex min-h-11 items-center hover:text-foreground sm:min-h-0"
            >
              Roadmap
            </a>
            <a
              href="https://github.com/Significant-Hobbies/live"
              aria-label="GitHub repository"
              title="GitHub repository"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center hover:text-foreground sm:min-h-0"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
