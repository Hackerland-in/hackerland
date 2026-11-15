export interface EntrepreneurCourse {
  id: string;
  title: string;
  provider: string;
  instructor: string;
  category: 'Fundamentals' | 'Customer Discovery' | 'Fundraising' | 'Hardware & Deep Tech' | 'Scaling' | 'Legal & Operations';
  duration: string;
  lectureCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  freeBadge: '100% Free' | 'OpenCourseWare' | 'Open Source' | 'Govt Certified';
  summary: string;
  externalUrl: string;
  playlistUrl?: string;
  syllabus: {
    lectureNumber: number;
    title: string;
    speaker?: string;
    keyTakeaway: string;
  }[];
  tags: string[];
}

export interface CuratedEssay {
  id: string;
  title: string;
  author: string;
  source: string;
  readTimeMin: number;
  url: string;
  oneLineSummary: string;
  coreRule: string;
}

export interface OpenSourceFounderDoc {
  id: string;
  title: string;
  organization: string;
  format: string;
  url: string;
  description: string;
}

export const ENTREPRENEUR_COURSES: EntrepreneurCourse[] = [
  {
    id: 'cs183b-how-to-start-a-startup',
    title: 'CS183B: How to Start a Startup',
    provider: 'Stanford University & Y Combinator',
    instructor: 'Sam Altman, Paul Graham, Peter Thiel, Dustin Moskovitz',
    category: 'Fundamentals',
    duration: '20 Hours',
    lectureCount: 20,
    level: 'Beginner',
    freeBadge: 'Open Source',
    summary:
      'The legendary Stanford course covering ideas, product validation, building great teams, customer acquisition, user engagement, and early venture mechanics.',
    externalUrl: 'https://startupclass.samaltman.com/',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLUdqnrHmtdXRb-uyCBGCk41iJ6iBkwhpH',
    tags: ['Stanford', 'Y Combinator', 'Product Market Fit', 'MVP', 'Fundraising'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'Ideas, Products, Teams and Execution (Part I)',
        speaker: 'Dustin Moskovitz & Sam Altman',
        keyTakeaway: 'Startups require non-consensus ideas with extreme obsession for customer delight.',
      },
      {
        lectureNumber: 2,
        title: 'Ideas, Products, Teams and Execution (Part II)',
        speaker: 'Sam Altman',
        keyTakeaway: 'Build something so good people tell their friends; virality beats marketing.',
      },
      {
        lectureNumber: 3,
        title: 'Counterintuitive Parts of Startups & How to Have Ideas',
        speaker: 'Paul Graham',
        keyTakeaway: 'Live in the future, then build what is missing rather than forcing ideas.',
      },
      {
        lectureNumber: 4,
        title: 'Building for the Long Term: Competition is for Losers',
        speaker: 'Peter Thiel',
        keyTakeaway: 'Monopoly creates enduring value; capture a small niche before scaling outward.',
      },
      {
        lectureNumber: 5,
        title: 'Strategy and Growth Mechanics',
        speaker: 'Alex Schultz (VP Growth, Meta)',
        keyTakeaway: 'Retention is the single most important prerequisite for organic growth.',
      },
      {
        lectureNumber: 6,
        title: 'How to Build Products Users Fall in Love With',
        speaker: 'Kevin Hale (Wufoo / YC Partner)',
        keyTakeaway: 'Great design is reducing cognitive friction and delivering immediate emotional payoff.',
      },
      {
        lectureNumber: 9,
        title: 'How to Raise Money & Seed Mechanics',
        speaker: 'Marc Andreessen & Ron Conway',
        keyTakeaway: 'Fundraising is momentum-driven; optimize for investor value-add, not vanity valuation.',
      },
      {
        lectureNumber: 13,
        title: 'How to Build a Hardware Startup',
        speaker: 'Hosain Rahman (Jawbone)',
        keyTakeaway: 'Hardware requires tight BOM cost discipline, manufacturing tolerances, and working capital.',
      },
    ],
  },
  {
    id: 'yc-startup-school',
    title: 'Y Combinator Startup School (Official)',
    provider: 'Y Combinator',
    instructor: 'Garry Tan, Dalton Caldwell, Michael Seibel, Adora Cheung',
    category: 'Customer Discovery',
    duration: '25 Hours',
    lectureCount: 35,
    level: 'Beginner',
    freeBadge: '100% Free',
    summary:
      'The modern startup curriculum taught by Y Combinator partners. Step-by-step guides on talking to users, setting pricing, launching MVPs, and achieving default alive status.',
    externalUrl: 'https://www.startupschool.org/',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLQ-uHSnFig5M9fW16o2l35jrfdsxGknNB',
    tags: ['Y Combinator', 'User Interviews', 'Pricing', 'Default Alive', 'Pivots'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'How to Talk to Users (The Mom Test in Practice)',
        speaker: 'Michael Seibel',
        keyTakeaway: 'Ask about their current habits and pain, never ask if they would buy your hypothetical product.',
      },
      {
        lectureNumber: 2,
        title: 'How to Evaluate Startup Ideas & Tarpit Pitfalls',
        speaker: 'Dalton Caldwell',
        keyTakeaway: 'Avoid ideas that sound deceptively easy but suffer from fatal distribution flaws.',
      },
      {
        lectureNumber: 3,
        title: 'How to Plan and Ship a Minimum Viable Product (MVP)',
        speaker: 'Michael Seibel',
        keyTakeaway: 'Launch fast to start learning; an embarrassing first version is better than silence.',
      },
      {
        lectureNumber: 4,
        title: 'Pricing Strategy: How Much to Charge Customers',
        speaker: 'Kevin Hale',
        keyTakeaway: 'Most founders undercharge by 10x; price based on economic value created, not cost.',
      },
      {
        lectureNumber: 5,
        title: 'How to Get Your First 100 Customers Manually',
        speaker: 'Gustaf Alströmer',
        keyTakeaway: 'Do manual unscalable outreach, warm intros, and bespoke onboarding.',
      },
      {
        lectureNumber: 6,
        title: 'Understanding Cap Tables, Safes & Dilution',
        speaker: 'Kirsty Nathoo (YC CFO)',
        keyTakeaway: 'Understand pre-money vs post-money SAFEs and option pool dilution before signing.',
      },
    ],
  },
  {
    id: 'mit-disciplined-entrepreneurship',
    title: 'MIT 15.390: Disciplined Entrepreneurship',
    provider: 'Massachusetts Institute of Technology (MIT OCW)',
    instructor: 'Prof. Bill Aulet (Martin Trust Center for MIT Entrepreneurship)',
    category: 'Fundamentals',
    duration: '30 Hours',
    lectureCount: 24,
    level: 'Intermediate',
    freeBadge: 'OpenCourseWare',
    summary:
      'Rigorous, engineering-backed 24-step roadmap for building innovative ventures from MIT. Learn Beachhead Market sizing, Persona mapping, LTV vs CAC unit economics, and sales cycles.',
    externalUrl: 'https://executive.mit.edu/course/disciplined-entrepreneurship/a056g00000URaagAAD.html',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP63CLq-GxVm4VSr-0iKAS-07',
    tags: ['MIT', 'Beachhead TAM', 'Unit Economics', 'CAC', 'LTV', 'Sales Funnel'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'Market Segmentation: Brainstorming Broad Industries',
        speaker: 'Bill Aulet',
        keyTakeaway: 'Divide massive markets into 6-12 specific niche segments with distinct buyer behaviors.',
      },
      {
        lectureNumber: 2,
        title: 'Select a Beachhead Market & TAM Sizing',
        speaker: 'Bill Aulet',
        keyTakeaway: 'Win a small, referenceable market completely before expanding adjacent verticals.',
      },
      {
        lectureNumber: 5,
        title: 'Build the End User Profile & Persona',
        speaker: 'Bill Aulet',
        keyTakeaway: 'Identify the exact human individual whose daily workflow is transformed by your product.',
      },
      {
        lectureNumber: 10,
        title: 'Define Your Core: The Sustainable Moat',
        speaker: 'Bill Aulet',
        keyTakeaway: 'Your core is what you do better than anyone else that is extraordinarily hard to copy.',
      },
      {
        lectureNumber: 17,
        title: 'Calculate Lifetime Value (LTV) of an Acquired Customer',
        speaker: 'Bill Aulet',
        keyTakeaway: 'Include gross margin, recurring revenue, retention rate, and cost of capital discounting.',
      },
      {
        lectureNumber: 19,
        title: 'Calculate Cost of Customer Acquisition (COCA/CAC)',
        speaker: 'Bill Aulet',
        keyTakeaway: 'Account for marketing salaries, trade shows, failed leads, and sales commission drag.',
      },
    ],
  },
  {
    id: 'steve-blank-lean-launchpad',
    title: 'How to Build a Startup: The Lean LaunchPad',
    provider: 'Udacity / NSF I-Corps',
    instructor: 'Steve Blank & Bob Dorf',
    category: 'Customer Discovery',
    duration: '18 Hours',
    lectureCount: 9,
    level: 'Beginner',
    freeBadge: '100% Free',
    summary:
      'The foundational course credited with launching the Lean Startup movement. How to rapidly validate business model hypotheses outside the building through customer development.',
    externalUrl: 'https://www.udacity.com/course/how-to-build-a-startup--ep245',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLvgw_hLq5k9kFm0q9N7k5bQv3Vq4W7rV2',
    tags: ['Steve Blank', 'Lean Startup', 'Business Model Canvas', 'Customer Discovery'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'What is a Startup? Business Model vs Business Plan',
        speaker: 'Steve Blank',
        keyTakeaway: 'A startup is a temporary organization designed to search for a repeatable business model.',
      },
      {
        lectureNumber: 2,
        title: 'Customer Segments & Archetypes',
        speaker: 'Steve Blank',
        keyTakeaway: 'Distinguish between buyers, users, influencers, and decision-makers in the purchase chain.',
      },
      {
        lectureNumber: 3,
        title: 'Value Propositions: Pain Relievers & Gain Creators',
        speaker: 'Steve Blank',
        keyTakeaway: 'Match features directly to customer jobs-to-be-done with measurable ROI metrics.',
      },
      {
        lectureNumber: 4,
        title: 'Channels: Physical vs Web/Mobile Distribution',
        speaker: 'Steve Blank',
        keyTakeaway: 'Verify that distribution economics do not eat your entire product margin.',
      },
      {
        lectureNumber: 7,
        title: 'Key Partners & Strategic Alliances',
        speaker: 'Steve Blank',
        keyTakeaway: 'Only partner when mutual self-interest guarantees both parties allocate resources.',
      },
    ],
  },
  {
    id: 'hardware-deep-tech-masterclass',
    title: 'Hardware & Deep-Tech Venture Engineering',
    provider: 'Bolt VC & HAX Accelerator',
    instructor: 'Ben Einstein & Cyril Ebersweiler',
    category: 'Hardware & Deep Tech',
    duration: '16 Hours',
    lectureCount: 14,
    level: 'Advanced',
    freeBadge: 'Open Source',
    summary:
      'Practical masterclass on turning a breadboard prototype into a manufactured consumer or industrial hardware product. Tooling Capex, BOM targeting, supply chain, and certification.',
    externalUrl: 'https://bolt.io/blog/',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL_Xv5gK-9K4zJkX5e2A9r7W6tV1bY8k3Z',
    tags: ['Hardware', 'BOM Cost', 'DFM', 'Injection Tooling', 'Certifications (FCC/CE/BIS)'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'The Hardware Golden Rule: Target BOM Cost vs MSRP',
        speaker: 'Ben Einstein',
        keyTakeaway: 'Your landed COGS must be 1/4 to 1/5 of retail MSRP to survive distributor margins.',
      },
      {
        lectureNumber: 2,
        title: 'Tooling Budget: Steel vs Aluminum Molds',
        speaker: 'Scott N. Miller',
        keyTakeaway: 'Hardened steel tooling costs $30k+ but survives 500k shots; pilot with soft tooling first.',
      },
      {
        lectureNumber: 3,
        title: 'Design for Manufacturing (DFM) & Assembly (DFA)',
        speaker: 'Cyril Ebersweiler',
        keyTakeaway: 'Eliminate fasteners; snap-fits reduce assembly seconds and lower human error.',
      },
      {
        lectureNumber: 4,
        title: 'Regulatory Testing: FCC, CE, RoHS, and BIS Compliance',
        speaker: 'Bolt Engineering Team',
        keyTakeaway: 'Pre-compliance RF anechoic chamber testing prevents costly resubmission delays.',
      },
    ],
  },
  {
    id: 'cs183c-blitzscaling-reid-hoffman',
    title: 'CS183C: Technology-Enabled Blitzscaling',
    provider: 'Stanford University',
    instructor: 'Reid Hoffman, Chris Yeh, John Lilly',
    category: 'Scaling',
    duration: '22 Hours',
    lectureCount: 20,
    level: 'Advanced',
    freeBadge: 'OpenCourseWare',
    summary:
      'Stanford course featuring founders of Airbnb, LinkedIn, Netflix, and Stripe on managing hypergrowth when speed into the market outweighs operational efficiency.',
    externalUrl: 'https://www.blitzscaling.com/',
    playlistUrl: 'https://www.youtube.com/playlist?list=PL5q_lef6zVkb6LgYk6F1N7bQ8Kz6Uq1w9',
    tags: ['Stanford', 'Reid Hoffman', 'Blitzscaling', 'Network Effects', 'Hiring'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'What is Blitzscaling? Prioritizing Speed over Efficiency',
        speaker: 'Reid Hoffman',
        keyTakeaway: 'When winner-take-most network effects exist, hypergrowth is essential defense.',
      },
      {
        lectureNumber: 3,
        title: 'Building Culture During Hypergrowth',
        speaker: 'Brian Chesky (Airbnb CEO)',
        keyTakeaway: 'Culture is the shared set of operating principles that allows delegation at speed.',
      },
      {
        lectureNumber: 6,
        title: 'Enterprise Software Blitzscaling',
        speaker: 'Patrick Collison (Stripe CEO)',
        keyTakeaway: 'Engineering infrastructure must scale 10x ahead of transaction throughput.',
      },
    ],
  },
  {
    id: 'startup-india-learning-program',
    title: 'Startup India Entrepreneurship Program',
    provider: 'DPIIT & Invest India',
    instructor: 'Ecosystem Leaders & Tier-1 Indian Founders',
    category: 'Legal & Operations',
    duration: '12 Hours',
    lectureCount: 16,
    level: 'Beginner',
    freeBadge: 'Govt Certified',
    summary:
      'Official Government of India curriculum covering legal incorporation, GST, DPIIT recognition, Section 56(2)(viib) angel tax exemptions, and Startup India Seed Fund Scheme (SISFS).',
    externalUrl: 'https://www.startupindia.gov.in/',
    tags: ['India', 'DPIIT', 'GST', 'Seed Fund Scheme (SISFS)', 'Patents'],
    syllabus: [
      {
        lectureNumber: 1,
        title: 'Entity Structure: Private Limited vs LLP vs OPC',
        speaker: 'Invest India Legal Desk',
        keyTakeaway: 'Private Limited is required for institutional equity funding and ESOP issuance.',
      },
      {
        lectureNumber: 2,
        title: 'DPIIT Recognition & Section 80-IAC Tax Exemption',
        speaker: 'Startup India Cell',
        keyTakeaway: 'Get 3 consecutive years of income tax holiday and exemption from angel tax.',
      },
      {
        lectureNumber: 3,
        title: 'IPR Fast-Tracking: 80% Patent Fee Rebate for Indian Startups',
        speaker: 'Indian Patent Office (IPO)',
        keyTakeaway: 'Take advantage of expedited examination under Rule 24C of Patent Rules.',
      },
    ],
  },
];

