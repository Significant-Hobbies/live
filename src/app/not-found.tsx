import { ArrowRight, Compass, Map, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'This path ends here — Significant Hobbies' };

const nextPaths = [
  {
    href: '/find-your-hobby',
    title: 'Find a hobby',
    copy: 'Answer a few questions and leave with a real place to begin.',
    color: 'bg-field-sky',
    icon: Compass,
  },
  {
    href: '/experiences',
    title: 'See what is possible',
    copy: 'Browse small experiments, adventures, skills, and stories worth living.',
    color: 'bg-field-lilac',
    icon: Sparkles,
  },
] as const;

export default function NotFound() {
  return (
    <main className="bg-background px-4 py-8 text-foreground sm:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-2xl bg-field-sun shadow-[0_18px_45px_color-mix(in_srgb,var(--scrim)_12%,transparent)]">
          <div className="grid min-h-[28rem] lg:grid-cols-[1.35fr_0.65fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
              <div className="flex items-center gap-3 text-sm font-bold">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  404
                </span>
                Edge of the atlas
              </div>
              <div className="my-14 max-w-3xl">
                <h1 className="font-serif text-5xl font-medium leading-[0.96] tracking-[-0.03em] text-balance sm:text-7xl">
                  This path ends here. Your day does not.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  The page may have moved, stayed private, or never existed. Pick another direction
                  and keep going.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Return home <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="relative min-h-72 overflow-hidden bg-field-coral p-8 sm:p-10">
              <Map className="size-8" />
              <div className="absolute inset-x-10 bottom-12 top-24" aria-hidden="true">
                <div className="absolute left-[8%] top-[12%] size-5 rounded-full bg-surface" />
                <div className="absolute bottom-[16%] right-[8%] size-8 rounded-full border-[6px] border-border bg-field-sun" />
                <div className="absolute left-[10%] top-[17%] h-[58%] w-[76%] rotate-6 rounded-[50%] border-b-4 border-dashed border-border/70" />
              </div>
              <p className="absolute bottom-8 left-8 right-8 font-serif text-2xl leading-tight sm:left-10 sm:right-10">
                A wrong turn is still information.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="next-path-title" className="py-10 sm:py-14">
          <h2 id="next-path-title" className="font-serif text-3xl font-medium">
            Choose another path
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {nextPaths.map(({ href, title, copy, color, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`${color} group flex min-h-44 flex-col justify-between rounded-2xl p-6 text-foreground transition-transform hover:-translate-y-1 sm:p-7`}
              >
                <Icon className="size-6" />
                <div className="mt-8">
                  <h3 className="font-serif text-3xl font-medium">{title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{copy}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-bold">
                    Go there{' '}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
