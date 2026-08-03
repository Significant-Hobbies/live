'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Loader2, Plus, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { saveTimeline, updateTimeline } from '~/lib/actions/timeline';
import type { FirstTimelineStarter } from '~/lib/first-timeline';
import { captureError } from '~/lib/foundry-monitoring';
import {
  browserRecordAdapter,
  readLocalRecord,
  removeLocalRecord,
  writeLocalRecord,
} from '~/lib/local-record-store';
import { TIMELINE_TEMPLATES, type TimelineTemplate } from '~/lib/templates';
import type { Phase, TimelineData } from '~/lib/types';

import { PhaseCard } from './phase-card';

interface Props {
  existing?: TimelineData;
  starter?: FirstTimelineStarter | null;
  isAuthenticated?: boolean;
}

function makePhase(order: number): Phase {
  return {
    id: nanoid(),
    label: '',
    hobbies: [],
    order,
  };
}

function templateToPhases(template: TimelineTemplate): Phase[] {
  if (template.phases.length === 0) {
    return [makePhase(0)];
  }
  return template.phases.map((tp, i) => ({
    id: Math.random().toString(36).slice(2),
    label: tp.label,
    ageStart: tp.ageStart,
    ageEnd: tp.ageEnd,
    hobbies: tp.suggestedHobbies.map((name) => ({ name })),
    order: i,
  }));
}

