export type ExperienceImage = {
  src: string;
  srcSet?: string;
  alt: string;
};

function photo(name: string, alt: string, directory = 'categories'): ExperienceImage {
  return {
    src: `/${directory}/${name}-800.webp`,
    srcSet: [400, 800, 1200]
      .map((width) => `/${directory}/${name}-${width}.webp ${width}w`)
      .join(', '),
    alt,
  };
}

const outdoor = photo('outdoor', 'A trail through a sunlit mountain forest');
const creative = photo('creative', 'Paintbrushes and well-used art materials in a studio');
const social = photo('social', 'Friends gathered around a candlelit dinner table');
const cooking = photo('culinary', 'Hands preparing fresh ingredients in a kitchen');
const coast = photo('physical', 'A person running beside the sea at sunset');
const writing = photo('writing', 'A hand writing in an open notebook', 'experiences');
const yoga = photo('yoga', 'Friends practicing yoga on a deck beside a lake', 'experiences');

const CATEGORY_IMAGES: Record<string, ExperienceImage> = {
  travel: outdoor,
  adventure: outdoor,
  creative,
  achievement: photo('intellectual', 'A chessboard beside a stack of books'),
  relationships: social,
  contribution: social,
  food: cooking,
  health: coast,
  mindfulness: yoga,
  reflection: writing,
};

// Supporting photography, never a record of the person's own experience.
// Keep matching local: private titles are never sent to an image provider.
const SUBJECT_IMAGES: [RegExp, ExperienceImage][] = [
  [
    /northern lights|aurora/i,
    photo('aurora', 'Green aurora reflected in a lake beneath the night sky', 'experiences'),
  ],
  [
    /safari|serengeti/i,
    photo('safari', 'A giraffe in the open Serengeti grasslands', 'experiences'),
  ],
  [
    /kyoto|cherry blossom|japan/i,
    photo('kyoto', 'Cherry blossoms beside a pagoda in Kyoto', 'experiences'),
  ],
  [
    /machu picchu|seven wonders/i,
    photo(
      'machu-picchu',
      'The stone terraces of Machu Picchu among green mountains',
      'experiences'
    ),
  ],
  [/taj mahal/i, photo('taj-mahal', 'The Taj Mahal reflected in its garden pool', 'experiences')],
  [
    /pyramid|giza/i,
    photo('pyramids', 'The pyramids of Giza rising above the desert', 'experiences'),
  ],
  [
    /angkor|cambodia/i,
    photo('angkor', 'The stone towers of Angkor Wat beneath a blue sky', 'experiences'),
  ],
  [
    /dead sea/i,
    photo('dead-sea', 'Salt formations beside the clear waters of the Dead Sea', 'experiences'),
  ],
  [/midnight sun/i, coast],
  [
    /antarctic|polar expedition|glacier/i,
    photo('iceberg', 'An iceberg floating in Antarctic waters', 'experiences'),
  ],
  [
    /railway|\btrain\b|orient express/i,
    photo('railway', 'A train crossing a mountain viaduct', 'experiences'),
  ],
  [
    /road trip|route 66|motorcycle|50 us states/i,
    photo('road-trip', 'Route 66 stretching into the desert', 'experiences'),
  ],
  [
    /greek|sail|island/i,
    photo('islands', 'Greek island coastline above the blue sea', 'experiences'),
  ],
  [/reef|dive|diving|snorkel/i, photo('reef', 'Coral beneath clear blue water', 'experiences')],
  [
    /rainforest|amazon/i,
    photo('rainforest', 'A winding river surrounded by dense tropical forest', 'experiences'),
  ],
  [
    /pottery|ceramic|clay|kiln/i,
    {
      src: '/images/live-more/pottery-v1.webp',
      alt: 'Hands shaping a clay bowl at a pottery table',
    },
  ],
  [
    /bike|bicycle|cycling|cycle/i,
    {
      src: '/images/live-more/bike-ride-v1.webp',
      alt: 'Two friends riding bicycles along a neighborhood street',
    },
  ],
  [
    /swim|lake|cold.water/i,
    { src: '/images/live-more/lake-jump-v1.webp', alt: 'Friends swimming and jumping into a lake' },
  ],
  [/pasta|cook|bake|bread|meal|recipe|cuisine/i, cooking],
  [
    /photograph|camera|photo book/i,
    photo('camera', 'Hands holding a camera outdoors', 'experiences'),
  ],
  [
    /\bwrite|writing|novel|memoir|letter|journal|gratitude|grateful|poem|poetry|annual report|timeline/i,
    writing,
  ],
  [/yoga|meditat|breathwork|mindful/i, yoga],
  [
    /guitar|piano|song|music|instrument|\bsing\b|singing|violin|compose/i,
    photo('music', 'A musician playing an upright piano'),
  ],
  [
    /woodwork|furniture|build.*hands|carpentry/i,
    photo('making', 'Hands working a piece of wood in a workshop'),
  ],
  [/paint|draw|calligraphy|illustrat|\bart\b/i, creative],
  [/dinner|friend|family|reconnect|host|volunteer|mentor/i, social],
  [/hike|hiking|trek|mountain|camino|camp|trail|walk|forest|park/i, outdoor],
  [/\brun\b|running|marathon|screen.free|no screens|sunset|sunrise/i, coast],
];

export function experienceImage(title: string, category?: unknown): ExperienceImage | null {
  const subject = SUBJECT_IMAGES.find(([pattern]) => pattern.test(title));
  if (subject) return subject[1];
  return typeof category === 'string' ? (CATEGORY_IMAGES[category] ?? null) : null;
}
