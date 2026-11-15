import type { Metadata } from 'next';
import Link from 'next/link';

import { FadeIn, GridBackground } from '~/components/aceternity';
import { JsonLd } from '~/components/json-ld';
import { withPublicMetadata } from '~/lib/public-metadata';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '~/lib/site-metadata';

const title = 'What are significant hobbies? A practical guide';
const description =
  'Choose a hobby that fits your time, budget and company. Try practical first sessions and save bucket-list experiences privately with Live.';
const path = '/what-are-significant-hobbies';

export const metadata: Metadata = withPublicMetadata({
  title: { absolute: `${title} | Live` },
  description,
  alternates: { canonical: `${SITE_URL}${path}` },
  openGraph: {
    type: 'article',
    title,
    description,
    url: `${SITE_URL}${path}`,
    images: [{ url: DEFAULT_SOCIAL_IMAGE }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_SOCIAL_IMAGE] },
});

const examples = [
  {
    title: 'Make something',
    hobby: 'Drawing',
    experience: 'Finish a sketchbook of your neighborhood.',
    session:
      'Use a pen you own to draw one object for fifteen minutes. Keep the drawing and try the same object again next week.',
  },
  {
    title: 'Spend time outside',
    hobby: 'Birdwatching',
    experience: 'Recognize five birds near home.',
    session:
      'Sit in one familiar outdoor place. Note the birds you see or hear. Return at a similar time and notice what changes.',
  },
  {
    title: 'Learn with someone',
    hobby: 'Cooking',
    experience: 'Learn a family recipe from the person who makes it.',
    session:
      'Choose a dish together, check the ingredients you already have, and make one part of the meal alongside them.',
  },
  {
    title: 'Explore on foot',
    hobby: 'Walking',
    experience: 'Walk a route through a part of town you have never visited.',
    session:
      'Pick an accessible route that suits your energy and conditions. Set aside half an hour, including the trip home.',
  },
];

const questions = [
  {
    question: 'What makes a hobby significant?',
    answer:
      'A hobby is significant when you value what it brings to your own life. It might give you a way to make things, spend time with someone, learn, or notice your surroundings. Popularity and expertise are not requirements.',
  },
  {
    question: 'Is a hobby the same as a bucket-list experience?',
    answer:
      'A hobby is something you return to, such as cooking or drawing. A bucket-list experience is something you want to do, such as learning a family recipe or filling a sketchbook. An experience can be a small way to try a hobby.',
  },
  {
    question: 'Do I have to choose a lifelong hobby?',
    answer:
      'No. Choose one first session that fits your current time, budget and energy. Afterward, decide whether you want another session, a different version of the activity, or something else.',
  },
  {
    question: 'What is Live by Significant Hobbies?',
    answer:
      'Live is a free catalog of bucket-list ideas and side quests with a personal list, completion logging, optional Life Bingo, a private weekly journal and Life in weeks. You can begin without an account. Signed-out work stays on this device, and publication is opt-in.',
  },
];

export default function SignificantHobbiesPage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              headline: 'What are significant hobbies?',
              description,
              mainEntityOfPage: `${SITE_URL}${path}`,
              author: { '@id': `${SITE_URL}/#org` },
              publisher: { '@id': `${SITE_URL}/#org` },
            },
            {
              '@type': 'FAQPage',
              mainEntity: questions.map(({ question, answer }) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
            },
          ],
        }}
      />
      <header className="relative overflow-hidden border-b border-border bg-card px-5 py-14 sm:px-8 sm:py-20">
        <GridBackground />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm font-semibold text-primary">Live by Significant Hobbies</p>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            What are significant hobbies?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The things you choose to return to because they matter to you. A hobby can be a quiet
            half hour, a skill you slowly learn, or time you share with someone. Start with what you
            want to do, then make room for one real attempt.
          </p>
          <Link
            href="/experiences"
            className="mt-7 inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Find something to try
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-14 px-5 py-12 sm:px-8">
        <FadeIn>
          <section aria-labelledby="hobby-or-experience">
            <h2
              id="hobby-or-experience"
              className="font-serif text-2xl font-medium text-foreground sm:text-3xl"
            >
              A hobby can start with one experience
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Cooking is a hobby. Learning your grandmother's dal recipe is an experience. Drawing
              is a hobby. Filling a sketchbook is a possible milestone. You can put a specific
              experience on your list without committing to a new identity or years of practice.
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {examples.map((example) => (
                <div key={example.hobby} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm font-semibold text-primary">{example.title}</p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{example.hobby}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">
                    {example.experience}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {example.session}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <section aria-labelledby="choose-a-first-session">
          <h2
            id="choose-a-first-session"
            className="font-serif text-2xl font-medium text-foreground sm:text-3xl"
          >
            Choose a first session you can actually do
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Answer these questions before buying equipment or making a long commitment.
          </p>
          <ol className="mt-6 list-decimal space-y-5 pl-6 text-muted-foreground">
            <li className="pl-2 leading-relaxed">
              <strong className="text-foreground">What time do you have?</strong> Include travel,
              setup and cleanup. A short walk near home and an afternoon class need different spaces
              in your week.
            </li>
            <li className="pl-2 leading-relaxed">
              <strong className="text-foreground">What can you use already?</strong> Begin with
              materials you own, a borrowed tool or a single introductory session. Check the full
              cost before you sign up.
            </li>
            <li className="pl-2 leading-relaxed">
              <strong className="text-foreground">What company would you enjoy?</strong> Choose time
              alone, a familiar person or a group. The same activity can feel very different in each
              setting.
            </li>
            <li className="pl-2 leading-relaxed">
              <strong className="text-foreground">What will you try?</strong> Write a concrete
              action, such as "draw one mug on Saturday," rather than "become an artist." Afterward,
              ask whether you want to do it again.
            </li>
          </ol>
          <p className="mt-7 leading-relaxed text-muted-foreground">
            Use the{' '}
            <Link
              href="/experiences/collections"
              className="text-foreground underline underline-offset-4"
            >
              experience collections
            </Link>{' '}
            for ideas grouped by time, budget and company, or compare the{' '}
            <Link
              href="/tools/cost-calculator"
              className="text-foreground underline underline-offset-4"
            >
              cost of a hobby
            </Link>{' '}
            before committing.
          </p>
        </section>

        <section
          aria-labelledby="keep-your-own-list"
          className="rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h2 id="keep-your-own-list" className="font-serif text-2xl font-medium text-foreground">
            Keep the idea. Notice what happened.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            In Live, browse the shared catalog or add your own wording to{' '}
            <Link href="/bucket-list" className="text-foreground underline underline-offset-4">
              My list
            </Link>
            . Mark an experience done when you finish. Your{' '}
            <Link href="/journal" className="text-foreground underline underline-offset-4">
              weekly journal
            </Link>{' '}
            is a private place to remember the week before.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Begin free without an account. Signed-out records stay on this device. Sign in when you
            want records across devices. Publication is an explicit choice per item; your weekly
            journal stays private.
          </p>
        </section>

        <section aria-labelledby="questions">
          <h2
            id="questions"
            className="font-serif text-2xl font-medium text-foreground sm:text-3xl"
          >
            Questions about significant hobbies
          </h2>
          <div className="mt-6 divide-y divide-border">
            {questions.map(({ question, answer }) => (
              <div key={question} className="py-5 first:pt-0">
                <h3 className="font-semibold text-foreground">{question}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
