import type { CuratedExperienceGuide } from '../types';
import { CATALOG_SOURCES } from '../sources';

export const FOOD_GUIDES: Record<string, CuratedExperienceGuide> = {
  'host-a-blind-apple-tasting': {
    title: 'Host a blind apple tasting',
    summary:
      'Compare several labelled apple varieties by texture, sweetness and aroma before revealing their names.',
    time: 'Allow half an hour for preparation and a relaxed tasting.',
    cost: 'Buy a few apples of different named varieties rather than large tasting portions.',
    place: 'A kitchen table with clean cutting tools, small plates and drinking water.',
    preparation:
      'Choose three varieties available locally and wash them. Check allergies and texture needs, cut manageable pieces shortly before tasting and keep the variety labels hidden until everyone has described their samples.',
    steps: [
      {
        title: 'Make a fair comparison',
        body: 'Give each variety a code and serve similar-sized pieces at the same temperature. Keep some uncut fruit aside so the group can inspect its appearance after the blind comparison.',
      },
      {
        title: 'Describe before ranking',
        body: 'Notice aroma, crispness, juiciness, sweetness and acidity in your own words. Let each person record an impression before discussing it, so one confident description does not become everyone’s answer.',
      },
      {
        title: 'Reveal and use the remainder',
        body: 'Match the codes with the varieties and compare preferences without declaring one objectively best. Eat or cook the remaining apples and note which you would choose for snacking or a particular dish.',
      },
    ],
    completion:
      'You have compared named apple varieties and can describe a difference beyond simply liking one more.',
    tip: 'A modest local market selection can be more interesting than an expensive imported assortment.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['slow-food-5064e28dd3'],
        purpose:
          'Use the sensory-education framework for comparing appearance, texture, aroma and taste in an original apple tasting.',
      },
    ],
  },
  'taste-chocolate-from-three-origins': {
    title: 'Taste chocolate from three origins',
    summary:
      'Compare plain chocolates with declared cacao origins and describe their differences without brand clues.',
    time: 'Plan a short tasting with pauses between small samples.',
    cost: 'Choose three small plain bars with traceable origin information rather than a gift hamper.',
    place: 'A quiet table away from strong cooking smells, with water and separate sample plates.',
    preparation:
      'Select chocolates with similar cacao percentages and no fillings, checking milk, nut and other allergens. Treat origin as one variable among processing, recipe and maker rather than assuming it explains every difference.',
    steps: [
      {
        title: 'Read the packaging first',
        body: 'Record the declared origin, cacao percentage and ingredients before hiding the brands. Notice whether a bar names a country, region or farm; these labels offer different levels of traceability.',
      },
      {
        title: 'Taste in small portions',
        body: 'Compare appearance, snap, aroma and how each piece melts. Use a few specific descriptors and pause with water between samples, keeping the discussion about your observations rather than guessing prestige or price.',
      },
      {
        title: 'Reveal the makers and reflect',
        body: 'Compare the labels with your notes and choose a favourite for a stated reason. Save the packaging details so you can find the chocolate again without treating your preference as a quality certification.',
      },
    ],
    completion:
      'You have compared three documented chocolates and kept a useful record of their differences.',
    tip: 'Similar cacao percentages make comparison easier, but a percentage alone does not guarantee the same flavour.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-914980383c'],
        purpose:
          'Explore the museum’s chocolate activities and sensory context before making your own small comparison.',
      },
    ],
  },
  'run-a-small-coffee-cupping': {
    title: 'Run a small coffee cupping',
    summary:
      'Compare freshly brewed coffees using a consistent ratio and a simple aroma-and-flavour sheet.',
    time: 'Set aside an hour, or join a roaster’s introductory public session.',
    cost: 'Use small amounts of two or three coffees; a guided session may charge a fee.',
    place:
      'A clean tasting table with hot-water safety, individual cups and a place for used spoons.',
    preparation:
      'Start with the Specialty Coffee Association’s beginner advice or a roaster-led cupping. Ask about caffeine preferences, use individual tasting vessels and choose a consistent preparation rather than attempting professional grading on your first day.',
    steps: [
      {
        title: 'Keep the preparation comparable',
        body: 'Label coffees with codes and record the beans and recipe used. Follow one current cupping method for all samples, letting a trained host manage the details if the setup is unfamiliar.',
      },
      {
        title: 'Notice changes as coffee cools',
        body: 'Smell before tasting and try small amounts at a comfortable temperature. Describe differences in aroma, acidity, body and finish without forcing specialist vocabulary or finishing every cup.',
      },
      {
        title: 'Connect observations with the beans',
        body: 'Reveal the coffees and compare everyone’s notes. Keep a short record of what you enjoyed and how it was brewed, then decide which coffee you would like to prepare again.',
      },
    ],
    completion:
      'You have compared coffees prepared consistently and can explain at least one sensory difference.',
    tip: 'A beginner session is for learning to notice; you do not need to assign a professional score.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['specialty-coffee-association-19edb8930e'],
        purpose:
          'Use the association’s current advice on introductory cupping and finding guided public sessions.',
      },
    ],
  },
  'compare-whole-spices-before-and-after-toasting': {
    title: 'Compare whole spices before and after toasting',
    summary:
      'Smell and taste small food-safe samples to discover how gentle heat changes familiar spices.',
    time: 'Allow a short kitchen session and time for hot spices to cool.',
    cost: 'Use tiny amounts from spices already in your pantry.',
    place: 'A ventilated kitchen with a dry pan, separate dishes and no competing strong aromas.',
    preparation:
      'Select two familiar edible whole spices and check a reliable cooking method for each. Avoid tasting unfamiliar plants or concentrated oils; use the comparison to explore cooking, with heat handled by someone comfortable at the hob.',
    steps: [
      {
        title: 'Set aside unheated samples',
        body: 'Label a small portion of each spice and smell it gently. Note its appearance and aroma without inhaling powders or putting whole hard spices into someone’s mouth as a challenge.',
      },
      {
        title: 'Toast a controlled portion',
        body: 'Follow a tested culinary method, working with one spice at a time and watching closely. Transfer it out of the hot pan promptly and let it cool before comparing aromas.',
      },
      {
        title: 'Use the contrast in food',
        body: 'Add suitable small samples to a plain cooked food according to its recipe. Compare the raw and toasted versions, then use the rest in a normal meal rather than leaving a row of strong tasting bowls.',
      },
    ],
    completion:
      'You have observed how controlled toasting changes two familiar spices and used them in food.',
    tip: 'Work in very small batches; a scorched sample tells you more about burning than about the spice.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['slow-food-5064e28dd3'],
        purpose:
          'Use its sensory comparison approach; obtain ingredient-specific toasting instructions from a tested recipe.',
      },
    ],
  },
  'build-a-seasonal-millet-thali': {
    title: 'Build a seasonal millet thali',
    summary:
      'Cook a small millet-centred plate with vegetables, dal and contrasting accompaniments.',
    time: 'Allow an afternoon to coordinate a small meal and its accompaniments.',
    cost: 'Millet, pulses and seasonal vegetables can make an inexpensive plate.',
    place: 'A home kitchen with enough pans to manage the chosen recipes comfortably.',
    preparation:
      'Choose one millet recipe from the Indian Institute of Millets Research collection. Add a familiar dal and seasonal vegetable rather than attempting many new preparations at once, and check the grain’s own cooking instructions.',
    steps: [
      {
        title: 'Plan contrasts and timing',
        body: 'Decide what will be soft, crisp, warm or cool on the plate. Write a short cooking order, keeping the unfamiliar millet preparation as the part that receives your main attention.',
      },
      {
        title: 'Cook a manageable quantity',
        body: 'Follow the grain recipe rather than treating every millet like rice. Prepare the accompaniments in ordinary household portions and taste for balance as they finish, keeping cooked food safely hot or refrigerated.',
      },
      {
        title: 'Serve and learn from the plate',
        body: 'Arrange the components together and notice which combinations work. Record the specific millet and method so you can repeat the result without claiming one plate represents every regional thali tradition.',
      },
    ],
    completion:
      'You have served a complete millet-centred meal with deliberately contrasting components.',
    tip: 'Use a grain sold with a clear name and preparation instructions; millet is a group of grains, not a single interchangeable ingredient.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['icar-indian-institute-of-millets-res-0f6d800f5e'],
        purpose: 'Choose an institute-published recipe and its actual grain preparation method.',
      },
    ],
  },
  'shape-a-batch-of-pitha-with-a-knowledgeable-cook': {
    title: 'Shape a batch of pitha with a knowledgeable cook',
    summary:
      'Learn one named regional pitha from someone who makes it and serve a small batch together.',
    time: 'Allow a cooking session long enough for preparation, shaping and eating together.',
    cost: 'A small rice-based batch is usually modest; pay a teacher if arranging a formal lesson.',
    place:
      'A kitchen with a knowledgeable cook and equipment suitable for the named regional pitha.',
    preparation:
      'Ask the cook to choose one pitha they know well and name its regional version. Confirm the ingredients and allergens, and agree whether you may write down or share their recipe and personal story.',
    steps: [
      {
        title: 'Learn the dough or batter cues',
        body: 'Watch the cook prepare a small quantity and explain what the texture should feel like. Note the rice preparation and filling rather than replacing the method with a generic dumpling recipe.',
      },
      {
        title: 'Shape beside the teacher',
        body: 'Try a few pieces while the cook checks thickness and closure. Keep the size consistent enough for the demonstrated cooking method, and let the teacher correct one technique before you make a whole tray.',
      },
      {
        title: 'Cook and share the batch',
        body: 'Follow the cook’s method for doneness and serve the pitha in its usual context. Record the name, variations and contributor’s permission alongside any recipe notes you keep.',
      },
    ],
    completion:
      'You have shaped, cooked and eaten one clearly named regional pitha with an experienced maker.',
    tip: 'Ask about the occasion associated with this version; pitha names and techniques vary widely across communities.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['bihar-tourism-ed35a5fdf9'],
        purpose: 'Learn the regional rice-and-lentil pitha context before a cook-led lesson.',
      },
    ],
  },
  'press-corn-tortillas-and-serve-them-warm': {
    title: 'Press corn tortillas and serve them warm',
    summary:
      'Use ready-to-cook masa harina to press and cook a small batch of tortillas for a shared meal.',
    time: 'Allow a cooking session for a small batch and a simple filling.',
    cost: 'Masa harina and ordinary kitchen tools keep the first attempt modest.',
    place: 'A kitchen with a stable pressing surface and a suitable hot griddle or pan.',
    preparation:
      'Use a tested masa-harina tortilla recipe and check the flour label. Ordinary cornflour or cornmeal is not an automatic substitute; prepare a simple filling so the fresh tortillas remain the focus.',
    steps: [
      {
        title: 'Make and test a small dough',
        body: 'Follow the recipe’s quantities and texture guidance. Cook one trial tortilla before pressing the full batch, noticing whether the dough cracks, sticks or transfers cleanly.',
      },
      {
        title: 'Press with a consistent method',
        body: 'Use the demonstrated liner and pressing technique, or the recipe’s alternative. Keep portions covered as directed and aim for similar thickness rather than chasing a perfectly round outline.',
      },
      {
        title: 'Cook and serve promptly',
        body: 'Follow the recipe’s heat and cooking cues, handling the hot pan carefully. Keep finished tortillas as the recipe advises and eat them warm with your prepared filling, noting one adjustment for next time.',
      },
    ],
    completion: 'You have pressed and cooked a small batch of corn tortillas from masa harina.',
    tip: 'A borrowed press is enough to test the craft before deciding whether it deserves cupboard space.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-recipe-by-pati-ji-cb94abac82'],
        purpose:
          'Use the original recipe for ingredients, pressing alternatives and cooking guidance.',
      },
    ],
  },
  'make-tofu-from-soy-milk': {
    title: 'Make tofu from soy milk',
    summary:
      'Follow a tested coagulant recipe to turn plain soy milk into a fresh, pressed block of tofu.',
    time: 'Allow a few hours including coagulation, draining and pressing.',
    cost: 'Plain soy milk, food-grade coagulant and a simple pressing setup are modest supplies.',
    place:
      'A clean kitchen with a suitable pot, food-safe straining cloth and stable draining area.',
    preparation:
      'Read a complete tested tofu recipe and use the soy milk and coagulant it specifies. Check additives and soy allergies; do not substitute cleaning chemicals or arbitrary acid quantities for food-grade ingredients.',
    steps: [
      {
        title: 'Prepare the setup before heating',
        body: 'Measure ingredients and arrange the lined mould or strainer. Confirm where hot liquid will drain and keep the recipe visible, since the coagulation stage is easier when you are not searching for equipment.',
      },
      {
        title: 'Watch the curds develop',
        body: 'Follow the recipe’s temperatures and mixing directions. Observe the separation without constantly stirring or improvising extra coagulant, and use the recipe’s troubleshooting if the milk fails to set.',
      },
      {
        title: 'Press and use the tofu',
        body: 'Drain and press as the recipe directs, then cool and store safely. Cook or serve the fresh block in an appropriate dish and note how pressing affected its texture.',
      },
    ],
    completion: 'You have made a fresh block of tofu and used or safely stored it.',
    tip: 'Choose one reliable soy milk for the first attempt; changing milk and coagulant together makes troubleshooting difficult.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['mary-s-test-kitchen-5e7f2ff2fa'],
        purpose:
          'Follow the original demonstrated recipe, milk-selection guidance and coagulation troubleshooting.',
      },
    ],
  },
  'fold-three-dumpling-shapes-from-one-filling': {
    title: 'Fold three dumpling shapes from one filling',
    summary:
      'Practice several closures using purchased wrappers and one cooked or vegetable filling.',
    time: 'Plan a sociable afternoon with enough time to cook the finished batch.',
    cost: 'Purchased wrappers and one filling keep costs and preparation manageable.',
    place:
      'A kitchen table with lightly protected trays and access to the chosen cooking equipment.',
    preparation:
      'Choose a tested dumpling recipe with vegetable or already cooked filling. Check wrapper size and allergens, keep filling chilled when not in use and learn closures suited to the recipe’s cooking method.',
    steps: [
      {
        title: 'Establish one reliable seal',
        body: 'Fill a few wrappers modestly and practice the simplest closure first. Keep unused wrappers covered so they do not dry out, and check the seam before adding decorative pleats.',
      },
      {
        title: 'Try two additional shapes',
        body: 'Use a demonstrated folding guide and make a few examples of each closure. Keep the filling quantity similar so you are comparing folds rather than dealing with overfilled wrappers.',
      },
      {
        title: 'Cook and compare the results',
        body: 'Cook according to the complete recipe, testing doneness appropriately. Compare which shapes held together and were comfortable to eat, then serve the small mixed batch and refrigerate leftovers promptly.',
      },
    ],
    completion:
      'You have cooked dumplings in three recognisable shapes using one consistent filling.',
    tip: 'Put the least confident folds in the first test batch so you can correct them before shaping everything.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-woks-of-life-ee283880a0'],
        purpose:
          'Use the original cooks’ demonstrated folding methods alongside a complete cooking recipe.',
      },
    ],
  },
  'roll-vegetarian-maki-for-a-picnic-at-home': {
    title: 'Roll vegetarian maki for a picnic at home',
    summary:
      'Season rice, prepare contrasting fillings and roll a small selection of vegetable maki.',
    time: 'Allow an afternoon for rice preparation, cooling, rolling and a meal.',
    cost: 'Rice, nori and a few vegetables are modest ingredients; borrow a rolling mat.',
    place: 'A clean kitchen with a rice-cooking setup and space to prepare fillings.',
    preparation:
      'Use a tested nori-maki recipe and choose vegetable fillings suited to it. Prepare rice safely and plan to eat promptly; if the meal must wait, follow appropriate refrigeration guidance instead of leaving rice at room temperature.',
    steps: [
      {
        title: 'Prepare components before rolling',
        body: 'Cook and season the rice as directed, then cut fillings into practical lengths. Keep the selection small so each roll has a clear flavour and you can focus on the rolling technique.',
      },
      {
        title: 'Practice with one simple roll',
        body: 'Follow the guide for rice coverage, filling position and closure. Resist overfilling, and inspect the first roll before repeating; an overstuffed centre is harder to fix after the whole batch is assembled.',
      },
      {
        title: 'Slice and share at home',
        body: 'Use a suitable clean knife to portion the rolls, wiping it as needed. Serve with modest accompaniments, note which fillings stayed together and chill any leftovers promptly.',
      },
    ],
    completion: 'You have rolled and served a small batch of vegetable maki with a secure shape.',
    tip: 'A cucumber-only first roll makes it much easier to understand the rice layer and closing edge.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['kikkoman-corporation-6d02ebf4a4'],
        purpose:
          'Follow the producer’s illustrated single-filling roll method and rice preparation guidance.',
      },
    ],
  },
  'churn-butter-in-a-jar': {
    title: 'Churn butter in a jar',
    summary: 'Shake pasteurised cream until it separates and make a small portion of fresh butter.',
    time: 'Allow a short session, with a little extra time for cleanup and chilling.',
    cost: 'A small amount of pasteurised cream and a leakproof food-safe jar are enough.',
    place: 'A kitchen with clean utensils and a refrigerator for the finished butter.',
    preparation:
      'Choose a tested butter-making activity and pasteurised cream with the required fat content. Use a jar with room for movement, check dairy allergies and keep the small finished batch refrigerated.',
    steps: [
      {
        title: 'Prepare the jar and cream',
        body: 'Clean the container and check its lid before adding cream. Leave the headspace the activity recommends, and make a small batch so shaking remains comfortable rather than becoming an endurance challenge.',
      },
      {
        title: 'Notice the changing texture',
        body: 'Shake or take turns shaking, observing how the cream first thickens and then separates. Pause to look through the jar instead of opening it repeatedly, and follow the activity’s cue for completion.',
      },
      {
        title: 'Finish and taste responsibly',
        body: 'Separate and finish the butter using the demonstrated method. Spread a little on bread, label the refrigerated remainder with the date and clean the jar before any residue dries.',
      },
    ],
    completion: 'You have separated a small portion of butter from cream and tasted the result.',
    tip: 'Taking turns makes the activity sociable; stop or change method if shaking becomes uncomfortable.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-butter-museum-e7ea7c5a6c'],
        purpose: 'Use the museum’s complete jam-jar butter-making activity and teacher notes.',
      },
    ],
  },
  'freeze-a-batch-of-homemade-ice-cream': {
    title: 'Freeze a batch of homemade ice cream',
    summary:
      'Make a cooked or egg-free base using a tested recipe and freeze it into a shareable dessert.',
    time: 'Allow preparation time plus the full freezing period in your chosen recipe.',
    cost: 'A small batch can use ordinary ingredients; a machine is optional for some methods.',
    place: 'A clean kitchen with reliable freezer space and containers suitable for freezing.',
    preparation:
      'Choose a tested egg-free recipe or a properly cooked base and check allergens. Read through chilling and freezing stages before starting; clear freezer space and choose a method suited to the equipment you have.',
    steps: [
      {
        title: 'Prepare one straightforward flavour',
        body: 'Measure the ingredients and complete any heating or chilling specified by the recipe. Avoid adding several mix-ins on the first attempt, since they can complicate both texture and freezing.',
      },
      {
        title: 'Freeze with the chosen method',
        body: 'Follow the recipe’s machine or no-machine process. Keep ice, salt or external cooling materials separate from the food, and use suitable protection if handling very cold containers.',
      },
      {
        title: 'Serve and evaluate the texture',
        body: 'Taste a small portion once it reaches the recipe’s intended stage. Note how easily it scoops and melts, then store the remaining batch covered and label its ingredients and date.',
      },
    ],
    completion:
      'You have made a safely prepared frozen dessert and served a portion you can describe.',
    tip: 'For a first attempt, compare the texture before adding toppings; they can hide what the freezing method achieved.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['pacific-science-center-f314b057da'],
        purpose:
          'Follow the science centre’s tested ice-and-salt method as one machine-free route.',
      },
    ],
  },
  'temper-chocolate-and-mould-a-small-batch': {
    title: 'Temper chocolate and mould a small batch',
    summary: 'Learn temperature control with chocolate and cast a few glossy bars or shapes.',
    time: 'Allow an afternoon with enough time for a test piece to set.',
    cost: 'Use a small quantity of suitable chocolate; a reliable kitchen thermometer is useful.',
    place: 'A dry kitchen worktop with clean bowls and moulds, away from splashing water.',
    preparation:
      'Choose one complete tempering method and chocolate intended for it. Read its temperature guidance and prepare the moulds before heating; do not combine temperature curves from different recipes or chocolate types.',
    steps: [
      {
        title: 'Organise the heating and cooling',
        body: 'Measure the chocolate and set aside whatever the chosen method requires for seeding. Keep the work area dry and decide where hot bowls will rest without damaging the counter.',
      },
      {
        title: 'Temper and test a little',
        body: 'Follow the method while observing temperature and texture. Test a small smear before pouring the full batch, using the recipe’s setting cues rather than assuming a shiny liquid is already tempered.',
      },
      {
        title: 'Mould and assess the set',
        body: 'Pour a few small shapes and leave them undisturbed as directed. Inspect the surface and break a test piece, then record the chocolate type and method for your next attempt.',
      },
    ],
    completion: 'You have moulded a small batch and assessed its set, gloss and snap.',
    tip: 'Keep the first design plain; inclusions and coatings add variables before you understand the tempering process.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-da12d19cdc'],
        purpose: 'Follow the complete method and chocolate-specific temperature guidance.',
      },
    ],
  },
  'decorate-cookies-with-edible-pattern-work': {
    title: 'Decorate cookies with edible pattern work',
    summary: 'Bake or buy plain cookies and finish a small coordinated set with food-safe icing.',
    time: 'Plan an afternoon and leave time for icing to dry before packing.',
    cost: 'A small batch of plain cookies, food-safe icing and simple bags are enough.',
    place: 'A clean kitchen table with trays that can remain flat while decorations set.',
    preparation:
      'Choose one cookie shape and two icing colours. Check allergens, use an icing recipe appropriate to the eaters and read the decorating guide before deciding whether you need piping tips or only a small cut bag.',
    steps: [
      {
        title: 'Practice the line on a spare surface',
        body: 'Test icing consistency and a few simple marks before decorating cookies. Choose a repeating border, dot or stripe that can be drawn comfortably, rather than beginning with intricate lettering.',
      },
      {
        title: 'Create a coherent little set',
        body: 'Decorate several cookies with related patterns, leaving room for the background. Adjust pressure or consistency after the first one and avoid piling wet layers together before they can hold their shape.',
      },
      {
        title: 'Let the work become edible',
        body: 'Allow the icing to dry as directed before stacking or wrapping. Share the cookies with ingredient information and keep a photograph of the whole set before everyone chooses a favourite.',
      },
    ],
    completion: 'A small coordinated set of decorated cookies is dry enough to serve or pack.',
    tip: 'Plain purchased cookies are a reasonable shortcut when the experience you want is edible pattern-making.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-f962b7a886'],
        purpose:
          'Use the complete icing, consistency and decorating lessons for your chosen pattern.',
      },
    ],
  },
  'turn-vegetable-trimmings-into-stock-and-soup': {
    title: 'Turn vegetable trimmings into stock and soup',
    summary: 'Save suitable fresh trimmings, simmer a stock and use it in a complete meal.',
    time: 'Allow a cooking session for simmering, straining and making the soup.',
    cost: 'Use suitable fresh trimmings from food you were already preparing.',
    place: 'A clean kitchen with a large pot, strainer and containers for any surplus stock.',
    preparation:
      'Read a tested stock recipe and collect only the vegetables it recommends. Keep trimmings refrigerated or frozen as appropriate; do not use spoiled food, mouldy scraps or unknown plant parts in the name of reducing waste.',
    steps: [
      {
        title: 'Sort for flavour and condition',
        body: 'Check every trimming and choose a balanced small mix. Keep strong or bitter vegetables within the recipe’s guidance, wash suitable pieces and set aside anything that does not belong in the pot.',
      },
      {
        title: 'Make and strain the stock',
        body: 'Follow the recipe’s proportions and simmering instructions. Taste cautiously at an appropriate stage, then strain using a stable setup so a heavy hot pot does not become a pouring hazard.',
      },
      {
        title: 'Turn it into a meal',
        body: 'Use some stock immediately in a simple soup with vegetables, pulses or noodles. Cool and refrigerate or freeze any surplus promptly using appropriate food-storage guidance, labelling its ingredients and date.',
      },
    ],
    completion: 'Suitable trimmings have become a stock that you used in a complete cooked meal.',
    tip: 'Waste reduction starts with keeping food safe; a questionable scrap belongs out of the cooking pot.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['love-food-hate-waste-new-zealand-9a95a33739'],
        purpose: 'Follow the programme’s vegetable-stock guidance and associated meal ideas.',
      },
    ],
  },
  'cook-a-meal-entirely-from-your-existing-pantry': {
    title: 'Cook a meal entirely from your existing pantry',
    summary: 'Inventory food already at home and compose a complete meal without an extra shop.',
    time: 'Give yourself a short inventory followed by an ordinary cooking session.',
    cost: 'No extra food shopping is the constraint; use ingredients already available to your household.',
    place: 'Your usual kitchen with permission to use the food you identify.',
    preparation:
      'Check the pantry, fridge and freezer before choosing a dish. Respect food reserved for other people, inspect storage condition and dates appropriately, and make the challenge about resourcefulness rather than eating something doubtful.',
    steps: [
      {
        title: 'List what needs using first',
        body: 'Identify a starch, protein source and vegetables or other accompaniments you already have. Note small flavourings too, then prioritise opened or perishable ingredients that are still safe and suitable.',
      },
      {
        title: 'Choose a workable cooking pattern',
        body: 'Build around a familiar soup, stir-fry, tray bake or grain bowl. Consult a complete recipe for timing and safe preparation where needed, adapting only within what you understand.',
      },
      {
        title: 'Serve and reset the pantry',
        body: 'Cook a satisfying portion and put unused ingredients away properly. Note one combination that worked, then update your shopping list only after the meal so the inventory affects future habits.',
      },
    ],
    completion: 'You have served a complete meal made from food already in the house.',
    tip: 'A modest extra accompaniment from the freezer can make an improvised meal feel intentional without requiring a shop.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['nsw-environment-protection-authority-38330d4017'],
        purpose: 'Use the public programme’s stocktake approach to plan meals from existing food.',
      },
    ],
  },
  'prepare-a-bento-with-contrasting-textures': {
    title: 'Prepare a bento with contrasting textures',
    summary:
      'Pack a compact meal with distinct colours, textures and portions, then enjoy it away from your desk.',
    time: 'Allow a normal meal-preparation session plus safe cooling and packing time.',
    cost: 'Use an existing food-safe lunch container and ordinary meal ingredients.',
    place:
      'A kitchen with reliable refrigeration and a clean surface for arranging the finished box.',
    preparation:
      'Choose a small bento plan with a staple, main and contrasting sides. Read a complete preparation guide and plan safe storage; an attractive box does not make room-temperature rice or other perishables safe.',
    steps: [
      {
        title: 'Choose components that travel well',
        body: 'Select a limited set of foods with different textures and colours. Avoid making every component new, and consider how moisture from one item might affect another when they share the container.',
      },
      {
        title: 'Cook and pack with care',
        body: 'Follow the recipes and cool or refrigerate components appropriately before packing. Use food-safe dividers where useful and keep the container clean, compact and practical rather than forcing in an elaborate decoration.',
      },
      {
        title: 'Eat away from the work surface',
        body: 'Enjoy the meal at home or transport it with suitable chilling. Notice which textures stayed distinct and whether the portions were comfortable, then wash the container and note one improvement.',
      },
    ],
    completion:
      'You have prepared and eaten a compact bento with deliberately contrasting components.',
    tip: 'A familiar meal can become your first bento; specialised moulds and character decorations are optional.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['kikkoman-corporation-312f379d16'],
        purpose:
          'Follow the producer’s linked bento feature for composition, recipes and packed-meal preparation guidance.',
      },
    ],
  },
  'make-instant-steamed-dhokla': {
    title: 'Make instant steamed dhokla',
    summary: 'Use a tested unfermented batter recipe to create a light steamed savoury snack.',
    time: 'Allow a kitchen session, including steaming and a little cooling before cutting.',
    cost: 'Gram flour and common pantry ingredients make a modest small batch.',
    place: 'A kitchen with a stable steamer and a safely fitting dish.',
    preparation:
      'Choose a complete instant khaman-style recipe rather than a fermented dhokla method. Check the leavening ingredient and pan size, and have the steamer ready before mixing any batter that must be cooked promptly.',
    steps: [
      {
        title: 'Prepare the equipment first',
        body: 'Read the recipe’s steaming setup and test how the dish fits before heating. Measure ingredients and grease or line the dish as specified, keeping water levels and hot handles easy to manage.',
      },
      {
        title: 'Mix for the chosen method',
        body: 'Follow the recipe’s sequence and avoid substituting leaveners by guesswork. Pay attention to the described batter texture, then transfer it to the prepared steamer within the method’s intended timing.',
      },
      {
        title: 'Steam and serve',
        body: 'Use the recipe’s doneness test and let the snack settle before portioning. Add its finishing or tempering only as directed, then share the batch and note the dish size and steaming result.',
      },
    ],
    completion: 'You have made and served a small unfermented steamed savoury snack.',
    tip: 'Name the recipe accurately: khaman and fermented dhokla are related but distinct preparations.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['sanjeev-kapoor-khazana-0183fe7359'],
        purpose:
          'Watch the original chef demonstration for the complete batter, steaming and finishing method.',
      },
    ],
  },
  'practice-three-vegetable-knife-cuts-for-one-meal': {
    title: 'Practice three vegetable knife cuts for one meal',
    summary:
      'Learn stable grip and consistent slicing, dicing and julienne, then cook the results.',
    time: 'Plan an hour of deliberate practice followed by cooking the vegetables.',
    cost: 'Use a few ordinary vegetables and a suitable existing kitchen knife.',
    place: 'A kitchen with a stable chopping board, good light and uncluttered counter space.',
    preparation:
      'Choose a beginner knife-skills demonstration and a meal that will use the cut vegetables. Use a knife suited to your grip, secure the board and learn the safe hand positions before focusing on speed.',
    steps: [
      {
        title: 'Establish control',
        body: 'Practice positioning a vegetable so it cannot roll and use the demonstrated grip. Make a few slow slices, stopping if the board moves or you cannot keep the guiding hand comfortably clear.',
      },
      {
        title: 'Compare three named cuts',
        body: 'Work on slicing, dicing and thin matchsticks at a manageable size. Aim for pieces that cook evenly rather than tiny restaurant precision, and gather offcuts for the meal instead of treating them as waste.',
      },
      {
        title: 'Cook the practice pieces',
        body: 'Use the vegetables in a soup, sauté or other suitable dish. Notice how evenness affected cooking, clean and store the knife safely, and identify one movement that needs further instruction.',
      },
    ],
    completion: 'You have practiced three cuts safely and turned the results into food.',
    tip: 'Slow consistent pieces teach more than a fast pile of uneven ones; there is no speed target.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['institute-of-culinary-education-1745bf26d1'],
        purpose:
          'Use the culinary school’s illustrated grip and cutting instruction before practical vegetable work.',
      },
    ],
  },
  'share-langar-respectfully-at-a-gurdwara': {
    title: 'Share langar respectfully at a gurdwara',
    summary: 'Learn the local etiquette and sit for the communal meal offered by a Sikh gurdwara.',
    time: 'Allow enough time for arrival, learning the etiquette and an unhurried meal.',
    cost: 'Langar is a community offering; travel or an optional voluntary contribution may cost money.',
    place: 'A Sikh gurdwara where the community confirms visitor arrangements.',
    preparation:
      'Read the Sikh Coalition’s introduction and contact the gurdwara about visiting, access and meal times. Ask about head covering, shoes, seating and food needs; approach the meal as participation in a community practice.',
    steps: [
      {
        title: 'Arrive ready to learn',
        body: 'Follow the host’s guidance for entering and covering your head. Ask where to sit and how the meal is served, requesting an accessible seating arrangement if you need one.',
      },
      {
        title: 'Share the meal respectfully',
        body: 'Accept a modest portion and request more if appropriate. Let conversation follow the setting, avoid photographing people without permission and notice the practice of sitting and eating together.',
      },
      {
        title: 'Finish as the community directs',
        body: 'Return dishes or help only where invited and instructed. Thank the volunteers, ask any remaining questions considerately and reflect on what you learned about langar beyond the food on the plate.',
      },
    ],
    completion:
      'You have shared langar while following the host gurdwara’s visitor and meal etiquette.',
    tip: 'An introductory open house can be a comfortable first visit, but confirm the actual arrangements with the local community.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['the-sikh-coalition-9d2830548e'],
        purpose:
          'Read the Sikh community organisation’s explanation of the practice and its setting.',
      },
    ],
  },
  'follow-one-ingredient-through-a-market': {
    title: 'Follow one ingredient through a market',
    summary:
      "Ask willing vendors about a seasonal ingredient's varieties, origin and uses, then cook with it.",
    time: 'Plan a market visit and a later cooking session.',
    cost: 'Set a small ingredient budget before browsing and buy only what you can use.',
    place: 'A public food market and a kitchen where you can prepare your purchase.',
    preparation:
      'Choose one seasonal ingredient and a few questions about variety, origin and use. Visit when vendors can comfortably talk, respect queues and accept that a seller may not know every stage of the supply chain.',
    steps: [
      {
        title: 'Observe before interviewing',
        body: 'Look at the ingredient across a few stalls and note labels or visible differences. Ask permission for a brief question, keeping the conversation about the product rather than requesting personal details.',
      },
      {
        title: 'Ask for a practical connection',
        body: 'Find out how the vendor recommends selecting, storing or cooking it. Distinguish their own experience from a claim about the whole region, and buy an appropriate small amount if you want to cook.',
      },
      {
        title: 'Follow it into a meal',
        body: 'Use a reliable recipe suited to the ingredient and record the variety or origin actually known. Compare the cooked result with what you noticed at the stall and save one useful preparation lesson.',
      },
    ],
    completion:
      'You have followed a named ingredient from a documented market purchase into a meal.',
    tip: 'One well-timed question is often more welcome than an impromptu interview during a busy trading period.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['slow-food-98c4104385'],
        purpose:
          'Read the organisation’s approach to connecting sensory education with local food and producers.',
      },
    ],
  },
  'taste-one-dish-from-three-local-traditions': {
    title: 'Taste one dish from three local traditions',
    summary:
      'Compare clearly named regional versions of a familiar dish while learning what distinguishes them.',
    time: 'Allow a meal or a few short outings rather than rushing several full portions.',
    cost: 'Share tasting portions where the venue permits, with a clear group spending limit.',
    place:
      'Local restaurants, community food events or home kitchens with clearly named regional versions.',
    preparation:
      'Choose a dish with genuinely documented regional forms, not three restaurants using the same recipe. Check ingredients and access, then read cooks’ own descriptions so you can ask informed, modest questions.',
    steps: [
      {
        title: 'Define what you are comparing',
        body: 'Identify the versions by their actual names and regions. Note whether the key difference is grain, seasoning, cooking method or accompaniment, rather than assuming every variation is a direct contest.',
      },
      {
        title: 'Taste with context',
        body: 'Order manageable portions and notice the features each cook describes. Ask a willing host one specific question when convenient, and keep taste preferences separate from judgments about authenticity.',
      },
      {
        title: 'Record the distinctions',
        body: 'Compare notes after eating and identify one feature you would recognise again. Keep the cooks or venues credited if you share your discoveries, without presenting a small tasting as expertise in an entire cuisine.',
      },
    ],
    completion:
      'You have tasted three clearly identified versions and can explain their documented differences.',
    tip: 'A shared dish name can hide different foods; choose examples whose relationship you can actually establish.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['slow-food-5a997b247e'],
        purpose:
          'Use the organisation’s cultural and sensory education approach when planning a contextual regional comparison.',
      },
    ],
  },
  'plate-a-meal-inspired-by-a-food-history-collection': {
    title: 'Plate a meal inspired by a food history collection',
    summary:
      'Choose a documented historical food object and make an everyday meal that explores its use.',
    time: 'Allow a short collection visit online and an ordinary cooking session.',
    cost: 'Use everyday ingredients and your own suitable tableware rather than buying antiques.',
    place: 'A museum’s online food-history collection and your home kitchen.',
    preparation:
      'Choose one documented object connected to preparing, serving or eating food. Read its label carefully and check the date and place; use a modern food-safe equivalent instead of putting food into an unknown antique.',
    steps: [
      {
        title: 'Find the object’s actual function',
        body: 'Look for evidence of how and by whom it was used. Separate the museum’s description from your guesses, and choose one practical feature you can explore through a present-day meal.',
      },
      {
        title: 'Plan a modest interpretation',
        body: 'Make an ordinary dish suited to that feature, such as shared serving or portable eating. Use a complete modern recipe and explain which part of the meal is inspired by the object.',
      },
      {
        title: 'Eat and compare',
        body: 'Serve the meal with the collection image nearby and notice how the utensil or arrangement affects use. Write a brief caption with the object reference and distinguish your adaptation from a historical reconstruction.',
      },
    ],
    completion:
      'You have eaten a meal that thoughtfully explores one documented food-history object.',
    tip: 'The most useful object may be an everyday container; famous luxury tableware is not required.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['smithsonian-national-museum-of-ameri-042bd51665'],
        purpose:
          'Explore the museum’s food objects and interpretation as evidence for your own modest meal adaptation.',
      },
    ],
  },
  'test-how-salt-changes-a-simple-dish': {
    title: 'Test how salt changes a simple dish',
    summary: 'Prepare one unsalted base and compare measured seasoning levels in tiny portions.',
    time: 'Allow a short tasting and enough time to use the remaining food.',
    cost: 'Use one simple cooked base and tiny measured amounts of ordinary culinary salt.',
    place: 'A kitchen with accurate small measures and separate sample dishes.',
    preparation:
      'Choose a familiar unsalted food such as plain cooked potato or soup. Keep tasting portions small, respect dietary preferences and compare modest culinary seasoning levels rather than making an extreme salt challenge.',
    steps: [
      {
        title: 'Create a clear baseline',
        body: 'Prepare one uniform batch and divide a little into labelled samples. Keep the temperature and portion sizes similar, retaining an unsalted example so you have a reference point.',
      },
      {
        title: 'Change one variable',
        body: 'Add carefully measured small amounts of salt to the comparison portions. Taste in a considered order, pausing with water, and describe changes in flavour rather than searching for a universal correct level.',
      },
      {
        title: 'Apply the lesson to dinner',
        body: 'Use the remaining base in a normal meal and season gradually. Record the amount you preferred for that food and remember that a different ingredient or accompaniment will change the result.',
      },
    ],
    completion:
      'You have compared a seasoning baseline with measured changes and used the lesson in food.',
    tip: 'Do not turn the strongest sample into a target; the useful result may be discovering that less suits you.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['slow-food-5064e28dd3'],
        purpose:
          'Use the sensory-training framework for a small, controlled comparison of seasoning.',
      },
    ],
  },
  'roll-couscous-grains-by-hand-with-a-knowledgeable-cook': {
    title: 'Roll couscous grains by hand with a knowledgeable cook',
    summary:
      'Learn the rolling and steaming stages of couscous rather than only rehydrating a packet.',
    time: 'Reserve an unhurried cook-led session for rolling, steaming and sharing the meal.',
    cost: 'A small batch is modest; pay a teacher fairly and confirm ingredients are included.',
    place: 'A kitchen with a knowledgeable cook and the appropriate steaming equipment.',
    preparation:
      'Read the shared heritage record and find a cook who actually rolls couscous from its starting grain. Ask which regional method they teach and distinguish the experience from rehydrating commercially prepared couscous.',
    steps: [
      {
        title: 'Watch the grain take shape',
        body: 'Ask the cook to demonstrate a small portion and explain the desired feel. Notice the relationship between moisture and movement, using their guidance rather than assuming a fixed method covers every tradition.',
      },
      {
        title: 'Roll beside the cook',
        body: 'Practice with a manageable amount, asking for feedback before processing the full batch. Compare your grains with the teacher’s example and learn how the local method handles uneven pieces.',
      },
      {
        title: 'Steam and share',
        body: 'Follow the cook’s complete steaming process and serve the couscous with suitable accompaniments. Record the regional name, cook’s contribution and practical cues with permission, rather than presenting the recipe as your invention.',
      },
    ],
    completion: 'You have rolled and cooked couscous by hand with a knowledgeable maker.',
    tip: 'Ask what is prepared before the session; the ingredient transformation is the point of this experience.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['unesco-intangible-cultural-heritage-e2d8dbf05e'],
        purpose:
          'Read the heritage record for rolling, steaming and sharing practices; arrange current cook-led instruction separately.',
      },
    ],
  },
  'laminate-pastry-and-bake-a-first-batch-of-croissants': {
    title: 'Laminate pastry and bake a first batch of croissants',
    summary: 'Build alternating layers of dough and butter, then shape and bake a small batch.',
    time: 'Allow a weekend or the full multi-stage schedule in your chosen recipe.',
    cost: 'A small batch uses ordinary baking ingredients but needs sufficient suitable butter.',
    place: 'A kitchen with refrigerator space, a rolling surface and a reliable oven.',
    preparation:
      'Choose a complete beginner croissant recipe and read the lamination lesson first. Check every rest and proofing stage against your schedule; avoid fitting the process into gaps too short to complete it properly.',
    steps: [
      {
        title: 'Plan the cold stages',
        body: 'Prepare the dough and butter as your recipe directs. Clear refrigerator space and label the planned turns, so you can maintain the sequence without repeatedly guessing what happens next.',
      },
      {
        title: 'Build the layers patiently',
        body: 'Follow the demonstrated rolling and folding method. Stop for the prescribed chilling when dough resists or butter softens, and avoid forcing extra turns into a process already designed for a specific result.',
      },
      {
        title: 'Shape, proof and bake',
        body: 'Finish the recipe’s shaping and proofing before baking a small tray. Let the croissants cool, inspect the layers and record where the dough was easiest or hardest to handle.',
      },
    ],
    completion:
      'You have baked a batch from dough you laminated yourself and examined the resulting layers.',
    tip: 'Keep the first batch plain; fillings make it harder to judge what the lamination achieved.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-ff3c5fb371'],
        purpose: 'Follow the educator’s lamination lesson and its linked complete pastry recipes.',
      },
    ],
  },
  'grow-edible-sugar-crystals': {
    title: 'Grow edible sugar crystals',
    summary:
      'Prepare a tested sugar solution and watch crystals develop on a food-safe support over several days.',
    time: 'Allow a short supervised preparation session and several days of undisturbed growth.',
    cost: 'Sugar and clean food-safe jars make a small experiment inexpensive.',
    place: 'A kitchen for hot syrup and a clean stable shelf away from disturbance.',
    preparation:
      'Read the complete rock-candy activity before heating anything. Use food-safe supports and utensils, protect the setup from contamination and have someone experienced handle hot sugar syrup; its heat demands care.',
    steps: [
      {
        title: 'Prepare the growing setup',
        body: 'Clean the jar and arrange its support as the recipe directs. Make the label and observation sheet first so you can set the hot solution down without searching for equipment.',
      },
      {
        title: 'Make and leave the solution',
        body: 'Follow the activity’s quantities and heating method exactly, then place the jar securely. Observe from outside on successive days rather than moving the support or putting fingers into the syrup.',
      },
      {
        title: 'Assess the crystals',
        body: 'Compare photographs or sketches and describe where growth occurred. Follow the recipe for removing and using the candy, discarding the experiment if it becomes contaminated or shows unwanted growth.',
      },
    ],
    completion: 'You have observed sugar crystals developing and documented their changing shapes.',
    tip: 'Make observation the main outcome; a jar can be interesting even when the crystals are smaller than expected.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['exploratorium-093d1c0077'],
        purpose:
          'Use the complete museum activity for syrup preparation, supports and crystal growing.',
      },
    ],
  },
  'bake-hollow-choux-pastry-and-fill-it': {
    title: 'Bake hollow choux pastry and fill it',
    summary: 'Cook a choux paste, pipe or spoon it into shapes and fill the cooled shells.',
    time: 'Allow an afternoon for the cooked paste, baking, cooling and filling.',
    cost: 'A small batch needs common baking ingredients; a piping bag can be improvised if the recipe permits.',
    place: 'A kitchen with a hob, reliable oven and room for cooling trays.',
    preparation:
      'Choose one complete choux recipe and a simple filling with safe storage instructions. Read the paste and baking cues before starting; decide on puffs or éclairs rather than attempting several shapes simultaneously.',
    steps: [
      {
        title: 'Make the paste with the recipe',
        body: 'Measure everything before heating and follow the cooking sequence. Add ingredients as instructed, watching texture rather than assuming a fixed mixing time can replace the recipe’s visual cues.',
      },
      {
        title: 'Bake consistent shapes',
        body: 'Pipe or spoon similar portions with enough space between them. Follow the full oven schedule and avoid unnecessary door opening; the structure needs time to set before it can support itself.',
      },
      {
        title: 'Cool and fill',
        body: 'Check the shells as the recipe advises and let them cool before adding the filling. Serve appropriately or refrigerate as needed, then split one piece to inspect the hollow interior.',
      },
    ],
    completion: 'You have made hollow pastry shells and filled a small batch for eating.',
    tip: 'Spoon-shaped puffs can be a good first attempt if controlling a piping bag is a separate skill you have not learned.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-e6f2e514c4'],
        purpose:
          'Follow the complete choux, baking and filling recipe rather than guessing paste consistency or oven timing.',
      },
    ],
  },
  'stretch-strudel-dough-by-hand': {
    title: 'Stretch strudel dough by hand',
    summary:
      'Stretch rested pastry across a cloth-covered table, roll it around a filling and bake it.',
    time: 'Allow the recipe’s resting schedule and an unhurried stretch-and-bake session.',
    cost: 'Use a small quantity of ordinary pastry ingredients and a simple filling.',
    place: 'A kitchen with a clean cloth-covered table you can reach from several sides.',
    preparation:
      'Read the complete strudel recipe and its dough-resting guidance. Choose a manageable quantity and prepare the filling before stretching; remove rings and check that the tablecloth can safely contact food.',
    steps: [
      {
        title: 'Prepare for the stretch',
        body: 'Make and rest the dough as directed, then clear the table completely. Have the baking tray, filling and cloth ready so the thin dough does not wait while you rearrange the kitchen.',
      },
      {
        title: 'Work gradually around the dough',
        body: 'Follow the demonstrated hand technique and use the dough’s behaviour as feedback. Move evenly rather than pulling one corner to its limit, accepting a few small tears without abandoning the sheet.',
      },
      {
        title: 'Fill, roll and bake',
        body: 'Use the cloth and recipe method to form the pastry without excessive handling. Bake fully, cool as advised and inspect a slice to see how the stretched sheet became layers.',
      },
    ],
    completion: 'You have stretched a thin sheet by hand and baked it around a chosen filling.',
    tip: 'A patterned clean cloth can make the thinning dough easier to see without requiring a perfect transparent sheet.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-recipe-by-erin-je-19645ad8df'],
        purpose:
          'Follow the original dough, rest, hand-stretching and rolling instructions with a linked filling recipe.',
      },
    ],
  },
  'make-edible-juice-pearls-with-a-spherification-kit': {
    title: 'Make edible juice pearls with a spherification kit',
    summary:
      'Use a food-grade kit and its tested recipe to turn juice into small gel-coated pearls.',
    time: 'Allow a measured kitchen session and any resting time specified by the kit.',
    cost: 'A food-grade beginner kit is a moderate one-time purchase; use a small amount of juice.',
    place: 'A clean kitchen with accurate scales, separate baths and food-safe utensils.',
    preparation:
      'Choose a reputable food-grade spherification kit with a complete beginner recipe. Read ingredient compatibility and measuring requirements before shopping; use only culinary additives supplied or specified for the method.',
    steps: [
      {
        title: 'Set up the recipe precisely',
        body: 'Label the liquid, setting bath and rinsing bath and measure as instructed. Check that your scale is accurate enough, since guessing a small additive quantity can change the entire result.',
      },
      {
        title: 'Test a few pearls',
        body: 'Make a tiny trial using the kit’s tool and timing. Observe whether the drops form, stick or collapse, then use the supplied troubleshooting rather than adding arbitrary extra powders.',
      },
      {
        title: 'Serve a small experiment',
        body: 'Rinse and serve according to the recipe, keeping any storage within its instructions. Compare the texture with plain juice and tell tasters exactly what ingredients were used.',
      },
    ],
    completion:
      'You have made a small batch of edible liquid-filled pearls using the kit’s tested method.',
    tip: 'A clear simple juice is a better first experiment than an acidic, pulpy or dairy mixture the kit has not specified.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['modernist-pantry-f6c0da8a3b'],
        purpose:
          'Use the manufacturer’s included instructions, ingredient compatibility and precision requirements for the food-grade kit.',
      },
    ],
  },
  'mill-grain-into-flour-for-a-small-bake': {
    title: 'Mill grain into flour for a small bake',
    summary:
      'Use a suitable food mill under guidance, then turn the fresh flour into a simple cooked food.',
    time: 'Allow a guided milling session and time to cook a small test bake.',
    cost: 'Borrow a suitable mill or pay for a workshop before purchasing specialist equipment.',
    place: 'A kitchen or teaching space with a food mill rated for the grain you choose.',
    preparation:
      'Read the milling guide and the equipment’s own instructions. Obtain clean food-grade grain, check allergies and choose a recipe designed for freshly milled wholegrain flour; a coffee grinder is not an automatic substitute.',
    steps: [
      {
        title: 'Meet the grain and mill',
        body: 'Inspect the grain and learn which adjustment controls the grind. Ask the instructor to demonstrate safe feeding and cleaning, keeping fingers and unsuitable objects away from the working mechanism.',
      },
      {
        title: 'Mill a modest amount',
        body: 'Process only what the recipe needs, following the equipment’s limits. Compare the resulting texture with familiar flour and record the grain and setting rather than assuming every flour can replace white flour directly.',
      },
      {
        title: 'Cook and compare',
        body: 'Use the fresh flour in the chosen complete recipe. Bake or cook fully, then describe the texture and flavour, cleaning the mill as directed and storing any surplus appropriately.',
      },
    ],
    completion: 'You have turned food-grade grain into flour and used it in a cooked food.',
    tip: 'A small pancake or flatbread test can reveal the flour’s behaviour before a full loaf demands more time.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['king-arthur-baking-3b0f475acb'],
        purpose:
          'Follow the baking educator’s milling introduction and linked guidance for using freshly milled flour.',
      },
    ],
  },
  'pair-nonalcoholic-drinks-with-a-small-snack-menu': {
    title: 'Pair nonalcoholic drinks with a small snack menu',
    summary:
      'Compare how a few alcohol-free drinks interact with contrasting savoury and sweet bites.',
    time: 'Allow a sociable tasting session with a few minutes to prepare each drink.',
    cost: 'Use small servings of two or three alcohol-free drinks and ordinary snacks.',
    place: 'A table with water, clear labels and comfortable space for individual samples.',
    preparation:
      'Choose a tea-based comparison using the tea academy’s pairing approach, or a similarly clear alcohol-free format. Check ingredients, caffeine and allergies, and keep the menu small enough to compare combinations without wasting food.',
    steps: [
      {
        title: 'Choose deliberate contrasts',
        body: 'Pair a few simple savoury and sweet bites with drinks of different strength or aroma. Write down the combinations before tasting so you can tell what is being compared.',
      },
      {
        title: 'Taste separately and together',
        body: 'Try a small bite and a sip on their own, then together. Notice changes in sweetness, bitterness, texture or finish, allowing each person to record an impression before the group discusses it.',
      },
      {
        title: 'Build a tiny final menu',
        body: 'Select the combinations you actually enjoyed and prepare a short serving order. Note brew or mixing details so the result can be repeated, and finish the remaining food as a relaxed snack.',
      },
    ],
    completion:
      'You have created a short alcohol-free pairing menu supported by your own tasting notes.',
    tip: 'A pairing can work through contrast as well as similarity; agreement around the table is optional.',
    updatedAt: '2026-11-07',
    resources: [
      {
        ...CATALOG_SOURCES['uk-tea-academy-c5b2d95076'],
        purpose:
          'Learn the academy’s approach to comparing tea with food and consider a guided session for deeper instruction.',
      },
    ],
  },
};
