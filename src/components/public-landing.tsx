'use client';

import { Archivo } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';

const archivo = Archivo({ subsets: ['latin'], display: 'swap' });

const phases = [
  ['Childhood', '/categories/gaming-800.webp', 'Lego · Swimming · Chess · Drawing'],
  ['Teen years', '/categories/music-800.webp', 'Guitar · Skateboarding · Video games'],
  ['College', '/categories/outdoor-800.webp', 'Hiking · Photography · Coding'],
  ['Now', '/categories/culinary-800.webp', 'Running · Cooking · Pottery'],
] as const;

const famousLists = [
  ['Will Smith', 'will-smith', '/categories/creative-800.webp', 'Skydive over the Dubai desert'],
  [
    'Barack Obama',
    'barack-obama',
    '/categories/intellectual-800.webp',
    'Visit every US national park',
  ],
  [
    'Serena Williams',
    'serena-williams',
    '/categories/physical-800.webp',
    'Start a foundation for girls',
  ],
] as const;

const onboardingSteps = [
  [
    '01',
    'Remember what shaped you',
    'Add the hobbies, experiments, and returns that already belong to your story.',
    'Your history',
  ],
  [
    '02',
    'Name what still calls',
    'Build one honest bucket list from real possibilities, then choose what matters this year.',
    'Your future',
  ],
  [
    '03',
    'Give today a direction',
    'Choose a small daily practice and frame the trajectory you want your decisions to follow.',
    'Your next day',
  ],
] as const;

const questions = [
  [
    'Can I begin without an account?',
    'Yes. Your bucket list and weekly journal can stay on this device. Sign in only when you want cross-device access.',
  ],
  [
    'What happens when I sign in?',
    'Your home opens to your bucket list. Mark items done, write about the previous week, and use Life in weeks to keep time in perspective.',
  ],
  [
    'Is my weekly log public?',
    'No. What you write each week is private. Living surfaces such as timelines and profiles are shared only when you explicitly choose to publish them.',
  ],
  [
    'Is this another productivity score?',
    'No. Record completed bucket-list items and write a weekly journal entry without scores or streaks. The product is here to help you notice, choose, and remember—not grade your life.',
  ],
] as const;

export function PublicLandingShell() {
  return (
    <div className={`${archivo.className} public-landing bg-surface`}>
      <section className="landing-cinematic-hero">
        <div className="landing-cinematic-hero__scrim" aria-hidden="true" />
        <div className="landing-cinematic-hero__inner">
          <div className="landing-cinematic-hero__copy">
            <h1>
              <span>What will you do</span>
              <span>with the time you have?</span>
            </h1>
            <p>
              Start with your birth date. See the weeks behind you, the weeks still yours, and make
              room for what matters.
            </p>
            <Link className="landing-cinematic-hero__cta" href="/life-in-weeks">
              See my life in weeks <span aria-hidden="true">→</span>
            </Link>
            <p className="landing-cinematic-hero__note">Takes 10 seconds. No sign-up required.</p>
          </div>
          <p className="landing-cinematic-hero__prompt">The rest is still unwritten.</p>
        </div>
      </section>
    </div>
  );
}

