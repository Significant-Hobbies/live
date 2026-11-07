import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const CONTRIBUTION_GUIDES: Record<string, CuratedExperienceGuide> = {
  'help-host-a-neighborhood-repair-cafe-session': {
    title: 'Help host a neighborhood Repair Cafe session: a practical starting plan',
    summary:
      'Support a repair event through reception, organizing and a useful handover, even if you are not a repair expert.',
    time: 'A scheduled event shift plus a short organizer briefing.',
    cost: 'Usually no participation charge; allow for local travel.',
    place: 'An established local Repair Cafe with an agreed volunteer role.',
    preparation:
      'Contact the organizer before arriving. Ask which nontechnical roles are needed and confirm the shift length, access arrangements and named contact.',
    steps: [
      {
        title: 'Choose a useful role',
        body: 'Offer to welcome visitors, manage the queue or help record items. Explain what you can reliably do and let the organizer match you to a genuine need for that session.',
      },
      {
        title: 'Follow the event system',
        body: 'Learn how visitors register and how repairers accept jobs. Keep belongings identifiable and routes clear. Refer technical questions to the repair volunteers instead of promising a fix or delivery time.',
      },
      {
        title: 'Close the shift properly',
        body: 'Help return the workspace to its agreed condition. Pass unresolved visitor questions to the organizer and record any supplies that ran low. Ask whether another booked shift would be useful.',
      },
    ],
    completion:
      'You have completed an agreed host shift and handed over any outstanding tasks to the organizer.',
    tip: 'A calm welcome and an accurate queue can be as valuable to the event as another set of tools.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['repair-cafe-foundation-0cedf9b42b'],
        purpose:
          'Use the Repair Café volunteer route to discuss reception or organizing tasks with a local event coordinator.',
      },
    ],
  },
  'trace-buildings-for-a-humanitarian-mapping-task': {
    title: 'Trace buildings for a humanitarian mapping task: a practical starting plan',
    summary:
      'Add careful building outlines to a humanitarian mapping project, working within its instructions and review process.',
    time: 'An introductory hour, followed by one small mapping task.',
    cost: 'Free with a suitable computer and internet connection.',
    place: 'At home or at an organized beginner mapathon.',
    preparation:
      'Read the project brief and complete its required training. Choose a task explicitly marked suitable for beginners rather than an urgent advanced task.',
    steps: [
      {
        title: 'Practise before editing',
        body: 'Use the recommended training environment to learn basic building shapes and image alignment. Compare examples of acceptable mapping with common errors before changing the shared map used by other people.',
      },
      {
        title: 'Map a small area',
        body: 'Take one task square and follow its local instructions. Trace only what the imagery supports. Leave uncertain features for experienced mappers and avoid inventing road names or building uses.',
      },
      {
        title: 'Submit for validation',
        body: 'Inspect your outlines for overlaps and accidental edits. Save with the requested changeset information and mark the task according to its actual state. Read validator feedback before attempting another square.',
      },
    ],
    completion:
      'One beginner task is submitted accurately for the project’s review, with uncertainty left visible.',
    tip: 'A carefully mapped small area is more useful than a large square rushed to appear complete.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['humanitarian-openstreetmap-team-42b741216a'],
        purpose:
          'Understand the Missing Maps contribution route before choosing a beginner task and following its mapping instructions.',
      },
    ],
  },
  'transcribe-a-historical-manuscript-for-the-smithsonian': {
    title: 'Transcribe a historical manuscript for the Smithsonian: a practical starting plan',
    summary:
      'Make one historical page searchable while learning how collaborative transcription handles handwriting, uncertainty and review.',
    time: 'Allow an hour for instructions and a manageable page.',
    cost: 'Free with internet access and a readable screen.',
    place: 'A quiet workspace where the scanned page is easy to enlarge.',
    preparation:
      'Choose a project whose handwriting and language you can read. Check its specific instructions, including how to mark uncertain words and page layout.',
    steps: [
      {
        title: 'Read around the page',
        body: 'Look at neighboring pages to understand names, dates and recurring letter shapes. Start with a relatively clear passage. Keep the scanned original visible rather than working from memory or assumptions.',
      },
      {
        title: 'Transcribe what is present',
        body: 'Follow the project’s conventions and preserve the original wording. Use its uncertainty notation when needed. Do not silently modernize spelling or fill gaps with facts you found elsewhere.',
      },
      {
        title: 'Check and hand over',
        body: 'Read your text against the image once more, watching for missed lines and repeated words. Save it in the appropriate state so another volunteer can review or finish the page.',
      },
    ],
    completion:
      'A scanned page has a saved transcription or a clearly marked partial contribution ready for review.',
    tip: 'Difficult handwriting often becomes clearer after a break; uncertainty is useful information, not a failure to contribute.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['smithsonian-institution-3a29292dd1'],
        purpose:
          'Consult the transcription FAQs before working on handwriting and marking uncertainty according to the project’s conventions.',
      },
    ],
  },
  'record-a-public-domain-audiobook-chapter': {
    title: 'Record a public-domain audiobook chapter: a practical starting plan',
    summary:
      'Contribute a clear recorded chapter to a collaborative audiobook, using the project’s copyright and audio standards.',
    time: 'Several recording and editing sessions across a weekend.',
    cost: 'Existing computer and microphone may suffice; specialist equipment is optional.',
    place: 'A quiet room with a consistent microphone position.',
    preparation:
      'Read the volunteer guide and copyright requirements for your country. Join a collaborative project and confirm its available chapters before recording a whole one.',
    steps: [
      {
        title: 'Test your recording setup',
        body: 'Make the project’s suggested short test recording. Listen for hum, clipping and room echo with headphones. Ask for technical feedback early, while changing your setup is still easy.',
      },
      {
        title: 'Record a claimed chapter',
        body: 'Follow the coordinator’s text, opening information and audio specifications. Read in manageable sections and mark mistakes for editing. Your natural accent is welcome; clarity and accurate words matter most.',
      },
      {
        title: 'Submit and respond',
        body: 'Listen through the edited file while following the text. Upload it by the agreed process and keep a local copy. Correct issues identified by the prooflistener before considering the chapter finished.',
      },
    ],
    completion:
      'Your chapter has been submitted to its coordinator and any requested corrections have been addressed.',
    tip: 'Choose a short chapter you enjoy reading aloud before committing to an entire book or buying a new microphone.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['librivox-9d7c4422c6'],
        purpose:
          'Read the LibriVox volunteer introduction before choosing a chapter and confirming its recording and review process.',
      },
    ],
  },
  'document-access-details-for-public-places-on-wheelmap': {
    title: 'Document access details for public places on Wheelmap: a practical starting plan',
    summary:
      'Improve public access information by checking a small number of places against Wheelmap’s published criteria.',
    time: 'A short preparation session and a local outing.',
    cost: 'Free apart from ordinary local travel costs.',
    place: 'Publicly accessible venues you can visit with permission where needed.',
    preparation:
      'Read the definitions for the accessibility categories. Choose two or three nearby places and check whether they already have current information.',
    steps: [
      {
        title: 'Learn the exact criteria',
        body: 'Compare the platform’s categories before making judgments. Separate an entrance observation from assumptions about toilets or other facilities. Plan to leave information unknown whenever you cannot verify it directly.',
      },
      {
        title: 'Check places respectfully',
        body: 'Use public access routes and ask staff about unclear features. Note steps, entrances and other requested details without photographing visitors. Avoid blocking a doorway while you take notes or measurements.',
      },
      {
        title: 'Publish verified details',
        body: 'Update only the fields your visit supports. Add useful factual notes where available, then review the resulting listing. If something changes later, correct the map rather than treating the first visit as permanent.',
      },
    ],
    completion:
      'Several venue records contain checked access information or clearly explained remaining uncertainty.',
    tip: 'Access differs between people; specific observations are more useful than calling an entire venue suitable for everyone.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['sozialhelden-0d83ca09ad'],
        purpose:
          'Use Wheelmap’s category guidance to separate verified access observations from facilities you have not checked.',
      },
    ],
  },
  'translate-a-free-software-resource-into-a-language-you-know': {
    title: 'Translate a free-software resource into a language you know: a practical starting plan',
    summary:
      'Translate a requested piece of free-software material with a team, preserving its technical meaning and shared terminology.',
    time: 'One focused session plus time for editorial feedback.',
    cost: 'Free using the project’s supported contribution tools.',
    place: 'A computer workspace with the source and translation visible together.',
    preparation:
      'Choose a language pair you know well. Ask the translation team for a small current task and its glossary, style guide and submission method.',
    steps: [
      {
        title: 'Understand the intended reader',
        body: 'Read the surrounding document before translating a paragraph. Identify technical terms and check the team’s existing usage. Clarify ambiguous source wording rather than creating a confident translation of an uncertain instruction.',
      },
      {
        title: 'Draft a small section',
        body: 'Keep commands, links and other functional elements intact. Write natural sentences for the target audience and retain the source meaning. Mark terminology questions for the reviewer instead of silently inventing new terms.',
      },
      {
        title: 'Revise through review',
        body: 'Submit through the team’s normal process and respond to corrections. Preview the translated page if possible, checking broken links and missing text. Record glossary decisions so the next contributor can remain consistent.',
      },
    ],
    completion:
      'One requested section has been submitted and revised through the translation team’s review process.',
    tip: 'A short accurate translation in a less well served language can be a substantial contribution.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['free-software-foundation-europe-b6c14f3665'],
        purpose:
          'Use the open translation team’s actual workflow, terminology resources and review route for a small contribution.',
      },
    ],
  },
  'contribute-speech-recordings-to-common-voice': {
    title: 'Contribute speech recordings to Common Voice: a practical starting plan',
    summary:
      'Add speech examples or careful validations to an open language dataset after making an informed sharing choice.',
    time: 'A brief onboarding period and a short recording session.',
    cost: 'Free with an existing microphone and internet connection.',
    place: 'A quiet room without other people’s conversations in the background.',
    preparation:
      'Read the dataset’s consent and reuse terms. Choose a language you can speak or evaluate confidently and test the recording controls before contributing.',
    steps: [
      {
        title: 'Choose how to help',
        body: 'Select recording or validation according to your confidence and available equipment. Read the current contribution rules. Check how your clips and optional profile information will be shared before accepting participation terms.',
      },
      {
        title: 'Make clean recordings',
        body: 'Read the displayed prompts naturally without adding personal information. Replay a few clips to check intelligibility and background noise. Skip unsuitable prompts rather than changing their words to make them easier.',
      },
      {
        title: 'Validate with care',
        body: 'When reviewing clips, apply the published rules consistently. Accept natural accents within the guidance and reject recording problems for the stated reason. Finish a small attentive batch instead of continuing once listening becomes tiring.',
      },
    ],
    completion:
      'A small set of recordings or validations has been submitted under the project’s current contribution rules.',
    tip: 'A quiet room matters more than an expensive microphone, and careful validation helps even when recording is inconvenient.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['mozilla-data-collective-8dc858f8aa'],
        purpose:
          'Review the language-contribution route and sharing terms before choosing speech recording or validation.',
      },
    ],
  },
  'support-a-computer-learning-session-through-a-community-program': {
    title:
      'Support a computer-learning session through a community program: a practical starting plan',
    summary:
      'Help someone practise a computer task they chose through a program that provides boundaries and support.',
    time: 'An orientation followed by a booked learning session.',
    cost: 'Usually free; local travel may be the main expense.',
    place: 'A supervised library, community centre or digital-inclusion program.',
    preparation:
      'Ask a program coordinator about training, safeguarding and learner support. Confirm the task, accessible equipment and who handles problems beyond your role.',
    steps: [
      {
        title: 'Let the learner choose',
        body: 'Ask what they want to accomplish and what they already know. Agree one manageable outcome, such as attaching a document or changing text size. Let them operate the controls whenever possible.',
      },
      {
        title: 'Work at their pace',
        body: 'Explain one action at a time and leave room to repeat it. Keep passwords, account recovery and private information under the learner’s control. Refer financial, security or account disputes to the program lead.',
      },
      {
        title: 'Leave a usable reminder',
        body: 'Invite the learner to repeat the task independently. With their agreement, write a short reminder in language that makes sense to them. Report equipment or accessibility problems through the program’s normal handover.',
      },
    ],
    completion: 'The learner has practised their chosen task and has a useful way to try it again.',
    tip: 'Ask before taking the mouse; doing the task for someone can hide which step still needs explaining.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['computercorps-78f2d59dc6'],
        purpose:
          'A Carson City, Nevada program advertising trainer and software-training roles; use its application route or confirm an equivalent supervised local program.',
      },
    ],
  },
  'install-a-locally-appropriate-wildlife-shelter-with-expert-advice': {
    title:
      'Install a locally appropriate wildlife shelter with expert advice: a practical starting plan',
    summary:
      'Provide one appropriate wildlife shelter with a realistic plan for placement, checks and later maintenance.',
    time: 'A planning conversation, a making session and seasonal checks.',
    cost: 'Materials or a suitable ready-made shelter create a modest cost.',
    place: 'An approved garden or community site with permission to install it.',
    preparation:
      'Ask a local conservation group which species and shelter design suit the location. Check installation and maintenance arrangements before buying or building anything.',
    steps: [
      {
        title: 'Match shelter to habitat',
        body: 'Discuss the target species, local climate and existing cover with an experienced adviser. Use a suitable published design. Avoid a decorative shelter whose materials or dimensions do not meet the animal’s needs.',
      },
      {
        title: 'Arrange safe installation',
        body: 'Prepare the shelter at ground level and let a competent person handle any height work. Follow the adviser’s placement guidance and site permissions. Keep entrances away from predictable disturbance and other hazards.',
      },
      {
        title: 'Maintain without disturbance',
        body: 'Keep an installation record and a maintenance reminder based on local advice. Observe from a distance during sensitive periods. Clean or inspect only when the species guidance permits, and remove unsafe fittings promptly.',
      },
    ],
    completion:
      'A suitable shelter is installed with permission and a named person knows how it will be maintained.',
    tip: 'Wildlife may never use the shelter; good placement and responsible maintenance are the part you can complete.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['royal-society-for-the-protection-of--a488b72029'],
        purpose:
          'Use the birdbox guidance as a discussion aid when a local adviser recommends a bird shelter.',
      },
    ],
  },
  'submit-a-month-of-rain-gauge-observations-to-a-science-network': {
    title:
      'Submit a month of rain-gauge observations to a science network: a practical starting plan',
    summary:
      'Make a useful precipitation record by following one network’s equipment, siting and reporting conventions consistently.',
    time: 'Brief daily readings for a month after initial training.',
    cost: 'An approved gauge and mounting materials may need purchasing.',
    place: 'A permitted outdoor site accepted by the network’s coordinator.',
    preparation:
      'Confirm that a suitable network covers your region. Review its approved instruments and training before buying a gauge; general garden gauges may not qualify.',
    steps: [
      {
        title: 'Agree a reporting station',
        body: 'Complete the network registration and discuss siting with its coordinator. Choose a position that can be reached safely each day. Record the gauge type and any limitations the coordinator wants documented.',
      },
      {
        title: 'Practise the reading method',
        body: 'Work through the official training before submitting observations. Learn how to report no precipitation, missed readings and accumulated totals. Choose a consistent observation time and arrange a clear plan for days away.',
      },
      {
        title: 'Keep an honest month',
        body: 'Read and report according to the protocol, checking units before submission. Mark gaps instead of inventing estimates. Review your monthly record for accidental duplicates or implausible entries and correct confirmed mistakes.',
      },
    ],
    completion:
      'A month of observations, including honestly marked gaps, has been submitted using the network’s protocol.',
    tip: 'Consistency helps the record; an accurately reported dry day can be just as useful as a dramatic storm.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['cocorahs-3fb14d3031'],
        purpose:
          'Check CoCoRaHS participation and training information before choosing an approved gauge and planning daily observations.',
      },
    ],
  },
  'submit-a-complete-bird-checklist-to-ebird': {
    title: 'Submit a complete bird checklist to eBird: a practical starting plan',
    summary:
      'Turn one birdwatching outing into a useful checklist by documenting effort, location and every bird you identify.',
    time: 'An introductory read and a short stationary or traveling count.',
    cost: 'Free; binoculars are helpful if you already have them.',
    place: 'A legal observation point or simple route near home.',
    preparation:
      'Read eBird’s checklist basics and choose a route you can describe accurately. Start where identification feels manageable rather than chasing a rare species.',
    steps: [
      {
        title: 'Set the observation boundaries',
        body: 'Choose a stationary count or a short traveling route and note the start time. Keep the observation area manageable so distance and duration describe what you actually did rather than a wider day out.',
      },
      {
        title: 'Record identifiable birds',
        body: 'Count carefully and include common species as well as interesting ones. Make notes about uncertain sightings without forcing an identification. Avoid playback or approaching nests to improve a checklist or photograph.',
      },
      {
        title: 'Check the effort details',
        body: 'Review place, duration, distance and counts before submitting. Answer the complete-checklist question according to its definition: include all birds you identified. Respond with evidence if a reviewer queries an unusual record.',
      },
    ],
    completion:
      'One checklist has accurate effort details and includes the birds you could identify during that session.',
    tip: 'A familiar local patch is a good first site; reliable common-species records also contribute useful information.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['cornell-lab-of-ornithology-dd35109fb6'],
        purpose:
          'Read the eBird introduction before recording outing effort and deciding whether your checklist meets its completeness definition.',
      },
    ],
  },
  'document-a-wild-species-for-inaturalist': {
    title: 'Document a wild species for iNaturalist: a practical starting plan',
    summary:
      'Document one encounter with a wild organism so other observers can help identify and interpret it.',
    time: 'A short outing plus time to upload and review the observation.',
    cost: 'Free with a camera or phone you already own.',
    place: 'A public path, garden or other place you may visit legally.',
    preparation:
      'Read the observation guide and location-privacy options. Choose a wild plant or animal that can be documented clearly without handling or disturbing it.',
    steps: [
      {
        title: 'Collect useful evidence',
        body: 'Take a clear overall image and relevant details from where you can safely stand. Record the observation’s time and place. For plants, include leaves and flowers when present without picking parts.',
      },
      {
        title: 'Upload what you know',
        body: 'Create a separate record for the encounter and attach its evidence. Choose a broad identification if that is all you know. Mark captive or cultivated organisms correctly and check the map location before sharing.',
      },
      {
        title: 'Learn from identifications',
        body: 'Return to the observation and read explanations from other contributors. Compare suggestions with your evidence before agreeing. Correct missing details and retain uncertainty where the photographs cannot establish a more precise identification.',
      },
    ],
    completion:
      'A documented observation has been uploaded with accurate context and an appropriately cautious identification.',
    tip: 'Avoid posting the exact location of a sensitive species or a private home merely to make the map more precise.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['inaturalist-eadd812ca8'],
        purpose:
          'Use the observation instructions to prepare clear evidence and location details for a wild-organism record.',
      },
    ],
  },
  'record-frog-calls-for-frogid-in-australia': {
    title: 'Record frog calls for FrogID in Australia: a practical starting plan',
    summary:
      'Record a frog chorus in Australia and submit the sound with the context needed by the FrogID team.',
    time: 'A brief app familiarization and one quiet listening outing.',
    cost: 'Free with a compatible phone and local travel.',
    place: 'A lawful listening point in Australia, safely away from water edges.',
    preparation:
      'Review FrogID’s recording guidance and location handling. Choose a familiar public route or your own property; never enter water or closed habitat to approach calls.',
    steps: [
      {
        title: 'Prepare before dusk',
        body: 'Check that the app works and that you understand its recording and upload controls. Carry enough light for returning safely. Tell a companion the route if you will be out after dark.',
      },
      {
        title: 'Listen without interference',
        body: 'Stop where calls are already audible and keep the phone steady. Avoid talking during the recording or playing calls to attract frogs. Leave animals, eggs and vegetation undisturbed throughout the visit.',
      },
      {
        title: 'Submit and revisit',
        body: 'Review the sound and location information before uploading through the app. Add relevant notes requested by the project. Check back for expert identification and keep the confirmation with your observation record.',
      },
    ],
    completion:
      'A usable frog-call recording from Australia has been submitted to the project for expert identification.',
    tip: 'Good sound from a safe path is preferable to a closer recording that disturbs wildlife or takes you into a wetland.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['australian-museum-frogid-5ad2bc8dcc'],
        purpose:
          'Consult FrogID’s participation FAQs before making and submitting an Australian frog-call recording.',
      },
    ],
  },
  'take-part-in-a-seasonal-butterfly-count': {
    title: 'Take part in a seasonal butterfly count: a practical starting plan',
    summary:
      'Contribute a timed butterfly observation to a count that operates in your region and season.',
    time: 'The published count interval plus a little identification preparation.',
    cost: 'Free; use the count’s downloadable identification materials.',
    place: 'A garden, park or other permitted site within the project’s region.',
    preparation:
      'Find the next active count and read its exact rules. The UK Big Butterfly Count is seasonal; use a suitable regional scheme elsewhere.',
    steps: [
      {
        title: 'Learn the target species',
        body: 'Look through the project’s chart before starting the timer. Choose weather and a site consistent with its instructions. Separate a formal timed count from any casual sightings made while traveling there.',
      },
      {
        title: 'Count using one method',
        body: 'Follow the project’s stationary or walking rules without combining them. Record only supported identifications and avoid counting the same individual repeatedly. If nothing appears, preserve that result when the scheme accepts it.',
      },
      {
        title: 'Submit the complete session',
        body: 'Check the date, location and observation interval, then enter your counts through the official form. Retain a simple note of conditions so you can understand what happened if you revisit the site.',
      },
    ],
    completion:
      'A correctly timed count has been submitted during an eligible reporting period using the scheme’s rules.',
    tip: 'A count with few butterflies is still an observation; do not extend the timer merely to make the result more exciting.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['butterfly-conservation-9b1a978357'],
        purpose:
          'Use this past UK count as context, then find the current seasonal rules before taking part.',
      },
    ],
  },
  'match-cloud-observations-to-satellite-science': {
    title: 'Match cloud observations to satellite science: a practical starting plan',
    summary:
      'Make a ground observation of clouds that can be compared with what satellites see above your location.',
    time: 'A short training read and one observation window.',
    cost: 'Free with a supported phone and an internet connection.',
    place: 'An open legal viewpoint where the sky is visible safely.',
    preparation:
      'Read the Clouds tool guidance and test its prompts. Choose a location without traffic or unsafe edges, and check the current satellite-overpass information.',
    steps: [
      {
        title: 'Understand the requested fields',
        body: 'Learn the difference between cloud cover, cloud type and surface conditions. Use the project’s identification aids rather than guessing labels. Note which observations are required and which are optional extras.',
      },
      {
        title: 'Observe at the planned time',
        body: 'Use the app to guide your ground observation, checking the location and time. Photograph the requested sky directions from a safe position. Never look directly at the Sun to judge the cloud cover.',
      },
      {
        title: 'Review the submitted record',
        body: 'Check that the observation uploaded and that your photographs match the event. Look for any available satellite-match feedback later. Treat the comparison as a learning opportunity rather than proof that either view is complete.',
      },
    ],
    completion:
      'One cloud observation is submitted with accurate context and, when available, a corresponding satellite comparison.',
    tip: 'Prepare the identification chart before the overpass window so the observation can remain short and attentive.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-globe-program-nasa-36222ebd16'],
        purpose:
          'Follow the Clouds tool guidance to record sky observations with the timing and photographs needed for comparison.',
      },
    ],
  },
  'help-classify-research-images-with-stall-catchers': {
    title: 'Help classify research images with Stall Catchers: a practical starting plan',
    summary:
      'Contribute careful image judgments to a research project after learning exactly what its examples ask you to identify.',
    time: 'A tutorial followed by a focused session of around half an hour.',
    cost: 'Free with an existing browser and internet access.',
    place: 'A comfortable screen where short research clips are clear.',
    preparation:
      'Read the project’s explanation of its mouse-brain research imagery. Decide whether the content suits you and use the built-in training before classifying live tasks.',
    steps: [
      {
        title: 'Learn the visual distinction',
        body: 'Work through the examples of flowing and stalled vessels. Replay the training clips and read feedback until you understand the feature being judged. Do not infer a result from an image’s overall appearance.',
      },
      {
        title: 'Classify a small batch',
        body: 'Focus on the marked region and use the available viewing controls. Follow the project’s current response options when uncertain. Take breaks before fatigue makes you click through clips without inspecting them properly.',
      },
      {
        title: 'Review feedback and stop',
        body: 'Read the score or feedback as training information rather than a target to game. Note a recurring mistake to revisit in the tutorial. End the session while you can still make attentive judgments.',
      },
    ],
    completion:
      'A trained, attentive classification session has been completed through the project’s research workflow.',
    tip: 'The project combines judgments from many people; careful participation matters more than claiming to diagnose anything from a clip.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['human-computation-institute-stall-ca-73b2d6fe32'],
        purpose:
          'Read the research context before using Stall Catchers’ training to distinguish flowing and stalled vessels.',
      },
    ],
  },
  'donate-spare-computing-time-to-a-distributed-research-project': {
    title:
      'Donate spare computing time to a distributed research project: a practical starting plan',
    summary:
      'Try one bounded distributed-computing contribution while understanding the controls, electricity cost and effect on your own machine.',
    time: 'An installation session and a deliberately limited first run.',
    cost: 'Software may be free; electricity and hardware wear are real costs.',
    place: 'Your own supported computer with adequate cooling and permission to run it.',
    preparation:
      'Read the project’s current user guide and privacy information. Check device compatibility, usage limits and power costs before deciding whether this form of contribution suits you.',
    steps: [
      {
        title: 'Set a modest limit',
        body: 'Install only from the official project source and choose conservative resource settings. Keep ventilation clear and avoid a work or shared computer without permission. Learn where to pause and stop processing first.',
      },
      {
        title: 'Run one monitored task',
        body: 'Start while you are nearby and watch how the machine behaves. Check responsiveness, fan activity and the project’s progress display. Pause if it interferes with normal use or becomes unsuitable for your setup.',
      },
      {
        title: 'Decide whether to continue',
        body: 'Confirm what work was completed and compare the experience with your intended limit. Adjust or uninstall through the documented process if needed. A single informed trial is enough to decide about ongoing participation.',
      },
    ],
    completion:
      'You have completed a bounded trial and can control or stop the client without leaving an unwanted background workload.',
    tip: 'Use the project’s own completion record; hours of fan noise alone do not establish how much research work was accepted.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['folding-home-a41a3a3a28'],
        purpose:
          'Use Folding@home’s official download route after reviewing compatibility and deciding on conservative computing-resource limits.',
      },
    ],
  },
  'proofread-a-public-domain-book-page-for-project-gutenberg': {
    title: 'Proofread a public-domain book page for Project Gutenberg: a practical starting plan',
    summary:
      'Help preserve a public-domain book by correcting one OCR page against its scanned original.',
    time: 'An introduction and a focused page-proofreading session.',
    cost: 'Free with a computer and internet connection.',
    place: 'A readable screen with room for scanned image and text.',
    preparation:
      'Read the beginner walkthrough and current proofreading guidelines. Choose an introductory project in a language you understand and check the project-specific notes.',
    steps: [
      {
        title: 'Learn the page conventions',
        body: 'Practise on the walkthrough before taking a project page. Check how the platform handles line breaks, punctuation and uncertain characters. Proofreading and final formatting are different stages, so follow your stage’s task.',
      },
      {
        title: 'Compare line by line',
        body: 'Work from the scan rather than improving the author’s prose. Correct recognition errors and omissions while preserving intentional spelling. Enlarge difficult characters and flag unresolved issues through the project’s accepted method.',
      },
      {
        title: 'Check before saving',
        body: 'Look for skipped lines, mistaken quotation marks and changes to words that were already correct. Save the page using the requested workflow. Read any later feedback to make your next contribution more accurate.',
      },
    ],
    completion: 'One page has been checked against its scan and saved for the next review stage.',
    tip: 'A plain page is an excellent first task; ornate headings and complex tables can wait until the conventions feel familiar.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['distributed-proofreaders-a5958dedc9'],
        purpose:
          'Start with Distributed Proofreaders’ newcomer route before correcting OCR text against a scanned page.',
      },
    ],
  },
  'review-basic-website-accessibility-for-a-community-organization': {
    title:
      'Review basic website accessibility for a community organization: a practical starting plan',
    summary:
      'Give a community organization a small, usable report about basic access barriers on an agreed public web page.',
    time: 'A planning conversation and one focused review session.',
    cost: 'Free with a computer, browser and the W3C learning material.',
    place: 'A remote workspace, reviewing only the public pages agreed with the organization.',
    preparation:
      'Ask whether a basic review would be useful and agree the page and recipient. Read W3C Easy Checks first; these introductory checks cannot establish comprehensive accessibility or standards conformance.',
    steps: [
      {
        title: 'Agree a small scope',
        body: 'Choose one important public page with the organization, such as its event information. Select a few checks you understand, for example page title, keyboard focus and zoom. Record your browser and starting conditions.',
      },
      {
        title: 'Capture reproducible observations',
        body: 'Follow each chosen check’s original instructions and note what happens. Save the page address and the steps needed to reproduce a barrier. Avoid private areas, security testing and speculative statements about how every disabled visitor will experience it.',
      },
      {
        title: 'Deliver an actionable note',
        body: 'Send the agreed contact a brief report separating observations from questions. Include successful checks as context and explain the limited scope. Offer to confirm a reported change without presenting the result as a full audit or certification.',
      },
    ],
    completion:
      'The organization has received an agreed, reproducible set of basic accessibility observations and understands the review’s limits.',
    tip: 'A precise example on one important page is easier to act on than a long automated score with no explanation.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['w3c-web-accessibility-initiative-c10e0ab80d'],
        purpose:
          'Learn introductory checks and their explicit limits before preparing a small, permission-based community website review.',
      },
    ],
  },
  'take-a-volunteer-call-through-be-my-eyes': {
    title: 'Take a volunteer call through Be My Eyes: a practical starting plan',
    summary:
      'Prepare for and answer a short visual-assistance call when the platform matches you with someone who requests help.',
    time: 'Short onboarding; the wait for a first call is unpredictable.',
    cost: 'Free with a supported smartphone and reliable connection.',
    place: 'A private, quiet place where you can concentrate on the caller.',
    preparation:
      'Read the volunteer hub and community rules. Set only languages you can use confidently, test notifications and understand that signing up does not guarantee a prompt call.',
    steps: [
      {
        title: 'Prepare for a real request',
        body: 'Learn the call controls before volunteering. Choose times when you can listen without rushing or exposing the call to bystanders. Keep account, medical and other high-stakes decisions outside your role.',
      },
      {
        title: 'Let the caller direct',
        body: 'Ask what help is wanted and describe only what you can actually see. Request a clearer view when necessary rather than guessing. The caller decides what to do with the information you provide.',
      },
      {
        title: 'Close with respect',
        body: 'Check whether the specific task is complete, then end the call through the app. Follow its feedback process without saving private images or retelling identifying details. Leave future calls to others when you are unavailable.',
      },
    ],
    completion:
      'You have answered a matched call and helped with the caller’s chosen task within your limits.',
    tip: 'Calls may be infrequent because many volunteers are available; do not turn waiting into an obligation to keep watching your phone.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['be-my-eyes-aa5a002555'],
        purpose:
          'Read the volunteer hub before configuring notifications and preparing for a private, caller-directed visual-assistance call.',
      },
    ],
  },
  'complete-a-bounded-un-online-volunteering-assignment': {
    title: 'Complete a bounded UN online-volunteering assignment: a practical starting plan',
    summary:
      'Deliver a clearly scoped remote assignment for an organization through the UN online-volunteering platform.',
    time: 'Application and selection time, followed by the assignment’s agreed schedule.',
    cost: 'Participation is unpaid; use your existing tools and connectivity.',
    place: 'A remote workspace compatible with the host’s collaboration needs.',
    preparation:
      'Applicants must be at least 18. Read each host’s skill and language requirements and selection process; assignments are unpaid, remote and limited to 20 hours weekly for at most 12 weeks.',
    steps: [
      {
        title: 'Apply to a bounded task',
        body: 'Choose an assignment with a concrete output and named host. Explain relevant skills honestly and ask about unclear requirements. Check that the schedule fits before accepting an offer or beginning substantial work.',
      },
      {
        title: 'Agree the deliverable',
        body: 'Confirm the audience, format, deadline and review contact with the host. Ask how data and unpublished material should be handled. Break the assignment into a small first draft and a final handover.',
      },
      {
        title: 'Finish the handover',
        body: 'Share the draft early enough for feedback, revise within the agreed scope and deliver the final files through the requested channel. Confirm receipt and clarify any maintenance expectations before closing the assignment.',
      },
    ],
    completion:
      'The host has received the agreed deliverable and the assignment’s review and handover are complete.',
    tip: 'A well matched small task is more useful than applying broadly to causes where you cannot deliver the requested skill.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['united-nations-volunteers-481888efbc'],
        purpose:
          'Check age eligibility, host selection, unpaid status and the maximum weekly hours and assignment duration before applying through UVP.',
      },
    ],
  },
  'sort-supplies-during-a-food-bank-volunteer-shift': {
    title: 'Sort supplies during a food-bank volunteer shift: a practical starting plan',
    summary:
      'Help a food bank prepare supplies through a booked shift that follows its actual receiving and distribution rules.',
    time: 'A booked shift, often part of a morning or afternoon.',
    cost: 'Usually no fee; allow for travel and requested clothing.',
    place: 'A food bank or partner organization’s approved volunteer site.',
    preparation:
      'Check the local organization’s current shifts, age requirements and access arrangements. Ask about lifting or standing so you can choose a suitable role.',
    steps: [
      {
        title: 'Arrive ready for the shift',
        body: 'Complete the induction and identify the supervisor. Learn hygiene, sorting and manual-handling rules before opening boxes. Ask for a seated or lighter task if that will let you work safely and effectively.',
      },
      {
        title: 'Sort by the organization’s system',
        body: 'Check items using the supervisor’s criteria for packaging, dates and accepted categories. Set questionable goods aside for staff rather than making your own distribution decision. Keep food and cleaning materials appropriately separate.',
      },
      {
        title: 'Leave a clear handover',
        body: 'Finish the assigned batch or mark its remaining work clearly. Clean the station as instructed and return equipment. Ask whether any recorded quantities need checking before the supervisor closes the shift.',
      },
    ],
    completion:
      'You have completed a useful shift and left the sorted supplies ready for the organization’s next stage.',
    tip: 'Ask what is needed before bringing donations; unsolicited goods can create extra sorting and storage work.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['feeding-america-feaa1973bb'],
        purpose:
          'Use Feeding America’s volunteer route to find a food bank and ask about suitable sorting shifts.',
      },
    ],
  },
  'prepare-enrichment-materials-for-an-animal-shelter': {
    title: 'Prepare enrichment materials for an animal shelter: a practical starting plan',
    summary:
      'Prepare enrichment items a shelter actually requests, following its animal-care and material rules.',
    time: 'A volunteer induction and one preparation session.',
    cost: 'Materials may be supplied; confirm before buying anything.',
    place: 'An animal shelter’s supervised preparation space or an approved home task.',
    preparation:
      'Ask the shelter about its enrichment-preparation role and current requirements. Confirm materials, cleaning, food restrictions and whether volunteers may work away from the shelter.',
    steps: [
      {
        title: 'Get an approved specification',
        body: 'Choose one item the staff want and ask for an example. Confirm sizes, materials and how the item will be used. Avoid inventing a toy or treat around a general internet idea.',
      },
      {
        title: 'Prepare a careful batch',
        body: 'Follow the shelter’s hygiene and construction instructions. Keep small loose parts, unsuitable string and unapproved foods out of the process. Stop and ask staff if a material behaves differently from the example.',
      },
      {
        title: 'Hand it to the care team',
        body: 'Label the batch as requested and have staff inspect it before animals receive anything. Note any design issue that arose while making it. Leave distribution and animal-specific decisions to the shelter team.',
      },
    ],
    completion:
      'An approved batch has been checked and accepted by the shelter for its enrichment program.',
    tip: 'Behind-the-scenes preparation can help animals without requiring you to handle them or commit to a long care shift.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['peggy-adams-animal-rescue-league-dae3058a34'],
        purpose:
          'Contact the shelter through its volunteer route to confirm enrichment-preparation roles and current material requirements.',
      },
    ],
  },
  'help-catalog-seeds-at-a-community-seed-library': {
    title: 'Help catalog seeds at a community seed library: a practical starting plan',
    summary:
      'Help a seed library make its collection usable through accurate labels, packets and a tidy catalog.',
    time: 'A scheduled library session or a small approved batch.',
    cost: 'Usually free when the library supplies seeds and packaging.',
    place: 'A library worktable or another approved dry, clean workspace.',
    preparation:
      'Ask the seed-library coordinator which batch needs work. Check its labeling, accepted seed sources and storage conventions before packaging or donating any seeds.',
    steps: [
      {
        title: 'Understand the seed record',
        body: 'Read an existing packet with the coordinator. Identify which fields are known, such as variety, source and year, and which should remain unknown. Do not infer a variety from appearance or a familiar name.',
      },
      {
        title: 'Package consistently',
        body: 'Use the supplied materials and handling method, keeping different seed batches separate. Write legible labels and count or portion according to the library’s instructions. Keep the work dry and free from unrelated seeds.',
      },
      {
        title: 'Reconcile the finished batch',
        body: 'Compare packet labels with the original record and update the catalog as requested. Return leftover seeds with their identity intact. Ask the coordinator to check a sample before putting the packets into circulation.',
      },
    ],
    completion:
      'A requested batch is labeled, organized and accepted for the seed library’s collection.',
    tip: 'Accurate source information is more useful than decorative packaging; leave uncertain identification visible to future borrowers.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['city-of-hayward-public-library-0affefd586'],
        purpose:
          'Use the seed-library information to prepare questions for its coordinator about packet labeling and catalog tasks.',
      },
    ],
  },
  'help-repair-library-books-under-staff-supervision': {
    title: 'Help repair library books under staff supervision: a practical starting plan',
    summary:
      'Learn a library’s approved minor-repair process and help return a few ordinary circulating books to use.',
    time: 'Training and a regular commitment; the cited Citrus role asks two to three hours weekly for at least six months.',
    cost: 'Typically free; use the library’s own materials.',
    place: 'A library workspace supervised by its materials or conservation staff.',
    preparation:
      'Check the library’s role requirements and current recruitment. The cited Citrus position requires careful tool use and a six-month commitment because of training; agree the schedule and suitable work before applying.',
    steps: [
      {
        title: 'Learn the approved repair',
        body: 'Watch a staff demonstration on a practice or low-value item. Understand the materials and how to recognize damage beyond your role. Ordinary household tape is not a substitute for the library’s repair system.',
      },
      {
        title: 'Work on a small batch',
        body: 'Inspect each assigned book and follow the demonstrated method. Keep loose parts with their book and avoid covering text or labels. Stop when the damage differs from your training rather than improvising a fix.',
      },
      {
        title: 'Return books for checking',
        body: 'Let staff inspect completed repairs and identify books needing further treatment. Record the batch and continue through the agreed volunteer schedule. At the end of your commitment, hand over remaining work and return materials.',
      },
    ],
    completion:
      'You have completed the agreed volunteer commitment, with staff-reviewed repairs and any unfinished work handed over.',
    tip: 'Start with routine circulating books; learning to recognize a job for a conservator is part of useful repair work.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['citrus-county-library-system-855455c2e3'],
        purpose:
          'Read the Book Repair Technician role’s actual training, skill, weekly hours and minimum six-month commitment before applying or finding an equivalent local role.',
      },
    ],
  },
  'join-a-supervised-invasive-plant-removal-workday': {
    title: 'Join a supervised invasive-plant removal workday: a practical starting plan',
    summary:
      'Support a permitted habitat workday with careful plant identification, manageable tasks and an organized handover.',
    time: 'A scheduled workday, commonly a few hours including the briefing.',
    cost: 'Usually no volunteer fee; allow for travel and requested protective clothing.',
    place:
      'An authorized local stewardship site; Glen Echo Park’s organized vine-clearing event is one example.',
    preparation:
      'Find a currently advertised workday and confirm registration, age rules, terrain and task options with its leader. Ask for a suitable beginner role and check what gloves or equipment are supplied.',
    steps: [
      {
        title: 'Learn the assigned target',
        body: 'At the briefing, have a leader show which plants to remove and which to protect. Ask about wildlife, irritating plants and tool spacing. Choose a task suited to your movement and strength rather than copying experienced volunteers.',
      },
      {
        title: 'Work under supervision',
        body: 'Stay within the marked work area and use only tools you have been shown how to handle. Ask before cutting unfamiliar stems. Leave herbicides, power equipment and overhead or tensioned vines to appropriately trained people.',
      },
      {
        title: 'Finish the site handover',
        body: 'Place removed material where the leader specifies, since disposal can affect regrowth. Return tools, report hazards or unfinished patches and clean footwear as directed. Record the team’s agreed outcome without claiming that one session restored the habitat.',
      },
    ],
    completion:
      'You have completed an assigned stewardship task and returned the work area and tools through the leader’s handover.',
    tip: 'Ask for sorting or another lighter task if needed; a useful workday does not require handling a saw or working on difficult ground.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['forestplanet-and-tree-friends-united-baba701bd6'],
        purpose:
          'The organizer’s event page describes required RSVP, experienced volunteer direction, clothing and tools; check its date and find a current local workday.',
      },
    ],
  },
  'join-a-bird-safe-building-monitoring-route': {
    title: 'Join a bird-safe-building monitoring route: a practical starting plan',
    summary:
      'Help a conservation group document bird collisions using an agreed route and reporting system.',
    time: 'Training and one scheduled monitoring round, often early in the day.',
    cost: 'Usually free apart from travel; the group may provide materials.',
    place: 'A conservation group’s permitted public building-monitoring route.',
    preparation:
      'Ask the group about recruitment, route permissions and its reporting-only roles. Confirm what to do if you find an injured bird before starting.',
    steps: [
      {
        title: 'Learn the monitoring protocol',
        body: 'Review the route, timing and identification guidance with the coordinator. Understand the difference between a searched area with no finding and a missed visit. Choose a role that does not require handling wildlife.',
      },
      {
        title: 'Inspect the agreed route',
        body: 'Walk the designated public areas without entering restricted grounds or disturbing occupants. Record observations and photographs according to the protocol. Keep your distance from injured animals and contact the trained responder when required.',
      },
      {
        title: 'Report the whole round',
        body: 'Submit the search effort as well as findings so the record has context. Check location labels and avoid posting sensitive photographs publicly. Pass urgent concerns to the coordinator through the agreed channel.',
      },
    ],
    completion:
      'A complete monitoring round is reported with its search effort, findings and any necessary responder handover.',
    tip: 'Monitoring can include difficult sights; discuss the role beforehand and choose another conservation task if it would not suit you.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['michigan-audubon-87e5a2c76e'],
        purpose:
          'Use the collision-monitoring context to ask the coordinator about routes, reporting protocols and non-handling volunteer roles.',
      },
    ],
  },
  'make-a-requested-item-for-a-hospital-craft-program': {
    title: 'Make a requested item for a hospital craft program: a practical starting plan',
    summary:
      'Make one requested comfort item through a hospital partner that specifies what it can safely accept.',
    time: 'A coordinator conversation and several making sessions.',
    cost: 'New approved materials and possible postage create a modest cost.',
    place: 'A clean home workspace or an organized volunteer making session.',
    preparation:
      'Contact a hospital partner or established blanket program before starting. Confirm its current sizes, materials, washing, packaging and delivery rules rather than assuming handmade items are accepted.',
    steps: [
      {
        title: 'Choose an accepted pattern',
        body: 'Select a requested item within your existing skills and available time. Ask whether the recipient program has additional material restrictions. Buy only what the current specification allows and keep the instructions with the project.',
      },
      {
        title: 'Make and inspect it',
        body: 'Work in the environment required by the program and keep pins and loose components accounted for. Check seams, edges and the finished dimensions. Follow the program’s washing instructions rather than adding scented treatments.',
      },
      {
        title: 'Arrange the approved handover',
        body: 'Package and label the item as requested, then use the designated coordinator or drop-off location. Confirm receipt when appropriate. Protect recipients’ privacy and avoid expecting photographs or direct contact in return.',
      },
    ],
    completion:
      'A finished item meeting the program’s current requirements has been accepted through its approved donation route.',
    tip: 'Ask first, make second: a beautiful item that cannot be accepted creates work instead of providing the intended comfort.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['project-linus-b13de9526b'],
        purpose:
          'Review Project Linus volunteering information before confirming a recipient program’s current blanket specifications and delivery process.',
      },
    ],
  },
};
