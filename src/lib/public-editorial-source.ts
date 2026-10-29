import {
  SideQuestHero,
  QuestCardView,
  CategoryPill,
  DifficultyDots,
} from '~/components/public-pages/side-quests';
import { SIDE_QUESTS } from './side-quests';
import { Dices } from 'lucide-react';
import ExplorePage, { ExploreStat } from '~/components/public-pages/explore-index';
import { ExploreClient } from '~/app/explore/explore-client';
import {
  ExploreView,
  ExploreTimelineCard,
  MiniStat,
  ExploreBackfill,
  ExploreFooter,
  filterExploreTimelines,
} from '~/components/public-pages/explore';
import { CalendarDays, Layers3, LayoutList } from 'lucide-react';
import type { TimelineData } from './types';
import { ExperiencesIndexView } from '~/components/public-pages/experiences-index';
import { ExperiencesClient } from '~/app/experiences/experiences-client';
import {
  ExperiencesView,
  CatalogFilterRow,
  CatalogChip,
} from '~/components/public-pages/experiences-catalog';
import { ResultPagination } from '~/components/result-pagination';
import { searchExperienceCatalog } from '~/server/experience-catalog';
import { parseCatalogQuery } from './catalog-seed';
import type { CatalogPage, CatalogQuery } from './catalog-types';
import SearchPage from '~/app/search/page';
import { SearchPageClient } from '~/app/search/search-client';
import { PublicSearchInput } from '~/components/public-pages/search-input';
import { Input } from '~/components/ui/input';
import { Search } from 'lucide-react';
import HobbiesPage from '~/app/hobbies/page';
import { HobbyFacetsClient } from '~/app/hobbies/hobby-facets-client';
import { HobbyFacetsView } from '~/components/public-pages/hobby-facets';
import { QuizQuestions } from '~/components/public-pages/hobby-quiz';
import { QUESTIONS } from './hobby-quiz-questions';
import ComparePage from '~/app/compare/page';
import { CompareClient } from '~/app/compare/compare-client';
import { CompareView, comparisonLabels } from '~/components/public-pages/compare';
import LifeBingoPage from '~/app/life-bingo/page';
import { BingoBoard } from '~/components/bucket-list/bingo-board';
import { BingoBoard as PublicBingoBoard } from '~/components/bucket-list/public-bingo-board';
import { Button } from '~/components/ui/button';
import { Check, Circle } from 'lucide-react';
import { BirthDateForm, LifeInWeeksIntro } from '~/components/public-pages/life-in-weeks';
import {
  TimeCalculatorView,
  timeCalculatorDefaults,
} from '~/components/public-pages/time-calculator';
import {
  CostCalculatorView,
  CostStat,
  SEED_ITEMS,
} from '~/components/public-pages/cost-calculator';
import {
  Briefcase,
  Car,
  ChefHat,
  Dumbbell,
  Heart,
  Home,
  Moon,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { GetStartedView } from '~/components/public-pages/get-started';
import { Link2, Map as MapIcon } from 'lucide-react';
import BlogIndex, { PostCard, PostCardContent } from '~/components/public-pages/blog-index';
import BlogPage, { BlogContent, RelatedCard } from '~/components/public-pages/blog-detail';
import { getEditorialArticle } from './editorial-content';
import CategoryPage from '~/app/hobbies/category/[category]/page';
import Image from 'next/image';
import { ArrowRight, BookOpen, Compass, Users } from 'lucide-react';
import { renderHobbyContent } from '~/components/public-pages/hobby-detail';
import { HobbyRoadmapCard } from '~/components/hobby-roadmap-card';
import { HobbyRoadmapView, EMPTY_PROGRESS } from '~/components/public-hobby-roadmap';
import type { HobbyRoadmap } from './hobby-roadmap';
import { Badge } from '~/components/ui/badge';
import { HOBBY_CATEGORIES } from './hobbies';
import CollectionsIndex from '~/app/experiences/collections/page';
import CollectionPage from '~/app/experiences/collections/[slug]/page';
import { findExperienceCollection } from './experience-collections';
import {
  renderExperienceContent,
  ExperienceTag,
} from '~/components/public-pages/experience-detail';
import { renderBucketListContent } from '~/components/public-pages/bucket-list-detail';
import { AddToMyListButton } from '~/components/add-to-my-list-button';
import { ExperienceCollectionLinks } from '~/components/experience-collection-links';
import { addToMyListLabel } from './public-button-copy';
import { findExperience } from './experiences';
import { getFamousBucketList } from './famous-bucket-lists';
import { createElement, type ReactNode } from 'react';
import Link from 'next/link';
import { Calculator, Package, Scale, Target, Timer } from 'lucide-react';
import JourneysIndex from '~/app/journeys/page';
import BucketListsIndex from '~/app/bucket-lists/page';
import ToolsIndex from '~/app/tools/page';
import JourneyPage from '~/app/journeys/[slug]/page';
import { FAMOUS_JOURNEYS } from './famous-journeys';
import {
  AnimatedTabs,
  NumberTicker,
  CardHoverEffect,
  FadeIn,
  GradientMesh,
  GridBackground,
  SpotlightCard,
  StaggerContainer,
  StaggerItem,
  TextGenerateEffect,
} from '~/components/aceternity';
import { JsonLd } from '~/components/json-ld';
import { Whale } from '~/components/whale';
import { GitHubIcon } from '~/components/github-icon';
import { AdultHobbySection, HobbyCard } from '~/components/public-adult-hobby-section';
import { reactSourceMarkdown } from './react-source-markdown';
import Page0 from '~/app/about/page';
import Page1 from '~/app/bucket-list-before-30/page';
import Page2 from '~/app/bucket-list-before-50/page';
import Page3 from '~/app/bucket-list-ideas/page';
import Page4 from '~/app/changelog/page';
import Page5 from '~/app/cheap-hobbies/page';
import Page6 from '~/app/hobbies-for-adults/page';
import Page7 from '~/app/hobbies-for-mental-health/page';
import Page8 from '~/app/hobbies-for-resume/page';
import Page9 from '~/app/hobbies-to-try/page';
import Page10 from '~/app/how-to-make-a-bucket-list/page';
import Page11 from '~/app/manifesto/page';
import Page12 from '~/app/privacy/page';
import Page13 from '~/app/starter-kits/page';
import Page14 from '~/app/terms/page';
import Page15 from '~/app/travel-bucket-list/page';
import Page16 from '~/app/what-are-significant-hobbies/page';

const pages: Record<string, () => ReactNode> = {
  '/about': Page0,
  '/side-quests': () => [
    SideQuestHero(),
    ...SIDE_QUESTS.map((quest) =>
      QuestCardView({
        quest,
        isCompleted: false,
        copied: false,
        showShareButton: true,
        onComplete: () => undefined,
        onUncomplete: () => undefined,
        onRollAgain: () => undefined,
        handleShare: () => undefined,
      })
    ),
  ],
  '/hobbies': HobbiesPage,
  '/find-your-hobby': () =>
    QUESTIONS.map((_, step) =>
      QuizQuestions({
        step,
        selectedOption: null,
        handleSelect: () => undefined,
        handleNext: () => undefined,
        includeHeader: step === 0,
      })
    ),
  '/compare': ComparePage,
  '/life-bingo': LifeBingoPage,
  '/life-in-weeks': () => [
    LifeInWeeksIntro(),
    BirthDateForm({
      raw: '',
      hasResult: false,
      invalid: false,
      onSubmit: () => undefined,
      setRaw: () => undefined,
      setInvalid: () => undefined,
      setEditingBirthDate: () => undefined,
    }),
  ],
  '/tools/time-calculator': () =>
    TimeCalculatorView({ values: timeCalculatorDefaults(), handleChange: () => undefined }),
  '/tools/cost-calculator': () =>
    CostCalculatorView({
      items: SEED_ITEMS,
      setItems: () => undefined,
      hobbyName: 'My hobby',
      setHobbyName: () => undefined,
      addItem: () => undefined,
      updateItem: () => undefined,
      removeItem: () => undefined,
      loadPreset: () => undefined,
    }),
  '/get-started': () =>
    GetStartedView({
      input: '',
      state: 'idle',
      validationError: null,
      handleChange: () => undefined,
    }),
  '/blog': BlogIndex,
  '/experiences/collections': CollectionsIndex,
  '/journeys': JourneysIndex,
  '/bucket-lists': BucketListsIndex,
  '/tools': ToolsIndex,
  '/bucket-list-before-30': Page1,
  '/bucket-list-before-50': Page2,
  '/bucket-list-ideas': Page3,
  '/changelog': Page4,
  '/cheap-hobbies': Page5,
  '/hobbies-for-adults': Page6,
  '/hobbies-for-mental-health': Page7,
  '/hobbies-for-resume': Page8,
  '/hobbies-to-try': Page9,
  '/how-to-make-a-bucket-list': Page10,
  '/manifesto': Page11,
  '/privacy': Page12,
  '/starter-kits': Page13,
  '/terms': Page14,
  '/travel-bucket-list': Page15,
  '/what-are-significant-hobbies': Page16,
};

// These adapters express reviewed component semantics without invoking hooks,
// client references, effects, navigation or the rendered HTML output.
const adapters = new Map<
  unknown,
  (props: Record<string, unknown> & { children?: ReactNode }) => ReactNode
>([
  [Image, (props) => createElement('img', { src: props.src, alt: props.alt })],
  [Badge, (props) => createElement('span', null, props.children)],
  [
    HobbyRoadmapCard,
    (props) =>
      HobbyRoadmapView({
        roadmap: props.roadmap as HobbyRoadmap,
        progress: EMPTY_PROGRESS,
        hydrated: false,
        toggleStep: () => undefined,
        updateNotes: () => undefined,
      }),
  ],
  [NumberTicker, (props) => String(props.value)],
  [BingoBoard, (props) => PublicBingoBoard(props as Parameters<typeof PublicBingoBoard>[0])],
  [
    Button,
    (props) => (props.asChild ? props.children : createElement('button', null, props.children)),
  ],
  [
    CompareClient,
    () =>
      CompareView({
        hobbyA: null,
        hobbyB: null,
        detailA: false,
        detailB: false,
        selectorA: createElement(
          'div',
          null,
          comparisonLabels.a,
          createElement('input', { placeholder: comparisonLabels.placeholder })
        ),
        selectorB: createElement(
          'div',
          null,
          comparisonLabels.b,
          createElement('input', { placeholder: comparisonLabels.placeholder })
        ),
        comparison: null,
        setHobbyA: () => undefined,
        setHobbyB: () => undefined,
      }),
  ],
  [
    HobbyFacetsClient,
    () => HobbyFacetsView({ selected: [], toggle: () => undefined, setSelected: () => undefined }),
  ],
  [Input, (props) => createElement('input', props)],
  [Search, () => null],
  [Dices, () => null],
  ...[CalendarDays, Layers3, LayoutList].map((icon) => [icon, () => null] as const),
  [SearchPageClient, () => PublicSearchInput({ value: '', handleChange: () => undefined })],
  [ResultPagination, () => null],
  [
    ExperiencesClient,
    (props) => {
      const initialQuery = props.initialQuery as CatalogQuery;
      const initialPage = props.initialPage as CatalogPage;
      return ExperiencesView({
        initialPage,
        mode: 'local',
        query: initialQuery.query,
        category: initialQuery.category,
        kind: initialQuery.kind,
        page: initialQuery.page,
        catalog: { data: initialPage, loading: false, error: '' },
        setQuery: () => undefined,
        setCategory: () => undefined,
        setKind: () => undefined,
        setPage: () => undefined,
        updateUrl: () => undefined,
        resultSummary: { current: null },
        pageFocus: { current: false },
      });
    },
  ],
  [
    ExploreClient,
    (props) => {
      const timelines = props.timelines as TimelineData[];
      return ExploreView({
        timelines,
        filtered: filterExploreTimelines(timelines, '', 'all', null),
        query: '',
        sort: 'all',
        categoryFilter: null,
        setQuery: () => undefined,
        setSort: () => undefined,
        setCategoryFilter: () => undefined,
      });
    },
  ],
  [
    AnimatedTabs,
    (props) =>
      createElement(
        'div',
        null,
        (props.tabs as { id: string; label: string }[]).map((tab) =>
          createElement('button', { key: tab.id }, tab.label)
        )
      ),
  ],
  [AddToMyListButton, () => addToMyListLabel],
  [Link, (props) => createElement('a', { href: props.href }, props.children)],
  [CardHoverEffect, (props) => createElement('div', null, props.children)],
  ...[
    Calculator,
    Package,
    Scale,
    Target,
    Timer,
    ArrowRight,
    BookOpen,
    Compass,
    Users,
    Link2,
    MapIcon,
    Briefcase,
    Car,
    ChefHat,
    Dumbbell,
    Heart,
    Home,
    Moon,
    Smartphone,
    Sparkles,
    Check,
    Circle,
  ].map((icon) => [icon, () => null] as const),
  [FadeIn, (props) => createElement('div', null, props.children)],
  [StaggerContainer, (props) => createElement(String(props.as || 'div'), null, props.children)],
  [StaggerItem, (props) => createElement(String(props.as || 'div'), null, props.children)],
  [SpotlightCard, (props) => createElement('div', null, props.children)],
  [
    TextGenerateEffect,
    (props) => createElement(String(props.as || 'div'), null, String(props.words)),
  ],
  [GridBackground, () => null],
  [GradientMesh, () => null],
  [JsonLd, () => null],
  [GitHubIcon, () => null],
  [Whale, () => 'Whale — your gentle companion'],
]);

export const publicEditorialPaths = Object.keys(pages);

export function renderPublicEditorialSource(path: string): string | null {
  const component = pages[path];
  if (!component) return null;
  return renderPublicTree(component(), path);
}

export async function renderPublicJourneySource(slug: string): Promise<string | null> {
  if (!FAMOUS_JOURNEYS.some((person) => person.slug === slug)) return null;
  return renderPublicTree(
    await JourneyPage({ params: Promise.resolve({ slug }) }),
    `/journeys/${slug}`
  );
}

export async function renderPublicExperienceSource(slug: string): Promise<string | null> {
  if (!findExperience(slug)?.description) return null;
  return renderPublicTree(
    await renderExperienceContent(Promise.resolve({ slug })),
    `/experiences/${slug}`
  );
}
export async function renderPublicBucketListSource(slug: string): Promise<string | null> {
  if (!getFamousBucketList(slug)) return null;
  return renderPublicTree(
    await renderBucketListContent(Promise.resolve({ slug })),
    `/bucket-lists/${slug}`
  );
}
function renderPublicTree(tree: ReactNode, path: string): string {
  const content = reactSourceMarkdown(createElement('main', null, tree), {
    origin: 'https://significanthobbies.com',
    includeFormDefaults: path.startsWith('/tools/'),
    components: [
      AdultHobbySection,
      HobbyCard,
      ExperienceTag,
      ExperienceCollectionLinks,
      PostCard,
      PostCardContent,
      BlogContent,
      RelatedCard,
      CostStat,
      CategoryPill,
      DifficultyDots,
      ExploreStat,
      ExploreTimelineCard,
      MiniStat,
      ExploreBackfill,
      ExploreFooter,
      CatalogFilterRow,
      CatalogChip,
    ],
    adapters,
  });
  return `${content}\n\n> Source: https://significanthobbies.com${path}\n`;
}

export async function renderPublicCollectionSource(slug: string): Promise<string | null> {
  if (!findExperienceCollection(slug)) return null;
  return renderPublicTree(
    await CollectionPage({ params: Promise.resolve({ slug }) }),
    `/experiences/collections/${slug}`
  );
}

export async function renderPublicHobbySource(slug: string): Promise<string | null> {
  const hobby = HOBBY_CATEGORIES.flatMap((category) => category.hobbies).find(
    (name) =>
      encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-')) === slug ||
      name.toLowerCase().replace(/\s+/g, '-') === slug
  );
  if (!hobby) return null;
  return renderPublicTree(
    await renderHobbyContent(Promise.resolve({ hobby: slug })),
    `/hobbies/${slug}`
  );
}

export async function renderPublicCategorySource(slug: string): Promise<string | null> {
  if (
    !HOBBY_CATEGORIES.some((category) => category.name.toLowerCase().replace(/\s+/g, '-') === slug)
  )
    return null;
  return renderPublicTree(
    await CategoryPage({ params: Promise.resolve({ category: slug }) }),
    `/hobbies/category/${slug}`
  );
}

export async function renderPublicBlogSource(slug: string): Promise<string | null> {
  if (!getEditorialArticle(slug)) return null;
  return renderPublicTree(await BlogPage({ params: Promise.resolve({ slug }) }), `/blog/${slug}`);
}

export async function renderPublicSearchSource(): Promise<string> {
  return renderPublicTree(await SearchPage({ searchParams: Promise.resolve({}) }), '/search');
}

export async function renderPublicExperiencesSource(): Promise<string> {
  const query = parseCatalogQuery(new URLSearchParams());
  query.pageSize = 20;
  const catalog = await searchExperienceCatalog(query);
  return renderPublicTree(ExperiencesIndexView({ catalog, query, mode: 'local' }), '/experiences');
}

export async function renderPublicExploreSource(): Promise<string> {
  return renderPublicTree(await ExplorePage(), '/explore');
}
