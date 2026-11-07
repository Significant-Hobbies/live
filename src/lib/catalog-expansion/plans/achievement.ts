import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const ACHIEVEMENT_GUIDES: Record<string, CuratedExperienceGuide> = {
  'earn-an-amateur-radio-license-in-your-country': {
    title: 'Earn an amateur-radio license in your country: a practical starting plan',
    summary:
      'Work toward your country’s amateur-radio qualification with practical club support and a clear understanding of operating privileges.',
    time: 'Several weeks or months of study, plus assessment and processing time.',
    cost: 'Study and examination fees vary; borrow equipment before buying a radio.',
    place: 'A local radio club, approved assessment venue and home study space.',
    preparation:
      'Find the current process through your national communications authority. Ask a club which beginner qualification applies and what study materials match the current assessment.',
    steps: [
      {
        title: 'Understand the qualification',
        body: 'Read the authority’s eligibility and application information. Check what the assessment covers and whether additional permissions follow the examination. Use another country’s guide only for general study, never as your local operating authority.',
      },
      {
        title: 'Study with practical context',
        body: 'Join a club demonstration and work through its beginner syllabus. Practise calculations, procedures and regulations with current questions. Keep any hands-on transmission within the supervision and permissions that local rules actually allow.',
      },
      {
        title: 'Complete the official process',
        body: 'Book the required assessment when prepared and follow the application steps after passing. Check the issued privileges and station conditions before operating. Keep the authority’s documents with your first operating notes.',
      },
    ],
    completion:
      'You have obtained the relevant national qualification and understand the permissions needed for your first operation.',
    tip: 'Visit a club before buying a handheld radio; the equipment you eventually need depends on the activities your qualification permits.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['department-of-telecommunications-gov-649f875963'],
        purpose:
          'Check India’s official qualification process; readers elsewhere should use their own national communications authority.',
      },
    ],
  },
  'complete-an-in-person-first-aid-and-cpr-course': {
    title: 'Complete an in-person first-aid and CPR course: a practical starting plan',
    summary:
      'Learn first aid and CPR through practical instruction and an assessment rather than relying on a written checklist.',
    time: 'A scheduled class, with any required advance study.',
    cost: 'A paid course; check whether assessment and certification are included.',
    place: 'A recognized training provider’s classroom with practice equipment.',
    preparation:
      'Choose a course recognized in your region and suited to your purpose. Confirm hands-on CPR, instructor qualifications, accessibility and whether the certificate has a renewal requirement.',
    steps: [
      {
        title: 'Book the right class',
        body: 'Compare the course content with your needs, such as adult workplace first aid or pediatric care. Ask which skills are practised in person and what the final assessment requires before paying.',
      },
      {
        title: 'Practise with feedback',
        body: 'Complete the preparation and attend the full session. Let the instructor check your technique on the provided training equipment. Ask for an adaptation if kneeling, grip or another required action needs support.',
      },
      {
        title: 'Finish and retain the record',
        body: 'Take the provider’s assessment and review any skill the instructor asks you to repeat. Save the completion record and renewal information. Learn where to find the appropriate local emergency number and official refresher materials.',
      },
    ],
    completion:
      'You have completed the practical course and met the provider’s assessment requirements.',
    tip: 'An online introduction can prepare you, but choose a class with observed practical skills when that is the experience you want.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['american-red-cross-6362ec5656'],
        purpose:
          'Compare first-aid training options before confirming a local course with observed CPR practice and suitable assessment.',
      },
    ],
  },
  'analyze-an-exoplanet-transit-with-real-telescope-data': {
    title: 'Analyze an exoplanet transit with real telescope data: a practical starting plan',
    summary:
      'Turn real telescope observations into an exoplanet light curve using the Exoplanet Watch project’s supported workflow.',
    time: 'A weekend for setup and a first dataset; processing can take longer.',
    cost: 'Archival data participation can be free with a suitable computer.',
    place: 'A laptop workspace with internet access; a telescope is optional.',
    preparation:
      'Read the current getting-started material and software requirements. Use a supplied practice or checked-out dataset for the first attempt instead of acquiring telescope equipment.',
    steps: [
      {
        title: 'Understand the observation',
        body: 'Read the dataset notes and identify the target star and observation interval. Learn what a transit light curve represents and which comparison stars the workflow uses. Keep the original data unchanged.',
      },
      {
        title: 'Follow the reduction workflow',
        body: 'Work through the official EXOTIC instructions with the provided data. Record settings and any rejected images so a mentor can help diagnose problems. Ask the project community about errors rather than altering data to create a dip.',
      },
      {
        title: 'Inspect the resulting curve',
        body: 'Review the fit, quality checks and uncertainties described by the project. Save your output and notes, then follow its contribution process if the result qualifies. A noisy curve is still a useful first analysis.',
      },
    ],
    completion:
      'You have produced and interpreted one light curve with a record of the data and processing choices.',
    tip: 'Start with existing telescope data; understanding one observation is a substantial project without also learning nighttime equipment operation.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-0aef6d4bfb'],
        purpose:
          'Use the Exoplanet Watch FAQs to plan a first analysis with existing telescope data.',
      },
    ],
  },
  'build-a-radio-jove-receiver-with-a-radio-club': {
    title: 'Build a Radio JOVE receiver with a radio club: a practical starting plan',
    summary:
      'Assemble a supported radio-astronomy system with experienced help and learn to interpret a first observing session.',
    time: 'Several build and setup sessions, then observing time.',
    cost: 'A receiver, antenna, supports and compatible computer make this a substantial project.',
    place: 'A club workspace and a permitted antenna site away from overhead power lines.',
    preparation:
      'Read the current kit and equipment manuals with a radio club. Confirm compatibility, safe antenna installation, site permission and the full parts cost before ordering.',
    steps: [
      {
        title: 'Plan the whole system',
        body: 'Ask an experienced participant to review the receiver, software and antenna plan. Include supports, cables and weather arrangements in the budget. Try the project’s online data first to learn what its displays look like.',
      },
      {
        title: 'Assemble with supervision',
        body: 'Use the current documentation and have a competent mentor check connections and antenna installation. Keep all supports and wires clear of electrical hazards. Follow the club’s weather and shutdown rules before powering the receiver.',
      },
      {
        title: 'Record a first observation',
        body: 'Log the time, configuration and local interference while collecting data. Compare your display with project examples and a mentor’s interpretation. Preserve uncertain signals as uncertain rather than claiming a detection from an unfamiliar burst.',
      },
    ],
    completion:
      'A checked system has produced an observing record that you have reviewed with an experienced participant.',
    tip: 'The current kit differs from older soldered receiver versions; use the instructions that match the hardware you actually obtain.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-radio-jove-2573cb29d6'],
        purpose:
          'Review the current Radio JOVE kit information with your mentor before choosing compatible receiver and antenna equipment.',
      },
    ],
  },
  'map-impact-melt-features-on-the-moon': {
    title: 'Map impact-melt features on the Moon: a practical starting plan',
    summary:
      'Help examine lunar impact-melt deposits by marking observable features in spacecraft images through a guided science platform.',
    time: 'An introductory tutorial and a focused mapping session.',
    cost: 'Free with a suitable internet-connected screen.',
    place: 'A comfortable computer or tablet workspace with clear image detail.',
    preparation:
      'Read the Lunar Melt project explanation and check current participation. These flows formed from rock melted by impacts, so do not label them automatically as volcanic lava.',
    steps: [
      {
        title: 'Learn the marking tools',
        body: 'Complete the in-project tutorial before submitting classifications. Compare examples of craters and boulders at the displayed scale. Note what the task asks you to outline and what should remain unmarked.',
      },
      {
        title: 'Work one image carefully',
        body: 'Inspect the whole frame, then make the requested measurements or outlines. Use the available scale and zoom consistently. Leave ambiguous shadows unresolved according to the task’s options instead of turning every dark patch into a feature.',
      },
      {
        title: 'Check your submission',
        body: 'Review the marks for accidental clicks and overlapping features before finishing. Read any available feedback and keep a note of what you learned. Use the project’s help process when the imagery exceeds your confidence.',
      },
    ],
    completion:
      'You have completed a trained image-mapping session and can explain the features the project asked you to mark.',
    tip: 'The useful achievement is a careful measurement contribution, not a claim that you personally discovered a new lunar landform.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-6b83e00c8d'],
        purpose:
          'Understand Lunar Melt’s image-marking task before following its tutorial and making your first classifications.',
      },
    ],
  },
  'build-and-troubleshoot-a-battery-powered-switch-circuit': {
    title: 'Build and troubleshoot a battery-powered switch circuit: a practical starting plan',
    summary:
      'Make a simple low-voltage circuit work, then diagnose an intentional open connection using a clear explanation.',
    time: 'An afternoon including setup, testing and packing away.',
    cost: 'A small educational circuit kit or borrowed workshop components.',
    place: 'A dry table at home or a supervised makerspace.',
    preparation:
      'Choose a beginner battery-powered activity with a proper holder and compatible components. Have a mentor check the parts; do not use mains wiring or loose button cells.',
    steps: [
      {
        title: 'Predict the current path',
        body: 'Sketch the battery, switch and output before connecting them. Ask which connections must form a complete loop. Use the project’s component ratings and check the switch can interrupt the intended path.',
      },
      {
        title: 'Build and operate it',
        body: 'Assemble the demonstrated circuit with the power disconnected, then have it checked. Try the switch and observe the output. Disconnect promptly if anything heats unexpectedly and ask your mentor to inspect the setup.',
      },
      {
        title: 'Find a deliberate fault',
        body: 'Have a partner introduce one safe open connection with power removed. Explain your diagnosis before reconnecting it. Compare the actual fault with your prediction and draw the working circuit beside the incorrect one.',
      },
    ],
    completion:
      'Your circuit switches reliably and you can explain how you identified a safe, deliberate open-circuit fault.',
    tip: 'Borrow a workshop kit with robust connectors before investing in soldering tools or a large box of components.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-e5e1cc07ae'],
        purpose:
          'Use the circuit-board activity as a starting design for your battery-powered switching and troubleshooting experiment.',
      },
    ],
  },
  'control-a-scratch-project-with-a-physical-object': {
    title: 'Control a Scratch project with a physical object: a practical starting plan',
    summary:
      'Make a screen action respond to a real object, combining a simple Scratch project with an educational input interface.',
    time: 'A first session of around an afternoon.',
    cost: 'Borrow or buy a compatible interface; the coding environment is free.',
    place: 'A dry table with a supported computer and room for clipped leads.',
    preparation:
      'Read the interface manufacturer’s setup guide and choose one simple screen response. Gather safe conductive objects and keep liquids away from the computer and connections.',
    steps: [
      {
        title: 'Make the screen response first',
        body: 'Create a small Scratch project that responds to one key with movement or sound. Test it using the keyboard and save a local copy. A working software baseline makes later hardware problems easier to locate.',
      },
      {
        title: 'Connect one physical input',
        body: 'Follow the manufacturer’s approved connection method and test one object at a time. Keep leads secure and the workspace clear. Use the keyboard test to distinguish a coding problem from an incomplete physical connection.',
      },
      {
        title: 'Try an unfamiliar user',
        body: 'Invite someone to trigger the response without explaining every gesture. Notice where contact or feedback is unclear and change one thing. Save the project and photograph the connection layout so you can reproduce it.',
      },
    ],
    completion:
      'A saved project responds reliably to a physical input and another person has successfully tried it.',
    tip: 'One clear interaction is a better first prototype than a complicated controller with several uncertain connections.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['makey-makey-dccc6e069f'],
        purpose:
          'Follow the Makey Makey Scratch setup route to connect a tested screen response to a physical input.',
      },
    ],
  },
  'make-a-pinhole-camera-and-develop-a-photograph': {
    title: 'Make a pinhole camera and develop a photograph: a practical starting plan',
    summary:
      'Create a lensless photograph in a beginner workshop that includes both the camera and the darkroom process.',
    time: 'A workshop session plus drying or later collection time.',
    cost: 'A paid session with photographic paper, processing and camera materials included.',
    place: 'A teaching darkroom and a nearby permitted outdoor subject.',
    preparation:
      'Find a workshop explicitly covering a pinhole exposure and developed photograph. Check chemical handling, access, materials and whether the image is taken home the same day.',
    steps: [
      {
        title: 'Prepare a light-tight camera',
        body: 'Follow the tutor’s camera plan and let them supervise cutting or sharp tools. Check how the shutter and paper loading work before leaving the darkroom. Keep the first design simple enough to troubleshoot.',
      },
      {
        title: 'Expose one still scene',
        body: 'Choose a subject that will remain steady during the tutor’s suggested exposure. Record the light conditions and timing. Keep the camera still and avoid photographing people who have not agreed to the experiment.',
      },
      {
        title: 'Develop and compare',
        body: 'Use the workshop’s supervised processing method and handling rules. Compare the image with your timing notes and discuss one change for a second exposure. Let the print finish its required washing and drying before packing it.',
      },
    ],
    completion:
      'You have exposed and processed a pinhole image and kept enough notes to understand the result.',
    tip: 'Ask whether the workshop produces a paper negative or a positive print so your expectations match the actual process.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['ilford-photo-87007a66b4'],
        purpose:
          'Read the pinhole-photography background before discussing exposure and darkroom processing with your workshop tutor.',
      },
    ],
  },
  'build-a-sundial-and-compare-it-with-clock-time': {
    title: 'Build a sundial and compare it with clock time: a practical starting plan',
    summary:
      'Build a shadow-based timekeeper and investigate the relationship between its reading and ordinary clock time.',
    time: 'Short observations across one clear day, with a later comparison.',
    cost: 'Low-cost stationery and a stable outdoor base.',
    place: 'A permitted sunny site where the dial can remain undisturbed.',
    preparation:
      'Read the sundial activity and check how its orientation depends on your location. Choose a level position and plan observations without looking directly at the Sun.',
    steps: [
      {
        title: 'Set a stable reference',
        body: 'Build the dial using the activity’s design and mark its exact position. Check that the shadow-casting part stays upright. Record the date, location and clock convention, including any daylight-saving adjustment.',
      },
      {
        title: 'Record repeated shadows',
        body: 'Return at planned intervals and mark or photograph the shadow consistently. Keep the base fixed and note clouds or accidental movement. Label observations immediately so a later photograph does not lose its time reference.',
      },
      {
        title: 'Explain the disagreement',
        body: 'Compare the dial with civil time and consult the resource about orientation and solar time. Distinguish an alignment problem from a clock-convention difference. Recheck on another day before claiming a precise timekeeping instrument.',
      },
    ],
    completion:
      'A dated set of shadow observations shows how your dial behaved and why it differs from a clock.',
    tip: 'Do not recalibrate the dial after every mismatch; a stable setup makes the source of disagreement easier to investigate.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-ff7436a1c4'],
        purpose:
          'Use NASA’s sundial activity to plan the build and compare shadow readings with recorded clock times.',
      },
    ],
  },
  'build-a-spectroscope-and-compare-household-lights': {
    title: 'Build a spectroscope and compare household lights: a practical starting plan',
    summary:
      'Compare visible-light patterns using a homemade spectroscope and a small set of ordinary safe light sources.',
    time: 'One making session and time to compare several lamps.',
    cost: 'Reused cardboard and a suitable disc keep materials inexpensive.',
    place: 'A supervised worktable and an indoor space with accessible lamps.',
    preparation:
      'Read the full activity and arrange competent help with cutting tools. Select ordinary lamps you can view safely; never aim the device at the Sun or lasers.',
    steps: [
      {
        title: 'Build a clean viewer',
        body: 'Use the activity’s template and check the slit and viewing direction carefully. Ask a helper to handle cuts beyond your experience. Test with one lamp before decorating or permanently sealing the housing.',
      },
      {
        title: 'Compare distinct sources',
        body: 'Observe two or three safe lamps without changing the basic viewing method. Sketch the bands and gaps you actually see and label each source. Avoid treating a camera’s color rendering as an exact measurement.',
      },
      {
        title: 'Explain one pattern difference',
        body: 'Use the resource’s explanation to compare a line-rich spectrum with a more continuous one. Note limitations from alignment, stray light and slit width. Keep your sketches alongside a photograph of the finished instrument.',
      },
    ],
    completion:
      'Your working viewer reveals distinguishable patterns from several labeled light sources.',
    tip: 'A carefully made slit improves the result more than elaborate decoration, and reflected daylight is safer than direct solar viewing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-7df9d55ab7'],
        purpose:
          'Follow the CD spectroscope activity when building the viewer and interpreting differences between safe household lamps.',
      },
    ],
  },
  'measure-the-speed-of-sound-with-a-repeatable-experiment': {
    title: 'Measure the speed of sound with a repeatable experiment: a practical starting plan',
    summary:
      'Estimate sound speed with an educator-approved measurement method and explain why repeated trials differ.',
    time: 'A preparation read and an afternoon of repeated trials.',
    cost: 'Free or low cost with borrowed measurement equipment.',
    place: 'A quiet, permitted space suitable for your chosen method.',
    preparation:
      'Choose a published method your available equipment can support. Read its timing and distance requirements; phone microphone measurements and human reaction times have different limitations.',
    steps: [
      {
        title: 'Define the measurement',
        body: 'Write down which distance the sound travels and which interval you will measure. Check whether an echo requires a round trip. Agree units and a trial record before collecting any numbers.',
      },
      {
        title: 'Collect comparable trials',
        body: 'Use the same sound and measurement setup for several repetitions at a comfortable volume. Keep people away from traffic and other hazards. Record failed trials with their reason rather than quietly removing inconvenient results.',
      },
      {
        title: 'Calculate and qualify',
        body: 'Calculate the estimate using the method’s stated relationship and compare repeated results. Discuss distance uncertainty, background noise and timing resolution. Save a short explanation of which limitation most affected your experiment.',
      },
    ],
    completion:
      'You have a repeatable estimate with units and a clear account of its main measurement limitations.',
    tip: 'A surprisingly wrong answer is useful if you can trace it to the distance definition or a timing assumption.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['vernier-science-education-67459d6a17'],
        purpose:
          'Review the sound-speed experiment before deciding whether your equipment can measure the required distance and time.',
      },
    ],
  },
  'investigate-a-pendulum-with-timed-trials': {
    title: 'Investigate a pendulum with timed trials: a practical starting plan',
    summary:
      'Investigate pendulum motion through repeatable timings and one deliberately changed variable.',
    time: 'A first afternoon with room for several sets of trials.',
    cost: 'String, a small safe mass and a timer are inexpensive.',
    place: 'A clear table or low support where the moving mass cannot strike anyone.',
    preparation:
      'Read the experiment before assembling it. Choose a small, securely attached mass and a low setup; avoid heavy objects suspended above people or fragile surfaces.',
    steps: [
      {
        title: 'Choose one comparison',
        body: 'Start by comparing two lengths while keeping the mass and release method consistent. Define a full swing and choose how many swings to time together. Prepare a table before setting the pendulum moving.',
      },
      {
        title: 'Time repeated runs',
        body: 'Release gently from the same small angle rather than pushing. Time several swings per run and repeat each length. Note tangles, knocks and counting mistakes so they remain visible in your record.',
      },
      {
        title: 'Interpret the pattern',
        body: 'Compare the average timings and the spread between repeats. Describe what changed when the string length changed, staying within the evidence. Keep your setup sketch so another person could reproduce the comparison.',
      },
    ],
    completion:
      'A labeled set of repeated measurements supports an explanation of how pendulum length affected the swing time.',
    tip: 'Timing several swings together can make starting and stopping errors less dominant than timing a single swing.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['science-buddies-826aab85d8'],
        purpose:
          'Use the pendulum experiment to plan repeatable timings and a controlled comparison of two string lengths.',
      },
    ],
  },
  'build-a-tabletop-seismograph': {
    title: 'Build a tabletop seismograph: a practical starting plan',
    summary:
      'Build a classroom-style seismograph model and compare the traces made by different gentle base movements.',
    time: 'An afternoon for a cardboard model and its first trials.',
    cost: 'Ordinary classroom materials keep the model inexpensive.',
    place: 'A sturdy table with enough room to move the model safely.',
    preparation:
      'Choose a lightweight educational model rather than a heavy workshop build. Read its tool precautions and arrange help with cutting or fastening parts.',
    steps: [
      {
        title: 'Make a readable recorder',
        body: 'Follow the model’s frame and suspended-marker instructions. Check that the marker reaches the paper without jamming. Keep the recording mass small and securely attached before you introduce any movement.',
      },
      {
        title: 'Establish a baseline trace',
        body: 'Pull the paper steadily while leaving the base still. Label that trace, then try a gentle repeated disturbance. Keep paper speed and marker contact similar so differences in the marks are easier to interpret.',
      },
      {
        title: 'Compare controlled disturbances',
        body: 'Test one change, such as movement direction or surface, and label each strip immediately. Explain which part of the model moves relative to which. Do not use the tabletop results to claim earthquake prediction or professional sensitivity.',
      },
    ],
    completion:
      'Your model produces distinguishable labeled traces and you can explain its relative-motion principle.',
    tip: 'Save the straight baseline strip as well as the dramatic squiggles; it shows whether the recorder itself was behaving consistently.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['oregon-state-university-84ed1b6a44'],
        purpose:
          'Use the seismograph model instructions to plan a lightweight recorder and compare its traces under gentle movement.',
      },
    ],
  },
  'program-a-small-digital-weather-station': {
    title: 'Program a small digital weather station: a practical starting plan',
    summary:
      'Program a beginner microcontroller to log environmental readings and explore how sensor placement changes their interpretation.',
    time: 'A weekend for setup, logging and one comparison.',
    cost: 'A compatible board, safe power source and optional sensors are moderate costs.',
    place: 'A dry workspace and a protected permitted observation position.',
    preparation:
      'Read the board’s weather-station project and check exactly what its sensors measure. Internal board temperature, for example, should not automatically be treated as accurate outdoor air temperature.',
    steps: [
      {
        title: 'Start with one reading',
        body: 'Load the supported beginner project and display a single sensor value. Compare it with a basic reference where possible. Note power source, placement and units before adding logging or extra measurements.',
      },
      {
        title: 'Record a short series',
        body: 'Use the project’s data-logging method and keep the board protected according to its hardware instructions. Record the observation interval and surroundings. Do not leave unprotected electronics in rain or direct weather.',
      },
      {
        title: 'Test the placement effect',
        body: 'Move the sensor to one controlled alternative position and compare the records. Discuss shade, nearby heat and the instrument’s limitations. Save the code and a simple chart with the two placements clearly labeled.',
      },
    ],
    completion:
      'A saved program and dated log show one environmental measurement and a documented placement comparison.',
    tip: 'Label readings by the actual sensor and setup instead of presenting a homemade station as a certified weather instrument.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['micro-bit-educational-foundation-2e8f12b18d'],
        purpose:
          'Consult the micro:bit weather-station project before choosing what to log and how to interpret the sensor readings.',
      },
    ],
  },
  'test-a-paper-glider-with-controlled-design-changes': {
    title: 'Test a paper glider with controlled design changes: a practical starting plan',
    summary:
      'Test a paper glider as an engineering experiment by changing one feature and keeping a simple flight log.',
    time: 'A making session and repeated short flight trials.',
    cost: 'Free with scrap paper and an existing measuring tape.',
    place: 'A large clear indoor space away from people and breakable objects.',
    preparation:
      'Choose one published basic glider and a safe testing area. Decide whether you will compare flight distance or another observable outcome before changing the design.',
    steps: [
      {
        title: 'Make a baseline glider',
        body: 'Fold carefully and label the starting design. Mark a launch line and agree a consistent gentle launch. Keep the paper type and launch area fixed so later changes have a clear comparison.',
      },
      {
        title: 'Change one feature',
        body: 'Choose a single modification from the activity, such as a change that adds drag. Predict its effect and make the alteration. Fly several trials for each version, recording where each first lands.',
      },
      {
        title: 'Compare the flight records',
        body: 'Look at the pattern across trials rather than selecting the best throw. Note crashes, damage or changing launch technique. Keep both the design sketch and measurements so the conclusion refers to a specific tested change.',
      },
    ],
    completion:
      'You have compared a baseline and one modified glider using repeated, labeled flight trials.',
    tip: 'A shared launch line and a gentle repeatable throw matter more than trying to set a distance record.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['science-buddies-09018a0ed9'],
        purpose:
          'Use the paper-plane experiment to choose one design change and organize comparable flight trials.',
      },
    ],
  },
  'build-a-solar-oven-and-chart-its-heating': {
    title: 'Build a solar oven and chart its heating: a practical starting plan',
    summary:
      'Build a small solar-heating box and collect a temperature record without relying on it to prepare food safely.',
    time: 'An afternoon with suitable sunshine and supervised construction.',
    cost: 'Reused cardboard, foil and a thermometer create a low-cost experiment.',
    place: 'An open permitted sunny area with a stable ground-level surface.',
    preparation:
      'Read the solar-oven activity and tool precautions. Use a thermometer and an experimental water container; arrange cutting help and a way to handle surfaces that become hot.',
    steps: [
      {
        title: 'Choose a measurable goal',
        body: 'Decide what temperature you will record and at which intervals. Write down the container, water quantity and starting conditions. Build the published box design before experimenting with reflector changes or additional insulation.',
      },
      {
        title: 'Run a controlled trial',
        body: 'Place the setup on a stable surface and record the weather and start time. Follow the activity’s heat precautions and supervise the box. Avoid glare into eyes and do not leave reflective materials unattended.',
      },
      {
        title: 'Chart heating and limits',
        body: 'Plot temperature against time, noting clouds or adjustments. Compare another trial only when you can describe its changed conditions. Treat all water as experimental material and explain why warming is not proof of safe cooking or disinfection.',
      },
    ],
    completion:
      'A finished solar box has produced a dated temperature series with the weather and setup recorded.',
    tip: 'A modest temperature rise with good notes teaches more than an unsupported claim that a homemade oven can cook anything.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['science-buddies-3fb750886d'],
        purpose:
          'Follow the solar-oven activity for an experimental build, then record heating without treating it as safe cooking.',
      },
    ],
  },
  'build-a-model-water-filter-and-measure-what-changes': {
    title: 'Build a model water filter and measure what changes: a practical starting plan',
    summary:
      'Explore filtration through a small model, comparing visible changes while keeping every sample separate from drinking water.',
    time: 'One or two hours for the first design and comparison.',
    cost: 'Inexpensive clean materials and reused containers may suffice.',
    place: 'A washable table near a sink, with all samples clearly labeled.',
    preparation:
      'Read the full NASA activity and its drinking-water warning. Use only the suggested demonstration materials, prepare spill protection and label every vessel as experimental and undrinkable.',
    steps: [
      {
        title: 'Define what you can observe',
        body: 'Choose a simple visible comparison, such as clarity under the same lighting. Keep some starting sample as a reference. Do not add hazardous substances or use real sewage to make the trial more realistic.',
      },
      {
        title: 'Test a small design',
        body: 'Build the model using the activity’s tool and material instructions. Pass a measured amount through it and collect the output separately. Record the layer order and any clogging without assuming clearer water is safe.',
      },
      {
        title: 'Revise one feature',
        body: 'Change a single layer or arrangement and repeat a comparable trial. Photograph the samples together and describe only the observed differences. Dispose of test water appropriately and wash the equipment before returning the workspace to normal use.',
      },
    ],
    completion:
      'Two documented filter trials show a specific observable difference, with no claim that the output is drinkable.',
    tip: 'Filtration can change appearance while leaving invisible hazards; write that limitation beside the comparison photograph.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-jet-propulsion-laboratory-93538a7f4d'],
        purpose:
          'Use NASA’s filter activity and drinking-water warning to frame a demonstration of visible changes only.',
      },
    ],
  },
  'program-conway-s-game-of-life': {
    title: "Program Conway's Game of Life: a practical starting plan",
    summary:
      'Implement a cellular automaton and use known patterns to test whether its rules update the grid correctly.',
    time: 'A weekend for a first implementation and pattern experiments.',
    cost: 'Free with an existing computer and coding environment.',
    place: 'A computer workspace where you can save code and screenshots.',
    preparation:
      'Read the original rule definitions through a reliable mathematical resource. Choose a small finite grid and explicitly decide what happens at its edges before writing the update loop.',
    steps: [
      {
        title: 'Model one generation',
        body: 'Represent alive and empty cells and write the neighbor-count operation. Calculate a tiny example on paper. Keep the old and new grids separate so one cell’s update does not change a neighbor’s current generation.',
      },
      {
        title: 'Check recognizable patterns',
        body: 'Try a still life and a simple oscillator whose expected behavior you can verify. Add generation stepping and reset controls. Test corners and edges separately rather than trusting a pattern placed only in the center.',
      },
      {
        title: 'Explore a starting pattern',
        body: 'Run a few chosen seeds and save the code with their coordinates. Record when a pattern stabilizes, repeats or reaches the boundary. Explain how the finite grid affects what you observe compared with an unbounded mathematical model.',
      },
    ],
    completion:
      'Your program reproduces checked patterns and you have documented one experiment with explicit boundary rules.',
    tip: 'A correct slow version is a better foundation than a fast animation whose cells update in the wrong order.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-auckland-eafec037d5'],
        purpose:
          'Review the cellular-automaton rules before implementing generation updates and checking known patterns on your grid.',
      },
    ],
  },
  'train-a-small-image-classifier-on-your-own-objects': {
    title: 'Train a small image classifier on your own objects: a practical starting plan',
    summary:
      'Train a simple object classifier and investigate a specific failure rather than treating a convincing demo as general understanding.',
    time: 'An afternoon for collecting examples, training and testing.',
    cost: 'Free with a compatible computer and camera you already have.',
    place: 'A private table with a plain background and movable objects.',
    preparation:
      'Read the tool’s data-handling information and use ordinary objects rather than people or sensitive images. Choose two categories and reserve some new views for testing.',
    steps: [
      {
        title: 'Gather varied examples',
        body: 'Create named classes and collect examples with different angles and positions. Keep the two classes from having different backgrounds by accident. Save a small set of unseen examples separately before training the model.',
      },
      {
        title: 'Test outside the setup',
        body: 'Train using the official workflow, then present the reserved examples. Change the background or lighting one condition at a time. Record correct and incorrect predictions instead of showing only the successful demonstrations.',
      },
      {
        title: 'Improve one failure',
        body: 'Choose one repeated error and add relevant training examples without mixing in every test image. Retrain and try another unseen set. Describe the narrow conditions where the model works and retain its known limitations.',
      },
    ],
    completion:
      'You have a trained teaching model and a small test record showing both successes and a documented limitation.',
    tip: 'A percentage display is not a guarantee of correctness; a confident mistake can be the most instructive result.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['google-creative-lab-b725bd4fb2'],
        purpose:
          'Use the official training tool to build object classes and test their predictions on unfamiliar views.',
      },
    ],
  },
  'build-logic-gates-in-a-circuit-simulator': {
    title: 'Build logic gates in a circuit simulator: a practical starting plan',
    summary:
      'Build simulated Boolean gates and check every input combination before combining them into a larger circuit.',
    time: 'A few focused sessions for the first gates.',
    cost: 'Free with the course’s supported simulator and an existing computer.',
    place: 'A computer workspace suitable for reading diagrams and testing code.',
    preparation:
      'Read the project’s Boolean-logic introduction and simulator tutorial. Start with the supplied project files and keep a clean copy of the expected outputs for comparison.',
    steps: [
      {
        title: 'Write the expected behavior',
        body: 'Make truth tables for NOT, AND and OR before implementation. Understand the primitive component the course supplies. Trace one input case by hand so the diagram and the output table describe the same operation.',
      },
      {
        title: 'Implement a small gate',
        body: 'Use the supported hardware-description format and run its supplied test. Inspect a failing input combination rather than changing wires randomly. Keep each working gate in a clearly named file before moving to the next.',
      },
      {
        title: 'Combine and retest',
        body: 'Connect your checked gates into one modest circuit and write its expected table. Run all input cases and document a fault you corrected. Save both the implementation and its test output as the finished project.',
      },
    ],
    completion:
      'Several basic gates and one combined circuit pass explicit input-output checks in the simulator.',
    tip: 'Truth tables are small enough to test completely here; use that advantage before attempting a processor-sized design.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nand-to-tetris-f8ec307c06'],
        purpose:
          'Follow Project 1’s gate-building workflow and tests before combining your checked Boolean components.',
      },
    ],
  },
  'send-and-receive-a-short-morse-code-message': {
    title: 'Send and receive a short Morse-code message: a practical starting plan',
    summary:
      'Learn a small Morse vocabulary by sound and use it to exchange a short message through a practice device.',
    time: 'Brief practice sessions across several weeks.',
    cost: 'Free audio resources or a borrowed practice oscillator are sufficient.',
    place: 'A quiet room with comfortable listening volume.',
    preparation:
      'Choose an established training approach and a practice partner or tutor. Use audio or a local oscillator; learning code does not itself grant permission to transmit on radio frequencies.',
    steps: [
      {
        title: 'Recognize a small set',
        body: 'Start with the trainer’s first characters and listen to their rhythm. Keep practice short enough to remain attentive. Record which characters you confuse and return to those sounds before adding more.',
      },
      {
        title: 'Practise sending clearly',
        body: 'Use an offline practice key or supported software to send familiar characters and spacing. Have a partner copy what they hear. Compare their transcription with your intended message instead of judging only how fluent your hand feels.',
      },
      {
        title: 'Exchange a new message',
        body: 'Prepare a short message your partner has not memorized, using the characters you know. Take turns sending and receiving, then compare the text. Save the recording and choose one timing or listening issue for further practice.',
      },
    ],
    completion:
      'You have sent and correctly received a short unfamiliar message using an agreed practice setup.',
    tip: 'Comfortable accuracy is a more useful first target than chasing a particular words-per-minute figure.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['arrl-e51f79097d'],
        purpose:
          'Explore ARRL’s Morse-learning resources to choose listening practice before exchanging a short message with a partner.',
      },
    ],
  },
  'work-through-a-celestial-navigation-sight-reduction': {
    title: 'Work through a celestial-navigation sight reduction: a practical starting plan',
    summary:
      'Explore the arithmetic behind a celestial sight using a clearly labeled practice example and official astronomical data.',
    time: 'A focused session, with extra time to learn the angle notation.',
    cost: 'Free using the online data service, paper and a calculator.',
    place: 'A desk with internet access; no boat, sextant or sky observation is needed.',
    preparation:
      'Read the USNO service notes, especially its sea-level assumptions and angle conventions. Prepare a practice apparent altitude rather than claiming to have measured a celestial object.',
    steps: [
      {
        title: 'Save a defined data case',
        body: 'Choose one assumed position, date and Universal Time in the service. Save the returned table with those inputs. Select a listed star and identify its computed altitude and correction columns using the documentation.',
      },
      {
        title: 'Calculate a practice correction',
        body: 'Label your invented apparent altitude as simulated. Apply the service’s documented correction convention and compare the result with the computed altitude. Keep degrees and minutes explicit so a notation mistake does not masquerade as a navigation result.',
      },
      {
        title: 'Check and explain the result',
        body: 'Recalculate independently or exchange the arithmetic with a partner. Explain what changed between apparent and corrected altitude and what assumptions were used. Keep the exercise separate from a real position fix or qualification in practical navigation.',
      },
    ],
    completion:
      'You have a checked practice calculation with saved inputs, explicit units and a clear explanation of its assumptions.',
    tip: 'Begin with a star, whose correction table is simpler, and use the source documentation before attempting solar or lunar examples.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['u-s-naval-observatory-573cc4c5b9'],
        purpose:
          'Use the official data service and its notes to understand computed altitude, azimuth and altitude corrections; this is a desk exercise.',
      },
    ],
  },
  'compare-a-place-across-two-satellite-images': {
    title: 'Compare a place across two satellite images: a practical starting plan',
    summary:
      'Compare two official satellite views of one place while recording the dates, layers and interpretation limits.',
    time: 'An afternoon for a first comparison and a short explanation.',
    cost: 'Free with internet access and a suitable browser.',
    place: 'A computer screen large enough to inspect image labels and legends.',
    preparation:
      'Read the official viewer guide and choose a visible event or landscape feature. Use dates and layers that make a fair comparison rather than two attractive but incompatible images.',
    steps: [
      {
        title: 'Choose the comparison',
        body: 'Identify one question, such as a change in visible lake extent. Select a consistent product and geographic view. Check cloud cover and image dates before deciding whether the pair can address your question.',
      },
      {
        title: 'Inspect the image context',
        body: 'Use the viewer’s comparison controls and retain the legend, layer name and dates. Look for clouds, shadows or seasonal differences that could mimic change. Do not interpret every color difference as a ground-level measurement.',
      },
      {
        title: 'Write a bounded conclusion',
        body: 'Save a labeled comparison and explain what is visibly different. Separate direct observations from possible causes and mention the product’s resolution limits. Link the underlying official imagery so another person can inspect the same evidence.',
      },
    ],
    completion:
      'A labeled image pair supports a specific observation with dates, data layers and remaining uncertainty documented.',
    tip: 'Choosing comparable images is part of the achievement; a dramatic before-and-after picture can otherwise be misleading.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-my-nasa-data-a9e5588a1e'],
        purpose:
          'Use the Worldview classroom guide to select imagery and preserve the dates, layers and comparison context.',
      },
    ],
  },
  'plot-a-week-of-public-earthquake-records': {
    title: 'Plot a week of public earthquake records: a practical starting plan',
    summary:
      'Map a small official earthquake dataset and learn how event records, magnitudes and reporting updates differ.',
    time: 'A focused afternoon with time to read the field definitions.',
    cost: 'Free using official CSV data and existing analysis tools.',
    place: 'A computer workspace with a spreadsheet or mapping tool.',
    preparation:
      'Read the USGS feed documentation and choose a fixed seven-day snapshot. Save the original file and retrieval time so later updates do not silently change your analysis.',
    steps: [
      {
        title: 'Inspect the fields',
        body: 'Check which columns contain event time, coordinates, magnitude and event type. Note missing values and different magnitude types. Decide what your chart includes before filtering rather than removing inconvenient records after seeing the pattern.',
      },
      {
        title: 'Create a simple map',
        body: 'Plot the reported coordinates and use a labeled symbol scale if showing magnitude. Check a few rows against the source records. Keep non-earthquake event types separate if your question concerns earthquakes only.',
      },
      {
        title: 'Explain the scope',
        body: 'Describe the date window, geographic coverage and any filtering beside the map. Note that small events are not detected uniformly everywhere. Treat the result as a record of reported events, not a forecast of future activity.',
      },
    ],
    completion:
      'You have a checked map and a short explanation of its data window, included records and limitations.',
    tip: 'Preserve event identifiers; they make it much easier to investigate a surprising point than a screenshot alone.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['united-states-geological-survey-08dc25c48b'],
        purpose:
          'Consult the USGS CSV documentation to interpret event fields before plotting a fixed earthquake-record snapshot.',
      },
    ],
  },
  'identify-a-small-mineral-collection-using-observable-properties': {
    title:
      'Identify a small mineral collection using observable properties: a practical starting plan',
    summary:
      'Identify a few teaching specimens through observable mineral properties and a documented chain of reasoning.',
    time: 'An afternoon for a small labeled teaching collection.',
    cost: 'A basic educational kit or borrowed museum materials are low cost.',
    place: 'A protected worktable with good light and permitted test materials.',
    preparation:
      'Use known safe teaching specimens and read the property guide. Avoid unknown fibrous, dusty or potentially toxic minerals, and do not use tasting, acids or destructive tests without specialist instruction.',
    steps: [
      {
        title: 'Record appearance first',
        body: 'Label each specimen with a temporary number and note luster, crystal shape and visible features. Keep the answer labels covered if using a teaching kit. Photograph the specimen under consistent lighting before any permitted test.',
      },
      {
        title: 'Follow a property key',
        body: 'Use only the kit’s approved hardness or streak method with appropriate supervision. Record actual observations rather than jumping straight to a mineral name. Check whether the result excludes a candidate or merely makes it more likely.',
      },
      {
        title: 'Compare with the reference',
        body: 'Reveal the teaching labels and examine disagreements. Identify which property was ambiguous or poorly observed. Keep a small identification card for each specimen explaining the evidence and any limits of the simple tests.',
      },
    ],
    completion:
      'A few specimens have identification records based on named properties rather than color alone.',
    tip: 'Color can vary widely within one mineral; a documented property combination is more informative than a confident visual guess.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['mineralogical-society-of-america-017a99dec7'],
        purpose:
          'Use the mineral-property explanations to organize observations and justify tentative identifications of safe teaching specimens.',
      },
    ],
  },
  'build-a-model-of-the-moon-s-phases': {
    title: "Build a model of the Moon's phases: a practical starting plan",
    summary:
      'Use a simple light-and-ball model to explain lunar phases and distinguish them from eclipses.',
    time: 'Around an hour for setup, observation and explanation.',
    cost: 'A suitable lamp and small pale ball are inexpensive or reusable.',
    place: 'A clear room that can be dimmed without creating trip hazards.',
    preparation:
      'Read the NASA activity and lamp precautions. Arrange a stable light source, adequate clearance and a comfortable alternative to holding the ball at arm’s length if needed.',
    steps: [
      {
        title: 'Set up the model',
        body: 'Identify which object represents the Sun, Moon and observer. Keep the lamp stable and out of reach of the ball. Use the activity’s viewing arrangement while avoiding direct glare or contact with hot surfaces.',
      },
      {
        title: 'Compare several positions',
        body: 'Move through the model slowly and sketch what the observer sees at selected positions. Notice that the lit portion depends on viewpoint. Keep the ball out of your body’s shadow except when deliberately discussing an eclipse.',
      },
      {
        title: 'Explain it to someone',
        body: 'Use the model to show a crescent, quarter and full phase, then demonstrate how an eclipse differs. Name the model’s limitations, including its compressed scale. Compare your sketches with a real lunar observation on another evening.',
      },
    ],
    completion:
      'You can demonstrate several phases and explain why ordinary lunar phases are not caused by Earth’s shadow.',
    tip: 'A diagram becomes easier to understand after you have changed viewpoint around an actual illuminated ball.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nasa-jet-propulsion-laboratory-ca96baebe3'],
        purpose:
          'Follow NASA’s light-and-ball activity to model phases and distinguish changing illumination from an eclipse.',
      },
    ],
  },
  'grow-salt-crystals-and-keep-a-measurement-record': {
    title: 'Grow salt crystals and keep a measurement record: a practical starting plan',
    summary:
      'Grow a small salt-crystal sample and document its changes with a consistent observation method.',
    time: 'A supervised preparation session followed by brief daily checks.',
    cost: 'Table salt, suitable containers and recording materials are inexpensive.',
    place: 'A stable labeled spot away from food preparation, pets and young children.',
    preparation:
      'Read the educational activity and arrange help with hot water if its method uses heat. Label the container as an experiment and decide where it can remain undisturbed.',
    steps: [
      {
        title: 'Prepare a documented start',
        body: 'Use the activity’s specified material and quantities rather than mixing unfamiliar salts. Record the date and starting setup. Choose a camera position and a nearby scale marker so later photographs can be compared sensibly.',
      },
      {
        title: 'Observe without rearranging',
        body: 'Check at a regular interval and photograph from the same position. Note changes in liquid level and visible crystals. Avoid moving the container to obtain a better picture if that would disturb the developing sample.',
      },
      {
        title: 'Describe the result',
        body: 'Compare the sequence and distinguish an actual measurement from a visual impression. Record whether individual crystals or a crust formed. Clean up according to the activity guidance and keep experimental material separate from anything intended to eat.',
      },
    ],
    completion:
      'A dated observation sequence shows how your sample changed and what you could reliably measure.',
    tip: 'A photograph with a scale and unchanged camera position is more useful than a beautiful close-up with no size reference.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['american-geosciences-institute-7fe85e37ea'],
        purpose:
          'Use the crystal-growing activity to choose a documented setup before keeping your own consistent observation record.',
      },
    ],
  },
  'extract-fruit-dna-in-an-educational-workshop': {
    title: 'Extract fruit DNA in an educational workshop: a practical starting plan',
    summary:
      'Join a supervised fruit-DNA activity and understand the difference between a visible extract and a purified genetic sample.',
    time: 'A teaching session with preparation and cleanup included.',
    cost: 'A workshop fee or small supervised materials cost.',
    place: 'A teaching laboratory or appropriately equipped educational workshop.',
    preparation:
      'Choose an educator-led session and review its materials, allergies and chemical-handling rules. This is an educational extraction, with all samples clearly separated from food and drink.',
    steps: [
      {
        title: 'Understand the demonstration',
        body: 'Ask what each stage is meant to do before starting. Read the session’s instructions and label your sample. Let the instructor handle any material or procedure outside your experience, including flammable liquids.',
      },
      {
        title: 'Follow the supervised method',
        body: 'Work only with the supplied quantities and approved equipment. Keep containers identifiable and avoid tasting or touching the extract. Record what appears at each stage without treating every visible strand as a single DNA molecule.',
      },
      {
        title: 'Discuss what was isolated',
        body: 'Compare your observations with the instructor’s explanation of the crude extract and its impurities. Note what additional laboratory methods would be needed for stronger claims. Dispose of materials through the workshop’s process and clean the station.',
      },
    ],
    completion:
      'You have completed the supervised extraction and can explain what its visible material does and does not establish.',
    tip: 'Choose a workshop that explains the controls and chemistry, rather than promising that a quick demonstration reveals your genes.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-e726f8dac2'],
        purpose:
          'Review the extraction activity with your instructor to connect each supervised step with the visible fruit extract.',
      },
    ],
  },
  'separate-pen-inks-with-paper-chromatography': {
    title: 'Separate pen inks with paper chromatography: a practical starting plan',
    summary:
      'Compare water-soluble pen inks through a small chromatography experiment and a labeled record of their separated colors.',
    time: 'A short setup and an hour for running and inspecting strips.',
    cost: 'Filter paper, washable pens and containers are low-cost materials.',
    place: 'A protected table where wet strips can remain undisturbed.',
    preparation:
      'Read the educational procedure and choose water-soluble inks with water as the solvent. Avoid permanent-marker solvents or improvised chemical mixtures for a first attempt.',
    steps: [
      {
        title: 'Label the samples',
        body: 'Choose two or three inks and mark which strip belongs to each pen. Follow the activity’s baseline guidance and keep sample sizes comparable. Prepare a record sheet before any colors begin to spread.',
      },
      {
        title: 'Run comparable strips',
        body: 'Use the procedure’s water level and paper arrangement, watching that the ink starts correctly relative to the solvent. Keep containers steady. Mark the solvent’s progress as directed and preserve the strip labels throughout drying.',
      },
      {
        title: 'Compare without overclaiming',
        body: 'Photograph the dry strips together and describe the visible bands. Note differences in travel and color under the same method. Similar patterns do not establish that two pens contain exactly the same chemical formulation.',
      },
    ],
    completion:
      'Your labeled strips and notes show a reproducible comparison of several inks under one method.',
    tip: 'Black washable pens can contain several visible colors; keep the original pen names with the finished strips.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-warwick-c74ab8df6c'],
        purpose:
          'Follow the ink-chromatography procedure to set up comparable strips and record the separated colors accurately.',
      },
    ],
  },
  'build-a-fruit-battery-and-measure-its-output': {
    title: 'Build a fruit battery and measure its output: a practical starting plan',
    summary:
      'Build an educational fruit battery and use measurements to understand what the cell can actually provide.',
    time: 'An afternoon with supervised preparation and repeated readings.',
    cost: 'Simple electrodes, leads and a borrowed meter keep costs modest.',
    place: 'A dry worktable with experimental fruit kept away from food.',
    preparation:
      'Read the activity and arrange help with sharp electrodes or cutting. Use a low-voltage meter and approved components; do not connect the experiment to mains power or rechargeable electronics.',
    steps: [
      {
        title: 'Plan a measurable cell',
        body: 'Identify the two electrode materials and the meter’s correct setting with a tutor. Sketch the circuit and label which terminal connects where. Keep the experimental fruit separate from anything that will be eaten.',
      },
      {
        title: 'Measure a baseline',
        body: 'Assemble the demonstrated cell and record a stable reading with units. Note electrode spacing and contact problems. A voltage reading is not evidence that the cell can power an arbitrary device or charge a phone.',
      },
      {
        title: 'Compare one arrangement',
        body: 'Change a single supported feature or connection and repeat the measurement. Check polarity and compare the readings rather than selecting the largest number alone. Disconnect, dispose of the fruit appropriately and clean the reusable equipment.',
      },
    ],
    completion:
      'A working educational cell has produced labeled measurements and one clearly described comparison.',
    tip: 'Borrow the meter first; a tiny or inconsistent reading can teach you about contacts and measurement as well as chemistry.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['science-buddies-deb1cd6cce'],
        purpose:
          'Use the lemon-battery activity to plan electrode connections and interpret measurements without assuming useful charging power.',
      },
    ],
  },
  'evaluate-an-air-quality-sensor-with-a-community-group': {
    title: 'Evaluate an air-quality sensor with a community group: a practical starting plan',
    summary:
      'Learn how a community group evaluates an air sensor against a reference and documents data quality.',
    time: 'Several planning sessions and the group’s required comparison period.',
    cost: 'Borrowing helps; a sensor and approved mounting may otherwise cost moderately.',
    place: 'A group-approved monitoring location with permission and safe installation.',
    preparation:
      'Read the collocation guide with an experienced group. Confirm the pollutant, sensor, reference access, duration and analysis plan before treating any device as a trustworthy local monitor.',
    steps: [
      {
        title: 'Define the comparison',
        body: 'Ask what the sensor measures and which reference is appropriate. Agree data intervals, units and placement with the group. Record environmental factors and manufacturer settings that could affect the comparison before collecting data.',
      },
      {
        title: 'Collect paired observations',
        body: 'Have a competent person install the equipment safely at the approved site. Keep a maintenance and interruption log. Do not expose the device to smoke or other hazards merely to generate more interesting readings.',
      },
      {
        title: 'Review performance honestly',
        body: 'Compare time-aligned sensor and reference data using the group’s method. Document missing values and limits rather than calling a correlation a universal calibration. Apply any correction only with the group’s justification and retain the raw record.',
      },
    ],
    completion:
      'A paired comparison has been reviewed with the group and its useful range and limitations are documented.',
    tip: 'Checking a sensor’s performance and correcting its data are related but different tasks; name which one you actually completed.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['united-states-environmental-protecti-5903c51e45'],
        purpose:
          'Read EPA’s collocation guidance with your group to plan a reference comparison and document sensor limitations.',
      },
    ],
  },
  'make-a-low-voltage-accessibility-switch-with-a-mentor': {
    title: 'Make a low-voltage accessibility switch with a mentor: a practical starting plan',
    summary:
      'Build a simple assistive switch with an experienced maker and test a demonstration interaction through genuine co-design.',
    time: 'A planning conversation, a build session and a user-led trial.',
    cost: 'A small kit or printed parts, plus access to supervised tools.',
    place: 'A makerspace or approved workshop with a compatible demonstration interface.',
    preparation:
      'Read an established switch design and discuss the intended interaction with its user. Confirm consent, force and positioning needs, connector compatibility and supervision for soldering or other tools.',
    steps: [
      {
        title: 'Choose with the user',
        body: 'Ask what action the person wants to perform and what movements are comfortable. Use a proven design as a starting point. Agree that this first build is a demonstration, with no promises about suitability for essential equipment.',
      },
      {
        title: 'Build and check it',
        body: 'Follow the design documentation with a mentor, including tool precautions and connection checks. Test the switch electrically before connecting the low-voltage demonstration interface. Label the connector and keep the assembly accessible for inspection.',
      },
      {
        title: 'Let the user evaluate',
        body: 'Position the switch as the person requests and let them direct the trial. Note effort, accidental activations and mounting issues. Make only agreed changes and have the mentor recheck the assembly before another test.',
      },
    ],
    completion:
      'A checked switch has been tried in a demonstration, with the user’s feedback and remaining limitations documented.',
    tip: 'Useful co-design starts with the person’s chosen task; an impressive mechanism is not enough if its placement is uncomfortable.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['neil-squire-makers-making-change-05e0fc80f2'],
        purpose:
          'Review the Light Touch Switch design with your mentor before discussing user needs, construction and connector compatibility.',
      },
    ],
  },
  'compare-two-sorting-algorithms-on-the-same-dataset': {
    title: 'Compare two sorting algorithms on the same dataset: a practical starting plan',
    summary:
      'Compare two sorting methods through a fair experiment that checks correctness before interpreting performance.',
    time: 'A focused coding session and time to inspect the results.',
    cost: 'Free with an existing computer and programming environment.',
    place: 'A workspace where you can save code, inputs and results.',
    preparation:
      'Choose two well explained sorting algorithms and a language you already know. Define the input sizes and measurement approach before running comparisons so the experiment has a clear question.',
    steps: [
      {
        title: 'Check the output first',
        body: 'Implement or study each method and test empty, repeated and already ordered inputs. Compare its output with a trusted sort. Keep the same ordering definition so a fast incorrect result cannot appear to win.',
      },
      {
        title: 'Use paired inputs',
        body: 'Give both methods copies of exactly the same generated lists. Repeat measurements and record the runtime environment. Avoid including file loading in only one measurement or letting one method receive the other’s already sorted output.',
      },
      {
        title: 'Explain the observed pattern',
        body: 'Chart input size against the measured operation count or time, naming the metric. Discuss noise and the tested input distribution. Keep source and data together and limit claims to the workload you actually examined.',
      },
    ],
    completion:
      'Your experiment contains verified outputs and paired results for two algorithms on clearly described inputs.',
    tip: 'Counting comparisons can make a small educational experiment easier to interpret than tiny timings dominated by measurement overhead.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['university-of-canterbury-cs-unplugge-6e93b0f98e'],
        purpose:
          'Review the sorting explanations before choosing algorithms for your own fair, correctness-checked comparison.',
      },
    ],
  },
  'reproduce-one-chart-from-an-open-dataset': {
    title: 'Reproduce one chart from an open dataset: a practical starting plan',
    summary:
      'Rebuild one published chart from its underlying data and make the transformations transparent enough for someone else to check.',
    time: 'A weekend for locating data, rebuilding and checking.',
    cost: 'Free with open data and analysis tools you already use.',
    place: 'A computer workspace with the source chart and dataset available.',
    preparation:
      'Choose a simple chart whose publisher provides data and metadata. Check reuse conditions and save the retrieval date, source definition and original chart configuration.',
    steps: [
      {
        title: 'Trace the data source',
        body: 'Download the actual data rather than reading values from a picture. Inspect units, dates and missing-value conventions. Note whether the displayed series was already transformed by the publisher before you received the file.',
      },
      {
        title: 'Rebuild a narrow view',
        body: 'Select one series and a short date range first. Apply the documented filters or transformations and reproduce the axes and scale. Check several points against the original before attempting visual polish or additional series.',
      },
      {
        title: 'Explain every difference',
        body: 'Compare the result with the source and investigate mismatches in units, dates or aggregation. Save the script or spreadsheet with a short method note. Credit both the chart publisher and underlying dataset as their terms require.',
      },
    ],
    completion:
      'A reproducible chart matches a checked source view and includes a clear record of the transformations used.',
    tip: 'A matching line shape can hide wrong units; verify a few exact values before calling the reproduction complete.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['our-world-in-data-260c13b3da'],
        purpose:
          'Use the chart API documentation to retrieve underlying data and understand the series you aim to reproduce.',
      },
    ],
  },
  'design-and-3d-print-a-small-functional-bracket': {
    title: 'Design and 3D-print a small functional bracket: a practical starting plan',
    summary:
      'Turn a measured household need into a small printed prototype and revise its fit after a real test.',
    time: 'A weekend with printing time and room for one revision.',
    cost: 'A makerspace or print-service fee avoids buying a printer.',
    place: 'A CAD workspace and a supervised, appropriately ventilated printing facility.',
    preparation:
      'Choose a harmless non-load-bearing use, such as holding a lightweight desk item. Read the beginner design tutorial and ask the print provider about material, dimensions and service limits.',
    steps: [
      {
        title: 'Measure the actual fit',
        body: 'Sketch the object and the surfaces your bracket must touch. Record dimensions and clearance in one unit system. Keep the first part away from heat, food contact, electrical enclosures and any application where failure could injure someone.',
      },
      {
        title: 'Model and review',
        body: 'Build a simple model using the tutorial’s basic shapes and measurement tools. Check units and wall thickness with the provider before printing. Ask how print orientation and material affect the fit you are trying to achieve.',
      },
      {
        title: 'Test and revise',
        body: 'Let the part cool and have sharp edges handled appropriately. Try the intended lightweight use and record which dimensions are wrong. Change the model deliberately and keep version labels so the improvement is traceable.',
      },
    ],
    completion:
      'A printed prototype has been fitted to its harmless use case and revised using specific measurements.',
    tip: 'Print a small fit-check section first when possible; it can reveal a wrong clearance before a larger part consumes material.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['sparkfun-electronics-cbb4ac6cd3'],
        purpose:
          'Follow the Tinkercad modeling tutorial to turn measured dimensions into a simple bracket prototype.',
      },
    ],
  },
  'service-a-clock-during-a-five-day-beginner-course': {
    title: 'Service a clock during a five-day beginner course: a practical starting plan',
    summary:
      'Use a structured beginner course to learn mechanical clock servicing with the instructor supervising the work and workshop risks.',
    time: 'Five course days at Upton Hall, plus preparation and travel.',
    cost: 'A substantial course fee, with accommodation, transport and any approved project movement extra.',
    place: 'The British Horological Institute at Upton Hall, Nottinghamshire, England.',
    preparation:
      'Read the current Basic Clock listing and confirm a place, total cost and access arrangements with BHI. Agree a suitable movement beforehand; loan examples are limited and require arrangement.',
    steps: [
      {
        title: 'Confirm the course and project',
        body: 'Reserve the full five-day period only after checking the current course details. Ask the tutor to approve your movement or arrange a suitable loan. Avoid bringing an irreplaceable family clock as your first learning project.',
      },
      {
        title: 'Work within the taught sequence',
        body: 'Follow the tutor’s assessment, disassembly and inspection process. Keep parts and observations organized, and ask before applying force or releasing stored energy. Let the instructor decide which repair tasks are appropriate for your movement and skills.',
      },
      {
        title: 'Review setup and next steps',
        body: 'During reassembly and regulation, record the checks the tutor asks you to perform. Note remaining faults and any work outside the course scope. Ask what tools and further instruction are needed before attempting another movement independently.',
      },
    ],
    completion:
      'You have completed the five-day course and documented the instructor-reviewed servicing work and remaining limits of your project.',
    tip: 'The course is an introduction to servicing, not a guarantee that every damaged clock will be restored within the week.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-horological-institute-fa84103c13'],
        purpose:
          'Check the actual five-day curriculum, Upton Hall location, current fee, suitable movement requirements and booking arrangements.',
      },
    ],
  },
};
