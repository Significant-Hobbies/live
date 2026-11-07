import type { ExperienceResource } from './types';

export const CATALOG_SOURCES = {
  'victoria-and-albert-museum-8dad46c482': {
    title: 'Make your own paper peepshow',
    url: 'https://www.vam.ac.uk/articles/make-your-own-paper-peepshow',
    publisher: 'Victoria and Albert Museum',
  },
  'exploratorium-b10b2d4196': {
    title: 'Building a zoetrope',
    url: 'https://annex.exploratorium.edu/the-world/wcast2/zoetrope.html',
    publisher: 'Exploratorium',
  },
  'university-of-cambridge-museums-e5096e0c95': {
    title: 'Make a shadow puppet',
    url: 'https://www.museums.cam.ac.uk/sites/default/files/CCT%20Shadow%20Puppet%20Instructions.pdf',
    publisher: 'University of Cambridge Museums',
  },
  'victoria-and-albert-museum-7d6ee08891': {
    title: 'Design and make your own story',
    url: 'https://www.vam.ac.uk/articles/design-and-make-your-own-story',
    publisher: 'Victoria and Albert Museum',
  },
  'getty-b46eb06eae': {
    title: 'Printmaking with washable markers',
    url: 'https://www.getty.edu/education/k-12-learning/printmaking-with-washable-markers/',
    publisher: 'Getty',
  },
  'oakland-museum-of-california-056745ee31': {
    title: 'Cardboard weaving',
    url: 'https://museumca.org/learn-at-home/cardboard-weaving/',
    publisher: 'Oakland Museum of California',
  },
  'victoria-and-albert-museum-9bc5bb2b84': {
    title: 'Visible mending: darning',
    url: 'https://www.vam.ac.uk/event/JRxbwlOxJ5/p22045-visible-mending-workshop-spring-23-session-2',
    publisher: 'Victoria and Albert Museum',
  },
  'the-stickley-museum-at-craftsman-far-8ec5120b55': {
    title: 'Paper marbling',
    url: 'https://www.stickleymuseum.org/learn/craftsman-kids/paper-marbling/',
    publisher: 'The Stickley Museum at Craftsman Farms',
  },
  'university-of-brighton-2320bac4d3': {
    title: 'Single-section sewing',
    url: 'https://blogs.brighton.ac.uk/viscommtech/bookarts/worksheets-for-bookbinders/single-section-sewing/',
    publisher: 'University of Brighton',
  },
  'scitech-8eb605b7a5': {
    title: 'Foley Sound Effects Challenge',
    url: 'https://www.scitech.org.au/challenge/foley-sound-effects-challenge/',
    publisher: 'Scitech',
  },
  'bbc-1c08e5ddad': {
    title: 'No Place Like: sound detectives',
    url: 'https://downloads.bbc.co.uk/learning/tenpieces/EYSEN/No%20Place%20Like/No%20Place%20Like%20EYFS%20and%20KS1.pdf',
    publisher: 'BBC',
  },
  'origamiusa-b648183f0b': {
    title: 'Diagrams: Whirlwind',
    url: 'https://www.origamiusa.org/thefold/article/diagrams-whirlwind',
    publisher: 'OrigamiUSA',
  },
  'indira-gandhi-national-centre-for-th-a56fea9e51': {
    title: 'Kolam: ritualistic threshold drawings of Tamil Nadu',
    url: 'https://ignca.gov.in/ICH/ich_detail/ich00008.pdf',
    publisher: 'Indira Gandhi National Centre for the Arts',
  },
  'exploratorium-c5edf99e8d': {
    title: 'Paper circuits',
    url: 'https://www.exploratorium.edu/tinkering/projects/paper-circuits',
    publisher: 'Exploratorium',
  },
  'norton-simon-museum-89987b8141': {
    title: 'Art-making activity: paper making',
    url: 'https://www.nortonsimon.org/assets/Art-Making-Activities/Activity-Paper-Making.pdf',
    publisher: 'Norton Simon Museum',
  },
  'south-street-seaport-museum-7ea373cab8': {
    title: 'Letterpress printing workshops',
    url: 'https://southstreetseaportmuseum.org/letterpress-printing-workshops/',
    publisher: 'South Street Seaport Museum',
  },
  'victoria-and-albert-museum-269883a73a': {
    title: 'Let’s Make Wednesdays: mosaics',
    url: 'https://www.vam.ac.uk/blog/museum-life/letsmakewednesdays-mosaics',
    publisher: 'Victoria and Albert Museum',
  },
  'treasurie-0402adee19': {
    title: 'How to make a patchwork cushion',
    url: 'https://blog.treasurie.com/how-to-make-a-patchwork-cushion/',
    publisher: 'TREASURIE',
  },
  'blick-art-materials-7df7cd5274': {
    title: 'Paper coil baskets',
    url: 'https://www.dickblick.com/lesson-plans/paper-coil-baskets/',
    publisher: 'Blick Art Materials',
  },
  'victoria-and-albert-museum-12b0e79278': {
    title: 'Print a tote bag with Maya Barter',
    url: 'https://www.vam.ac.uk/event/3G2okVYLv7/make-meet-event-4-dec-2025',
    publisher: 'Victoria and Albert Museum',
  },
  'museum-of-craft-and-design-ccab198e8f': {
    title: 'MCD at Home: pop-up cards',
    url: 'https://sfmcd.org/wp-content/uploads/2020/09/MCD%40HomePopUp.pdf',
    publisher: 'Museum of Craft and Design',
  },
  'hirshhorn-museum-and-sculpture-garde-5ab8977ab5': {
    title: 'Play with texture',
    url: 'https://hirshhorn.si.edu/explore/mini-art-lesson-play-with-texture/',
    publisher: 'Hirshhorn Museum and Sculpture Garden, Smithsonian Institution',
  },
  'splitcoaststampers-560e2ac5fc': {
    title: 'Stamp carving basics',
    url: 'https://www.splitcoaststampers.com/resources/tutorials/stampcarvingbasics/',
    publisher: 'Splitcoaststampers',
  },
  'victoria-and-albert-museum-131f5bbafe': {
    title: 'An A to Z of photographic processes: cyanotype',
    url: 'https://www.vam.ac.uk/articles/photographic-processes',
    publisher: 'Victoria and Albert Museum',
  },
  'exploratorium-e2f9440940': {
    title: 'Cardboard automata',
    url: 'https://www.exploratorium.edu/tinkering/projects/cardboard-automata',
    publisher: 'Exploratorium',
  },
  'exploratorium-8f85052f0c': {
    title: 'Chain reaction',
    url: 'https://www.exploratorium.edu/tinkering/projects/chain-reaction',
    publisher: 'Exploratorium',
  },
  'exploratorium-455088f76a': {
    title: 'Scribbling machines activity guide',
    url: 'https://www.exploratorium.edu/sites/default/files/pdfs/scribbling_machines.pdf',
    publisher: 'Exploratorium',
  },
  'exploratorium-64234d26b1': {
    title: 'Balancing sculptures',
    url: 'https://www.exploratorium.edu/tinkering/projects/balancing-sculptures',
    publisher: 'Exploratorium',
  },
  'unesco-intangible-cultural-heritage-8ca0094139': {
    title: 'Washi craftsmanship',
    url: 'https://ich.unesco.org/en/RL/washi-craftsmanship-of-traditional-japanese-hand-made-paper-02291',
    publisher: 'UNESCO Intangible Cultural Heritage',
  },
  'all-india-artisans-and-craftworkers--e95c335ce2': {
    title: 'AIACA annual report: artisan training and workshops',
    url: 'https://www.aiacaonline.org/wp-content/uploads/2024/09/Annual-Report-2023-24.pdf',
    publisher: 'All India Artisans and Craftworkers Welfare Association',
  },
  'all-india-artisans-and-craftworkers--4fd3c94f98': {
    title: 'AIACA annual report: Madhubani workshops',
    url: 'https://www.aiacaonline.org/wp-content/uploads/2024/09/Annual-Report-2023-24.pdf',
    publisher: 'All India Artisans and Craftworkers Welfare Association',
  },
  'kachchh-district-administration-176b6247f7': {
    title: 'Handicrafts of Kachchh',
    url: 'https://kachchh.nic.in/handicraft/',
    publisher: 'Kachchh District Administration',
  },
  'ministry-of-tourism-government-of-in-6398e2f31f': {
    title: 'Raghurajpur craft village',
    url: 'https://www.incredibleindia.gov.in/en/rural-tourism/raghurajpur',
    publisher: 'Ministry of Tourism, Government of India',
  },
  'unesco-intangible-cultural-heritage-fbc146d7c1': {
    title: 'Indonesian Batik',
    url: 'https://ich.unesco.org/en/RL/batik-00170',
    publisher: 'UNESCO Intangible Cultural Heritage',
  },
  'corning-museum-of-glass-1181be23ec': {
    title: 'Make your own glass at The Studio',
    url: 'https://glassmaking.cmog.org/onsite-visitor-guide/make-your-own-glass',
    publisher: 'Corning Museum of Glass',
  },
  'icebreakers-productions-8e7c37aa70': {
    title: 'Experimental animation workshops',
    url: 'https://www.icebreakers.fi/en/productions/in-production/experimental-animation-workshops/',
    publisher: 'Icebreakers Productions',
  },
  'slow-food-5064e28dd3': {
    title: 'To the origins of taste',
    url: 'https://foodpathsnetwork.slowfood.com/wp-content/uploads/2019/03/OriginsTaste.pdf',
    publisher: 'Slow Food',
  },
  'exploratorium-914980383c': {
    title: 'Exploring chocolate: activities',
    url: 'https://annex.exploratorium.edu/exploring/exploring_chocolate/activity.html',
    publisher: 'Exploratorium',
  },
  'specialty-coffee-association-19edb8930e': {
    title: 'How to prepare for coffee assessment',
    url: 'https://sca.coffee/education/how-to-prepare',
    publisher: 'Specialty Coffee Association',
  },
  'icar-indian-institute-of-millets-res-0f6d800f5e': {
    title: 'Millet recipe collections',
    url: 'https://millets.res.in/m_recipes.php',
    publisher: 'ICAR – Indian Institute of Millets Research',
  },
  'bihar-tourism-ed35a5fdf9': {
    title: 'Bihari dal pittha',
    url: 'https://tourism.bihar.gov.in/en/experiences/food-and-cuisine/main-course/pittha',
    publisher: 'Bihar Tourism',
  },
  'king-arthur-baking-recipe-by-pati-ji-cb94abac82': {
    title: 'Tortillas de Maíz',
    url: 'https://www.kingarthurbaking.com/recipes/tortillas-de-maiz-corn-tortillas-recipe',
    publisher: 'King Arthur Baking; recipe by Pati Jinich',
  },
  'mary-s-test-kitchen-5e7f2ff2fa': {
    title: 'DIY tofu with soy milk, lemon and water',
    url: 'https://www.marystestkitchen.com/diy-tofu-just-soymilk-lemon-water/',
    publisher: 'Mary’s Test Kitchen',
  },
  'the-woks-of-life-ee283880a0': {
    title: 'How to fold dumplings',
    url: 'https://thewoksoflife.com/how-to-fold-a-chinese-dumpling/',
    publisher: 'The Woks of Life',
  },
  'kikkoman-corporation-6d02ebf4a4': {
    title: 'Making nori-maki',
    url: 'https://www.kikkoman.com/en/culture/foodforum/japanese-style/26-1.html',
    publisher: 'Kikkoman Corporation',
  },
  'the-butter-museum-e7ea7c5a6c': {
    title: 'Making butter in a jam jar',
    url: 'https://thebuttermuseum.com/resources/schools/',
    publisher: 'The Butter Museum',
  },
  'pacific-science-center-f314b057da': {
    title: 'Ice cream in a bag',
    url: 'https://pacificsciencecenter.org/resources/ice-cream-bag/',
    publisher: 'Pacific Science Center',
  },
  'king-arthur-baking-da12d19cdc': {
    title: 'How to temper chocolate',
    url: 'https://www.kingarthurbaking.com/how-to-temper-chocolate',
    publisher: 'King Arthur Baking',
  },
  'king-arthur-baking-f962b7a886': {
    title: 'Decorating cookies',
    url: 'https://www.kingarthurbaking.com/learn/guides/cookie-decorating',
    publisher: 'King Arthur Baking',
  },
  'love-food-hate-waste-new-zealand-9a95a33739': {
    title: 'Easy Choice: make your own stock',
    url: 'https://lovefoodhatewaste.co.nz/wp-content/uploads/2018/06/Winter-Easy-Choice-Mobile.pdf',
    publisher: 'Love Food Hate Waste New Zealand',
  },
  'nsw-environment-protection-authority-38330d4017': {
    title: 'Pantry stocktake challenge',
    url: 'https://www.lovefoodhatewaste.nsw.gov.au/news/pantry-stocktake-challenge',
    publisher: 'NSW Environment Protection Authority, Love Food Hate Waste',
  },
  'kikkoman-corporation-312f379d16': {
    title: 'Bento recipes in the Global Cookbook',
    url: 'https://www.kikkoman.com/en/news/2026/20260427_1486.html',
    publisher: 'Kikkoman Corporation',
  },
  'sanjeev-kapoor-khazana-0183fe7359': {
    title: 'Khaman dhokla: demonstrated recipe',
    url: 'https://www.youtube.com/watch?v=5N_TyyaWmYc',
    publisher: 'Sanjeev Kapoor Khazana',
  },
  'institute-of-culinary-education-1745bf26d1': {
    title: 'Knife Skills I',
    url: 'https://www.ice.edu/blog/knife-skills-i',
    publisher: 'Institute of Culinary Education',
  },
  'the-sikh-coalition-9d2830548e': {
    title: 'The gurdwara and tradition of langar',
    url: 'https://www.sikhcoalition.org/resources/sikh-house-worship-gurdwara-tradition-langar/',
    publisher: 'The Sikh Coalition',
  },
  'slow-food-98c4104385': {
    title: 'Journey to the origins of taste',
    url: 'https://www.slowfood.com/blog-and-news/journey-to-the-origins-of-taste/',
    publisher: 'Slow Food',
  },
  'slow-food-5a997b247e': {
    title: 'Taste workshops and food education',
    url: 'https://www.slowfood.com/it/education/',
    publisher: 'Slow Food',
  },
  'smithsonian-national-museum-of-ameri-042bd51665': {
    title: 'FOOD: transforming the American table',
    url: 'https://www.americanhistory.si.edu/explore/exhibitions/food',
    publisher: 'Smithsonian National Museum of American History',
  },
  'unesco-intangible-cultural-heritage-e2d8dbf05e': {
    title: 'Knowledge and practices of couscous',
    url: 'https://ich.unesco.org/en/RL/knowledge-know-how-and-practices-pertaining-to-the-production-and-consumption-of-couscous-01602',
    publisher: 'UNESCO Intangible Cultural Heritage',
  },
  'king-arthur-baking-ff3c5fb371': {
    title: 'Laminated dough',
    url: 'https://www.kingarthurbaking.com/blog/2014/07/29/laminated-dough',
    publisher: 'King Arthur Baking',
  },
  'exploratorium-093d1c0077': {
    title: 'Rock candy recipe',
    url: 'https://annex.exploratorium.edu/cooking/bread/recipe-rockcandy.html',
    publisher: 'Exploratorium',
  },
  'king-arthur-baking-e6f2e514c4': {
    title: 'Cream puffs and éclairs',
    url: 'https://www.kingarthurbaking.com/recipes/cream-puffs-and-eclairs-recipe',
    publisher: 'King Arthur Baking',
  },
  'king-arthur-baking-recipe-by-erin-je-19645ad8df': {
    title: 'Strudel dough',
    url: 'https://www.kingarthurbaking.com/recipes/strudel-dough-recipe',
    publisher: 'King Arthur Baking; recipe by Erin Jeanne McDowell',
  },
  'modernist-pantry-f6c0da8a3b': {
    title: 'Direct spherification kit',
    url: 'https://modernistpantry.com/products/direct-spherification-kit.html',
    publisher: 'Modernist Pantry',
  },
  'king-arthur-baking-3b0f475acb': {
    title: 'Mill your own flour',
    url: 'https://www.kingarthurbaking.com/blog/2017/04/24/mill-your-own-flour',
    publisher: 'King Arthur Baking',
  },
  'uk-tea-academy-c5b2d95076': {
    title: 'Tea and food pairing',
    url: 'https://www.ukteaacademy.co.uk/units/tea-food-pairing/',
    publisher: 'UK Tea Academy',
  },
  'uc-berkeley-greater-good-science-cen-1229ab0050': {
    title: 'Active listening',
    url: 'https://ggia.berkeley.edu/practice/active_listening',
    publisher: 'UC Berkeley Greater Good Science Center',
  },
  'uc-berkeley-greater-good-science-cen-73385481b6': {
    title: 'Feeling connected',
    url: 'https://ggia.berkeley.edu/practice/feeling_connected',
    publisher: 'UC Berkeley Greater Good Science Center',
  },
  'playlist-for-life-25fce5bcb3': {
    title: 'Group music activities',
    url: 'https://playlistforlife.org.uk/wp-content/uploads/2025/01/Group-Activities-for-Help-Points-April-2022.pdf',
    publisher: 'Playlist for Life',
  },
  'traditional-games-federation-of-indi-620183564b': {
    title: 'Traditional games: carrom',
    url: 'https://www.traditionalgamesindia.com/games-list/carrom/',
    publisher: 'Traditional Games Federation of India',
  },
  'university-of-california-santa-cruz-f9f58fa5af': {
    title: 'Housemate communication and conflict resolution',
    url: 'https://communityrentals.ucsc.edu/living/housemate-conflict/',
    publisher: 'University of California, Santa Cruz',
  },
  'forever-edinburgh-and-euan-s-guide-e2003ca679': {
    title: 'Accessible highlights guide',
    url: 'https://edinburgh.org/accessiblehighlights/',
    publisher: 'Forever Edinburgh and Euan’s Guide',
  },
  'the-moth-432b850925': {
    title: 'Storytelling tips and tricks',
    url: 'https://www.themoth.org/tell-your-story/storytelling-tips-tricks',
    publisher: 'The Moth',
  },
  'federation-of-calgary-communities-ja-6fe7523892': {
    title: 'Lead a Jane’s Walk',
    url: 'https://janeswalk.calgarycommunities.com/lead-a-walk/',
    publisher: 'Federation of Calgary Communities, Jane’s Walk',
  },
  'library-of-congress-b7ff346f52': {
    title: 'Preserving your family treasures',
    url: 'https://www.loc.gov/preservation/family/',
    publisher: 'Library of Congress',
  },
  'us-national-weather-service-90eeea90c0': {
    title: 'Family communications plan',
    url: 'https://www.weather.gov/owlie/communicationsplan',
    publisher: 'US National Weather Service',
  },
  'repair-caf-international-377f7069c0': {
    title: 'What is a Repair Café?',
    url: 'https://www.repaircafe.org/en/about/',
    publisher: 'Repair Café International',
  },
  'fashion-revolution-af57517ddb': {
    title: 'Clothes swap',
    url: 'https://www.fashionrevolution.org/clothes-swap/',
    publisher: 'Fashion Revolution',
  },
  'folger-shakespeare-library-a146d55558': {
    title: 'Twelfth Night: complete play',
    url: 'https://www.folger.edu/explore/shakespeares-works/twelfth-night/read/',
    publisher: 'Folger Shakespeare Library',
  },
  'minecraft-education-2135bdc775': {
    title: 'Village Square: build together',
    url: 'https://education.minecraft.net/en-us/blog/village-square-minecraft-civics',
    publisher: 'Minecraft Education',
  },
  'uc-berkeley-greater-good-science-cen-c77d4dffb7': {
    title: 'Question exchange practice',
    url: 'https://ggia.berkeley.edu/practice/36_questions_for_increasing_closeness',
    publisher: 'UC Berkeley Greater Good Science Center',
  },
  'museum-of-contemporary-art-australia-cb4470c548': {
    title: 'Portrait versus self-portrait',
    url: 'https://www.mca.com.au/files/documents/Activity-DGCF-portrait-vs-self-portrait.pdf',
    publisher: 'Museum of Contemporary Art Australia',
  },
  'unesco-intangible-cultural-heritage-f6454311bd': {
    title: 'Garba of Gujarat',
    url: 'https://ich.unesco.org/en/RL/garba-of-gujarat-01962',
    publisher: 'UNESCO Intangible Cultural Heritage',
  },
  'the-museum-of-modern-art-f74fc4dc99': {
    title: 'Exquisite corpse drawing activity',
    url: 'https://www.moma.org/momaorg/shared/pdfs/docs/learn/mondays/Jake-and-Dinos-Chapman-exquisite-corpse.pdf',
    publisher: 'The Museum of Modern Art',
  },
  'the-ramblers-3c076d18f2': {
    title: 'Walk leader handbook',
    url: 'https://cdn.ramblers.org.uk/media/files/walk-leader-handbook.pdf',
    publisher: 'The Ramblers',
  },
  'the-scout-association-94b8a18b1e': {
    title: 'Make friendship bracelets',
    url: 'https://cms.scouts.org.uk/media/12674/spring-2018.pdf',
    publisher: 'The Scout Association',
  },
  'silent-book-club-da60e72d95': {
    title: 'How shared silent reading works',
    url: 'https://silentbook.club/pages/about-us',
    publisher: 'Silent Book Club',
  },
  'indian-carrom-federation-a0ac57388e': {
    title: 'Laws of carrom',
    url: 'https://www.indiancarrom.co.in/laws-of-carrom/',
    publisher: 'Indian Carrom Federation',
  },
  'american-mah-jongg-association-07571381b1': {
    title: 'American Mah Jongg rules',
    url: 'https://www.americanmahjonggassociation.com/american-mah-jongg-rules',
    publisher: 'American Mah Jongg Association',
  },
  'sacred-harp-musical-heritage-associa-80fd987887': {
    title: 'Resources for Sacred Harp singing',
    url: 'https://fasola.org/resources/',
    publisher: 'Sacred Harp Musical Heritage Association',
  },
  'unesco-intangible-cultural-heritage-12b4242d8d': {
    title: 'Iftar and its sociocultural traditions',
    url: 'https://ich.unesco.org/en/RL/iftar-eftari-iftar-iftor-and-its-socio-cultural-traditions-01984',
    publisher: 'UNESCO Intangible Cultural Heritage',
  },
  'aurora-s-degree-and-pg-college-0273ee7926': {
    title: 'Cultural event rules: antakshari',
    url: 'https://www.agdc.ac.in/pdf/rules_of_the_events.pdf',
    publisher: 'Aurora’s Degree and PG College',
  },
  'the-human-library-organization-91d37d4c19': {
    title: 'The Human Library concept and programmes',
    url: 'https://humanlibrary.org/',
    publisher: 'The Human Library Organization',
  },
  'remo-music-center-4d0cb78cf3': {
    title: 'Community drum circle',
    url: 'https://remo.com/rmc',
    publisher: 'Remo Music Center',
  },
  'us-national-park-service-activity-by-4f6f5cc251': {
    title: 'Sound mapping activity',
    url: 'https://www.nps.gov/common/uploads/teachers/lessonplans/Sound%20Mapping%20Activity.pdf',
    publisher: 'US National Park Service; activity by Sarah Hooper',
  },
  'the-museum-of-modern-art-62dd888a56': {
    title: 'Slow looking',
    url: 'https://www.moma.org/visit/itineraries/slow-looking',
    publisher: 'The Museum of Modern Art',
  },
  'tate-a81af3d3c7': {
    title: 'Go on a colour walk',
    url: 'https://www.tate.org.uk/kids/make/cut-paste/go-on-colour-walk',
    publisher: 'Tate',
  },
  'san-francisco-museum-of-modern-art-19a5485545': {
    title: 'Blind contour drawing and looking',
    url: 'https://www.sfmoma.org/read/turning-a-blind-eye-on-vija-celmins-describing-redescription/',
    publisher: 'San Francisco Museum of Modern Art',
  },
  'classic-album-sundays-427142e4bc': {
    title: 'Uninterrupted album listening',
    url: 'https://classicalbumsundays.com/about/',
    publisher: 'Classic Album Sundays',
  },
  'imbali-visual-literacy-project-389d6ca738': {
    title: 'Exploring through touch',
    url: 'https://imbaliartbooks.org.za/exploring-through-touch/',
    publisher: 'Imbali Visual Literacy Project',
  },
  'curiodyssey-52abd7b9d3': {
    title: 'How to do shadow tracing',
    url: 'https://curiodyssey.org/wp-content/uploads/2020/05/Science-Experiment-ShadowTracing.pdf',
    publisher: 'CuriOdyssey',
  },
  'nasa-goddard-space-flight-center-ea4ba5d2cf': {
    title: 'Changing shadows',
    url: 'https://science.gsfc.nasa.gov/attic/sunearthday.nasa.gov/2007/materials/changing_shadows.pdf',
    publisher: 'NASA Goddard Space Flight Center',
  },
  'sensory-trust-2efb45b0e1': {
    title: 'Sensory gardens design guide',
    url: 'https://www.sensorytrust.org.uk/resources/guidance/sensory-gardens-design-guide',
    publisher: 'Sensory Trust',
  },
  'ucla-mindful-7d79b4a96e': {
    title: 'Free guided meditations',
    url: 'https://www.uclahealth.org/uclamindful/free-guided-meditations',
    publisher: 'UCLA Mindful',
  },
  'uc-berkeley-greater-good-science-cen-23fb8627ad': {
    title: 'Raisin meditation',
    url: 'https://ggia.berkeley.edu/practice/raisin_meditation',
    publisher: 'UC Berkeley Greater Good Science Center',
  },
  'the-wild-center-8d642558a3': {
    title: 'Nature from your window challenge',
    url: 'https://www.wildcenter.org/wp-content/uploads/2023/05/Nature-from-you-Window-Challenge.pdf',
    publisher: 'The Wild Center',
  },
  'royal-collection-trust-5d5bff0748': {
    title: 'Art for wellbeing: arranging objects',
    url: 'https://www.rct.uk/resources/art-for-wellbeing',
    publisher: 'Royal Collection Trust',
  },
  'virginia-museum-of-history-culture-80b0b98043': {
    title: 'Museum of You',
    url: 'https://virginiahistory.org/sites/default/files/VMHC%20-%20Museum%20Of%20You.pdf',
    publisher: 'Virginia Museum of History & Culture',
  },
  'the-museum-of-modern-art-13b4289582': {
    title: 'Zarina: draw your memory of home',
    url: 'https://www.moma.org/momaorg/shared/pdfs/docs/learn/mondays/Zarina-Draw-your-memory-of-home.pdf',
    publisher: 'The Museum of Modern Art',
  },
  'the-scout-association-d04a4d68a1': {
    title: 'Put together a reading tree',
    url: 'https://www.scouts.org.uk/activities/put-together-a-reading-tree/',
    publisher: 'The Scout Association',
  },
  'good-judgment-open-ab4813dfb0': {
    title: 'Forecasting and keeping score',
    url: 'https://www.gjopen.com/faq',
    publisher: 'Good Judgment Open',
  },
  'world-health-organization-ebcd92add5': {
    title: 'Guidance for after action review',
    url: 'https://www.who.int/publications/i/item/WHO-WHE-CPI-2019.4',
    publisher: 'World Health Organization',
  },
  'university-of-edinburgh-b879f616cc': {
    title: 'Reflecting on progress',
    url: 'https://www.sps.ed.ac.uk/students/development-hub/undergraduate/development-toolkit/step-3-reflecting',
    publisher: 'University of Edinburgh',
  },
  'us-national-archives-efe78d739a': {
    title: 'Preserving scrapbooks',
    url: 'https://www.archives.gov/publications/prologue/2015/winter/scrapbooks.html',
    publisher: 'US National Archives',
  },
  'european-centre-for-modern-languages-7572a8e86a': {
    title: 'PEPELINO: language portrait',
    url: 'https://www.ecml.at/portals/1/mtp4/pepelino/pepelino-en-web.pdf',
    publisher: 'European Centre for Modern Languages, Council of Europe',
  },
  'storycorps-e95629a9d3': {
    title: 'Tips for a great conversation',
    url: 'https://storycorps.org/participate/tips-for-a-great-conversation/',
    publisher: 'StoryCorps',
  },
  'us-national-park-service-fae1731709': {
    title: 'How to read an object',
    url: 'https://www.nps.gov/articles/000/how-to-read-an-object.htm',
    publisher: 'US National Park Service',
  },
  'us-national-archives-8843c71a2b': {
    title: 'Preservation and identification of photographs',
    url: 'https://www.archives.gov/preservation/holdings-maintenance/photographs',
    publisher: 'US National Archives',
  },
  'library-of-congress-1c3cd4cc65': {
    title: 'Personal digital archiving',
    url: 'https://www.digitalpreservation.gov/personalarchiving/',
    publisher: 'Library of Congress',
  },
  'department-of-telecommunications-gov-649f875963': {
    title: 'Earn an amateur-radio license in your country',
    url: 'https://eservices.dot.gov.in/amateur-station-operator-certificate-asoc',
    publisher: 'Department of Telecommunications, Government of India',
  },
  'american-red-cross-6362ec5656': {
    title: 'Complete an in-person first-aid and CPR course',
    url: 'https://www.redcross.org/take-a-class/first-aid/first-aid-training',
    publisher: 'American Red Cross',
  },
  'nasa-0aef6d4bfb': {
    title: 'Analyze an exoplanet transit with real telescope data',
    url: 'https://science.nasa.gov/citizen-science/exoplanet-watch/exoplanet-watch-faqs/',
    publisher: 'NASA',
  },
  'nasa-radio-jove-2573cb29d6': {
    title: 'Build a Radio JOVE receiver with a radio club',
    url: 'https://radiojove.gsfc.nasa.gov/kits/',
    publisher: 'NASA Radio JOVE',
  },
  'nasa-6b83e00c8d': {
    title: 'Map impact-melt features on the Moon',
    url: 'https://science.nasa.gov/citizen-science/lunar-melt/',
    publisher: 'NASA',
  },
  'exploratorium-e5e1cc07ae': {
    title: 'Build and troubleshoot a battery-powered switch circuit',
    url: 'https://www.exploratorium.edu/tinkering/projects/circuit-boards',
    publisher: 'Exploratorium',
  },
  'makey-makey-dccc6e069f': {
    title: 'Control a Scratch project with a physical object',
    url: 'https://makeymakey.com/blogs/how-to-instructions/getting-started-with-scratch',
    publisher: 'Makey Makey',
  },
  'ilford-photo-87007a66b4': {
    title: 'Make a pinhole camera and develop a photograph',
    url: 'https://www.ilfordphoto.com/pinhole/?___from_store=ilford_uk&___store=ilford_brochure',
    publisher: 'ILFORD Photo',
  },
  'nasa-ff7436a1c4': {
    title: 'Build a sundial and compare it with clock time',
    url: 'https://science.nasa.gov/learn/heat/resource/create-a-sundial-activity/',
    publisher: 'NASA',
  },
  'exploratorium-7df9d55ab7': {
    title: 'Build a spectroscope and compare household lights',
    url: 'https://www.exploratorium.edu/snacks/cd-spectroscope',
    publisher: 'Exploratorium',
  },
  'vernier-science-education-67459d6a17': {
    title: 'Measure the speed of sound with a repeatable experiment',
    url: 'https://www.vernier.com/experiment/pep-28_speed-of-sound/',
    publisher: 'Vernier Science Education',
  },
  'science-buddies-826aab85d8': {
    title: 'Investigate a pendulum with timed trials',
    url: 'https://www.sciencebuddies.org/science-fair-projects/project-ideas/Phys_p016/physics/pendulum-motion?id=427',
    publisher: 'Science Buddies',
  },
  'oregon-state-university-84ed1b6a44': {
    title: 'Build a tabletop seismograph',
    url: 'https://smile.oregonstate.edu/lesson/seismograph-build',
    publisher: 'Oregon State University',
  },
  'micro-bit-educational-foundation-2e8f12b18d': {
    title: 'Program a small digital weather station',
    url: 'https://microbit.org/news/2020-07-06/make-a-microbit-weather-station/',
    publisher: 'Micro:bit Educational Foundation',
  },
  'science-buddies-09018a0ed9': {
    title: 'Test a paper glider with controlled design changes',
    url: 'https://www.sciencebuddies.org/science-fair-projects/project-ideas/Aero_p046/aerodynamics-hydrodynamics/how-far-will-paper-planes-fly?id=2025',
    publisher: 'Science Buddies',
  },
  'science-buddies-3fb750886d': {
    title: 'Build a solar oven and chart its heating',
    url: 'https://www.sciencebuddies.org/stem-activities/solar-oven',
    publisher: 'Science Buddies',
  },
  'nasa-jet-propulsion-laboratory-93538a7f4d': {
    title: 'Build a model water filter and measure what changes',
    url: 'https://www.jpl.nasa.gov/edu/resources/project/make-a-water-filter/',
    publisher: 'NASA Jet Propulsion Laboratory',
  },
  'university-of-auckland-eafec037d5': {
    title: "Program Conway's Game of Life",
    url: 'https://www.math.auckland.ac.nz/mathwiki/images/1/11/190_Lecture_17_Slides.pdf',
    publisher: 'University of Auckland',
  },
  'google-creative-lab-b725bd4fb2': {
    title: 'Train a small image classifier on your own objects',
    url: 'https://teachablemachine.withgoogle.com/',
    publisher: 'Google Creative Lab',
  },
  'nand-to-tetris-f8ec307c06': {
    title: 'Build logic gates in a circuit simulator',
    url: 'https://www.nand2tetris.org/project01',
    publisher: 'Nand to Tetris',
  },
  'arrl-e51f79097d': {
    title: 'Send and receive a short Morse-code message',
    url: 'https://www.arrl.org/learning-morse-code',
    publisher: 'ARRL',
  },
  'u-s-naval-observatory-573cc4c5b9': {
    title: 'Celestial navigation data and correction notes',
    url: 'https://aa.usno.navy.mil/data/celnav',
    publisher: 'U.S. Naval Observatory',
  },
  'nasa-my-nasa-data-a9e5588a1e': {
    title: 'Compare a place across two satellite images',
    url: 'https://mynasadata.larc.nasa.gov/basic-page/guide-using-nasa-worldview-classroom',
    publisher: 'NASA My NASA Data',
  },
  'united-states-geological-survey-08dc25c48b': {
    title: 'Plot a week of public earthquake records',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php',
    publisher: 'United States Geological Survey',
  },
  'mineralogical-society-of-america-017a99dec7': {
    title: 'Identify a small mineral collection using observable properties',
    url: 'https://min4kids.org/properties',
    publisher: 'Mineralogical Society of America',
  },
  'nasa-jet-propulsion-laboratory-ca96baebe3': {
    title: "Build a model of the Moon's phases",
    url: 'https://www.jpl.nasa.gov/edu/resources/lesson-plan/moon-phases/',
    publisher: 'NASA Jet Propulsion Laboratory',
  },
  'american-geosciences-institute-7fe85e37ea': {
    title: 'Grow salt crystals and keep a measurement record',
    url: 'https://www.earthsciweek.org/resources/classroom-activities/grow-your-own-crystals/',
    publisher: 'American Geosciences Institute',
  },
  'exploratorium-e726f8dac2': {
    title: 'Extract fruit DNA in an educational workshop',
    url: 'https://www.exploratorium.edu/sites/default/files/dna.pdf',
    publisher: 'Exploratorium',
  },
  'university-of-warwick-c74ab8df6c': {
    title: 'Separate pen inks with paper chromatography',
    url: 'https://warwick.ac.uk/fac/sci/chemistry/outreach/primary/inkchromatography/ink_chromatography_experiment_instructions.pdf',
    publisher: 'University of Warwick',
  },
  'science-buddies-deb1cd6cce': {
    title: 'Build a fruit battery and measure its output',
    url: 'https://www.sciencebuddies.org/stem-activities/lemon-battery',
    publisher: 'Science Buddies',
  },
  'united-states-environmental-protecti-5903c51e45': {
    title: 'Air sensor collocation and evaluation',
    url: 'https://www.epa.gov/air-sensor-toolbox/air-sensor-collocation',
    publisher: 'United States Environmental Protection Agency',
  },
  'neil-squire-makers-making-change-05e0fc80f2': {
    title: 'Make a low-voltage accessibility switch with a mentor',
    url: 'https://www.makersmakingchange.com/product/light-touch-switch/01tJR00000068zTYAQ',
    publisher: 'Neil Squire / Makers Making Change',
  },
  'university-of-canterbury-cs-unplugge-6e93b0f98e': {
    title: 'Compare two sorting algorithms on the same dataset',
    url: 'https://classic.csunplugged.org/documents/books/english/unplugged-book-v1.pdf',
    publisher: 'University of Canterbury / CS Unplugged',
  },
  'our-world-in-data-260c13b3da': {
    title: 'Reproduce one chart from an open dataset',
    url: 'https://docs.owid.io/projects/etl/api/chart-api/',
    publisher: 'Our World in Data',
  },
  'sparkfun-electronics-cbb4ac6cd3': {
    title: 'Design and 3D-print a small functional bracket',
    url: 'https://learn.sparkfun.com/tutorials/getting-started-with-3d-printing-using-tinkercad/modeling-in-tinkercad',
    publisher: 'SparkFun Electronics',
  },
  'british-horological-institute-fa84103c13': {
    title: 'Basic Clock: five-day beginner course',
    url: 'https://bhi.co.uk/courses/bcc',
    publisher: 'British Horological Institute',
  },
  'repair-cafe-foundation-0cedf9b42b': {
    title: 'Help host a neighborhood Repair Cafe session',
    url: 'https://www.repaircafe.org/en/join/become-a-volunteer/',
    publisher: 'Repair Cafe Foundation',
  },
  'humanitarian-openstreetmap-team-42b741216a': {
    title: 'Trace buildings for a humanitarian mapping task',
    url: 'https://www.hotosm.org/en/projects/missing-maps/',
    publisher: 'Humanitarian OpenStreetMap Team',
  },
  'smithsonian-institution-3a29292dd1': {
    title: 'Transcribe a historical manuscript for the Smithsonian',
    url: 'https://transcription.si.edu/faqs',
    publisher: 'Smithsonian Institution',
  },
  'librivox-9d7c4422c6': {
    title: 'Record a public-domain audiobook chapter',
    url: 'https://librivox.org/pages/volunteer-for-librivox/',
    publisher: 'LibriVox',
  },
  'sozialhelden-0d83ca09ad': {
    title: 'Document access details for public places on Wheelmap',
    url: 'https://news.wheelmap.org/en/FAQ/',
    publisher: 'Sozialhelden',
  },
  'free-software-foundation-europe-b6c14f3665': {
    title: 'FSFE translator participation and review guide',
    url: 'https://fsfe.org/contribute/translators/translators.en.html',
    publisher: 'Free Software Foundation Europe',
  },
  'mozilla-data-collective-8dc858f8aa': {
    title: 'Contribute speech recordings to Common Voice',
    url: 'https://mozilladatacollective.com/contribute-language',
    publisher: 'Mozilla Data Collective',
  },
  'computercorps-78f2d59dc6': {
    title: 'Support a computer-learning session through a community program',
    url: 'https://www.computercorps.org/volunteer/',
    publisher: 'ComputerCorps',
  },
  'royal-society-for-the-protection-of--a488b72029': {
    title: 'Install a locally appropriate wildlife shelter with expert advice',
    url: 'https://www.rspb.org.uk/helping-nature/what-you-can-do/activities/build-a-birdbox',
    publisher: 'Royal Society for the Protection of Birds',
  },
  'cocorahs-3fb14d3031': {
    title: 'Submit a month of rain-gauge observations to a science network',
    url: 'https://www.cocorahs.org/Content.aspx?page=welcometococorahs',
    publisher: 'CoCoRaHS',
  },
  'cornell-lab-of-ornithology-dd35109fb6': {
    title: 'Submit a complete bird checklist to eBird',
    url: 'https://support.ebird.org/en/support/solutions/articles/48001158707-get-started-with-ebird',
    publisher: 'Cornell Lab of Ornithology',
  },
  'inaturalist-eadd812ca8': {
    title: 'Document a wild species for iNaturalist',
    url: 'https://www.inaturalist.org/pages/add-an-observation-nz',
    publisher: 'iNaturalist',
  },
  'australian-museum-frogid-5ad2bc8dcc': {
    title: 'Record frog calls for FrogID in Australia',
    url: 'https://portal.frogid.net.au/participate/faq/',
    publisher: 'Australian Museum FrogID',
  },
  'butterfly-conservation-9b1a978357': {
    title: 'Take part in a seasonal butterfly count',
    url: 'https://butterfly-conservation.org/news-and-blog/big-butterfly-count-2025-is-underway',
    publisher: 'Butterfly Conservation',
  },
  'the-globe-program-nasa-36222ebd16': {
    title: 'Match cloud observations to satellite science',
    url: 'https://www.globe.gov/en/web/globe-observer/do-globe-observer/clouds',
    publisher: 'The GLOBE Program / NASA',
  },
  'human-computation-institute-stall-ca-73b2d6fe32': {
    title: 'Help classify research images with Stall Catchers',
    url: 'https://stallcatchers.com/about',
    publisher: 'Human Computation Institute / Stall Catchers',
  },
  'folding-home-a41a3a3a28': {
    title: 'Donate spare computing time to a distributed research project',
    url: 'https://foldingathome.org/download',
    publisher: 'Folding@home',
  },
  'distributed-proofreaders-a5958dedc9': {
    title: 'Proofread a public-domain book page for Project Gutenberg',
    url: 'https://www.pgdp.net/c/',
    publisher: 'Distributed Proofreaders',
  },
  'w3c-web-accessibility-initiative-c10e0ab80d': {
    title: 'Easy Checks: a first review of web accessibility',
    url: 'https://www.w3.org/WAI/test-evaluate/easy-checks/',
    publisher: 'W3C Web Accessibility Initiative',
  },
  'be-my-eyes-aa5a002555': {
    title: 'Take a volunteer call through Be My Eyes',
    url: 'https://www.bemyeyes.com/be-my-eyes-volunteer-hub/',
    publisher: 'Be My Eyes',
  },
  'united-nations-volunteers-481888efbc': {
    title: 'UNV online-volunteering eligibility and assignment rules',
    url: 'https://www.unv.org/become-online-volunteer?page=1',
    publisher: 'United Nations Volunteers',
  },
  'feeding-america-feaa1973bb': {
    title: 'Sort supplies during a food-bank volunteer shift',
    url: 'https://www.feedingamerica.org/take-action/volunteer',
    publisher: 'Feeding America',
  },
  'peggy-adams-animal-rescue-league-dae3058a34': {
    title: 'Prepare enrichment materials for an animal shelter',
    url: 'https://peggyadams.org/help/get-involved/become-a-volunteer/',
    publisher: 'Peggy Adams Animal Rescue League',
  },
  'city-of-hayward-public-library-0affefd586': {
    title: 'Help catalog seeds at a community seed library',
    url: 'https://hayward-ca.gov/public-library/using-library/seed-lending',
    publisher: 'City of Hayward Public Library',
  },
  'citrus-county-library-system-855455c2e3': {
    title: 'Help repair library books under staff supervision',
    url: 'https://www.citruslibraries.org/support-us/volunteer/volunteer-positions/',
    publisher: 'Citrus County Library System',
  },
  'forestplanet-and-tree-friends-united-baba701bd6': {
    title: 'Organized invasive-vine clearing at Glen Echo Park',
    url: 'https://events.humanitix.com/de-vine',
    publisher: 'ForestPlanet and Tree Friends United',
  },
  'michigan-audubon-87e5a2c76e': {
    title: 'Join a bird-safe-building monitoring route',
    url: 'https://www.michiganaudubon.org/conservation/bird-window-collisions/',
    publisher: 'Michigan Audubon',
  },
  'project-linus-b13de9526b': {
    title: 'Make a requested item for a hospital craft program',
    url: 'https://www.projectlinus.org/volunteer.php',
    publisher: 'Project Linus',
  },
  'british-orienteering-70adb79ab2': {
    title: 'Navigate a beginner orienteering course with a paper map',
    url: 'https://www.britishorienteering.org.uk/newcomers_guide',
    publisher: 'British Orienteering',
  },
  'parks-canada-ad9cc23d69': {
    title: 'Find a permitted geocache near home',
    url: 'https://parks.canada.ca/voyage-travel/experiences/sports/geocachette-geocaching',
    publisher: 'Parks Canada',
  },
  'geocaching-hq-d7b5274621': {
    title: 'Complete an EarthCache geology field challenge',
    url: 'https://www.geocaching.com/help/index.php?id=25&pg=kb.printer.friendly',
    publisher: 'Geocaching HQ',
  },
  'california-academy-of-sciences-dbf12e8e73': {
    title: 'Explore a tidepool with a naturalist',
    url: 'https://www.calacademy.org/community-science/californias-tidepools/tidepooling-101',
    publisher: 'California Academy of Sciences',
  },
  'british-caving-association-cb1847a2fd': {
    title: 'Take a supervised introductory caving trip',
    url: 'https://british-caving.org.uk/new-to-caving/',
    publisher: 'British Caving Association',
  },
  'archery-gb-0e7b643b5e': {
    title: 'Try target archery at a supervised range',
    url: 'https://archerygb.org/get-involved/archery-for-beginners',
    publisher: 'Archery GB',
  },
  'bat-conservation-trust-7369677c5d': {
    title: 'Join a dusk bat walk with a detector',
    url: 'https://www.bats.org.uk/about-bats/where-do-bats-live/where-to-see-bats',
    publisher: 'Bat Conservation Trust',
  },
  'canal-river-trust-cd8bb232d0': {
    title: 'Take a sheltered-water paddleboard starter lesson',
    url: 'https://canalrivertrust.org.uk/things-to-do/canoeing-and-kayaking-near-me/starting-canoeing-kayaking-or-paddleboarding',
    publisher: 'Canal & River Trust',
  },
  'the-scout-association-f517ecdb22': {
    title: 'Build a kite and test it in an open park',
    url: 'https://www.scouts.org.uk/activities/make-and-fly-a-kite/',
    publisher: 'The Scout Association',
  },
  'national-trust-ccab6e3f52': {
    title: 'Build and dismantle a small outdoor den',
    url: 'https://www.nationaltrust.org.uk/visit/50-things/no.-4-build-a-den',
    publisher: 'National Trust',
  },
  'british-cycling-b4066a6b42': {
    title: 'Ride a velodrome in a coached beginner session',
    url: 'https://www.britishcycling.org.uk/knowledge/skills/get-started/article/izn20150827-Track-Get-into--Track-Cycling-0',
    publisher: 'British Cycling',
  },
  'perth-curling-6bcc33871d': {
    title: 'Try curling at a supervised ice-rink taster',
    url: 'https://www.perthcurling.com/try-curling/',
    publisher: 'Perth Curling',
  },
  'natural-history-museum-london-24af2fdeed': {
    title: 'Join a fossil walk led by a local geologist',
    url: 'https://www.nhm.ac.uk/discover/how-to-find-fossils-on-the-beach.html',
    publisher: 'Natural History Museum, London',
  },
  'british-mountaineering-council-ddac4308ff': {
    title: 'Take an introductory indoor bouldering lesson',
    url: 'https://services.thebmc.co.uk/the-basics-climbing-indoors',
    publisher: 'British Mountaineering Council',
  },
  'tree-climbing-planet-e40c50a9f0': {
    title: 'Open Public Climbs',
    url: 'https://treeclimbingplanet.com/experiences-2/open-public-climbs/',
    publisher: 'Tree Climbing Planet',
  },
  'transport-for-london-1885d7bfd5': {
    title: 'Make a local walking loop using a public ferry',
    url: 'https://tfl.gov.uk/modes/river/',
    publisher: 'Transport for London',
  },
  'national-moth-week-a7ec365078': {
    title: 'Join a moth-recording evening with a nature group',
    url: 'https://nationalmothweek.org/about/nmw-in-the-news/nmw-2026-news-release/',
    publisher: 'National Moth Week',
  },
  'yorkshire-dales-national-park-author-0145d95eb5': {
    title: 'Explore a nature trail using an all-terrain wheelchair',
    url: 'https://www.yorkshiredales.org.uk/all-terrain-wheelchair-launched-at-malham/',
    publisher: 'Yorkshire Dales National Park Authority',
  },
  'mer-et-rencontres-14a40eab9a': {
    title: 'Take a beginner land-yachting lesson',
    url: 'https://www.meretrencontres.com/en/sand-yachting-courses-and-fees/',
    publisher: 'Mer et Rencontres',
  },
  'the-escape-game-ceac3fc4bd': {
    title: 'Solve an escape room with a small team',
    url: 'https://theescapegame.com/blog/what-is-an-escape-room/',
    publisher: 'The Escape Game',
  },
  'nhs-501571d18d': {
    title: 'Try a short seated movement session',
    url: 'https://www.nhs.uk/live-well/exercise/sitting-exercises/',
    publisher: 'NHS',
  },
  'tai-chi-union-for-great-britain-9ac3bc653e': {
    title: 'Attend a beginner tai chi session',
    url: 'https://www.taichiunion.com/tai-chi-instructors/',
    publisher: 'Tai Chi Union for Great Britain',
  },
  'swim-england-3bf4324fe3': {
    title: 'Try a supervised water-aerobics class',
    url: 'https://www.swimming.org/justswim/aqua-aerobics-benefits-equipment/',
    publisher: 'Swim England',
  },
  'nhs-e4799d385a': {
    title: 'Take a beginner Pilates class',
    url: 'https://www.nhs.uk/live-well/exercise/pilates-and-yoga/pilates-for-beginners/',
    publisher: 'NHS',
  },
  'nhs-4ce9f6ddb5': {
    title: 'Learn a short supported balance routine',
    url: 'https://www.nhs.uk/live-well/exercise/balance-exercises/',
    publisher: 'NHS',
  },
  'australian-sports-commission-298fb1202e': {
    title: 'Sports Ability: Boccia activity card',
    url: 'https://www.ausport.gov.au/schools/resource-hub/sports_ability',
    publisher: 'Australian Sports Commission',
  },
  'australian-sports-commission-c6bda0c390': {
    title: 'Sports Ability: Goalball activity card',
    url: 'https://www.ausport.gov.au/schools/resource-hub/sports_ability',
    publisher: 'Australian Sports Commission',
  },
  'australian-sports-commission-f4e55f1ec7': {
    title: 'Sports Ability: Sitting Volleyball activity card',
    url: 'https://www.ausport.gov.au/schools/resource-hub/sports_ability',
    publisher: 'Australian Sports Commission',
  },
  'australian-sports-commission-d68e7f99cf': {
    title: 'Sports Ability: Classic Polybat activity card',
    url: 'https://www.ausport.gov.au/schools/resource-hub/sports_ability',
    publisher: 'Australian Sports Commission',
  },
  'australian-sports-commission-4cbbcbc1a8': {
    title: 'Sports Ability: Tee Ball activity card',
    url: 'https://www.ausport.gov.au/schools/resource-hub/sports_ability',
    publisher: 'Australian Sports Commission',
  },
  'the-football-association-england-foo-028069bfb5': {
    title: 'Play a first game of walking football',
    url: 'https://www.englandfootball.com/play/ways-to-play/walking-football/Rules-and-Refereeing',
    publisher: 'The Football Association / England Football',
  },
  'leeds-beckett-university-171eab9fb9': {
    title: 'Take an adult beginner swimming lesson',
    url: 'https://www.leedsbeckett.ac.uk/beckett-sport/adult-swimming-lessons/',
    publisher: 'Leeds Beckett University',
  },
  'british-wheelchair-basketball-4c99a3a3f0': {
    title: 'Try wheelchair basketball at an introductory club session',
    url: 'https://britishwheelchairbasketball.co.uk/be-involved/',
    publisher: 'British Wheelchair Basketball',
  },
  'england-boxing-637155a7fd': {
    title: 'Boxing for fitness and recreational club finding',
    url: 'https://www.englandboxing.org/get-involved/boxing-for-fitness/',
    publisher: 'England Boxing',
  },
  'usa-pickleball-4acab66f2d': {
    title: 'Learn pickleball and play a short game',
    url: 'https://usapickleball.org/pickleball-skills/level-one/what-is-pickleball-how-to-play/',
    publisher: 'USA Pickleball',
  },
  'badminton-england-5f250542ec': {
    title: 'Take a beginner badminton lesson',
    url: 'https://play.badmintonengland.co.uk/NoStringsDevelop/Badminton/Course/ce035430-105e-4d4c-a832-c734f085fd47',
    publisher: 'Badminton England',
  },
  'badminton-world-federation-hosted-by-96e25bfd22': {
    title: 'BWF Shuttle Time teaching manual',
    url: 'https://www.northumberlandbadminton.org/wp-content/uploads/Shuttle-Time-Teachers-Manuals.pdf',
    publisher: 'Badminton World Federation, hosted by Northumberland Badminton Association',
  },
  'matrix-table-tennis-club-19cc156b6f': {
    title: 'Build a cooperative table-tennis rally',
    url: 'https://www.matrixtt.co.uk/new-to-table-tennis',
    publisher: 'Matrix Table Tennis Club',
  },
  'professional-disc-golf-association-0d8f18609f': {
    title: 'Play a short adapted disc-golf round',
    url: 'https://www.pdga.com/news/adaptive-rules-disc-golf',
    publisher: 'Professional Disc Golf Association',
  },
  'british-fencing-48c6a641cf': {
    title: 'Try fencing in a supervised beginner class',
    url: 'https://www.britishfencing.com/fencing-101/',
    publisher: 'British Fencing',
  },
  'hooplovers-0a784bf088': {
    title: 'Learn a beginner hula-hoop sequence',
    url: 'https://learn.hooplovers.tv/collections/free',
    publisher: 'Hooplovers',
  },
  'open-city-c3eccf8d9f': {
    title: 'Open House Festival visitor FAQs',
    url: 'https://open-city.org.uk/ohf-visitor-faqs',
    publisher: 'Open City',
  },
  'heritage-open-days-1c6664c04d': {
    title: 'Conservators participating in Heritage Open Days',
    url: 'https://www.heritageopendays.org.uk/resource/the-institute-of-conservation-icon.html',
    publisher: 'Heritage Open Days',
  },
  'delhi-tourism-63c603fc45': {
    title: 'National Rail Museum exhibits',
    url: 'https://delhitourism.gov.in/entertainment/national_rail_museum.html',
    publisher: 'Delhi Tourism',
  },
  'national-rail-museum-indian-railways-39d360987f': {
    title: 'National Rail Museum current visitor information',
    url: 'https://www.nrmindia.org/whereWhen',
    publisher: 'National Rail Museum, Indian Railways',
  },
  'ahmedabad-municipal-corporation-df7ec481b1': {
    title: 'Bai Harir ni Vav heritage record',
    url: 'https://heritage.ahmedabadcity.gov.in/details/111/heritage_site/tourism-details/en',
    publisher: 'Ahmedabad Municipal Corporation',
  },
  'meghalaya-biodiversity-board-8cd914c7d4': {
    title: 'Living root bridges and community upkeep',
    url: 'https://megbiodiversity.nic.in/living-root-bridges',
    publisher: 'Meghalaya Biodiversity Board',
  },
  'indian-institute-of-astrophysics-2fb18c3184': {
    title: 'Visiting Vainu Bappu Observatory',
    url: 'https://www.iiap.res.in/outreach/visit-us/visiting-vbo/',
    publisher: 'Indian Institute of Astrophysics',
  },
  'indian-space-research-organisation-a2e8ddb1d3': {
    title: 'Official ISRO visitor and launch-gallery route',
    url: 'https://www.isro.gov.in/ISRO_EN/Visitors.html',
    publisher: 'Indian Space Research Organisation',
  },
  'royal-botanic-gardens-kew-c940efdf52': {
    title: 'Treetop Walkway visitor information',
    url: 'https://www.kew.org/kew-gardens/whats-in-the-gardens/treetop-walkway',
    publisher: 'Royal Botanic Gardens, Kew',
  },
  'the-national-archives-65a6a54b32': {
    title: 'Researching in our reading rooms',
    url: 'https://www.nationalarchives.gov.uk/visit/researching-here/researching-in-our-reading-rooms/',
    publisher: 'The National Archives',
  },
  'ministry-of-tourism-india-436d2c5182': {
    title: 'Pochampally ikat craft context',
    url: 'https://www.incredibleindia.gov.in/en/telangana/pochampally-ikat',
    publisher: 'Ministry of Tourism, India',
  },
  'assam-tourism-a0c2f31348': {
    title: 'Majuli’s satras and mask-making traditions',
    url: 'https://assamtourism.gov.in/Majuli-Island.php',
    publisher: 'Assam Tourism',
  },
  'madhya-pradesh-tourism-ee6175a7f9': {
    title: 'Bhimbetka rock-shelter visitor context',
    url: 'https://www.mptourism.com/destination-bhimbetka.php',
    publisher: 'Madhya Pradesh Tourism',
  },
  'madhya-pradesh-tourism-0d4aaed75f': {
    title: 'Sanchi destination brochure and gateway interpretation',
    url: 'https://www.mptourism.com/pdf/Sanchi/Sanchi%20Destination%20Brochure.pdf',
    publisher: 'Madhya Pradesh Tourism',
  },
  'national-parks-board-singapore-19a361353a': {
    title: 'Sungei Buloh Wetland Reserve visitor routes',
    url: 'https://www.nparks.gov.sg/visit/parks/park-detail/sungei-buloh-wetland-reserve',
    publisher: 'National Parks Board, Singapore',
  },
  'deltapark-neeltje-jans-7702b54a1a': {
    title: 'Guided visitor tours at the storm-surge barrier',
    url: 'https://www.neeltjejans.nl/en/tours/',
    publisher: 'Deltapark Neeltje Jans',
  },
  'yoshinogari-historical-park-8df69162a5': {
    title: 'Reconstructed Southern Inner Enclosure',
    url: 'https://www.yoshinogari.jp/en/introduction/restore/minaminaikaku/',
    publisher: 'Yoshinogari Historical Park',
  },
} satisfies Record<string, Omit<ExperienceResource, 'purpose'>>;
