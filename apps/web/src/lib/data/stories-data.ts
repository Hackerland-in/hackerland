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
  {
    id: 'story_kulkarni_patil_pune',
    slug: 'kulkarni-patil-pune-ev-bldc-exports',
    title: 'Kulkarni-Patil Auto Systems: From Bhosari Gala to German & Thai EV Exports',
    subjectName: 'Kulkarni-Patil Auto Systems',
    tagline:
      'How two Pune engineers scaled waterproof IP67 BLDC controllers and EV wiring harnesses to German and Thai OEMs via ARAI testing and ECGC export credit.',
    storyType: 'company',
    category: 'EV & Powertrain',
    heroImageUrl:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Starting in a 900 sq ft Bhosari MIDC workshop in Pune, Rohan Kulkarni and Snehal Patil eliminated monsoon field failures with vacuum PU potting and STM32 FOC firmware—passing ARAI EMC compliance to win repeat export orders from Germany and Thailand.',
    foundingYear: 2019,
    headquarters: 'Pune, Maharashtra (Bhosari MIDC)',
    metricsHighlights: [
      { label: 'Export Share', value: '68% Revenue' },
      { label: 'Field Defect Rate', value: '< 140 PPM' },
      { label: 'IP67 Fleet Units', value: '42,000+' },
    ],
    readingTimeMinutes: 9,
    verifiedSourcesCount: 8,
    decisionRecords: [
      {
        id: 'dec_kp_1',
        decisionPoint: 'Manual Epoxy Pouring vs Semi-Automated Vacuum Polyurethane Potting Line',
        optionsAvailable: [
          'Continue hand-mixing two-part epoxy on assembly benches to save ₹14L CapEx',
          'Outsource controller enclosure assembly to contract jobbers in Chakan',
          'Invest in a semi-automated vacuum degassing PU potting rig inside Bhosari MIDC',
        ],
        chosenOption: 'In-house vacuum PU potting line with aluminum IMS PCB substrate',
        rationale:
          'Hand-poured epoxy trapped microscopic air bubbles that cracked during 45°C thermal cycling and let monsoon moisture wick along harness pins.',
        consequences:
          'Field warranty returns dropped from 4.8% to under 140 PPM, clearing 96-hour ARAI thermal-shock and IP67 immersion audits.',
        hindsightRating: 'game_changer',
      },
      {
        id: 'dec_kp_2',
        decisionPoint: 'Domestic Aftermarket Price War vs ARAI EMC & ECGC Export Pivot',
        optionsAvailable: [
          'Compete on ₹1,100 uncertified aftermarket e-rickshaw controllers',
          'Fund ₹8.5L ARAI Pune AIS-156 / CISPR-25 EMC qualification and ECGC export insurance',
        ],
        chosenOption: 'ARAI EMC pre-scan compliance paired with ECGC Whole Turnover Export Cover',
        rationale:
          'Aftermarket price wars offered 9% gross margins and 90-day bad debts; German e-cargo OEMs and Thai 3W assemblers demanded CISPR-25 and traceable Deutsch DT harnesses at 34% gross margin.',
        consequences:
          'Six months of EMC filter iteration yielded EU/ASEAN vendor codes and LC-backed shipments through Nhava Sheva under RoDTEP.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. The 900 Sq Ft Bhosari Workshop & Monsoon Harness Failures',
        summary:
          'Why building ruggedized 48V BLDC pump and traction controllers meant solving thermal potting and connector wicking before writing a single line of export marketing.',
        contentMarkdown: `In 2019, COEP electrical graduate Rohan Kulkarni and polytechnic embedded specialist Snehal Patil pooled ₹6.5 lakh in Bhosari MIDC, Pune, repairing variable-frequency drives for sugarcane irrigation pumps.

When local two-wheeler startups began retrofitting BLDC hub motors, every low-cost imported controller failed during the first Pune monsoon:
- Unsealed PVC wire strands wicked rainwater straight into phase-current shunts.
- FR-4 PCBs cracked under 110A phase spikes because MOSFET heat had nowhere to dissipate.
- Hall-sensor harnesses fatigued near rear swingarms within 4,000 km.

Kulkarni-Patil rebuilt the stack around **aluminum-backed IMS PCBs**, **STM32G4 Field-Oriented Control (FOC)**, ultrasonic wire-crimped **Deutsch DT06 connectors**, and full **vacuum polyurethane potting**.`,
        keyTakeaway:
          'In Indian Tier-2 industrial hubs, reliability under monsoon moisture and dust is the strongest wedge into global OEM supply chains.',
        interactivePrompt: {
          question:
            'Your prototype BLDC controller passes bench loads, but ARAI pre-compliance flags a 9 dB radiated emission spike at 48 MHz. What do you do?',
          options: [
            'Skip formal EMC testing and sell only to uncertified local aftermarket dealers',
            'Add a common-mode choke, split ground return paths, and re-test at ARAI Pune',
            'Lower the switching frequency to 4 kHz despite audible motor whine',
          ],
          revealedOutcome:
            'Kulkarni-Patil added an AC/DC input common-mode choke, tightened gate-drive loop area on a 4-layer stackup, and passed CISPR-25 Class 3—qualifying directly for German cargo-bike tenders.',
        },
      },
      {
        number: 2,
        title: '02. ARAI Qualification, ECGC Cover & Shipping to Germany and Thailand',
        summary:
          'Turning Bhosari shopfloor discipline into bankable export shipments via IEC, GST Zero-Rated LUT, ECGC, and RoDTEP.',
        contentMarkdown: `Passing technical qualification was only half the battle. European and Southeast Asian buyers required confidence that a 28-person Pune supplier would not default mid-season.

1. **Compliance & Traceability:** Every controller carries a laser-etched QR code linking STM32 flash CRC, potting batch number, and automated bed-of-nails load-test logs.
2. **Export Finance Stack:** Using **DGFT IEC**, **GST Zero-Rated LUT**, and **ECGC buyer credit insurance**, the founders offered 45-day payment terms without freezing working capital.
3. **RoDTEP Advantage:** Exporting finished HS 8504/8544 harnesses and motor drives via JNPT (Nhava Sheva) captures RoDTEP duty-remission credits that fund quarterly NABL calibration.`,
        keyTakeaway:
          'Pair shopfloor PPM discipline with ECGC credit cover and LUT zero-rated billing so small Indian plants can win Tier-1 export POs safely.',
      },
    ],
    createdAt: '2026-04-12T00:00:00.000Z',
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    id: 'story_kaveri_loomworks_tiruppur',
    slug: 'kaveri-loomworks-tiruppur-smart-knitting',
    title: 'Kaveri LoomWorks: Retrofitting Tiruppur Knitting Mills for EU Technical Textiles',
    subjectName: 'Kaveri LoomWorks',
    tagline:
      'How a Tiruppur mill retrofitted 1990s mechanical looms with ESP32 yarn-tension sensors to export OEKO-TEX medical & technical knits to the EU under RoDTEP.',
    storyType: 'company',
    category: 'Technical Textiles',
    heroImageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Facing razor-thin margins in commodity knitwear, Kaveri LoomWorks teamed up with Coimbatore embedded engineers to build ₹18,500 ESP32 optical tension retrofits—cutting seconds rejection by 74% and unlocking EU medical compression fabric contracts.',
    foundingYear: 2018,
    headquarters: 'Tiruppur, Tamil Nadu',
    metricsHighlights: [
      { label: 'Loom Retrofit Cost', value: '₹18,500 / unit' },
      { label: 'Fabric Defect Drop', value: '74% Lower' },
      { label: 'EU Export Margin', value: '+11.5% Delta' },
    ],
    readingTimeMinutes: 8,
    verifiedSourcesCount: 7,
    decisionRecords: [
      {
        id: 'dec_kaveri_1',
        decisionPoint: '₹6.5L European PLC Loom Upgrades vs Indigenous ESP32-S3 Tension Nodes',
        optionsAvailable: [
          'Replace 64 mechanical circular looms with ₹42L/unit European smart looms',
          'Import ₹6.5L proprietary European retrofit PLC cabinets per bank',
          'Design a DIN-rail opto-isolated ESP32-S3 + optical yarn-break & load-cell node locally',
        ],
        chosenOption: 'Custom ₹18,500 ESP32-S3 RS-485 Modbus RTU retrofit per loom',
        rationale:
          'Legacy Mayer & Terrot steel frames in Tiruppur remained mechanically sound; only sensing, elastane feed tension, and stop-motion speed lagged modern European specs.',
        consequences:
          'Retrofitted all 64 looms in 11 weeks at under 5% of new-machine CapEx, slashing seconds rejection from 14% to 3.6%.',
        hindsightRating: 'game_changer',
      },
      {
        id: 'dec_kaveri_2',
        decisionPoint: 'Commodity Cotton Apparel vs OEKO-TEX Standard 100 Medical Knits',
        optionsAvailable: [
          'Bid on high-volume basic T-shirt blanks competing against Bangladesh duty-free quotas',
          'Invest in OEKO-TEX Standard 100 certification, ZLD dye traceability, and medical compression knits',
        ],
        chosenOption: 'Transition 70% capacity to OEKO-TEX medical & technical compression fabrics',
        rationale:
          'EU hospitals and sports-medicine brands require verified chemical safety and yarn-tension consistency per roll, where Indian engineering mills command durable margins.',
        consequences:
          'Secured recurring German and Dutch purchase orders under HSN 6006/6115 with RoDTEP export remission.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. Fourteen Percent Seconds & Snapped Elastane on Avinashi Road',
        summary:
          'How optical IR break sensors and closed-loop tension gauges modernized 25-year-old mechanical circular knitting machines.',
        contentMarkdown: `In Tiruppur’s crowded knitting clusters, a single snapped spandex core yarn running undetected for 90 seconds ruins an entire 22 kg fabric roll.

Mechanical drop-wire stop-motions reacted too slowly at 32 RPM, leaving Tiruppur mills trapped in low-margin commodity apparel. Partnering with two embedded engineers from PSG Polytechnic in Coimbatore, Kaveri LoomWorks designed a **DIN-rail ESP32-S3 industrial controller**:
- **IR optical yarn-break gates** stop the main VFD inverter within **18 milliseconds**.
- **24-bit HX711 load-cell strain gauges** log elastane feed tension continuously over **RS-485 Modbus RTU**.
- **Dust-sealed IP65 polycarbonate boxes** keep cotton lint away from optocouplers and relays.`,
        keyTakeaway:
          'Retrofitting proven mechanical machinery with ₹20k industrial IoT nodes delivers 10x faster ROI than scrapping factories for imported turnkey lines.',
        interactivePrompt: {
          question:
            'Your factory has 64 mechanically healthy circular looms, but EU technical-textile buyers reject rolls with >1.5% tension drift. How do you modernize?',
          options: [
            'Take a ₹22 Cr loan to scrap all 64 machines and import new European looms',
            'Install optical yarn sensors + strain-gauge tension feedback connected via RS-485 to existing VFDs',
            'Hire 16 additional night-shift floor inspectors for manual checks',
          ],
          revealedOutcome:
            'Kaveri LoomWorks deployed ₹18,500 ESP32-S3 tension nodes per loom, kept CapEx under ₹12L total, and achieved ±0.4% tension repeatability.',
        },
      },
      {
        number: 2,
        title: '02. OEKO-TEX Standard 100, Digital Lot Logs & EU RoDTEP Shipments',
        summary:
          'Connecting floor-level sensor telemetry to European compliance audits and Tuticorin container dispatches.',
        contentMarkdown: `German orthopedic distributors did not buy on verbal quality promises—they audited chemical dye safety, wastewater compliance, and stitch-density repeatability.

1. **OEKO-TEX Standard 100 & ZLD:** Pairing Tiruppur’s Zero Liquid Discharge dyeing clusters with OEKO-TEX Annex 6 chemical testing opened regulated EU medical textile tenders.
2. **QR Roll Passport:** Every exported fabric roll carries tension variance charts automatically generated from the loom’s RS-485 gateway.
3. **RoDTEP Margin Lift:** Claiming RoDTEP scrips on HSN 6006/6115 shipments out of Tuticorin port directly covers air-sample freight for new European buyers.`,
        keyTakeaway:
          'Sensor telemetry plus recognized international eco-certifications turns Tier-2 Indian textile clusters into high-margin medical & technical exporters.',
      },
    ],
    createdAt: '2026-05-04T00:00:00.000Z',
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    id: 'story_tapi_photonics_surat',
    slug: 'tapi-photonics-surat-laser-galvo-spindles',
    title: 'Tapi Photonics: Replacing ₹18L Imported Diamond Laser Controllers in Surat',
    subjectName: 'Tapi Photonics',
    tagline:
      'Built in Katargam GIDC, Surat: custom 4-layer STM32H7 + FPGA XY2-100 laser galvo and air-bearing CNC spindle boards exported to Belgium and Israel.',
    storyType: 'company',
    category: 'Photonics & CNC',
    heroImageUrl:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Surat cuts 9 out of 10 rough diamonds on Earth, yet depended entirely on ₹18L imported laser galvo cards. Tapi Photonics engineered deterministic 4-layer FPGA + STM32H7 servo boards in Katargam GIDC—slashing downtime and exporting kits to Antwerp and Tel Aviv.',
    foundingYear: 2020,
    headquarters: 'Surat, Gujarat (Katargam GIDC)',
    metricsHighlights: [
      { label: 'Controller Cost Cut', value: '₹18L → ₹3.4L' },
      { label: 'Galvo Precision', value: '16-bit XY2-100' },
      { label: 'Export Hubs', value: 'Belgium & Israel' },
    ],
    readingTimeMinutes: 10,
    verifiedSourcesCount: 6,
    decisionRecords: [
      {
        id: 'dec_tapi_1',
        decisionPoint: 'Reselling Imported German Galvo Cards vs Designing Custom 4-Layer FPGA Servo Boards',
        optionsAvailable: [
          'Remain an authorized service reseller charging ₹18L per imported control rack',
          'Build a deterministic Lattice FPGA + STM32H7 controller supporting standard XY2-100 galvo scanners',
        ],
        chosenOption: 'Indigenous 4-layer impedance-controlled FPGA + STM32H7 servo controller',
        rationale:
          'Imported boards took 14–16 weeks to clear customs during spares shortages, halting 24/7 diamond-planning laser lines in Surat.',
        consequences:
          'Delivered ₹3.4L drop-in replacements with < 12 µm kerf accuracy and 48-hour board-swap warranties.',
        hindsightRating: 'game_changer',
      },
      {
        id: 'dec_tapi_2',
        decisionPoint: 'Domestic Surat Only vs CE Laser Safety & SCOMET Clearance for Antwerp Exports',
        optionsAvailable: [
          'Restrict sales to Gujarat diamond units without international safety dossiers',
          'Complete EN 60825-1 Class 1 interlock certification and DGFT SCOMET non-dual-use screening',
        ],
        chosenOption: 'Complete CE EN 60825-1 safety interlocks and DGFT SCOMET verification',
        rationale:
          'Precision optical/laser controllers attract export-control scrutiny at European and Israeli customs unless dual-use paperwork is crystal clear.',
        consequences:
          'Zero customs holds at Brussels and Ben Gurion air cargo; 40% of controller volume now ships overseas.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. When One Dead Laser Galvo Card Costs ₹4 Lakh a Day in Katargam',
        summary:
          'Reverse-engineering deterministic XY2-100 differential timing and air-bearing CNC spindle synchronization in Surat.',
        contentMarkdown: `Across Varachha and Katargam in Surat, green 532nm DPSS and fiber laser machines saw and bruiting-shape rough diamonds down to micron kerfs.

Whenever an imported European control card failed from summer power transients or cooling dust, factories paid **₹18 lakh** and waited weeks for customs clearance. Two optical and embedded engineers launched Tapi Photonics in a 1,200 sq ft GIDC unit:
- Built a **4-layer controlled-impedance PCB** pairing an **STM32H743** trajectory planner with a **Lattice ECP5 FPGA** driving **16-bit XY2-100 differential galvo frames** at 100 kHz.
- Added isolated 24V interlocks, hardware watchdog shutoffs, and active Peltier thermal stabilization rated for **45°C workshop ambient heat**.`,
        keyTakeaway:
          'Every high-cost imported industrial black box in an Indian manufacturing cluster is an open invitation for deterministic indigenous PCB + FPGA engineering.',
        interactivePrompt: {
          question:
            'Your first FPGA galvo prototype shows a 12-micron oscillation wave along 45-degree diagonal cuts when factory compressors kick in. What is the root cause?',
          options: [
            'Rewrite the user UI in a faster web framework',
            'Isolate analog DAC reference rails from switching supply noise and add PID notch filtering in FPGA logic',
            'Double the laser pulse power to burn wider kerfs',
          ],
          revealedOutcome:
            'Tapi Photonics separated analog ±15V galvo rails using low-noise LDOs, added differential termination, and tuned a 2.4 kHz notch filter—locking repeatable ±4 µm cuts.',
        },
      },
      {
        number: 2,
        title: '02. Navigating SCOMET, EPCG & Shipping to Antwerp and Tel Aviv',
        summary:
          'How Surat precision optics builders cleared export controls and established global spares depots.',
        contentMarkdown: `When Belgian and Israeli diamond houses tested Tapi Photonics’ retrofit kits in 2023, customs documentation mattered as much as optical precision.

1. **SCOMET & HS Classification:** Documenting pulse-repetition limits and non-military HS 8537/9013 classification upfront eliminated export-control delays.
2. **EPCG Optical Lab Setup:** Leveraging India’s Export Promotion Capital Goods (EPCG) scheme allowed duty-free import of beam profilers in exchange for committed export volumes.
3. **Modular Field Spares:** Pre-calibrated controller cartridges ship via DHL/FedEx air express directly to Antwerp and Ramat Gan workshops in 72 hours.`,
        keyTakeaway:
          'Deep-tech Indian MSMEs can out-execute European incumbents globally when spares ship fast and export compliance is engineered upfront.',
      },
    ],
    createdAt: '2026-06-18T00:00:00.000Z',
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
  {
    id: 'story_narmada_precision_rajkot',
    slug: 'narmada-precision-rajkot-coimbatore-castings',
    title: 'Narmada Precision Foundries: Diploma Machinists Scaling Castings to US OEMs',
    subjectName: 'Narmada Precision Foundries',
    tagline:
      'How Rajkot & Coimbatore polytechnic diploma machinists scaled 5-axis CNC tolerance control and ISO 9001 PPAP Level 3 castings to Midwest US OEMs.',
    storyType: 'company',
    category: 'Precision Manufacturing',
    heroImageUrl:
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Founded by Government Polytechnic diploma machinists across Rajkot and Coimbatore, Narmada Precision escaped raw-casting price wars by adding 5-axis CNC finishing, CMM metrology, and AIAG PPAP Level 3 dossiers—now shipping 18 containers annually to US agri and aerospace tooling OEMs.',
    foundingYear: 2017,
    headquarters: 'Rajkot (Gujarat) & Coimbatore (Tamil Nadu)',
    metricsHighlights: [
      { label: 'CNC Tolerance', value: '±8 Microns' },
      { label: 'Quality Standard', value: 'ISO 9001 PPAP L3' },
      { label: 'US Exports', value: '18 Containers/Yr' },
    ],
    readingTimeMinutes: 9,
    verifiedSourcesCount: 9,
    decisionRecords: [
      {
        id: 'dec_narmada_1',
        decisionPoint: 'Selling Raw Castings by Weight vs 5-Axis CNC Finish Machining + CMM Inspection',
        optionsAvailable: [
          'Sell rough unmachined SG-iron castings at ₹115/kg to domestic traders',
          'Combine Rajkot investment/SG foundries with Coimbatore 5-axis CNC finish cells and CMM verification',
        ],
        chosenOption: 'Integrated Rajkot foundry + Coimbatore 5-axis CNC & Mitutoyo CMM lab',
        rationale:
          'Raw foundry margins hover near 8%, whereas finished, pressure-tested hydraulic manifolds and ground-support brackets earn 3.4x higher realization per kg.',
        consequences:
          'Unlocked direct Tier-1 supplier agreements in Iowa and Illinois without middlemen brokers.',
        hindsightRating: 'game_changer',
      },
      {
        id: 'dec_narmada_2',
        decisionPoint: 'Informal Shopfloor Gauges vs Full AIAG PPAP Level 3 & Heat-Lot Traceability',
        optionsAvailable: [
          'Ship trial export batches with basic Vernier caliper PDFs',
          'Implement optical spectrometer melt checks, SPC Cp/Cpk ≥ 1.67, and PPAP Level 3 packages',
        ],
        chosenOption: 'Full AIAG PPAP Level 3 + barcoded heat-number melt traceability',
        rationale:
          'US OEM quality directors never switch suppliers for a 10% price discount if documentation cannot pass ISO/IATF incoming audits.',
        consequences:
          'First-pass container acceptance reached 99.4%, growing annual exports to 18 FCL sea containers via Mundra and Tuticorin.',
        hindsightRating: 'game_changer',
      },
    ],
    chapters: [
      {
        number: 1,
        title: '01. From Government Polytechnic Lathes to Shapar-Veraval & SIDCO',
        summary:
          'Why Indian Tier-2 machinists lose export RFQs not on machining skill, but on metrology proof and melt traceability.',
        contentMarkdown: `Three Government Polytechnic Mechanical Diploma classmates started Narmada Precision in Rajkot’s Shapar-Veraval GIDC with two reconditioned turret lathes.

Their turning point came after losing a $90,000 Midwest US hydraulic valve housing tender despite quoting 28% below a Polish rival. The American procurement lead explained bluntly: *"Your steel price is great, but you sent zero Cp/Cpk capability plots, no spectrometer chemistry certificate, and no CMM balloon drawing."*

The founders reorganized across two complementary Indian hubs:
- **Rajkot Foundry Hub:** Automated green-sand & lost-wax investment casting with optical emission spectrometer verification on every furnace heat.
- **Coimbatore SIDCO Cell:** 5-axis CNC finish machining holding **±8 micron bore concentricity**, deburring, and **Mitutoyo CMM** automated report generation.`,
        keyTakeaway:
          'Indian diploma and ITI machinists already hold world-class shopfloor intuition; pairing it with CMM data and PPAP Level 3 closes the global trust gap.',
        interactivePrompt: {
          question:
            'A US agri-equipment buyer flags micro-porosity in 4 out of 200 rough-machined ductile iron brackets during first-article inspection. How do you respond?',
          options: [
            'Argue that minor casting porosity is normal for agricultural parts',
            'Run ultrasonic NDT + X-ray gating redesign in Rajkot, issue a 8D root-cause report, and air-freight 200 verified replacements',
            'Stop bidding for US export orders and stick to local tractor repair shops',
          ],
          revealedOutcome:
            'Narmada issued a transparent 8D Corrective Action Report within 72 hours, redesigned feeder risers, and replaced all suspect lots—winning a 3-year master supply contract.',
        },
      },
      {
        number: 2,
        title: '02. VCI Export Packaging, Mundra Sea Freight & Scaling to 18 Containers/Year',
        summary:
          'Protecting ±8 micron steel surfaces across 35-day ocean voyages under RoDTEP and ECGC cover.',
        contentMarkdown: `Machining to ±8 microns means nothing if ocean humidity rusts bore faces inside a 40-foot sea container crossing the Arabian Sea and Suez Canal.

1. **VCI Corrosion Engineering:** Every finished manifold is ultrasonic-washed, dipped in dry-film rust preventive, and heat-sealed in Volatile Corrosion Inhibitor (VCI) polybags inside ISPM-15 fumigated pallets.
2. **Dual-Port Flexibility:** Rajkot shipments exit **Mundra Port** while Coimbatore CNC assemblies consolidate out of **Tuticorin / Chennai**.
3. **Policy Leverage:** Combining **MSME Udyam TReDS** invoice discounting with **RoDTEP** export scrips lets a diploma-founded firm finance raw steel without diluting equity.`,
        keyTakeaway:
          'Export readiness covers metallurgy, metrology, VCI sea-packaging, and working-capital tooling—every single step can be built from Tier-2 India.',
      },
    ],
    createdAt: '2026-07-09T00:00:00.000Z',
    updatedAt: '2026-11-20T00:00:00.000Z',
  },
];

export async function listBuildStories(category?: string): Promise<BuildJourneyStory[]> {
  if (!category || category === 'All') return FEATURED_BUILD_STORIES;
  return FEATURED_BUILD_STORIES.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
}

export async function getBuildStory(slug: string): Promise<BuildJourneyStory | null> {
  return FEATURED_BUILD_STORIES.find((s) => s.slug === slug) || null;
}