export function PublicLanding() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className={`${archivo.className} public-landing bg-field-sun text-foreground`}>
      <section className="landing-cinematic-hero">
        <video
          className={`landing-cinematic-hero__video ${videoReady ? 'is-ready' : ''}`}
          poster="/hero/hobby-horizon-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          width={1280}
          height={720}
          aria-hidden="true"
          onTimeUpdate={(event) => {
            if (!videoReady && event.currentTarget.currentTime > 0.05) setVideoReady(true);
          }}
        >
          <source src="/hero/hobby-horizon.mp4" type="video/mp4" />
        </video>
        <div className="landing-cinematic-hero__scrim" aria-hidden="true" />
        <div className="landing-cinematic-hero__inner">
          <div className="landing-cinematic-hero__copy">
            <h1>
              <span>What will you do</span>
              <span>with the time you have?</span>
            </h1>
            <p>
              Start with your birth date. See the weeks behind you, the weeks still yours, and make
              room for what matters.
            </p>
            <Link className="landing-cinematic-hero__cta" href="/life-in-weeks">
              See my life in weeks <span aria-hidden="true">→</span>
            </Link>
            <p className="landing-cinematic-hero__note">Takes 10 seconds. No sign-up required.</p>
          </div>
          <p className="landing-cinematic-hero__prompt">The rest is still unwritten.</p>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
            <div>
              <p className="mb-5 text-base font-semibold text-brand">
                A record of what made you, you.
              </p>
              <h2 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Your interests already tell a story.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Put every hobby you remember on one timeline. The abandoned experiments, lifelong
                obsessions, and quiet returns become a map of the life you have lived.
              </p>
              <TextLink href="/onboarding">Begin with your story</TextLink>
            </div>
          </div>

          <ol className="mt-16 grid list-none border-y border-border sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {phases.map(([label, image, hobbies], index) => (
              <li
                key={label}
                className="group py-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-border lg:border-r lg:border-border lg:last:border-r-0"
              >
                <div className="relative mx-4 aspect-[4/3] overflow-hidden sm:mx-6">
                  <img
                    src={image}
                    alt={`${label}: ${hobbies}`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scrim/70 to-transparent" />
                  <span className="absolute bottom-3 right-3 text-xs font-bold text-brand">
                    0{index + 1}
                  </span>
                </div>
                <div className="px-4 pt-5 sm:px-6">
                  <h3 className="text-lg font-bold">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{hobbies}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-field-coral px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                What will you do before you die?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Remarkable people wrote theirs down. Borrow an idea, reject the obvious, then make a
                list that could only belong to you.
              </p>
            </div>
            <TextLink href="/bucket-lists">Browse every list</TextLink>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden bg-muted sm:grid-cols-3">
            {famousLists.map(([name, slug, image, preview]) => (
              <Link
                key={slug}
                href={`/bucket-lists/${slug}`}
                className="group relative block min-h-[28rem] overflow-hidden bg-surface sm:min-h-[32rem]"
              >
                <img
                  src={image}
                  alt={`${name}'s bucket list`}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-foreground sm:p-8">
                  <p className="text-sm font-semibold text-brand">{name}</p>
                  <h3 className="mt-3 max-w-[18ch] text-2xl font-semibold leading-tight sm:text-3xl">
                    “{preview}”
                  </h3>
                  <span className="mt-6 inline-flex min-h-11 items-center text-sm font-bold">
                    View their list <span className="ml-2 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-field-lilac px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-5 font-semibold text-field-lilac-ink">
              A life, assembled in three moves.
            </p>
            <h2 className="text-4xl font-semibold leading-[1.04] tracking-[-0.035em] sm:text-5xl">
              Onboarding should feel like remembering, not paperwork.
            </h2>
            <Link
              href="/onboarding"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              Begin onboarding <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ol className="list-none border-t border-field-lilac-ink">
            {onboardingSteps.map(([number, title, description, detail]) => (
              <li
                key={number}
                className="grid gap-4 border-b border-field-lilac-ink py-8 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-7 sm:py-9"
              >
                <span className="text-xl font-bold text-field-lilac-ink">{number}</span>
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                <p className="self-center text-sm font-bold sm:max-w-28 sm:text-right">{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-field-sky-ink bg-field-sky px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 font-semibold text-field-sky-ink">Lives shaped by curiosity</p>
              <h2 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                One interest rarely tells the whole story.
              </h2>
            </div>
            <TextLink href="/find-your-hobby">Find your next hobby</TextLink>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.55fr_0.85fr] lg:gap-14">
            <JourneyFeature
              href="/u/stevejobs"
              image="/categories/creative-800.webp"
              person="Steve Jobs · 3 life phases"
              title="From calligraphy to Apple"
              hobbies="Electronics · Calligraphy · Yoga · Meditation · Walking · Reading"
            />
            <div className="border-t border-field-sky-ink">
              <JourneyRow
                href="/u/alberteinstein"
                image="/categories/music-800.webp"
                person="Albert Einstein"
                title="Violin, sailing, and the universe"
                hobbies="Violin · Sailing · Puzzles · Philosophy"
              />
              <JourneyRow
                href="/u/richardfeynman"
                image="/categories/outdoor-800.webp"
                person="Richard Feynman"
                title="Bongos, safecracking, and physics"
                hobbies="Electronics · Drums · Lock picking · Drawing"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-field-green px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Questions, answered.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">
              Start without an account, keep control of what is public, and make the map your own.
            </p>
          </div>
          <div className="border-t border-field-green-ink">
            {questions.map(([question, answer]) => (
              <details key={question} className="group border-b border-field-green-ink">
                <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left">
                  <h3 className="text-lg font-bold sm:text-xl">{question}</h3>
                  <span
                    className="flex size-11 shrink-0 items-center justify-center text-2xl transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-14 text-[15px] leading-relaxed text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-final-cta">
        <img
          src="/hero/hobby-horizon-poster.jpg"
          alt=""
          loading="lazy"
          width={1280}
          height={720}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-scrim via-scrim/75 to-scrim/30" />
        <div className="relative mx-auto w-full max-w-6xl">
          <p className="mb-5 font-semibold text-brand">The rest is still unwritten.</p>
          <h2 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">
            The next chapter needs something worth remembering.
          </h2>
          <Link
            href="/onboarding"
            className="mt-9 inline-flex min-h-13 items-center gap-3 rounded-xl bg-brand px-7 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            Begin your story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-brand pb-1 text-sm font-bold text-brand transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

function JourneyFeature({
  href,
  image,
  person,
  title,
  hobbies,
}: {
  href: string;
  image: string;
  person: string;
  title: string;
  hobbies: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[30rem] overflow-hidden sm:min-h-[38rem]"
    >
      <img
        src={image}
        alt={`${title}: ${hobbies}`}
        loading="lazy"
        width={800}
        height={800}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 max-w-2xl p-7 text-foreground sm:p-10">
        <p className="text-sm font-semibold text-brand">{person}</p>
        <h3 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{hobbies}</p>
        <span className="mt-7 inline-flex min-h-11 items-center text-sm font-bold">
          See the full journey <span className="ml-2 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

function JourneyRow({
  href,
  image,
  person,
  title,
  hobbies,
}: {
  href: string;
  image: string;
  person: string;
  title: string;
  hobbies: string;
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-[5.5rem_1fr] gap-5 border-b border-field-sky-ink py-7 sm:grid-cols-[7rem_1fr] sm:py-9"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          width={800}
          height={800}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="self-center">
        <p className="text-sm font-semibold text-field-sky-ink">{person}</p>
        <h3 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{hobbies}</p>
        <span className="mt-4 inline-flex min-h-11 items-center text-sm font-bold">
          View journey <span className="ml-2 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
