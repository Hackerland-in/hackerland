import type { BuildJourneyStory } from '@hackerland/core';

export const FEATURED_BUILD_STORIES: BuildJourneyStory[] = [
  {
    id: 'story_spacex',
    slug: 'spacex-falcon-reusable-rocket',
    title: 'SpaceX Falcon 9: The Anatomy of Reusable Rocketry',
    subjectName: 'SpaceX',
    tagline: 'From 3 consecutive launch failures at Kwajalein to vertical propulsive landings and global launch dominance.',
    storyType: 'company',
    category: 'Aerospace & Deep-Tech',
    heroImageUrl: 'https://images.unsplash.com/photo-1517976487502-5f712d90a782?auto=format&fit=crop&w=1200&q=80',
    summary: 'How an ambitious engineering vision challenged aerospace cost-plus monopolies by manufacturing in-house, embracing rapid failure, and mastering vertical supersonic retro-propulsion.',
    foundingYear: 2002,
    headquarters: 'Hawthorne, California',
    metricsHighlights: [
      { label: 'Reused Boosters', value: '300+' },
      { label: 'Launch Cost Reduction', value: '90%' },
      { label: 'Payload to Orbit', value: '22,800 kg' },
    ],
    readingTimeMinutes: 12,
    verifiedSourcesCount: 14,
    decisionRecords: [
      {
        id: 'dec_spacex_1',
        decisionPoint: 'Russian ICBM Procurement vs In-House Rocket Manufacturing',
        optionsAvailable: [
          'Purchase refurbished Dnepr ICBMs from Russia for $8M each',
          'Contract NASA prime aerospace contractors (Boeing/Lockheed)',
          'Design and manufacture the airframe, Merlin engine, and avionics completely in-house',
        ],
        chosenOption: 'Manufacture everything in-house from raw aluminum-lithium alloy',
        rationale: 'Raw materials constituted only 2-3% of the sales price of a rocket. Building in-house removed contractor markup and enabled rapid iteration.',
        consequences: 'Early failures burned through $100M, but eventually yielded the lowest-cost orbital launch vehicle in human history.',
        hindsightRating: 'game_changer',
      },
      {
        id: 'dec_spacex_2',
        decisionPoint: 'Parachute Ocean Splashdown vs Supersonic Propulsive Vertical Landing',
        optionsAvailable: [
          'Parachute ocean recovery (like Space Shuttle SRBs)',
          'Wings and horizontal runway landing (like Space Shuttle Orbiter)',
          'Hypersonic titanium grid fins and rocket-engine propulsive hoverslam onto drone ships',
        ],
        chosenOption: 'Vertical propulsive hoverslam landing with landing legs',
        rationale: 'Parachutes could not decelerate an orbital-class stage softly enough to prevent saltwater corrosion and structural deformation.',
        consequences: 'Over 15 booster crash explosions before the historic 2015 landing at Cape Canaveral; transformed orbital economics forever.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. The Spark & The Russian Desert',
        summary: 'How a trip to Moscow to buy repurposed ballistic missiles sparked the realization that the cost of rockets was an artificial monopoly problem.',
        contentMarkdown: `In late 2001, Elon Musk traveled to Moscow with aerospace consultant Jim Cantrell to purchase three refurbished Russian Dnepr intercontinental ballistic missiles for a planned Mars Oasis greenhouse mission.

The Russian chief designers demanded $8 million per rocket and openly mocked the team. On the flight home, Musk opened a spreadsheet:
- 1,000 lbs of aerospace-grade aluminum-lithium alloy
- Carbon fiber composite tanks
- Rocket-grade kerosene (RP-1) and Liquid Oxygen
- Inconel rocket engine nozzles

The raw materials amounted to just **2% of the price of a commercial rocket launch**. The rest was prime-contractor bureaucracy, defense markups, and throwaway single-use hardware. The mission shifted immediately: make orbital rocketry reusable.`,
        keyTakeaway: 'First-principles breakdown: Calculate the raw physics and materials cost before accepting prevailing commercial prices.',
        interactivePrompt: {
          question: 'If you faced 3 consecutive total rocket explosions and were down to your last $30M, what would you prioritize?',
          options: [
            'Sell the company to an aerospace defense conglomerate',
            'Invest everything into a 4th launch with root-cause stage separation telemetry',
            'Pivot to building satellite components instead of complete rockets',
          ],
          revealedOutcome: 'SpaceX chose option 2: Falcon 1 Flight 4 succeeded on September 28, 2008, saving the company and winning the $1.6B NASA COTS contract days later.',
        },
      },
      {
        number: 2,
        title: '02. First Prototype: Falcon 1 & The Kwajalein Atoll Crisis',
        summary: 'Operating from a remote Pacific island, surviving 3 consecutive explosions, and debugging telemetry on the launchpad.',
        contentMarkdown: `SpaceX relocated to Omelek Island on Kwajalein Atoll because California launch ranges were tied up with military priority.

- **Flight 1 (2006):** A single corroded aluminum nut in the fuel line leaked RP-1, causing an engine fire 25 seconds after liftoff.
- **Flight 2 (2007):** Stage separation succeeded, but slosh in the liquid oxygen tank induced roll oscillation that prevented orbital insertion.
- **Flight 3 (2008):** Residual thrust from the upgraded regenerative Merlin engine caused the first stage to bump into the second stage during separation.

With funds remaining for exactly one launch, the team worked 20-hour shifts on Kwajalein to adjust separation timing by 1.5 seconds. Flight 4 reached orbit on September 28, 2008.`,
        keyTakeaway: 'Telemetry fidelity is everything in hardware: if you cannot measure the exact millisecond of failure, you cannot fix it.',
      },
      {
        number: 3,
        title: '03. Reusability: Conquering the Hoverslam',
        summary: 'Grid fins, cold-gas thrusters, and landing on an autonomous drone ship in turbulent ocean swells.',
        contentMarkdown: `Falcon 9 first stage re-enters Earth's atmosphere at Mach 6. To survive:
1. **Entry Burn:** 3 engines ignite to create a supersonic deceleration shock cone.
2. **Titanium Grid Fins:** 4 steerable grid fins survive 2,000°F atmospheric friction to steer the booster towards an autonomous drone ship.
3. **Hoverslam:** Because the Merlin engine cannot throttle low enough to hover (minimum thrust exceeds the empty rocket weight), the engine ignites at the absolute last second to decelerate to 0 mph exactly when altitude reaches 0 meters.

On December 21, 2015, Falcon 9 Flight 20 completed the first successful vertical landing of an orbital booster in history.`,
        keyTakeaway: 'When physical limits prevent hovering, timing and trajectory algorithms must replace aerodynamic margin.',
      },
    ],
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  {
    id: 'story_ather',
    slug: 'ather-energy-first-smart-ev',
    title: 'Ather Energy: Engineering India’s First Smart EV from IIT Madras',
    subjectName: 'Ather Energy',
    tagline: 'How two engineering graduates rejected lead-acid retrofits to architect indigenous battery packs, aluminum chassis, and Linux dashboard computers.',
    storyType: 'company',
    category: 'Clean Energy & Hardware',
    heroImageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    summary: 'A deep dive into thermal management in 45°C Indian summers, designing custom aluminum spaceframes, and overcoming the absence of an EV supply chain in 2013.',
    foundingYear: 2013,
    headquarters: 'Bengaluru, India',
    metricsHighlights: [
      { label: 'Fast Chargers Deployed', value: '2,500+' },
      { label: 'Battery Cycle Life', value: '1,500 Cycles' },
      { label: 'Indigenous IP', value: '200+ Patents' },
    ],
    readingTimeMinutes: 10,
    verifiedSourcesCount: 9,
    decisionRecords: [
      {
        id: 'dec_ather_1',
        decisionPoint: 'Off-the-shelf Chinese Kit Assembly vs Ground-up Indigenous Engineering',
        optionsAvailable: [
          'Import Chinese lead-acid / LFP kits and rebadge for the Indian market',
          'Engineer a custom die-cast aluminum frame, IP67 battery pack, and custom PMSM motor from scratch',
        ],
        chosenOption: 'Ground-up indigenous engineering from first principles',
        rationale: 'Imported kits were designed for smooth Chinese roads and 25°C climates; they degraded rapidly under Indian potholes, monsoon flooding, and 45°C ambient heat.',
        consequences: 'R&D took 5 years before commercial delivery (Ather 450 in 2018), but created a defensible moat with top-tier battery safety and vehicle dynamics.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. The Spark at IIT Madras',
        summary: 'Tarun Mehta and Swapnil Jain started with a portable battery pack before realizing that two-wheeler mobility was India’s true systemic transition.',
        contentMarkdown: `In 2013, Tarun Mehta and Swapnil Jain were investigating battery storage at the IIT Madras incubation cell. They analyzed fuel consumption in Indian cities and found that **75% of private vehicles were two-wheelers**.

Every electric scooter on Indian roads was an imported plastic kit with heavy lead-acid batteries that required replacement every 8 months. Acceleration was sluggish, and top speeds rarely exceeded 35 km/h.

The team established three non-negotiables:
1. Performance matching a 125cc petrol scooter (0-40 km/h in < 4 seconds).
2. Battery life exceeding 5 years without severe degradation.
3. Connected telematics with OTA updates and regenerative braking.`,
        keyTakeaway: 'Do not benchmark against existing bad alternatives; benchmark against the dominant incumbent (petrol internal combustion).',
      },
      {
        number: 2,
        title: '02. Thermal Engineering in 45°C Ambient Heat',
        summary: 'Lithium-ion cylindrical cells catch fire or degrade if temperatures exceed 55°C. How Ather solved cooling without heavy liquid radiators.',
        contentMarkdown: `In Indian summers, road surface temperatures easily surpass 55°C. When a rider accelerates up a flyover, cell discharge generates internal resistance heat.

Ather engineered an aluminum casing that acted as a giant heat sink for hundreds of 18650 cylindrical cells, potted with flame-retardant thermal resin:
- Heat transferred directly to the scooter aluminum hybrid chassis.
- IP67 water and dust ingress protection to withstand Chennai and Bengaluru monsoon waterlogging.
- Intelligent Battery Management System (BMS) with cell-level temperature sensors calculating state-of-charge down to 1% accuracy.`,
        keyTakeaway: 'Hardware reliability in developing markets requires extreme environmental stress-testing in real geography.',
      },
    ],
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  {
    id: 'story_nvidia',
    slug: 'nvidia-diamond-edge-to-ai-monopoly',
    title: 'NVIDIA: The Gamble on CUDA and Parallel Computing',
    subjectName: 'NVIDIA',
    tagline: 'How Jensen Huang spent billions turning gaming graphics cards into the foundational compute engine of modern artificial intelligence.',
    storyType: 'company',
    category: 'Silicon & AI Compute',
    heroImageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    summary: 'The technical history of NV1 quadratic surfaces, the RIVA 128 turnaround, and the 2006 bet on CUDA that Wall Street hated for a decade.',
    foundingYear: 1993,
    headquarters: 'Santa Clara, California',
    metricsHighlights: [
      { label: 'Compute Architecture', value: 'Blackwell / Hopper' },
      { label: 'Market Cap', value: '$3.5 Trillion' },
      { label: 'AI Supercomputer Share', value: '90%+' },
    ],
    readingTimeMinutes: 11,
    verifiedSourcesCount: 12,
    decisionRecords: [
      {
        id: 'dec_nv_1',
        decisionPoint: 'Making CUDA Standard on Every GPU vs Special Enterprise Compute Cards',
        optionsAvailable: [
          'Sell CUDA only on specialized high-priced supercomputing chips',
          'Include CUDA silicon overhead on every single consumer gaming GPU shipped worldwide',
        ],
        chosenOption: 'Include CUDA on every consumer GeForce GPU despite gross margin penalties',
        rationale: 'Students, researchers, and hobbyists could write parallel compute kernels in C/C++ without buying a $5,000 server card.',
        consequences: 'Wall Street penalized NVIDIA stock for years due to silicon die overhead, but when AlexNet ignited deep learning in 2012, every researcher in the world was already trained on CUDA.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. The Quadratic Mistake: NV1 & The RIVA 128 Turnaround',
        summary: 'NVIDIA nearly went bankrupt in 1995 betting on curved quadratic texture mapping before Microsoft standardized polygonal DirectX.',
        contentMarkdown: `In 1995, NVIDIA released its first chip: NV1 (Diamond Edge 3D). Co-founders Jensen Huang, Chris Malachowsky, and Curtis Priem bet that 3D curves should be represented mathematically using quadratic surfaces rather than flat polygons.

Months later, Microsoft announced Direct3D, which standardized **flat triangular polygons**. NV1 was obsolete overnight. Half the company was laid off, and NVIDIA had only 6 months of cash left.

The team pivoted to polygonal architecture, designing the RIVA 128 in an all-or-nothing scramble with TSMC. When RIVA 128 shipped in 1997, it outperformed competitors by 4x, saving the company and leading to the GeForce 256.`,
        keyTakeaway: 'When platform standards change, do not fight the standard; ruthlessly abandon legacy architecture and rebuild.',
      },
    ],
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
];

export async function listBuildStories(category?: string): Promise<BuildJourneyStory[]> {
  if (!category || category === 'All') return FEATURED_BUILD_STORIES;
  return FEATURED_BUILD_STORIES.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
}

export async function getBuildStory(slug: string): Promise<BuildJourneyStory | null> {
  return FEATURED_BUILD_STORIES.find((s) => s.slug === slug) || null;
}
