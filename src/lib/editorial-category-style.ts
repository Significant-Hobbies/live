const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Wellbeing: { bg: 'bg-foreground/10', text: 'text-foreground', border: 'border-foreground/20' },
  'Getting Started': {
    bg: 'bg-primary/10',
    text: 'text-foreground',
    border: 'border-primary/30',
  },
  Psychology: {
    bg: 'bg-field-lilac',
    text: 'text-field-lilac-ink',
    border: 'border-field-lilac-ink',
  },
  Reflection: { bg: 'bg-field-sky', text: 'text-field-sky-ink', border: 'border-field-sky-ink' },
  Inspiration: {
    bg: 'bg-field-coral',
    text: 'text-field-coral-ink',
    border: 'border-field-coral-ink',
  },
};

export function editorialCategoryStyle(category: string) {
  return (
    CATEGORY_COLORS[category] ?? {
      bg: 'bg-card/40',
      text: 'text-muted-foreground',
      border: 'border-border',
    }
  );
}
