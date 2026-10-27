'use client';

import { HobbyRoadmapView, EMPTY_PROGRESS, type SavedProgress } from './public-hobby-roadmap';
import { useEffect, useState } from 'react';

import type { HobbyRoadmap, RoadmapStep } from '~/lib/hobby-roadmap';

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

  return (
    <HobbyRoadmapView
      roadmap={roadmap}
      progress={progress}
      hydrated={hydrated}
      toggleStep={toggleStep}
      updateNotes={updateNotes}
    />
  );
}
