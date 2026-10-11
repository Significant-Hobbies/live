'use client';

import { toPng } from 'html-to-image';
import { Download, Grid3X3, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';
import { BingoBoard } from '~/components/bucket-list/bingo-board';
import { Button } from '~/components/ui/button';
import { createRemixDraft, LIFE_BINGO_STORAGE_KEY, type BucketListDraft } from '~/lib/life-bingo';
import { browserRecordAdapter, writeLocalRecord } from '~/lib/local-record-store';

export function PublicBingo({
  draft,
  ownerName,
}: {
  draft: BucketListDraft;
  ownerName?: string | null;
}) {
  const router = useRouter();
  const exportRef = useRef<HTMLDivElement>(null);

  async function remix() {
    const next = createRemixDraft(draft);
    await writeLocalRecord(browserRecordAdapter(), LIFE_BINGO_STORAGE_KEY, 'bucket-list', next);
    router.push('/bucket-list/new');
  }

  async function exportBoard() {
    if (!exportRef.current) return;
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: getComputedStyle(exportRef.current)
          .getPropertyValue('--background')
          .trim(),
      });
      const link = document.createElement('a');
      link.download = 'life-bingo.png';
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error('This browser couldn’t export the board.');
    }
  }

  async function share() {
    const shareData = {
      title: draft.title,
      text: 'A life less ordinary, one square at a time.',
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-10 sm:py-16">
      <main className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-growth">
              {ownerName ? `${ownerName}’s Life Bingo` : 'A Life Bingo'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              A bucket list in its most playable form.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportBoard}
              className="border-border bg-card"
            >
              <Download className="h-3.5 w-3.5" /> Save image
            </Button>
            <Button variant="outline" size="sm" onClick={share} className="border-border bg-card">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
          </div>
        </header>

        <div ref={exportRef}>
          <BingoBoard draft={draft} />
        </div>

        <section className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-growth">
              Borrow the inspiration
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-foreground">
              Keep the ideas. Make the life yours.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Remixing copies the prompts into a fresh private draft. Completed moments and personal
              notes never come with it.
            </p>
          </div>
          <Button
            onClick={remix}
            size="lg"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Grid3X3 className="h-4 w-4" /> Make my version
          </Button>
        </section>
      </main>
    </div>
  );
}