function TemplatePicker({ onPick }: { onPick: (template: TimelineTemplate) => void }) {
  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d9cfbd] bg-[#fffdf8] p-5 shadow-[0_22px_60px_rgba(72,58,38,0.08)] sm:p-9">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176b4a]">
          Personal timeline
        </p>
        <h2 className="mt-2 font-serif text-4xl font-medium tracking-[-0.03em] text-[#211e18]">
          Where does your story begin?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#625b50]">
          Start empty or borrow a shape. Every phase stays editable.
        </p>
      </div>
      <div className="divide-y divide-[#e8dfd1] border-y border-[#e8dfd1]">
        {TIMELINE_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onPick(template)}
            className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-2 py-5 text-left transition-colors hover:bg-[#f7f1e7] focus-visible:bg-[#f7e957] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#211e18]"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[#b9dcf5] font-serif text-lg font-bold text-[#192a36]">
              {template.name.charAt(0)}
            </span>
            <span>
              <span className="block font-serif text-2xl font-medium text-[#211e18]">
                {template.name}
              </span>
              <span className="mt-1 block text-sm text-[#625b50]">{template.description}</span>
            </span>
            <span className="rounded-full border border-[#d9cfbd] bg-white px-3 py-1.5 text-xs font-bold text-[#625b50]">
              {template.phases.length ? `${template.phases.length} phases` : 'Empty'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TimelineBuilder({ existing, starter, isAuthenticated = false }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(existing?.title ?? starter?.title ?? '');
  const [phases, setPhases] = useState<Phase[]>(
    existing?.phases?.length
      ? existing.phases
      : starter
        ? [
            {
              ...makePhase(0),
              label: starter.phaseLabel,
              hobbies: [{ name: starter.hobbyName }],
            },
          ]
        : [makePhase(0)]
  );
  const [isPending, startTransition] = useTransition();
  // Show template picker only for new timelines (no existing prop)
  const [templatePicked, setTemplatePicked] = useState(!!existing || !!starter);

  // On touch, require a short press-and-hold before a drag starts so normal
  // vertical scrolling of the phase list is never hijacked. Pointer (mouse)
  // gets a small distance threshold for the same reason.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const draftKey = existing ? `timeline-draft-${existing.id}` : 'timeline-draft-new';

  // Restore both creation and edit drafts. First-time creation now begins
  // immediately after a longer setup flow, so losing it to refresh, auth, or
  // an accidental navigation is especially costly.
  useEffect(() => {
    async function restoreDraft() {
      let draft = await readLocalRecord(
        browserRecordAdapter(),
        draftKey,
        'timelines',
        (value): value is { title?: string; phases?: Phase[] } =>
          !!value && typeof value === 'object'
      );
      const legacy = localStorage.getItem(draftKey);
      if (!draft && legacy) {
        try {
          draft = JSON.parse(legacy) as { title?: string; phases?: Phase[] };
          await writeLocalRecord(browserRecordAdapter(), draftKey, 'timelines', draft);
          localStorage.removeItem(draftKey);
        } catch {}
      }
      if (!draft) return;
      if (typeof draft.title === 'string') setTitle(draft.title);
      if (Array.isArray(draft.phases) && draft.phases.length > 0) {
        setPhases(draft.phases);
        setTemplatePicked(true);
      }
    }
    void restoreDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore once on mount
  }, []);

  // Mirror edits to localStorage so reordering / typing isn't lost on reload.
  useEffect(() => {
    if (!templatePicked) return;
    const t = setTimeout(() => {
      void writeLocalRecord(browserRecordAdapter(), draftKey, 'timelines', { title, phases });
    }, 800);
    return () => clearTimeout(t);
  }, [draftKey, phases, templatePicked, title]);

  function handlePickTemplate(template: TimelineTemplate) {
    setPhases(templateToPhases(template));
    setTemplatePicked(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setPhases((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((p, i) => ({
        ...p,
        order: i,
      }));
    });
  }

  function addPhase() {
    setPhases((prev) => [...prev, makePhase(prev.length)]);
  }

  function updatePhase(id: string, patch: Phase) {
    setPhases((prev) => prev.map((p) => (p.id === id ? patch : p)));
  }

  function deletePhase(id: string) {
    setPhases((prev) => prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i })));
  }

  function handleSave() {
    const emptyPhases = phases.filter((p) => !p.label.trim());
    if (emptyPhases.length > 0) {
      toast.error('All phases need a name');
      return;
    }

    if (!isAuthenticated && !existing) {
      void writeLocalRecord(browserRecordAdapter(), draftKey, 'timelines', { title, phases });
      toast.success('Timeline saved on this device. Sign in when you want to publish or sync it.');
      return;
    }
    startTransition(async () => {
      try {
        if (existing) {
          const result = await updateTimeline(existing.id, {
            title: title || undefined,
            phases,
          });
          if (draftKey) {
            try {
              await removeLocalRecord(browserRecordAdapter(), draftKey);
            } catch {}
          }
          toast.success('Timeline updated');
          router.push(`/timeline/${result.id}`);
        } else {
          const result = await saveTimeline({ title: title || undefined, phases });
          try {
            await removeLocalRecord(browserRecordAdapter(), draftKey);
          } catch {}
          toast.success('Timeline saved!');
          router.push(result.destination);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save';
        if (msg === 'Not authenticated') {
          toast.error('Sign in to save your timeline');
          router.push('/login');
        } else {
          // Don't leak a raw server error to users; the draft is kept in
          // localStorage so nothing is lost — they can retry.
          console.error('Timeline save failed', err);
          captureError(err, { scope: 'timeline-builder', source: 'save' });
          toast.error(
            "Couldn't save your timeline — your changes are kept here, try again in a moment."
          );
        }
      }
    });
  }

  // Show template picker for new timelines
  if (!templatePicked) {
    return <TemplatePicker onPick={handlePickTemplate} />;
  }

  const phasesWithHobbies = phases.filter((p) => p.hobbies.length > 0).length;
  const totalPhases = phases.length;
  const allEmpty = phasesWithHobbies === 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Timeline title (optional)"
          className="h-11 border-border bg-card text-lg font-medium placeholder:text-muted-foreground"
        />
      </div>

      {/* Progress indicator */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            allEmpty ? 'bg-foreground/5 text-muted-foreground' : 'bg-growth/15 text-growth'
          }`}
        >
          {phasesWithHobbies}/{totalPhases} phases have hobbies
        </span>
        {allEmpty && (
          <span className="text-xs text-muted-foreground">
            Tip: Add hobbies to each phase to unlock insights
          </span>
        )}
        {!existing && starter && !allEmpty && (
          <span className="text-xs text-muted-foreground">
            Save this starting point, or add an earlier chapter.
          </span>
        )}
        {!existing && (
          <button
            type="button"
            onClick={() => setTemplatePicked(false)}
            className="ml-auto text-xs text-muted-foreground hover:text-muted-foreground transition-colors"
          >
            Change template
          </button>
        )}
      </div>

      {/* Phases */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={phases.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <div key={phase.id}>
                <PhaseCard
                  phase={phase}
                  onChange={(updated) => updatePhase(phase.id, updated)}
                  onDelete={() => deletePhase(phase.id)}
                  isOnly={phases.length === 1}
                />
                {index === 0 && phases.length > 1 && (
                  <p
                    className="mt-1.5 text-center text-xs text-muted-foreground"
                    style={{
                      animation: 'fadeOut 0.5s ease 3s forwards',
                    }}
                  >
                    Drag to reorder
                  </p>
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-border text-muted-foreground hover:text-foreground"
          onClick={addPhase}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add phase
        </Button>

        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-primary px-6 text-primary-foreground hover:opacity-90"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {existing ? 'Update timeline' : isAuthenticated ? 'Save timeline' : 'Save on this device'}
        </Button>
      </div>
    </div>
  );
}
