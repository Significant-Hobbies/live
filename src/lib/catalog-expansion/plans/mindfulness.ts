import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const MINDFULNESS_GUIDES: Record<string, CuratedExperienceGuide> = {
  'make-a-sound-map-from-a-single-seat': {
    title: 'Make a sound map from a single seat',
    summary:
      'Listen for nearby and distant sounds and place them on a simple map without trying to identify every source.',
    time: 'Allow a short listening period and a few minutes to finish the map.',
    cost: 'Paper and a pencil are enough; no recording equipment is required.',
    place: 'A safe comfortable seat outdoors or beside an open window where listening is easy.',
    preparation:
      'Read the sound-map activity and choose a location where you can remain still without obstructing anyone. Use whatever hearing information is available to you; the result is a personal observation, not a test of hearing acuity.',
    steps: [
      {
        title: 'Establish your listening position',
        body: 'Mark yourself in the centre of the page and orient the paper to the space. Spend a moment listening without writing, letting nearby and distant sounds become distinguishable.',
      },
      {
        title: 'Place sounds rather than chase them',
        body: 'Add simple marks in the approximate direction and distance of what you hear. Use a question mark for an unknown sound and leave moving sources as a line or changing position.',
      },
      {
        title: 'Read the soundscape back',
        body: 'Look over the map and notice which sounds appeared briefly or continued throughout. Add a date and place if wanted, then compare with a companion’s view without correcting either person’s perception.',
      },
    ],
    completion: 'You have a small map showing the sounds you noticed from one fixed position.',
    tip: 'You can keep your eyes open; comfort and awareness of the surroundings matter more than following a rigid posture.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['us-national-park-service-activity-by-4f6f5cc251'],
        purpose:
          'Follow the place-based listening and approximate direction-and-distance mapping activity.',
      },
    ],
  },
  'look-at-one-museum-object-for-twenty-minutes': {
    title: 'Look at one museum object for twenty minutes',
    summary: 'Spend an unhurried visit noticing details in a single work before reading its label.',
    time: 'Allow twenty minutes with one object, plus ordinary visit time.',
    cost: 'Use a free collection online or check the chosen museum’s admission arrangements.',
    place:
      'A museum gallery with a comfortable viewing position, or a good digital collection image.',
    preparation:
      'Choose an artwork or object that can hold your interest without needing expert knowledge. Check seating and gallery rules, and begin without reading the full interpretation so your own first observations have space.',
    steps: [
      {
        title: 'Notice what arrives first',
        body: 'Look at the whole object and register the feature your eye returns to. Let questions emerge without searching for answers on your phone, using a comfortable distance that does not block other visitors.',
      },
      {
        title: 'Explore one part slowly',
        body: 'Follow an edge, repeated mark or change of material with your eyes. Return to the whole and notice whether the detail changes your sense of its scale, balance or possible use.',
      },
      {
        title: 'Read and look again',
        body: 'Read the label or collection record near the end of the session. Distinguish what you observed from the new contextual information, then give the object one final look before leaving.',
      },
    ],
    completion:
      'You have spent twenty unhurried minutes with one object and noticed details beyond a first glance.',
    tip: 'Choose a seat or digital image if standing still is uncomfortable; the sustained attention is the activity.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-museum-of-modern-art-62dd888a56'],
        purpose: 'Use the museum’s original prompts and tips for sustained attention to artworks.',
      },
    ],
  },
  'follow-a-colour-through-your-neighbourhood': {
    title: 'Follow a colour through your neighbourhood',
    summary: 'Choose one colour and take a gentle route guided by where it appears.',
    time: 'Allow a gentle local outing, with no distance target.',
    cost: 'A colour walk can be free and needs no camera.',
    place: 'A familiar public route with comfortable crossings and places to pause.',
    preparation:
      'Read Tate’s colour-walk activity and choose a colour that interests you. Keep the route subordinate to ordinary road awareness and access needs; do not follow a colour into private property or an unsafe crossing.',
    steps: [
      {
        title: 'Choose a visual anchor',
        body: 'Find one example of your colour near the starting point. Notice its brightness and texture, then look for another instance nearby without forcing every shade into a perfect match.',
      },
      {
        title: 'Let discoveries shape attention',
        body: 'Continue along a safe permitted route, watching how the colour appears in buildings, objects or plants. Pause to compare two examples and ask permission before photographing people or private activity.',
      },
      {
        title: 'Bring back a small record',
        body: 'At the end, recall a few appearances or make a simple colour sketch. Notice which ordinary detail you would have passed without the prompt, then put the route back into its everyday context.',
      },
    ],
    completion:
      'You have completed a local walk guided by noticing a colour in several different forms.',
    tip: 'The colour can be rare; a few carefully noticed examples are enough for a satisfying route.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['tate-a81af3d3c7'],
        purpose:
          'Follow Tate’s colour-led noticing activity, adapting the distance and route to your setting.',
      },
    ],
  },
  'draw-a-leaf-without-looking-at-the-page': {
    title: 'Draw a leaf without looking at the page',
    summary: "Let your eyes trace a leaf's edges while your hand follows slowly on paper.",
    time: 'Allow a short session with time for a second attempt if you enjoy it.',
    cost: 'A pencil, paper and a leaf you can legally use are enough.',
    place: 'A comfortable table with the leaf clearly visible beside the drawing surface.',
    preparation:
      'Choose a fallen or household leaf rather than picking from a protected place. Read the museum’s description of blind contour drawing and treat the exercise as following an outline, without expecting a realistic finished illustration.',
    steps: [
      {
        title: 'Look closely before drawing',
        body: 'Place the leaf where it will not move and identify a starting point on its edge. Notice small turns, tears and changes of direction that a quick glance would simplify away.',
      },
      {
        title: 'Follow with eyes and hand',
        body: 'Let your eyes travel slowly around the edge while your pencil responds on the page. Keep looking at the leaf rather than checking the drawing, pausing when you need to reorient.',
      },
      {
        title: 'Meet the drawing afterwards',
        body: 'Look at the result only when the route is complete. Compare a few marks with features you actually noticed, then make an optional second drawing without trying to erase the first one into correctness.',
      },
    ],
    completion:
      'You have completed a contour drawing by attending to the leaf rather than monitoring the page.',
    tip: 'A distorted outline can still show precise attention to a tiny notch or turn you had never noticed.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['san-francisco-museum-of-modern-art-19a5485545'],
        purpose:
          'Read the museum’s explanation of attending to an object while the drawing hand moves without visual checking.',
      },
    ],
  },
  'listen-to-a-whole-album-without-multitasking': {
    title: 'Listen to a whole album without multitasking',
    summary:
      'Give a complete recording your attention from beginning to end and notice its structure.',
    time: 'Choose an album whose full running time fits a comfortable uninterrupted session.',
    cost: 'Use a recording you own or can access legitimately with existing equipment.',
    place: 'A comfortable listening space with a speaker or headphones at a safe volume.',
    preparation:
      'Pick an album you are curious about and check its running order. Set aside other tasks, turn off unnecessary notifications and decide whether liner notes belong before or after listening rather than scrolling throughout.',
    steps: [
      {
        title: 'Prepare the beginning',
        body: 'Check playback and volume before starting, then place the device out of easy browsing reach. Notice the opening sounds and how the first track establishes a space or expectation.',
      },
      {
        title: 'Stay with the sequence',
        body: 'Listen through the album in its intended order, allowing attention to return when it wanders. Notice transitions, recurring sounds and changes in energy without requiring yourself to analyse every lyric.',
      },
      {
        title: 'Let the ending settle',
        body: 'Leave a short pause after the last track before reaching for another activity. Recall one transition or detail you had missed, then read the credits or context if you want to understand the recording further.',
      },
    ],
    completion:
      'You have listened to a complete album as a deliberate sequence without another task competing.',
    tip: 'Ordinary headphones are sufficient; sustained attention does not require an expensive sound system.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['classic-album-sundays-427142e4bc'],
        purpose:
          'Read the original listening-event organisation’s approach to giving an album undivided time and context.',
      },
    ],
  },
  'explore-an-everyday-object-through-touch': {
    title: 'Explore an everyday object through touch',
    summary: 'Study one safe object by texture, weight and shape before opening your eyes to it.',
    time: 'Allow a brief quiet session and a few minutes to compare impressions.',
    cost: 'Use an ordinary object already available to you.',
    place: 'A comfortable table with a clean safe item placed securely within reach.',
    preparation:
      'Choose something with no sharp points, fragile parts or irritating surface, such as a smooth wooden spoon. Read the tactile exploration activity and keep your eyes open if that is more comfortable than closing them.',
    steps: [
      {
        title: 'Meet the object through contact',
        body: 'Let your hand notice weight, temperature and broad shape without rushing to name every part. Move slowly enough to distinguish an edge, hollow or change in texture.',
      },
      {
        title: 'Describe precise differences',
        body: 'Explore how one side differs from another and try words beyond nice or rough. If working with someone, compare descriptions without turning the exercise into a guessing contest or requiring a particular answer.',
      },
      {
        title: 'Look and reconnect',
        body: 'Examine the object visually and connect its features with what your hands noticed. Return it to ordinary use, carrying one specific detail that was absent from your usual quick handling.',
      },
    ],
    completion:
      'You have explored one familiar object through touch and identified a few precise surface or shape details.',
    tip: 'An object you know well can be the most interesting choice because habit usually hides its small features.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['imbali-visual-literacy-project-389d6ca738'],
        purpose:
          'Follow the original art-education activity for carefully noticing and describing tactile qualities.',
      },
    ],
  },
  'notice-shadows-move-across-a-room': {
    title: 'Notice shadows move across a room',
    summary: 'Mark the edge of a daylight shadow several times and watch a familiar space change.',
    time: 'Allow a few brief observations across an hour or an afternoon.',
    cost: 'Paper and a pencil are optional; use removable markers only where permitted.',
    place: 'A comfortable indoor spot where daylight casts an ordinary shadow on a surface.',
    preparation:
      'Choose a window-lit surface without looking directly at the sun. Read the home activity and place a stable familiar object on paper in the light; leave its position unchanged between observations.',
    steps: [
      {
        title: 'Choose one clear edge',
        body: 'Observe the object’s whole shadow, then focus on an edge or repeated shape. Notice whether it is crisp or blurred and lightly trace a small part of its outline on the paper.',
      },
      {
        title: 'Return after a pause',
        body: 'Look again from the same position later and compare the edge with your first note or sketch. Let the movement become apparent through the comparison rather than staring continuously for a dramatic event.',
      },
      {
        title: 'Finish with a visual pair',
        body: 'Make a small before-and-after sketch or a private photograph of the surface. Describe what changed and what stayed, then remove temporary markers and return the room to use.',
      },
    ],
    completion:
      'You have observed a daylight shadow changing and kept a small comparison of its positions.',
    tip: 'Cloud cover can change the shadow as much as movement; uncertainty can be part of what you notice.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['curiodyssey-52abd7b9d3'],
        purpose:
          'Use the museum’s complete tested shadow-tracing activity, including object and indoor alternatives; this guide observes daylight through a window.',
      },
      {
        ...CATALOG_SOURCES['nasa-goddard-space-flight-center-ea4ba5d2cf'],
        purpose:
          'Read the complete public-outreach method for returning to the same shadow and comparing its position over time.',
      },
    ],
  },
  'explore-a-garden-through-scent': {
    title: 'Explore a garden through scent',
    summary:
      'Visit a permitted fragrant planting and compare the scents you can notice without picking anything.',
    time: 'Allow a short garden visit with pauses and an easy route back.',
    cost: 'Use a public free planting or check a garden’s current admission arrangements.',
    place: 'A permitted sensory garden or planted public route with space to pause.',
    preparation:
      'Read the sensory-garden guidance and choose a location suited to your access and scent preferences. Avoid plants that cause you discomfort, do not taste anything and ask before touching or picking cultivated material.',
    steps: [
      {
        title: 'Begin with the air around you',
        body: 'Pause before approaching a flower and notice any scent carried by the breeze. Choose a comfortable position rather than leaning into planted beds or blocking a narrow path.',
      },
      {
        title: 'Compare without collecting',
        body: 'Move between a few permitted fragrant plants and describe differences in your own words. Touch leaves only where explicitly invited, remembering that visual labels and human impressions may name the same scent differently.',
      },
      {
        title: 'Leave the garden intact',
        body: 'Recall a few contrasting scents and the places where you noticed them. Thank staff if they helped identify a plant, and leave all growing material for other visitors to experience.',
      },
    ],
    completion:
      'You have explored a planted place through scent and described several distinct impressions.',
    tip: 'A familiar herb can offer a useful reference point when an unfamiliar flower’s scent is difficult to describe.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['sensory-trust-2efb45b0e1'],
        purpose:
          'Read the sensory-access organisation’s guidance on exploring gardens through varied senses.',
      },
    ],
  },
  'try-a-beginner-body-scan-with-a-guided-recording': {
    title: 'Try a beginner body scan with a guided recording',
    summary:
      'Follow a brief body-scan practice and experiment with a comfortable seated or lying position.',
    time: 'Choose a brief guided recording and leave a few minutes before your next task.',
    cost: 'Use a freely available recording and a comfortable chair or mat you already own.',
    place: 'A quiet familiar place where you can sit or lie down without interruption.',
    preparation:
      'Choose a beginner body-scan recording from UCLA Mindful and preview its length. Find a comfortable supported position, adjust clothing or temperature and remember you may move, keep your eyes open or stop whenever you choose.',
    steps: [
      {
        title: 'Settle without forcing a posture',
        body: 'Start the recording at a comfortable volume and find where your body feels supported. Let ordinary breathing continue rather than adding a breath-holding exercise or trying to manufacture a special state.',
      },
      {
        title: 'Follow the invitation to notice',
        body: 'Bring attention to the areas named by the guide, accepting neutral or unclear sensations. When attention wanders, return to the next instruction without treating distraction as a failure.',
      },
      {
        title: 'Return at your own pace',
        body: 'After the recording, look around and move gently before standing. Notice whether the position and length suited you, and decide whether you would choose the same guide again.',
      },
    ],
    completion:
      'You have completed or consciously ended a short guided body scan and assessed whether the format suits you.',
    tip: 'A shorter recording you can approach comfortably is a sensible first choice; finishing is not a test of endurance.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['ucla-mindful-7d79b4a96e'],
        purpose: 'Choose the university’s body-scan recording and follow its own spoken guidance.',
      },
    ],
  },
  'eat-one-ordinary-snack-with-full-attention': {
    title: 'Eat one ordinary snack with full attention',
    summary:
      'Explore the appearance, aroma, texture and taste of a familiar snack without another activity competing.',
    time: 'Allow a few minutes for a small snack without another task.',
    cost: 'Choose a familiar affordable food that suits your normal eating needs.',
    place: 'A clean comfortable place to sit with drinking water available.',
    preparation:
      'Read the raisin practice and choose a safe familiar snack of an appropriate texture and portion. Respect allergies and swallowing needs, and approach it as sensory attention rather than a rule about how all meals should be eaten.',
    steps: [
      {
        title: 'Notice before tasting',
        body: 'Look at the snack’s surface and feel its weight or texture if appropriate. Smell it gently and notice how much you usually assume about a food before encountering it directly.',
      },
      {
        title: 'Take an ordinary careful bite',
        body: 'Eat at a comfortable pace, noticing texture, temperature and flavour as they change. Keep breathing and swallowing normal; there is no need to prolong a bite beyond what feels easy.',
      },
      {
        title: 'Finish without grading yourself',
        body: 'Eat the rest if you want and notice one detail that surprised you. Return to your day without turning the exercise into a diet rule or judging how distracted you were.',
      },
    ],
    completion:
      'You have explored a familiar snack deliberately and noticed a specific sensory detail.',
    tip: 'A small piece of familiar fruit can work; you do not need to choose a raisin if you dislike it.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['uc-berkeley-greater-good-science-cen-23fb8627ad'],
        purpose:
          'Read the complete sensory eating exercise and adapt the snack to your own ordinary needs.',
      },
    ],
  },
  'pause-at-the-same-window-for-a-week': {
    title: 'Pause at the same window for a week',
    summary:
      'Spend a few minutes observing one view daily and compare the small changes that usually escape you.',
    time: 'Spend a few minutes daily for a week, at a roughly comparable time if useful.',
    cost: 'Use a window and a small observation sheet already available at home.',
    place: 'A safe comfortable window view that does not intrude on neighbours’ private spaces.',
    preparation:
      'Choose a view with something changing, such as a plant, sky or public tree. Read the nature-from-your-window activity, then decide what to notice without opening windows unsafely or photographing identifiable private activity.',
    steps: [
      {
        title: 'Find a small frame',
        body: 'Choose one part of the view rather than trying to record the entire street. Note the first day’s light, movement or living detail, keeping your observation specific enough to recognise later.',
      },
      {
        title: 'Return without demanding novelty',
        body: 'Pause at the same place each day and compare what is actually visible. Record an unchanged day too, marking weather or timing differences rather than inventing a discovery to make the exercise worthwhile.',
      },
      {
        title: 'Look across the week',
        body: 'Review the few notes or sketches together and notice one recurring pattern or unexpected change. Finish the week deliberately, then decide whether the view still interests you enough for another visit.',
      },
    ],
    completion: 'You have returned to one view across a week and compared its ordinary changes.',
    tip: 'A single plant or patch of sky is enough when the wider view is busy or private.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-wild-center-8d642558a3'],
        purpose:
          'Use the museum’s focused window-observation activity for a small repeated noticing practice.',
      },
    ],
  },
  'make-a-temporary-arrangement-and-take-it-apart': {
    title: 'Make a temporary arrangement and take it apart',
    summary:
      'Arrange reusable small objects with care, enjoy it briefly and return each item to its place.',
    time: 'Allow a brief making session and time to take the arrangement apart.',
    cost: 'Use safe reusable objects you already own rather than purchasing decorative materials.',
    place: 'A clear flat surface where the arrangement will not obstruct ordinary household use.',
    preparation:
      'Read the museum’s object-arranging activity and choose small items with safe edges. Use household materials or legally collected fallen objects, and frame your design as a personal arrangement rather than copying a sacred ritual.',
    steps: [
      {
        title: 'Choose a small material language',
        body: 'Select a few shapes, colours or textures and place them within reach. Decide on a loose centre or boundary, allowing the available objects to shape the arrangement rather than searching for perfect matching pieces.',
      },
      {
        title: 'Arrange with attention',
        body: 'Place the objects one at a time and notice the spaces between them. Adjust a section deliberately, then pause before adding more so you can see when the composition feels complete.',
      },
      {
        title: 'Let the work end',
        body: 'Spend a moment looking at the finished arrangement and photograph it only if you want a record. Take it apart carefully and return each reusable object to its normal place.',
      },
    ],
    completion: 'You have made, observed and intentionally dismantled one temporary arrangement.',
    tip: 'A complete ending is part of the activity; the arrangement does not need to become another object to store.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['royal-collection-trust-5d5bff0748'],
        purpose:
          'Use the museum’s natural-object composition idea as a starting point for an original temporary household arrangement.',
      },
    ],
  },
};
