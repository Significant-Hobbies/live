import {
  externalDreamResearchLinks,
  searchDreamAtlas,
  type DreamAtlasEntry,
} from '~/lib/dream-atlas';
import { relevantQuestsForPossibility, SIDE_QUESTS, type SideQuest } from '~/lib/side-quests';

export type DreamDoor = {
  kind: 'native' | 'quest' | 'research';
  label: string;
  title: string;
  description: string;
  href: string;
};

export function selectDreamDoor(
  dreamTitle: string,
  entries: DreamAtlasEntry[],
  quests: SideQuest[] = SIDE_QUESTS
): DreamDoor {
  const native = searchDreamAtlas(entries, dreamTitle, 5).find(
    (match) => match.strength === 'native' && match.entry.firstStep
  );
  if (native?.entry.firstStep) {
    return {
      kind: 'native',
      label: 'Developed in Live',
      title: native.entry.firstStep.title,
      description: native.entry.firstStep.body,
      href: `/experiences/${native.entry.slug}`,
    };
  }

  const quest = relevantQuestsForPossibility(quests, dreamTitle)[0];
  if (quest) {
    return {
      kind: 'quest',
      label: 'A nearby side quest',
      title: quest.title,
      description: quest.description,
      href: `/side-quests?q=${encodeURIComponent(quest.id)}`,
    };
  }

  const research = externalDreamResearchLinks(dreamTitle)[0];
  return {
    kind: 'research',
    label: 'The honest first door',
    title: 'Research one real doorway',
    description:
      'Live does not have enough evidence to invent a task for this dream. Start with current official experiences and programmes instead.',
    href: research?.href ?? `/experiences?q=${encodeURIComponent(dreamTitle)}`,
  };
}
