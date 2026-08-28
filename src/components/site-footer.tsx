import Link from 'next/link';

const groups = [
  {
    title: 'Start here',
    links: [
      ['Find your hobby', '/find-your-hobby'],
      ['Onboarding', '/onboarding'],
      ['Why this exists', '/manifesto'],
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
      ['Hobbies for adults', '/hobbies-for-adults'],
      ['Cheap hobbies', '/cheap-hobbies'],
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
    <footer data-site-footer className="bg-[#f7e957] px-4 py-10 text-[#211e18]">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#d4c74c] bg-[#fffdf8] shadow-[0_18px_45px_rgba(80,67,23,0.10)]">
        <div className="grid gap-9 p-7 sm:p-10 lg:grid-cols-[1.25fr_3fr]">
          <div>
            <div className="flex size-11 items-center justify-center rounded-full bg-[#f7e957] font-serif text-xl font-bold">
              SH
            </div>
            <p className="mt-4 font-serif text-2xl font-semibold">Significant Hobbies</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#625b50]">
              A companion for living intentionally—because life is finite and the rest is still
              unwritten.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-bold">{group.title}</p>
                <ul className="mt-4 space-y-3 text-sm text-[#625b50]">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        prefetch={false}
                        className="inline-flex min-h-11 items-center hover:text-[#211e18] hover:underline hover:underline-offset-4 sm:min-h-0"
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
        <div className="flex flex-col gap-4 border-t border-[#e4dccb] bg-[#f7f1e7] px-7 py-5 text-xs text-[#625b50] sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span>
            Made by{' '}
            <a
              href="https://sarthakagrawal.dev"
              className="font-semibold text-[#211e18] hover:underline"
            >
              Sarthak
            </a>
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="https://github.com/Significant-Hobbies/live/issues"
              className="inline-flex min-h-11 items-center hover:text-[#211e18] sm:min-h-0"
            >
              Roadmap
            </a>
            <a
              href="https://github.com/Significant-Hobbies/live"
              className="inline-flex min-h-11 items-center hover:text-[#211e18] sm:min-h-0"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
