import Link from 'next/link';
import { ExperiencePhoto } from '~/components/experience-photo';

const ideas = [
  { title: 'Make something with your hands', subject: 'pottery', query: 'pottery' },
  { title: 'Take the scenic route', subject: 'bike', query: 'bike' },
  { title: 'Find your next cold plunge', subject: 'swim', query: 'swim' },
];

export function ListInspiration() {
  return (
    <section className="mt-10" aria-labelledby="list-inspiration-heading">
      <h2 id="list-inspiration-heading" className="font-serif text-2xl sm:text-3xl">
        What have you always wanted to try?
      </h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Start with one thing. Something nearby, something hands-on, or something that takes you a
        little further.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {ideas.map((idea) => (
          <Link
            key={idea.subject}
            href={`/experiences?q=${idea.query}`}
            className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <ExperiencePhoto title={idea.subject} eager className="h-full w-full" />
            </div>
            <p className="mt-3 flex items-center justify-between gap-3 text-base group-hover:underline underline-offset-4">
              {idea.title}
              <span aria-hidden="true">→</span>
            </p>
          </Link>
        ))}
      </div>
      <Link
        href="/experiences"
        className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Explore all ideas <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
