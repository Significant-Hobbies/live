/** Practical plans are written per activity, not generated from its category. */
export type ExperienceGuide = {
  title: string;
  summary: string;
  time: string;
  cost: string;
  place: string;
  preparation: string;
  steps: { title: string; body: string }[];
  completion: string;
  tip: string;
};

// Editorial revision date. Change this when this content is actually edited.
export const EXPERIENCE_CONTENT_UPDATED = '2026-10-02';

export const EXPERIENCE_GUIDES: Record<string, ExperienceGuide> = {
  'make-pasta-from-scratch': {
    title: 'Make pasta from scratch: a first-afternoon plan',
    summary:
      'Plan your first homemade pasta session: ingredients, equipment, time, shaping by hand, and a small meal to finish with.',
    time: 'Allow an afternoon for a first attempt, including resting the dough and cleaning up.',
    cost: 'Usually inexpensive if you already have flour, a work surface and a rolling pin. A pasta machine is optional.',
    place: 'A kitchen with a clear work surface, a hob and a large pot.',
    preparation:
      'Choose one beginner recipe that specifies quantities, resting time and cooking instructions. Read it through before buying ingredients. Start with one dough and one simple sauce; save filled pasta for another day.',
    steps: [
      {
        title: 'Prepare a small batch',
        body: 'Measure the ingredients from your chosen recipe and clear enough space to knead. Keep the recipe nearby rather than guessing the flour-to-liquid ratio. A small batch is easier to handle and gives you room to make mistakes.',
      },
      {
        title: 'Roll and cut by hand',
        body: 'Rest the dough as directed, then work with one portion at a time. Use a rolling pin and cut ribbons, or pick a hand-shaped pasta the recipe explains. Cover the dough you are not using so it does not dry out.',
      },
      {
        title: 'Cook a test piece, then eat',
        body: 'Follow the recipe’s cooking instructions and taste a test piece before cooking the rest. Toss the pasta with your simple sauce. Note whether the dough was easy to roll and whether you would cut it thicker or thinner next time.',
      },
    ],
    completion:
      'You have made a batch of pasta yourself and served a meal with it. It does not need to look like a restaurant plate.',
    tip: 'Borrow a rolling pin before buying specialist equipment. Photograph the uncooked shapes too: the process is part of what you did.',
  },
  'create-a-family-cookbook-with-old-recipes': {
    title: 'Create a family cookbook: collect, cook and preserve',
    summary:
      'Turn family recipes into a small cookbook with ingredient notes, stories, test meals and a format relatives can keep.',
    time: 'Several short conversations and cooking sessions over a few weeks.',
    cost: 'A shared document can be free; ingredients, printing and binding are optional costs.',
    place: 'At home, with relatives in person or over a call.',
    preparation:
      'Start with five recipes rather than every dish anyone remembers. Ask the people who cook them whether you may include their names, photographs and stories. Decide who the first copy is for.',
    steps: [
      {
        title: 'Capture the unwritten parts',
        body: 'Ask a relative to describe or demonstrate one dish. Write down the pan size, approximate servings and what “until it looks right” means. Record substitutions and the occasions when the family made it, not just a list of ingredients.',
      },
      {
        title: 'Cook from your own notes',
        body: 'Make the dish using only the draft recipe. Mark every point where you have to ask another question. Check those gaps with its original cook; keep different family versions when neither is the single correct one.',
      },
      {
        title: 'Give the recipes a home',
        body: 'Use a simple document with one recipe per section, a contents page and the contributor’s name. Add a short story beside each dish. Share a draft for corrections before printing or sending the finished file.',
      },
    ],
    completion:
      'A small, readable cookbook exists and its contributors have a copy. Five usable recipes are a better first edition than fifty incomplete ones.',
    tip: 'Preserve the original wording alongside your clarified measurements. “Grandma’s blue mug” can be a memory even when a future cook needs a quantity.',
  },
  'master-one-dish-so-well-you-could-teach-it': {
    title: 'Master one dish: repeat it until you can teach it',
    summary:
      'Choose a signature dish, improve it through repeated attempts, and test your recipe by teaching someone else to cook it.',
    time: 'One cooking session per attempt; plan several attempts rather than a single perfect evening.',
    cost: 'Depends on the dish. Choose ingredients you can afford to buy repeatedly.',
    place: 'Your usual kitchen, using equipment you already know.',
    preparation:
      'Choose a dish you enjoy enough to eat again. Pick a reliable starting recipe and a clear target: balanced seasoning, a particular texture, or being able to serve it without a last-minute scramble.',
    steps: [
      {
        title: 'Make a baseline',
        body: 'Cook the recipe as written once. Record the quantities, equipment, timing and result. Take a photograph and write down one thing you liked and one thing you want to change while the meal is still fresh in your mind.',
      },
      {
        title: 'Change one thing at a time',
        body: 'Repeat the dish with a single deliberate adjustment. Keep the other ingredients and equipment consistent so you can tell what helped. Build a short checklist for the parts you usually forget, including preparation before the hob goes on.',
      },
      {
        title: 'Let someone else lead',
        body: 'Give a friend your recipe and talk them through it. Notice where your instructions rely on knowledge you have not written down. Revise the recipe so another person can make the dish without you taking over.',
      },
    ],
    completion:
      'You can make a version you are happy to serve and explain the process clearly enough for someone else to follow.',
    tip: 'A familiar weeknight meal is a good candidate. Complexity is not the achievement; being able to repeat and share it is.',
  },
  'take-a-pottery-class-and-make-a-finished-piece': {
    title: 'Take a pottery class and bring home a finished piece',
    summary:
      'Choose a beginner pottery class, check firing and collection arrangements, and plan how to finish your first ceramic piece.',
    time: 'A class session, then a later collection date; some courses require separate glazing sessions.',
    cost: 'A paid class. Compare the full fee, including clay, glazing, firing and collection or postage.',
    place: 'A local ceramics studio or community arts workshop.',
    preparation:
      'Look for a beginner class that explicitly includes a finished piece. Ask whether it is hand-building or wheel throwing, how many sessions are needed, and whether firing and glazing are included. Check access and class size if those affect your choice.',
    steps: [
      {
        title: 'Book the whole process',
        body: 'Before paying, confirm what you will make and how you will receive it. A taster that ends with wet clay is different from a class that fires your work. Put both the class and the expected collection date on your calendar.',
      },
      {
        title: 'Make one manageable object',
        body: 'Follow the tutor’s guidance on size and shape. A small bowl, tile or pinch pot gives you a concrete first project. Ask how to mark your piece so the studio can identify it after firing.',
      },
      {
        title: 'Finish and collect it',
        body: 'Complete the studio’s glazing process and wait for its collection message. Keep a photograph of the piece before firing and after collection. If you want to use it for food, ask the studio whether that specific clay and glaze combination is suitable.',
      },
    ],
    completion:
      'You have collected a fired, finished piece you made. The firing wait is part of the plan, even if the making takes only an afternoon.',
    tip: 'Hand-building and wheel throwing are different experiences. Choose the technique you actually want to try, rather than the cheapest class title.',
  },
  'learn-watercolour-painting': {
    title: 'Learn watercolour painting with a small first project',
    summary:
      'Start watercolour painting with a minimal kit, simple wash exercises and a finished postcard-sized painting.',
    time: 'A first afternoon, followed by a few short practice sessions.',
    cost: 'A small beginner set, one brush and watercolour paper; borrow supplies before buying a large kit.',
    place: 'A table with good light and space for water jars.',
    preparation:
      'Use paper intended for watercolour rather than ordinary printer paper. Choose a simple subject such as a leaf or a mug. Limit yourself to a few colours so mixing and water control get your attention.',
    steps: [
      {
        title: 'Make a page of tests',
        body: 'Paint a strip with plenty of water, another with less, and a few colour mixes. Let them dry before judging the result. Label the tests so you can connect the dried colour with what you did at the brush.',
      },
      {
        title: 'Paint something small',
        body: 'Sketch a simple outline on a postcard-sized sheet. Work from light washes towards a few darker details, allowing layers to dry when needed. Keep the subject simple enough that you can finish it in the same session.',
      },
      {
        title: 'Repeat the subject',
        body: 'Paint the same object again on another day. Compare the two pieces and choose one specific improvement, such as less water in a shadow or fewer outlines. Date both instead of throwing the first attempt away.',
      },
    ],
    completion:
      'You have finished a small painting and repeated enough basic exercises to understand how your paint, brush and paper behave together.',
    tip: 'A limited kit gives you fewer variables. Save new colours and expensive brushes until you know what your current materials cannot do.',
  },
  'paint-something-you-re-proud-to-hang-on-a-wall': {
    title: 'Paint something for your wall: finish one personal piece',
    summary:
      'Plan a painting for your own wall, choose a manageable subject and medium, and finish it without chasing perfection.',
    time: 'A few sessions, with drying time depending on the medium.',
    cost: 'Materials and an optional frame. A small paper-based painting keeps the initial spend lower.',
    place: 'A ventilated workspace suitable for your chosen materials.',
    preparation:
      'Choose the wall first and decide roughly how large the piece should be. Pick a subject that means something to you: a view, an object or a colour arrangement. Use materials according to their instructions and keep the first piece modest in size.',
    steps: [
      {
        title: 'Try the composition on scrap paper',
        body: 'Make three tiny sketches of the same idea. Look at them from across the room and choose the one whose arrangement is clearest. Decide what will be the focal point before working on fine detail.',
      },
      {
        title: 'Work towards a stopping point',
        body: 'Block in the main shapes, then add only the details that support your focal point. Take a photograph between sessions to spot changes. Define a finish date so the painting does not become an indefinitely unfinished project.',
      },
      {
        title: 'Put it on the wall',
        body: 'Let the work dry or cure according to the materials you used. Mount or frame it appropriately, then live with it for a few days. Write down what made you choose that subject and what you enjoyed about making it.',
      },
    ],
    completion:
      'A piece you made is hanging in a place you chose. Being proud of the effort and meaning is enough; outside approval is optional.',
    tip: 'A small painting in a simple frame often makes a better first project than a large canvas that needs weeks of uninterrupted time.',
  },
  'learn-calligraphy': {
    title: 'Learn calligraphy: from basic strokes to a finished note',
    summary:
      'Choose one calligraphy style, practise its basic strokes, and use them in a short handwritten card or phrase.',
    time: 'Short practice sessions over several days, plus time for one finished card.',
    cost: 'A beginner pen and suitable paper, or supplies you can borrow from a class.',
    place: 'A desk where you can sit comfortably and turn the paper.',
    preparation:
      'Choose one style and one tool. Brush lettering and pointed-pen scripts have different techniques, so do not mix tutorials at the start. Find an alphabet and stroke exercise that match the tool you have.',
    steps: [
      {
        title: 'Practise the strokes, not your name',
        body: 'Begin with the basic lines and shapes from your chosen exercise. Use guidelines and leave space between attempts. Keep a dated page so you can see how consistency changes instead of judging every stroke in isolation.',
      },
      {
        title: 'Build a short phrase',
        body: 'Choose a few words and practise their letters separately before joining them. Check spacing as well as letter shapes. Write the phrase several times on practice paper before using your final sheet.',
      },
      {
        title: 'Make something to keep or give',
        body: 'Letter a card, a small quotation or a label. Pencil in a light guide if useful and leave generous margins. Keep one early practice page beside the finished piece to show what you learned.',
      },
    ],
    completion:
      'You can write a short phrase in one consistent style and have used it in a finished piece.',
    tip: 'Start with larger letters. Tiny envelopes and elaborate flourishes can wait until the basic strokes feel familiar.',
  },
  'learn-to-draw-portraits': {
    title: 'Learn to draw portraits: a first sketch and a useful repeat',
    summary:
      'Start portrait drawing with one reference, simple proportions and repeated sketches that help you see your progress.',
    time: 'An initial sketch session and several shorter studies.',
    cost: 'Paper, a pencil and an eraser are enough to begin.',
    place: 'A well-lit table; use a consenting sitter or a photograph you may use.',
    preparation:
      'Pick one clear reference with a straightforward angle. Work from a photograph you took or have permission to use. Set aside a page for a rough study so the first drawing does not have to become the finished portrait.',
    steps: [
      {
        title: 'Place the large shapes',
        body: 'Sketch the head shape and the relative positions of the eyes, nose and mouth lightly. Compare distances in the reference rather than drawing symbols for individual features. Step back before adding texture or eyelashes.',
      },
      {
        title: 'Use a few values',
        body: 'Look for the biggest light and shadow areas. Shade those simply, keeping the lightest areas of the paper clear. If the drawing stops resembling the reference, revisit the large proportions before adding more detail.',
      },
      {
        title: 'Draw the same person again',
        body: 'Date the first study, then make another using the same reference. Choose one thing to improve, such as the angle of the jaw or the space between features. Keep both drawings so you can compare them fairly.',
      },
    ],
    completion:
      'You have made a portrait study, identified a specific improvement and applied it in a second drawing.',
    tip: 'A likeness is a useful challenge, not a test of whether you are an artist. Repeating one reference makes progress easier to notice.',
  },
  'take-a-photograph-that-stops-people-in-their-tracks': {
    title: 'Make a memorable photograph with the camera you have',
    summary:
      'Plan a small photography outing around light, subject and composition, then choose and finish one memorable image.',
    time: 'An outing or an afternoon at home, followed by an editing session.',
    cost: 'No new equipment required if you already have a phone camera.',
    place: 'Somewhere familiar where you can wait, observe and photograph respectfully.',
    preparation:
      'Choose one subject rather than trying to photograph everything: window light on an object, a familiar street, or a consenting person. Decide what you want the image to make someone notice. Check any photography restrictions at your location.',
    steps: [
      {
        title: 'Watch before shooting',
        body: 'Notice where the light comes from and what is happening behind your subject. Move yourself to simplify the background. Make several frames from different distances rather than relying on one hurried photograph.',
      },
      {
        title: 'Choose one image',
        body: 'Review your photographs at a comfortable size and narrow them to three. Ask what each frame communicates without a caption. Choose one whose subject and composition support the feeling you wanted, even if it is not technically flawless.',
      },
      {
        title: 'Finish and show it',
        body: 'Make restrained adjustments to crop and brightness using an editor you already have. Keep the original file. Print or share the chosen image with a short note about what you noticed, with permission if an identifiable person is the subject.',
      },
    ],
    completion:
      'You have deliberately made and selected one photograph you want someone else to pause over. Their reaction is welcome, but not something you can guarantee.',
    tip: 'Return to a familiar place at a different time of day. A changed light can offer more than buying a new lens.',
  },
  'create-a-short-film': {
    title: 'Create a short film: one scene, one finished cut',
    summary:
      'Make a small first film with a phone, a short shot list, manageable sound and a finished edit you can share.',
    time: 'A planning session, a filming session and an editing session; a weekend is a workable starting window.',
    cost: 'Can use a phone and an editor you already own. Props, travel and paid software are optional.',
    place: 'One location where you have permission to film.',
    preparation:
      'Write a story you can tell in one to three minutes at one location. Keep the cast and props small. Ask everyone involved whether they agree to recording and to the way you plan to share the result.',
    steps: [
      {
        title: 'Write a shot list',
        body: 'Describe the beginning, change and ending in a few sentences. List the shots that make those moments understandable. Include a close-up and a wider view, and decide whether you need dialogue or can tell the story visually.',
      },
      {
        title: 'Test sound, then film',
        body: 'Record and play back a short test before filming everything. Move away from distracting noise or use a simpler scene if the dialogue is hard to hear. Record a few extra seconds at the start and end of each shot for editing.',
      },
      {
        title: 'Finish a short cut',
        body: 'Put the shots in order and remove anything the story does not need. Use music and other material you have rights to use. Export a file, watch it all the way through, and ask one viewer what they understood before revising.',
      },
    ],
    completion:
      'A complete film has a beginning and an ending, plays correctly as an exported file, and has been watched by someone besides its maker.',
    tip: 'A tiny finished film teaches the whole process. Save a larger cast and several locations for a project after this one.',
  },
  'co-write-something-with-a-friend': {
    title: 'Co-write something with a friend and finish a shared draft',
    summary:
      'Choose a small collaborative writing project, agree how to work together, and turn two voices into one finished draft.',
    time: 'One shared session plus a later editing pass.',
    cost: 'Free using paper or a shared document you already have.',
    place: 'Together at a table or remotely in a shared document.',
    preparation:
      'Choose a short form: a poem, a scene, a letter or a small essay. Agree who it is for, how long it should be, and whether it will stay private. Set a finish date and decide how you will credit both contributors.',
    steps: [
      {
        title: 'Agree on the starting idea',
        body: 'Each bring two possible subjects and choose one together. Write a one-sentence intention for the piece. Decide whether you will alternate sections, write simultaneously, or have one person draft while the other asks questions.',
      },
      {
        title: 'Draft without correcting every line',
        body: 'Make space for both voices before polishing. If you disagree about a sentence, keep both versions temporarily rather than stopping the session. Use comments to explain what you mean instead of silently replacing your friend’s contribution.',
      },
      {
        title: 'Read it aloud together',
        body: 'Listen for repetition and places where the voice changes unintentionally. Agree on the final edits, save a dated copy, and confirm consent before sharing it. Name one thing each person brought that would not have appeared in a solo draft.',
      },
    ],
    completion:
      'You have a complete draft both people are comfortable calling a shared piece. Publication is optional.',
    tip: 'Agree on permission and credit early. A friendship project should not turn into an unexpected public submission.',
  },
  'write-and-perform-spoken-word-poetry': {
    title: 'Write and perform spoken word: prepare your first piece',
    summary:
      'Write a short spoken-word piece, rehearse it aloud and choose a first audience or suitable open mic.',
    time: 'Several writing and rehearsal sessions, plus the performance.',
    cost: 'Can be free with friends; venues may charge entry or require advance booking.',
    place: 'A small audience at home, a community group or an open mic.',
    preparation:
      'Pick one experience, question or image you want to explore. Choose a short target length you can rehearse without rushing. If you want an open mic, check its booking process, time limit and content rules before writing around an assumed slot.',
    steps: [
      {
        title: 'Write for the ear',
        body: 'Draft in words you would actually say. Read each section aloud and mark where you naturally pause. Remove lines you cannot deliver clearly, even if they look impressive on the page.',
      },
      {
        title: 'Rehearse with a timer',
        body: 'Record a practice version and listen for pace, breathing and unclear words. Leave room for pauses rather than filling every available second. Keep a printed or accessible digital copy if memorising would prevent you from performing.',
      },
      {
        title: 'Perform for a real audience',
        body: 'Start with a few willing listeners or a booked open-mic slot. Tell them if you want feedback and what kind. Afterwards, note one moment that connected and one part you would change before a second performance.',
      },
    ],
    completion:
      'You have written an original piece and delivered it aloud to an audience. Applause and competition results are not the measure.',
    tip: 'You can choose a supportive small audience first. Performing does not require sharing the most private thing you have ever experienced.',
  },
  'write-a-letter-to-someone-who-changed-your-life-and-send-it': {
    title: 'Write and send a letter to someone who changed your life',
    summary:
      'Choose a specific memory, write a heartfelt letter, and send it with realistic expectations about receiving a reply.',
    time: 'One quiet writing session and a later reread before sending.',
    cost: 'Free by email; paper, an envelope and postage for a physical letter.',
    place: 'Anywhere you can write without interruption.',
    preparation:
      'Choose someone you can appropriately contact and one particular thing they did that mattered. Find a current address through a channel you are entitled to use. A letter of thanks should not require them to respond or reopen a difficult relationship.',
    steps: [
      {
        title: 'Describe the moment',
        body: 'Write what happened, what you noticed then and what you understand now. Use concrete details so the person can recognise the memory. A few honest paragraphs can say more than a long account of your whole life.',
      },
      {
        title: 'Say what changed',
        body: 'Explain the effect on you without making the recipient responsible for your future. Read the draft once for clarity and once for anything you do not want to disclose. Remove any expectation of a particular response.',
      },
      {
        title: 'Send it deliberately',
        body: 'Choose email or post, check the address and send the finished version. Keep a copy if you want one. Record when you sent it rather than leaving the item open until an answer arrives.',
      },
    ],
    completion:
      'The letter has been sent through an appropriate channel. A reply is outside your control and is not required to mark this done.',
    tip: 'You can begin with an ordinary teacher, friend or relative. The most meaningful recipient need not be famous or far away.',
  },
  'reconnect-with-someone-you-ve-lost-touch-with': {
    title: 'Reconnect with an old friend through one thoughtful message',
    summary:
      'Reach out to someone you have lost touch with, suggest an easy way to catch up, and leave room for their response.',
    time: 'A short message, then a call or meeting if you both want one.',
    cost: 'A message or call can be free; travel and meeting costs depend on what you choose.',
    place: 'Online, by phone or somewhere convenient for both people.',
    preparation:
      'Choose someone with whom contact would be welcome, rather than someone who has asked for distance. Think of a genuine shared memory. Decide whether a brief call, a walk or exchanging messages would be the easiest first step.',
    steps: [
      {
        title: 'Send a small, specific invitation',
        body: 'Mention what reminded you of them and ask how they are. Keep the first message brief. Offer an easy option such as a short call, with room for them to decline or suggest something else.',
      },
      {
        title: 'Make a plan together',
        body: 'If they reply positively, offer a couple of possible times rather than a vague “sometime”. Pick a location or format that suits both lives now. You do not have to recreate the friendship exactly as it used to be.',
      },
      {
        title: 'Listen to their present life',
        body: 'Catch up without turning the whole conversation into nostalgia. Ask what matters to them now and share something of your own life. If you enjoyed it, suggest a simple next contact rather than promising to stay in touch forever.',
      },
    ],
    completion:
      'You have made a considerate attempt to reconnect; a mutual conversation is a welcome next step. Respect silence or a declined invitation.',
    tip: 'Avoid repeated follow-ups. Reaching out is your part of the goal; the other person gets to choose theirs.',
  },
  'record-your-parents-life-stories': {
    title: 'Record your parents’ life stories with a first conversation',
    summary:
      'Prepare a small set of life-story questions, record with permission, and preserve a conversation your family can find later.',
    time: 'A 30–60 minute first conversation, plus time to label and back up the recording.',
    cost: 'A phone or recorder you already have can be enough.',
    place: 'A quiet, comfortable room, or a call using a recording method everyone agrees to.',
    preparation:
      'Ask whether your parent wants to be recorded and who may hear the result. Choose one period of their life, not every possible question. Test your device and agree that they can skip questions or ask you to stop.',
    steps: [
      {
        title: 'Start with concrete memories',
        body: 'Ask about a childhood home, a first job or a person they remember clearly. Use follow-up questions about places, sounds and ordinary routines. Let the conversation wander when an unexpected memory matters more than your prepared list.',
      },
      {
        title: 'Record, then check the file',
        body: 'Make a short test and play it back before the full conversation. Keep the device close enough for clear speech and avoid interrupting every pause. Afterward, confirm the complete file plays and ask if anything should remain private.',
      },
      {
        title: 'Make it findable',
        body: 'Name the file with the person, date and main topic. Store a second copy separately and write a short contents note with important names spelled correctly. Share only with the people your parent agreed to include.',
      },
    ],
    completion:
      'At least one recorded conversation is playable, labelled, backed up and kept under the sharing agreement you made together.',
    tip: 'A few good questions and attentive listening beat an exhaustive interview. More conversations can follow at their pace.',
  },
  'create-a-photo-book-of-one-year-of-your-life': {
    title: 'Make a photo book of one year, including the ordinary days',
    summary:
      'Choose a year, gather meaningful photographs and turn them into a chronological photo book you can keep or share privately.',
    time: 'Several sorting and layout sessions; printing adds the provider’s production and delivery time.',
    cost: 'A digital book can use tools you already have. Printing, binding and delivery vary by provider.',
    place: 'At home with access to your photographs and a backup.',
    preparation:
      'Choose a completed year so you can finish now, or decide to collect photographs for the coming year. Gather images from devices and albums without moving your only originals. Ask permission before sharing other people’s private photographs.',
    steps: [
      {
        title: 'Select by month',
        body: 'Make twelve folders or sections and choose a manageable number of images for each. Include workdays, meals and familiar places alongside celebrations. If a month has few photographs, a short written memory is better than inventing a complete record.',
      },
      {
        title: 'Add names and small details',
        body: 'Write captions while you still remember who was there and why the day mattered. Keep dates approximate when you are unsure. Use a simple repeating layout so the photographs carry the story.',
      },
      {
        title: 'Proof the whole book',
        body: 'Read every caption and check cropping before exporting or ordering a print. Save the final file and a second copy. If printing, check the provider’s preview, paper choices and full delivered price before paying.',
      },
    ],
    completion:
      'A finished digital or printed book tells the story of a chosen year. It can be private and does not need a photograph from every week.',
    tip: 'Do not let the perfect selection stall the book. A modest first edition can preserve far more than another unsorted folder.',
  },
  'write-a-letter-to-your-future-self-and-read-it-in-10-years': {
    title: 'Write a letter to your future self and preserve it for ten years',
    summary:
      'Capture your present life in a letter, choose a reliable place to keep it, and plan a ten-year opening date.',
    time: 'One writing session now; the full goal also includes opening it ten years later.',
    cost: 'Paper and an envelope, or a private file stored with your existing documents.',
    place: 'A quiet place to write, with storage you expect to be able to find again.',
    preparation:
      'Write today’s date and the intended opening date first. Decide whether a physical letter or a private digital copy is more likely to survive changes of home, devices and accounts. Avoid storing passwords or financial access details in the letter.',
    steps: [
      {
        title: 'Describe an ordinary day',
        body: 'Write where you live, who you spend time with and what occupies your attention. Include small details that would be easy to forget: a favourite meal, a current worry, or what your room looks like.',
      },
      {
        title: 'Ask questions rather than predict everything',
        body: 'Tell your future self what you hope to try and what you are unsure about. Ask what changed and what stayed important. Leave room for a life that develops differently from the one you currently imagine.',
      },
      {
        title: 'Seal it and make it findable',
        body: 'Mark the opening date clearly. Store it with documents you keep deliberately and add a calendar reminder that names the storage location. For a digital letter, keep a second copy in a place you control.',
      },
    ],
    completion:
      'Writing and storing the letter is the first milestone. Mark the whole item fulfilled when you open and read it on your chosen future date.',
    tip: 'Review the reminder when changing calendars or moving house. A ten-year plan needs a way to survive ordinary admin changes.',
  },
  'write-a-letter-to-your-younger-self': {
    title: 'Write to your younger self through one remembered moment',
    summary:
      'Choose a past version of yourself and write a private letter that names what you know now without forcing a happy ending.',
    time: 'A quiet 30–60 minute session, with a later reread if you want one.',
    cost: 'Free with paper or a private document.',
    place: 'Somewhere you can write without having to explain the result to anyone.',
    preparation:
      'Choose an age or a particular moment rather than addressing your whole past. A photograph, old address or song can help you remember the ordinary details. You can choose a manageable memory and stop whenever you want.',
    steps: [
      {
        title: 'Begin where you were',
        body: 'Describe what that younger person knew and what they could not yet know. Use the voice you would use with someone you care about. Try to recognise their circumstances before giving advice from the present.',
      },
      {
        title: 'Say what you want them to hear',
        body: 'Write what changed, what you appreciate about them and what you would handle differently now. You do not need to forgive everything or explain every event. Specific observations are more useful than a page of general encouragement.',
      },
      {
        title: 'Choose what to keep',
        body: 'Read the letter once and underline one sentence you want to remember. Date it and decide whether to keep, revise or discard it. If you keep it, store it privately rather than feeling obliged to publish the exercise.',
      },
    ],
    completion:
      'You have written a complete letter to a particular past self and chosen what to do with it. Feeling transformed is not a requirement.',
    tip: 'There is no audience to impress. A short, honest letter is enough, and the exercise does not have to cover difficult memories.',
  },
  'make-a-list-of-100-things-you-are-grateful-for': {
    title: 'List 100 things you are grateful for, with specific details',
    summary:
      'Build a personal list of 100 things you appreciate by looking at people, places, ordinary routines and remembered moments.',
    time: 'One longer session or a few shorter sessions until you reach 100.',
    cost: 'Free with a notebook or private document.',
    place: 'Anywhere you have space to think; a familiar walk can help you notice details.',
    preparation:
      'Number a page from one to 100, or start a numbered document. This is a single list, not a daily tracking commitment. Give yourself permission to include small things and to have a difficult day at the same time.',
    steps: [
      {
        title: 'Begin with what is close',
        body: 'Name people, objects, places and moments you appreciate. Be specific enough that an entry brings something to mind: a friend’s lift home, the shade on your street, or a meal someone taught you to make.',
      },
      {
        title: 'Look across different parts of life',
        body: 'When you stall, consider childhood, work, learning, home and ordinary pleasures. Review old photographs or messages if you want prompts. Avoid filling the remaining spaces with near-duplicates simply to make the number.',
      },
      {
        title: 'Finish and reread',
        body: 'Return for another session if needed. Read the completed list and circle a few entries you could appreciate more deliberately this week. Keep the list private or share individual thanks with the people involved.',
      },
    ],
    completion:
      'Your list has 100 distinct entries that mean something to you. There is no requirement to maintain a streak or feel positive all the time.',
    tip: '“A cup of tea” can count if it is yours and it matters. The number is a prompt for attention, not a competition.',
  },
  'create-a-personal-annual-report': {
    title: 'Create a personal annual report you will want to reread',
    summary:
      'Review a year through evidence, memories and lessons, then make a short personal report with a few choices for the year ahead.',
    time: 'An afternoon to gather material and write a first version.',
    cost: 'Free with your existing calendar, photographs and a document or notebook.',
    place: 'A quiet table with access to the records you want to review.',
    preparation:
      'Choose a clear start and end date. Gather a calendar, photographs and any notes you already have. You do not need dashboards, perfect records or a rating for every part of life. Decide whether the report will stay private.',
    steps: [
      {
        title: 'Reconstruct the year',
        body: 'Walk through the months and note a few events, ordinary changes and things you actually completed. Separate what the records show from what you vaguely remember. Include responsibilities and rest alongside achievements.',
      },
      {
        title: 'Write what the year taught you',
        body: 'Choose a few things that went well, things that were hard and things you would repeat differently. Explain why they mattered instead of assigning scores. Acknowledge circumstances you did not choose or control.',
      },
      {
        title: 'Choose a small next chapter',
        body: 'Finish with a few things you want to make room for, one thing to stop and one thing to preserve. Save the report with the year in its name. Set an optional date to revisit those choices without building another tracking system.',
      },
    ],
    completion:
      'A dated report captures the year in your own words and ends with a manageable set of choices for what comes next.',
    tip: 'Two useful pages can be enough. The report is for perspective, not proof that your year was productive.',
  },
  'make-a-timeline-of-the-five-most-important-moments-of-your-life': {
    title: 'Make a five-moment life timeline and explain what changed',
    summary:
      'Choose five moments that shaped your life, put them in order and write why each one mattered to you.',
    time: 'A quiet hour, with time to ask a relative about dates if you want to.',
    cost: 'Free using paper or a private document.',
    place: 'Anywhere you can spread out a page or work comfortably on a screen.',
    preparation:
      'Write down more than five possible moments before choosing. They can be gradual changes represented by a particular day, not only dramatic milestones. Use approximate years if precise dates would distract from the exercise.',
    steps: [
      {
        title: 'Choose by impact',
        body: 'Ask which events changed your direction, relationships or understanding of yourself. Include quiet turning points if they mattered more than public achievements. There is no required balance between happy and difficult moments.',
      },
      {
        title: 'Put them in sequence',
        body: 'Draw a line and place the five moments in order. Write a few sentences under each: what happened, what came before and what changed after. Distinguish your memory from details another person has told you.',
      },
      {
        title: 'Look for connections',
        body: 'Read across the timeline and notice a theme, surprise or unanswered question. Add a short note about what the sequence helps you understand now. Decide whether it stays private or becomes the start of a conversation.',
      },
    ],
    completion:
      'Five moments appear in order, with an explanation of why each matters. The timeline can change as you understand your life differently.',
    tip: 'Do not choose only what would look impressive in a biography. This is your map, and an ordinary move or conversation may belong on it.',
  },
  'spend-a-full-day-with-no-screens': {
    title: 'Plan a screen-free day that fits your real life',
    summary:
      'Prepare for one day without screens by arranging essential contact, offline activities and a realistic start and end time.',
    time: 'One full day, plus a short preparation session.',
    cost: 'Can be free at home or nearby; outings may add travel or entry costs.',
    place: 'At home, outdoors or visiting people, depending on your responsibilities.',
    preparation:
      'Choose a day when essential work or care does not depend on a screen. Tell anyone who needs to reach you how to do so. Accessibility, medical and safety needs take priority; define any necessary exception before you start.',
    steps: [
      {
        title: 'Prepare the offline basics',
        body: 'Write down addresses, plans and important phone numbers. Downloading something still leaves you using a screen, so choose paper directions, printed tickets or an alternative where practical. Arrange meals and transport without creating extra work for someone else.',
      },
      {
        title: 'Give the day a little shape',
        body: 'Choose a few screen-free options: cooking, reading a paper book, a walk, making something or seeing a friend. Leave unplanned space too. Put optional devices away so you do not have to make the same decision every few minutes.',
      },
      {
        title: 'Close the day with a note',
        body: 'At your agreed end time, write what you did and when you most wanted to reach for a device. Note what helped and what was inconvenient. Decide whether there is one small part you want to repeat, without making a daily rule.',
      },
    ],
    completion:
      'You have lived the agreed day without optional screens, keeping any necessary exceptions you defined. Record what happened honestly rather than restarting over a technicality.',
    tip: 'A screen-free day is an experiment, not a claim about health or willpower. Choose circumstances that let you enjoy it.',
  },
  'spend-an-afternoon-doing-one-thing-at-a-time': {
    title: 'Spend an afternoon doing one thing at a time',
    summary:
      'Choose an ordinary activity, remove competing tasks and spend one afternoon giving each thing your attention in turn.',
    time: 'One afternoon; choose your own start and finish.',
    cost: 'Free if you use an activity and materials you already have.',
    place: 'Somewhere your chosen activity can happen with fewer interruptions.',
    preparation:
      'Choose a real activity such as reading, cooking, drawing or working on a puzzle. Arrange essential responsibilities first. The point is one thing at a time, not staying motionless or finishing a large amount of work.',
    steps: [
      {
        title: 'Clear competing invitations',
        body: 'Close unrelated tabs and put optional notifications out of reach. Gather what the activity needs before starting. Keep a scrap of paper nearby for thoughts about other tasks so you do not have to act on them immediately.',
      },
      {
        title: 'Do the activity without a second layer',
        body: 'Try reading without checking messages, eating without scrolling, or making something without background content. When attention wanders, return to what you were doing. Take breaks deliberately and give those breaks their own attention.',
      },
      {
        title: 'Notice the difference',
        body: 'At the end, write a few lines about what became easier, harder or more noticeable. You can count a modest result: finishing a chapter, preparing a meal or simply spending the time as intended. Avoid turning the afternoon into another productivity score.',
      },
    ],
    completion:
      'You have spent an afternoon attempting one activity at a time and recorded what the experience was like.',
    tip: 'Choose something you want to be present for. The experience works better as curiosity than as punishment for being distracted.',
  },
  'memorise-a-long-poem-or-speech': {
    title: 'Memorise a poem or speech through small, connected sections',
    summary:
      'Choose a poem or speech you care about, learn it in sections and test recall by reciting it without the text.',
    time: 'Short sessions over days or weeks, depending on length and familiarity.',
    cost: 'Free with a text you already have lawful access to.',
    place: 'Somewhere you can read and speak aloud comfortably.',
    preparation:
      'Choose a text because you want its words with you, not just because it is long. Confirm the version you will learn and understand unfamiliar words. Decide whether the final recital will be private or for a willing listener.',
    steps: [
      {
        title: 'Understand the whole piece',
        body: 'Read it aloud and identify its turns of thought. Break it into small sections at meaningful boundaries. Write a brief cue for what each section is doing rather than treating the words as an unrelated sequence.',
      },
      {
        title: 'Learn and join the sections',
        body: 'Read a short section, cover it and try to say it back. Check against the original and correct omissions. As you add a section, practise the transition from the one before it so the joins do not become the weakest part.',
      },
      {
        title: 'Test the complete recital',
        body: 'Recite without looking, then check the original for missing or altered lines. Try starting from a few different points so one forgotten word does not end the whole attempt. Record a final version or recite to someone who wants to listen.',
      },
    ],
    completion:
      'You can recite the chosen text from memory with the accuracy you intended. Decide that standard before the final attempt.',
    tip: 'A shorter complete piece can be a useful rehearsal, but it does not replace the longer text if that is the goal you chose.',
  },
};
