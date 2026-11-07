import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const TRAVEL_GUIDES: Record<string, CuratedExperienceGuide> = {
  'explore-a-building-during-an-open-house-festival': {
    title: 'Explore a building during an Open House festival: a practical starting plan',
    summary: 'Use a building open day to understand one place normally seen only from the street.',
    time: 'One booked visit, with extra time for queues and transport.',
    cost: 'Many festival visits are free; check individual listings and travel costs.',
    place: 'A participating building in a city with an announced Open House program.',
    preparation:
      'Choose a published listing and read its booking, identification and access details. A previous festival listing does not guarantee the building opens again.',
    steps: [
      {
        title: 'Pick a revealing building',
        body: 'Choose a place whose everyday purpose interests you: housing, a workshop or a civic building. Save the listing and route. Ask about steps, toilets and quieter visiting arrangements if those affect your visit.',
      },
      {
        title: 'Look for one design decision',
        body: 'During the authorized visit, follow the host’s route and photography rules. Notice how light, circulation or materials serve the building’s users. Ask a volunteer one focused question without blocking the next visitors.',
      },
      {
        title: 'Connect inside and outside',
        body: 'After leaving, sketch a simple relationship between the interior and street. Note what the host explained and what remains your interpretation. Keep the building’s name and architect only when confirmed by its information.',
      },
    ],
    completion:
      'You can explain one design choice using something you observed inside a participating building.',
    tip: 'Book one worthwhile visit with a generous buffer; a crowded itinerary can leave little time to notice the building.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['open-city-c3eccf8d9f'],
        purpose:
          'Check the festival FAQs before choosing a newly published building visit and confirming its ticket and access arrangements.',
      },
    ],
  },
  'see-conservation-work-at-a-heritage-open-day': {
    title: 'See conservation work at a heritage open day: a practical starting plan',
    summary:
      'Meet conservation through a public demonstration or advertised studio opening, with the practitioner setting the boundaries.',
    time: 'A scheduled demonstration or short open-day visit.',
    cost: 'Often free at heritage festivals; booking and travel may add costs.',
    place: 'A specifically listed conservation event, studio or heritage venue.',
    preparation:
      'Find an upcoming event that explicitly includes a conservator or conservation demonstration. Confirm booking and access; previous case studies describe possibilities rather than guaranteed future openings.',
    steps: [
      {
        title: 'Choose an object question',
        body: 'Read the listing and choose one thing to ask about materials, damage or decision-making. Bring a notebook rather than an object for unsolicited assessment. Check whether the session is a talk, demonstration or workspace visit.',
      },
      {
        title: 'Observe the investigation',
        body: 'Watch from the permitted area and leave tools and objects untouched unless invited. Ask how the practitioner distinguishes evidence from assumption. Respect restrictions on flash, photographs and confidential work belonging to clients.',
      },
      {
        title: 'Record a conservation choice',
        body: 'Describe one decision and the reason offered for it, such as leaving evidence visible or controlling the environment. Separate conservation from making an object look new. Follow any public learning links provided by the host.',
      },
    ],
    completion:
      'You have observed an advertised conservation activity and can describe one care decision and its reasoning.',
    tip: 'A clear explanation of why an object is left alone can be more revealing than a dramatic treatment demonstration.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['heritage-open-days-1c6664c04d'],
        purpose:
          'Use this conservation-event case study for ideas, then find an upcoming event that explicitly offers practitioner interpretation.',
      },
    ],
  },
  'decode-railway-signals-at-a-rail-museum': {
    title: 'Decode railway signals at a rail museum: a practical starting plan',
    summary:
      'Treat railway signaling as a puzzle about how people keep trains separated and routes understandable.',
    time: 'Two to three hours for selected displays and a break.',
    cost: 'Museum entry and transport are usually a modest outing cost.',
    place: 'The National Rail Museum in New Delhi, or a rail museum with signaling exhibits.',
    preparation:
      'Confirm current opening and exhibit access with the operator. The Delhi museum describes signaling equipment, but individual simulators and rides may be unavailable.',
    steps: [
      {
        title: 'Start with the real constraint',
        body: 'Find a signal or signaling model and read its label before guessing its purpose. Ask what information a driver receives and what another worker must do. Keep working equipment behind barriers untouched.',
      },
      {
        title: 'Follow one train movement',
        body: 'Use an interpretation panel or staff explanation to trace a single movement through a junction. Identify where a signal, points or permission changes the route. Distinguish a museum demonstration from present-day operating rules.',
      },
      {
        title: 'Draw a tiny railway',
        body: 'Sketch two tracks, a junction and the signals you understood. Explain where conflicting movements would need separation. Check your explanation against the display rather than inventing a complete signaling system from one exhibit.',
      },
    ],
    completion:
      'You can explain one displayed signal or route-control arrangement using a small labeled sketch.',
    tip: 'A historic signal may belong to a particular railway and period; avoid treating its meaning as a universal rule.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['delhi-tourism-63c603fc45'],
        purpose:
          'Read the museum’s signaling-equipment context before confirming current exhibits and opening arrangements with the operator.',
      },
      {
        ...CATALOG_SOURCES['national-rail-museum-indian-railways-39d360987f'],
        purpose:
          'Confirm current opening, closures and visitor arrangements with the museum operator; the tourism description supplies exhibit context.',
      },
    ],
  },
  'explore-a-historic-stepwell-s-water-architecture': {
    title: "Explore a historic stepwell's water architecture: a practical starting plan",
    summary:
      'Read a stepwell as a designed relationship between water, structure, shade and changing ground levels.',
    time: 'An unhurried one- to two-hour daytime visit.',
    cost: 'Allow for transport, any current entry charge and an optional local guide.',
    place: 'A publicly open stepwell such as Bai Harir ni Vav in Ahmedabad.',
    preparation:
      'Check current entry and the route’s stairs, surfaces and barriers. Arrange a local interpreter if useful; visit only publicly accessible areas and never enter the water.',
    steps: [
      {
        title: 'Begin at the top',
        body: 'Look at the entrance, orientation and visible sequence of landings. Read the official interpretation or ask a guide how the structure served its users. Establish the permitted route before descending any steps.',
      },
      {
        title: 'Notice structural changes',
        body: 'From safe public viewpoints, compare columns, openings and light at different levels. Consider how access to water changes with its level. Leave closed passages, edges and fragile stonework outside your exploration.',
      },
      {
        title: 'Make a sectional memory',
        body: 'Draw a simple side-view diagram from your observations, labeling shade, stairs and the water location if visible. Mark uncertain parts rather than filling them in. Add one question about maintenance or present-day water management.',
      },
    ],
    completion:
      'You have documented three design features that explain how the stepwell combines access, structure and shelter.',
    tip: 'A view from the upper level can still reveal the architecture when steep stairs or lower passages are unsuitable or closed.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['ahmedabad-municipal-corporation-df7ec481b1'],
        purpose:
          'Use the heritage record to connect the stepwell’s structure and water access while planning a permitted viewing route.',
      },
    ],
  },
  'learn-living-root-bridge-stewardship-from-a-local-guide': {
    title: 'Learn living-root-bridge stewardship from a local guide: a practical starting plan',
    summary:
      'Learn how a community maintains living infrastructure before deciding whether a particular bridge walk suits you.',
    time: 'A locally planned half day, with route-dependent walking and rest time.',
    cost: 'Pay an agreed local guiding fee and budget for transport and village charges.',
    place: 'A permitted living-root-bridge village in Meghalaya, with local guidance.',
    preparation:
      'Discuss the exact route, steps, weather and river conditions with a local guide. Ask about a shorter village-based interpretation if the approach would exceed your comfortable movement range.',
    steps: [
      {
        title: 'Arrange a community-led visit',
        body: 'Choose a guide connected to the village and agree the fee and meeting place. Ask how visits support local stewardship. Treat bridges and paths as infrastructure people use, rather than an unrestricted photography location.',
      },
      {
        title: 'Listen before crossing',
        body: 'Let the guide explain how roots are trained and cared for over years. Follow current limits and turn back when advised. Avoid pulling roots, crowding a crossing or leaving the established path for a photograph.',
      },
      {
        title: 'Describe the ongoing work',
        body: 'Record one maintenance practice and one community rule you learned. Ask permission before photographing people or private areas. Leave with an understanding of the continuing care involved, rather than a claim to have built a bridge.',
      },
    ],
    completion:
      'You can describe a locally explained stewardship practice and have followed the village’s visiting rules.',
    tip: 'The destination is the knowledge shared by the host; crossing a famous bridge is optional when conditions or access make it unsuitable.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['meghalaya-biodiversity-board-8cd914c7d4'],
        purpose:
          'Read the root-bridge context before arranging a local guide’s explanation of cultivation and community upkeep.',
      },
    ],
  },
  'attend-an-indian-observatory-s-public-visitor-session': {
    title: "Attend an Indian observatory's public visitor session: a practical starting plan",
    summary:
      'Visit a working observatory’s public program and connect telescope engineering with the questions astronomers ask.',
    time: 'An afternoon or evening visitor session, plus the journey to Kavalur.',
    cost: 'Allow for the current visitor fee, food and potentially substantial transport.',
    place: 'Vainu Bappu Observatory at Kavalur, Tamil Nadu, during its public outreach access.',
    preparation:
      'Recheck the observatory’s published visitor arrangements and registration link before travel. Plan return transport after dark and ask about walking distances and access requirements.',
    steps: [
      {
        title: 'Choose a realistic session',
        body: 'Read the current public schedule and decide whether to prioritize telescope interpretation or weather-dependent stargazing. Keep the trip flexible if cloud is forecast. Do not assume access to operating research instruments or future facilities.',
      },
      {
        title: 'Ask about the instrument',
        body: 'At a permitted exhibit or guided stop, ask how a telescope gathers and records light. Follow staff directions around equipment and restricted areas. Use only the viewing instruments and solar displays provided by the outreach team.',
      },
      {
        title: 'Keep one observing note',
        body: 'If the sky session runs, note one object and the instrument used without expecting photographic detail. If it is cloudy, record one engineering insight instead. Compare what you learned with the observatory’s published explanation afterward.',
      },
    ],
    completion:
      'You have attended a public visitor session and recorded one telescope or astronomy observation explained by the outreach team.',
    tip: 'Cloud can remove the sky view while leaving the engineering visit worthwhile; decide beforehand whether that still justifies your journey.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['indian-institute-of-astrophysics-2fb18c3184'],
        purpose:
          'Check the observatory’s public-visit arrangements before planning travel and treating any stargazing as weather-dependent.',
      },
    ],
  },
  'watch-a-rocket-launch-from-an-authorized-public-gallery': {
    title: 'Watch a rocket launch from an authorized public gallery: a practical starting plan',
    summary:
      'Plan an authorized public-gallery launch visit with enough flexibility for registration limits and launch delays.',
    time: 'A launch-day outing that may involve long waits or rescheduling.',
    cost: 'Gallery access may be free; transport and flexible accommodation can dominate the cost.',
    place: 'The authorized Launch View Gallery at Sriharikota, Andhra Pradesh.',
    preparation:
      'Use ISRO’s official visitor route and the launch gallery’s current registration instructions. Check eligibility, identification, confirmation and entry rules before committing to travel.',
    steps: [
      {
        title: 'Wait for official arrangements',
        body: 'Choose a launch only when the gallery publishes registration information. Submit accurate details through the official system and keep the confirmation. A launch announcement alone does not grant entry or guarantee that seats remain available.',
      },
      {
        title: 'Prepare for a long day',
        body: 'Check the latest reporting time, permitted belongings, weather arrangements and return travel. Bring only what the rules allow. Keep booking terms flexible because launches can move and a cancellation may happen after you have arrived.',
      },
      {
        title: 'Watch from the assigned area',
        body: 'Follow security and staff instructions throughout the visit. Use the official commentary to identify the vehicle’s role and mission objective. Remain within public viewing areas and accept delays without seeking an unofficial closer viewpoint.',
      },
    ],
    completion:
      'You have followed the authorized gallery process and attended the permitted viewing, with any postponement recorded honestly.',
    tip: 'Keep witnessing the launch distinct from completing a booking: a confirmed visit can still end with a scrubbed or delayed mission.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['indian-space-research-organisation-a2e8ddb1d3'],
        purpose:
          'Follow ISRO’s official visitor route to check launch-gallery registration and entry requirements before arranging travel.',
      },
    ],
  },
  'observe-a-forest-canopy-from-a-public-treetop-walkway': {
    title: 'Observe a forest canopy from a public treetop walkway: a practical starting plan',
    summary:
      'Compare leaves, branches and movement at canopy height on a purpose-built public walkway.',
    time: 'An hour around the walkway, with additional time for the garden.',
    cost: 'Garden admission and transport are the main costs; check current inclusions.',
    place: 'Kew Gardens’ Treetop Walkway in London, or another authorized public canopy walkway.',
    preparation:
      'Check the walkway’s current opening, weather restrictions and access arrangements. Do not assume the lift is operating; choose a ground-level canopy study if the route cannot meet your needs.',
    steps: [
      {
        title: 'Choose a comparison tree',
        body: 'From ground level, notice a nearby tree’s trunk, lower branches and leaf shapes. Read its label if available. Before ascending, confirm the route and follow any limits on numbers, belongings or equipment.',
      },
      {
        title: 'Observe without reaching',
        body: 'On the public platform, compare the upper branches with your ground view. Notice light, wind and the spacing between leaves. Keep objects secure, avoid leaning beyond barriers and leave wildlife and branches untouched.',
      },
      {
        title: 'Bring the two views together',
        body: 'Back on the ground, sketch one difference that the raised viewpoint revealed. Identify the tree only as confidently as the label allows. Add a question about how the canopy affects the space beneath it.',
      },
    ],
    completion:
      'You have compared ground and canopy observations and documented one feature that changes with viewpoint.',
    tip: 'A walkway closure is a useful reason to slow down beneath the trees rather than improvise a route into the canopy.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['royal-botanic-gardens-kew-c940efdf52'],
        purpose:
          'Check the walkway’s visitor information for weather restrictions and access arrangements before planning a canopy-height observation.',
      },
    ],
  },
  'inspect-an-original-record-in-an-archive-reading-room': {
    title: 'Inspect an original record in an archive reading room: a practical starting plan',
    summary:
      'Study a specific original record in a supervised archive reading room and keep enough reference detail to find it again.',
    time: 'Preparation before the visit and a half-day reading-room appointment.',
    cost: 'Reading-room access may be free; copying, travel and accommodation can add costs.',
    place: 'An archive holding your chosen document; The National Archives at Kew is one example.',
    preparation:
      'Identify a catalog reference and read the archive’s reader-registration, booking and handling requirements. Confirm the original can be consulted; some records are closed, unavailable or supplied as copies.',
    steps: [
      {
        title: 'Order a narrow question',
        body: 'Choose one record that can answer a manageable question about a place, person or event. Save its full reference and access conditions. Complete the required reader process and order or reserve it using the archive’s system.',
      },
      {
        title: 'Handle the record correctly',
        body: 'Follow staff instructions about bags, writing materials, supports and photography. Keep the document in its original order and ask before unfolding or moving anything awkward. Read enough surrounding context to understand what the page represents.',
      },
      {
        title: 'Preserve the reference',
        body: 'Write a short finding with the catalog reference and relevant page or image number. Separate transcription from interpretation and mark illegible words. Return material as instructed and note which follow-up document would resolve your remaining question.',
      },
    ],
    completion:
      'You have consulted an authorized original record and saved a finding with a traceable archive reference.',
    tip: 'Check whether a digitized copy answers your question first; the original visit is most useful when its physical or contextual details matter.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-national-archives-65a6a54b32'],
        purpose:
          'Read the reading-room requirements before registering, requesting your chosen original and arranging the visit.',
      },
    ],
  },
  'follow-cotton-through-a-handloom-village-with-a-weaver': {
    title: 'Follow cotton through a handloom village with a weaver: a practical starting plan',
    summary:
      'Follow the transformation of yarn into patterned ikat cloth through a visit arranged with a working weaver.',
    time: 'An agreed workshop visit, usually part of a half-day village outing.',
    cost: 'Budget for the practitioner’s time, transport and any optional textile purchase.',
    place: 'Pochampally in Telangana, with a consenting local weaver or workshop host.',
    preparation:
      'Arrange a visit through a reliable local contact and agree payment, duration and photography rules. Ask whether cotton work can be demonstrated; production stages vary between workshops and days.',
    steps: [
      {
        title: 'Agree on what is possible',
        body: 'Tell the host you want to understand the process rather than interrupt production. Ask which stages are available to see and whether an interpreter would help. Avoid assuming a loom demonstration or hands-on lesson is included.',
      },
      {
        title: 'Follow one pattern decision',
        body: 'Ask how the yarn’s planned pattern relates to tying, dyeing and weaving. Observe a stage the host chooses and keep clear of moving equipment. Request permission before photographing tools, people or unfinished designs.',
      },
      {
        title: 'Read the finished cloth',
        body: 'With the host, compare a sample’s pattern with the process you observed. Note one detail you would otherwise have missed. Pay the agreed fee regardless of shopping and purchase directly only if you want and can afford an item.',
      },
    ],
    completion: 'You can connect one feature of an ikat textile to a stage explained by its maker.',
    tip: 'A paid explanation without a purchase can still be a fair exchange when that arrangement is agreed in advance.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['ministry-of-tourism-india-436d2c5182'],
        purpose:
          'Read the ikat craft context before arranging a paid weaver visit; demonstration stages need separate agreement.',
      },
    ],
  },
  'visit-majuli-s-mask-making-tradition-with-a-local-practitioner': {
    title:
      "Visit Majuli's mask-making tradition with a local practitioner: a practical starting plan",
    summary:
      'Meet Majuli’s mask-making tradition through a practitioner-led visit that respects its performance and religious context.',
    time: 'An arranged visit within a longer Majuli stay.',
    cost: 'Allow for ferries, local transport and an agreed practitioner or guiding fee.',
    place: 'A consenting mask-making practitioner or participating satra on Majuli, Assam.',
    preparation:
      'Ask a local host which practitioner currently welcomes visitors and arrange a time. Check ferry operations and weather; a cultural description is not a promise of drop-in access or a workshop.',
    steps: [
      {
        title: 'Make a respectful appointment',
        body: 'Explain your interest in the masks and agree the visit’s scope and payment. Ask about dress, footwear and photography before entering. Leave space for the host’s other responsibilities rather than treating a working tradition as a scheduled show.',
      },
      {
        title: 'Look beyond the finished face',
        body: 'Let the practitioner choose what to demonstrate or explain. Ask how materials, movement and character relate to performance. Handle a mask only when invited and do not wear or stage sacred or performance objects for photographs.',
      },
      {
        title: 'Keep the maker’s explanation',
        body: 'Record the maker’s name with permission and one relationship between mask construction and use. If buying, ask about care and transport. Share photographs only within the consent given and credit the practitioner accurately.',
      },
    ],
    completion:
      'You have learned one maker-explained connection between a mask’s construction and its cultural use.',
    tip: 'An ordinary working conversation can be more informative than asking for a performance that the host has not offered.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['assam-tourism-a0c2f31348'],
        purpose:
          'Use the Majuli cultural context to prepare respectful questions; arrange practitioner access separately rather than assuming drop-in visits.',
      },
    ],
  },
  'read-prehistoric-rock-art-at-bhimbetka-with-a-guide': {
    title: 'Read prehistoric rock art at Bhimbetka with a guide: a practical starting plan',
    summary:
      'Study a small selection of Bhimbetka’s painted shelters with a guide who can distinguish interpretation from surviving evidence.',
    time: 'A half-day visit with breaks for heat and uneven paths.',
    cost: 'Entry, local transport and an optional authorized guide create a modest outing cost.',
    place: 'The publicly open rock-shelter route at Bhimbetka, Madhya Pradesh.',
    preparation:
      'Check current entry, guide arrangements and the walking surface. Bring sun protection and water; remain on designated paths and follow all restrictions protecting paintings and shelters.',
    steps: [
      {
        title: 'Choose a focused route',
        body: 'Ask a guide or interpretation staff to select a few accessible shelters rather than rushing through every stop. Establish where photographs are permitted. Start by identifying the actual painted surface and viewing it from the marked public area.',
      },
      {
        title: 'Separate seeing from interpreting',
        body: 'Describe shapes, colors and overlapping figures before asking what they might mean. Notice where the guide is confident and where uncertainty remains. Never wet, touch, trace or enhance a painting to make it easier to see.',
      },
      {
        title: 'Compare two shelters',
        body: 'Record one visible difference between two paintings or settings and the explanation offered for it. Keep broad dating or cultural claims tied to the official interpretation. Leave with a question rather than inventing a single story for every image.',
      },
    ],
    completion:
      'You have documented two protected examples and can distinguish your observations from the guide’s interpretation.',
    tip: 'A camera can flatten faint markings; time spent looking from the permitted viewpoint may reveal more than heavy digital enhancement.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['madhya-pradesh-tourism-ee6175a7f9'],
        purpose:
          'Read the rock-shelter context before choosing a guided route and separating visible marks from their interpretation.',
      },
    ],
  },
  'follow-the-narrative-reliefs-around-sanchi-s-gateways': {
    title: "Follow the narrative reliefs around Sanchi's gateways: a practical starting plan",
    summary:
      'Read one gateway at Sanchi slowly, using its reliefs to explore how stories are arranged in stone.',
    time: 'Two to three hours for a gateway study and site context.',
    cost: 'Budget for current admission, transport and an optional authorized guide.',
    place: 'The public visitor area around Sanchi’s stupas and gateways in Madhya Pradesh.',
    preparation:
      'Check current access and choose an official guidebook or authorized guide. Plan for outdoor conditions and uneven surfaces; do not climb or touch reliefs to examine a detail.',
    steps: [
      {
        title: 'Choose one gateway',
        body: 'Orient yourself using the site map and select a gateway with a comfortable public viewpoint. Ask which panels can be clearly interpreted from there. Read the overall arrangement before concentrating on a single animal, figure or scene.',
      },
      {
        title: 'Follow a narrative clue',
        body: 'Use the guide or official interpretation to connect two elements within a panel. Notice how repeated figures, symbols or placement help the story. Distinguish an identified narrative from a personal guess based on appearance alone.',
      },
      {
        title: 'Describe the composition',
        body: 'Sketch a simple panel layout without copying every carving. Label the story only when supported by the interpretation. Add one observation about the relationship between the gateway, the route around the stupa and the visitor’s changing viewpoint.',
      },
    ],
    completion:
      'You can explain one interpreted relief and show where it sits within a gateway’s composition.',
    tip: 'A single well-understood panel can make a richer visit than a long list of photographed monuments without context.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['madhya-pradesh-tourism-0d4aaed75f'],
        purpose:
          'Use the Sanchi brochure to orient your gateway study and ground panel interpretations in the site’s published context.',
      },
    ],
  },
  'explore-mangroves-from-sungei-buloh-s-public-boardwalks': {
    title: "Explore mangroves from Sungei Buloh's public boardwalks: a practical starting plan",
    summary:
      'Explore mangrove habitat from public paths while watching how tide and roots shape the wetland.',
    time: 'A short boardwalk circuit with generous stops and a heat break.',
    cost: 'Public park access is generally low cost; transport and supplies are extra.',
    place: 'Sungei Buloh Wetland Reserve in Singapore, on currently open public routes.',
    preparation:
      'Check the reserve’s current opening, weather and trail notices. Choose a route matching your movement needs, carry water and plan to finish before closing rather than relying on an unverified shortcut.',
    steps: [
      {
        title: 'Read the route and tide',
        body: 'At the visitor information point, identify the open mangrove path and any tide-related restrictions. Note the return route and nearest facilities. Choose a manageable circuit instead of trying to cover the entire reserve in hot conditions.',
      },
      {
        title: 'Look from the boardwalk',
        body: 'Pause where you can safely leave room for other visitors. Compare root shapes and the changing waterline without leaving the path. Keep distance from wildlife, avoid feeding and follow staff advice if an animal occupies the route.',
      },
      {
        title: 'Record a habitat connection',
        body: 'Write down one relationship you observed between roots, exposed mud and water. Use a labeled display to check unfamiliar terms. Remove all belongings and finish with a quiet return rather than pursuing wildlife for a closer photograph.',
      },
    ],
    completion:
      'You have completed an open public route and recorded one observed relationship between the mangroves and tidal water.',
    tip: 'A tide or storm closure is part of visiting a working wetland; return another day instead of testing a flooded or closed path.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['national-parks-board-singapore-19a361353a'],
        purpose:
          'Check the reserve’s public-route information and notices before choosing a manageable mangrove-boardwalk circuit.',
      },
    ],
  },
  'learn-how-a-dutch-storm-surge-barrier-works': {
    title: 'Learn how a Dutch storm-surge barrier works: a practical starting plan',
    summary:
      'Use a visitor tour to understand how the Eastern Scheldt barrier balances flood protection with an open estuary.',
    time: 'A scheduled tour and enough time for the related visitor exhibits.',
    cost: 'Visitor admission, any tour charge and transport make this a moderate outing.',
    place:
      'Deltapark Neeltje Jans and authorized visitor areas of the Eastern Scheldt barrier, Netherlands.',
    preparation:
      'Check which current ticket or tour includes barrier interpretation, its language and access requirements. Read the route carefully: public tours do not necessarily include interior machinery or control rooms.',
    steps: [
      {
        title: 'Start with the landscape',
        body: 'Use a map or exhibit to locate the estuary and the barrier’s role. Ask what remains open during ordinary conditions and what changes during a storm. Keep sea conditions separate from the safe public visitor route.',
      },
      {
        title: 'Follow the authorized explanation',
        body: 'Join the booked tour or interpretive route and ask how closing the barrier affects water movement. Observe the visible structure from permitted areas. Treat security boundaries and weather changes as firm limits on the visit.',
      },
      {
        title: 'Explain a tradeoff',
        body: 'Draw a simple before-and-after water-flow diagram using the guide’s explanation. Add one question about ecology, maintenance or decision-making during high water. Check any technical figures against current interpretation rather than recalling them approximately.',
      },
    ],
    completion:
      'You can explain the barrier’s basic operating purpose and one environmental or maintenance tradeoff discussed during the visit.',
    tip: 'Confirm whether your chosen experience is an exterior tour; the engineering story does not require access to restricted operational spaces.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['deltapark-neeltje-jans-7702b54a1a'],
        purpose:
          'Review the visitor-tour route before confirming which barrier interpretation, language and permitted areas your booking includes.',
      },
    ],
  },
  'explore-reconstructed-yayoi-life-at-yoshinogari': {
    title: 'Explore reconstructed Yayoi life at Yoshinogari: a practical starting plan',
    summary:
      'Walk through reconstructed spaces at Yoshinogari and ask how archaeological evidence becomes a full-sized interpretation.',
    time: 'A half day focused on two reconstruction zones and rest stops.',
    cost: 'Park admission and transport are the principal costs; workshops may be separate.',
    place: 'Yoshinogari Historical Park in Saga Prefecture, Japan.',
    preparation:
      'Check current park access, weather notices and the map. Choose a short route between selected zones; entry to particular buildings or towers may have additional movement constraints.',
    steps: [
      {
        title: 'Choose two contrasting spaces',
        body: 'Use the park information to select a residential area and a storage or trading area. Read which features are inferred from excavations. Begin with the ground plan before assuming that every reconstructed detail is directly preserved evidence.',
      },
      {
        title: 'Compare purpose and structure',
        body: 'At the permitted viewpoints, notice floor height, openings, enclosure and distance between buildings. Ask how the interpretation connects these features with daily activity or social organization. Follow building entry rules and avoid climbing outside visitor routes.',
      },
      {
        title: 'Mark evidence and inference',
        body: 'Sketch one structure and label a feature supported by the interpretation and a question about reconstruction. Compare it with your second zone. Keep the park’s cautious language about past use instead of turning a plausible interpretation into certainty.',
      },
    ],
    completion:
      'You have compared two reconstructed settings and recorded how the park explains evidence and uncertainty.',
    tip: 'A reconstruction is a useful argument about the past; asking why a wall or floor was placed there makes the visit more revealing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['yoshinogari-historical-park-8df69162a5'],
        purpose:
          'Use the enclosure interpretation to compare reconstructed spaces and ask which details rest on archaeological evidence.',
      },
    ],
  },
};
