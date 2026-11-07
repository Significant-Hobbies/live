import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const REFLECTION_GUIDES: Record<string, CuratedExperienceGuide> = {
  'curate-a-five-object-museum-of-your-life': {
    title: 'Curate a five-object museum of your life',
    summary:
      'Choose everyday possessions and give each a label explaining a specific chapter of your life.',
    time: 'Allow an afternoon for choosing, labelling and arranging a tiny display.',
    cost: 'Use possessions you already own and simple paper labels.',
    place: 'A private shelf or table where objects can be displayed safely for a short time.',
    preparation:
      'Choose five ordinary items that connect to different parts of your life. Use photographs for fragile or borrowed things, decide who may see the display and avoid including someone else’s private correspondence without permission.',
    steps: [
      {
        title: 'Choose evidence rather than trophies',
        body: 'Select objects with specific use or memory attached, including something modest or unfinished. Ask what each item can show that a generic statement about your personality would miss.',
      },
      {
        title: 'Write short factual labels',
        body: 'Give each object a name, approximate date and one concrete story. Mark uncertain details honestly and distinguish the object’s original purpose from the meaning it acquired for you.',
      },
      {
        title: 'Arrange a readable exhibition',
        body: 'Place the objects and labels where their relationships make sense. Walk through the display alone or with a trusted viewer, then photograph or document it if wanted before returning items to safe storage.',
      },
    ],
    completion:
      'A five-object personal exhibition exists with clear labels and a deliberate arrangement.',
    tip: 'A bus pass, worn tool or repaired mug can carry more specific history than a prestigious souvenir.',
    updatedAt: '2026-11-08',
    resources: [
      {
        ...CATALOG_SOURCES['virginia-museum-of-history-culture-80b0b98043'],
        purpose:
          'Use the museum activity on choosing five personal objects, writing captions and arranging a small exhibition.',
      },
    ],
  },
  'make-a-map-of-places-you-call-home': {
    title: 'Make a map of places you call home',
    summary:
      'Mark places where you have felt belonging and compare what made each one feel like home.',
    time: 'Allow an hour or two, with a pause if memories become tiring.',
    cost: 'Paper and pens are sufficient; printed map fragments are optional.',
    place: 'A comfortable private table where you can spread out a few place references.',
    preparation:
      'Read the Zarina activity and choose a handful of places where you have felt at home. They may be rooms, cities or temporary settings; keep precise addresses private and avoid trying to document every place you have lived.',
    steps: [
      {
        title: 'Name the places through details',
        body: 'List an ordinary sound, doorway, smell or routine linked to each place. Let a specific detail establish why it felt like home instead of treating official residence dates as the only evidence.',
      },
      {
        title: 'Draw relationships rather than accuracy',
        body: 'Place the locations on a personal map, using distance, shape or colour to express their connections. Mark uncertain memories and leave room for more than one kind of belonging.',
      },
      {
        title: 'Read the map as a whole',
        body: 'Notice what the places share and which feel different now. Add a short key explaining your marks, then decide whether the map stays private or can be discussed with a trusted person.',
      },
    ],
    completion:
      'You have a personal map showing several forms of home and the details that connect them.',
    tip: 'A temporary room can belong on the map even if you never thought of it as a permanent address.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-museum-of-modern-art-13b4289582'],
        purpose:
          'Use the museum’s memory-of-home prompts as inspiration for an original multi-place map.',
      },
    ],
  },
  'build-a-personal-reading-family-tree': {
    title: 'Build a personal reading family tree',
    summary:
      'Connect books that led you to other books and identify the branches that shaped your thinking.',
    time: 'Allow an afternoon to gather titles and draw a manageable first tree.',
    cost: 'A notebook page and your existing reading records are enough.',
    place: 'A table with books, library history or a private reading list nearby.',
    preparation:
      'Choose a limited number of books that led you towards other reading. Read the reading-tree activity and adapt it to influences rather than a target count; include comics, translations or audiobooks where they belong in your history.',
    steps: [
      {
        title: 'Find the first branches',
        body: 'Write a few starting titles and recall how you found them. Connect each to the next book, author or subject it opened up, distinguishing actual remembered links from connections you only see in hindsight.',
      },
      {
        title: 'Add the people and accidents',
        body: 'Mark recommendations, libraries, classes or chance discoveries beside the relevant branches. Keep the tree small enough that the links remain readable rather than turning it into a list of everything you have read.',
      },
      {
        title: 'Choose a living branch',
        body: 'Look for an unfinished line of curiosity and select one possible next book. Date the map and keep its earlier version when you update it, preserving how your reading interests looked at this point.',
      },
    ],
    completion:
      'You have a reading tree showing influences and one intentional next branch to explore.',
    tip: 'A book you disliked can still belong if it sent you towards a different writer or question.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-scout-association-d04a4d68a1'],
        purpose:
          'Use the original reading-tree format and adapt its branches to your own remembered reading influences.',
      },
    ],
  },
  'revisit-a-saved-prediction-and-score-it-fairly': {
    title: 'Revisit a saved prediction and score it fairly',
    summary:
      'Find an old expectation, compare it with what happened and note what information you lacked.',
    time: 'Allow a short evidence-gathering session and an hour for a fair review.',
    cost: 'Use a prediction already in your records; no betting or paid forecasting service is needed.',
    place: 'A private workspace with the original dated prediction and relevant outcome evidence.',
    preparation:
      'Choose a low-stakes prediction whose outcome is now clear. Keep its original wording visible, read the forecasting resource’s scoring explanation and avoid selecting only a memorable success or rewriting a vague claim into something precise after the event.',
    steps: [
      {
        title: 'Recover the original terms',
        body: 'Find what you actually expected, by when and with what confidence. If the statement lacked a clear outcome or probability, label that limitation instead of manufacturing a precise score.',
      },
      {
        title: 'Check what happened',
        body: 'Gather reliable evidence that matches the original question and time period. Separate the result from whether your reasoning was sensible with the information available then, noting facts you could not have known.',
      },
      {
        title: 'Improve the next forecast',
        body: 'Record one lesson about question wording, evidence or confidence. If you make another prediction, state its resolution conditions in advance and set a date to review it rather than relying on memory.',
      },
    ],
    completion:
      'You have compared a dated expectation with its outcome without changing the original claim.',
    tip: 'Being right for a weak reason and wrong for a reasonable reason are different lessons; preserve both distinctions.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['good-judgment-open-ab4813dfb0'],
        purpose:
          'Read the forecasting organisation’s explanation of scoring, resolution and sharing reasoning.',
      },
    ],
  },
  'conduct-an-after-action-review-of-a-personal-project': {
    title: 'Conduct an after-action review of a personal project',
    summary:
      'Compare what you intended, what occurred and what you would carry into another attempt.',
    time: 'Allow an hour after a small project or event has finished.',
    cost: 'Existing notes and a plain document are enough for a useful review.',
    place: 'A quiet workspace, with collaborators invited only if they want to contribute.',
    preparation:
      'Choose one bounded project rather than reviewing your whole life. Read the after-action method and gather the original aim, a few process notes and the actual result; keep the exercise focused on learning rather than assigning blame.',
    steps: [
      {
        title: 'Recover the intended result',
        body: 'State what the project was supposed to produce and the conditions you expected. Use the original plan where possible so the review is not shaped entirely by how the outcome now feels.',
      },
      {
        title: 'Compare process with evidence',
        body: 'Identify what actually happened and where it differed, including things that worked. Link explanations to specific events or decisions, marking a plausible explanation as uncertain when evidence is missing.',
      },
      {
        title: 'Carry one lesson forward',
        body: 'Choose a small action that would improve the next similar project. Write when and how you would use it, keeping the review short enough to read before starting again.',
      },
    ],
    completion:
      'You have a concise review connecting the intended result, actual events and one usable next action.',
    tip: 'Include a repeatable success as well as a problem; learning what to keep is part of the review.',
    updatedAt: '2026-11-08',
    resources: [
      {
        ...CATALOG_SOURCES['world-health-organization-ebcd92add5'],
        purpose:
          'Adapt the institutional review framework to compare your project intentions, observed results and follow-up actions.',
      },
    ],
  },
  'make-a-skills-history-from-things-you-can-now-do': {
    title: 'Make a skills history from things you can now do',
    summary:
      'Trace a few practical abilities back to the people, failures and practice that helped you learn.',
    time: 'Allow an hour or two to trace a few abilities rather than list everything you know.',
    cost: 'Use examples already available, such as old work, photographs or practice notes.',
    place: 'A private table where a few pieces of learning evidence can be compared.',
    preparation:
      'Choose three practical skills you can demonstrate now, including one ordinary domestic or social ability. Read the university’s reflection prompts and find an early example if possible, avoiding a ranking of your worth against someone else’s progress.',
    steps: [
      {
        title: 'Begin with what you can do',
        body: 'Describe each ability as a concrete action and find evidence of using it. Choose a specific example rather than a broad label such as creativity, which is difficult to trace or compare.',
      },
      {
        title: 'Trace the learning backwards',
        body: 'Identify an early attempt, useful correction, teacher or repeated practice that changed your ability. Keep uncertain dates approximate and include help from others alongside your own effort.',
      },
      {
        title: 'Make the pattern useful',
        body: 'Arrange the three histories in a small diagram or annotated sequence. Notice a learning method that helped more than once and choose where you might use it for another modest skill.',
      },
    ],
    completion:
      'You have a specific history of three abilities and a learning approach worth trying again.',
    tip: 'A skill that feels effortless now may contain years of small corrections you have stopped noticing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-edinburgh-b879f616cc'],
        purpose:
          'Use the university’s evidence-led reflection prompts for understanding how skills developed.',
      },
    ],
  },
  'read-old-postcards-as-historical-evidence': {
    title: 'Read old postcards as historical evidence',
    summary:
      "Study your own saved correspondence for details about daily life, keeping other people's privacy intact.",
    time: 'Allow a short archive session with clean hands and a clear work surface.',
    cost: 'Use correspondence you own or have permission to examine.',
    place: 'A dry table away from food, drink and direct sunlight.',
    preparation:
      'Choose a small set of your own saved postcards or letters. Read the archive guidance before handling them, ask permission for other people’s material and keep private addresses and messages out of any public photograph.',
    steps: [
      {
        title: 'Observe before interpreting',
        body: 'Record the date, image, postmark, handwriting and physical format where visible. Separate what the card directly shows from what you infer, using a magnified image rather than rubbing or altering a fragile original.',
      },
      {
        title: 'Read for ordinary life',
        body: 'Notice details about travel, routines, prices or relationships that the writer took for granted. Compare two cards if available and ask what remains unknown instead of turning a brief message into a complete biography.',
      },
      {
        title: 'Preserve the context',
        body: 'Create a separate note linking each card to its known sender, recipient and approximate date. Store the originals safely using archive guidance, and share only the material all relevant people are comfortable disclosing.',
      },
    ],
    completion:
      'You have analysed a small set of personal correspondence as evidence and recorded its context.',
    tip: 'The printed picture and private message may tell different stories; keep both in your description.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['us-national-archives-efe78d739a'],
        purpose:
          'Use the conservator’s guidance on keeping personal paper collections and their historical context.',
      },
    ],
  },
  'create-a-map-of-languages-in-your-life': {
    title: 'Create a map of languages in your life',
    summary:
      'Show where different languages, dialects and registers enter your relationships and routines.',
    time: 'Allow a reflective hour with room to add examples later.',
    cost: 'Paper and a few colours are enough; the official worksheet is optional.',
    place: 'A comfortable private place where you can think about everyday language use.',
    preparation:
      'Read the Council of Europe language-portrait activity. Include languages, dialects, registers and signing you actually encounter, without ranking fluency or deciding that one form of language is more legitimate than another.',
    steps: [
      {
        title: 'Notice where language appears',
        body: 'List the ways you speak, read, write or sign with different people and in different settings. Include a language you understand only partly if it still has a meaningful place in daily life.',
      },
      {
        title: 'Give the relationships a visual form',
        body: 'Use colours or shapes on a silhouette or personal map to represent those connections. Let the marks stand for functions, memories or feelings, explaining your own key rather than applying a universal colour code.',
      },
      {
        title: 'Read the portrait back',
        body: 'Add a few concrete examples beside the map and notice a connection you had overlooked. If you discuss it with someone, share only the memories you choose and leave space for your language use to change.',
      },
    ],
    completion:
      'You have a language portrait showing the roles of different ways of communicating in your life.',
    tip: 'A family expression or workplace register can matter even when you have never thought of it as part of a language repertoire.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['european-centre-for-modern-languages-7572a8e86a'],
        purpose:
          'Use the official language-portrait instructions for reflecting on languages, registers and emotional connections.',
      },
    ],
  },
  'reconstruct-one-ordinary-childhood-day': {
    title: 'Reconstruct one ordinary childhood day',
    summary:
      "Use photographs, objects and willing relatives' memories to piece together an everyday day rather than a milestone.",
    time: 'Allow a few short evidence sessions and an hour to assemble the day.',
    cost: 'Use existing photographs, objects and willing conversations rather than buying archive materials.',
    place: 'A private workspace, with an optional call to someone who remembers the period.',
    preparation:
      'Choose an ordinary childhood day or a typical weekday from a narrow period. Read the conversation guidance, invite help without pressure and mark the result as a reconstruction rather than a recovered perfect memory.',
    steps: [
      {
        title: 'Gather a few anchors',
        body: 'Start with a photograph, timetable, object or remembered route. Place meals, school, play and home routines around the evidence, distinguishing a dated fact from a general memory of the period.',
      },
      {
        title: 'Ask about the gaps',
        body: 'Invite a willing relative or friend to describe ordinary details, sharing your draft without insisting on agreement. Record differences as separate recollections and avoid pressing anyone about a topic they prefer to leave alone.',
      },
      {
        title: 'Assemble a modest day',
        body: 'Create an annotated route, strip of sketches or simple sequence. Label uncertain parts and include the source of each firm detail, then keep the result privately or share it with contributors for corrections.',
      },
    ],
    completion:
      'You have reconstructed an everyday childhood day with clear evidence and uncertainty labels.',
    tip: 'What you carried, ate or waited for can reveal more daily life than another account of a major milestone.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['storycorps-e95629a9d3'],
        purpose:
          'Use the original oral-history listening and question guidance for voluntary memory conversations.',
      },
    ],
  },
  'trace-the-journey-of-one-inherited-object': {
    title: 'Trace the journey of one inherited object',
    summary: 'Document what is known, uncertain and private about an object passed between people.',
    time: 'Allow an afternoon, with later conversations if someone else knows more.',
    cost: 'A photograph and separate notes are enough; avoid altering the object.',
    place: 'A stable surface suited to the item’s material and condition.',
    preparation:
      'Choose an inherited or passed-along object you are allowed to handle. Read the object-analysis guidance, identify any fragile parts and ask contributors before recording or sharing personal stories about previous owners.',
    steps: [
      {
        title: 'Describe the object first',
        body: 'Record material, size, marks, wear and apparent function without assuming its story. Photograph details safely and keep observation separate from claims about age, value or cultural significance.',
      },
      {
        title: 'Follow the known handovers',
        body: 'Ask willing people how the object moved between owners and what evidence supports each step. Keep versions of the story distinct, marking unknown dates and resisting the urge to fill gaps with a tidy narrative.',
      },
      {
        title: 'Give the history a home',
        body: 'Write a short provenance note with sources, permissions and unresolved questions. Store it alongside a photograph or in an appropriate record, keeping the object itself free from adhesive labels or improvised repairs.',
      },
    ],
    completion:
      'You have a sourced account of what is known and unknown about one passed-along object.',
    tip: 'An ordinary utensil with a well-documented journey can tell a richer story than an impressive object with an invented past.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['us-national-park-service-fae1731709'],
        purpose:
          'Use the museum-management programme’s observation, deduction and evidence questions for object research.',
      },
    ],
  },
  'write-captions-for-ten-unlabelled-personal-photos': {
    title: 'Write captions for ten unlabelled personal photos',
    summary:
      'Identify dates, people and context while you can, marking uncertain details rather than guessing.',
    time: 'Allow an hour or two for a deliberately small group of photographs.',
    cost: 'Use existing images and a simple note file or suitable storage labels.',
    place: 'A dry table for prints or a private digital workspace for image files.',
    preparation:
      'Select ten unlabelled personal photographs and read the archive’s identification guidance. Work on copies or separate notes, avoid marking image surfaces and ask before naming other people in anything intended for wider sharing.',
    steps: [
      {
        title: 'Record what is certain',
        body: 'Give each photograph a simple identifier and note known people, place, occasion and date. Use approximate dates honestly and separate the photographer’s original information from later guesses.',
      },
      {
        title: 'Ask a willing second viewer',
        body: 'Share only appropriate images with someone who may recognise them. Let them give an account before offering your answer, recording disagreements or uncertainty instead of forcing a single confident caption.',
      },
      {
        title: 'Attach context safely',
        body: 'Put the captions in file metadata, a linked document or suitable storage enclosures as appropriate. Keep a backup of the index and check that each identifier still points to the right image.',
      },
    ],
    completion:
      'Ten photographs now have useful captions that distinguish known facts from uncertain details.',
    tip: 'A short accurate label can prevent years of guessing; you do not need a polished family narrative for every picture.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['us-national-archives-8843c71a2b'],
        purpose:
          'Follow the archive’s guidance on safe handling, enclosure labels and recording image context.',
      },
    ],
  },
  'build-a-private-archive-of-your-creative-versions': {
    title: 'Build a private archive of your creative versions',
    summary:
      'Gather drafts of one project, arrange them in order and preserve the changes that show how it developed.',
    time: 'Allow an afternoon for one project, with a separate backup check afterwards.',
    cost: 'Use existing storage and ordinary folders before buying an archive service.',
    place: 'A private digital workspace or a clean table for physical drafts.',
    preparation:
      'Choose one creative project with several saved versions and read the Library of Congress guidance. Work from copies where possible, preserve original filenames and dates, and keep collaborators’ private material within the permissions already agreed.',
    steps: [
      {
        title: 'Gather without deleting',
        body: 'Collect the relevant drafts, photographs and notes in a working list. Identify where each came from and leave original files intact while you establish the order, including experiments that did not reach the final version.',
      },
      {
        title: 'Explain the changes',
        body: 'Arrange copies chronologically where the evidence allows and add a short note at a few turning points. Describe what changed and why you remember changing it, marking uncertain dates or motives as such.',
      },
      {
        title: 'Make the archive retrievable',
        body: 'Create a small index and a separate backup, then test that a few files open. Write where the originals remain and how the sequence is organised so you or an authorised collaborator can understand it later.',
      },
    ],
    completion:
      'One project’s versions are preserved with an index, context notes and a checked backup.',
    tip: 'Keep the first archive narrow; preserving one understandable project is more useful than renaming your entire creative history at once.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['library-of-congress-1c3cd4cc65'],
        purpose:
          'Use the library’s guidance for selecting, describing, organising and backing up personal digital material.',
      },
    ],
  },
};
