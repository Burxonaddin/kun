/** Content banks used by the mock generator. Everything here is original filler text. */

export const FIRST_NAMES = [
  'Daniel', 'Maria', 'Peter', 'Aisha', 'Tomas', 'Helen', 'Jack', 'Nadia', 'Robert', 'Yuki',
  'Sofia', 'Omar', 'Clara', 'Liam', 'Priya', 'Marcus', 'Elena', 'Hassan', 'Grace', 'Victor',
];

export const SURNAMES = [
  'Whitfield', 'Karimov', 'Brennan', 'Okafor', 'Lindqvist', 'Marsden', 'Haruki', 'Delgado',
  'Ashcroft', 'Novak', 'Ferreira', 'Baptiste', 'Kowalski', 'Rahman', 'Sinclair', 'Petrov',
];

export const STREETS = [
  'Wellington Road', 'Harbour Lane', 'Chestnut Avenue', 'Bridge Street', 'Maple Crescent',
  'Fairview Terrace', 'Kingsway Drive', 'Orchard Close', 'Riverbank Walk', 'Station Parade',
];

export const CITIES = [
  'Brighton', 'Dunedin', 'Coventry', 'Galway', 'Hamilton', 'Perth', 'Norwich', 'Kingston',
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const PAYMENT_METHODS = ['credit card', 'bank transfer', 'cash', 'debit card'];

export interface ListeningScenario {
  /** e.g. "Riverside Sports Centre membership enquiry" */
  title: string;
  organisation: string;
  service: string;
  itemLabel: string;
  items: string[];
  extraLabel: string;
  extras: string[];
  requirementLabel: string;
  requirements: string[];
}

export const PART1_SCENARIOS: ListeningScenario[] = [
  {
    title: 'Sports centre membership enquiry',
    organisation: 'Riverside Sports Centre',
    service: 'membership',
    itemLabel: 'Type of membership',
    items: ['off-peak', 'family', 'student', 'corporate'],
    extraLabel: 'Free item on joining',
    extras: ['water bottle', 'gym towel', 'swimming cap', 'kit bag'],
    requirementLabel: 'Item to bring on the first visit',
    requirements: ['photo ID', 'proof of address', 'medical form', 'passport photo'],
  },
  {
    title: 'Accommodation agency enquiry',
    organisation: 'Cityview Lettings',
    service: 'flat rental',
    itemLabel: 'Type of property',
    items: ['studio flat', 'shared house', 'one-bedroom flat', 'homestay'],
    extraLabel: 'Bill included in the rent',
    extras: ['water', 'internet', 'heating', 'electricity'],
    requirementLabel: 'Document required',
    requirements: ['reference letter', 'bank statement', 'student card', 'employment contract'],
  },
  {
    title: 'Language school course booking',
    organisation: 'Bell Lane Language School',
    service: 'evening course',
    itemLabel: 'Course chosen',
    items: ['business English', 'exam preparation', 'general English', 'academic writing'],
    extraLabel: 'Included in the fee',
    extras: ['course book', 'online platform', 'progress test', 'library access'],
    requirementLabel: 'Item to bring to the first lesson',
    requirements: ['placement test result', 'notebook', 'headphones', 'photo ID'],
  },
  {
    title: 'Removal company quotation',
    organisation: 'Swift Move Removals',
    service: 'house move',
    itemLabel: 'Service required',
    items: ['packing service', 'storage', 'van only', 'full service'],
    extraLabel: 'Free with the booking',
    extras: ['packing boxes', 'insurance', 'furniture covers', 'labels'],
    requirementLabel: 'Information still needed',
    requirements: ['parking permit', 'lift access', 'floor plan', 'inventory list'],
  },
  {
    title: 'Community college enrolment',
    organisation: 'Northgate Community College',
    service: 'weekend workshop',
    itemLabel: 'Workshop chosen',
    items: ['photography', 'ceramics', 'creative writing', 'web design'],
    extraLabel: 'Materials provided',
    extras: ['clay', 'paper', 'software licence', 'camera'],
    requirementLabel: 'Bring to the first session',
    requirements: ['old clothes', 'laptop', 'sketchbook', 'memory card'],
  },
  {
    title: 'Holiday cottage reservation',
    organisation: 'Lakeside Cottages',
    service: 'weekend break',
    itemLabel: 'Cottage type',
    items: ['lakeside lodge', 'garden cottage', 'farmhouse', 'forest cabin'],
    extraLabel: 'Facility available',
    extras: ['bicycle hire', 'boat trip', 'breakfast basket', 'fishing permit'],
    requirementLabel: 'Note for the owner',
    requirements: ['late arrival', 'dietary needs', 'pet in the party', 'extra bed'],
  },
  {
    title: 'Health centre appointment',
    organisation: 'Parkside Health Centre',
    service: 'health check',
    itemLabel: 'Appointment type',
    items: ['annual review', 'travel clinic', 'blood test', 'vaccination'],
    extraLabel: 'Provided free of charge',
    extras: ['information leaflet', 'diet plan', 'follow-up call', 'sample kit'],
    requirementLabel: 'Preparation needed',
    requirements: ['no breakfast', 'list of medicines', 'urine sample', 'loose clothing'],
  },
  {
    title: 'Volunteer programme registration',
    organisation: 'Green Shoots Volunteers',
    service: 'weekend volunteering',
    itemLabel: 'Project chosen',
    items: ['tree planting', 'beach clean', 'community garden', 'river survey'],
    extraLabel: 'Equipment supplied',
    extras: ['gloves', 'spade', 'safety vest', 'litter picker'],
    requirementLabel: 'Volunteers must bring',
    requirements: ['waterproof coat', 'packed lunch', 'sun hat', 'walking boots'],
  },
];

export interface Part2Topic {
  title: string;
  place: string;
  speaker: string;
  areas: string[];
  features: string[];
}

export const PART2_TOPICS: Part2Topic[] = [
  {
    title: 'A tour of a new city library',
    place: 'the Meadowbank Library',
    speaker: 'the library manager',
    areas: ['ground floor', 'first floor', 'basement', 'east wing', 'roof terrace'],
    features: ['quiet study rooms', 'children\u2019s corner', 'local history archive', 'recording studio', 'community café'],
  },
  {
    title: 'Information about a music festival',
    place: 'the Harbour Music Festival',
    speaker: 'the festival organiser',
    areas: ['main stage', 'acoustic tent', 'food court', 'camping field', 'workshop area'],
    features: ['evening headliners', 'local performers', 'street food stalls', 'quiet camping', 'instrument lessons'],
  },
  {
    title: 'Introduction to a nature reserve',
    place: 'the Salt Marsh Reserve',
    speaker: 'a senior ranger',
    areas: ['visitor centre', 'north hide', 'boardwalk', 'wildflower meadow', 'old quarry'],
    features: ['bird watching', 'guided walks', 'photography hide', 'pond dipping', 'geology trail'],
  },
  {
    title: 'A talk about a city cycling scheme',
    place: 'the city cycle hire scheme',
    speaker: 'a transport officer',
    areas: ['station hub', 'university dock', 'riverside dock', 'market square', 'business park'],
    features: ['electric bikes', 'child seats', 'repair points', 'monthly passes', 'route maps'],
  },
  {
    title: 'Details of a museum refurbishment',
    place: 'the Maritime Museum',
    speaker: 'the head of visitor services',
    areas: ['entrance hall', 'upper gallery', 'shipyard exhibit', 'lecture theatre', 'garden court'],
    features: ['interactive screens', 'restored steam engine', 'schools programme', 'evening talks', 'model workshop'],
  },
  {
    title: 'A radio feature on a farmers\u2019 market',
    place: 'the Riverside Farmers\u2019 Market',
    speaker: 'the market coordinator',
    areas: ['bakery row', 'dairy stalls', 'covered hall', 'car park entrance', 'demonstration tent'],
    features: ['sourdough bread', 'local cheese', 'cookery demonstrations', 'seasonal vegetables', 'free tastings'],
  },
];

export interface Part3Topic {
  title: string;
  students: [string, string];
  subject: string;
  project: string;
  aspects: string[];
  problems: string[];
  solutions: string[];
}

export const PART3_TOPICS: Part3Topic[] = [
  {
    title: 'Tutorial about a research project',
    students: ['Anna', 'Ben'],
    subject: 'environmental science',
    project: 'a study of urban air quality',
    aspects: ['sample size', 'data collection', 'literature review', 'field equipment', 'ethics approval'],
    problems: ['too little data', 'faulty sensors', 'a missed deadline', 'limited funding'],
    solutions: ['borrowing equipment', 'extending the timescale', 'narrowing the focus', 'working in pairs'],
  },
  {
    title: 'Discussion about a group presentation',
    students: ['Carla', 'Dmitri'],
    subject: 'business studies',
    project: 'a presentation on small enterprises',
    aspects: ['interview design', 'slide design', 'time management', 'referencing', 'rehearsal'],
    problems: ['nervous speakers', 'too many slides', 'unclear roles', 'weak conclusion'],
    solutions: ['practising aloud', 'cutting content', 'assigning sections', 'adding a summary slide'],
  },
  {
    title: 'Seminar preparation meeting',
    students: ['Emma', 'Farid'],
    subject: 'education',
    project: 'a case study of a village school',
    aspects: ['observation notes', 'parent interviews', 'reading list', 'consent forms', 'analysis method'],
    problems: ['few volunteers', 'travel costs', 'conflicting evidence', 'a short timetable'],
    solutions: ['online interviews', 'a shared travel budget', 'a second observer', 'a pilot study'],
  },
  {
    title: 'Feedback session on a lab report',
    students: ['Gina', 'Hugo'],
    subject: 'biology',
    project: 'an experiment on plant growth',
    aspects: ['method section', 'control group', 'graph labels', 'statistical test', 'discussion'],
    problems: ['inconsistent measurements', 'a contaminated sample', 'missing labels', 'a rushed discussion'],
    solutions: ['repeating the trial', 'a stricter protocol', 'clearer captions', 'more reading'],
  },
];

export interface Part4Topic {
  title: string;
  field: string;
  subject: string;
  stages: string[];
  factors: string[];
  materials: string[];
  benefits: string[];
}

export const PART4_TOPICS: Part4Topic[] = [
  {
    title: 'The history of urban parks',
    field: 'urban planning',
    subject: 'public parks',
    stages: ['private gardens', 'public subscription', 'municipal ownership', 'modern regeneration'],
    factors: ['population growth', 'public health', 'industrial pollution', 'political pressure'],
    materials: ['iron railings', 'gravel paths', 'imported trees', 'stone fountains'],
    benefits: ['cleaner air', 'physical exercise', 'social contact', 'lower temperatures'],
  },
  {
    title: 'Lighthouse engineering',
    field: 'civil engineering',
    subject: 'lighthouses',
    stages: ['wooden towers', 'stone construction', 'iron frames', 'automated stations'],
    factors: ['storm damage', 'shipping losses', 'fuel supply', 'keeper shortages'],
    materials: ['granite blocks', 'cast iron', 'whale oil', 'glass prisms'],
    benefits: ['safer routes', 'lower insurance', 'accurate navigation', 'coastal trade'],
  },
  {
    title: 'The domestication of honeybees',
    field: 'agricultural history',
    subject: 'beekeeping',
    stages: ['wild harvesting', 'clay hives', 'wooden boxes', 'movable frames'],
    factors: ['sugar demand', 'crop pollination', 'disease outbreaks', 'climate change'],
    materials: ['straw skeps', 'beeswax sheets', 'smoke fuel', 'protective veils'],
    benefits: ['higher yields', 'better pollination', 'wax products', 'rural income'],
  },
  {
    title: 'Underwater archaeology',
    field: 'archaeology',
    subject: 'shipwreck excavation',
    stages: ['sonar survey', 'test trenches', 'full excavation', 'conservation'],
    factors: ['water depth', 'strong currents', 'looting', 'funding limits'],
    materials: ['air lifts', 'photogrammetry rigs', 'storage tanks', 'chemical baths'],
    benefits: ['trade evidence', 'shipbuilding data', 'preserved textiles', 'museum displays'],
  },
  {
    title: 'The science of sleep in animals',
    field: 'zoology',
    subject: 'animal sleep',
    stages: ['field observation', 'laboratory recording', 'brain scanning', 'comparative analysis'],
    factors: ['predation risk', 'body size', 'food supply', 'daylight hours'],
    materials: ['tracking collars', 'infrared cameras', 'electrode caps', 'temperature loggers'],
    benefits: ['memory storage', 'energy saving', 'tissue repair', 'immune support'],
  },
  {
    title: 'Salt and world trade',
    field: 'economic history',
    subject: 'the salt trade',
    stages: ['coastal evaporation', 'rock salt mining', 'canal transport', 'industrial refining'],
    factors: ['food preservation', 'government taxes', 'transport costs', 'new refrigeration'],
    materials: ['clay pans', 'wooden barrels', 'pack animals', 'steam pumps'],
    benefits: ['longer food storage', 'new trade routes', 'town growth', 'state revenue'],
  },
];

export interface ReadingTopic {
  title: string;
  subject: string;
  /** Countable object of study, e.g. "colonies". */
  unit: string;
  researcher: string;
  institution: string;
  place: string;
  field: string;
  application: string;
  challenge: string;
  method: string;
}

export const READING_TOPICS: ReadingTopic[] = [
  {
    title: 'The Return of the Urban Beaver',
    subject: 'beaver reintroduction', unit: 'colonies', researcher: 'Dr Helena Marsh',
    institution: 'the University of Aberdeen', place: 'northern Scotland', field: 'freshwater ecology',
    application: 'flood management', challenge: 'conflict with farmers', method: 'radio tracking',
  },
  {
    title: 'Reading the Rings of Ancient Timber',
    subject: 'dendrochronology', unit: 'timber samples', researcher: 'Professor Adam Croft',
    institution: 'the Institute of Building History', place: 'central Europe', field: 'archaeological dating',
    application: 'restoring historic buildings', challenge: 'incomplete records', method: 'ring-width analysis',
  },
  {
    title: 'The Economics of the Night Shift',
    subject: 'night work', unit: 'workplaces', researcher: 'Dr Ruth Alvarez',
    institution: 'the Centre for Labour Studies', place: 'four industrial cities', field: 'occupational health',
    application: 'shift scheduling', challenge: 'self-reported data', method: 'longitudinal surveys',
  },
  {
    title: 'Seed Banks and the Future of Food',
    subject: 'crop seed storage', unit: 'seed varieties', researcher: 'Dr Miriam Osei',
    institution: 'the National Crop Trust', place: 'West Africa', field: 'plant genetics',
    application: 'drought-resistant crops', challenge: 'unreliable electricity', method: 'germination testing',
  },
  {
    title: 'How Cities Cool Themselves',
    subject: 'urban heat islands', unit: 'districts', researcher: 'Professor Ivan Petrov',
    institution: 'the School of Environmental Design', place: 'southern Spain', field: 'climate adaptation',
    application: 'street design', challenge: 'limited public budgets', method: 'thermal imaging',
  },
  {
    title: 'The Long Journey of the Eel',
    subject: 'eel migration', unit: 'tagged fish', researcher: 'Dr Naoko Ishida',
    institution: 'the Marine Research Laboratory', place: 'the North Atlantic', field: 'marine biology',
    application: 'fishery quotas', challenge: 'tag loss at sea', method: 'satellite tagging',
  },
  {
    title: 'Paper, Print and the Spread of Ideas',
    subject: 'early printing', unit: 'printed editions', researcher: 'Dr Clara Weiss',
    institution: 'the Library of Historical Texts', place: 'the Low Countries', field: 'book history',
    application: 'digital archives', challenge: 'fragile originals', method: 'catalogue comparison',
  },
  {
    title: 'The Quiet Revolution in Solar Glass',
    subject: 'transparent solar panels', unit: 'prototype panels', researcher: 'Professor Leo Tanaka',
    institution: 'the Advanced Materials Group', place: 'a laboratory in Osaka', field: 'materials science',
    application: 'office windows', challenge: 'high production costs', method: 'efficiency trials',
  },
  {
    title: 'Rethinking the School Timetable',
    subject: 'later school start times', unit: 'schools', researcher: 'Dr Emily Sharpe',
    institution: 'the Education Policy Unit', place: 'three regions of England', field: 'adolescent health',
    application: 'timetable reform', challenge: 'transport arrangements', method: 'controlled trials',
  },
  {
    title: 'Mapping the Ocean Floor',
    subject: 'seabed mapping', unit: 'survey areas', researcher: 'Dr Samuel Okoro',
    institution: 'the Hydrographic Office', place: 'the southern Indian Ocean', field: 'oceanography',
    application: 'undersea cables', challenge: 'the cost of ship time', method: 'multibeam sonar',
  },
  {
    title: 'The Rise of the Repair Café',
    subject: 'community repair', unit: 'repair events', researcher: 'Dr Anouk de Vries',
    institution: 'the Circular Economy Centre', place: 'the Netherlands', field: 'sustainable consumption',
    application: 'waste reduction', challenge: 'a shortage of volunteers', method: 'event logging',
  },
  {
    title: 'Ancient Roads, Modern Lessons',
    subject: 'Roman road building', unit: 'excavated sections', researcher: 'Professor Marco Bellini',
    institution: 'the Institute of Classical Studies', place: 'northern Italy', field: 'archaeology',
    application: 'modern road design', challenge: 'later rebuilding', method: 'soil sampling',
  },
];

export const WRITING_TASK2_PROMPTS: { statement: string; type: string; keyPoints: string[] }[] = [
  {
    statement:
      'Some people believe that universities should only offer courses that lead directly to employment. Others argue that subjects such as history and philosophy remain essential. Discuss both views and give your own opinion.',
    type: 'discussion',
    keyPoints: ['employability argument', 'value of the humanities', 'clear personal position', 'relevant examples'],
  },
  {
    statement:
      'In many countries the number of people living alone is rising rapidly. What are the causes of this trend and what effects does it have on society?',
    type: 'causes and effects',
    keyPoints: ['social and economic causes', 'effects on housing', 'effects on wellbeing', 'supported examples'],
  },
  {
    statement:
      'Governments should spend money on public transport rather than on building new roads. To what extent do you agree or disagree?',
    type: 'opinion',
    keyPoints: ['clear position', 'congestion and emissions', 'cost comparison', 'counter-argument'],
  },
  {
    statement:
      'Working from home has become common in many industries. Do the advantages of this development outweigh the disadvantages?',
    type: 'advantages and disadvantages',
    keyPoints: ['productivity and flexibility', 'isolation and management', 'balanced comparison', 'final judgement'],
  },
  {
    statement:
      'Some people think children should start learning a foreign language at primary school, while others believe it is better to wait until secondary school. Discuss both views and give your own opinion.',
    type: 'discussion',
    keyPoints: ['early learning research', 'curriculum pressure', 'teacher supply', 'personal opinion'],
  },
  {
    statement:
      'The increase in food waste is a serious problem in many cities. What are the main causes and what measures could be taken to reduce it?',
    type: 'problem and solution',
    keyPoints: ['retail and household causes', 'practical measures', 'role of government', 'feasibility'],
  },
  {
    statement:
      'Museums and historical sites are mainly visited by tourists rather than local people. Why is this the case and what could be done to attract local visitors?',
    type: 'problem and solution',
    keyPoints: ['reasons for low local attendance', 'pricing and programming', 'community outreach', 'examples'],
  },
  {
    statement:
      'Some argue that technology has made people less able to concentrate. To what extent do you agree or disagree?',
    type: 'opinion',
    keyPoints: ['clear stance', 'evidence on attention', 'benefits of technology', 'balanced conclusion'],
  },
];

export const WRITING_TASK1_TYPES = [
  'line graph', 'bar chart', 'table', 'pie chart comparison', 'process-style table',
];

export const WRITING_TASK1_THEMES: { caption: string; unit: string; categories: string[]; series: string[] }[] = [
  {
    caption: 'Household spending by category',
    unit: '% of monthly income',
    categories: ['Housing', 'Food', 'Transport', 'Leisure'],
    series: ['2005', '2015', '2025'],
  },
  {
    caption: 'Visitors to four city attractions',
    unit: 'thousands of visitors',
    categories: ['Museum', 'Zoo', 'Art gallery', 'Botanic garden'],
    series: ['2010', '2017', '2024'],
  },
  {
    caption: 'Sources of electricity generation',
    unit: '% of total generation',
    categories: ['Coal', 'Gas', 'Wind', 'Solar'],
    series: ['2000', '2012', '2024'],
  },
  {
    caption: 'Modes of travel to work in three cities',
    unit: '% of commuters',
    categories: ['Car', 'Bus', 'Cycling', 'Walking'],
    series: ['Riverford', 'Ashton', 'Kelsey'],
  },
  {
    caption: 'Average time spent on daily activities',
    unit: 'hours per day',
    categories: ['Paid work', 'Housework', 'Study', 'Leisure'],
    series: ['Men', 'Women', 'Students'],
  },
];

export const SPEAKING_PART1_TOPICS: { topic: string; questions: string[] }[] = [
  {
    topic: 'Hometown',
    questions: [
      'Where is your hometown?',
      'What do you like most about it?',
      'Has your hometown changed much in recent years?',
      'Would you like to live there in the future?',
    ],
  },
  {
    topic: 'Work and study',
    questions: [
      'Do you work or are you a student?',
      'What is the most interesting part of your work or studies?',
      'Do you prefer studying in the morning or in the evening?',
      'What would you like to do in five years\u2019 time?',
    ],
  },
  {
    topic: 'Free time',
    questions: [
      'What do you usually do in your free time?',
      'Do you prefer spending free time alone or with other people?',
      'Have your hobbies changed since childhood?',
      'Is it important to have hobbies? Why?',
    ],
  },
  {
    topic: 'Food',
    questions: [
      'What kind of food do you like?',
      'Do you often cook at home?',
      'Has your diet changed in the last few years?',
      'Are traditional dishes still popular in your country?',
    ],
  },
  {
    topic: 'Transport',
    questions: [
      'How do you usually travel around your city?',
      'Do you enjoy long journeys?',
      'Has public transport improved where you live?',
      'What could be done to reduce traffic?',
    ],
  },
  {
    topic: 'Technology',
    questions: [
      'How often do you use a computer or a smartphone?',
      'Which app do you find most useful?',
      'Do you think people spend too much time online?',
      'How has technology changed the way you study?',
    ],
  },
];

export const SPEAKING_PART2_CARDS: { prompt: string; bullets: string[]; part3: string[] }[] = [
  {
    prompt: 'Describe a skill you learned that was difficult at first.',
    bullets: ['what the skill is', 'how you learned it', 'why it was difficult', 'and explain how it has helped you'],
    part3: [
      'Why do some people give up learning new skills?',
      'Should schools teach practical skills as well as academic subjects?',
      'How has the internet changed the way people learn skills?',
      'Do employers value practical skills more than qualifications?',
    ],
  },
  {
    prompt: 'Describe a place in your city that you often recommend to visitors.',
    bullets: ['where it is', 'what people can do there', 'who you usually go with', 'and explain why you recommend it'],
    part3: [
      'What kinds of places attract tourists in your country?',
      'Does tourism bring more benefits or problems to local people?',
      'How can cities protect historic areas?',
      'Will virtual tours ever replace real travel?',
    ],
  },
  {
    prompt: 'Describe a decision you made that changed your life.',
    bullets: ['what the decision was', 'when you made it', 'how you made it', 'and explain what changed afterwards'],
    part3: [
      'Do young people make decisions differently from older people?',
      'Should parents make important decisions for their children?',
      'Why do some people find decisions difficult?',
      'How can governments make better long-term decisions?',
    ],
  },
  {
    prompt: 'Describe an object in your home that is important to you.',
    bullets: ['what it is', 'how you got it', 'how often you use it', 'and explain why it matters to you'],
    part3: [
      'Why do people keep objects they no longer use?',
      'Has shopping culture changed in your country?',
      'Do you think people own too many things today?',
      'How can communities encourage repairing rather than replacing?',
    ],
  },
  {
    prompt: 'Describe a time when you helped someone.',
    bullets: ['who you helped', 'what the situation was', 'what you did', 'and explain how you felt about it'],
    part3: [
      'Are people in cities less willing to help strangers?',
      'Should volunteering be part of school education?',
      'How can charities encourage more volunteers?',
      'Is helping others always rewarding?',
    ],
  },
  {
    prompt: 'Describe a book, film or programme that taught you something.',
    bullets: ['what it was', 'when you saw or read it', 'what it was about', 'and explain what you learned from it'],
    part3: [
      'Do people read fewer books than in the past?',
      'Can films teach history accurately?',
      'How do streaming services affect viewing habits?',
      'Should governments support the arts financially?',
    ],
  },
];

export const READING_HEADINGS_POOL = [
  'An unexpected source of evidence',
  'Early attempts that failed',
  'Support from an unlikely direction',
  'Practical uses beyond research',
  'A problem that remains unsolved',
  'Measuring the scale of the change',
  'Objections from local communities',
  'The turning point in the research',
  'How the method actually works',
  'Costs weighed against benefits',
  'Plans for the next decade',
  'A comparison with other countries',
];
