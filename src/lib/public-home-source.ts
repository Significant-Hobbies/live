import content from '../../landing-astro/src/content/live.json';
import { EXPERIENCE_ENTRIES } from './experiences';

const origin = 'https://significanthobbies.com';
const link = (value: { label: string; href: string }) =>
  `[${value.label}](${new URL(value.href, origin).href})`;

export function publicHomeMarkdown(): string {
  const { hero, sections, closing } = content;
  const lines = [`# ${hero.title}`, hero.eyebrow, hero.lede, link(hero.primary), hero.note];
  for (const section of sections) {
    lines.push(`## ${section.title}`);
    if (section.eyebrow) lines.push(section.eyebrow);
    if (section.lede)
      lines.push(section.lede.replace('{count}', String(EXPERIENCE_ENTRIES.length)));
    if (section.kind === 'grid') {
      for (const item of section.items ?? []) {
        if (!('label' in item) || !('href' in item)) throw new Error('Unmapped gallery grid item');
        lines.push(`### ${item.title}`, link({ label: item.label, href: item.href }));
        if (item.image && item.alt)
          lines.push(`![${item.alt}](${new URL(item.image, origin).href})`);
      }
    } else if (section.kind === 'statement') {
      for (const row of section.rows ?? []) {
        lines.push(`### ${row.title}`, row.body);
        if (row.status) lines.push(row.status);
      }
    } else if (section.kind === 'faq') {
      for (const item of section.items ?? []) {
        if (!('q' in item) || !('a' in item)) throw new Error('Unmapped gallery FAQ item');
        lines.push(`### ${item.q}`, item.a);
      }
    } else if (section.kind !== 'cover')
      throw new Error(`Unmapped gallery section: ${section.kind}`);
    if (section.credit) lines.push(section.credit);
  }
  lines.push(`## ${closing.title}`, link(closing.primary), closing.credit);
  return `${lines.join('\n\n')}\n\n> Source: ${origin}/\n`;
}
