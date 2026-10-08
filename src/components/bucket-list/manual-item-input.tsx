'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import type { ExperienceEntry } from '~/lib/experiences';
import { ResultPagination } from '~/components/result-pagination';
import { useCatalogResults } from '~/components/use-catalog-results';
import { submitCatalogIdea } from '~/lib/actions/catalog';
import type { CatalogPage } from '~/lib/catalog-types';

type ItemInput = Pick<ExperienceEntry, 'title'> &
  Partial<Pick<ExperienceEntry, 'description' | 'category'>>;
const PAGE_SIZE = 5;

export function ManualItemInput({
  onAdd,
  disabled = false,
  dark = false,
  canSubmitToCatalog = false,
}: {
  onAdd: (item: ItemInput) => Promise<boolean>;
  disabled?: boolean;
  dark?: boolean;
  canSubmitToCatalog?: boolean;
}) {
  const id = useId();
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const saving = useRef(false);
  const catalog = useCatalogResults(
    { query: value, category: 'all', kind: 'all', page, pageSize: PAGE_SIZE },
    Boolean(value.trim())
  );
  const results = catalog.data?.items ?? [];
  const previousCategories = useRef<CatalogPage['categories']>([]);
  const categories = catalog.data?.categories ?? previousCategories.current;
  useEffect(() => {
    if (catalog.data) previousCategories.current = catalog.data.categories;
  }, [catalog.data]);
  const [submissionCategory, setSubmissionCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  async function submitForReview() {
    if (!value.trim() || !submissionCategory || submitting) return;
    setSubmitting(true);
    setSubmissionMessage('');
    try {
      const result = await submitCatalogIdea({ title: value.trim(), category: submissionCategory });
      setSubmittedTitle(value.trim());
      setSubmissionMessage(
        result.status === 'already-shared' || result.status === 'approved'
          ? 'This idea is already in the shared catalog.'
          : result.status === 'rejected'
            ? 'This idea was previously reviewed and declined.'
            : 'Submitted for review. It will appear for everyone only after approval. Your personal list is unchanged.'
      );
    } catch {
      setSubmissionMessage(
        'Could not submit this idea. Your personal list is unchanged; try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function add(item: ItemInput) {
    if (disabled || saving.current || submitting) return;
    saving.current = true;
    setPending(true);
    setMessage('');
    try {
      if (await onAdd(item)) {
        setMessage(`Added “${item.title}” to your list.`);
        setValue('');
        setPage(1);
      } else {
        setMessage('This item was not added. Check the message below and try again.');
      }
    } catch {
      setMessage('Could not save this item. Your input is unchanged. Try again.');
    } finally {
      saving.current = false;
      setPending(false);
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <p id={`${id}-help`}>Type to find ideas, or add your own wording.</p>
        <Link
          href="/experiences"
          className="min-h-11 inline-flex items-center underline underline-offset-4"
        >
          Explore for inspiration →
        </Link>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (value.trim()) void add({ title: value.trim() });
        }}
        className={`flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center ${dark ? 'bg-[#211e18] text-white' : 'border border-[#d9cfbd] bg-[#fffdf8]'}`}
      >
        <label htmlFor={id} className="shrink-0 font-serif text-xl">
          I want to…
        </label>
        <input
          id={id}
          type="text"
          autoComplete="off"
          aria-describedby={`${id}-help`}
          aria-controls={value.trim() ? `${id}-suggestions` : undefined}
          value={value}
          disabled={disabled || pending || submitting}
          maxLength={200}
          onChange={(event) => {
            setValue(event.target.value);
            setPage(1);
            setMessage('');
            setSubmissionMessage('');
          }}
          placeholder="Something I want to do…"
          className={`min-h-11 min-w-0 flex-1 rounded-xl border px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b4a] ${dark ? 'border-white/20 bg-white/10 text-white placeholder:text-white/60' : 'border-[#d9cfbd] bg-white'}`}
        />
        <button
          type="submit"
          disabled={disabled || pending || submitting || !value.trim()}
          className="min-h-11 rounded-xl bg-[#f7e957] px-5 font-bold text-[#211e18] disabled:opacity-50"
        >
          {pending ? 'Adding…' : 'Add my wording'}
        </button>
      </form>
      {value.trim() && (
        <div id={`${id}-suggestions`} className="mt-3 rounded-2xl border border-border bg-card p-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {catalog.loading
              ? 'Looking for ideas…'
              : catalog.error || `${catalog.data?.matches ?? 0} matching ideas`}
          </p>
          {results.length ? (
            <ul className="mt-2 divide-y divide-border">
              {results.map((entry) => (
                <li
                  key={entry.slug}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p>{entry.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{entry.category}</p>
                  </div>
                  <button
                    type="button"
                    disabled={disabled || pending || submitting}
                    onClick={() => void add(entry)}
                    aria-label={`Add ${entry.title} to my list`}
                    className="min-h-11 rounded-xl border border-border px-3 text-sm disabled:opacity-50"
                  >
                    + Add
                  </button>
                </li>
              ))}
            </ul>
          ) : !catalog.loading && !catalog.error ? (
            <p className="mt-3 text-sm">
              No matching ideas. You can still add your own wording above.
            </p>
          ) : null}
          <ResultPagination
            page={catalog.data?.page ?? page}
            pageCount={Math.ceil((catalog.data?.matches ?? 0) / PAGE_SIZE)}
            onChange={setPage}
          />
        </div>
      )}
      {value.trim() && canSubmitToCatalog && (
        <details className="mt-3 text-sm">
          <summary className="min-h-11 cursor-pointer py-3">Suggest this idea to everyone</summary>
          <p className="mb-3 text-muted-foreground">
            Only this title and its category will enter review. Your personal list and notes stay
            private.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor={`${id}-category`}>Category</label>
            <select
              id={`${id}-category`}
              value={submissionCategory}
              disabled={submitting}
              onChange={(event) => setSubmissionCategory(event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-card px-3"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={
                disabled ||
                pending ||
                submitting ||
                !submissionCategory ||
                value.trim().length < 3 ||
                submittedTitle === value.trim()
              }
              onClick={() => void submitForReview()}
              className="min-h-11 rounded-xl border border-border px-4 disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit for review'}
            </button>
          </div>
          {submissionMessage && (
            <p role="status" className="mt-3">
              {submissionMessage}
            </p>
          )}
        </details>
      )}
      {value.trim() && !canSubmitToCatalog && (
        <p className="mt-3 text-sm text-muted-foreground">
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>{' '}
          to submit an idea to the shared catalog for review.
        </p>
      )}
      {message && (
        <p role="status" className="mt-3 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
