export type ExperienceCollection = {
  slug: string;
  title: string;
  description: string;
  introduction: string;
  choosing: string;
  items: { slug: string; why: string }[];
};

/** Deliberate selections, not indexable copies of every possible filter. */
export const EXPERIENCE_COLLECTIONS: ExperienceCollection[] = [
  {
    slug: 'low-cost',
    title: 'Low-cost bucket list ideas worth making time for',
    description:
      'Choose inexpensive bucket list ideas using what you already have: letters, photographs, creative projects and meaningful time with others.',
    introduction:
      'A bucket list does not have to start with flights or expensive equipment. These ideas depend more on attention, a conversation or a finished small project. Many can use a notebook, a phone or things already at home. Low cost means choosing that version deliberately; printing, travel and new materials can still add to the bill.',
    choosing:
      'Start with the supplies and time you have. Pick one idea you would still want to do if there were no photograph to post. If another person is involved, ask them before treating their time as part of your plan.',
    items: [
      {
        slug: 'write-a-letter-to-someone-who-changed-your-life-and-send-it',
        why: 'An email can cost nothing. The effort is remembering the particular thing they did and telling them clearly.',
      },
      {
        slug: 'take-a-photograph-that-stops-people-in-their-tracks',
        why: 'Use a phone camera and a familiar place. Looking at light and composition comes before buying equipment.',
      },
      {
        slug: 'co-write-something-with-a-friend',
        why: 'A shared document and an agreed finish date are enough to make a short piece together.',
      },
      {
        slug: 'record-your-parents-life-stories',
        why: 'A device you already have can preserve a conversation. Permission, listening and a backup matter more than a studio.',
      },
      {
        slug: 'make-a-timeline-of-the-five-most-important-moments-of-your-life',
        why: 'Paper and an hour can give shape to memories that otherwise stay scattered.',
      },
      {
        slug: 'make-a-list-of-100-things-you-are-grateful-for',
        why: 'No purchase or daily commitment: just one specific list you can return to.',
      },
      {
        slug: 'memorise-a-long-poem-or-speech',
        why: 'Choose a text you can already access, then spend short sessions learning something you want to carry with you.',
      },
      {
        slug: 'spend-an-afternoon-doing-one-thing-at-a-time',
        why: 'Use an ordinary activity you already enjoy and remove the competing invitations for an afternoon.',
      },
    ],
  },
  {
    slug: 'solo',
    title: 'Solo bucket list ideas you can start on your own',
    description:
      'Find solo bucket list ideas with practical first steps, from painting and photography to letters, memory projects and a screen-free day.',
    introduction:
      'Some experiences are easier to begin when no one else has to share your schedule. These ideas give you something to make, notice or understand on your own. Solo does not have to mean remote travel or isolation: a familiar kitchen, a table or a nearby street can be enough.',
    choosing:
      'Choose by the kind of afternoon you want. Making something leaves an object; reflection leaves a record; photography asks you to look more closely. Keep the scope small enough to finish a first version, and share the result only if you want to.',
    items: [
      {
        slug: 'learn-watercolour-painting',
        why: 'Make a postcard-sized painting and repeat the subject without coordinating a class or another person.',
      },
      {
        slug: 'learn-calligraphy',
        why: 'Short practice sessions lead to a finished phrase or card you can keep or give away.',
      },
      {
        slug: 'learn-to-draw-portraits',
        why: 'Use a permitted photograph and compare two studies of the same person.',
      },
      {
        slug: 'take-a-photograph-that-stops-people-in-their-tracks',
        why: 'Set yourself one subject and take enough time to notice its light and surroundings.',
      },
      {
        slug: 'write-a-letter-to-your-younger-self',
        why: 'This can stay entirely private; you decide which memory to address and what to keep.',
      },
      {
        slug: 'create-a-personal-annual-report',
        why: 'Gather your own records and write a short account of a year without turning it into a scorecard.',
      },
      {
        slug: 'make-a-timeline-of-the-five-most-important-moments-of-your-life',
        why: 'Choose the moments by their meaning to you rather than by what would impress an audience.',
      },
      {
        slug: 'spend-a-full-day-with-no-screens',
        why: 'Plan a day around your responsibilities and the offline activities you actually enjoy.',
      },
      {
        slug: 'memorise-a-long-poem-or-speech',
        why: 'Learn at your own pace and choose whether the final recital is private or shared.',
      },
    ],
  },
  {
    slug: 'weekend',
    title: 'Weekend bucket list ideas with a finish in sight',
    description:
      'Pick a bucket list idea for this weekend: cook from scratch, make a short film, reconnect with someone or finish a small personal project.',
    introduction:
      'A weekend is enough for a complete small experience, even when a larger ambition takes longer. These selections have a version you can finish in a day or two. That means making a first film, serving homemade pasta or sending a letter, rather than promising mastery of a new skill by Sunday.',
    choosing:
      'Check whether the idea needs a booking, another person or materials before the weekend begins. Leave time for the part people forget: editing, cleaning up, sending the letter or saving the final file. Pick one main experience so the weekend does not become a list of errands.',
    items: [
      {
        slug: 'make-pasta-from-scratch',
        why: 'One afternoon can end with a meal you made, using a rolling pin instead of specialist machinery.',
      },
      {
        slug: 'create-a-short-film',
        why: 'Keep it to one location and a few minutes, with time for both filming and a complete edit.',
      },
      {
        slug: 'co-write-something-with-a-friend',
        why: 'Agree on a short form and finish a shared draft rather than starting an indefinite collaboration.',
      },
      {
        slug: 'write-a-letter-to-someone-who-changed-your-life-and-send-it',
        why: 'Draft, reread and send it. Receiving a reply is not part of your deadline.',
      },
      {
        slug: 'reconnect-with-someone-you-ve-lost-touch-with',
        why: 'A thoughtful message is a useful first step; a meeting depends on what works for both people.',
      },
      {
        slug: 'take-a-photograph-that-stops-people-in-their-tracks',
        why: 'Leave room for an outing, selecting the best frame and finishing that one image.',
      },
      {
        slug: 'create-a-personal-annual-report',
        why: 'A quiet afternoon and existing records can produce a short report of a completed year.',
      },
      {
        slug: 'spend-a-full-day-with-no-screens',
        why: 'Prepare essential contact and offline plans first, then give one full day to the experiment.',
      },
    ],
  },
  {
    slug: 'at-home',
    title: 'Bucket list ideas to do at home with what you have',
    description:
      'Explore bucket list ideas you can do at home, including cooking, creative work, family photographs and private reflection projects.',
    introduction:
      'Staying home does not rule out a memorable experience. These ideas turn a familiar room, kitchen or collection of photographs into the setting for something deliberate. Some take an afternoon; others become a small project over several evenings. None requires a trip to another country.',
    choosing:
      'Choose an idea that suits your space and the people you share it with. Check what you already own before buying a kit. A completed digital book, small drawing or shared draft counts; expensive printing and equipment are choices, not requirements.',
    items: [
      {
        slug: 'make-pasta-from-scratch',
        why: 'Clear a kitchen surface and turn an ordinary meal into a hands-on project.',
      },
      {
        slug: 'create-a-family-cookbook-with-old-recipes',
        why: 'Collect recipes remotely and test them in your own kitchen before sharing a small first edition.',
      },
      {
        slug: 'master-one-dish-so-well-you-could-teach-it',
        why: 'Repeat a dish in your usual kitchen until you can explain your method to another cook.',
      },
      {
        slug: 'learn-watercolour-painting',
        why: 'A small table, suitable paper and a limited set of paints can support a first painting.',
      },
      {
        slug: 'learn-calligraphy',
        why: 'Practise at a desk and use the lettering on a card instead of collecting more supplies.',
      },
      {
        slug: 'create-a-photo-book-of-one-year-of-your-life',
        why: 'Sort a completed year into a digital book; ordering a printed copy can come later.',
      },
      {
        slug: 'write-a-letter-to-your-future-self-and-read-it-in-10-years',
        why: 'Write and preserve the letter now, while remembering that opening it later completes the full goal.',
      },
      {
        slug: 'write-a-letter-to-your-younger-self',
        why: 'Choose a remembered moment and write for yourself without an audience.',
      },
      {
        slug: 'make-a-list-of-100-things-you-are-grateful-for',
        why: 'Build one thoughtful list rather than adding another daily routine to maintain.',
      },
    ],
  },
  {
    slug: 'creative',
    title: 'Creative bucket list ideas that end with something made',
    description:
      'Find creative bucket list projects with practical plans for painting, pottery, photography, film, calligraphy and collaborative writing.',
    introduction:
      'A creative ambition becomes easier to approach when it has a first finished version. These ideas lead to an object, image, text or performance you can point to. You do not need to make a business from it, gain an audience or prove you have talent before starting.',
    choosing:
      'Choose the kind of making you want: hands and materials, a camera, words or a live audience. Limit the first project and use the equipment you already have where possible. A pottery class has a firing wait; a film has an editing stage; a performance needs willing listeners.',
    items: [
      {
        slug: 'take-a-pottery-class-and-make-a-finished-piece',
        why: 'Book a class that includes the whole process, then collect a fired piece rather than stopping at wet clay.',
      },
      {
        slug: 'learn-watercolour-painting',
        why: 'Learn how your paint and paper behave through small tests and a postcard-sized painting.',
      },
      {
        slug: 'paint-something-you-re-proud-to-hang-on-a-wall',
        why: 'Choose a place for the finished work before choosing an ambitious canvas size.',
      },
      {
        slug: 'learn-calligraphy',
        why: 'One style, a few basic strokes and a short phrase give you a clear first project.',
      },
      {
        slug: 'learn-to-draw-portraits',
        why: 'Repeating one reference makes a specific improvement easier to see.',
      },
      {
        slug: 'take-a-photograph-that-stops-people-in-their-tracks',
        why: 'Build an image around one subject and finish the selected frame deliberately.',
      },
      {
        slug: 'create-a-short-film',
        why: 'Tell one small story and export a complete cut before expanding the production.',
      },
      {
        slug: 'co-write-something-with-a-friend',
        why: 'Make room for two voices and agree on how to edit, credit and share the result.',
      },
      {
        slug: 'write-and-perform-spoken-word-poetry',
        why: 'Write for the ear and deliver a short piece to an audience you choose.',
      },
    ],
  },
  {
    slug: 'with-friends',
    title: 'Bucket list ideas to share with friends and family',
    description:
      'Choose shared bucket list experiences: cook together, co-write, make a film, take pottery or preserve a family conversation.',
    introduction:
      'The shared part of an experience can matter more than the destination. These ideas give friends or family something to make, learn or remember together. Start by asking what the other person would enjoy; being on your bucket list does not automatically put it on theirs.',
    choosing:
      'Agree on the time, budget and smallest finished version together. Give everyone a role without turning the outing into a production. If you record people, use their photographs or publish a shared piece, agree on permission and credit before making it public.',
    items: [
      {
        slug: 'make-pasta-from-scratch',
        why: 'Share kneading, shaping and cooking, then sit down to the meal you made.',
      },
      {
        slug: 'create-a-family-cookbook-with-old-recipes',
        why: 'Let contributors keep their stories and variations while you make the recipes usable for another generation.',
      },
      {
        slug: 'master-one-dish-so-well-you-could-teach-it',
        why: 'Invite a willing friend to cook from your instructions and help you find the missing steps.',
      },
      {
        slug: 'take-a-pottery-class-and-make-a-finished-piece',
        why: 'Book the same beginner session and compare your pieces after firing and collection.',
      },
      {
        slug: 'create-a-short-film',
        why: 'A small cast and one location make room for collaboration without a large production.',
      },
      {
        slug: 'co-write-something-with-a-friend',
        why: 'Choose a short form and finish a draft that both of you are happy to call yours.',
      },
      {
        slug: 'record-your-parents-life-stories',
        why: 'Make the conversation comfortable for the storyteller and preserve it under their sharing agreement.',
      },
    ],
  },
];

export function findExperienceCollection(slug: string): ExperienceCollection | undefined {
  return EXPERIENCE_COLLECTIONS.find((collection) => collection.slug === slug);
}

export function collectionsForExperience(slug: string): ExperienceCollection[] {
  return EXPERIENCE_COLLECTIONS.filter((collection) =>
    collection.items.some((item) => item.slug === slug)
  );
}
