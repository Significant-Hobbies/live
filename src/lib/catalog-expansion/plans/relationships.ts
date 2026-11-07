import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const RELATIONSHIPS_GUIDES: Record<string, CuratedExperienceGuide> = {
  'run-a-household-listening-circle': {
    title: 'Run a household listening circle',
    summary:
      'Give each willing participant uninterrupted time to describe what is working and what needs attention.',
    time: 'Set aside an hour when everyone who wants to attend can be unhurried.',
    cost: 'No purchases are needed beyond whatever makes the meeting comfortable.',
    place: 'A familiar private room with comfortable seating and an easy way to take a break.',
    preparation:
      'Invite participation rather than announcing a compulsory confrontation. Agree on a modest topic, uninterrupted turns and the option to pass; keep the first circle about everyday living rather than expecting it to resolve serious conflict.',
    steps: [
      {
        title: 'Agree how to listen',
        body: 'Choose a short turn length and who will keep time. Ask listeners to put devices aside, avoid preparing rebuttals and check whether a speaker wants a response or only to be heard.',
      },
      {
        title: 'Give each person a full turn',
        body: 'Start with a concrete experience of what is working or difficult. Reflect back what you understood before asking a clarifying question, and avoid turning someone’s example into a debate about their character.',
      },
      {
        title: 'Choose one shared next step',
        body: 'After everyone has had a turn, identify one practical change people actually agree to try. Name when you will check it again and finish without recording or circulating private comments.',
      },
    ],
    completion:
      'Each willing person has had an uninterrupted turn and the household has agreed one practical next step.',
    tip: 'A listening circle needs consent and a bounded topic; it is not a substitute for appropriate help with an unsafe situation.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['uc-berkeley-greater-good-science-cen-1229ab0050'],
        purpose:
          'Use the university’s listening method; the household circle is an original small-group adaptation.',
      },
    ],
  },
  'make-a-friendship-map-together': {
    title: 'Make a friendship map together',
    summary: 'Draw the places, rituals and shared moments that connect you with a friend.',
    time: 'Allow an unhurried hour with a friend who wants to take part.',
    cost: 'Paper and a couple of pens are enough for a shared map.',
    place: 'A comfortable private table, or a call with paper on both sides.',
    preparation:
      'Agree that the map will show your shared places and moments, not rank your other friendships. Choose a period you both enjoy revisiting and decide whether the result stays private or may be photographed.',
    steps: [
      {
        title: 'Start with shared anchors',
        body: 'Each person names a few places, rituals or small incidents that feel characteristic of the friendship. Write them as separate notes before drawing so both memories have room to appear.',
      },
      {
        title: 'Connect the moments',
        body: 'Place the anchors on a loose map and add lines for routes or recurring activities. Let differences in memory remain visible, marking uncertainty instead of correcting every detail into a single official account.',
      },
      {
        title: 'Choose something to revisit',
        body: 'Look for one modest place or ritual you would both enjoy returning to. Make a practical arrangement if wanted, then decide who keeps the map and whether either person wants a copy.',
      },
    ],
    completion:
      'You have made a jointly agreed map of shared experiences and chosen one possible return.',
    tip: 'The funniest small detail may say more about the friendship than a list of its biggest milestones.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['uc-berkeley-greater-good-science-cen-73385481b6'],
        purpose:
          'Use its prompts for recalling connection; the collaborative map is an original visual adaptation.',
      },
    ],
  },
  'hold-a-playlist-listening-exchange': {
    title: 'Hold a playlist listening exchange',
    summary:
      'Take turns playing personally significant tracks and explaining the memories attached to them.',
    time: 'Allow an evening or a short session with one or two tracks per person.',
    cost: 'Use music you can access legitimately; no paid new subscription is necessary.',
    place: 'A comfortable listening space with a speaker at a volume everyone can enjoy.',
    preparation:
      'Invite each person to choose a track they are comfortable connecting with a memory. Agree that anyone can skip a song or story, and avoid recording personal explanations without explicit permission.',
    steps: [
      {
        title: 'Set a small listening order',
        body: 'Collect track names and check that playback works before the session. Keep the first selection short enough that everyone will get an equal turn, including people whose musical tastes differ from the group.',
      },
      {
        title: 'Listen before discussing',
        body: 'Play the chosen track or an agreed excerpt without talking over it. Let its chooser explain what it means to them, then ask curious questions about the experience rather than judging their taste.',
      },
      {
        title: 'Make an optional shared record',
        body: 'Write a track list with only the context each person wants included. Share it privately if everyone agrees, and leave out a personal story even if the song itself remains on the list.',
      },
    ],
    completion:
      'Everyone has shared and heard a meaningful track with the context they chose to disclose.',
    tip: 'Let someone bring an instrumental piece or game soundtrack; meaningful music need not be a famous song.',
    updatedAt: '2026-11-08',
    resources: [
      {
        ...CATALOG_SOURCES['playlist-for-life-25fce5bcb3'],
        purpose:
          'Use the charity’s group playlist and conversation format, without making therapeutic claims.',
      },
    ],
  },
  'share-a-childhood-game-across-generations': {
    title: 'Share a childhood game across generations',
    summary:
      'Ask a willing older or younger relative to teach a game they played and play a complete round.',
    time: 'Allow a relaxed hour to learn the rules and play a full round.',
    cost: 'Choose a game using household materials or equipment someone already owns.',
    place: 'An accessible room or permitted outdoor space suited to the chosen game.',
    preparation:
      'Ask a relative or friend from another generation which game they would enjoy teaching. Check the movement and equipment needs together, and adapt the setting with their agreement rather than assuming everyone wants active play.',
    steps: [
      {
        title: 'Let the teacher explain their version',
        body: 'Ask how the game started, how turns work and what counts as finishing. Note household or regional rules as their version, rather than interrupting to impose rules you remember differently.',
      },
      {
        title: 'Play a practice round',
        body: 'Try the main actions slowly and ask questions through play. Adjust uncomfortable or inaccessible movements together while preserving the part of the game the teacher considers most important.',
      },
      {
        title: 'Finish and trade impressions',
        body: 'Play one complete agreed round, then ask what felt familiar or different. Keep a short private rule sheet if wanted so the game can be played again without relying on a vague memory.',
      },
    ],
    completion: 'You have learned another person’s childhood game and completed a shared round.',
    tip: 'Let the experienced player choose the pace; teaching a familiar game can matter as much as winning it.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['traditional-games-federation-of-indi-620183564b'],
        purpose:
          'Use a documented traditional game as one option; ask your teacher about their own household rules.',
      },
    ],
  },
  'create-a-shared-household-agreement': {
    title: 'Create a shared household agreement',
    summary:
      'Discuss routines, guests and shared spaces, then agree on a short set of practical expectations.',
    time: 'Reserve a calm hour and a short follow-up after trying the agreement.',
    cost: 'A shared page or printed sheet is enough; there is no need for a paid app.',
    place: 'A private household meeting where everyone can speak comfortably.',
    preparation:
      'Ask housemates to bring practical preferences about noise, cleaning, guests and shared belongings. Keep this a voluntary everyday-living discussion; questions about rent or legal obligations need the actual relevant documents and local advice.',
    steps: [
      {
        title: 'Describe needs concretely',
        body: 'Each person offers examples of what helps the home work for them. Replace vague labels such as tidy with observable actions, and check whether different schedules or access needs explain a recurring friction.',
      },
      {
        title: 'Agree a few workable routines',
        body: 'Choose responsibilities, communication channels and guest expectations that everyone understands. Make room for exceptions and check that quieter members have contributed rather than treating silence as consent.',
      },
      {
        title: 'Try and revisit',
        body: 'Give everyone the same short written version and choose a review date. Test the routines in daily life, then adjust what proves unrealistic without using the document to score each other’s behaviour.',
      },
    ],
    completion:
      'The household has a short, mutually understood set of everyday expectations and a review date.',
    tip: 'An agreement is useful when people can actually follow it; five clear routines can work better than a long rulebook.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-california-santa-cruz-f9f58fa5af'],
        purpose: 'Use the university’s communication guidance and household-expectation framework.',
      },
    ],
  },
  'arrange-an-accessible-outing-with-a-friend': {
    title: 'Arrange an accessible outing with a friend',
    summary:
      'Ask about access needs and preferences, plan together and spend an enjoyable afternoon out.',
    time: 'Plan together in advance, then allow an outing with flexible breaks.',
    cost: 'Choose a shared budget, including transport and any companion or booking requirements.',
    place: 'A venue and route confirmed against the participants’ actual access needs.',
    preparation:
      'Ask your friend what information and arrangements matter to them. Use first-hand access reviews as a starting point, then contact the venue about specific facilities; a general accessible label does not answer every person’s needs.',
    steps: [
      {
        title: 'Choose the experience jointly',
        body: 'Discuss the activity you both want before narrowing venues. Check travel, entrances, seating, toilets, sensory conditions and rest options as relevant, without asking your friend to disclose more than they want.',
      },
      {
        title: 'Confirm the uncertain parts',
        body: 'Contact the venue about the details reviews cannot settle and share the answers. Keep the route and booking information in a usable format, and agree a comfortable alternative if conditions change.',
      },
      {
        title: 'Enjoy and adapt',
        body: 'Follow your friend’s lead about assistance, breaks and timing during the visit. Afterwards, note what worked for a future outing and publish an access review only with any affected person’s permission.',
      },
    ],
    completion:
      'You have enjoyed an outing planned around agreed preferences and verified practical access information.',
    tip: 'Ask before helping; useful preparation should give your friend more choices during the day.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['forever-edinburgh-and-euan-s-guide-e2003ca679'],
        purpose:
          'See a disability-informed example of checking attractions, travel and facilities for specific access requirements.',
      },
    ],
  },
  'host-a-bring-one-object-story-circle': {
    title: 'Host a bring-one-object story circle',
    summary:
      'Invite a few people to introduce a nonprecious object through a short personal story.',
    time: 'Allow a small gathering with a few minutes of speaking time per person.',
    cost: 'No purchases are needed; ask guests to bring ordinary nonprecious objects.',
    place:
      'A private table where objects can be placed safely without being handled automatically.',
    preparation:
      'Invite a small group and explain the short story format. Make photographs or descriptions welcome alternatives to bringing an item, and agree that people may pass and decide whether anyone else may touch their object.',
    steps: [
      {
        title: 'Offer a simple opening',
        body: 'Begin with your own modest object and a specific memory of using or receiving it. Model a short story rather than a polished performance, leaving enough time for every invited person.',
      },
      {
        title: 'Listen to each object’s story',
        body: 'Give the speaker a full turn and ask before handling the item. Use one curious question about its story or use, avoiding demands for private family detail or proof of its value.',
      },
      {
        title: 'Close with permission',
        body: 'Let each speaker correct anything misunderstood and reclaim their object. Photograph the collection only if everyone agrees, then finish with one detail you enjoyed rather than ranking the most impressive story.',
      },
    ],
    completion:
      'Everyone who wanted a turn has introduced an object through a story they chose to share.',
    tip: 'An everyday item often invites more conversation than a valuable heirloom that its owner worries about passing around.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-moth-432b850925'],
        purpose:
          'Use the organisation’s concise true-story guidance for an original small object-story circle.',
      },
    ],
  },
  'go-on-a-friend-led-neighbourhood-tour': {
    title: 'Go on a friend-led neighbourhood tour',
    summary: 'Let a friend guide you through meaningful everyday places in their own area.',
    time: 'Allow an hour or two, with a route short enough for conversation and pauses.',
    cost: 'A local route can be free; agree any transport or refreshment spending.',
    place: 'Public routes and places your friend is comfortable showing you.',
    preparation:
      'Ask your friend to choose a few everyday places that tell their neighbourhood’s story. Agree distance, access and privacy boundaries; there is no need to identify their home, workplace or other people’s private addresses.',
    steps: [
      {
        title: 'Choose a few meaningful stops',
        body: 'Let your friend explain why each stop matters before looking up facts. Mix ordinary details with larger landmarks, and keep the route manageable enough that stories do not get rushed between long walks.',
      },
      {
        title: 'Walk as a conversation',
        body: 'Ask about changes, routines and favourite details while staying on permitted paths. Respect anyone who declines a photograph and avoid turning a personal tour into an audit of the area.',
      },
      {
        title: 'Offer your own route in return',
        body: 'At the end, name one thing you would have missed alone. If both people want it, arrange a second walk in your area with a similarly modest set of public stops.',
      },
    ],
    completion:
      'You have experienced a neighbourhood through a friend’s chosen stories and places.',
    tip: 'A bus stop, corner shop or patch of shade can explain daily life better than the obvious monument.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['federation-of-calgary-communities-ja-6fe7523892'],
        purpose:
          'Use the community-led walk principles and leader resources for a small consensual neighbourhood tour.',
      },
    ],
  },
  'exchange-handwritten-recipes-through-the-post': {
    title: 'Exchange handwritten recipes through the post',
    summary:
      "Trade a tested recipe with a friend and cook each other's version before a follow-up call.",
    time: 'Allow two short writing sessions, postal time and a later cooking date.',
    cost: 'Postage and ingredients are the main costs; keep the first exchange to one recipe each.',
    place: 'Your own kitchens, linked by post and an optional follow-up call.',
    preparation:
      'Choose a recipe you have actually made and ask whether your friend wants to exchange it. Check dietary needs and agree a mailing address privately; get permission before forwarding a family recipe or personal story.',
    steps: [
      {
        title: 'Write for a cook who is elsewhere',
        body: 'Include quantities, equipment, servings and the texture or colour cues you normally use. Add a short personal note about when you make the dish, clearly identifying any borrowed recipe source.',
      },
      {
        title: 'Cook from the received page',
        body: 'Read the whole recipe before starting and ask about unclear steps. Follow a safe complete method rather than guessing an important cooking instruction, noting what was easy or surprising in the other kitchen.',
      },
      {
        title: 'Compare over a conversation',
        body: 'Tell each other how the meal turned out and share any clarifications that would help a future cook. Keep the handwritten pages together with the date and contributor’s name, respecting the agreed sharing limits.',
      },
    ],
    completion:
      'Two handwritten recipes have crossed by post and both recipients have tried the food.',
    tip: 'Choose something that survives ordinary ingredient substitutions; a recipe requiring one unavailable local product can stall the exchange.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['library-of-congress-b7ff346f52'],
        purpose:
          'Use the library’s paper-preservation guidance for keeping handwritten recipe correspondence and its context.',
      },
    ],
  },
  'make-a-family-emergency-contact-plan-together': {
    title: 'Make a family emergency contact plan together',
    summary:
      'Agree how your household would reconnect during disruption and check that everyone has the plan.',
    time: 'Allow a calm planning session and a brief practice check.',
    cost: 'Paper copies and existing communication tools are enough for a first plan.',
    place:
      'A household conversation and a secure private place for the finished contact information.',
    preparation:
      'Read your local emergency authority’s planning guidance and invite the people who need the plan. Discuss communication preferences and access needs privately; share personal numbers only with the people who require them.',
    steps: [
      {
        title: 'Agree how to reconnect',
        body: 'Choose contact methods and meeting arrangements that fit your actual area and household. Consider what happens if usual phones or routes are unavailable, using local authority guidance for realistic conditions.',
      },
      {
        title: 'Make a short usable record',
        body: 'Write names, agreed contacts and meeting information clearly. Give each participant an accessible copy and keep unnecessary sensitive details out of versions carried in public.',
      },
      {
        title: 'Test the plan gently',
        body: 'Check that numbers work and everyone understands the agreed steps. Practice discussing a simple hypothetical disruption, fix confusing parts and choose when to review the information again.',
      },
    ],
    completion: 'Everyone included has a usable contact plan and has checked how it would work.',
    tip: 'A short accurate plan people can find is more useful than a detailed document no one knows exists.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['us-national-weather-service-90eeea90c0'],
        purpose:
          'Use the official communication-plan templates as a model, adapting contacts and actions to local authority guidance.',
      },
    ],
  },
  'visit-a-repair-cafe-with-a-friend': {
    title: 'Visit a repair cafe with a friend',
    summary:
      'Bring a suitable broken item, learn alongside a volunteer and share the repair process.',
    time: 'Allow the session’s advertised duration and time to discuss the item with volunteers.',
    cost: 'Repair Cafés may request donations or parts costs; confirm local arrangements.',
    place: 'An established public Repair Café accepting your type of item.',
    preparation:
      'Check the local event’s booking, item limits and house rules. Bring one suitable object with its known fault and any relevant parts; ask your friend to learn alongside you rather than expecting an instant free repair.',
    steps: [
      {
        title: 'Describe the problem clearly',
        body: 'Tell the volunteer what happened and what you have already tried, without attempting a risky demonstration. Let the organiser decide whether the item is appropriate to inspect in that setting.',
      },
      {
        title: 'Participate as invited',
        body: 'Watch the diagnosis and help only with tasks the volunteer considers suitable. Ask what the part or tool does, taking notes with permission instead of standing back as if it were a drop-off service.',
      },
      {
        title: 'Leave with a clear outcome',
        body: 'Test the result only as advised and understand any remaining limits. Thank the team, settle agreed parts costs or donations and discuss with your friend what you learned even if repair was impossible.',
      },
    ],
    completion:
      'You have participated in a repair attempt and understand the item’s outcome or next step.',
    tip: 'A failed repair can still teach a useful diagnosis; do not promise yourself the object will certainly be fixed.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['repair-caf-international-377f7069c0'],
        purpose:
          'Read the organisation’s explanation of bringing items and learning repairs with volunteers.',
      },
    ],
  },
  'host-a-clothing-swap-with-clear-boundaries': {
    title: 'Host a clothing swap with clear boundaries',
    summary:
      'Invite friends to exchange clean unwanted clothes with an agreed plan for anything left over.',
    time: 'Allow a short setup and a relaxed couple of hours for the exchange.',
    cost: 'Use borrowed rails or tables and agree whether any refreshments are shared.',
    place: 'An accessible private or booked community space with a changing option if needed.',
    preparation:
      'Invite a manageable group and state what condition and types of clothing are welcome. Agree a fair exchange method, privacy for trying things on and what each contributor should do with unswapped items.',
    steps: [
      {
        title: 'Make the boundaries visible',
        body: 'Ask people to bring clean clothes they own and freely want to give up. Label broad sections without judging bodies or sizes, and explain that anyone may leave without taking an item.',
      },
      {
        title: 'Give people room to choose',
        body: 'Open the swap using the agreed system and avoid pressuring someone to try on or accept clothing. Keep bags and personal garments separate from the exchange so no one’s belongings disappear by mistake.',
      },
      {
        title: 'Finish responsibly',
        body: 'Let contributors reclaim leftovers unless another plan was explicitly agreed. Confirm any donation recipient’s actual requirements before taking clothes there, then return the space tidy and free of abandoned bags.',
      },
    ],
    completion:
      'Clothes have changed hands voluntarily and every leftover item has an agreed destination.',
    tip: 'Smaller groups with clear item limits are easier to host than a room full of bags with no plan.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['fashion-revolution-af57517ddb'],
        purpose:
          'Use the campaign’s clothing-exchange format and find its organiser guidance before hosting.',
      },
    ],
  },
  'read-a-play-aloud-around-a-table': {
    title: 'Read a play aloud around a table',
    summary:
      'Assign roles and read a short play together, enjoying the characters without staging a production.',
    time: 'Choose a short play or scene that fits a comfortable evening.',
    cost: 'Use legally available scripts or library copies; props and costumes are optional.',
    place: 'A comfortable table or call where everyone can hear the other readers.',
    preparation:
      'Pick a script suitable for the group’s interests and number of readers, checking its content and permitted use. Agree that this is an informal reading and people may swap parts or decline a role.',
    steps: [
      {
        title: 'Give the text a quick introduction',
        body: 'Explain the setting and assign roles, including someone to read essential stage directions. Let people check pronunciation and content before starting, without demanding accents or acting experience.',
      },
      {
        title: 'Read through the action',
        body: 'Keep going through small stumbles so the scene can develop. Take a break at a natural point and let readers change roles if one part is much longer or more demanding than expected.',
      },
      {
        title: 'Talk about the characters',
        body: 'Finish the chosen text, then discuss a line or decision that surprised you. Return borrowed copies and decide whether another reading appeals, keeping any recording or public performance outside the plan unless rights are checked.',
      },
    ],
    completion: 'Your group has read a complete agreed play or scene aloud and discussed it.',
    tip: 'A lively short scene is a better first choice than a long classic everyone feels obliged to finish.',
    updatedAt: '2026-11-08',
    resources: [
      {
        ...CATALOG_SOURCES['folger-shakespeare-library-a146d55558'],
        purpose:
          'Choose a scene and identify its speaking roles in this complete published edition for your private reading.',
      },
    ],
  },
  'build-something-in-a-cooperative-video-game': {
    title: 'Build something in a cooperative video game',
    summary:
      'Agree on a small shared project and finish it together during one bounded gaming session.',
    time: 'Agree on a bounded gaming session with a few minutes to save the result.',
    cost: 'Use a game and compatible devices the group already has, checking any multiplayer costs.',
    place: 'A private invited game session, with voice or text communication everyone can use.',
    preparation:
      'Choose a cooperative building game and a tiny shared goal, such as a garden or meeting room. Confirm versions, joining permissions and accessibility settings in advance; use a new or backed-up world to protect existing builds.',
    steps: [
      {
        title: 'Define a finish everyone understands',
        body: 'Sketch the small build and decide what each person would enjoy contributing. Agree how changes are proposed and make room for beginners rather than assigning them only repetitive gathering tasks.',
      },
      {
        title: 'Build with permission',
        body: 'Communicate before altering another person’s section and help with unfamiliar controls. Keep the project small enough to finish within the session, using the game’s safe creative settings if that suits the group.',
      },
      {
        title: 'Walk through and save',
        body: 'Tour the result together and let everyone point out a contribution. Save or back up the world appropriately, take a screenshot only with agreed identifiers visible and finish at the planned stopping point.',
      },
    ],
    completion:
      'A small shared build is complete and saved with each player’s contribution recognised.',
    tip: 'A self-contained new world keeps an experiment from accidentally damaging a long-running personal project.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['minecraft-education-2135bdc775'],
        purpose:
          'See the publisher’s collaborative-building format and use the actual game’s multiplayer instructions.',
      },
    ],
  },
  'have-a-consent-based-question-evening': {
    title: 'Have a consent-based question evening',
    summary:
      'Use open-ended prompts, allow passes and learn something new about people you already know.',
    time: 'Allow an hour, with a clear finish and room for breaks.',
    cost: 'A few written prompts and a comfortable setting are enough.',
    place: 'A private conversation with people who have freely agreed to participate.',
    preparation:
      'Read the university’s question-exchange method and choose prompts suited to your relationship. Make passing ordinary, avoid surprises about intimate topics and agree that personal answers will not become material for a recording or public post.',
    steps: [
      {
        title: 'Choose the boundaries together',
        body: 'Explain the format and let each person remove questions they do not want. Start with ordinary interests or memories rather than assuming deeper disclosure is automatically a better outcome.',
      },
      {
        title: 'Take turns with curiosity',
        body: 'Ask one question and allow a complete answer without interruption. Offer your own response in turn, using follow-up questions to understand rather than to push someone beyond the answer they chose.',
      },
      {
        title: 'Finish without evaluation',
        body: 'Stop at the agreed time and ask whether anything should remain especially private. Thank each other for the conversation without scoring closeness or demanding a dramatic conclusion from one evening.',
      },
    ],
    completion:
      'You have completed a mutually comfortable question exchange and learned something new about each other.',
    tip: 'A useful question leaves space for a modest answer; passing can be part of a successful evening.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['uc-berkeley-greater-good-science-cen-c77d4dffb7'],
        purpose:
          'Read the original structured exchange and adapt the choice of prompts with both participants’ consent.',
      },
    ],
  },
  'make-a-group-portrait-with-everyone-directing': {
    title: 'Make a group portrait with everyone directing',
    summary:
      'Take turns choosing a pose, prop or location and create a portrait everyone agrees to keep.',
    time: 'Allow a relaxed hour for ideas, test frames and choosing a final image.',
    cost: 'An existing phone or camera and everyday props are enough.',
    place: 'A permitted location with comfortable seating and a background everyone agrees to use.',
    preparation:
      'Invite willing participants and agree where the image may be kept or shared. Ask what people want included, avoid revealing private addresses or documents and choose a camera position that accommodates the whole group.',
    steps: [
      {
        title: 'Let everyone direct one choice',
        body: 'Take turns suggesting a pose, object or arrangement that represents the group. Discuss how it will read in the frame and let a participant decline a pose without needing to explain why.',
      },
      {
        title: 'Make a few deliberate versions',
        body: 'Try the agreed arrangements with a timer or willing photographer. Check expressions and comfort between shots, giving people time to move rather than firing off a stream of unreviewed photographs.',
      },
      {
        title: 'Choose and keep by agreement',
        body: 'Review the images together and select one everyone is comfortable retaining. Respect requests to delete unwanted frames and get fresh permission before posting somewhere beyond the original agreed audience.',
      },
    ],
    completion:
      'Your group has selected a jointly directed portrait and agreed how it may be used.',
    tip: 'A seated portrait can be lively; hand positions, spacing and props offer choices without requiring uncomfortable poses.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['museum-of-contemporary-art-australia-cb4470c548'],
        purpose:
          'Use the museum activity to explore who directs a portrait and how subjects can shape their representation.',
      },
    ],
  },
  'join-a-beginner-welcoming-garba-circle': {
    title: 'Join a beginner-welcoming garba circle',
    summary:
      'Learn the basic steps and context of Gujarat’s garba, then join a welcoming community circle.',
    time: 'Allow a teaching session followed by a comfortable amount of community participation.',
    cost: 'A local workshop or gathering may charge; confirm the complete arrangement before attending.',
    place: 'A community event or practitioner-led class that explicitly welcomes beginners.',
    preparation:
      'Read the Gujarat garba heritage record and ask organisers about the event’s devotional or social setting. Confirm clothing, footwear, access, filming and visitor expectations instead of assuming every gathering has the same rules.',
    steps: [
      {
        title: 'Learn the context and basic step',
        body: 'Ask the teacher to explain what this circle is centred around and demonstrate a simple sequence. Practice at a comfortable pace, leaving room for other dancers rather than rushing to match the fastest participants.',
      },
      {
        title: 'Join where invited',
        body: 'Enter the circle as the host directs and follow its direction and spacing. Keep movements modest while learning, watching neighbouring dancers and stepping out safely when you need a break.',
      },
      {
        title: 'Close with respect',
        body: 'Thank the teacher or hosts and ask one question about the music or local practice. Keep photographs within the event’s rules and describe the experience accurately as a beginner’s participation.',
      },
    ],
    completion:
      'You have learned a basic garba sequence and joined a welcoming circle respectfully.',
    tip: 'A small introductory workshop can teach the pattern before a busy festival adds crowds and faster tempos.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['unesco-intangible-cultural-heritage-f6454311bd'],
        purpose:
          'Read the dance’s ritual context, circular form and intergenerational teaching practices.',
      },
    ],
  },
  'play-an-exquisite-corpse-drawing-game': {
    title: 'Play an exquisite-corpse drawing game',
    summary:
      'Take turns drawing concealed sections of a figure, then unfold the whole unexpected collaboration.',
    time: 'Allow a short playful session with time to reveal and discuss the drawing.',
    cost: 'Ordinary paper and pencils or markers are enough.',
    place: 'A table where each participant can briefly hide their section of the sheet.',
    preparation:
      'Read the museum’s folded-drawing activity and decide how many sections you need. Agree a light theme and avoid making a real person the subject of an unwanted caricature.',
    steps: [
      {
        title: 'Set up the hidden connections',
        body: 'Fold the sheet into sections and decide the drawing order. Leave the small connection marks the activity recommends so the next person can continue without seeing the whole image.',
      },
      {
        title: 'Draw and pass',
        body: 'Each participant contributes a section, conceals it and passes the sheet onward. Keep the pace comfortable and accept the previous connection as an invitation rather than trying to control what the final figure must become.',
      },
      {
        title: 'Reveal the collaboration',
        body: 'Unfold the page together and look for accidental relationships between the parts. Add an agreed title if you like, then decide whether to keep the original, make copies or start a second round.',
      },
    ],
    completion:
      'A complete unexpected drawing exists with a concealed contribution from every player.',
    tip: 'The surprise works best when no one secretly checks the earlier sections before the reveal.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-museum-of-modern-art-f74fc4dc99'],
        purpose: 'Follow the museum’s complete folded-paper collaborative drawing format.',
      },
    ],
  },
  'keep-a-short-distance-friendship-walking-appointment': {
    title: 'Keep a short-distance friendship walking appointment',
    summary:
      'Arrange four recurring walks with the same friend and let the route become a shared ritual.',
    time: 'Choose four short appointments over a month or another manageable period.',
    cost: 'A local route can be free; agree any café or transport costs in advance.',
    place: 'An accessible familiar route with places to pause and an easy shorter option.',
    preparation:
      'Ask one friend whether a recurring walk would fit their life. Choose a realistic length and meeting point together, and agree a simple cancellation method so the appointment stays welcome rather than becoming an obligation.',
    steps: [
      {
        title: 'Put the first dates in place',
        body: 'Choose a repeatable time and a route suited to both people’s pace. Discuss weather alternatives and access needs before the first outing, keeping the meeting easy to reach from your normal routines.',
      },
      {
        title: 'Let the conversation breathe',
        body: 'Walk at a pace that allows talking or comfortable silence. Take breaks when either person wants them and avoid turning the appointment into a fitness target that only one person chose.',
      },
      {
        title: 'Review after four meetings',
        body: 'Notice which time and route worked best and whether you both want to continue. Adjust the arrangement openly rather than assuming the original plan must become a permanent commitment.',
      },
    ],
    completion:
      'You have completed four mutually chosen walks and decided together whether to continue.',
    tip: 'A short reliable route often creates more actual time together than an ambitious outing repeatedly postponed.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-ramblers-3c076d18f2'],
        purpose:
          'Use the organisation’s route, group comfort and planning guidance for a small recurring walk.',
      },
    ],
  },
  'make-and-exchange-friendship-bracelets': {
    title: 'Make and exchange friendship bracelets',
    summary:
      'Choose colours for a friend, learn a simple knot or braid and exchange finished bracelets.',
    time: 'Allow an afternoon for learning a simple braid or knot and finishing both pieces.',
    cost: 'A few colours of cord or embroidery thread are inexpensive.',
    place: 'A table where cords can be secured while each person works.',
    preparation:
      'Ask whether your friend would enjoy wearing or keeping a bracelet, then choose a beginner pattern. Measure comfortably, avoid tiny loose beads around young children and keep knots adjustable enough for the intended wearer.',
    steps: [
      {
        title: 'Choose colours with a reason',
        body: 'Pick a small colour combination for each other and explain it if you want. Try the pattern on a short practice length before cutting the final cords, allowing for the tutorial’s finishing method.',
      },
      {
        title: 'Work side by side',
        body: 'Secure the cords and follow the complete braiding or knotting instructions. Help each other check the sequence when the pattern changes, keeping the tension even rather than pulling the work as tightly as possible.',
      },
      {
        title: 'Finish and exchange',
        body: 'Secure the ends as directed and check the fit without tying anything uncomfortably tight. Exchange the pieces, giving the recipient the choice to wear, display or keep it as a small memento.',
      },
    ],
    completion:
      'You have each made and received a finished bracelet with a personal colour choice.',
    tip: 'A key-ring-sized braid is a useful alternative when someone likes the gesture but does not wear bracelets.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-scout-association-94b8a18b1e'],
        purpose:
          'Use the illustrated beginner bracelet activity for braiding and secure finishing.',
      },
    ],
  },
  'host-a-shared-silent-reading-hour': {
    title: 'Host a shared silent reading hour',
    summary:
      'Bring your own books, read in companionable quiet and finish with optional conversation.',
    time: 'Allow an hour of reading with a little time for arrival and optional chat.',
    cost: 'Bring books you already own or borrow; agree refreshments separately.',
    place: 'A comfortable quiet room or a public venue that welcomes the gathering.',
    preparation:
      'Invite people to bring whatever they are reading and explain that there is no assigned book. Check seating, lighting and noise, and make social conversation optional so the quiet part remains the main experience.',
    steps: [
      {
        title: 'Settle in without homework',
        body: 'Let each person name their book only if they want to. Agree when the quiet hour starts and ends, put notifications aside and make room for ebooks, comics or other suitable reading formats.',
      },
      {
        title: 'Read in company',
        body: 'Keep conversation and device sounds outside the agreed reading period. Take a stretch or comfort break when needed without treating anyone’s reading speed or page count as a competition.',
      },
      {
        title: 'Close with a gentle invitation',
        body: 'At the end, offer a few minutes to share an interesting passage or impression without spoilers. Let people leave quietly, then decide whether the gathering deserves another date.',
      },
    ],
    completion:
      'You have spent a sustained reading period in comfortable company without assigned-book pressure.',
    tip: 'If using a café, ask about group use and expected purchases before promising anyone a free venue.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['silent-book-club-da60e72d95'],
        purpose:
          'Read the original organisation’s bring-your-own-book and optional-socialising format.',
      },
    ],
  },
  'play-a-complete-doubles-carrom-match': {
    title: 'Play a complete doubles carrom match',
    summary:
      'Learn the striker, queen and scoring rules, then finish a friendly four-person match.',
    time: 'Plan an evening long enough to learn and finish an agreed match.',
    cost: 'Borrow a board, striker and carrommen before buying a full setup.',
    place: 'A level table with comfortable seating on all four sides.',
    preparation:
      'Read the federation’s rules or ask an experienced player to teach them. Agree the match length, queen-covering and foul rules before starting, using appropriate board powder only according to the equipment’s guidance.',
    steps: [
      {
        title: 'Learn a controlled stroke',
        body: 'Take practice turns with the striker and explain the starting position. Give beginners time to understand pocketing and fouls, making the first few attempts a lesson rather than counting them as match play.',
      },
      {
        title: 'Play as two pairs',
        body: 'Seat partners opposite each other and use the agreed rules consistently. Keep a visible score and resolve uncertain situations with the rule source, avoiding a new house rule only when it benefits your team.',
      },
      {
        title: 'Finish the agreed match',
        body: 'Play to the score or game limit chosen beforehand and acknowledge a good shot on either side. Put the pieces away together and note which rule needs clarification before the next match.',
      },
    ],
    completion: 'Four players have completed a doubles match with an agreed scoring system.',
    tip: 'A shorter agreed format can fit a first evening while still giving the game a proper ending.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['indian-carrom-federation-a0ac57388e'],
        purpose: 'Use the federation’s equipment, doubles play, queen and scoring rules.',
      },
    ],
  },
  'learn-a-mahjong-ruleset-and-finish-a-game': {
    title: 'Learn a mahjong ruleset and finish a game',
    summary:
      'Choose one named ruleset, learn its tiles and complete a four-player game with a patient teacher.',
    time: 'Allow a patient teaching session and enough time for a full agreed game.',
    cost: 'Borrow a tile set and any ruleset-specific cards or racks needed.',
    place: 'A well-lit table with four comfortable seats and space for tiles.',
    preparation:
      'Choose one named ruleset with your teacher and check the tile set matches it. The linked resource covers American Mah Jongg; other traditions have different hands and scoring, so do not mix instructions casually.',
    steps: [
      {
        title: 'Meet the tiles and goal',
        body: 'Let the teacher explain the suits, special tiles and one possible completed hand. Practice drawing and discarding openly before hiding tiles, keeping a reference sheet available without apologising for using it.',
      },
      {
        title: 'Play a teaching hand',
        body: 'Move slowly through the turn sequence and ask about calls before making them. Use the selected ruleset’s actual guidance and allow corrections agreed for learning rather than adding silent penalties.',
      },
      {
        title: 'Complete a proper game',
        body: 'Play the group’s agreed format through to its finish and record the result. Ask each person to name one rule they understand better, then pack the tiles carefully for another session.',
      },
    ],
    completion: 'You have completed a four-player game under one clearly named mahjong ruleset.',
    tip: 'State the ruleset in the invitation; sharing a game name does not mean everyone learned the same rules.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['american-mah-jongg-association-07571381b1'],
        purpose:
          'Use this association’s rules only when your group chooses the American Mah Jongg format.',
      },
    ],
  },
  'join-a-beginner-shape-note-singing-session': {
    title: 'Join a beginner shape-note singing session',
    summary:
      'Sit in a Sacred Harp singing square and try the notation and unaccompanied group sound.',
    time: 'Allow an introductory singing session with time to meet the host.',
    cost: 'A local session may be free or request a contribution; confirm arrangements and book access.',
    place: 'An established Sacred Harp group that welcomes new singers.',
    preparation:
      'Read the beginner guide linked by the community organisation and contact a local host. Ask about books, access and session customs, and understand that the repertoire has a sacred hymn tradition even when participation welcomes varied beliefs.',
    steps: [
      {
        title: 'Find a suitable starting place',
        body: 'Tell the host you are new and ask where to sit for your voice and comfort. Listen to the explanation of the shapes and parts, using a loaned book if the group offers one.',
      },
      {
        title: 'Sing within the square',
        body: 'Join the syllables and words as demonstrated, following the group rather than trying to deliver a solo performance. Take breaks or listen when needed, keeping the volume comfortable for yourself and others.',
      },
      {
        title: 'Learn from a neighbour',
        body: 'Ask one experienced singer about a tune or notation you found difficult. Thank the host and decide whether you want to attend again after experiencing a complete section of the session.',
      },
    ],
    completion: 'You have tried shape-note singing within a welcoming established singing group.',
    tip: 'Listening for part of a tune is participation too; a first session does not require mastering the notation.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['sacred-harp-musical-heritage-associa-80fd987887'],
        purpose:
          'Use the community’s beginner guide, recordings and book information before attending a local singing.',
      },
    ],
  },
  'share-an-iftar-at-an-open-community-gathering': {
    title: 'Share an iftar at an open community gathering',
    summary:
      "Accept a public invitation to a Ramadan fast-breaking meal and learn the host community's etiquette.",
    time: 'Allow the host’s arrival time and an unhurried evening meal.',
    cost: 'Confirm whether the event is hosted, ticketed or asks for a contribution.',
    place: 'An openly advertised community iftar where visitors are explicitly welcome.',
    preparation:
      'Read about iftar and accept a public invitation or direct welcome from the host. Ask about arrival, prayer space, dress, access and food needs; do not arrive at an unadvertised family or religious gathering expecting admission.',
    steps: [
      {
        title: 'Arrive around the host’s schedule',
        body: 'Introduce yourself and ask where to wait or sit. Respect that people may be preparing to break a fast or pray, keeping questions and photographs for appropriate moments.',
      },
      {
        title: 'Share the meal considerately',
        body: 'Follow the host’s lead about when food is served and take a modest portion. Join conversation without assuming everyone’s practice or reasons for attending are the same.',
      },
      {
        title: 'Close as a guest',
        body: 'Help with a task only if invited and thank the organisers before leaving. Reflect on one thing you learned from the people present, keeping personal stories and images private unless they gave permission.',
      },
    ],
    completion:
      'You have shared a welcomed iftar gathering while following the host community’s arrangements.',
    tip: 'You do not need to undertake a fast to be a respectful invited guest at many open community iftars.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['unesco-intangible-cultural-heritage-12b4242d8d'],
        purpose:
          'Read the shared-meal context and varied community practices before accepting a current invitation.',
      },
    ],
  },
  'play-an-antakshari-song-relay-with-friends': {
    title: 'Play an antakshari song relay with friends',
    summary: 'Agree on a shared language or song pool and link songs by their ending sounds.',
    time: 'Allow a lively short session or an evening with planned breaks.',
    cost: 'No equipment is required beyond a timer or score sheet if your group wants them.',
    place: 'A space where singing at a comfortable volume will not disturb others.',
    preparation:
      'Agree which languages and song pool everyone knows well enough to enjoy. Choose rules for ending sounds, repeated songs, passes and team help; a friendly home game need not copy a formal competition’s pressure.',
    steps: [
      {
        title: 'Explain the relay clearly',
        body: 'Start with a familiar song excerpt and show how its ending leads to the next starting sound. Try an unscored round so newcomers understand the linking convention before teams begin.',
      },
      {
        title: 'Keep turns inclusive',
        body: 'Let teams consult briefly and sing only enough to identify the song. Accept the agreed passes and pronunciation rules, avoiding demands for full performances from people who joined for the game.',
      },
      {
        title: 'Finish at an agreed point',
        body: 'Use the round or time limit chosen in advance, then name the most surprising rediscovered song. If anyone wants a playlist, share titles rather than recordings of people singing without consent.',
      },
    ],
    completion:
      'Your group has completed a song relay using a mutually understood antakshari rule set.',
    tip: 'A shared decade, film tradition or language can make the game welcoming without making every choice too obvious.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['aurora-s-degree-and-pg-college-0273ee7926'],
        purpose:
          'See a primary organiser’s explanation of the song-ending relay; adapt a friendly format for your own group.',
      },
    ],
  },
  'attend-a-human-library-conversation': {
    title: 'Attend a Human Library conversation',
    summary:
      'Join an official public event and have a respectful conversation with a consenting volunteer sharing lived experience.',
    time: 'Allow the official event’s conversation slot and any orientation time.',
    cost: 'Check the organiser’s actual booking terms and transport costs before attending.',
    place: 'An official Human Library event or authorised online session.',
    preparation:
      'Use the organisation’s own listings to find a real programme and read its reader rules. Understand that volunteer participants choose what to discuss; attendance does not create permission to record, diagnose or publish their stories.',
    steps: [
      {
        title: 'Learn the event boundaries',
        body: 'Listen to the organiser’s introduction and choose a conversation within the offered format. Ask about respectful questions and confidentiality before the session begins, rather than assuming an ordinary library metaphor covers the rules.',
      },
      {
        title: 'Have a genuine dialogue',
        body: 'Ask open questions and listen to the person’s own account. Accept a declined question, avoid treating one participant as a spokesperson for everyone with a similar identity and allow the conversation to develop naturally.',
      },
      {
        title: 'Reflect privately afterwards',
        body: 'Thank the participant and follow the organiser’s closing process. Notice one assumption you reconsidered without repeating identifying details, and seek separate explicit permission for any story you hope to share.',
      },
    ],
    completion:
      'You have completed an official, consensual conversation and reflected on what you learned.',
    tip: 'Curiosity works best alongside humility; the aim is a person-to-person exchange rather than extracting a remarkable story.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-human-library-organization-91d37d4c19'],
        purpose:
          'Use the original organisation’s programme information and reader arrangements for an authorised event.',
      },
    ],
  },
  'join-a-facilitated-community-drum-circle': {
    title: 'Join a facilitated community drum circle',
    summary:
      'Borrow a percussion instrument and contribute to a group rhythm without needing a prepared performance.',
    time: 'Allow a complete introductory session with a little time to choose an instrument.',
    cost: 'Check session fees and whether instruments are loaned before buying percussion equipment.',
    place: 'A facilitated community music session that explicitly welcomes beginners.',
    preparation:
      'Contact the organiser about access, noise levels and supplied instruments. Choose a session led by an experienced facilitator, bring hearing protection if useful and ask how to participate comfortably without prior drumming experience.',
    steps: [
      {
        title: 'Find a comfortable sound',
        body: 'Ask the facilitator how to hold or place your instrument and make a gentle clear tone. Test the seating and reach before the circle begins, choosing a smaller instrument if a drum feels awkward.',
      },
      {
        title: 'Listen into the shared rhythm',
        body: 'Begin with a simple pattern and leave room for other players. Follow the facilitator’s cues for starting, stopping and changing dynamics, keeping the group sound more important than playing constantly.',
      },
      {
        title: 'Complete the shared ending',
        body: 'Stay attentive to the closing cue and let the final sound settle. Help return borrowed equipment, thank the facilitator and notice one moment when you could hear your part fitting the others.',
      },
    ],
    completion:
      'You have contributed to a complete facilitated group rhythm session at a comfortable level.',
    tip: 'A shaker or small percussion instrument can offer an easier entry than a loud hand drum.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['remo-music-center-4d0cb78cf3'],
        purpose:
          'See a primary facilitator’s beginner-welcoming, instrument-provided community format; confirm your local session independently.',
      },
    ],
  },
};
