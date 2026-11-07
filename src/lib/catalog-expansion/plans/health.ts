import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const HEALTH_GUIDES: Record<string, CuratedExperienceGuide> = {
  'try-a-short-seated-movement-session': {
    title: 'Try a short seated movement session: a practical starting plan',
    summary:
      'Explore a few gentle seated movements and identify a comfortable way to practise without a distance or fitness target.',
    time: 'A brief first session with pauses whenever needed.',
    cost: 'Free using a suitable chair and published guidance.',
    place: 'A clear level space with a stable non-wheeled chair.',
    preparation:
      'Read the seated-exercise guidance and check chair stability and foot support. If you are uncertain whether the activity suits a health condition, ask an appropriate professional first.',
    steps: [
      {
        title: 'Choose a comfortable setup',
        body: 'Arrange the chair so it cannot slide and remove obstacles around your arms and feet. Wear clothing that allows easy movement. Read the selected movements before starting so you do not have to twist toward a screen.',
      },
      {
        title: 'Try only a few movements',
        body: 'Follow the demonstrated positions within a comfortable range and keep breathing normally. Pause between movements rather than rushing through a list. Stop if movement causes pain or you feel unwell instead of forcing the session.',
      },
      {
        title: 'Keep a useful reminder',
        body: 'Note which movements and setup felt manageable and which you left out. Finish after the short trial and put the guidance somewhere easy to find. A later session can repeat the same familiar choices without adding a target.',
      },
    ],
    completion:
      'You have tried a short comfortable session and identified a suitable chair setup and a few manageable movements.',
    tip: 'A small enjoyable trial is enough; completing every exercise on a page is not required.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nhs-501571d18d'],
        purpose:
          'Consult the seated-exercise guidance when selecting comfortable movements and arranging a stable chair setup.',
      },
    ],
  },
  'attend-a-beginner-tai-chi-session': {
    title: 'Attend a beginner tai chi session: a practical starting plan',
    summary:
      'Join a beginner tai chi class and learn a small movement sequence through clear, adaptable instruction.',
    time: 'One introductory class, with optional short practice afterwards.',
    cost: 'A local class fee; specialist clothing is usually unnecessary.',
    place: 'A community class or studio with space and suitable access.',
    preparation:
      'Ask the teacher whether the class focuses on beginner movement or advanced martial practice. Discuss standing tolerance, seated alternatives and any uncertainty about suitability before attending.',
    steps: [
      {
        title: 'Meet the teacher first',
        body: 'Arrive early enough to explain your experience and ask about adaptations. Check the floor, available seating and how to pause. A teacher directory is a starting point; confirm that the actual class suits your needs.',
      },
      {
        title: 'Learn a short sequence',
        body: 'Follow the teacher’s chosen movements at a comfortable scale. Focus on weight placement and transitions rather than copying the depth or range of experienced participants. Ask for clarification when a direction or position is unclear.',
      },
      {
        title: 'Retain one familiar passage',
        body: 'Ask the teacher which small part is appropriate to repeat and how to remember it accurately. Note any adaptation that helped. Decide whether you enjoyed the class before committing to a long course or buying equipment.',
      },
    ],
    completion:
      'You have attended an introductory session and can recall a small teacher-approved sequence or adaptation.',
    tip: 'Choose the teaching style and class atmosphere you like; there is no need to master a complete form in one visit.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['tai-chi-union-for-great-britain-9ac3bc653e'],
        purpose:
          'Use the instructor directory to contact a teacher and discuss beginner classes and suitable movement adaptations.',
      },
    ],
  },
  'try-a-supervised-water-aerobics-class': {
    title: 'Try a supervised water-aerobics class: a practical starting plan',
    summary:
      'Try an instructor-led water-exercise session that matches your water confidence, pool access and desired pace.',
    time: 'A scheduled class plus changing and pool-entry time.',
    cost: 'A pool or class fee; ask whether equipment is supplied.',
    place: 'A supervised pool with appropriate depth and entry arrangements.',
    preparation:
      'Confirm the class depth, swimming-confidence requirements and instructor support. Ask about steps, hoists, changing facilities and suitable adaptations before booking, especially if ordinary pool entry is difficult.',
    steps: [
      {
        title: 'Check the pool routine',
        body: 'Arrive with time to locate changing facilities and meet the instructor. Explain your water confidence and learn where the class stays. Use the agreed entry method and keep the edge or approved support within reach when needed.',
      },
      {
        title: 'Try the class options',
        body: 'Use the instructor’s movements and equipment at a comfortable pace. Choose the simpler option when offered and pause without trying to match the fastest participant. Tell the instructor if footing, temperature or equipment feels unsuitable.',
      },
      {
        title: 'Finish without rushing',
        body: 'Use the instructed exit and leave time to change comfortably. Note which depth and movements suited you and any access problem to discuss. Judge the experience by comfort and enjoyment rather than a promised fitness result.',
      },
    ],
    completion:
      'You have completed a suitable supervised session or an agreed shorter version and learned how its pool setup works.',
    tip: 'Ask about the whole pool visit, including changing and entry; those details can matter as much as the exercises.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['swim-england-3bf4324fe3'],
        purpose:
          'Read the aqua-aerobics introduction before asking a pool about class depth, equipment and beginner support.',
      },
    ],
  },
  'take-a-beginner-pilates-class': {
    title: 'Take a beginner Pilates class: a practical starting plan',
    summary:
      'Learn beginner Pilates positions with instructor feedback and adaptations appropriate to your present movement experience.',
    time: 'A booked beginner class with a little arrival time.',
    cost: 'A class fee; confirm mat and any equipment provision.',
    place: 'A supervised studio or community class with suitable floor access.',
    preparation:
      'Choose an explicitly beginner class and ask whether it uses mats or machines. Discuss floor transfers, relevant limitations and suitability with the instructor before joining.',
    steps: [
      {
        title: 'Understand the class setup',
        body: 'Meet the instructor and learn where to place your mat and how to pause. Ask for alternatives to positions you cannot enter comfortably. Do not assume another participant’s advanced movement is part of your beginner task.',
      },
      {
        title: 'Practise a few basics',
        body: 'Follow the instructor’s breathing and alignment cues without forcing a range or holding your breath. Work at a scale where you can stay controlled. Stop and ask for help if an exercise causes pain or feels unsuitable.',
      },
      {
        title: 'Keep the useful adaptation',
        body: 'Ask which basic movements you understood and which need supervised practice again. Record a cue in your own words rather than assembling a home routine from half-remembered exercises. Decide whether the teaching and setting suited you.',
      },
    ],
    completion:
      'You have completed a beginner lesson and understand a few basic positions with suitable adaptations.',
    tip: 'Borrow the mat and try the class before buying equipment or paying for a long membership.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nhs-e4799d385a'],
        purpose:
          'Use the beginner Pilates guidance to prepare questions about instruction, floor transfers and appropriate starting movements.',
      },
    ],
  },
  'learn-a-short-supported-balance-routine': {
    title: 'Learn a short supported balance routine: a practical starting plan',
    summary:
      'Explore a short balance activity with appropriate stable support and guidance, without turning it into a test of endurance.',
    time: 'A brief session with rest and setup time.',
    cost: 'Free or a small coached-class fee.',
    place: 'A clear level floor beside a stable support.',
    preparation:
      'Read the balance guidance and choose professional help if suitability is uncertain. Use a secure support and avoid practising alone if you need someone present for safe movement.',
    steps: [
      {
        title: 'Set support within reach',
        body: 'Check that the floor and footwear are suitable and the support cannot roll or tip. Remove nearby trip hazards. Choose the easiest demonstration first rather than beginning with a position that requires letting go.',
      },
      {
        title: 'Practise with a small range',
        body: 'Use the guidance or instructor’s selected exercise slowly and with the agreed support. Keep the movement comfortable and pause before control becomes uncertain. Do not close your eyes or remove support to make the activity harder.',
      },
      {
        title: 'Record a workable version',
        body: 'Note the support, space and movement that suited you. Finish while the activity remains controlled and ask for clarification about anything uncomfortable. Repeating that same safe setup is a complete next step without adding difficulty.',
      },
    ],
    completion:
      'You have learned a short supported activity and can describe the setup and assistance that made it manageable.',
    tip: 'The support is part of the plan, not something you must eliminate to count the experience as complete.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nhs-4ce9f6ddb5'],
        purpose:
          'Review the balance-exercise guidance before choosing a short activity with suitable support and space.',
      },
    ],
  },
  'play-an-introductory-game-of-boccia': {
    title: 'Play an introductory game of boccia: a practical starting plan',
    summary:
      'Try boccia through a short target game whose distance, equipment and propulsion method are chosen with the players.',
    time: 'An introductory session and several relaxed ends.',
    cost: 'A club fee or borrowed balls can keep costs low.',
    place: 'A level accessible playing area with clear target and waiting zones.',
    preparation:
      'Find a club or inclusive facilitator and ask about ball ramps, seating and access. Read the Boccia activity card; recreational adaptations can differ from formal competition rules.',
    steps: [
      {
        title: 'Choose the playing arrangement',
        body: 'Let the facilitator explain the jack and colored balls, then agree the court size and turn order. Each player chooses an appropriate throwing, rolling or assisted method. Keep spectators outside the target area during play.',
      },
      {
        title: 'Try placement before scoring',
        body: 'Make a few practice deliveries toward a nearby jack. Notice how surface and release affect distance without comparing players’ physical techniques. Ask for a different ball or distance if that makes participation more comfortable.',
      },
      {
        title: 'Play a short end',
        body: 'Take turns using the agreed rules and inspect the final positions together. Let the facilitator explain which balls score. Rotate roles if wanted and decide one enjoyable adjustment before another end rather than stretching the session indefinitely.',
      },
    ],
    completion:
      'You have played a complete adapted end and understand how placement relative to the jack determines its result.',
    tip: 'A ramp or another permitted propulsion aid changes access to the game while preserving the challenge of choosing placement.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['australian-sports-commission-298fb1202e'],
        purpose:
          'Open the Boccia card for its target game, equipment, adaptations and safety guidance.',
      },
    ],
  },
  'try-goalball-at-an-inclusive-sports-session': {
    title: 'Try goalball at an inclusive sports session: a practical starting plan',
    summary:
      'Explore goalball with an inclusive coach who introduces the court, sound cues and safe beginner movement.',
    time: 'A coached taster with orientation before a short game.',
    cost: 'A club session fee; specialist equipment should be supplied.',
    place: 'A quiet indoor sports space prepared for goalball.',
    preparation:
      'Ask an inclusive club about its beginner session, ball weight, floor and access arrangements. Avoid improvising blindfolded play in an ordinary room without trained facilitation.',
    steps: [
      {
        title: 'Learn the court first',
        body: 'Explore the tactile markings and boundaries with the coach before using eyeshades. Understand the stop command and how the ball sounds. Discuss a comfortable playing position and any hearing or movement adaptation you need.',
      },
      {
        title: 'Practise locating the ball',
        body: 'Use the coach’s beginner ball and distance while taking clear turns. Begin without eyeshades if that is the agreed progression. Keep the room quiet during movement so players can use the intended sound information.',
      },
      {
        title: 'Join a short coached game',
        body: 'Apply the simplified throwing and defending rules only when the group is ready. Pause when the coach calls and keep equipment personal or cleaned as instructed. Review one listening or teamwork moment rather than counting only goals.',
      },
    ],
    completion:
      'You have completed a safely facilitated introduction and used the game’s sound and court information in a short activity.',
    tip: 'This is a sport with its own skills, not a simulation intended to show what another person’s life is like.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['australian-sports-commission-c6bda0c390'],
        purpose:
          'Choose the Goalball card for beginner modifications, tactile layout and equipment precautions.',
      },
    ],
  },
  'play-sitting-volleyball-with-an-inclusive-club': {
    title: 'Play sitting volleyball with an inclusive club: a practical starting plan',
    summary:
      'Try sitting volleyball with a coach who adjusts surface, ball speed and rules so the group can build a rally.',
    time: 'A club taster and a few short rally games.',
    cost: 'A local session fee; the club supplies the playing equipment.',
    place: 'A smooth suitable indoor court with comfortable personal space.',
    preparation:
      'Contact an inclusive volleyball club about floor access and adaptations. Ask whether a mat, lighter ball or other position is possible before assuming the standard competitive format suits you.',
    steps: [
      {
        title: 'Get comfortable with the setup',
        body: 'Meet the coach and try the floor surface before playing. Learn how players move without colliding and where the boundaries lie. Ask for cushioning or another agreed adjustment if contact with the floor is uncomfortable.',
      },
      {
        title: 'Practise a shared return',
        body: 'Use the coach’s light beginner ball and a short distance. Start with generous touches or a bounce if the group agrees. Focus on sending a usable ball to a teammate rather than striking hard.',
      },
      {
        title: 'Play a manageable rally game',
        body: 'Join the adapted teams and keep communication clear about who will return the ball. Pause for position changes and fatigue. Afterwards, discuss which net height and rule adjustment gave everyone a meaningful chance to participate.',
      },
    ],
    completion: 'You have joined a short adapted game and helped create a shared rally.',
    tip: 'The first session can use a slower ball and flexible touches; formal competition rules can come later.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['australian-sports-commission-f4e55f1ec7'],
        purpose:
          'Open the Sitting Volleyball card for court setup, beginner rules and surface adaptations.',
      },
    ],
  },
  'try-polybat-on-an-adapted-table': {
    title: 'Try polybat on an adapted table: a practical starting plan',
    summary:
      'Explore polybat as a table-surface rally game using suitable side barriers, bats and player positioning.',
    time: 'A short orientation and a relaxed game.',
    cost: 'Borrowed adapted equipment or a low club-session fee.',
    place: 'An accessible adapted table with secure rebound sides.',
    preparation:
      'Arrange a facilitated session and check table clearance, reach and seating. Read the Classic Polybat card rather than assuming ordinary table-tennis equipment and rules will be appropriate.',
    steps: [
      {
        title: 'Check the table fit',
        body: 'Have the facilitator secure the sides and position players comfortably. Check that legs and wheelchair parts do not rub against the table. Try holding or resting the bat in the suggested way before introducing the ball.',
      },
      {
        title: 'Build a controlled rally',
        body: 'Start by sending the ball along the surface to a cooperative partner. Watch direction and speed without lifting the ball. Adjust the ball or end opening with the facilitator if the setup is too fast or difficult.',
      },
      {
        title: 'Try a short scored game',
        body: 'Use the agreed service and multiple-touch rules, keeping the same adaptations for the round. Pause to reset equipment if a barrier moves. Discuss which shot placement or support helped you return the ball most reliably.',
      },
    ],
    completion:
      'You have sustained a surface rally and tried a short game with a suitable adapted setup.',
    tip: 'Secure side barriers and comfortable table clearance are part of the equipment, not optional details to improvise around.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['australian-sports-commission-d68e7f99cf'],
        purpose:
          'Choose Classic Polybat for the table-surface rules, equipment alternatives and positioning precautions.',
      },
    ],
  },
  'join-an-adapted-tee-ball-session': {
    title: 'Join an adapted tee-ball session: a practical starting plan',
    summary:
      'Try an adapted striking-and-fielding game with a stationary ball, clear safe zones and player-led support choices.',
    time: 'A coached introduction followed by a short team round.',
    cost: 'A small session fee or borrowed community equipment.',
    place: 'A suitable sports area with marked bases and a protected waiting zone.',
    preparation:
      'Find an inclusive facilitator and read the Tee Ball activity card. Discuss the bat, ball, base distances and optional runner or mobility support before setting up the game.',
    steps: [
      {
        title: 'Set up the safe turn',
        body: 'Learn where waiting players stand and how the coach signals a live ball. Try the chosen bat and tee without other people nearby. Agree any support with the player receiving it rather than assigning help automatically.',
      },
      {
        title: 'Practise striking and fielding',
        body: 'Use a larger or slower ball if appropriate and aim into the designated field. Put the bat down through the taught method before moving. Let each player try a useful fielding role at a comfortable distance.',
      },
      {
        title: 'Play a short inclusive round',
        body: 'Use the facilitator’s adapted timing and base rules so everyone gets a turn. Keep the same safety zones throughout play. Afterwards, choose one change that improved involvement rather than making elimination or running speed the main goal.',
      },
    ],
    completion:
      'You have completed a coached round with agreed equipment and support that let each player contribute.',
    tip: 'A substitute runner or shorter bases can preserve the choices of batting and fielding while changing the movement demand.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['australian-sports-commission-4cbbcbc1a8'],
        purpose:
          'Open Tee Ball for adapted equipment, optional support roles and safe batting arrangements.',
      },
    ],
  },
  'play-a-first-game-of-walking-football': {
    title: 'Play a first game of walking football: a practical starting plan',
    summary:
      'Try walking football through a beginner session that explains its movement, contact and ball-height rules before play.',
    time: 'One club session with briefing and regular pauses.',
    cost: 'A low local session fee; ask about footwear and loan equipment.',
    place: 'A supervised small-sided court used by a walking-football group.',
    preparation:
      'Check that the session accepts your age and experience and ask about its specific rules. Walking formats vary, so use the organizer’s current guidance rather than assuming standard football rules.',
    steps: [
      {
        title: 'Learn what counts as walking',
        body: 'Ask the facilitator to demonstrate the permitted movement and contact limits. Learn the restart and stop signals. Choose a position and pace that lets you follow the rules without being pulled into chasing a faster player.',
      },
      {
        title: 'Practise passing first',
        body: 'Try short controlled passes and receiving the ball before a match begins. Keep attention on space and teammates rather than powerful shots. Tell the facilitator if the surface, footwear or pace needs an adjustment.',
      },
      {
        title: 'Play a short match',
        body: 'Join the agreed format and take breaks when needed. Stop for the whistle and accept rule reminders as part of learning. Notice one successful pass or positioning choice to keep in mind for another session.',
      },
    ],
    completion:
      'You have played a supervised beginner game while following its walking and contact rules.',
    tip: 'A slower format still needs clear rules and suitable coaching; choose a newcomer session instead of dropping into a competitive match.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-football-association-england-foo-028069bfb5'],
        purpose:
          'Read the walking-football rules before asking your organizer how its beginner session applies movement and contact limits.',
      },
    ],
  },
  'take-an-adult-beginner-swimming-lesson': {
    title: 'Take an adult beginner swimming lesson: a practical starting plan',
    summary:
      'Start adult swimming with a qualified teacher and one realistic pool skill based on your current water confidence.',
    time: 'A booked beginner lesson plus changing and orientation time.',
    cost: 'A paid lesson; confirm whether entry and equipment are included.',
    place: 'A supervised teaching pool with an agreed entry method and depth.',
    preparation:
      'Tell the provider whether you are new to water, returning after a break or anxious. Confirm teacher support, class size, changing access and any suitable privacy or access arrangements.',
    steps: [
      {
        title: 'Agree the first goal',
        body: 'Meet the teacher before entering and explain what currently feels comfortable. Choose one task, such as supported floating or controlled movement near the edge. Learn the pool’s help signal and where the lesson will remain.',
      },
      {
        title: 'Practise with direct feedback',
        body: 'Follow the teacher’s chosen progression and use support as instructed. Ask to repeat or simplify a task rather than moving deeper to match others. Never practise breath-holding challenges or enter unassigned water during the lesson.',
      },
      {
        title: 'Finish with a clear next step',
        body: 'Use the agreed exit method and discuss what changed in your confidence or technique. Ask which skill belongs in the next supervised lesson. Keep success specific instead of claiming that a first lesson makes independent swimming safe.',
      },
    ],
    completion:
      'You have attended a suitable lesson and practised one agreed skill under direct supervision.',
    tip: 'Adult beginner groups exist at different levels; water confidence is a useful starting point even before swimming a length.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['leeds-beckett-university-171eab9fb9'],
        purpose:
          'An example of adult lesson levels including little-or-no-experience learners; this provider currently invites waiting-list registration, so confirm an available local place.',
      },
    ],
  },
  'try-wheelchair-basketball-at-an-introductory-club-session': {
    title: 'Try wheelchair basketball at an introductory club session: a practical starting plan',
    summary:
      'Try wheelchair basketball through a club introduction to sports-chair control, passing and an adapted game.',
    time: 'A beginner club session with time to fit a suitable chair.',
    cost: 'A small session fee; confirm sports-chair loan before attending.',
    place: 'An accessible basketball club with appropriate sports chairs and coaching.',
    preparation:
      'Contact the club about participation criteria, chair availability and transfer support. Explain your experience and access needs; an everyday wheelchair is not automatically suitable sports equipment.',
    steps: [
      {
        title: 'Learn the chair controls',
        body: 'Let the coach check the sports chair and explain turning, stopping and hand placement. Practise in a clear area before adding a ball or other players. Ask for help with any fit or comfort issue immediately.',
      },
      {
        title: 'Combine one ball skill',
        body: 'Try a short pass or controlled shot using the coach’s adaptation. Add movement gradually when the chair handling feels manageable. Keep practice cooperative so you can concentrate on the unfamiliar relationship between the chair and ball.',
      },
      {
        title: 'Join a short club game',
        body: 'Use the beginner rules and role the coach recommends. Communicate clearly, pause when needed and follow contact instructions. Return the chair and discuss one skill you would like to try again before considering personal equipment.',
      },
    ],
    completion:
      'You have tried sports-chair handling and contributed to a coached basketball activity.',
    tip: 'Ask the club what participation looks like locally; recreational sessions and formal competition classification have different requirements.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-wheelchair-basketball-4c99a3a3f0'],
        purpose:
          'Use the participation route to contact a wheelchair-basketball club about beginner coaching, sports chairs and support.',
      },
    ],
  },
  'learn-non-contact-boxing-footwork-and-pad-skills': {
    title: 'Learn non-contact boxing footwork and pad skills: a practical starting plan',
    summary:
      'Explore boxing technique through a supervised non-contact session with no sparring and a comfortable individual pace.',
    time: 'A beginner technique class with warm-up and breaks.',
    cost: 'A class fee; ask whether gloves, pads and wraps are supplied.',
    place: 'A reputable gym offering explicitly non-contact beginner instruction.',
    preparation:
      'Confirm in advance that the session excludes sparring and head contact. Ask about coach qualifications, equipment cleaning, seated options and how intensity can be adapted.',
    steps: [
      {
        title: 'Check the session boundaries',
        body: 'Tell the coach your experience and agree a non-contact goal. Have the coach fit any required hand protection and explain the stop signal. Do not pair off for improvised sparring outside the stated lesson.',
      },
      {
        title: 'Practise stance and movement',
        body: 'Follow a few slow footwork or seated-position drills before adding punches. Keep movement comfortable and controlled. Ask the coach to correct a single cue rather than increasing speed to make a combination look impressive.',
      },
      {
        title: 'Try an agreed pad sequence',
        body: 'Use pads only with the coach’s instruction and suitable partner. Focus on accuracy and controlled effort, pausing when technique deteriorates. Finish by naming the short sequence and one cue you can remember for another supervised session.',
      },
    ],
    completion:
      'You have completed a supervised non-contact introduction and practised a short controlled technique sequence.',
    tip: 'The goal can be learning unfamiliar movement; harder impacts and exhaustion are not required to complete the experience.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['england-boxing-637155a7fd'],
        purpose:
          'Find recreational boxing providers, then explicitly confirm a coached non-contact session with no sparring and suitable adaptations.',
      },
    ],
  },
  'learn-pickleball-and-play-a-short-game': {
    title: 'Learn pickleball and play a short game: a practical starting plan',
    summary:
      'Learn enough pickleball to enjoy a short beginner game while understanding the serve, bounce and non-volley-zone rules.',
    time: 'A beginner session or a relaxed afternoon on a suitable court.',
    cost: 'Court hire and borrowed paddles keep the first try inexpensive.',
    place: 'A clear pickleball court or a safely marked suitable sports area.',
    preparation:
      'Find a beginner group or instructor and confirm equipment loan. Read the basic rules and choose appropriate court footwear; ask about adaptations and rest opportunities before joining.',
    steps: [
      {
        title: 'Learn the court landmarks',
        body: 'Identify the service boxes and the non-volley zone with the instructor. Practise a comfortable serve and understand which bounces are required before volleying. Keep spare balls clear of feet and stop when a stray ball enters play.',
      },
      {
        title: 'Build a cooperative rally',
        body: 'Start with controlled short exchanges and aim to give your partner a playable ball. Use a pace that leaves time to recover position. Avoid rushing backward for a high ball; ask the coach for a suitable response.',
      },
      {
        title: 'Play a short agreed game',
        body: 'Use a simple scoring explanation and pause for rule questions. Rotate or rest as the group agrees rather than extending the game beyond comfort. Note one shot or rule that now makes sense and one to revisit.',
      },
    ],
    completion:
      'You have played a short beginner game and can explain its key bounce and non-volley-zone rules.',
    tip: 'Borrow a paddle before choosing one; the first session is about learning the game, not optimizing equipment.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['usa-pickleball-4acab66f2d'],
        purpose:
          'Read the introductory pickleball rules before practising serves, required bounces and the non-volley zone with your group.',
      },
    ],
  },
  'take-a-beginner-badminton-lesson': {
    title: 'Take a beginner badminton lesson: a practical starting plan',
    summary:
      'Try badminton with beginner coaching and aim for a comfortable shared rally rather than a competitive result.',
    time: 'One coached beginner session.',
    cost: 'A low lesson or court fee; ask about racket loan.',
    place: 'An indoor sports court with adequate clearance and suitable flooring.',
    preparation:
      'Choose a class that accepts complete beginners. Confirm racket and shuttle provision, footwear and any movement adaptations rather than assuming an open club night includes instruction.',
    steps: [
      {
        title: 'Learn a relaxed grip',
        body: 'Ask the coach to check the borrowed racket and demonstrate a basic grip. Practise short controlled contact before attempting long overhead shots. Leave enough space between pairs and keep spare shuttles away from the playing area.',
      },
      {
        title: 'Practise a simple exchange',
        body: 'Use the coach’s short-distance feed and try a comfortable return. Recover your position without chasing every shuttle. Focus on one cue, such as contact point, instead of changing grip, swing and footwork all at once.',
      },
      {
        title: 'Try a cooperative rally',
        body: 'Agree with a partner to keep the shuttle playable rather than win the point. Pause when control or comfort fades and ask the coach to adjust the task. Record the useful cue and decide whether a beginner course appeals.',
      },
    ],
    completion:
      'You have tried the basic grip and return and helped maintain a short cooperative rally.',
    tip: 'Beginner instruction and a casual club match are different experiences; book the one that gives you room to learn.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['badminton-england-5f250542ec'],
        purpose:
          'See the beginner course’s taught skills as an example; its listed dates have passed, so find a current local session.',
      },
      {
        ...CATALOG_SOURCES['badminton-world-federation-hosted-by-96e25bfd22'],
        purpose:
          'See foundational grip, underarm hitting and cooperative-rally lesson concepts; a qualified local coach should adapt them to an adult beginner lesson.',
      },
    ],
  },
  'build-a-cooperative-table-tennis-rally': {
    title: 'Build a cooperative table-tennis rally: a practical starting plan',
    summary:
      'Build a shared table-tennis rally with a partner who is trying to keep the ball playable too.',
    time: 'A relaxed short session with repeated pauses.',
    cost: 'Borrowed bats and a public table or low court fee.',
    place: 'A suitable table with clear space and comfortable access on both sides.',
    preparation:
      'Choose a social beginner setting or an experienced cooperative partner. Check the table’s stability, surrounding space and any seated-play arrangement before starting.',
    steps: [
      {
        title: 'Choose an easy setup',
        body: 'Use a comfortable bat and ask a coach or partner to show a basic grip. Clear the floor of spare balls. Start near the table without crowding its edges and agree a gentle pace for the first exchanges.',
      },
      {
        title: 'Give playable returns',
        body: 'Try sending the ball toward the middle of your partner’s side with little force. Count shared returns rather than individual points. Stop to collect balls safely rather than stepping abruptly into a neighboring game.',
      },
      {
        title: 'Change one small thing',
        body: 'Notice where rallies usually end and adjust a single feature, such as starting distance or feed speed. Try again, keeping the shared goal. Finish with a rally you both enjoyed and a cue to remember next time.',
      },
    ],
    completion:
      'You have sustained a cooperative rally and identified one adjustment that made returns easier for both players.',
    tip: 'A soft return that helps your partner is the skill for this session; competitive scoring can wait.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['matrix-table-tennis-club-19cc156b6f'],
        purpose:
          'Use the club’s newcomer information to prepare for a beginner visit focused on a cooperative rally.',
      },
    ],
  },
  'play-a-short-adapted-disc-golf-round': {
    title: 'Play a short adapted disc-golf round: a practical starting plan',
    summary:
      'Explore disc golf with an adapted short layout and one comfortable throwing method agreed with a facilitator.',
    time: 'An introductory session or a short few-target round.',
    cost: 'Borrowed discs and a public course can keep the cost low.',
    place: 'A quiet legal course or marked practice area with suitable access.',
    preparation:
      'Ask a local club about adaptive play and inspect the route’s surfaces and distances. Choose reachable targets and a throwing method suited to your movement rather than assuming a full course is necessary.',
    steps: [
      {
        title: 'Learn the safe throw area',
        body: 'Have the facilitator explain when the path and landing zone are clear. Try a comfortable grip with a lightweight beginner disc. Keep everyone behind the thrower and wait for other park users before releasing.',
      },
      {
        title: 'Practise placement nearby',
        body: 'Aim for a short visible target and compare a few controlled throws. Use an agreed seated or standing position without forcing a standard stance. Adjust distance or target size so choosing direction remains an enjoyable challenge.',
      },
      {
        title: 'Play a short adapted round',
        body: 'Use the agreed tees and adaptations consistently, recording only the scoring the group wants. Stop before fatigue changes control. Afterwards, note the surfaces, distances and assistance that would make another visit workable.',
      },
    ],
    completion:
      'You have played a short adapted layout and learned a comfortable, controlled throw.',
    tip: 'Adaptive competition rules provide useful ideas, but a casual first round can be arranged around the actual players and site.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['professional-disc-golf-association-0d8f18609f'],
        purpose:
          'Review the adaptive-rules discussion with your facilitator when agreeing throwing positions, distances and a workable short round.',
      },
    ],
  },
  'try-fencing-in-a-supervised-beginner-class': {
    title: 'Try fencing in a supervised beginner class: a practical starting plan',
    summary:
      'Try fencing through a supervised beginner class that teaches equipment checks, distance and stop commands before partner work.',
    time: 'A taster class or first lesson of a beginner course.',
    cost: 'A paid class with appropriate loan kit confirmed beforehand.',
    place: 'A fencing club with qualified beginner coaching and a suitable training area.',
    preparation:
      'Ask about beginner instruction, weapon type, age requirements and adaptations. Confirm all required protective equipment is supplied and follow the club’s clothing instructions rather than assembling your own substitute kit.',
    steps: [
      {
        title: 'Learn the safety routine',
        body: 'Have the coach check and fit every required item. Learn the stop command and how to carry the practice weapon away from active drills. Keep masks and other protection in use whenever the coach’s activity requires them.',
      },
      {
        title: 'Practise controlled footwork',
        body: 'Start with the coach’s stance and movement exercises without rushing toward an opponent. Keep spacing predictable and stop when instructed. Ask for a smaller range or seated format if the standard movement does not suit you.',
      },
      {
        title: 'Try coached partner work',
        body: 'Take part only in the exercise the coach assigns, with the specified protection and supervision. Focus on distance and clear turns rather than winning touches. Finish by reviewing the equipment routine and one movement cue.',
      },
    ],
    completion:
      'You have completed a supervised beginner class and can follow its protection and stop-command routine.',
    tip: 'Borrow club equipment first; different fencing disciplines can require different kit, and fit matters.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['british-fencing-48c6a641cf'],
        purpose:
          'Read Fencing 101 before discussing beginner instruction, protective equipment and adaptations with a supervised club.',
      },
    ],
  },
  'learn-a-beginner-hula-hoop-sequence': {
    title: 'Learn a beginner hula-hoop sequence: a practical starting plan',
    summary:
      'Learn a few playful hoop movements with a suitable beginner hoop and choose a short sequence you enjoy repeating.',
    time: 'A short first lesson and a few brief practice sessions.',
    cost: 'Borrow a correctly sized hoop before buying one.',
    place: 'A clear level space with room beyond the hoop’s full reach.',
    preparation:
      'Use a beginner tutorial or teacher and ask about hoop size and comfortable alternatives. Start with an ordinary light practice hoop, without heavy weights or promises about changing body shape.',
    steps: [
      {
        title: 'Check the movement space',
        body: 'Remove obstacles and give other people plenty of clearance. Try holding and passing the hoop before spinning it. Choose hand-based moves if waist hooping is uncomfortable or if another position suits you better.',
      },
      {
        title: 'Practise one manageable move',
        body: 'Follow the teacher’s beginner demonstration slowly and stop to reset when the hoop drops. Avoid forcing painful repetition or speeding up to keep it airborne. A smooth hand pass can be a complete first skill.',
      },
      {
        title: 'Link a tiny sequence',
        body: 'Combine two or three comfortable actions and repeat them at your own pace. Record a short clip only if you want feedback on the movement. End with the hoop and tutorial stored together for an easy return.',
      },
    ],
    completion:
      'You have learned a short comfortable sequence and found a hoop size and movement style that suit you.',
    tip: 'A hoop that drops is giving feedback, not marking failure; try a simpler move or a different size before practising longer.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['hooplovers-0a784bf088'],
        purpose:
          'Browse the free hoop tutorials to choose a small set of beginner movements to learn and combine.',
      },
    ],
  },
};
