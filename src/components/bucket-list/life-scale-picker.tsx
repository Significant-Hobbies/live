'use client';

import type { ReactNode } from 'react';
import {
  BUCKET_LIFE_SCALES,
  BUCKET_LIFE_SCALE_VALUES,
  type BucketLifeScale,
} from '~/lib/bucket-life-scale';

const MARKS: Record<BucketLifeScale, ReactNode> = {
  moment: (
    <>
      <path d="M12 45h52" opacity="0.2" />
      <path d="M38 9v6m0 18v6M23 24h6m18 0h6M27.5 13.5l4.2 4.2m12.6 12.6 4.2 4.2m0-21-4.2 4.2M31.7 30.3l-4.2 4.2" />
      <circle cx="38" cy="24" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  adventure: (
    <>
      <path d="M12 45h52" opacity="0.2" />
      <path d="M19 43c-14-11 1-15 18-15s27-6 13-11-22-3-12-10" />
      <circle cx="19" cy="43" r="2" fill="currentColor" stroke="none" />
      <circle cx="38" cy="7" r="2.5" fill="var(--card)" />
    </>
  ),
  chapter: (
    <>
      <path d="M12 39V12c10-2 19 1 26 7 7-6 16-9 26-7v27c-10-2-19 1-26 7-7-6-16-9-26-7Z" />
      <path d="M38 19v27m-20-9c7 0 11 1 15 4m10 0c4-3 8-4 15-4" opacity="0.45" />
    </>
  ),
};

export function LifeScalePicker({
  id,
  value,
  disabled,
  onChange,
}: {
  id: string;
  value?: BucketLifeScale | null;
  disabled: boolean;
  onChange: (value: BucketLifeScale | null) => void;
}) {
  return (
    <fieldset disabled={disabled} aria-describedby={`life-scale-help-${id}`} className="mt-7">
      <legend className="font-serif text-[21px] tracking-[-0.02em]">
        How do you picture this?
      </legend>
      <div className="mt-3 grid grid-cols-3 gap-1">
        {BUCKET_LIFE_SCALE_VALUES.map((lifeScale) => (
          <label key={lifeScale} className="group min-w-0 cursor-pointer">
            <input
              type="radio"
              name={`life-scale-${id}`}
              value={lifeScale}
              checked={value === lifeScale}
              onChange={() => onChange(lifeScale)}
              className="peer sr-only"
            />
            <span className="flex min-h-28 flex-col items-center justify-center rounded-xl px-1 py-3 text-muted-foreground transition-colors duration-200 peer-checked:text-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand group-hover:bg-surface/60 group-hover:text-foreground peer-disabled:cursor-wait motion-reduce:transition-none">
              <svg
                viewBox="0 0 76 54"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                className="h-12 w-[68px]"
              >
                {MARKS[lifeScale]}
              </svg>
              <span className="mt-2 font-serif text-[clamp(1rem,4.8vw,1.375rem)] leading-tight tracking-[-0.025em]">
                {BUCKET_LIFE_SCALES[lifeScale].label}
              </span>
              <span className="sr-only">{BUCKET_LIFE_SCALES[lifeScale].description}</span>
              <span
                aria-hidden="true"
                className={`mt-2 h-px w-4 bg-current transition-opacity duration-200 motion-reduce:transition-none ${value === lifeScale ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex min-h-11 items-center gap-3 border-t border-border/50">
        <p
          id={`life-scale-help-${id}`}
          className="py-2 text-[13px] leading-relaxed text-muted-foreground"
        >
          {value
            ? BUCKET_LIFE_SCALES[value].description
            : 'Choose what feels right, or leave it open.'}
        </p>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="min-h-11 shrink-0 rounded text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none"
          >
            Leave open
          </button>
        )}
      </div>
    </fieldset>
  );
}
