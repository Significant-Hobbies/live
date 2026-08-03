'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { HobbyRoadmap, RoadmapStep } from '~/lib/hobby-roadmap';

type SavedProgress = {
  completed: Record<RoadmapStep['id'], boolean>;
  notes: string;
  updatedAt: string;
};

const EMPTY_PROGRESS: SavedProgress = {
  completed: { today: false, week: false, month: false, quarter: false },
  notes: '',
  updatedAt: '',
};

function storageKey(hobby: string) {
  return `sh-roadmap:${hobby.toLowerCase()}`;
}

function readProgress(hobby: string): SavedProgress {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;
  try {
    const raw = localStorage.getItem(storageKey(hobby));
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      completed: { ...EMPTY_PROGRESS.completed, ...(parsed.completed ?? {}) },
      notes: parsed.notes ?? '',
      updatedAt: parsed.updatedAt ?? '',
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function writeProgress(hobby: string, progress: SavedProgress) {
  try {
    localStorage.setItem(storageKey(hobby), JSON.stringify(progress));
  } catch {
    // localStorage can fail (quota, private mode); silently ignore — UI still works in-session.
  }
}

export function HobbyRoadmapCard({ roadmap }: { roadmap: HobbyRoadmap }) {
  const [progress, setProgress] = useState<SavedProgress>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(readProgress(roadmap.hobby));
    setHydrated(true);
  }, [roadmap.hobby]);

  function toggleStep(stepId: RoadmapStep['id']) {
    const next: SavedProgress = {
      ...progress,
      completed: { ...progress.completed, [stepId]: !progress.completed[stepId] },
      updatedAt: new Date().toISOString(),
    };
    setProgress(next);
    writeProgress(roadmap.hobby, next);
  }

  function updateNotes(notes: string) {
    const next: SavedProgress = {
      ...progress,
      notes,
      updatedAt: new Date().toISOString(),
    };
    setProgress(next);
    writeProgress(roadmap.hobby, next);
  }

  const doneCount = Object.values(progress.completed).filter(Boolean).length;
  const total = roadmap.steps.length;
  const allDone = doneCount === total;

  return (
    <section className="overflow-hidden rounded-3xl bg-[#b9dcf5] p-6 text-[#211e18] sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em]">
            From curious to doing
          </p>
          <h2 className="font-serif text-4xl font-medium leading-none sm:text-5xl">
            Your {roadmap.hobby.toLowerCase()} roadmap
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[#454a4c] sm:text-base">
            A concrete path from today to three months in. Check off as you go — progress saves on
            this device.
          </p>
        </div>
        <span className="rounded-full bg-white/65 px-4 py-2 text-sm font-bold">
          {hydrated ? `${doneCount}/${total} done` : `${total} steps`}
        </span>
      </div>

      <ol className="grid gap-3 md:grid-cols-2">
        {roadmap.steps.map((step, i) => {
          const isDone = progress.completed[step.id];
          return (
            <li key={step.id}>
              <label
                className={`flex min-h-40 cursor-pointer items-start gap-3 rounded-2xl border p-5 transition-all ${
                  isDone
                    ? 'border-[#4e7654] bg-[#b5d98f]'
                    : 'border-white/80 bg-white/80 hover:-translate-y-0.5 hover:bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleStep(step.id)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-growth focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
                  aria-label={`Mark "${step.goal}" as done`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-semibold text-foreground">
                      {step.horizon}
                    </span>
                    <span className="text-xs text-subtle">Step {i + 1}</span>
                  </div>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isDone ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                  >
                    {step.goal}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.action}</p>
                </div>
              </label>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-2xl bg-white/65 p-5">
        <label className="text-sm font-bold">What are you noticing?</label>
        <textarea
          value={progress.notes}
          onChange={(e) => updateNotes(e.target.value)}
          rows={3}
          placeholder="What worked, what didn't, what to try next…"
          className="mt-2 w-full resize-none rounded-xl border border-[#a4b9c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#211e18]"
        />
        {hydrated && progress.updatedAt && (
          <p className="mt-1 text-[11px] text-subtle">
            Last updated {new Date(progress.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/timeline/new"
          className="rounded-xl bg-[#211e18] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          {allDone ? 'Log it in a timeline →' : 'Track this in a timeline →'}
        </Link>
        <p className="text-xs text-muted-foreground">
          {allDone
            ? "You've worked through the whole roadmap. Time to make it part of your story."
            : 'Notes and check-offs stay on this device until you save a timeline.'}
        </p>
      </div>
    </section>
  );
}
