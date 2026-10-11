export type BucketListCategoryStyle = {
  bg: string;
  border: string;
  text: string;
  dot: string;
};

export const BUCKET_LIST_CATEGORY_STYLES: Record<string, BucketListCategoryStyle> = {
  amber: {
    bg: 'bg-field-sun',
    border: 'border-brand',
    text: 'text-brand',
    dot: 'bg-brand',
  },
  coral: {
    bg: 'bg-primary/10',
    border: 'border-lumi-200',
    text: 'text-primary',
    dot: 'bg-primary',
  },
  emerald: {
    bg: 'bg-foreground/10',
    border: 'border-foreground/20',
    text: 'text-foreground',
    dot: 'bg-foreground',
  },
  indigo: {
    bg: 'bg-field-lilac',
    border: 'border-field-lilac-ink',
    text: 'text-field-lilac-ink',
    dot: 'bg-field-lilac-ink',
  },
  lime: {
    bg: 'bg-field-green',
    border: 'border-field-green-ink',
    text: 'text-field-green-ink',
    dot: 'bg-field-green-ink',
  },
  orange: {
    bg: 'bg-field-coral',
    border: 'border-field-coral-ink',
    text: 'text-field-coral-ink',
    dot: 'bg-field-coral-ink',
  },
  purple: {
    bg: 'bg-field-lilac',
    border: 'border-field-lilac-ink',
    text: 'text-field-lilac-ink',
    dot: 'bg-field-lilac-ink',
  },
  rose: {
    bg: 'bg-field-rose',
    border: 'border-field-rose-ink',
    text: 'text-field-rose-ink',
    dot: 'bg-field-rose-ink',
  },
  sky: {
    bg: 'bg-field-sky',
    border: 'border-field-sky-ink',
    text: 'text-field-sky-ink',
    dot: 'bg-field-sky-ink',
  },
  teal: {
    bg: 'bg-field-green',
    border: 'border-field-green-ink',
    text: 'text-field-green-ink',
    dot: 'bg-field-green-ink',
  },
};

const FALLBACK_STYLE = BUCKET_LIST_CATEGORY_STYLES.emerald;

export function getBucketListCategoryStyle(color: string): BucketListCategoryStyle {
  return BUCKET_LIST_CATEGORY_STYLES[color] ?? FALLBACK_STYLE;
}
