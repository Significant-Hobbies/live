import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const ADVENTURE_GUIDES: Record<string, CuratedExperienceGuide> = {
  'navigate-a-beginner-orienteering-course-with-a-paper-map': {
    title: 'Navigate a beginner orienteering course with a paper map: a practical starting plan',
    summary:
      'Use a beginner course to make route choices, orient a paper map and find a series of controls.',
    time: 'A short introduction and a course suited to your pace.',
    cost: 'A low entry fee; organizers may lend a compass.',
    place: 'A managed park or beginner event with clearly stated boundaries.',
    preparation:
      'Choose a newcomer course and ask about distance, terrain and access. Read the meeting instructions and tell the organizer this is your first attempt.',
    steps: [
      {
        title: 'Learn the map at the start',
        body: 'Ask the organizer to explain the symbols, control descriptions and finish procedure. Locate the start and a nearby obvious feature on the ground. Check the course closing time before choosing your own pace.',
      },
      {
        title: 'Navigate one leg at a time',
        body: 'Turn the map to match your surroundings and choose a simple route to the next control. Pause at recognizable features instead of rushing. Stay within the event boundaries and use its help procedure if uncertain.',
      },
      {
        title: 'Return and review',
        body: 'Report to the finish even if you leave controls incomplete. Compare one successful route choice with one confusing leg and mark what helped you relocate. Keep the map as a record of the decisions you made.',
      },
    ],
    completion:
      'You have completed or deliberately shortened a beginner course and checked back with the organizer.',
    tip: 'Walking gives you more time to connect map symbols with the ground; speed can remain optional.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-orienteering-70adb79ab2'],
        purpose:
          'Read the newcomer guide before choosing a beginner course and learning its map, controls and finish procedure.',
      },
    ],
  },
  'find-a-permitted-geocache-near-home': {
    title: 'Find a permitted geocache near home: a practical starting plan',
    summary:
      'Turn a familiar local outing into a small search while respecting the cache owner’s rules and public access.',
    time: 'An hour or two for one easy nearby cache.',
    cost: 'Often free with an existing phone; some listings require paid access.',
    place: 'A permitted public trail or park with a suitable active listing.',
    preparation:
      'Choose low difficulty and terrain ratings and read recent logs. Check opening hours, land-manager rules and whether a phone signal is needed for the listing.',
    steps: [
      {
        title: 'Read before setting out',
        body: 'Save the coordinates, description and allowed approach. Check for special restrictions and take a pen if there is a physical logbook. Pick a route you can comfortably reverse if the cache cannot be reached.',
      },
      {
        title: 'Search without damage',
        body: 'Stay on authorized access and inspect likely hiding places gently. Do not dig, dismantle structures or disturb wildlife. If the coordinates point somewhere unsafe or private, stop rather than treating the listing as permission.',
      },
      {
        title: 'Leave an accurate record',
        body: 'Sign the log when found, close the container properly and replace it as intended. Follow site-specific rules about exchanging objects. Record an honest unsuccessful search if needed and report a damaged container through the platform.',
      },
    ],
    completion:
      'You have visited a permitted cache site and logged the actual outcome while leaving its surroundings intact.',
    tip: 'A cache is a reason to notice a place; abandoning a difficult search can still be a good outing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['parks-canada-ad9cc23d69'],
        purpose:
          'Use Parks Canada’s geocaching information to check how cache searches fit the rules of a permitted visit.',
      },
    ],
  },
  'complete-an-earthcache-geology-field-challenge': {
    title: 'Complete an EarthCache geology field challenge: a practical starting plan',
    summary:
      'Learn a local geological feature through an EarthCache’s observation questions, with no container to hunt or object to collect.',
    time: 'A short preparation read and a site visit.',
    cost: 'Usually free apart from transport or site admission.',
    place: 'An active EarthCache site with lawful access and suitable terrain.',
    preparation:
      'Read the geological explanation and logging tasks before going. Confirm that you can reach the observation point safely and check local restrictions and opening hours.',
    steps: [
      {
        title: 'Understand the field question',
        body: 'Identify which feature the task asks you to observe or compare. Bring only the simple recording materials it requests. Look up unfamiliar geological terms before the visit so the fieldwork remains about the actual landscape.',
      },
      {
        title: 'Observe on site',
        body: 'Visit the required point and make your own notes, sketches or permitted measurements. Stay on public access and away from unstable rock or edges. Leave stones and fossils in place unless an explicit collecting rule says otherwise.',
      },
      {
        title: 'Submit your own explanation',
        body: 'Answer the task in your own words and send it through the current listing’s process. Keep spoilers out of the public log. Save a short note explaining what the site revealed about its geological history.',
      },
    ],
    completion:
      'You have visited the site and submitted evidence-based answers to its educational logging tasks.',
    tip: 'An EarthCache is a field lesson; copying another visitor’s answers removes the part that makes it worth doing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['geocaching-hq-d7b5274621'],
        purpose:
          'Review the EarthCache guidance before planning the site observations and answers required by your chosen listing.',
      },
    ],
  },
  'explore-a-tidepool-with-a-naturalist': {
    title: 'Explore a tidepool with a naturalist: a practical starting plan',
    summary:
      'Meet intertidal wildlife on a naturalist-led shore visit selected around local tides, access and conditions.',
    time: 'A guided outing plus arrival and return time.',
    cost: 'A modest walk fee or donation; transport may cost extra.',
    place: 'A managed tidepool site chosen by the naturalist.',
    preparation:
      'Book an advertised guided visit and ask about slippery terrain and access. Confirm the meeting time, clothing and cancellation arrangements; tide timing is part of the plan.',
    steps: [
      {
        title: 'Listen to the shore briefing',
        body: 'Ask the guide to explain the safe area, changing tide and return route. Learn which surfaces to avoid and how the group will stay together. Keep hands free where footing requires concentration.',
      },
      {
        title: 'Look closely without collecting',
        body: 'Observe from stable positions and let the naturalist identify what you find. Do not pry animals off rocks, carry them between pools or pocket shells. Ask before moving anything and follow the site’s handling rules.',
      },
      {
        title: 'Leave on the agreed schedule',
        body: 'Return with the group before the tide changes the route. Record a few identified organisms and their microhabitats afterwards. Clean footwear as locally advised so the outing does not transfer unwanted organisms elsewhere.',
      },
    ],
    completion:
      'You have completed the guided shore visit and can describe several organisms in the habitat where you observed them.',
    tip: 'Choose a guided outing with a clear tide plan; a low-water photograph alone cannot tell you whether a route is safe.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['california-academy-of-sciences-dbf12e8e73'],
        purpose:
          'Read the tidepooling guidance before discussing shoreline conditions, wildlife observation and local handling rules with your naturalist.',
      },
    ],
  },
  'take-a-supervised-introductory-caving-trip': {
    title: 'Take a supervised introductory caving trip: a practical starting plan',
    summary:
      'Try a beginner underground route with qualified leadership, suitable equipment and a clear agreement about comfort and turnaround.',
    time: 'A provider-led session with time for fitting and briefing.',
    cost: 'A paid introductory trip; ask what equipment and transport are included.',
    place: 'A beginner cave selected and authorized by the provider.',
    preparation:
      'Choose a qualified local provider and describe your experience, access needs and concerns. Ask about tight passages, water, vertical sections, weather decisions and how to leave early.',
    steps: [
      {
        title: 'Check the actual route',
        body: 'Read the provider’s description rather than choosing by dramatic photographs. Confirm that its beginner trip matches your needs and that there is a suitable alternative if conditions change. Ask who makes the final go decision.',
      },
      {
        title: 'Follow the equipment briefing',
        body: 'Have the leader fit and check the supplied kit. Learn the communication and group-spacing rules before entering. Stay with the leader and never explore a side passage because it appears short or easy.',
      },
      {
        title: 'Debrief above ground',
        body: 'Return and account for equipment as instructed. Discuss one cave feature and one movement technique you learned. Record what felt manageable so a future trip can be chosen from experience rather than pressure.',
      },
    ],
    completion:
      'You have returned from a supervised beginner trip and can describe its route and the group’s operating rules.',
    tip: 'A commercial show-cave visit is a valid alternative when you want underground geology without a crawling or climbing component.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-caving-association-cb1847a2fd'],
        purpose:
          'Use the caving newcomer route to prepare questions about leadership, equipment and a suitable first underground trip.',
      },
    ],
  },
  'try-target-archery-at-a-supervised-range': {
    title: 'Try target archery at a supervised range: a practical starting plan',
    summary:
      'Learn target archery through a supervised introduction focused on range commands, equipment fit and repeatable shooting.',
    time: 'A booked taster or the first session of a beginner course.',
    cost: 'A paid lesson with beginner equipment usually available to borrow.',
    place: 'An established club or supervised target-archery range.',
    preparation:
      'Contact the club about newcomer sessions, minimum age and adaptations. Confirm equipment provision and clothing instructions; do not purchase a bow before receiving advice about fit.',
    steps: [
      {
        title: 'Learn the stop command',
        body: 'Attend the full range briefing and ask the instructor to check your equipment. Understand when shooting and collection are allowed. Keep arrows and bow use within the instructor’s commands, even when other participants seem experienced.',
      },
      {
        title: 'Practise a simple sequence',
        body: 'Follow the coach’s setup and release instruction at the beginner distance. Focus on one cue at a time rather than chasing a score. Tell the coach promptly if the draw or posture feels uncomfortable.',
      },
      {
        title: 'Review a small group',
        body: 'Compare the arrows as evidence of repeatability, with the instructor explaining what is useful to change. Learn the collection procedure and return borrowed kit. Ask which kind of follow-up course is appropriate if you enjoyed it.',
      },
    ],
    completion:
      'You have shot under supervision and can follow the range’s shooting, stop and collection commands.',
    tip: 'Consistent comfortable technique is a better first target than choosing a heavier bow or a farther target.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['archery-gb-0e7b643b5e'],
        purpose:
          'Explore the beginner archery route before contacting a club about supervised instruction and equipment fit.',
      },
    ],
  },
  'join-a-dusk-bat-walk-with-a-detector': {
    title: 'Join a dusk bat walk with a detector: a practical starting plan',
    summary:
      'Experience bats through a guided dusk walk that combines visual observation with properly interpreted detector sounds.',
    time: 'An evening session around the guide’s chosen sunset window.',
    cost: 'Often a small event fee or donation; detectors may be shared.',
    place: 'A lawful public route chosen by a bat group or reserve.',
    preparation:
      'Check the event’s season, weather policy and route accessibility. Ask whether detectors are provided and bring a light for the return without planning to shine it at roosts.',
    steps: [
      {
        title: 'Learn what the detector changes',
        body: 'Ask the guide how its equipment converts ultrasonic activity into audible signals. Understand that a sound alone may not establish a species. Check the walking boundaries before darkness reduces visibility.',
      },
      {
        title: 'Watch a small area',
        body: 'Stand where the guide directs and listen without crowding the detector. Look at flight patterns and surroundings as well as the signal. Keep clear of water edges and leave roost entrances undisturbed.',
      },
      {
        title: 'Compare observations afterwards',
        body: 'Write down the time, conditions and any identification the guide supports. Separate a confirmed species from a possible one. Follow the group back on the agreed route and return shared equipment before leaving.',
      },
    ],
    completion:
      'You have observed a guided session and can explain how detector evidence complements what you saw.',
    tip: 'Warm, suitable conditions matter; a quiet evening with few bats is not a reason to approach a roost.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['bat-conservation-trust-7369677c5d'],
        purpose:
          'Use the bat-watching information to plan questions about guided walks, detectors and respectful observation.',
      },
    ],
  },
  'take-a-sheltered-water-paddleboard-starter-lesson': {
    title: 'Take a sheltered-water paddleboard starter lesson: a practical starting plan',
    summary:
      'Take a paddleboard introduction where a qualified instructor chooses the water, equipment and beginner progression.',
    time: 'A booked lesson with changing and briefing time.',
    cost: 'A paid lesson with board and required safety equipment included.',
    place: 'A provider-selected sheltered water site with an agreed launch point.',
    preparation:
      'Tell the instructor your water confidence and access needs before booking. Confirm rescue cover, equipment fit, water conditions and cancellation policy; sheltered water still requires qualified planning.',
    steps: [
      {
        title: 'Start with the safety briefing',
        body: 'Learn the provider’s launch, communication and emergency procedures. Have all supplied equipment fitted and checked by the instructor. Let them select the appropriate buoyancy aid and leash arrangement for that specific environment.',
      },
      {
        title: 'Practise control at your level',
        body: 'Begin in the position the instructor recommends and learn stopping and turning before traveling farther. Practise recovery only under their direction. Staying seated or kneeling can be a complete first session if that suits you.',
      },
      {
        title: 'Finish with a clear boundary',
        body: 'Return when directed, help account for equipment and discuss which skills you can repeat under supervision. Ask what training and local knowledge would be needed before any independent outing. Record the experience without claiming independent competence.',
      },
    ],
    completion:
      'You have completed a supervised introduction and practised basic control within the instructor’s chosen area.',
    tip: 'Choose the teaching and conditions over a photogenic location; a good first session gives you time to learn without pressure to stand.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['canal-river-trust-cd8bb232d0'],
        purpose:
          'Read the paddlesports introduction before discussing a suitable paddleboard lesson, equipment and water conditions with a provider.',
      },
    ],
  },
  'build-a-kite-and-test-it-in-an-open-park': {
    title: 'Build a kite and test it in an open park: a practical starting plan',
    summary:
      'Make a simple kite, test it in a safe open field and adjust one feature after watching its flight.',
    time: 'A making session and a separate suitable-weather flight.',
    cost: 'Paper, light framing materials and ordinary string are inexpensive.',
    place: 'A worktable and an authorized open field away from power lines and roads.',
    preparation:
      'Choose a beginner kite design and check the field’s rules. Use ordinary kite string, never glass-coated or metallic line, and wait for moderate conditions without thunderstorms.',
    steps: [
      {
        title: 'Build a light first version',
        body: 'Follow the design’s proportions and attach the line securely. Keep decorations light so they do not overwhelm the structure. Ask for help with cutting and check the frame for sharp exposed ends before carrying it outside.',
      },
      {
        title: 'Test in a clear space',
        body: 'Look for overhead wires, roads, people and wildlife before launching. Have a helper launch if useful and keep the line manageable. Stop if wind becomes too strong or the kite drifts toward an unsafe area.',
      },
      {
        title: 'Adjust from the flight',
        body: 'Notice whether the kite spins, dives or will not rise, then consult the design’s troubleshooting guidance. Change one feature and try again in comparable conditions. Retrieve every piece of string and material before leaving.',
      },
    ],
    completion:
      'Your handmade kite has had a safe flight trial and one documented adjustment based on what it did.',
    tip: 'A short controlled flight counts; longer line can create more problems than it solves on a first outing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-scout-association-f517ecdb22'],
        purpose:
          'Follow the kite-making activity for your first design before testing and adjusting it in a permitted open field.',
      },
    ],
  },
  'build-and-dismantle-a-small-outdoor-den': {
    title: 'Build and dismantle a small outdoor den: a practical starting plan',
    summary:
      'Build a temporary woodland den in an approved activity area and leave the space ready for others afterwards.',
    time: 'A relaxed afternoon including dismantling and cleanup.',
    cost: 'Free where the site provides an activity area and materials.',
    place: 'An authorized den-building space or your own suitable garden.',
    preparation:
      'Ask the land manager where building is allowed and which loose materials may be used. Choose a low design and avoid cutting branches or borrowing material from wildlife habitat.',
    steps: [
      {
        title: 'Choose a small footprint',
        body: 'Inspect the ground and support with the site leader where available. Keep clear of paths and fragile plants. Decide how the den will come apart before assembling it, and use pieces you can move without strain.',
      },
      {
        title: 'Build for temporary play',
        body: 'Arrange lightweight material in a stable low structure using the site’s guidance. Avoid heavy overhead branches and anything that could trap a person. Test from outside and keep the entrance unobstructed throughout the activity.',
      },
      {
        title: 'Restore the space',
        body: 'Take a photograph if wanted, then dismantle the den unless the manager explicitly wants it left. Return materials to the designated place and remove imported string or tape. Check the ground for overlooked litter or damaged vegetation.',
      },
    ],
    completion:
      'You have made a small temporary den and completed the agreed restoration of its site.',
    tip: 'A den can be a simple windbreak or tiny hideaway; it does not need to be a load-bearing shelter or overnight camp.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['national-trust-ccab6e3f52'],
        purpose:
          'Use the den-building activity to plan a low temporary structure within the land manager’s material and site rules.',
      },
    ],
  },
  'ride-a-velodrome-in-a-coached-beginner-session': {
    title: 'Ride a velodrome in a coached beginner session: a practical starting plan',
    summary:
      'Discover track cycling through a coached taster that teaches velodrome etiquette and unfamiliar bike handling step by step.',
    time: 'A scheduled taster plus equipment fitting time.',
    cost: 'A paid session, with suitable bike and helmet hire confirmed in advance.',
    place: 'An accredited velodrome or club track running beginner instruction.',
    preparation:
      'Ask whether the session accepts your current cycling level and what bike skills are required. Confirm equipment, clothing, access and whether the first session stays on a gentle section.',
    steps: [
      {
        title: 'Understand the track setup',
        body: 'Have the coach fit the bike and explain how it differs from a road bicycle. Learn the entry, spacing and stopping procedures before riding. Do not rely on familiar habits when controls or gearing are different.',
      },
      {
        title: 'Follow the coached progression',
        body: 'Ride only the lines and speeds the coach assigns. Concentrate on smooth movement and predictable spacing. Tell the coach if you need to pause, and use the venue’s instructed method for leaving the riding area.',
      },
      {
        title: 'Review the next step',
        body: 'Complete the session’s cool-down and equipment return. Ask which handling skills need more practice before another taster or accreditation stage. Keep your first experience separate from any claim that you are cleared for unsupervised track riding.',
      },
    ],
    completion:
      'You have completed a beginner track session and understand the venue’s next-step requirements.',
    tip: 'Track riding is about predictable control first; matching faster riders is not the purpose of an introductory lesson.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-cycling-b4066a6b42'],
        purpose:
          'Read the track-cycling introduction before asking a velodrome about coached beginner sessions and required riding skills.',
      },
    ],
  },
  'try-curling-at-a-supervised-ice-rink-taster': {
    title: 'Try curling at a supervised ice-rink taster: a practical starting plan',
    summary:
      'Try curling through a coached introduction to moving on ice, delivering a stone and understanding an end.',
    time: 'A taster session with time for shoes and equipment.',
    cost: 'A paid rink session; ask whether all equipment is supplied.',
    place: 'A curling rink with qualified beginner coaching.',
    preparation:
      'Read the rink’s clothing and footwear requirements and explain any mobility needs. Ask about delivery sticks or wheelchair provision rather than assuming a sliding delivery is required.',
    steps: [
      {
        title: 'Get comfortable on the ice',
        body: 'Attend the safety briefing and let the coach fit the provided equipment. Practise moving and stopping in the assigned area. Learn where stones and brushes belong so other participants can move predictably.',
      },
      {
        title: 'Try delivery and sweeping',
        body: 'Follow the coach’s chosen beginner method and take turns with plenty of space. Use an offered adaptation if it suits you. Observe how the stone’s direction and distance change without attempting someone else’s full-speed delivery.',
      },
      {
        title: 'Play a short end',
        body: 'Join a coached mini-game or scoring demonstration when the group is ready. Discuss why one stone counts and another does not. Return equipment and ask what a beginner course adds beyond the taster.',
      },
    ],
    completion: 'You have tried the coached techniques and can follow a short end’s basic scoring.',
    tip: 'Ask about a delivery stick at booking; the experience can focus on placement and strategy without requiring a deep sliding position.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['perth-curling-6bcc33871d'],
        purpose:
          'Use Perth Curling’s introductory-session route to ask about coaching, footwear and adaptations before booking.',
      },
    ],
  },
  'join-a-fossil-walk-led-by-a-local-geologist': {
    title: 'Join a fossil walk led by a local geologist: a practical starting plan',
    summary:
      'Read a fossil-bearing landscape with a local expert while keeping access, collecting and coastal conditions within their guidance.',
    time: 'A guided field outing plus travel to its meeting point.',
    cost: 'A low walk fee or museum-program charge.',
    place: 'A managed fossil site selected by a knowledgeable local guide.',
    preparation:
      'Book an advertised beginner fossil walk and ask about terrain, tide and collecting rules. Choose an observation-focused outing; you do not need a hammer or a specimen to take home.',
    steps: [
      {
        title: 'Learn the site boundaries',
        body: 'Hear the guide’s explanation of safe ground, unstable cliffs and any tidal return deadline. Ask what collecting is permitted. Treat the guide’s chosen route as the boundary rather than following another group into an attractive exposure.',
      },
      {
        title: 'Observe evidence in context',
        body: 'Compare fossil shapes with the surrounding rock and listen to the explanation of their age and environment. Photograph permitted examples with scale. Do not climb cliffs, excavate an exposure or remove protected material.',
      },
      {
        title: 'Keep a field record',
        body: 'Note a few identified features and distinguish the guide’s confirmed identification from your guess. Record the site’s collecting rules beside the photographs. If something unusual appears, let the guide decide how it should be reported.',
      },
    ],
    completion:
      'You have completed a guided geological visit and can describe a fossil in its landscape context.',
    tip: 'A photograph with its rock and location context often preserves more useful information than an unlabeled fossil in a drawer.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['natural-history-museum-london-24af2fdeed'],
        purpose:
          'Read the fossil-searching guidance before discussing coastal conditions and collecting restrictions with your local walk leader.',
      },
    ],
  },
  'take-an-introductory-indoor-bouldering-lesson': {
    title: 'Take an introductory indoor bouldering lesson: a practical starting plan',
    summary:
      'Explore indoor bouldering as coached movement and problem solving, with safe landing and downclimbing habits taught first.',
    time: 'A beginner induction and a short climbing session.',
    cost: 'A gym lesson and shoe hire; specialist equipment can be borrowed.',
    place: 'An indoor bouldering gym offering supervised beginner instruction.',
    preparation:
      'Book a genuine beginner session and ask about adaptations, floor surfaces and landing instruction. Tell the coach about relevant movement limitations before choosing problems.',
    steps: [
      {
        title: 'Learn the gym’s ground rules',
        body: 'Complete the induction and identify climbing zones and fall areas. Practise the coach’s landing and downclimbing method at a low height. Keep belongings and waiting people away from the mats beneath other climbers.',
      },
      {
        title: 'Try low simple problems',
        body: 'Choose the coach’s suggested holds and stop before fatigue reduces control. Study the movement from the ground and try one change in foot placement. Downclimb whenever possible instead of repeatedly jumping from the top.',
      },
      {
        title: 'Reflect on one solved movement',
        body: 'Describe a move that became easier through technique rather than force. Ask which problems are appropriate for another supervised visit. Finish while you can still climb down with control and return borrowed shoes.',
      },
    ],
    completion:
      'You have completed the induction and attempted several low beginner problems using the gym’s safety rules.',
    tip: 'A useful first success might be an easier descent or a better foothold, not reaching the highest hold.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-mountaineering-council-ddac4308ff'],
        purpose:
          'Review the indoor-climbing introduction before booking a bouldering induction that teaches landing and downclimbing.',
      },
    ],
  },
  'climb-a-tree-with-a-qualified-recreational-climbing-provider': {
    title:
      'Climb a tree with a qualified recreational climbing provider: a practical starting plan',
    summary:
      'Explore a tree through a professionally led recreational climb using a checked harness system and tree-friendly practices.',
    time: 'A guided session; full independent-climbing courses take longer.',
    cost: 'A paid provider session with specialist equipment supplied.',
    place: 'A provider-selected tree with permission and an appropriate managed climbing area.',
    preparation:
      'Choose a provider with recognized recreational tree-climbing training, rescue arrangements and suitable insurance. Discuss access needs, height comfort and cancellation conditions before booking.',
    steps: [
      {
        title: 'Agree a comfortable climb',
        body: 'Ask how the provider inspects the tree and what the session actually involves. Set a personal height or time boundary and understand how descent works. No photograph or group goal should determine how far you go.',
      },
      {
        title: 'Use the supervised system',
        body: 'Let the leader fit and check equipment and teach the required movements. Stay on the assigned system and follow commands. Never copy rope or knot arrangements later from memory as a substitute for full training.',
      },
      {
        title: 'Notice the living structure',
        body: 'Pause only where the guide permits and look at bark, branches and canopy life without collecting or damaging anything. Descend when ready and discuss how the equipment protects the tree as well as the climber.',
      },
    ],
    completion:
      'You have completed a provider-led climb and returned comfortably within your agreed limits.',
    tip: 'A first guided climb gives an experience of the canopy; it does not qualify you to rig or climb trees independently.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['tree-climbing-planet-e40c50a9f0'],
        purpose:
          'A provider example for supervised no-experience public climbs lasting two to six hours; contact the provider about upcoming dates, suitability and cost.',
      },
    ],
  },
  'make-a-local-walking-loop-using-a-public-ferry': {
    title: 'Make a local walking loop using a public ferry: a practical starting plan',
    summary:
      'Plan a local footpath loop around a scheduled public ferry and enjoy seeing familiar ground from both banks.',
    time: 'A half-day suited to the walking distance and ferry schedule.',
    cost: 'Ordinary local transport or ferry fares, plus optional refreshments.',
    place: 'Public paths linked by a licensed scheduled passenger ferry.',
    preparation:
      'Choose a ferry that accepts foot passengers and check current service, access and weather notices. Plan a return alternative that does not depend on the last crossing running.',
    steps: [
      {
        title: 'Draw a realistic loop',
        body: 'Mark the ferry terminals, legal walking routes and a few comfortable rest points. Check actual terminal access rather than assuming a riverside path connects directly. Allow time for boarding and a missed crossing.',
      },
      {
        title: 'Travel the route attentively',
        body: 'Follow public paths and the operator’s boarding instructions. Stay in passenger areas and keep clear of the landing edge. Notice how the river changes the view of streets and landmarks you normally approach by road.',
      },
      {
        title: 'Return with a usable route',
        body: 'Use the planned return or its backup if service changes. Note the actual distance, surfaces and waiting time. Save a simple route with the operator link so you can repeat it without relying on an old timetable.',
      },
    ],
    completion:
      'You have completed a legal local loop involving a scheduled ferry and recorded what the route actually required.',
    tip: 'The route can be short; combining two familiar banks with a crossing often provides enough novelty for a satisfying microadventure.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['transport-for-london-1885d7bfd5'],
        purpose:
          'See official public-river transport information as an example; use the current local ferry operator for your chosen route.',
      },
    ],
  },
  'join-a-moth-recording-evening-with-a-nature-group': {
    title: 'Join a moth-recording evening with a nature group: a practical starting plan',
    summary:
      'Meet nighttime insects at a staffed moth-recording session and learn how observers identify and release their visitors.',
    time: 'An evening event, or a morning opening of an overnight trap.',
    cost: 'Often free or a small reserve-event fee.',
    place: 'A nature reserve, garden or community venue hosting a permitted event.',
    preparation:
      'Choose an advertised moth night with an experienced leader. Ask about lighting, access and finish time; electrical light-trap equipment should be managed by the organizer.',
    steps: [
      {
        title: 'Understand the observation setup',
        body: 'Ask the leader how the light sheet or trap is being used and when moths will be released. Follow instructions about bright lamps and electrical equipment. Choose a comfortable observation position without blocking the working area.',
      },
      {
        title: 'Compare a few visitors',
        body: 'Look at size, wing shape and markings while the leader explains identification features. Photograph only as permitted and avoid handling delicate wings. Leave difficult specimens for the recorder rather than insisting on a species name.',
      },
      {
        title: 'Close without disturbance',
        body: 'Observe the organizer’s release process and help only with tasks they assign. Record a few supported identifications and the event conditions. Leave lights and trap shutdown to the trained team and return on the agreed route.',
      },
    ],
    completion:
      'You have attended a staffed moth session and learned a few identification features from actual visitors.',
    tip: 'A daytime trap-opening event can offer the same close observation if a late-night outing is inconvenient.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['national-moth-week-a7ec365078'],
        purpose:
          'Use the National Moth Week example as background before finding a currently advertised, staffed moth-recording event.',
      },
    ],
  },
  'explore-a-nature-trail-using-an-all-terrain-wheelchair': {
    title: 'Explore a nature trail using an all-terrain wheelchair: a practical starting plan',
    summary:
      'Use a supported all-terrain wheelchair outing to explore a nature route chosen around your own needs and preferences.',
    time: 'Equipment fitting and a trail visit at a comfortable pace.',
    cost: 'Hire may be free or paid; transport and assistance can add costs.',
    place: 'A park or provider with suitable equipment and an assessed route.',
    preparation:
      'Contact the provider well ahead about chair dimensions, transfer requirements, support and current trail conditions. Confirm that the specific equipment and route suit you; the label accessible is not enough.',
    steps: [
      {
        title: 'Plan around the user',
        body: 'Discuss the desired experience, seating, controls and assistance with the provider. Ask about toilets, rest points and a shorter return. Let the person using the chair decide what support they want and who supplies it.',
      },
      {
        title: 'Try the equipment first',
        body: 'Receive the provider’s fitting and operating briefing on suitable level ground. Check comfort and communication before committing to the trail. Adjust the plan if the equipment feels unsuitable rather than treating the reservation as an obligation.',
      },
      {
        title: 'Explore with a return margin',
        body: 'Stay on the approved route and monitor comfort, weather and available assistance. Turn back early if needed. Return the equipment and give specific feedback about surfaces or access information that differed from expectations.',
      },
    ],
    completion:
      'You have completed a supported nature outing with suitable equipment, or made an informed shorter choice after the fitting.',
    tip: 'Ask about the complete visit, including transport and toilets; the trail surface is only one part of usable access.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['yorkshire-dales-national-park-author-0145d95eb5'],
        purpose:
          'Use the Malham wheelchair example to start a provider enquiry about current equipment suitability and trail conditions.',
      },
    ],
  },
  'take-a-beginner-land-yachting-lesson': {
    title: 'Take a beginner land-yachting lesson: a practical starting plan',
    summary:
      'Try land yachting through a supervised beginner session on an authorized course with wind conditions chosen by the instructor.',
    time: 'A taster session plus equipment and safety briefing.',
    cost: 'A paid lesson with yacht and protective equipment included.',
    place: 'A sand-yachting school or authorized managed land-yacht course.',
    preparation:
      'Check the provider’s qualifications, equipment, access arrangements and weather policy. Ask about a double yacht if useful; winds and tides can move or cancel the session.',
    steps: [
      {
        title: 'Learn the controls stationary',
        body: 'Have the instructor fit the equipment and explain steering, sail control and stopping before movement begins. Learn the course boundary and signals. Do not launch until the instructor says the conditions and spacing are suitable.',
      },
      {
        title: 'Practise on the marked course',
        body: 'Follow the instructor’s initial route at their chosen pace. Concentrate on stopping and predictable turns before adding distance. Keep clear of public beach users and stop through the taught method when instructed.',
      },
      {
        title: 'Finish and assess',
        body: 'Return the yacht and help rinse or store equipment only as directed. Discuss which maneuvers you practised and what conditions affected them. Treat the taster as a supervised introduction rather than independent permission to use a beach.',
      },
    ],
    completion:
      'You have completed an instructor-led circuit and practised the provider’s starting, steering and stopping procedures.',
    tip: 'Check the cancellation terms before traveling; wind is part of the activity, not a detail a booking can guarantee.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['mer-et-rencontres-14a40eab9a'],
        purpose:
          'Review the provider’s land-yachting course information before confirming beginner instruction, access and weather arrangements.',
      },
    ],
  },
  'solve-an-escape-room-with-a-small-team': {
    title: 'Solve an escape room with a small team: a practical starting plan',
    summary:
      'Work through an escape room as a small team, choosing a format whose access and comfort rules suit everyone.',
    time: 'A timed game plus briefing and debriefing.',
    cost: 'A paid team session; check the minimum booking charge.',
    place: 'An established escape-room venue with clear exit and staff-help arrangements.',
    preparation:
      'Compare room themes, physical access, sensory effects and required movement. Confirm how to leave the room at any time and whether other groups may share your booking.',
    steps: [
      {
        title: 'Agree how to work together',
        body: 'Read the venue rules and listen to the briefing before touching props. Ask about emergency exits and staff communication. Agree that nobody must crawl, perform or tolerate a frightening effect merely to keep the game moving.',
      },
      {
        title: 'Share observations clearly',
        body: 'Say what you find and keep used clues separate where the rules allow. Let different people take a turn with puzzles. Ask for a hint when the group wants one rather than forcing a long unproductive standstill.',
      },
      {
        title: 'Debrief the puzzle chain',
        body: 'After the game, ask staff about an unresolved puzzle and compare how the team used information. Keep solutions private for future players. Record one moment of successful collaboration without treating a faster completion as the only worthwhile result.',
      },
    ],
    completion:
      'Your team has played the session and understood how several clues connected, whether or not it finished in time.',
    tip: 'Choose a room for the group’s interests and access needs; a difficult or frightening theme is optional.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-escape-game-ceac3fc4bd'],
        purpose:
          'Read the escape-room introduction to understand the format before comparing your team’s access and comfort needs.',
      },
    ],
  },
};
