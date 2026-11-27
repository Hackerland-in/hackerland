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
  {
    slug: 'uncertified-rf-module-nhava-sheva-seizure',
    title: 'Bare Uncertified RF Module Seized at Nhava Sheva & BLR Air Cargo',
    tagline: 'Zero WPC ETA & Non-Modular FCC Planning Turned a ₹4.2L Inventory Drop into Dead Scrap',
    category: 'Consumer Electronics',
    lifespan: '2024 – 2025 (6-Week Customs Hold)',
    capitalBurned: '₹4.2 Lakh Dead Inventory + Demurrage',
    primaryFailureMode: 'Regulatory Barrier',
    summary:
      'An industrial telemetry startup shipped 1,200 bare Sub-GHz and 2.4 GHz RF transceiver boards without obtaining WPC Equipment Type Approval (ETA-SD) on SARAL Sanchar or using FCC/CE pre-certified shielded RF modules. Nhava Sheva Customs and Bengaluru Air Cargo detained the consignment under wireless import rules, burning ₹4.2L in dead stock, port demurrage, and missed export penalties.',
    productSpecs: [
      '1,200 bare 915 MHz / 2.4 GHz chip-antenna RF transceivers imported under HS Code 85176290',
      'Zero WPC ETA-SD (Equipment Type Approval — Self Declaration) filed on SARAL Sanchar',
      'Omitted metal EMI shield can required by FCC Part 15.212 modular certification reuse',
      'Non-compliant frequency allocation (915 MHz US band colliding with Indian cellular bands instead of 865–867 MHz)',
    ],
    rootCauseAutopsy: [
      {
        stage: 'Spectrum & Import Compliance',
        failureTrigger: 'Missing WPC ETA-SD & Wrong Sub-GHz Band (915 MHz vs 865–867 MHz)',
        detail:
          'The hardware team copied an American open-source 915 MHz LoRa reference schematic verbatim. Under India’s National Frequency Allocation Plan (NFAP), 865–867 MHz is de-licensed while 915 MHz overlaps licensed telecom spectrum—making WPC import clearance impossible.',
        warningSigns: [
          'Freight forwarder flagged "Wireless Apparatus — WPC NOC Required" on the Airway Bill.',
          'Supplier datasheet listed US FCC Part 15 only without RF test reports for India or EU RED.',
        ],
      },
      {
        stage: 'RF Shielding & Modular Approval',
        failureTrigger: 'Bare Unshielded RF Silicon Instead of Pre-Certified Modules',
        detail:
          'Saving ₹180 per board by placing bare RF SoCs directly on a 2-layer PCB invalidated modular FCC/CE reuse. Passing intentional-radiator NABL/FCC chamber testing would have cost ₹7.5L and 4 months—more than the entire seed order value.',
        warningSigns: [
          'No metal shield footprint or 50-ohm pi-matching network verified on VNA before Shenzhen PCBA.',
        ],
      },
      {
        stage: 'Customs & Working Capital Crunch',
        failureTrigger: 'Accumulating Air Cargo Demurrage at BLR & Nhava Sheva',
        detail:
          'Without DGFT IEC wireless documentation or an R&D test-sample exemption letter, cargo storage fees compounded at ₹3,500/day until disposal cost exceeded invoice value.',
        warningSigns: [
          'Ordered full 1,200-unit batch before clearing a 5-unit sample airway bill.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Dual-Footprint Pre-Certified RF Module Carrier',
        utility: 'Drop-in footprints supporting pre-certified WPC/FCC/CE cans (ESP32-WROOM, nRF52840, SX1262 865/868 MHz modules)',
        modernSuccessors: ['Agri-IoT gateways with WPC ETA-SD', 'Export-ready EU RED 868 MHz industrial nodes'],
      },
      {
        innovation: 'Pre-Shipment Compliance Gate Checklist',
        utility: 'Mandatory HS code + NFAP frequency + WPC/BIS clearance check before issuing purchase orders',
        modernSuccessors: ['Hackerland Compliance Wizard', 'Automated Customs BOM pre-audits'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'File WPC ETA-SD and check India NFAP bands before ordering PCBAs',
        advice:
          'Never copy a 915 MHz US RF reference design for Indian deployment or mixed export. Verify 865–867 MHz (India) / 868 MHz (EU) / 2.4 GHz de-licensed limits and secure WPC ETA on SARAL Sanchar before air freight leaves the fab.',
        antiPattern: 'Assuming customs treats commercial wireless boards like passive resistors.',
      },
      {
        principle: 'Always ship pre-certified shielded RF modules under 5,000 units',
        advice:
          'Paying ₹150–₹250 extra for a pre-certified metal-shielded module (with valid FCC ID, CE RED, and WPC reports) eliminates ₹7L–₹12L in intentional-radiator chamber re-testing.',
        antiPattern: 'Placing bare RF chips on early batch boards to shave ₹120 off BOM.',
      },
    ],
  },
  {
    slug: 'single-source-mcu-coimbatore-agri-po-halt',
    title: 'Single-Source MCU & Connector Shortage Halting a 500-Unit Coimbatore Agri-Sensor PO',
    tagline: 'Zero Second-Source BOM Alternates Froze a ₹3.8L Drip-Irrigation Order at Assembly',
    category: 'Hardware & Robotics',
    lifespan: '2023 – 2024 (18-Week Production Halt)',
    capitalBurned: '₹3.8 Lakh Blocked WIP & Cancelled PO',
    primaryFailureMode: 'Supply Chain & Manufacturing Hell',
    summary:
      'A Coimbatore agri-automation startup won a confirmed 500-unit purchase order for solar soil-moisture and solenoid valve controllers. Their KiCad BOM relied on a single proprietary QFN microcontroller and an exotic European IP68 push-pull connector with zero second-source alternates—halting assembly for 18 weeks with ₹3.8L in half-populated PCBs and custom ABS enclosures stranded.',
    productSpecs: [
      '500 partially populated 4-layer ENIG controller PCBs lacking QFN-48 specialty MCU',
      'Niche 5-pin proprietary European circular connector with 26-week MOQ 2,000 factory lead time',
      '₹1.4L custom ABS injection-molded enclosure cutouts matched exclusively to that connector flange',
      'Hardcoded vendor register firmware unable to compile cleanly on pin-compatible alternates',
    ],
    rootCauseAutopsy: [
      {
        stage: 'BOM Architecture & Sourcing',
        failureTrigger: '0 Second-Source Alternates for Primary MCU & Field Connector',
        detail:
          'Designers picked a specialty low-volume MCU suffix and boutique connector found on a single distributor page without checking stock depth across Mouser, DigiKey, LCSC, or Indian industrial markets.',
        warningSigns: [
          'Prototype batch used the last 8 loose samples on the bench with zero safety stock.',
          'BOM spreadsheet had blank "Alternate MPN" columns.',
        ],
      },
      {
        stage: 'PO Acceptance & Working Capital',
        failureTrigger: 'Signing 45-Day Delivery Penalties Without Component Allocation Lock',
        detail:
          'The startup accepted an agri-cooperative PO and ₹1.9L advance without locking distributor reel allocation first. Two weeks later, global lead time jumped to 26 weeks, triggering liquidated damages and PO cancellation.',
        warningSigns: [
          'Assumed Bengaluru/Coimbatore local traders could source specialty European connectors overnight.',
        ],
      },
      {
        stage: 'Firmware & Enclosure Lock-In',
        failureTrigger: 'Tight Hardware Register & Mechanical Cutout Coupling',
        detail:
          'Swapping to an available STM32/RP2040/ESP32 or standard M12 A-coded connector required re-spinning the PCB layout, modifying the aluminum mold cavity, and rewriting bare-metal timer interrupts.',
        warningSigns: [
          'Application sensor logic mixed directly with proprietary MCU peripheral register pointers.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Standardized M12 / Deutsch DT Industrial Field Harnessing',
        utility: 'Universal IP67/IP68 connector footprints stocked across Pune, Coimbatore, and global distributors',
        modernSuccessors: ['Modular Indian smart-irrigation controllers', 'Multi-vendor industrial RS-485 nodes'],
      },
      {
        innovation: 'Zephyr RTOS / Hardware Abstraction Layer (HAL) Firmware',
        utility: 'Board-overlay architecture allowing same-week MCU swaps across ARM Cortex-M and RISC-V families',
        modernSuccessors: ['Resilient multi-MCU agri-sensor fleets', 'Dual-footprint KiCad BOMs'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'Enforce 2 stocked second-source MPNs before freezing Gerbers',
        advice:
          'Every critical IC, regulator, and IP67 connector must have at least two pin-compatible or dual-footprint alternates with >5,000 units in active distributor stock before quoting delivery timelines.',
        antiPattern: 'Validating a design with 3 engineering samples and assuming mass procurement is trivial.',
      },
      {
        principle: 'Use globally standardized industrial connectors (M12, Deutsch DT, GX16)',
        advice:
          'Standardized M12 and Deutsch connectors are stocked locally across Indian industrial corridors and export markets, preventing enclosure mold lock-in.',
        antiPattern: 'Cutting expensive enclosure molds around single-vendor boutique connectors.',
      },
    ],
  },
  {
    slug: 'uncertified-liion-pack-air-cargo-rejection',
    title: 'Uncertified Li-Ion Pack Rejected by Air Cargo & Failing AIS-156 Thermal Runaway',
    tagline: 'Missing UN 38.3 Transport Certification & Unpotted Nickel Strips Killed a ₹2.9L Export Demo',
    category: 'CleanTech & Energy',
    lifespan: '2024 – 2025 (Cargo Quarantine & Lab Venting)',
    capitalBurned: '₹2.9 Lakh Scrapped Packs & Freight Fines',
    primaryFailureMode: 'Thermal & Physics Limit',
    summary:
      'A portable solar and light-EV builder packed 40 custom 48V 21700 Li-ion packs for European distributor demos and fleet trials without UN 38.3 transport test certification or AIS-156 thermal-propagation barriers. Airport Dangerous Goods screening quarantined the shipment as undeclared Class 9 Hazmat while unpotted field units suffered cell-to-cell thermal runaway.',
    productSpecs: [
      '40 units of 48V 13S4P NMC 21700 battery packs (~1.1 kWh capacity each)',
      'Zero UN 38.3 (T1–T8 altitude, thermal, vibration, impact, short-circuit) air-transport certificate',
      'Spot-welded pure nickel strips with zero cell-level fusible links or FR-epoxy potting',
      'Single NTC thermistor mounted on BMS PCB instead of core cell-cluster temperature probes',
    ],
    rootCauseAutopsy: [
      {
        stage: 'IATA Dangerous Goods & Export Logistics',
        failureTrigger: 'Shipping >100 Wh Li-Ion Packs by Air Without UN 38.3 T1–T8 Report',
        detail:
          'Lithium-ion batteries exceeding 100 Wh (UN 3480) are strictly regulated Class 9 Dangerous Goods. Express couriers quarantined the uncertified packs at Mumbai/Bengaluru air cargo, levying hazmat inspection fines and forcing hazardous disposal.',
        warningSigns: [
          'Tried shipping finished battery packs under "Electronic Power Supply" HS descriptions.',
          'Relied on individual cell manufacturer UN 38.3 PDFs instead of assembled pack certification.',
        ],
      },
      {
        stage: 'Thermal Propagation & AIS-156 Barriers',
        failureTrigger: 'Zero Thermal Potting or Phase-Change Cell Spacers',
        detail:
          'Packing NMC cylindrical cells shoulder-to-shoulder inside shrink-wrap without polycarbonate honeycomb spacing or flame-retardant thermal potting meant a single overheated cell ignited neighboring rows during 42°C ambient fast-charging.',
        warningSigns: [
          'Enclosure surface exceeded 63°C during 1.5C bench discharge without active cutoff.',
        ],
      },
      {
        stage: 'BMS Safety Telemetry',
        failureTrigger: 'Single BMS-Board Thermistor Missed Core Cell Hotspot',
        detail:
          'The lone thermistor sat near discharge MOSFETs rather than center-pack 21700 cells, reporting normal 39°C temperatures while center cells hit 78°C and vented.',
        warningSigns: [
          'Skipped multi-point thermocouple mapping during high-ambient Indian summer load tests.',
        ],
      },
    ],
    salvageableInnovations: [
      {
        innovation: 'Wire-Bonded Fusible Link + Thermal Potted Module Architecture',
        utility: 'Cell-level fuse wires and FR-grade potting compound arresting single-cell thermal runaway',
        modernSuccessors: ['AIS-156 Phase-2 compliant 2W/3W packs', 'UN 38.3 certified export storage packs'],
      },
      {
        innovation: 'LFP (LiFePO4) Export Chemistry Migration',
        utility: 'Superior thermal stability (>270°C runaway threshold vs ~150°C NMC) for stationary & solar export units',
        modernSuccessors: ['Exportable solar-microgrid LFP modules', 'CE/UN 38.3 certified commercial packs'],
      },
    ],
    lessonsForBuilders: [
      {
        principle: 'Budget UN 38.3 NABL testing before promising international air-freight demos',
        advice:
          'Cell-level UN 38.3 does NOT cover an assembled battery pack. Budget ₹1.5L–₹3.0L and 6 weeks for pack-level UN 38.3 certification—or partner with an already certified Indian pack contract manufacturer for early export pilots.',
        antiPattern: 'Assuming courier hubs will ignore lithium pack ratings inside sample crates.',
      },
      {
        principle: 'Design AIS-156 thermal barriers and multi-point core NTCs from Pack v1',
        advice:
          'Use proper cell spacing, fire-retardant potting or mica separators, pressure-relief vents, and minimum 4 distributed NTC probes inside the cell matrix.',
        antiPattern: 'Shrink-wrapping raw NMC cells tight together to hit smaller enclosure dimensions.',
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
