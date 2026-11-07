import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const CREATIVE_GUIDES: Record<string, CuratedExperienceGuide> = {
  'build-a-folding-paper-peepshow': {
    title: 'Build a folding paper peepshow',
    summary: 'Turn layered paper scenery into a miniature view that opens out in three dimensions.',
    time: 'Allow a relaxed afternoon, including drying and adjustments to the folds.',
    cost: 'Use spare card and paper; a printer is useful for the optional museum templates.',
    place: 'A clear table with a cutting mat and space to leave glued panels flat.',
    preparation:
      'Choose a tiny scene with foreground, middle distance and background. Read the museum construction guide before cutting; scissors can simplify a design that otherwise needs precision blades.',
    steps: [
      {
        title: 'Plan a view through the opening',
        body: 'Sketch three layers separately. Leave generous openings so each layer reveals the one behind it, and choose one strong focal point rather than filling every surface with detail.',
      },
      {
        title: 'Build the unfolding structure',
        body: 'Use the museum guide for the panels and concertina connections. Test the spacing with temporary folds before gluing; a scene that looks good flat may hide its best feature when opened.',
      },
      {
        title: 'Invite someone to take a peek',
        body: 'Let the glue dry, then view the work through its front opening. Adjust any blocked sightline and try opening and closing it several times before adding a title.',
      },
    ],
    completion:
      'You have a paper world that folds closed and reveals distinct layers when extended.',
    tip: 'A scene from your own window gives you material without needing to reproduce a museum artwork.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['victoria-and-albert-museum-8dad46c482'],
        purpose:
          'Use the museum templates and complete construction instructions for the folding structure.',
      },
    ],
  },
  'animate-a-strip-in-a-homemade-zoetrope': {
    title: 'Animate a strip in a homemade zoetrope',
    summary: 'Draw a repeating action and watch it move inside a spinning slotted cylinder.',
    time: 'Set aside a couple of hours to build the viewer and redraw the animation.',
    cost: 'Scrap card, drawing paper and a safe rotating base can keep the project inexpensive.',
    place: 'A well-lit worktable where the spinning cylinder cannot hit fragile objects.',
    preparation:
      'Pick a very simple loop, such as a bouncing dot. Review the Exploratorium example and select a manual construction appropriate to your tools rather than adding a motor.',
    steps: [
      {
        title: 'Draw the loop before the viewer',
        body: 'Divide a strip into equal frames and draw a small change in each one. Make the last frame lead naturally back to the first, keeping the subject at a consistent scale.',
      },
      {
        title: 'Make a stable viewing cylinder',
        body: 'Follow a tested zoetrope design for evenly spaced slits and a secure base. Ask for help with cutting where needed; wobbling or uneven spacing makes the pictures harder to read.',
      },
      {
        title: 'Test motion and revise the strip',
        body: 'View through the slits while turning the cylinder gently. Reverse direction and compare the result, then change one frame if the loop jumps rather than adding more decorative detail.',
      },
    ],
    completion: 'Your drawn sequence reads as a repeating movement through the spinning viewer.',
    tip: 'Use a replaceable animation strip so the same viewer can host a second experiment.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-b10b2d4196'],
        purpose:
          'See the museum demonstration and linked construction options for a moving-picture viewer.',
      },
    ],
  },
  'stage-a-shadow-puppet-story': {
    title: 'Stage a shadow puppet story',
    summary: 'Cut articulated characters and perform a short story behind a lit cloth screen.',
    time: 'Plan an afternoon for making, rehearsal and one short performance.',
    cost: 'Cardboard packaging, sticks, tape and an existing lamp are usually enough.',
    place: 'An indoor room with a pale wall or sheet and a lamp kept clear of fabric.',
    preparation:
      'Choose a two-character story that can be told in a few minutes. Agree who controls the puppets and who narrates; use an LED torch or cool lamp for the screen.',
    steps: [
      {
        title: 'Design readable silhouettes',
        body: 'Draw characters with clear outlines and one recognisable feature each. Test a paper silhouette against the light before cutting your final card, since fine surface decoration disappears in shadow.',
      },
      {
        title: 'Explore the space behind the screen',
        body: 'Attach handles securely and practice entrances, exits and changes in scale. Keep cables and hot surfaces away from performers; use the museum activity for the basic puppet construction.',
      },
      {
        title: 'Perform one complete scene',
        body: 'Invite a willing small audience and tell the story from beginning to end. Leave pauses for visible actions, then ask which movement or character was easiest to understand.',
      },
    ],
    completion: 'A small audience has watched a complete shadow story using characters you made.',
    tip: 'Simple outlines are often more expressive than puppets with many fragile moving parts.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-cambridge-museums-e5096e0c95'],
        purpose: 'Follow the illustrated material list and basic silhouette-puppet activity.',
      },
    ],
  },
  'draw-a-wordless-six-panel-comic': {
    title: 'Draw a wordless six-panel comic',
    summary: 'Tell a complete small story through expressions and actions without speech balloons.',
    time: 'Allow an hour or two for a rough version, a readability test and final panels.',
    cost: 'A pencil and ordinary paper are sufficient for a first finished comic.',
    place: 'A table where six panels can be viewed together without constant page turning.',
    preparation:
      'Choose an everyday event with a visible beginning, change and ending. Avoid a plot that depends on explaining a backstory in words; stick figures are entirely suitable.',
    steps: [
      {
        title: 'Break the action into beats',
        body: 'Write a private one-line outline, then turn it into six thumbnail images. Make the turning point visible through actions or expressions, and keep the setting recognisable from one frame to the next.',
      },
      {
        title: 'Check it without an explanation',
        body: 'Give the rough strip to a willing reader and ask what happened. Listen before describing your intention; a missed action is useful evidence for changing a frame or its order.',
      },
      {
        title: 'Finish the clearest sequence',
        body: 'Redraw only after the story works at thumbnail size. Add the few details that direct attention and remove marks that compete with the action; leave speech and explanatory captions out.',
      },
    ],
    completion:
      'A reader can follow the basic story through six images without your spoken explanation.',
    tip: 'Try an object changing hands: it gives the eye a clear thread to follow.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['victoria-and-albert-museum-7d6ee08891'],
        purpose:
          'Use the museum storytelling prompts as a starting point for an original visual sequence.',
      },
    ],
  },
  'print-a-set-of-foam-relief-postcards': {
    title: 'Print a set of foam relief postcards',
    summary: 'Score a reusable foam plate and pull a small edition of hand-printed cards.',
    time: 'Set aside an afternoon and leave additional time for the prints to dry.',
    cost: 'A clean foam sheet, washable markers and paper keep the first edition inexpensive.',
    place: 'A protected table near water, with a flat drying area away from food.',
    preparation:
      'Start with a bold design sized for a postcard. Read the Getty activity to choose suitable foam and markers; include no lettering unless you are ready to reverse it.',
    steps: [
      {
        title: 'Prepare a plate with clear contrasts',
        body: 'Sketch the design on paper first, then transfer its main lines onto the foam. Keep delicate details widely spaced and test how your drawing tool indents an unused corner.',
      },
      {
        title: 'Pull a trial impression',
        body: 'Follow the Getty method for colouring, moistening and pressing. Lift the paper carefully and compare the impression with the plate; check whether empty lines and filled areas read as intended.',
      },
      {
        title: 'Print a small numbered edition',
        body: 'Adjust the pressure or colour before making several cards. Let every impression dry flat, select the ones you like and sign or number the edition without hiding its handmade variations.',
      },
    ],
    completion: 'You have a reusable relief plate and a small set of finished printed postcards.',
    tip: 'Print one proof on scrap paper; it can reveal reversal mistakes before you use your best card.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['getty-b46eb06eae'],
        purpose:
          'Follow the foam-plate materials and printing method demonstrated by Getty educators.',
      },
    ],
  },
  'weave-a-miniature-tapestry-on-cardboard': {
    title: 'Weave a miniature tapestry on cardboard',
    summary:
      'Make a small loom from packaging and weave a textile with changes in colour and texture.',
    time: 'Allow several short sessions or an unhurried afternoon for a small first weaving.',
    cost: 'Reused cardboard and leftover yarn are enough; borrow a blunt tapestry needle if possible.',
    place: 'A comfortable table with good light and room to keep yarns untangled.',
    preparation:
      'Choose a coaster-sized sample rather than a large wall hanging. Look at a practitioner-led tapestry introduction to understand warp, weft and finishing before you make a cardboard frame.',
    steps: [
      {
        title: 'Set up an even warp',
        body: 'Mark matching notches on a firm cardboard frame and string the supporting threads evenly. Leave room at both ends for finishing, and test that the cardboard does not bend under tension.',
      },
      {
        title: 'Weave a limited set of textures',
        body: 'Begin with a plain over-and-under section, then try a different yarn or colour. Keep the edges relaxed rather than pulling each row tight; the fabric should not narrow dramatically.',
      },
      {
        title: 'Release and finish the textile',
        body: 'Use an appropriate finishing method for your loom and yarn. Secure loose ends, remove the piece gently and hang or lay it flat while you assess its shape and texture.',
      },
    ],
    completion: 'You have removed a small woven textile from its frame with the edges secured.',
    tip: 'A cardboard loom is a test bed; wait to buy a wooden frame until you enjoy the weaving itself.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['oakland-museum-of-california-056745ee31'],
        purpose: 'Follow the museum’s cardboard-loom setup, weaving and finishing instructions.',
      },
    ],
  },
  'mend-a-favourite-garment-with-visible-stitches': {
    title: 'Mend a favourite garment with visible stitches',
    summary:
      'Repair one worn patch with contrasting stitches that make the repair part of the garment.',
    time: 'Allow an hour or two for a small patch, with extra time for a first attempt.',
    cost: 'Use a needle, suitable thread and spare cloth; a repair session may have a fee.',
    place: 'A well-lit table where the garment can lie flat without stretching.',
    preparation:
      'Choose a small worn area on a garment you own. Identify whether the fabric needs a patch or darning, and practice on a scrap before putting a needle through a favourite item.',
    steps: [
      {
        title: 'Understand the damage',
        body: 'Wash and dry the garment as its label allows. Look beyond the visible hole for thinning fabric so your patch or stitches can anchor into sound material rather than failing at the edge.',
      },
      {
        title: 'Make a deliberate repair',
        body: 'Use a demonstrated repair technique suited to the fabric. Choose contrasting thread only after testing its weight and colour on a scrap; keep the garment flexible enough to wear comfortably.',
      },
      {
        title: 'Check it in use',
        body: 'Secure the thread ends and inspect the reverse for uncomfortable knots. Put the garment on, move normally and adjust any tight section before photographing the repaired area for your own record.',
      },
    ],
    completion: 'The damaged area is supported and the garment is comfortable to use again.',
    tip: 'A repair can stay modest: a visible line of careful stitches is enough design for a first attempt.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['victoria-and-albert-museum-9bc5bb2b84'],
        purpose:
          'Learn what a suitable darning introduction covers and use a current instructor for fabric-specific guidance.',
      },
    ],
  },
  'marble-a-sheet-of-paper': {
    title: 'Marble a sheet of paper',
    summary: 'Float colour on a prepared surface and lift a swirling print onto paper.',
    time: 'Give yourself an afternoon, plus an undisturbed place for the paper to dry.',
    cost: 'Use a beginner paper-marbling kit or workshop rather than buying assorted incompatible materials.',
    place: 'A protected, washable surface with room for a shallow tray and drying sheets.',
    preparation:
      'Choose a paper-marbling method with a complete material list. Confirm which paints, bath and paper work together; a museum workshop is a useful way to try the process before stocking a home setup.',
    steps: [
      {
        title: 'Prepare a small test station',
        body: 'Protect the table and lay out the paper before opening colours. Make the tray and bath exactly as your chosen method specifies, keeping tools for this project separate from food preparation.',
      },
      {
        title: 'Create a pattern with restraint',
        body: 'Start with two colours and a few movements of the comb or stylus. Watch what each movement does before adding more; mixing indefinitely can erase the distinct bands you wanted.',
      },
      {
        title: 'Lift and assess a print',
        body: 'Transfer the pattern following your demonstrated method, then dry the sheet flat. Compare the print with the floating design and make a second sheet with one deliberate change in colour or movement.',
      },
    ],
    completion: 'You have a dry marbled sheet and understand one change that alters the pattern.',
    tip: 'Cut a disappointing test print into bookmarks; small sections can reveal excellent accidental patterns.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-stickley-museum-at-craftsman-far-8ec5120b55'],
        purpose:
          'Follow the museum’s material list and complete floating-colour marbling activity.',
      },
    ],
  },
  'bind-a-pocket-notebook-by-hand': {
    title: 'Bind a pocket notebook by hand',
    summary: 'Fold pages, pierce the spine and stitch a small book that opens neatly.',
    time: 'Plan a couple of hours for a first small sewn notebook.',
    cost: 'Paper, a cover offcut and suitable binding thread are modest supplies; borrow specialist tools.',
    place: 'A sturdy table with a sacrificial board beneath any hole-making work.',
    preparation:
      'Pick a simple pamphlet binding with one folded section. Read an illustrated binding method from start to finish, and decide the final page size before trimming or piercing anything.',
    steps: [
      {
        title: 'Make a paper dummy',
        body: 'Fold a small sample book without stitching. Check that the grain, page count and cover thickness allow it to close; reduce the number of sheets if the fold becomes bulky.',
      },
      {
        title: 'Prepare and sew the section',
        body: 'Mark hole positions consistently and use your chosen binding instructions for the sewing path. Support the pages while piercing them, keep fingers out of the tool path and avoid overtightening the thread.',
      },
      {
        title: 'Check the finished notebook',
        body: 'Open the book at several points, inspect the centre knot and gently flex the cover. Trim only if needed, then write a first page to confirm that your practical little book is usable.',
      },
    ],
    completion:
      'A securely stitched pocket notebook opens comfortably and holds its pages in order.',
    tip: 'Decorate the cover before sewing so you can work flat without staining the finished pages.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-brighton-2320bac4d3'],
        purpose:
          'Follow the university’s illustrated pamphlet-stitch worksheet for a small sewn section.',
      },
    ],
  },
  'perform-live-foley-for-a-silent-clip': {
    title: 'Perform live Foley for a silent clip',
    summary:
      'Use household objects to create footsteps, doors and weather in sync with a short silent scene.',
    time: 'Allow an afternoon to choose sounds, rehearse and perform a short clip.',
    cost: 'Household objects and a device for playing video can make this a free activity.',
    place: 'A room where moderate tapping and rustling will not disturb neighbours.',
    preparation:
      'Choose a short silent clip you made or have permission to use. Limit it to three or four prominent actions, and appoint someone to cue playback so performers can focus on timing.',
    steps: [
      {
        title: 'Make a cue list',
        body: 'Watch the scene without producing any sound. Mark the moments that need footsteps, doors or movement, and decide which sounds tell the story rather than trying to illustrate every visible action.',
      },
      {
        title: 'Audition ordinary objects',
        body: 'Try paper, shoes, fabric and containers for the cues. Record tiny samples if helpful, then choose objects that give a clear sound at a comfortable volume without breaking or creating a mess.',
      },
      {
        title: 'Perform in sync',
        body: 'Run the clip and make the effects live, accepting a few misses. Repeat it once with one timing improvement, then invite your audience to compare the atmosphere with and without your sound.',
      },
    ],
    completion: 'You have performed a complete short scene with a coordinated live effects track.',
    tip: 'A surprising substitute can sound convincing; matching the rhythm matters more than matching the object on screen.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['scitech-8eb605b7a5'],
        purpose:
          'Follow the science centre’s demonstrated challenge for creating sound effects from everyday objects.',
      },
    ],
  },
  'record-a-place-as-a-sound-portrait': {
    title: 'Record a place as a sound portrait',
    summary: 'Build a short audio sequence from the rhythms and textures of one familiar location.',
    time: 'Spend a short outing gathering sound and another hour arranging the recordings.',
    cost: 'A phone recorder and headphones are enough; specialist microphones are optional.',
    place: 'A permitted location where you can remain safely still without blocking other people.',
    preparation:
      'Choose a place with changing but manageable sounds, such as a courtyard. Check recording rules and avoid capturing identifiable private conversations; seek permission for any deliberate contribution from another person.',
    steps: [
      {
        title: 'Listen before pressing record',
        body: 'Spend a few minutes noticing steady background sound and brief events. Decide which three or four textures make this place distinctive rather than collecting every sound you encounter.',
      },
      {
        title: 'Gather short clean recordings',
        body: 'Record from stable positions and note where each clip was made. Keep your hands away from the microphone, shelter it from wind and stop if recording would intrude on someone else.',
      },
      {
        title: 'Arrange a brief audio portrait',
        body: 'Select a few clips and order them into a sequence that has a clear arrival and ending. Listen on headphones at a comfortable volume, then remove abrupt level jumps and unnecessary speech.',
      },
    ],
    completion:
      'A short audio sequence conveys a place through its sounds while respecting people nearby.',
    tip: 'A few seconds of quiet background sound helps connect clips without dramatic editing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['bbc-1c08e5ddad'],
        purpose:
          'Use the sound-detective activity as a starting point for noticing and recording familiar environmental sounds.',
      },
    ],
  },
  'fold-an-interlocking-origami-sculpture': {
    title: 'Fold an interlocking origami sculpture',
    summary: 'Assemble repeated folded-paper units into a small geometric structure without glue.',
    time: 'Allow an hour or two, depending on the number of units in your chosen model.',
    cost: 'Equal squares of ordinary paper are enough for a small modular model.',
    place: 'A dry tabletop where folded units can be sorted without being knocked onto the floor.',
    preparation:
      'Choose a beginner modular design with diagrams published by its creator or an authorised origami organisation. Check the unit count and personal-use terms; link to the diagrams rather than republishing them.',
    steps: [
      {
        title: 'Understand one unit completely',
        body: 'Fold a single practice module slowly, checking orientation against the original diagrams. Unfold it if needed to understand the pockets and tabs; one accurate unit is more useful than a pile of uncertain ones.',
      },
      {
        title: 'Repeat with consistent paper',
        body: 'Prepare the required number of units in compatible paper. Keep the same folding sequence and crease firmly, sorting finished modules so you can catch an incorrectly mirrored piece before assembly.',
      },
      {
        title: 'Assemble and display',
        body: 'Follow the designer’s assembly order and join the modules without forcing the pockets. Check the final structure from several angles and place it where its balance and geometry can be appreciated.',
      },
    ],
    completion: 'You have assembled a stable modular paper sculpture using the credited design.',
    tip: 'Use two colours to make the joining pattern easier to understand on your first model.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['origamiusa-b648183f0b'],
        purpose:
          'Follow the creator-authorised modular design diagrams for a personal folding project.',
      },
    ],
  },
  'learn-a-beginner-kolam-from-a-practitioner': {
    title: 'Learn a beginner kolam from a practitioner',
    summary:
      "Follow a South Indian practitioner's dot-grid lesson and complete one continuous chalk pattern.",
    time: 'Allow a short lesson and an hour of patient practice.',
    cost: 'Paper or washable chalk is inexpensive; pay a practitioner for individual teaching.',
    place: 'A table for practice or an agreed outdoor surface where chalk is permitted.',
    preparation:
      'Find a Tamil practitioner’s beginner demonstration and learn what the particular design is called. Begin on paper; a threshold drawing belongs within the household and community context of its maker.',
    steps: [
      {
        title: 'Follow one small dot grid',
        body: 'Ask the teacher to show how the line travels around the dots. Watch a complete example before drawing, noticing where a crossing joins a line and where it only appears to.',
      },
      {
        title: 'Practice the route slowly',
        body: 'Repeat the same grid in pencil until you understand the path. Keep the pattern small and ask about an unclear turn instead of inventing an explanation of its cultural meaning.',
      },
      {
        title: 'Complete one deliberate version',
        body: 'Draw the learned design in chalk on a permitted surface or finish it on paper. Credit the practitioner and tradition in any shared image, and clean the surface when appropriate.',
      },
    ],
    completion:
      'You have completed a named beginner kolam and can describe its dot-and-line structure.',
    tip: 'Ask about daily practice as well as technique; a geometric pattern has a living context.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['indira-gandhi-national-centre-for-th-a56fea9e51'],
        purpose:
          'Read the cultural inventory for context, then learn an actual design from a practitioner.',
      },
    ],
  },
  'light-up-a-paper-circuit-card': {
    title: 'Light up a paper circuit card',
    summary: 'Make a greeting card with a working LED circuit concealed beneath its illustration.',
    time: 'Plan an afternoon with time for testing before decorating.',
    cost: 'Buy a small paper-circuit kit or compatible LED, battery and conductive tape.',
    place:
      'A clear, dry table away from young children and pets who could swallow small batteries.',
    preparation:
      'Read the Exploratorium guide and choose its simplest one-light circuit. Use only the specified low-voltage components; keep batteries secured and remove them when the card is stored.',
    steps: [
      {
        title: 'Test the light separately',
        body: 'Identify the battery and LED polarities using the guide. Verify that the components work before taping them into artwork, so a broken connection is easier to distinguish from a faulty part.',
      },
      {
        title: 'Lay out a readable circuit',
        body: 'Sketch the two paths on scrap paper and decide where the light will appear. Follow the demonstrated layout, leaving accessible contacts and preventing unintended contact between the paths.',
      },
      {
        title: 'Combine circuit and image',
        body: 'Create a simple drawing around the working light and test the switch repeatedly. Secure the battery holder, label its location and explain safe handling before giving the card to someone.',
      },
    ],
    completion: 'Your card lights reliably when its intended contact or switch is operated.',
    tip: 'Decorate after the circuit works; otherwise a tracing mistake can be hidden under your best illustration.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-c5edf99e8d'],
        purpose:
          'Follow the museum’s component list, polarity diagrams and full beginner circuit instructions.',
      },
    ],
  },
  'make-a-sheet-of-paper-from-recycled-fibres': {
    title: 'Make a sheet of paper from recycled fibres',
    summary: 'Turn clean scrap paper into pulp and lift a new handmade sheet from a simple mould.',
    time: 'Allow an afternoon for pulping and forming, then drying time.',
    cost: 'Clean scrap paper, a simple mould and a basin are modest supplies; borrow equipment.',
    place: 'A water-tolerant table with towels and room to dry damp sheets flat.',
    preparation:
      'Read the museum papermaking activity and choose clean, uncoated paper. Use only equipment appropriate to the instructions; keep craft tools separate from food use and ask before borrowing a blender.',
    steps: [
      {
        title: 'Sort the fibres',
        body: 'Remove tape, staples and plastic coatings from the scraps. Select a small colour range so the pulp has an intentional appearance, and prepare the paper as the activity directs.',
      },
      {
        title: 'Form a first sheet',
        body: 'Make a small batch of pulp and lift a sheet with the mould. Concentrate on even coverage rather than a perfect rectangle; thin patches become clear when you hold the wet sheet up.',
      },
      {
        title: 'Dry and use the result',
        body: 'Transfer the sheet as instructed and let it dry fully before peeling or trimming. Try writing or drawing on a corner, then turn the usable paper into a note or small artwork.',
      },
    ],
    completion: 'A dry handmade sheet exists and you have tried a practical use for its surface.',
    tip: 'Keep your first pulp simple; decorative inclusions can make an already delicate sheet difficult to handle.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['norton-simon-museum-89987b8141'],
        purpose:
          'Follow the museum’s complete recycled-papermaking material list and illustrated activity.',
      },
    ],
  },
  'set-and-print-a-line-of-letterpress-type': {
    title: 'Set and print a line of letterpress type',
    summary: 'Arrange movable type in a studio and pull an inked print from a real press.',
    time: 'Reserve a beginner studio session, usually a substantial part of a day.',
    cost: 'Expect a workshop fee; ask whether paper and a small edition are included.',
    place: 'A supervised letterpress studio with suitable type and press access.',
    preparation:
      'Choose a very short line of your own words. Confirm the session includes typesetting rather than only printing a prepared plate, and ask about access, clothing and handling rules.',
    steps: [
      {
        title: 'Compose within the available type',
        body: 'Discuss the phrase, size and spacing with the tutor. Handle the type as demonstrated and proof the arrangement before committing to an edition; printed letters expose mistakes that the reversed form hides.',
      },
      {
        title: 'Pull and inspect a proof',
        body: 'Let the instructor guide press setup and operation. Look at ink coverage, impression and alignment, choosing one adjustment rather than changing every variable after the first print.',
      },
      {
        title: 'Print a modest edition',
        body: 'Pull a few copies with the agreed setup and set them aside to dry. Help return type and clean equipment as instructed, then label the prints with the date and workshop.',
      },
    ],
    completion: 'You have set type and pulled finished impressions from a real letterpress.',
    tip: 'A short phrase leaves more time for spacing and printing than a whole paragraph.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['south-street-seaport-museum-7ea373cab8'],
        purpose:
          'See a museum-led introduction that explicitly includes typesetting and letterpress printing.',
      },
    ],
  },
  'make-a-small-mosaic-panel': {
    title: 'Make a small mosaic panel',
    summary: 'Arrange safe pre-cut tiles into a pattern and finish a decorative panel.',
    time: 'Set aside an afternoon, with extra curing time for the chosen adhesive.',
    cost: 'Pre-cut tiles and a small rigid backing limit both cost and waste.',
    place: 'A protected craft table where the panel can remain undisturbed while curing.',
    preparation:
      'Choose a decorative panel rather than a food-contact object. Use safe pre-cut pieces and an adhesive suitable for the backing; get workshop instruction before cutting glass or ceramic yourself.',
    steps: [
      {
        title: 'Design at the actual size',
        body: 'Trace the backing on paper and try the main shapes there. Limit the palette and make the pattern legible from a distance before filling it with tiny pieces.',
      },
      {
        title: 'Arrange before sticking',
        body: 'Lay the pieces out dry, leaving consistent spaces and checking the outer edge. Photograph the arrangement so it can be reconstructed if a hand or sleeve disturbs it.',
      },
      {
        title: 'Fix and finish the surface',
        body: 'Attach the pieces using the product instructions or tutor’s method. Let everything cure fully, check for loose or sharp edges and display the panel with a suitable support.',
      },
    ],
    completion: 'A small mosaic panel is secure, dry and ready for decorative display.',
    tip: 'An abstract pattern is easier to read at a small scale than a detailed face or landscape.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['victoria-and-albert-museum-269883a73a'],
        purpose:
          'Use the museum activity for composition and material ideas; follow your adhesive’s own instructions.',
      },
    ],
  },
  'stitch-a-patchwork-cushion-cover-from-scraps': {
    title: 'Stitch a patchwork cushion cover from scraps',
    summary: 'Join saved fabric into a usable cushion cover with a deliberate colour arrangement.',
    time: 'Allow a weekend or several shorter sewing sessions.',
    cost: 'Use washable fabric remnants and an existing cushion insert; thread is the main extra supply.',
    place: 'A sewing table with an iron used safely and space to lay out patches.',
    preparation:
      'Choose a simple envelope-back cushion pattern matching your insert. Wash compatible fabric scraps first, and check that their weights and care needs are similar enough to work together.',
    steps: [
      {
        title: 'Lay out a workable patchwork',
        body: 'Arrange the scraps before cutting, using a few repeated colours or shapes. Include seam allowances from your chosen pattern and avoid placing very stretchy fabric beside rigid pieces in a first project.',
      },
      {
        title: 'Join and press carefully',
        body: 'Sew a small test seam, then piece the front in manageable sections. Press as you go and check its dimensions before attaching the back; small seam errors can accumulate across many patches.',
      },
      {
        title: 'Fit the cover to its purpose',
        body: 'Complete the closure, turn the cover and try it on the insert. Check seams under gentle pressure, secure loose threads and note the fabric care instructions for future washing.',
      },
    ],
    completion: 'Your finished cover fits an insert and puts saved fabric back into everyday use.',
    tip: 'Photograph the layout before sewing; it is surprisingly easy to rotate a favourite patch by accident.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['treasurie-0402adee19'],
        purpose:
          'Follow the original sewing educator’s complete patchwork cushion pattern and construction tutorial.',
      },
    ],
  },
  'coil-a-basket-from-recycled-paper': {
    title: 'Coil a basket from recycled paper',
    summary: 'Roll paper into cords and stitch or join them into a small container.',
    time: 'Allow a few sessions, including time for glued sections to dry.',
    cost: 'Recycled paper and suitable craft glue keep a small basket inexpensive.',
    place: 'A protected table where a partly built basket can stay upright between sessions.',
    preparation:
      'Start with a shallow container for light objects. Read the complete coiling lesson and select paper without confidential information; a small test coil will show whether it bends cleanly.',
    steps: [
      {
        title: 'Prepare consistent paper cords',
        body: 'Make a few lengths using the chosen lesson’s method and test how they join. Keep the first batch reasonably even so the base is stable instead of alternating thick lumps and thin gaps.',
      },
      {
        title: 'Build a firm base and sides',
        body: 'Coil gradually, allowing joins to hold before adding weight. Check the container from above as it grows, adjusting the curve gently rather than forcing dry paper into a new shape.',
      },
      {
        title: 'Finish for light use',
        body: 'Secure the final end and let the basket dry completely. Check for loose joins, then place a few lightweight items inside; keep it away from water and heavy loads.',
      },
    ],
    completion: 'You have a dry, stable coiled-paper container that holds a few light belongings.',
    tip: 'A saucer-sized basket is a realistic first project; tall sides multiply drying and alignment problems.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['blick-art-materials-7df7cd5274'],
        purpose: 'Follow the art educator’s full lesson for shaping and joining paper coils.',
      },
    ],
  },
  'stencil-a-reusable-fabric-bag': {
    title: 'Stencil a reusable fabric bag',
    summary: 'Cut a simple reusable stencil and print a bold design onto an existing tote.',
    time: 'Plan an afternoon and allow the fabric paint’s required setting time.',
    cost: 'Use an existing clean tote, reusable stencil material and paint intended for fabric.',
    place: 'A protected table with a board or scrap sheet inside the bag.',
    preparation:
      'Choose a bold two-dimensional design with connected areas. Check the fabric and paint instructions together, including washing and heat-setting requirements; practice the stencil on paper before touching the bag.',
    steps: [
      {
        title: 'Make the stencil hold together',
        body: 'Draw the design at final size and identify islands that would fall out. Add bridges or simplify the shapes, then cut with a safe method suited to your tools.',
      },
      {
        title: 'Test paint and pressure',
        body: 'Try the stencil on scrap material with very little paint. Look for bleeding at the edges and adjust how the stencil is held rather than flooding the surface to fix pale patches.',
      },
      {
        title: 'Print and set the finished bag',
        body: 'Place the design deliberately and protect the opposite side from paint. Remove the stencil carefully, let the print dry and follow the product’s setting directions before using or washing it.',
      },
    ],
    completion: 'You have a usable tote with a cured design and a stencil that can print again.',
    tip: 'One well-placed shape usually survives fabric folds better than a sheet of tiny intricate details.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['victoria-and-albert-museum-12b0e79278'],
        purpose:
          'See the museum’s stencil-to-bag project and use appropriate fabric-paint instructions for your materials.',
      },
    ],
  },
  'engineer-a-pop-up-paper-scene': {
    title: 'Engineer a pop-up paper scene',
    summary:
      'Build a greeting-sized paper scene with a moving fold that rises when the card opens.',
    time: 'Allow an hour or two to prototype and finish one moving card.',
    cost: 'Paper, card, scissors and glue are enough for a basic mechanism.',
    place: 'A clear table where folds can be pressed accurately and glue left to dry.',
    preparation:
      'Pick one beginner pop-up mechanism from the museum activity. Make a plain-paper model first and keep the scene small; additional layers can interfere with the movement when the card closes.',
    steps: [
      {
        title: 'Understand the moving fold',
        body: 'Build the simplest version without decoration. Open and close it slowly, watching which edges must stay free and where the mechanism meets the card’s centre fold.',
      },
      {
        title: 'Design around the mechanism',
        body: 'Sketch a scene that uses the rise or rotation you already tested. Keep heavy additions away from unsupported ends and try the cut-out shapes with temporary positioning before gluing.',
      },
      {
        title: 'Finish and test repeatedly',
        body: 'Attach the image, allow the glue to dry and close the card fully. Open it several times and adjust any snag, then add a short message and give or display the finished piece.',
      },
    ],
    completion:
      'Your paper scene rises when opened and folds flat again without tearing or snagging.',
    tip: 'A plain working mechanism is a success; decoration should follow what the fold can actually do.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['museum-of-craft-and-design-ccab198e8f'],
        purpose: 'Follow the museum’s illustrated pop-up construction activity.',
      },
    ],
  },
  'make-a-tactile-relief-artwork': {
    title: 'Make a tactile relief artwork',
    summary:
      'Compose an artwork from raised textures that can be explored by touch as well as sight.',
    time: 'Plan a relaxed afternoon, plus drying time for attached materials.',
    cost: 'Use clean fabric offcuts, cardboard and other safe household textures.',
    place: 'A table with a rigid backing and enough light to inspect edges and joins.',
    preparation:
      'Choose textures that can be touched safely without shedding or scratching. If making the piece for someone with access needs, ask about their preferences rather than assuming one tactile design works for everyone.',
    steps: [
      {
        title: 'Explore the materials with care',
        body: 'Compare the textures with your fingertips before selecting them. Remove sharp edges and loose fibres, and choose a few clear contrasts rather than using every interesting scrap you find.',
      },
      {
        title: 'Compose with hands as well as eyes',
        body: 'Arrange raised shapes so their boundaries are easy to follow. Leave space between contrasting areas and consider how a hand will enter, travel across and leave the composition.',
      },
      {
        title: 'Secure and invite feedback',
        body: 'Attach the materials, let them cure and check every surface by touch. Invite a willing viewer to explore it, describing the work if wanted and asking where its forms become unclear.',
      },
    ],
    completion: 'You have a stable textured artwork designed for permitted touch as well as sight.',
    tip: 'Keep any original museum artwork as visual inspiration; touch only objects explicitly offered for handling.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['hirshhorn-museum-and-sculpture-garde-5ab8977ab5'],
        purpose:
          'Use the museum lesson to explore materials and deliberate contrasts in a textured artwork.',
      },
    ],
  },
  'carve-a-reusable-rubber-stamp': {
    title: 'Carve a reusable rubber stamp',
    summary:
      'Carve a simple soft-rubber block under appropriate instruction and use it to mark a handmade edition.',
    time: 'Allow a couple of hours for drawing, carving and proofing.',
    cost: 'A small soft carving block, suitable tools and an ink pad are sufficient.',
    place: 'A stable table with a non-slip cutting support and good visibility.',
    preparation:
      'Choose a bold mark rather than a detailed logo. Learn safe tool handling from a tutor or the complete carving tutorial, and use a carving block rather than improvising with an unsuitable hard material.',
    steps: [
      {
        title: 'Plan the printed mark',
        body: 'Draw a simple black-and-white design at actual size. Decide what remains raised and what will be removed, and reverse any lettering before transferring the image to the block.',
      },
      {
        title: 'Carve a controlled first version',
        body: 'Make shallow, deliberate cuts with the block supported and your spare hand out of the tool path. Stop to brush away debris and check the design rather than trying to finish in one uninterrupted pass.',
      },
      {
        title: 'Proof before making an edition',
        body: 'Ink lightly and test on scrap paper. Remove only areas that clearly need correction, then print a few clean marks and clean the block according to the ink and material instructions.',
      },
    ],
    completion:
      'You have a reusable stamp that makes a recognisable version of your original design.',
    tip: 'A stamp mark can stay small and rough-edged; it need not reproduce the precision of a digital logo.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['splitcoaststampers-560e2ac5fc'],
        purpose:
          'Follow the original demonstrated carving tutorial and its tool-handling guidance.',
      },
    ],
  },
  'make-a-cyanotype-print-from-everyday-objects': {
    title: 'Make a cyanotype print from everyday objects',
    summary:
      'Arrange opaque objects on prepared cyanotype paper and expose a blue-and-white composition.',
    time: 'Allow a daylight session and additional time for washing and drying the print.',
    cost: 'Prepared cyanotype paper avoids buying and mixing separate sensitising chemicals.',
    place: 'A place with daylight, water access and a flat indoor drying surface.',
    preparation:
      'Use a prepared-paper kit with its own exposure and washing directions. Choose everyday opaque objects or legally collected fallen material; avoid stripping living plants for a composition.',
    steps: [
      {
        title: 'Arrange before exposing',
        body: 'Try the objects on ordinary paper first and compare their silhouettes. Decide where you want blank space, then set up the final arrangement in subdued light as the kit directs.',
      },
      {
        title: 'Run a small exposure test',
        body: 'Follow the paper maker’s instructions for your conditions rather than assuming a fixed sunlight time. Keep the arrangement stable and compare a test strip if the kit supplies one.',
      },
      {
        title: 'Wash and judge the dry print',
        body: 'Complete the specified rinsing and drying process. Wait for the colour to settle before evaluating the composition, and label the back with the objects and conditions that produced the result.',
      },
    ],
    completion: 'You have a finished blue-and-white photogram made by direct contact and light.',
    tip: 'A key, lace offcut or kitchen utensil can create as compelling a silhouette as a leaf.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['victoria-and-albert-museum-131f5bbafe'],
        purpose:
          'Read the cyanotype process context; use the prepared paper manufacturer’s complete handling instructions.',
      },
    ],
  },
  'build-a-hand-cranked-cardboard-automaton': {
    title: 'Build a hand-cranked cardboard automaton',
    summary: 'Use a cam or linkage to make a small character move when you turn a handle.',
    time: 'Give yourself an afternoon for building and troubleshooting one movement.',
    cost: 'Packaging card, skewers and a few simple connectors make a low-cost mechanism.',
    place: 'A stable craft table with safe cutting support and space to turn the handle.',
    preparation:
      'Choose a character that only needs to bob or turn. Read the cardboard-automata project and collect its recommended materials; use supervision for sharp tools or hot glue.',
    steps: [
      {
        title: 'Prototype the motion first',
        body: 'Try the cam or linkage with a plain paper follower before adding a character. Turn the handle slowly and check where friction, misalignment or an unsupported axle interrupts the movement.',
      },
      {
        title: 'Build a frame that stays square',
        body: 'Reinforce the cardboard housing and leave access to the mechanism. Test the handle after each attachment so a new decorative piece does not hide the cause of a jam.',
      },
      {
        title: 'Give the mechanism a character',
        body: 'Add a lightweight figure whose movement suits the mechanism. Run it for several turns, adjust any rubbing surfaces and let someone else operate the handle without coaching.',
      },
    ],
    completion:
      'A hand-cranked sculpture completes its intended movement repeatedly without being held together by hand.',
    tip: 'One convincing motion is more satisfying than three unfinished mechanisms competing inside the same box.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-e2f9440940'],
        purpose:
          'Use the museum’s cam, linkage and construction resources to build the working mechanism.',
      },
    ],
  },
  'build-a-chain-reaction-machine-from-household-objects': {
    title: 'Build a chain-reaction machine from household objects',
    summary:
      'Connect several small mechanisms so one initial action triggers a satisfying final event.',
    time: 'Reserve an afternoon and expect most of it to be testing.',
    cost: 'Use stable household objects rather than buying a construction kit.',
    place: 'An agreed floor or table area protected from spills and free of fragile objects.',
    preparation:
      'Choose a harmless final action, such as ringing a small bell. Agree a short chain with no flames, sharp projectiles or heavy falling objects, and leave clear walking routes around it.',
    steps: [
      {
        title: 'Work backwards from the finish',
        body: 'Make the final action work by itself, then add a preceding trigger. Keep the sequence short enough to reset quickly; a reliable three-stage machine is a good first target.',
      },
      {
        title: 'Test the joins between stages',
        body: 'Run each connection several times before linking the whole sequence. Mark starting positions with removable tape and keep a note of what changes improved reliability.',
      },
      {
        title: 'Run the complete chain',
        body: 'Invite the group to watch one launch without intervening. If it stops, reset only after checking the failed handoff, then celebrate a complete run and return borrowed objects to their places.',
      },
    ],
    completion:
      'One initial action produces the planned ending through a connected sequence of mechanisms.',
    tip: 'Design the reset alongside the machine; a quick reset gives you far more chances to improve it.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-8f85052f0c'],
        purpose:
          'Use the museum project for safe cause-and-effect ideas, testing and collaborative building.',
      },
    ],
  },
  'build-a-motorised-scribbling-machine': {
    title: 'Build a motorised scribbling machine',
    summary:
      'Turn a small battery-powered motor, a recycled container and pens into an unpredictable drawing device.',
    time: 'Set aside an afternoon with several short test runs.',
    cost: 'A small suitable motor, battery holder, washable pens and recycled container are modest supplies.',
    place: 'A paper-covered surface with a boundary that keeps the machine from falling.',
    preparation:
      'Use the Exploratorium parts and voltage guidance. Choose a battery holder with accessible disconnection, keep loose parts away from small children and do not salvage mains-powered equipment for this project.',
    steps: [
      {
        title: 'Make a stable drawing body',
        body: 'Attach pens to the container so their tips meet the paper. Check that the battery and motor can be secured without making the body tip over before it moves.',
      },
      {
        title: 'Introduce a controlled wobble',
        body: 'Follow the activity’s offset-motor setup and test briefly. Disconnect the power before adjusting anything, watching how the motor position and pen spacing change the machine’s path.',
      },
      {
        title: 'Create a small series of drawings',
        body: 'Run the device on fresh paper, changing one feature between attempts. Select a few interesting traces, label the setup behind each and switch off before storing the machine.',
      },
    ],
    completion:
      'Your battery-powered device moves across paper and produces marks that change with its setup.',
    tip: 'Use washable pens and protect the floor; the first successful movement may head somewhere unexpected.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-455088f76a'],
        purpose:
          'Follow the complete parts, offset-motor and testing instructions in the museum’s project guide.',
      },
    ],
  },
  'balance-a-hanging-mobile-from-found-materials': {
    title: 'Balance a hanging mobile from found materials',
    summary:
      'Explore weight and leverage to build a mobile that moves without collapsing to one side.',
    time: 'Allow an afternoon for assembly and small balance adjustments.',
    cost: 'Lightweight reused materials, string and simple supports can be inexpensive.',
    place: 'A permitted hanging point away from walkways, fans and breakable objects.',
    preparation:
      'Select light, clean objects and check the hanging support before building. Review the balancing-sculpture project, then start with a single beam rather than a complicated cascading mobile.',
    steps: [
      {
        title: 'Find a balancing pair',
        body: 'Suspend two light objects from opposite ends of a support. Move the hanging point and observe what changes, keeping each connection adjustable until the beam sits as intended.',
      },
      {
        title: 'Add a second level',
        body: 'Introduce another small balanced section and check the whole assembly again. A change at one level affects the others, so work from the lower sections upward instead of adjusting everything at once.',
      },
      {
        title: 'Observe and finish',
        body: 'Hang the mobile where ordinary air movement can turn it gently. Secure final knots, check clearances and remove any object that could drop or collide with a person.',
      },
    ],
    completion: 'Your finished mobile hangs securely and responds to small movements of air.',
    tip: 'Unequal objects can balance when their distances change; matching weights are not required for visual harmony.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-64234d26b1'],
        purpose:
          'Explore the museum’s balancing constructions and material experiments before designing your hanging version.',
      },
    ],
  },
  'make-a-sheet-of-washi-with-a-papermaker': {
    title: 'Make a sheet of washi with a papermaker',
    summary:
      'Learn how a trained practitioner forms plant fibres into a sheet of Japanese handmade paper.',
    time: 'Allow the workshop session plus whatever drying or collection time the maker specifies.',
    cost: 'Expect a practitioner-led workshop fee; check materials and finished-sheet collection.',
    place: 'A legitimate papermaking studio offering instruction in the specific washi process.',
    preparation:
      'Read about the named craft and choose a workshop led by a trained maker. Ask which fibres and tools you will use, what participants actually make and whether the finished sheet leaves with you.',
    steps: [
      {
        title: 'Learn the material story',
        body: 'Ask the papermaker to explain the fibres and preparation already completed before the class. Observe a full forming demonstration so the movements have a purpose beyond copying a gesture.',
      },
      {
        title: 'Form a modest first sheet',
        body: 'Follow the maker’s guidance on the mould and suspension. Concentrate on a consistent sheet rather than adding decoration, and ask how the water and fibres are behaving under your hands.',
      },
      {
        title: 'Finish with the maker’s method',
        body: 'Help with transfer and pressing only as instructed. Confirm drying and collection arrangements, then record the fibre, technique and practitioner’s name alongside your finished sheet.',
      },
    ],
    completion: 'You have formed a sheet with a trained papermaker and received the dried result.',
    tip: 'Different washi traditions have distinct materials and methods; use the workshop’s actual name rather than treating all handmade paper as washi.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['unesco-intangible-cultural-heritage-8ca0094139'],
        purpose:
          'Read the heritage record for the craft’s materials and transmission; arrange current instruction separately.',
      },
    ],
  },
  'try-kalamkari-drawing-on-cloth-with-an-artisan': {
    title: 'Try Kalamkari drawing on cloth with an artisan',
    summary:
      'Learn the handling of a traditional Kalamkari pen and complete a small cloth study with a practitioner.',
    time: 'Choose a small introductory session, with extra finishing time if the process requires it.',
    cost: 'Pay the artisan’s teaching fee and clarify which cloth, colours and finishing are included.',
    place:
      'An artisan-led studio or workshop with suitable space for the demonstrated textile process.',
    preparation:
      'Find a practitioner who names their Kalamkari tradition and offers beginner teaching. Ask about the stage you will perform yourself; a small drawing sample is more realistic than completing an entire traditionally processed textile.',
    steps: [
      {
        title: 'Understand the prepared cloth',
        body: 'Ask what treatment has already been applied and how it affects the drawing. Watch the artisan handle the pen, noting how colour delivery and line weight are controlled.',
      },
      {
        title: 'Make a small original study',
        body: 'Practice a few lines on scrap cloth before beginning the final sample. Choose a permitted simple motif with your teacher’s advice, and ask about meanings rather than inventing symbolic explanations.',
      },
      {
        title: 'Complete the appropriate finishing',
        body: 'Follow the artisan’s directions for drying, fixing or later collection. Keep the maker’s name and process notes with the sample, and ask permission before sharing teaching photographs or recordings.',
      },
    ],
    completion:
      'You have made a cloth study under a practitioner’s guidance and know its next care steps.',
    tip: 'Ask what distinguishes this workshop’s process from printed Kalamkari so you can describe what you actually learned.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['all-india-artisans-and-craftworkers--e95c335ce2'],
        purpose:
          'See documented artisan-led Kalamkari activity; locate and confirm a current teaching session independently.',
      },
    ],
  },
  'learn-madhubani-linework-from-a-practicing-artist': {
    title: 'Learn Madhubani linework from a practicing artist',
    summary:
      'Study the visual language of Mithila painting with an artist and complete a small original study.',
    time: 'Plan a practitioner-led introductory session rather than a complete large painting.',
    cost: 'Expect a teaching fee and basic materials; confirm whether paper and colours are supplied.',
    place: 'An artist’s teaching space or a live class with materials prepared in advance.',
    preparation:
      'Choose an artist who works within the Mithila tradition and offers beginner instruction. Ask what a first study can reasonably include, and learn the difference between copying an example and making your own composition.',
    steps: [
      {
        title: 'Look with the artist',
        body: 'Study a few examples together and ask how borders, linework and filled space are used. Let the practitioner explain regional and personal choices rather than applying a generic set of folk-art rules.',
      },
      {
        title: 'Practice before composing',
        body: 'Try the taught line patterns on a separate sheet. Select a simple subject with the artist and leave enough time to finish its border and details rather than starting a crowded scene.',
      },
      {
        title: 'Finish and credit the study',
        body: 'Complete the small work, then ask which aspects of the technique need more practice. Record the artist’s name and the tradition accurately if you display or share the piece.',
      },
    ],
    completion:
      'A small finished study reflects a technique you learned directly from a practicing artist.',
    tip: 'Pay for teaching even when the materials are inexpensive; the knowledge is the main part of the experience.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['all-india-artisans-and-craftworkers--4fd3c94f98'],
        purpose:
          'Read documented practitioner training activity as context, then confirm a current artist-led lesson.',
      },
    ],
  },
  'make-a-lippan-mud-and-mirror-panel': {
    title: 'Make a Lippan mud-and-mirror panel',
    summary:
      'Form clay relief and set safe-edged mirrors into a small panel with a Kachchh craftsperson.',
    time: 'Allow a workshop session and the maker’s recommended drying period.',
    cost: 'A small panel is a moderate craft spend; confirm the frame and collection arrangements.',
    place: 'An artisan-led craft space using suitable clay materials and safe-edged mirrors.',
    preparation:
      'Find a Kachchh practitioner teaching Lippan work and ask what preparation is included. Choose a small decorative panel, check the mirror edges and avoid assuming a modern workshop sample reproduces a traditional wall exactly.',
    steps: [
      {
        title: 'Learn the design’s context',
        body: 'Ask the practitioner about the relief and mirror arrangements in their work. Sketch a simple composition that suits the panel, keeping the pattern manageable and avoiding motifs whose use you do not understand.',
      },
      {
        title: 'Build relief with guidance',
        body: 'Practice forming a short line or small shape before starting the panel. Follow the teacher’s method for attaching the relief and mirrors, leaving handling and drying space around the edges.',
      },
      {
        title: 'Finish and protect the piece',
        body: 'Allow the work to dry as directed and check its hanging or display support. Ask about cleaning and moisture, then credit the artisan and Kachchh tradition when describing the finished panel.',
      },
    ],
    completion:
      'You have a finished small clay-and-mirror panel and clear instructions for its care.',
    tip: 'Photograph the arrangement before fixing mirrors; it helps preserve spacing when your hands are occupied.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['kachchh-district-administration-176b6247f7'],
        purpose:
          'Read the district’s account of regional crafts, including mud-and-mirror work, before arranging practitioner instruction.',
      },
    ],
  },
  'engrave-a-palm-leaf-keepsake-with-an-odisha-artisan': {
    title: 'Engrave a palm-leaf keepsake with an Odisha artisan',
    summary:
      'Try a small Tala Patra engraving while learning its tools and storytelling conventions from a practitioner.',
    time: 'Reserve an artisan-led session, allowing time for careful tool practice.',
    cost: 'Pay for the practitioner’s time and prepared leaves rather than buying unfamiliar tools first.',
    place: 'An Odisha artisan’s workshop or a genuine visiting teaching session.',
    preparation:
      'Choose a practitioner who offers a small beginner Tala Patra project. Ask which stages are suitable for you and how the leaves have been prepared; the sharp engraving tool needs direct instruction.',
    steps: [
      {
        title: 'Examine a finished example',
        body: 'Ask how the incision becomes visible and how leaves are joined or stored. Choose a small secular design with the teacher’s advice instead of copying sacred imagery without context.',
      },
      {
        title: 'Practice the tool on a spare',
        body: 'Try short controlled marks while the artisan checks your grip and support. Keep the design open and simple so the leaf remains intact and the session does not become a race to finish.',
      },
      {
        title: 'Complete and document the keepsake',
        body: 'Follow the practitioner’s finishing process and inspect the result together. Record the craft’s name, place and maker, then ask how to protect the leaf from bending and damp.',
      },
    ],
    completion:
      'You have engraved a small prepared leaf and can explain the taught process accurately.',
    tip: 'Let the artisan set the project’s scale; the preparation and control matter more than the number of details.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['ministry-of-tourism-government-of-in-6398e2f31f'],
        purpose:
          'Learn about Odisha’s practitioner community and palm-leaf craft; confirm a teaching arrangement directly.',
      },
    ],
  },
  'make-a-batik-sample-with-a-trained-practitioner': {
    title: 'Make a batik sample with a trained practitioner',
    summary: 'Learn wax-resist dyeing in a supervised workshop and finish one small fabric sample.',
    time: 'Allow the teaching session and additional dyeing or finishing time.',
    cost: 'Expect a workshop fee including suitable fabric, wax and dye handling.',
    place:
      'A properly equipped studio with a trained batik practitioner supervising heat and dye work.',
    preparation:
      'Read the Indonesian Batik heritage record and choose a workshop that explains its specific tradition. Ask whether wax removal and colour fixing are included; do not improvise hot-wax equipment at home.',
    steps: [
      {
        title: 'Understand the resist',
        body: 'Watch the practitioner apply wax and explain the effect it creates in dye. Choose a small original pattern with their guidance, asking about designs reserved for particular settings or meanings.',
      },
      {
        title: 'Make a controlled sample',
        body: 'Practice the applicator on scrap fabric before committing to the final piece. Let the tutor manage unfamiliar heat and chemical stages, and focus on the relationship between line, open cloth and colour.',
      },
      {
        title: 'Finish the textile properly',
        body: 'Complete or arrange the studio’s wax-removal and fixing process. Ask how to wash and store the sample, and keep the practitioner’s name and actual technique with your record of the experience.',
      },
    ],
    completion:
      'You have a completed wax-resist fabric sample and know which stages you performed.',
    tip: 'One colour and a clear pattern make the resist visible without turning the first session into a complicated production.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['unesco-intangible-cultural-heritage-fbc146d7c1'],
        purpose:
          'Read the cultural and material context of batik; use a trained practitioner for the full practical process.',
      },
    ],
  },
  'fuse-a-small-glass-panel-in-a-studio': {
    title: 'Fuse a small glass panel in a studio',
    summary:
      "Arrange compatible glass under a tutor's guidance and collect the kiln-fused piece after firing.",
    time: 'Plan a studio session followed by a separate firing and collection period.',
    cost: 'Compare the complete workshop fee, including glass, kiln firing and collection or postage.',
    place: 'A glass studio that supplies compatible materials and supervises handling.',
    preparation:
      'Choose a beginner fusing project rather than hot-glass blowing. Confirm age, access and eye-protection requirements, what size panel is included and how the finished work will be returned after the kiln cycle.',
    steps: [
      {
        title: 'Design within the studio’s limits',
        body: 'Select a few compatible colours from the tutor’s materials. Arrange the main shapes before smaller details and ask how the firing may change edges, transparency and spacing.',
      },
      {
        title: 'Assemble with safe handling',
        body: 'Use the provided tools and handling rules for pre-cut pieces. Let the tutor advise on attachments and thickness, and keep a photograph so your piece can be identified after firing.',
      },
      {
        title: 'Collect and inspect the result',
        body: 'Wait for the studio’s collection instructions rather than rushing cooling. Check the finished piece together, ask about its intended decorative use and choose an appropriate display support at home.',
      },
    ],
    completion:
      'You have collected a kiln-fused glass panel assembled during your supervised session.',
    tip: 'A small test-sized panel leaves room in the budget to try a second design after seeing how glass changes in the kiln.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['corning-museum-of-glass-1181be23ec'],
        purpose:
          'See the museum’s supervised fusing process and collection model; find a suitable current local studio.',
      },
    ],
  },
  'tell-a-short-story-in-sand-animation': {
    title: 'Tell a short story in sand animation',
    summary:
      'Move a shallow layer of sand across a lit surface and perform a sequence of changing images.',
    time: 'Give yourself an afternoon to explore the material and rehearse a short sequence.',
    cost: 'Clean craft sand and a shallow tray are inexpensive; a lightbox is optional.',
    place: 'A stable covered table where sand stays contained and away from eyes and electronics.',
    preparation:
      'Watch an example of artist-led sand animation and choose three images that can transform into one another. Use a sealed suitable lightbox or ordinary tray; do not construct unsafe exposed electrical lighting.',
    steps: [
      {
        title: 'Learn how the surface responds',
        body: 'Spread a thin layer and make marks with fingers or a simple blunt tool. Try both removing sand for light shapes and gathering it for dark ones before planning a detailed picture.',
      },
      {
        title: 'Rehearse transformations',
        body: 'Choose a beginning, change and ending that use the previous image’s shapes. Practice moving between them without stopping to reset the entire tray, accepting traces as part of the visual story.',
      },
      {
        title: 'Perform the short sequence',
        body: 'Invite someone to watch from a clear angle or record only your hands and tray. Perform the images in order, then ask which transition read most clearly and clean up the material.',
      },
    ],
    completion: 'You have performed a complete sequence of changing sand images for a viewer.',
    tip: 'A tree becoming a face or a circle becoming a landscape is enough story for a first attempt.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['icebreakers-productions-8e7c37aa70'],
        purpose:
          'See the animator-led sand-animation process and workshop format; arrange practical instruction if needed.',
      },
    ],
  },
};
