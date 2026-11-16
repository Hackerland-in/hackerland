import type { MuseumExhibit } from '@hackerland/core';

export const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    slug: 'juicero-cold-press',
    title: 'Juicero Cold-Pressed Juice System',
    tagline: 'When 4 Tons of Precision Aircraft Aluminum Met Human Hands',
    category: 'Consumer Electronics',
    lifespan: '2013 – 2017',
    capitalBurned: '$118.5 Million',
    primaryFailureMode: 'Feature Over-Engineering',
    summary:
      'The definitive cautionary tale of hardware over-engineering. An internet-connected, 400-part press capable of exerting 4,000 lbs of force (enough to lift two Tesla Model S cars) to squeeze fruit pulp packets—which Bloomberg famously revealed could be squeezed faster by bare human hands.',
    productSpecs: [
      'Custom 4,000 lbs force cast gearbox driven by 12V high-torque motor',
      'Over 11 custom CNC machined aluminum structural extrusions and hinges',
      'Embedded Wi-Fi & QR optical reader to scan bag expiration timestamps',
      'Initial retail price: $699; slashed to $399 before shutdown',
    ],
    rootCauseAutopsy: [
      {
        stage: 'Industrial Design & DFM',
        failureTrigger: 'Zero Tolerance for Cost Optimization',
        detail:
          'Founder Doug Evans insisted on aerospace tolerances and bespoke cast-and-milled aluminum hinges. Bolt Holes were countersunk with micron precision where a simple injection-molded latch would have performed identically.',
        warningSigns: [
          'Bill of Materials (BOM) was over $750 per unit on launch day.',
          'Manufacturing yield was crippled by high reject rates on custom aluminum tolerances.',
        ],
      },
      {
        stage: 'Customer Problem Invalidation',
        failureTrigger: 'The Bloomberg Hand-Squeeze Video',
        detail:
          'In April 2017, journalists demonstrated that two human hands could squeeze the proprietary pulp bags in 90 seconds with 95% yield—completely bypassing the $400 Wi-Fi connected press.',
        warningSigns: [
          'No early customer interviews tested whether users cared about automated pressing versus the juice quality itself.',
        ],
      },
      {
        stage: 'DRM / Walled Garden Friction',
        failureTrigger: 'Forced Connectivity to Drink Juice',
        detail:
          'If the Wi-Fi connection dropped or the bag was 1 hour past expiration, the machine locked up and refused to press, infuriating morning commuters.',
        warningSigns: [
          'Customers complained about cloud dependencies for basic mechanical functions.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Optical Packet Expiration Scanner',
        utility: 'Prevents dispensing expired food/pharma supplies in automated retail',
        modernSuccessors: ['IoT Nespresso & Keurig pods', 'Smart medical supply dispensing lockers'],
      },
      {
        innovation: 'Custom High-Pressure Closed-Cell Extrusions',
        utility: 'Compact hydraulic-equivalent force generation using electro-mechanical gearboxes',
        modernSuccessors: ['Lab-on-a-chip cell disruptors', 'Automated coffee puck tampers'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'Never automate what hands can do without a 10x delta',
        advice:
          'Before designing a mechanical actuator, test whether a human user can perform the task manually with minimal fatigue. If yes, your mechanical complexity is a liability.',
        antiPattern: 'Over-engineering a mundane physical task to justify venture capital scale.',
      },
      {
        principle: 'BOM discipline must precede industrial elegance',
        advice:
          'Design for standard COTS (Commercial Off-The-Shelf) parts first. Every custom CNC part adds tooling lead time, scrap rate, and assembly friction.',
        antiPattern: 'Milling components from solid billets of aluminum when stamped sheet metal suffices.',
      },
    ],
  },
  {
    slug: 'theranos-minilab-edison',
    title: 'Theranos MiniLab "Edison" Capillary Blood Analyzer',
    tagline: 'When Marketing Clashed Against Microfluidic Physics',
    category: 'DeepTech & Biotech',
    lifespan: '2003 – 2018',
    capitalBurned: '$700+ Million',
    primaryFailureMode: 'Thermal & Physics Limit',
    summary:
      'Theranos promised to run hundreds of medical diagnostic tests from a single pinprick of blood (nanotainer). Behind the polished black box, the fundamental laws of fluid dynamics, sample volume limits, and thermal cross-talk made the machine a thermodynamic impossibility.',
    productSpecs: [
      'Miniaturized 3-axis Cartesian robotic pipettor inside an enclosed desktop chassis',
      'Spectrophotometer, fluorometer, and chemiluminescence detectors',
      'Targeted 200+ clinical blood assays from ~50 µL capillary blood volume',
      'Zero commercial regulatory validation before clinical deployment',
    ],
    rootCauseAutopsy: [
      {
        stage: 'Physics & Biological Limits',
        failureTrigger: 'Capillary Blood Sampling Variance & Hemolysis',
        detail:
          'Lancing a finger squeezes interstitial fluid into the capillary blood, rupturing red blood cells (hemolysis) and causing erratic potassium and enzyme readings that cannot be corrected by software.',
        warningSigns: [
          'Test results fluctuated by over 40% between successive finger-pricks of the same patient.',
        ],
      },
      {
        stage: 'Thermal Management & Mechanical Cross-Talk',
        failureTrigger: 'Heat Build-up in a Sealed Box',
        detail:
          'Packing high-speed stepper motors, power supplies, and sensitive enzymatic assays into a sealed decorative chassis drove internal temperatures above 38°C, denaturing enzymes and invalidating antibody binding reactions.',
        warningSigns: [
          'Engineers had to run the machines with the doors open and desk fans blowing inside the lab.',
        ],
      },
      {
        stage: 'Dilution Impossibility',
        failureTrigger: 'Below Limit of Detection (LoD)',
        detail:
          'To run multiple tests from 50 µL, Theranos diluted samples by up to 20x. This dropped target analyte concentrations below the physical Limit of Detection of standard photometric sensors.',
        warningSigns: [
          'Secretly modifying commercial Siemens Advia 1800 machines to run diluted samples.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Microfluidic Centrifugal Separation Disc',
        utility: 'Passive plasma separation from whole blood using micro-capillary channels without heavy centrifuges',
        modernSuccessors: ['Point-of-care rapid sepsis diagnostics', 'Abbott i-STAT cartridge systems'],
      },
      {
        innovation: 'Consumer-Centric Wellness Testing UX',
        utility: 'Price transparency and walk-in retail blood screening without doctor referral',
        modernSuccessors: ['Function Health', 'Superpower Health screening'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'Physics will never negotiate with your charisma',
        advice:
          'If a technology requires violating known thermodynamic, optical, or fluidic limits, no amount of venture capital, marketing, or NDA enforcement will make it work.',
        antiPattern: 'Treating hardware and biochemistry like software that can be "patched later in production".',
      },
      {
        principle: 'Transparent peer review is the only defense',
        advice:
          'Deep-tech inventions must be stress-tested against independent scientific peer review and blinded third-party validations early in the lifecycle.',
        antiPattern: 'Hiding validation datasets behind trade secret claims.',
      },
    ],
  },
  {
    slug: 'better-place-ev-battery-swapping',
    title: 'Better Place Global EV Battery Swapping Infrastructure',
    tagline: 'The Standardized Hardware Platform Trap That Burned $850M',
    category: 'Automotive & EV',
    lifespan: '2007 – 2013',
    capitalBurned: '$850 Million',
    primaryFailureMode: 'Premature Scaling',
    summary:
      'Long before Tesla mastered global Supercharging networks, Better Place raised nearly a billion dollars to build robotic underground battery-swapping stations across Israel and Denmark. They proved that building heavy infrastructure before industry standardization is fatal.',
    productSpecs: [
      'Robotic underground automated battery swap in under 3 minutes',
      'High-voltage pneumatic latching mechanism connecting 250 kg battery to chassis',
      'Over $500,000 CapEx per automated swapping station',
      'Only 1 automotive partner (Renault Fluence Z.E.) committed to the standard',
    ],
    rootCauseAutopsy: [
      {
        stage: 'Industry Alignment & Standards',
        failureTrigger: 'Automakers Refused Standardized Chassis Geometries',
        detail:
          'OEMs (BMW, Nissan, Toyota) view vehicle chassis design, center of gravity, and battery pack integration as their core proprietary differentiator. None agreed to adopt Better Place’s bulky, standardized battery footprint.',
        warningSigns: [
          'Only one car model (Renault Fluence Z.E.) ever rolled off assembly lines with compatibility.',
        ],
      },
      {
        stage: 'Capital Expenditure & Utilization Rates',
        failureTrigger: 'Astronomical Station Idle Cost',
        detail:
          'Each swap station cost over $500,000 to construct and required keeping dozens of idle $10,000 battery packs on continuous trickle charge. With fewer than 1,000 compatible cars on the road, utilization hovered below 3%.',
        warningSigns: [
          'Station operating costs exceeded revenue by 20x throughout 2011 and 2012.',
        ],
      },
      {
        stage: 'Fast-Charging Curve Compression',
        failureTrigger: 'DC Fast Charging Made Swapping Redundant for Cars',
        detail:
          'As lithium-ion chemistry improved and DC fast chargers moved from 50 kW to 150 kW+, drivers became willing to stop for 20 minutes instead of requiring complex underground robotics.',
        warningSigns: [
          'Tesla debuted the 120 kW Supercharger in late 2012, requiring 1/10th the station CapEx.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Two-Wheeler Swappable Battery Packs',
        utility: 'Lightweight (10–12 kg) modular battery packs that humans can swap without robotics',
        modernSuccessors: ['Gogoro (Taiwan)', 'Yulu & Bounce Infinity (India)', 'Sun Mobility network'],
      },
      {
        innovation: 'Battery Health Telematics & Predictive Swap Scheduling',
        utility: 'Algorithms balancing grid demand and charging batteries during off-peak solar/wind hours',
        modernSuccessors: ['Grid-scale virtual power plants (VPP)', 'NIO Power Swap (China)'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'Do not build two-sided infrastructure without open standards',
        advice:
          'If your product requires an entire industry of competing incumbents to surrender their design autonomy, your venture is doomed unless mandated by government regulation.',
        antiPattern: 'Committing to fixed physical infrastructure before the underlying product standard has consolidated.',
      },
      {
        principle: 'Physics scales better down than up',
        advice:
          'Battery swapping failed for 1,500 kg cars because 300 kg batteries require industrial cranes and hydraulic lifts. It succeeds brilliantly for 100 kg electric mopeds where a teenager can swap a 10 kg pack by hand in 15 seconds.',
        antiPattern: 'Applying heavy robotics where lightweight human-scale ergonomics solve the problem.',
      },
    ],
  },
  {
    slug: 'lily-robotics-flying-camera',
    title: 'Lily Robotics Waterproof Throw-and-Fly Drone',
    tagline: 'The $34M Pre-Order Video That Promised What Avionics Could Not Deliver',
    category: 'Hardware & Robotics',
    lifespan: '2013 – 2017',
    capitalBurned: '$34 Million in Pre-Orders + $15M Venture Capital',
    primaryFailureMode: 'Supply Chain & Manufacturing Hell',
    summary:
      'Lily’s 2015 launch video went viral worldwide: throw a smiling, waterproof drone into a river, and it automatically flies up and films you snowboarding. The prototype in the video was faked using professional camera operators and a DJI drone; the actual engineering proved far more difficult than the marketing.',
    productSpecs: [
      'Waterproof sealed chassis with upward-facing sonar and optical tracking',
      'Throw-to-launch accelerometer sensing triggering automatic motor start',
      'Follow-me tracking via wrist-worn GPS and radio beacon',
      'Target price: $499 pre-order ($999 retail)',
    ],
    rootCauseAutopsy: [
      {
        stage: 'Avionics & Sensor Fusion',
        failureTrigger: 'IMU Saturation on Water Impact & Throw Shock',
        detail:
          'Throwing a quadcopter into the air or dropping it in water creates high G-forces that saturated early MEMS accelerometers, corrupting the Kalman filter attitude estimation and causing the drone to flip upside down.',
        warningSigns: [
          'Flight tests consistently spiraled into the ground upon throw unless launched in near-zero wind.',
        ],
      },
      {
        stage: 'RF & Vision Tracking Latency',
        failureTrigger: 'Beacon Drift Without Optical Flow',
        detail:
          'Standard consumer GPS on the wrist tracker had a position error radius of 3–5 meters. At high speeds (snowboarding), the drone lagged behind or drifted directly into trees because it lacked obstacle avoidance sensors.',
        warningSigns: [
          'Pre-order demo videos were shot with a DJI Inspire drone holding a mock Lily camera.',
        ],
      },
      {
        stage: 'Tooling Delays & Cash Burn',
        failureTrigger: 'The Crowdfunding Delivery Death Spiral',
        detail:
          'Lily delayed shipping four times over two years. As battery shelf life expired and DJI launched the Mavic Pro with folding arms and 4K video, customer cancellation requests drained Lily’s bank accounts.',
        warningSigns: [
          'Mass customer refund demands forced the company into liquidation before shipping a single retail unit.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Throw-to-Launch Flight Controller Logic',
        utility: 'Auto-motor start upon zero-g freefall detection',
        modernSuccessors: ['DJI Tello & Neo drones', 'Skydio autonomous tracking algorithms'],
      },
      {
        innovation: 'Wearable Beacon Follow-Me Mode',
        utility: 'RF ultra-wideband (UWB) distance ranging for sports filming',
        modernSuccessors: ['SOLOSHOT automated camera mounts', 'HoverAir X1 smart camera'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'Never let marketing outrun your working prototype',
        advice:
          'Producing a high-gloss CGI promotional video with faked capabilities will generate pre-orders that become an inescapable legal and financial noose when manufacturing hits inevitable delays.',
        antiPattern: 'Showing features in marketing materials that have never worked reliably on hardware testbenches.',
      },
      {
        principle: 'Hardware pre-orders are a liability, not revenue',
        advice:
          'Pre-order funds must be treated as customer debt on your balance sheet. If your unit BOM increases during DFM, every pre-order you sold at a discount accelerates your bankruptcy.',
        antiPattern: 'Spending pre-order cash on marketing and office leases before freezing the manufacturing BOM.',
      },
    ],
  },
];

export function listMuseumExhibits(): MuseumExhibit[] {
  return MUSEUM_EXHIBITS;
}

export function getMuseumExhibitBySlug(slug: string): MuseumExhibit | undefined {
  return MUSEUM_EXHIBITS.find((e) => e.slug === slug);
}