export const CURATED_ESSAYS: CuratedEssay[] = [
  {
    id: 'do-things-that-dont-scale',
    title: "Do Things That Don't Scale",
    author: 'Paul Graham',
    source: 'paulgraham.com',
    readTimeMin: 9,
    url: 'https://paulgraham.com/ds.html',
    oneLineSummary: 'Manually recruit users, delight them with obsessive attention, and do what incumbents cannot.',
    coreRule: 'The initial push must be artificial and handcrafted; automated distribution comes later.',
  },
  {
    id: 'how-to-get-startup-ideas',
    title: 'How to Get Startup Ideas',
    author: 'Paul Graham',
    source: 'paulgraham.com',
    readTimeMin: 14,
    url: 'https://paulgraham.com/startupideas.html',
    oneLineSummary: 'The best ideas look like toys or niche curiosities to outsiders, but solve acute personal problems.',
    coreRule: 'Live in the future and build what seems missing for you personally.',
  },
  {
    id: 'the-18-mistakes-that-kill-startups',
    title: 'The 18 Mistakes That Kill Startups',
    author: 'Paul Graham',
    source: 'paulgraham.com',
    readTimeMin: 12,
    url: 'https://paulgraham.com/startupmistakes.html',
    oneLineSummary: 'Single founder syndrome, bad co-founder communication, raising too little, and building without users.',
    coreRule: 'Startup mortality is usually self-inflicted internal dysfunction, not competitor brilliance.',
  },
  {
    id: 'makers-schedule-managers-schedule',
    title: "Maker's Schedule, Manager's Schedule",
    author: 'Paul Graham',
    source: 'paulgraham.com',
    readTimeMin: 6,
    url: 'https://paulgraham.com/makersschedule.html',
    oneLineSummary: 'Makers require uninterrupted 4-hour blocks of flow state; single meetings destroy engineering velocity.',
    coreRule: 'Protect maker calendar slots fiercely; batch managerial syncs at the end of the day.',
  },
  {
    id: 'naval-how-to-get-rich',
    title: 'How to Get Rich Without Getting Lucky',
    author: 'Naval Ravikant',
    source: 'nav.al',
    readTimeMin: 15,
    url: 'https://nav.al/how-to-get-rich',
    oneLineSummary: 'Seek wealth, not money or status. Arm yourself with specific knowledge, accountability, and leverage.',
    coreRule: 'Code and media are permissionless leverage: software works for you while you sleep.',
  },
];

export const OPEN_SOURCE_FOUNDER_DOCS: OpenSourceFounderDoc[] = [
  {
    id: 'yc-safe',
    title: 'Y Combinator Standard Post-Money SAFE',
    organization: 'Y Combinator',
    format: 'DOCX / PDF',
    url: 'https://www.ycombinator.com/documents/',
    description: 'The global standard simple agreement for future equity with valuation cap and discount options.',
  },
  {
    id: 'cooley-go-docs',
    title: 'Cooley GO Open Legal Document Generator',
    organization: 'Cooley LLP',
    format: 'Interactive Generator',
    url: 'https://www.cooleygo.com/',
    description: 'Free automated founder stock purchase agreements, NDAs, advisor agreements, and board consents.',
  },
  {
    id: 'first-round-review',
    title: 'First Round Review Playbooks',
    organization: 'First Round Capital',
    format: 'Open Tactical Library',
    url: 'https://review.firstround.com/',
    description: 'Battle-tested tactical guides on first product hires, founder-led sales, compensation bands, and board decks.',
  },
];
