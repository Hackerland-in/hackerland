import { describe, expect, it } from 'vitest';
import {
  TRACKS,
  TRACK_META,
  compensationSchema,
  formatMoney,
  handleSchema,
  opportunitySchema,
  parseEnum,
  REPUTATION_EVENT_KINDS,
  REPUTATION_POINTS,
  reputationTotal,
  trackSchema,
  ideaSchema,
  problemSchema,
  buildJourneyStorySchema,
  museumExhibitSchema,
  evaluateHardwareFailureRisk,
  observatoryItemSchema,
  prototypeArchitecturePlanSchema,
  projectSquadRoomSchema,
  clubChapterSchema,
  equipmentReservationSchema,
  calculateClubReadinessScore,
  filterClubs,
  defensivePublicationSchema,
  submitInventionDefenseSchema,
  verifyInventionIntegrity,
  generatePriorArtAffidavitText,
  filterDefensiveLedger,
  juniorChallengeSchema,
  juniorShowcaseProjectSchema,
  guardianConsentSchema,
  filterJuniorChallenges,
  generateJuniorPassportCredential,
  calculateIpc2152Trace,
  calculateSmpsBuck,
  calculateThermalHeatsink,
  auditBomItems,
  componentSourcingItemSchema,
  calculateCampaignProgress,
  calculateMilestonePayout,
  verifyMilestoneQuorum,
  matchGrantsForProject,
  campaignSchema,
  calculateBomMarkup,
  validatePinoutAnnotation,
  filterTeardownsByCategory,
  teardownSubmissionSchema,
  formatSalaryRangeInr,
  calculateHiringMatchScore,
  filterHardwareJobs,
  hardwareJobPostingSchema,
  computeTelemetryStats,
  detectTelemetryAnomalies,
  calculateBmsCellSpread,
  calculateAttitudeAngles,
  parseCsvTelemetry,
  calculateFlashPartitionLayout,
  filterFirmwareRegistry,
  formatFirmwareBytes,
  firmwareRegistryItemSchema,
  matchComplianceRequirements,
  evaluatePreComplianceReadiness,
  formatComplianceCost,
  complianceRoadmapItemSchema,
  validateScpiCommandScript,
  calculateTestbedBookingCost,
  filterTestbedFacilities,
  testbedFacilitySchema,
} from './index';

describe('tracks', () => {
  it('accepts known tracks and rejects unknown ones', () => {
    expect(trackSchema.parse('design')).toBe('design');
    expect(trackSchema.safeParse('art').success).toBe(false);
  });

  it('has metadata for exactly the six tracks', () => {
    expect(Object.keys(TRACK_META)).toEqual([...TRACKS]);
  });
});

describe('compensationSchema', () => {
  it('requires amount and currency for a stipend', () => {
    expect(compensationSchema.safeParse({ type: 'stipend' }).success).toBe(false);
  });

  it('accepts a monthly stipend with amount and currency', () => {
    const result = compensationSchema.safeParse({
      type: 'stipend',
      amount: 40000,
      currency: 'INR',
      period: 'month',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a volunteer role without an amount', () => {
    expect(compensationSchema.safeParse({ type: 'volunteer' }).success).toBe(true);
  });
});

describe('opportunitySchema', () => {
  const bounty = {
    kind: 'bounty',
    title: 'Port the KisanSense firmware to ESP32-C6',
    summary: 'Move the sensor node firmware to the new low-power chip.',
    sponsor: { name: 'Open Agritech Collective', url: 'https://example.org' },
    reward: { amount: 15000, currency: 'INR' },
    tracks: ['make', 'code'],
    deadline: '2026-12-15',
    status: 'open',
  };

  it('accepts a complete bounty', () => {
    expect(opportunitySchema.safeParse(bounty).success).toBe(true);
  });

  it('rejects an opportunity with no tracks', () => {
    expect(opportunitySchema.safeParse({ ...bounty, tracks: [] }).success).toBe(false);
  });
});

describe('reputation', () => {
  it('assigns a positive integer to every event kind', () => {
    for (const kind of REPUTATION_EVENT_KINDS) {
      const points = REPUTATION_POINTS[kind];
      expect(Number.isInteger(points) && points > 0).toBe(true);
    }
  });

  it('sums ledger points', () => {
    expect(reputationTotal([{ points: 10 }, { points: 5 }])).toBe(15);
    expect(reputationTotal([])).toBe(0);
  });
});

describe('formatMoney', () => {
  it('uses Indian digit grouping for rupees', () => {
    expect(formatMoney(150000, 'INR')).toBe('₹1,50,000');
  });

  it('formats dollars and euros without decimals', () => {
    expect(formatMoney(500, 'USD')).toBe('$500');
    expect(formatMoney(2000, 'EUR')).toBe('€2,000');
  });
});

describe('handleSchema', () => {
  it('lowercases a valid handle', () => {
    expect(handleSchema.parse('Meera-Iyer')).toBe('meera-iyer');
  });

  it.each(['ab', '-abc', 'a b c', 'a'.repeat(31)])('rejects %j', (handle) => {
    expect(handleSchema.safeParse(handle).success).toBe(false);
  });

  it('accepts a 30-character handle', () => {
    expect(handleSchema.safeParse('kavya-subramaniam-ramakrishnan').success).toBe(true);
  });
});

describe('parseEnum', () => {
  it('returns the value when it is a member', () => {
    expect(parseEnum(TRACKS, 'make')).toBe('make');
  });

  it('returns undefined for unknown or non-string input', () => {
    expect(parseEnum(TRACKS, 'foo')).toBeUndefined();
    expect(parseEnum(TRACKS, ['make'])).toBeUndefined();
  });
});

describe('ecosystem domain schemas', () => {
  it('validates a stage zero idea', () => {
    const validIdea = {
      id: 'idea_1',
      creatorId: 'u_1',
      creatorHandle: 'builder',
      creatorName: 'Builder',
      title: 'Solar Water Condenser',
      slug: 'solar-water-condenser',
      summary: 'Extracting drinking water from desert air using solar power.',
      problemStatement: 'Saline groundwater in arid Rajasthan causes fluorosis and health crisis.',
      targetAudience: 'Villages in Jaisalmer',
      currentStage: 'notice',
      status: 'exploring',
      domains: ['Clean Water', 'Solar'],
      neededRoles: ['Mechanical Engineer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(ideaSchema.safeParse(validIdea).success).toBe(true);
  });

  it('validates an unsolved problem', () => {
    const validProblem = {
      id: 'prob_1',
      title: 'Affordable Non-Invasive Hemoglobin Sensor',
      slug: 'affordable-non-invasive-hemoglobin-sensor',
      description: 'Over 50% of rural women in India suffer from anemia without access to phlebotomy.',
      domain: 'healthcare',
      impactTarget: 'Primary Healthcare Centers',
      keyConstraints: ['Cost < ₹3000', 'Accuracy ±0.8 g/dL'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(problemSchema.safeParse(validProblem).success).toBe(true);
  });

  it('validates a build journey story with decision archaeology', () => {
    const validStory = {
      id: 'story_1',
      slug: 'spacex-falcon',
      title: 'SpaceX Falcon 9 Build Journey',
      subjectName: 'SpaceX',
      tagline: 'From Kwajalein Atoll to Reusable Orbit',
      storyType: 'company',
      category: 'Aerospace',
      summary: 'How SpaceX mastered vertical supersonic retropropulsion.',
      foundingYear: 2002,
      headquarters: 'Hawthorne, CA',
      decisionRecords: [
        {
          id: 'dec_1',
          decisionPoint: 'In-house manufacturing vs ICBM procurement',
          optionsAvailable: ['Buy ICBM', 'Build in-house'],
          chosenOption: 'Build in-house',
          rationale: 'Raw materials were only 2% of price.',
          consequences: 'Enormous early risk but ultimate cost reduction.',
          hindsightRating: 'game_changer',
        },
      ],
      chapters: [
        {
          number: 1,
          title: '01. The Spark',
          summary: 'The Russian desert trip.',
          contentMarkdown: 'Musk went to Moscow...',
          keyTakeaway: 'First-principles reasoning.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(buildJourneyStorySchema.safeParse(validStory).success).toBe(true);
  });

  it('validates a museum failure exhibit schema', () => {
    const validExhibit = {
      slug: 'juicero-press',
      title: 'Juicero Press ($120M Cold Press)',
      tagline: 'When 4 Tons of Pressure Met Human Hands',
      category: 'Consumer Electronics',
      lifespan: '2013 – 2017',
      capitalBurned: '$118.5 Million',
      primaryFailureMode: 'Feature Over-Engineering',
      summary: 'A 4-ton press that could be replicated by hand squeezing.',
      productSpecs: ['4000 lbs force gearbox', 'Custom extruded aluminum frame'],
      rootCauseAutopsy: [
        {
          stage: 'Manufacturing & BOM',
          failureTrigger: 'Excessive custom CNC parts',
          detail: 'Over 11 custom precision machined aluminum parts pushed retail to $699.',
          warningSigns: ['BOM exceeded retail price without software subsidies.'],
        },
      ],
      salvageableInnovations: [
        {
          innovation: 'QR-code freshness scanner & cellular provisioning',
          utility: 'Zero-touch packaging validation',
          modernSuccessors: ['IoT Nespresso machines', 'Smart medical supply lockers'],
        },
      ],
      lessonsForBuilders: [
        {
          principle: 'Do not automate what hands can do without value-add',
          advice: 'Validate the physical necessity of every motor and gearbox.',
          antiPattern: 'Solving non-problems with military-grade engineering.',
        },
      ],
    };
    expect(museumExhibitSchema.safeParse(validExhibit).success).toBe(true);
  });

  it('evaluates hardware failure risks accurately', () => {
    const highRiskProject = evaluateHardwareFailureRisk({
      retailPriceUsd: 100,
      bomCostUsd: 80, // Poor margin (only 20% margin)
      customPartsCount: 12, // High tooling
      requiresRegulatoryApproval: true,
      hasMovingMechanicalParts: true,
    });

    expect(highRiskProject.score).toBeGreaterThanOrEqual(70);
    expect(highRiskProject.level).toBe('Critical');
    expect(highRiskProject.identifiedTraps.length).toBeGreaterThanOrEqual(3);

    const lowRiskProject = evaluateHardwareFailureRisk({
      retailPriceUsd: 120,
      bomCostUsd: 25, // Good margin (~79%)
      customPartsCount: 2,
      requiresRegulatoryApproval: false,
      hasMovingMechanicalParts: false,
    });

    expect(lowRiskProject.score).toBeLessThan(40);
    expect(lowRiskProject.level).toBe('Low');
  });

  it('validates an observatory tech radar item', () => {
    const validObservatoryItem = {
      id: 'obs_1',
      title: 'SLS Laser Sintering Core Patent Expiry',
      slug: 'sls-laser-sintering-patent-expiry',
      category: 'patent_expiry',
      quadrant: 'Hardware & Silicon',
      ring: 'Adopt',
      summary: 'Foundational selective laser sintering patents expired, enabling $500 desktop nylon 3D printing.',
      maturityLevel: 'Production Ready',
      impactScore: 94,
      source: {
        name: 'USPTO Patent Database',
        url: 'https://patents.google.com/patent/US5597589A/en',
        publishedDate: '2024-02-14',
      },
      makerAction: 'Build an open-source diode-laser SLS powder recoater.',
      commercialPotential: 'Disrupt industrial $50k EOS machines with desktop print farms.',
      tags: ['3D Printing', 'Sintering', 'Public Domain', 'Additive'],
      relatedProblemSlugs: ['open-braille'],
    };
    expect(observatoryItemSchema.safeParse(validObservatoryItem).success).toBe(true);
  });

  it('validates a prototype architecture plan schema', () => {
    const validPlan = {
      id: 'proto_1',
      ideaTitle: 'Solar LoRa Soil Probe',
      slug: 'solar-lora-soil-probe',
      domain: 'AgTech & IoT',
      targetFormFactor: 'Cylindrical Stake 25x150mm',
      summary: 'Low-power outdoor soil moisture & temperature probe.',
      systemBlocks: [
        {
          name: 'Core MCU & Radio',
          category: 'Compute',
          icChoice: 'ESP32-C3',
          function: 'RISC-V core with 2.4GHz Wi-Fi/BLE & sleep timer',
        },
      ],
      pinoutMapping: [
        {
          pin: 'GPIO 4',
          label: 'I2C_SDA',
          protocol: 'I2C',
          connectedTo: 'BME280',
        },
      ],
      bom: [
        {
          component: 'Microcontroller',
          partNumber: 'ESP32-C3-WROOM-02',
          footprint: 'Module SMD',
          estCostUsd: 1.8,
          estCostInr: 155,
          distributor: 'Robu.in / LCSC',
        },
      ],
      requiredSkills: [
        {
          role: 'Embedded Firmware Developer',
          skills: ['ESP-IDF', 'C++', 'FreeRTOS'],
          estimatedHours: 25,
        },
      ],
      milestones: [
        {
          phase: 'Phase 1: Breadboard Proof',
          durationWeeks: 2,
          deliverables: ['Working LoRa ping to gateway'],
        },
      ],
      estimatedTotalProtoCost: {
        usd: 14.5,
        inr: 1250,
      },
    };
    expect(prototypeArchitecturePlanSchema.safeParse(validPlan).success).toBe(true);
  });

  it('validates a project squad room schema with milestone escrow', () => {
    const validSquadRoom = {
      projectSlug: 'aeroglide',
      projectTitle: 'AeroGlide Long-Endurance UAV',
      tagline: 'Solar-assisted 4-hour fixed-wing mapping drone',
      escrowPoolTotalInr: 80000,
      escrowPoolTotalUsd: 950,
      squadMembers: [
        {
          id: 'role_1',
          roleTitle: 'Avionics & Flight Hardware Lead',
          track: 'hardware',
          status: 'filled',
          stipend: '₹35,000 / milestone',
          skills: ['STM32', 'ArduPilot', 'CAN bus'],
          assignee: {
            handle: 'arjun_v',
            name: 'Arjun Varma',
            reputationScore: 340,
          },
        },
      ],
      milestones: [
        {
          id: 'ms_1',
          title: 'Milestone 1: Sub-15W Cruise Power Bench Test',
          description: 'Demonstrate motor and propeller combo pulling <15W at 12 m/s airspeed.',
          escrowAmountInr: 25000,
          escrowAmountUsd: 300,
          status: 'released',
          proofRequirements: ['Wind tunnel telemetry CSV', 'Video of thrust bench run'],
          unlockedPassportBadge: 'AeroDynamics Benchmark Pioneer',
        },
      ],
      tasks: [
        {
          id: 'task_1',
          title: 'Mill carbon-fiber wing spar mounts',
          status: 'in_progress',
          priority: 'high',
          tags: ['CNC', 'CarbonFiber'],
        },
      ],
    };
    expect(projectSquadRoomSchema.safeParse(validSquadRoom).success).toBe(true);
  });
});

describe('clubs and equipment sharing schema', () => {
  const sampleClub = {
    id: 'club_kochi_maker',
    slug: 'kochi-maker-village-atl',
    name: 'Maker Village Kochi ATL & FabLab Hub',
    category: 'community_makerspace',
    institution: 'Digital University Kerala',
    city: 'Kochi',
    state: 'Kerala',
    address: 'KINFRA Hi-Tech Park, Kalamassery',
    foundedYear: 2017,
    memberCount: 380,
    activeProjectsCount: 16,
    mentorCount: 22,
    verifiedAtl: true,
    contactEmail: 'makers@makervillagekochi.in',
    summary: 'Kerala nodal hub for hardware prototyping and school ATL mentorship.',
    focusAreas: ['Embedded IoT', 'Drones', 'Biomedical Sensors'],
    equipment: [
      {
        id: 'eq_voltera',
        name: 'Voltera V-One PCB Printer',
        category: 'rapid_prototyping',
        model: 'V-One Direct Ink Dispenser',
        status: 'available',
        specs: '0.2mm trace pitch, FR4 & glass substrate',
        hourlyRate: 'Free for student ATL squads / ₹200/hr',
        safetyCertificationRequired: true,
      },
    ],
    leadMentor: {
      name: 'Dr. Ramesh Nair',
      role: 'Chief FabLab Technologist',
      organization: 'Digital University Kerala',
      bio: '20+ years in electronics manufacturing and community maker mentorship.',
      verifiedAtlMentor: true,
    },
    activeChallenges: [
      {
        id: 'chal_agri',
        title: 'Monsoon Flood Sensing Mesh Challenge',
        description: 'Deploy solar-backed LoRa nodes along Periyar river basin.',
        deadline: '2026-12-15',
        prizePool: '₹1,50,000',
        organizer: 'Maker Village & KSDMA',
        teamSize: '2-4 members',
        domain: 'Climatetech & Disaster Preparedness',
        status: 'active',
      },
    ],
    establishedPrototypesCount: 42,
  };

  it('validates a complete club chapter and calculates readiness score', () => {
    const parseResult = clubChapterSchema.safeParse(sampleClub);
    expect(parseResult.success).toBe(true);
    if (parseResult.success) {
      const score = calculateClubReadinessScore(parseResult.data);
      expect(score).toBeGreaterThanOrEqual(70);
    }
  });

  it('validates equipment reservation schema with safety induction check', () => {
    const validReservation = {
      id: 'res_123',
      clubSlug: 'kochi-maker-village-atl',
      equipmentId: 'eq_voltera',
      applicantName: 'Ananya Sharma',
      applicantEmail: 'ananya@school.edu',
      applicantRole: 'student_k12',
      projectTitle: 'CanSat Water Vapor Telemetry Module',
      requestedDate: '2026-11-20',
      timeSlot: '14:00 - 17:00 IST',
      safetyInductionAgreed: true,
      parentOrMentorCoSign: 'Teacher Mentor: Sunita Rao',
    };
    expect(equipmentReservationSchema.safeParse(validReservation).success).toBe(true);

    const missingSafety = {
      ...validReservation,
      safetyInductionAgreed: false,
    };
    expect(equipmentReservationSchema.safeParse(missingSafety).success).toBe(false);
  });

  it('filters clubs by state and category properly', () => {
    const clubs = [sampleClub as any];
    const filteredKerala = filterClubs(clubs, { state: 'Kerala' });
    expect(filteredKerala.length).toBe(1);

    const filteredDelhi = filterClubs(clubs, { state: 'Delhi' });
    expect(filteredDelhi.length).toBe(0);

    const filteredCategory = filterClubs(clubs, { category: 'school_atl' });
    expect(filteredCategory.length).toBe(0);
  });
});

describe('open invention network and ip defense ledger schema', () => {
  const samplePublication = {
    id: 'ip-led-2026-0814',
    title: 'Decentralized CAN-FD Active Cell Balancing BMS Architecture',
    inventor: {
      name: 'Dr. Anand Srinivas',
      handle: 'anand_s',
      organization: 'RVCE Team Chimera EV Garage',
      verifiedKycOrEmail: true,
    },
    category: 'clean_mobility_bms',
    hardwareLicense: 'CERN-OHL-P-2.0',
    firstPublicDisclosureDate: '2026-08-14T10:30:00Z',
    timestampProof: {
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '7d793037a0760186574b0282f2f435e7b1e516b9cfba8feda31f1f9d486f06cf',
      gitCommitHash: '9a3b8f2d1e04',
      blockHeight: 894120,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCB',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['H01M 10/44', 'G01R 31/36', 'B60L 58/10'],
    abstractSummary:
      'A decentralized battery management architecture utilizing inductive energy transfer to shuttle charge across arbitrary 21700 cell pairs without resistive dissipation, coordinated via isolated CAN-FD bus packets.',
    novelMechanisms: [
      'Bidirectional flyback transformer matrix enabling cell-to-cell direct charge equalization without intermediate pack bus step-up.',
      'Sub-microsecond current polarity switching synchronized to CAN-FD frame synchronization bit.',
    ],
    priorArtCitations: [
      {
        title: 'Passive resistor bleed balancing circuits in EV packs',
        patentOrPaperId: 'US8921500B2',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike US8921500B2 which dissipates excess cell energy as heat through 33-ohm power resistors, this invention captures and transfers >92% of excess energy to the weakest cell.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_schematic',
        artifactType: 'schematic_pdf',
        fileName: 'rvce-chimera-bms-schematic-v2.1.pdf',
        fileSizeBytes: 2489120,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        downloadUrl: 'https://cdn.hackerland.in/ip/rvce-bms-v2.1.pdf',
      },
    ],
    nonAggressionPledgeSigned: true,
  };

  it('validates a complete defensive publication schema', () => {
    const result = defensivePublicationSchema.safeParse(samplePublication);
    expect(result.success).toBe(true);
  });

  it('verifies candidate sha256 hash matches publication integrity', () => {
    const validHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const fakeHash = '0000000000000000000000000000000000000000000000000000000000000000';

    expect(verifyInventionIntegrity(samplePublication as any, validHash)).toBe(true);
    expect(verifyInventionIntegrity(samplePublication as any, fakeHash)).toBe(false);
  });

  it('generates statutory legal affidavit with 35 USC 102 and Indian Patents Act Sec 29 citations', () => {
    const affidavit = generatePriorArtAffidavitText(samplePublication as any);
    expect(affidavit).toContain('CERTIFICATE OF DEFENSIVE PUBLICATION');
    expect(affidavit).toContain('ip-led-2026-0814');
    expect(affidavit).toContain('35 § 102(a)(1)');
    expect(affidavit).toContain('The Patents Act, 1970 (India) § 29');
    expect(affidavit).toContain('CERN-OHL-P-2.0');
  });

  it('validates submission form and checks non-aggression pledge agreement', () => {
    const validSubmission = {
      title: 'Peristaltic Syringe Infusion Pump Linear Actuator',
      inventorName: 'Priya Sundaram',
      inventorHandle: 'priya_medtech',
      organization: 'AIIMS Innovation Cell',
      category: 'biomedical_diagnostics',
      hardwareLicense: 'CERN-OHL-S-2.0',
      ipcClasses: ['A61M 5/142'],
      abstractSummary:
        'A micro-stepper motor driven lead screw actuator with optical linear encoder feedback providing 0.05 ml/hr flow precision for neonatal syringe delivery.',
      novelMechanisms: ['Dual-wavelength optical end-stop trigger with fail-safe hardware interrupt.'],
      primaryArtifactSha256: 'a'.repeat(64),
      agreeToNonAggressionPledge: true,
    };
    expect(submitInventionDefenseSchema.safeParse(validSubmission).success).toBe(true);

    const unsignedSubmission = {
      ...validSubmission,
      agreeToNonAggressionPledge: false,
    };
    expect(submitInventionDefenseSchema.safeParse(unsignedSubmission).success).toBe(false);
  });

  it('filters defensive ledger by category and search keyword', () => {
    const ledger = [samplePublication as any];
    const matchCategory = filterDefensiveLedger(ledger, { category: 'clean_mobility_bms' });
    expect(matchCategory.length).toBe(1);

    const nonMatchCategory = filterDefensiveLedger(ledger, { category: 'avionics_aerospace' });
    expect(nonMatchCategory.length).toBe(0);

    const matchSearch = filterDefensiveLedger(ledger, { search: 'CAN-FD' });
    expect(matchSearch.length).toBe(1);
  });
});

describe('young innovators track and safety sandbox schema', () => {
  const sampleJuniorChallenge = {
    id: 'chal_soil_moisture_bot',
    title: 'Smart Plant Hydration Alert Buddy',
    ageBracket: 'junior_8_11',
    difficulty: 'starter',
    hardwareKit: ['BBC Micro:bit v2', 'Soil Moisture Nails', 'Submersible 5V Pump', 'Alligator Clips'],
    learningOutcomes: ['Understanding analog resistivity', 'Conditional if-else block coding', 'Relay safety'],
    prizeOrBadge: 'Eco-Maker Junior Badge + Plant Kit',
    safetySupervisionRequired: true,
    summary: 'Build a plant pot monitor that displays a sad face LED on the micro:bit when soil is parched.',
    estimatedTimeHours: 3.5,
  };

  const sampleJuniorProject = {
    id: 'proj_aditya_water',
    slug: 'aditya-auto-cattle-trough',
    title: 'Automated Solar Cattle Water Dispenser',
    builderName: 'Aditya Sharma',
    builderAge: 12,
    city: 'Jaipur',
    schoolOrAtl: 'Govt Model Sr Sec School ATL Lab',
    ageBracket: 'intermediate_12_14',
    summary:
      'Created an ultrasonic water level regulator powered by a 10W solar panel and 18650 cell that keeps cattle troughs full in rural Rajasthan without overflowing.',
    materialsUsed: ['Raspberry Pi Pico', 'HC-SR04 Ultrasonic Sensor', '12V DC Solenoid Valve', '10W Solar Panel'],
    mentorName: 'Er. Rajesh Gurjar (AIM ATL Mentor)',
    verifiedGuardianCoSigned: true,
    unlockedBadge: 'Rural Impact Tinkerer',
    demoVideoOrDocUrl: 'https://hackerland.in/proof/aditya-trough.mp4',
  };

  it('validates a complete junior challenge schema', () => {
    expect(juniorChallengeSchema.safeParse(sampleJuniorChallenge).success).toBe(true);
  });

  it('validates a junior showcase project and generates passport credential text', () => {
    const result = juniorShowcaseProjectSchema.safeParse(sampleJuniorProject);
    expect(result.success).toBe(true);
    if (result.success) {
      const cred = generateJuniorPassportCredential(result.data);
      expect(cred).toContain('Aditya Sharma (Age 12)');
      expect(cred).toContain('DPDP) ACT 2023');
      expect(cred).toContain('Rural Impact Tinkerer');
    }
  });

  it('enforces explicit DPDP Act guardian consent and physical lab supervision agreement', () => {
    const validConsent = {
      id: 'gcons_9821',
      studentName: 'Meera Nair',
      studentAge: 14,
      guardianName: 'Suresh Nair',
      guardianEmail: 'suresh@family.in',
      guardianRelationship: 'parent',
      schoolName: 'Kendriya Vidyalaya No. 1 Kochi',
      city: 'Kochi',
      dpdpConsentGranted: true,
      safetySupervisionAgreed: true,
      consentTimestamp: '2026-11-16T12:00:00Z',
    };
    expect(guardianConsentSchema.safeParse(validConsent).success).toBe(true);

    const missingConsent = {
      ...validConsent,
      dpdpConsentGranted: false,
    };
    expect(guardianConsentSchema.safeParse(missingConsent).success).toBe(false);
  });

  it('filters junior challenges by age bracket and difficulty', () => {
    const challenges = [sampleJuniorChallenge as any];
    const matchAge = filterJuniorChallenges(challenges, { ageBracket: 'junior_8_11' });
    expect(matchAge.length).toBe(1);

    const nonMatchAge = filterJuniorChallenges(challenges, { ageBracket: 'senior_15_17' });
    expect(nonMatchAge.length).toBe(0);

    const matchDiff = filterJuniorChallenges(challenges, { difficulty: 'starter' });
    expect(matchDiff.length).toBe(1);
  });
});

describe('ai hardware copilot engineering calculators and sourcing', () => {
  it('calculates IPC-2152 trace width accurately for 5A current on 1oz copper', () => {
    const result = calculateIpc2152Trace({
      currentAmps: 5.0,
      copperWeightOz: 1.0,
      tempRiseC: 10,
      isInternalLayer: false,
    });
    expect(result.widthMils).toBeGreaterThan(50);
    expect(result.widthMm).toBeGreaterThan(1.0);
    expect(result.resistancePerMeterOhms).toBeGreaterThan(0);
    expect(result.powerLossWattsPerMeter).toBeGreaterThan(0);
  });

  it('calculates SMPS buck converter inductance and output capacitance', () => {
    const result = calculateSmpsBuck({
      vinVolts: 24,
      voutVolts: 5,
      ioutAmps: 3,
      freqKhz: 500,
      rippleRatio: 0.3,
    });
    expect(result.dutyCycle).toBeCloseTo(0.208, 2);
    expect(result.inductanceUh).toBeGreaterThan(5);
    expect(result.minOutputCapUf).toBeGreaterThan(1);
    expect(result.peakCurrentAmps).toBeGreaterThan(3.0);
  });

  it('calculates thermal heatsink requirements for 10W MOSFET dissipation', () => {
    const result = calculateThermalHeatsink({
      powerWatts: 10,
      maxJunctionTempC: 125,
      ambientTempC: 45,
      thetaJc: 2.0,
    });
    expect(result.maxTotalTheta).toBe(8.0);
    expect(result.requiredHeatsinkTheta).toBe(6.0);
    expect(result.coolingRecommendation).toContain('Extruded Aluminium Heatsink');
  });

  it('audits BOM items identifying EOL chips and single-source distributor bottlenecks', () => {
    const catalog = [
      {
        mpn: 'LM7805CT',
        manufacturer: 'Texas Instruments',
        category: 'Linear Voltage Regulator',
        description: '5V 1.5A Linear Regulator TO-220',
        package: 'TO-220',
        lifecycleStatus: 'active' as const,
        indianDistributors: [{ name: 'Robu.in', inStock: true, priceInr: 28, minOrderQty: 1 }],
        globalDistributors: [{ name: 'LCSC', inStock: true, priceUsd: 0.32 }],
        pinCompatibleAlternates: [
          { mpn: 'L7805CV', manufacturer: 'STMicroelectronics', priceInr: 26, notes: 'Direct pin drop-in' },
        ],
      },
      {
        mpn: 'MAX232CPE',
        manufacturer: 'Maxim Integrated',
        category: 'RS-232 Transceiver',
        description: 'Dual RS-232 Driver/Receiver DIP-16',
        package: 'DIP-16',
        lifecycleStatus: 'eol' as const,
        indianDistributors: [{ name: 'KitsnSpares', inStock: false, priceInr: 120, minOrderQty: 1 }],
        globalDistributors: [{ name: 'DigiKey', inStock: false, priceUsd: 3.5 }],
        pinCompatibleAlternates: [
          { mpn: 'SP232EEN', manufacturer: 'MaxLinear', priceInr: 45, notes: 'SOIC-16 drop-in' },
        ],
      },
    ];

    const bom = [
      { reference: 'U1', mpn: 'LM7805CT' },
      { reference: 'U2', mpn: 'MAX232CPE' },
      { reference: 'U3', mpn: 'UNKNOWN_CHIP_99' },
    ];

    const audit = auditBomItems(bom, catalog);
    expect(audit.length).toBe(3);

    const u1 = audit.find((a) => a.reference === 'U1');
    expect(u1?.riskLevel).toBe('low');

    const u2 = audit.find((a) => a.reference === 'U2');
    expect(u2?.riskLevel).toBe('high');
    expect(u2?.suggestedReplacement).toBe('SP232EEN');

    const u3 = audit.find((a) => a.reference === 'U3');
    expect(u3?.riskLevel).toBe('medium');
  });
});

describe('milestone-locked crowdfunding launchpad and grant matching', () => {
  it('calculates campaign progress and milestone escrow payouts', () => {
    const progress = calculateCampaignProgress(850000, 1000000);
    expect(progress.percent).toBe(85);
    expect(progress.isFunded).toBe(false);
    expect(progress.remainingInr).toBe(150000);

    const fundedProgress = calculateCampaignProgress(1200000, 1000000);
    expect(fundedProgress.percent).toBe(120);
    expect(fundedProgress.isFunded).toBe(true);
    expect(fundedProgress.remainingInr).toBe(0);

    const milestone1Payout = calculateMilestonePayout(1000000, 25);
    expect(milestone1Payout).toBe(250000);
  });

  it('evaluates milestone backer quorum verification threshold', () => {
    // 60 votes for out of 100 = 60% -> under 66% threshold -> fail
    const quorumFail = verifyMilestoneQuorum(60, 100);
    expect(quorumFail.passed).toBe(false);
    expect(quorumFail.approvalPercent).toBe(60);

    // 70 votes for out of 100 = 70% -> over 66% -> pass
    const quorumPass = verifyMilestoneQuorum(70, 100);
    expect(quorumPass.passed).toBe(true);
    expect(quorumPass.approvalPercent).toBe(70);

    // 0 votes
    const zeroVotes = verifyMilestoneQuorum(0, 0);
    expect(zeroVotes.passed).toBe(false);
  });

  it('matches hardware projects to Indian Govt non-dilutive grants based on TRL and eligibility', () => {
    const grants = [
      {
        id: 'idex-disc',
        name: 'iDEX DISC (Defence India Startup Challenge)',
        agency: 'DIO / Ministry of Defence',
        maxFundingInr: 15000000,
        isNonDilutive: true,
        focusAreas: ['Defence', 'Aerospace', 'Drones', 'Secure Comms'],
        minTrl: 3,
        maxTrl: 7,
        requiresDpiit: true,
        minIndianOwnershipPercent: 51,
        applicationWindow: 'Quarterly Rounds',
        description: 'Grants up to ₹1.5 Cr for prototype development for military use.',
        portalUrl: 'https://idex.gov.in',
      },
      {
        id: 'nidhi-prayas',
        name: 'DST NIDHI-PRAYAS',
        agency: 'Department of Science and Technology',
        maxFundingInr: 1000000,
        isNonDilutive: true,
        focusAreas: ['Agriculture', 'Healthcare', 'Clean Energy', 'IoT', 'Hardware'],
        minTrl: 2,
        maxTrl: 5,
        requiresDpiit: false,
        minIndianOwnershipPercent: 51,
        applicationWindow: 'Always Open across 40+ PRAYAS Centres',
        description: 'Grants up to ₹10 Lakhs for converting ideas into physical proof-of-concept.',
        portalUrl: 'https://nidhi-prayas.org',
      },
    ];

    const defenceProject = {
      category: 'defence_aerospace' as const,
      trl: 4,
      isDpiitRegistered: true,
      indianOwnershipPercent: 100,
    };

    const matches = matchGrantsForProject(defenceProject, grants);
    expect(matches.length).toBe(2);

    const idexMatch = matches.find((m) => m.grant.id === 'idex-disc');
    expect(idexMatch?.isEligible).toBe(true);
    expect(idexMatch?.fitScore).toBeGreaterThanOrEqual(80);
    expect(idexMatch?.missingPrerequisites.length).toBe(0);

    // Non-DPIIT registered project attempting iDEX
    const nonDpiitProject = {
      category: 'defence_aerospace' as const,
      trl: 4,
      isDpiitRegistered: false,
      indianOwnershipPercent: 100,
    };
    const nonDpiitMatches = matchGrantsForProject(nonDpiitProject, grants);
    const nonDpiitIdex = nonDpiitMatches.find((m) => m.grant.id === 'idex-disc');
    expect(nonDpiitIdex?.isEligible).toBe(false);
    expect(nonDpiitIdex?.missingPrerequisites).toContain('Requires formal DPIIT certificate of recognition');
  });

  it('validates a complete hardware campaign schema', () => {
    const validCampaign = {
      id: 'camp_uav_100',
      slug: 'sub-100g-recon-drone',
      title: 'Sub-100g Micro-Recon LoRa Mesh Drone',
      tagline: 'Ultralight tactical reconnaissance micro-UAV with thermal sensor and encrypted frequency-hopping telemetry.',
      creator: {
        name: 'Vikram Joshi',
        handle: 'vikram_j',
        avatar: '/avatars/vikram.png',
        organization: 'Garuda Avionics',
        dpiitRegistered: true,
        city: 'Pune',
        state: 'Maharashtra',
      },
      category: 'defence_aerospace' as const,
      fundingGoalInr: 1200000,
      raisedInr: 890000,
      backersCount: 142,
      daysLeft: 18,
      deadlineDate: '2026-12-15',
      status: 'active' as const,
      trlLevel: 5,
      milestones: [
        {
          id: 'ms-1',
          title: 'EVT PCB & LoRa RF Telemetry Validation',
          description: '4-layer rigid-flex PCB fabrication and range test validation over 5km LOS.',
          percentageOfGoal: 25,
          targetDate: '2026-12-30',
          status: 'verified' as const,
          deliverables: ['Altium Gerbers', 'BOM CSV', 'Flight telemetry logs'],
          evidenceUrl: 'https://github.com/garuda/recon-drone/releases/tag/v0.1-evt',
          backerApprovalVotePercent: 94,
        },
        {
          id: 'ms-2',
          title: 'Carbon Fiber Injection Mold & Flight Controller Alpha',
          description: 'Custom molded aero frame and custom STM32H7 dual-IMU flight stack testing.',
          percentageOfGoal: 35,
          targetDate: '2027-02-15',
          status: 'submitted_for_review' as const,
          deliverables: ['STEP cad models', 'High-speed wind tunnel footage', 'Crash tolerance report'],
          evidenceUrl: 'https://github.com/garuda/recon-drone/releases/tag/v0.2-dvt',
          backerApprovalVotePercent: 78,
        },
      ],
      backerTiers: [
        {
          id: 'tier-early-kit',
          title: 'Developer Core Kit',
          amountInr: 8500,
          amountUsd: 102,
          description: 'Pre-assembled flight controller PCB, LoRa transceiver module, and SDK.',
          perks: ['Core PCB', 'SDK Access', 'Hackerland Private Repo Access'],
          estimatedDelivery: 'March 2027',
          limitBackers: 100,
          currentBackers: 86,
        },
      ],
      matchedGrants: ['idex-disc', 'nidhi-prayas'],
      storyMarkdown: '## Tactical Micro-UAV for Forest and Mountain Surveillance...',
      risksAndChallenges: 'Supply chain delays on 2mm pitch brushless motors and custom carbon weave...',
      hardwareSpecs: {
        'All-Up Weight': '88 grams',
        'Flight Time': '22 minutes',
        Telemetry: '868 MHz / 433 MHz LoRa Frequency Hopping',
        Processor: 'STM32H743VIT6 480 MHz ARM Cortex-M7',
      },
    };

    const parsed = campaignSchema.safeParse(validCampaign);
    expect(parsed.success).toBe(true);
  });
});

describe('hardware teardowns and reverse engineering annotator schema', () => {
  it('calculates BOM markup ratio and gross margins accurately', () => {
    // Ather 450: Retail ₹1,45,000, BOM ₹34,500
    const margin = calculateBomMarkup(145000, 34500);
    expect(margin.markupRatio).toBe(4.2);
    expect(margin.grossMarginPercent).toBe(76);

    const zeroMargin = calculateBomMarkup(1000, 0);
    expect(zeroMargin.markupRatio).toBe(0);
    expect(zeroMargin.grossMarginPercent).toBe(0);
  });

  it('validates interactive PCB pinout annotation coordinate boundaries', () => {
    const validPin = {
      id: 'pin-1',
      xPercent: 42.5,
      yPercent: 30.0,
      label: 'Main BMS AFE',
      subsystem: 'Power / BMS',
      partNumber: 'BQ76952',
      manufacturer: 'Texas Instruments',
      function: 'Monitors 16 series Li-Ion cells with 1mV ADC resolution',
      package: 'TQFP-48',
      estimatedCostUsd: 4.2,
      openSourceAlternative: 'LTC6804 / BQ76940 open breakout',
    };
    expect(validatePinoutAnnotation(validPin)).toBe(true);

    const invalidPin = {
      ...validPin,
      xPercent: 120.0, // Out of bounds
    };
    expect(validatePinoutAnnotation(invalidPin)).toBe(false);
  });

  it('validates and parses a complete teardown submission schema', () => {
    const submission = {
      id: 'td_ather_450',
      slug: 'ather-450-smart-bms',
      title: 'Ather 450 Smart EV BMS & Telematics',
      category: 'ev_automotive' as const,
      deviceType: 'Electric 2-Wheeler Power Electronics',
      manufacturer: 'Ather Energy',
      retailPriceInr: 145000,
      estimatedBomInr: 34500,
      currency: 'INR' as const,
      summary: 'Deep architectural autopsy of Ather 450 battery pack and CAN isolation electronics.',
      submitter: {
        name: 'Karthik Raja',
        handle: 'karthik_r',
        avatar: '/avatars/karthik.png',
        organization: 'Bengaluru EV Teardown Collective',
        role: 'Automotive Power Systems Lead',
      },
      highlightSpecs: ['3.7 kWh 21700 Pack', 'Automotive CAN 2.0B dual-bus'],
      subsystems: [
        {
          name: 'Battery Management System',
          description: 'Monitors 14 series cells with active balancing.',
          chips: ['BQ76952', 'STM32F405'],
        },
      ],
      bomBreakdown: [
        {
          component: 'BMS AFE',
          partNumber: 'BQ76952',
          manufacturer: 'TI',
          function: 'Cell voltage monitoring',
          package: 'TQFP-48',
          estCost: '$4.20',
          openAlternative: 'OpenBMS',
        },
      ],
      pinoutAnnotations: [
        {
          id: 'pin-afe-1',
          xPercent: 45.0,
          yPercent: 55.0,
          label: 'TI BQ76952 AFE',
          subsystem: 'BMS',
          partNumber: 'BQ76952',
          manufacturer: 'Texas Instruments',
          function: 'Monitors cell voltages',
          package: 'TQFP-48',
          estimatedCostUsd: 4.2,
          openSourceAlternative: 'LTC6804',
        },
      ],
      engineeringLessons: ['Conformal coating prevents condensation failures during Indian monsoons'],
      failureModesObserved: ['Thermal runaway risk if active balancing FET shorts'],
      verifiedStatus: 'gold_standard' as const,
      reputationReward: 150,
    };

    const parsed = teardownSubmissionSchema.safeParse(submission);
    expect(parsed.success).toBe(true);
  });
});

describe('hardware deep-tech jobs and fellowships schema', () => {
  it('formats salary ranges with Lakhs and equity properly', () => {
    expect(formatSalaryRangeInr(28, 45, '0.25% - 0.75%')).toBe('₹28L – ₹45L PA + 0.25% - 0.75% Equity');
    expect(formatSalaryRangeInr(18, 25)).toBe('₹18L – ₹25L PA');
  });

  it('calculates candidate proof-of-work skill match score accurately', () => {
    const candidateSkills = ['FreeRTOS', 'STM32', 'CAN Bus', 'KiCad'];
    const jobRequirements = [
      'STM32 or Nordic ARM Cortex-M microcontrollers',
      'FreeRTOS or Zephyr RTOS',
      'CAN 2.0B / CAN-FD automotive bus protocol',
      'High-voltage safety certification (AIS-156)',
    ];

    const result = calculateHiringMatchScore(candidateSkills, jobRequirements);
    expect(result.matchPercent).toBe(75); // 3 of 4 match
    expect(result.matchedSkills.length).toBe(3);
    expect(result.missingSkills).toContain('High-voltage safety certification (AIS-156)');
  });

  it('filters hardware jobs by domain and location type', () => {
    const jobs = [
      {
        id: 'job-1',
        slug: 'lead-bms-firmware',
        title: 'Lead BMS Firmware Engineer',
        company: {
          name: 'Ather Energy',
          website: 'https://atherenergy.com',
          city: 'Bengaluru',
          state: 'Karnataka',
          foundedYear: 2013,
          verifiedDpiit: true,
          stage: 'Series B+' as const,
        },
        roleType: 'full_time' as const,
        hardwareDomain: 'power_electronics_bms' as const,
        experienceLevel: 'mid_lead' as const,
        locationType: 'onsite_lab' as const,
        workLocation: 'Bengaluru, Karnataka (Ather Whitefield Lab)',
        salaryInr: { minLakhs: 28, maxLakhs: 45, equityPercent: '0.2%' },
        hardwareBenchesUsed: ['Tektronix 1GHz Scope', 'Chroma Battery Simulator'],
        responsibilities: ['Write cell balancing algorithms', 'Run HIL automated regression tests'],
        prerequisites: ['5+ years embedded C', 'CAN-FD bus experience'],
        proofOfWorkRequirements: ['Link to public GitHub firmware repo or Altium schematics'],
        applyUrl: 'https://atherenergy.com/careers',
        featured: true,
        postedDate: '2026-11-10',
        descriptionMarkdown: 'Lead the next-gen battery safety stack...',
      },
      {
        id: 'job-2',
        slug: 'autonomous-uav-fellow',
        title: 'Autonomous Drone Flight Fellow',
        company: {
          name: 'IdeaForge',
          website: 'https://ideaforge.co.in',
          city: 'Navi Mumbai',
          state: 'Maharashtra',
          foundedYear: 2007,
          verifiedDpiit: true,
          stage: 'Public / Defence PSU' as const,
        },
        roleType: 'fellowship' as const,
        hardwareDomain: 'robotics_autonomous' as const,
        experienceLevel: 'early_career' as const,
        locationType: 'hybrid_hardware' as const,
        workLocation: 'Navi Mumbai, Maharashtra',
        salaryInr: { minLakhs: 18, maxLakhs: 26 },
        fellowshipGrantStipendInr: 60000,
        hardwareBenchesUsed: ['Optical Tracking Cage', 'Wind Tunnel'],
        responsibilities: ['Tune PX4 / ArduPilot EKF3 state estimators', 'Field test tactical micro-UAVs'],
        prerequisites: ['ROS2', 'C++17', 'Drone flight control theory'],
        proofOfWorkRequirements: ['Flight telemetry logs or video proof of autonomous navigation'],
        applyUrl: 'https://ideaforge.co.in/careers',
        featured: true,
        postedDate: '2026-11-12',
        descriptionMarkdown: 'Build tactical micro-recon autonomous UAVs...',
      },
    ];

    const bmsJobs = filterHardwareJobs(jobs, { domain: 'power_electronics_bms' });
    expect(bmsJobs.length).toBe(1);
    expect(bmsJobs[0]?.slug).toBe('lead-bms-firmware');

    const fellowships = filterHardwareJobs(jobs, { roleType: 'fellowship' });
    expect(fellowships.length).toBe(1);
    expect(fellowships[0]?.slug).toBe('autonomous-uav-fellow');

    const searchResult = filterHardwareJobs(jobs, { search: 'Chroma' });
    expect(searchResult.length).toBe(1);
  });

  it('validates a complete hardware job posting schema', () => {
    const validJob = {
      id: 'job-riscv-1',
      slug: 'riscv-rtl-design-lead',
      title: 'RISC-V RTL Silicon Design Lead',
      company: {
        name: 'Mindgrove Technologies',
        website: 'https://mindgrovetech.in',
        city: 'Chennai',
        state: 'Tamil Nadu',
        foundedYear: 2021,
        verifiedDpiit: true,
        stage: 'Seed' as const,
      },
      roleType: 'full_time' as const,
      hardwareDomain: 'fpga_silicon' as const,
      experienceLevel: 'mid_lead' as const,
      locationType: 'onsite_lab' as const,
      workLocation: 'IIT Madras Research Park, Chennai',
      salaryInr: { minLakhs: 22, maxLakhs: 36, equityPercent: '0.5%' },
      hardwareBenchesUsed: ['Xilinx UltraScale+ FPGA testbench', 'Tektronix Logic Analyzer'],
      responsibilities: ['Design RISC-V RV32IMAC core extensions', 'Tape-out on SCL 180nm / TSMC 28nm'],
      prerequisites: ['Verilog / SystemVerilog', 'UVM verification', 'Static Timing Analysis'],
      proofOfWorkRequirements: ['GitHub Verilog repo or IEEE published silicon tape-out paper'],
      applyUrl: 'https://mindgrovetech.in/careers',
      featured: true,
      postedDate: '2026-11-14',
      descriptionMarkdown: 'Design indigenous Indian silicon SoCs for edge IoT...',
    };

    const parsed = hardwareJobPostingSchema.safeParse(validJob);
    expect(parsed.success).toBe(true);
  });
});

describe('telemetry digital twin analytics and parsing', () => {
  it('computes channel statistics accurately', () => {
    const samples = [
      { timestampMs: 0, values: { v_bat: 12.0 } },
      { timestampMs: 100, values: { v_bat: 12.2 } },
      { timestampMs: 200, values: { v_bat: 12.4 } },
      { timestampMs: 300, values: { v_bat: 11.8 } },
    ];
    const stats = computeTelemetryStats(samples, 'v_bat');
    expect(stats.min).toBe(11.8);
    expect(stats.max).toBe(12.4);
    expect(stats.mean).toBe(12.1);
    expect(stats.current).toBe(11.8);
    expect(stats.count).toBe(4);
  });

  it('detects nominal warnings and critical anomalies', () => {
    const channels = [
      {
        id: 'cell_temp',
        name: 'Cell Temp',
        unit: '°C',
        type: 'temperature' as const,
        minNominal: 20,
        maxNominal: 45,
        criticalMin: 0,
        criticalMax: 60,
        color: '#ef4444',
      },
    ];
    const samples = [
      { timestampMs: 100, values: { cell_temp: 32 } }, // nominal
      { timestampMs: 200, values: { cell_temp: 48 } }, // warning > 45
      { timestampMs: 300, values: { cell_temp: 65 } }, // critical > 60
    ];

    const anomalies = detectTelemetryAnomalies(samples, channels);
    expect(anomalies.length).toBe(2);
    expect(anomalies[0]?.severity).toBe('warning');
    expect(anomalies[1]?.severity).toBe('critical');
    expect(anomalies[1]?.threshold).toBe(60);
  });

  it('evaluates AIS-156 battery pack cell spread and balancing needs', () => {
    // Balanced pack
    const balanced = calculateBmsCellSpread([3.65, 3.66, 3.64, 3.65]);
    expect(balanced.deltaMv).toBe(20);
    expect(balanced.isBalancingNeeded).toBe(false);
    expect(balanced.isHazardous).toBe(false);

    // Spread pack requiring balancing (>40mV)
    const needsBalance = calculateBmsCellSpread([3.68, 3.62, 3.65, 3.61]);
    expect(needsBalance.deltaMv).toBe(70);
    expect(needsBalance.isBalancingNeeded).toBe(true);
    expect(needsBalance.isHazardous).toBe(false);

    // Dangerous delta (>150mV)
    const dangerous = calculateBmsCellSpread([3.70, 3.52, 3.65, 3.60]);
    expect(dangerous.deltaMv).toBe(180);
    expect(dangerous.isBalancingNeeded).toBe(true);
    expect(dangerous.isHazardous).toBe(true);
  });

  it('computes attitude angles and parses CSV logs correctly', () => {
    // 1G pointing down Z axis -> 0 deg pitch, 0 deg roll
    const levelAttitude = calculateAttitudeAngles(0, 0, 1.0);
    expect(levelAttitude.pitchDeg).toBe(0);
    expect(levelAttitude.rollDeg).toBe(0);

    const csvData = `time_ms,alt_m,airspeed_mps\n0,12.5,4.2\n100,14.8,6.5\n200,18.2,8.1`;
    const parsed = parseCsvTelemetry(csvData);
    expect(parsed.parseError).toBeUndefined();
    expect(parsed.channels).toEqual(['alt_m', 'airspeed_mps']);
    expect(parsed.samples.length).toBe(3);
    expect(parsed.samples[1]?.timestampMs).toBe(100);
    expect(parsed.samples[1]?.values['alt_m']).toBe(14.8);
  });
});

describe('firmware registry and flash partition layout schema', () => {
  it('calculates flash partition layout and detects free headroom', () => {
    const partitions = [
      { name: 'bootloader', type: 'data', subType: 'boot', offsetHex: '0x1000', sizeBytes: 32768, color: '#3b82f6' },
      { name: 'partition_table', type: 'data', subType: 'pt', offsetHex: '0x9000', sizeBytes: 4096, color: '#10b981' },
      { name: 'app0', type: 'app', subType: 'factory', offsetHex: '0x10000', sizeBytes: 1572864, color: '#f59e0b' },
    ];

    const layout = calculateFlashPartitionLayout(partitions, 4 * 1024 * 1024);
    expect(layout.hasOverlap).toBe(false);
    expect(layout.totalAllocatedBytes).toBe(32768 + 4096 + 1572864);
    expect(layout.utilizationPercent).toBeLessThan(40);
    expect(layout.warnings.length).toBe(0);
  });

  it('detects flash partition memory collision and overlap', () => {
    const overlappingPartitions = [
      { name: 'bootloader', type: 'data', subType: 'boot', offsetHex: '0x1000', sizeBytes: 32768, color: '#3b82f6' }, // ends at 0x9000
      { name: 'app0', type: 'app', subType: 'factory', offsetHex: '0x8000', sizeBytes: 1048576, color: '#f59e0b' }, // starts early at 0x8000!
    ];

    const layout = calculateFlashPartitionLayout(overlappingPartitions, 4 * 1024 * 1024);
    expect(layout.hasOverlap).toBe(true);
    expect(layout.warnings.length).toBeGreaterThan(0);
  });

  it('filters firmware registry items by target architecture and keywords', () => {
    const items = [
      {
        id: 'fw-1',
        slug: 'ardupilot-cube-orange',
        title: 'ArduPilot Copter 4.5.2',
        tagline: 'Autonomous drone flight control',
        description: 'Full autonomous mission waypoint flight for quad and hex.',
        targetArch: 'stm32' as const,
        supportedBoards: ['Cube Orange+', 'Holybro Kakute H7'],
        category: 'drone_uav' as const,
        openSourceLicense: 'GPL-3.0',
        sourceRepoUrl: 'https://github.com/ArduPilot/ardupilot',
        author: { name: 'ArduPilot Dev Team', verifiedBadge: true },
        flashBaudRate: 921600,
        partitions: [],
        releases: [],
        defaultReleaseVersion: 'v4.5.2',
        instructionsMarkdown: '# Flashing Guide',
      },
      {
        id: 'fw-2',
        slug: 'zephyr-bms-s32k',
        title: 'Zephyr AIS-156 BMS Firmware',
        tagline: 'Automotive battery safety stack',
        description: 'ISO 26262 ASIL-B battery equalization.',
        targetArch: 'esp32s3' as const,
        supportedBoards: ['ESP32-S3-DevKitC', 'Custom AIS-156 Pack'],
        category: 'ev_bms' as const,
        openSourceLicense: 'Apache-2.0',
        sourceRepoUrl: 'https://github.com/zephyrproject-rtos/zephyr',
        author: { name: 'OpenEV India', verifiedBadge: true },
        flashBaudRate: 115200,
        partitions: [],
        releases: [],
        defaultReleaseVersion: 'v1.0.4',
        instructionsMarkdown: '# Flashing Guide',
      },
    ];

    const stm32Only = filterFirmwareRegistry(items, { targetArch: 'stm32' });
    expect(stm32Only.length).toBe(1);
    expect(stm32Only[0]?.slug).toBe('ardupilot-cube-orange');

    const bmsCategory = filterFirmwareRegistry(items, { category: 'ev_bms' });
    expect(bmsCategory.length).toBe(1);
    expect(bmsCategory[0]?.slug).toBe('zephyr-bms-s32k');

    const searchResult = filterFirmwareRegistry(items, { search: 'Kakute' });
    expect(searchResult.length).toBe(1);
  });

  it('formats byte sizes cleanly', () => {
    expect(formatFirmwareBytes(512)).toBe('512 B');
    expect(formatFirmwareBytes(1024 * 64)).toBe('64.0 KB');
    expect(formatFirmwareBytes(1024 * 1024 * 2.5)).toBe('2.50 MB');
  });
});

describe('hardware statutory compliance and regulatory wizard schema', () => {
  it('matches statutory compliance requirements for EV battery packs with wireless telematics', () => {
    const matched = matchComplianceRequirements({
      hasWirelessRf: true, // triggers WPC ETA
      hasLiIonBattery: true, // triggers AIS-156
      isAutomotiveEv: true,
      isDroneUav: false,
      hasMainsAcSmps: false,
      isTelecomModem: false,
      isMedicalBio: false,
    });

    expect(matched.bodiesTriggered).toContain('wpc_eta');
    expect(matched.bodiesTriggered).toContain('ais_automotive');
    expect(matched.primaryStandards.some((s) => s.includes('AIS-156 Phase 2'))).toBe(true);
    expect(matched.estimatedBaseCostInr).toBeGreaterThan(350000);
    expect(matched.estimatedTotalWeeks).toBeGreaterThanOrEqual(10);
  });

  it('matches DGCA drone rules for commercial UAV sprayers', () => {
    const droneMatch = matchComplianceRequirements({
      hasWirelessRf: true,
      hasLiIonBattery: true,
      isAutomotiveEv: false,
      isDroneUav: true, // triggers DGCA
      hasMainsAcSmps: false,
      isTelecomModem: false,
      isMedicalBio: false,
    });

    expect(droneMatch.bodiesTriggered).toContain('dgca_type');
    expect(droneMatch.bodiesTriggered).toContain('wpc_eta');
    expect(droneMatch.bodiesTriggered).toContain('bis_crs');
    expect(droneMatch.estimatedBaseCostInr).toBeGreaterThanOrEqual(500000);
  });

  it('evaluates pre-compliance checklist readiness and identifies missing critical tests', () => {
    const tasks = [
      { id: 'task-1', task: 'Radiated emissions 3m chamber pre-scan', critical: true, tip: 'Check near-field probes' },
      { id: 'task-2', task: 'BMS overcharge 4.35V cutoff test', critical: true, tip: 'Ensure dual hardware MOSFET trip' },
      { id: 'task-3', task: 'Label font height >= 2mm per BIS rules', critical: false, tip: 'Check laser marking stencil' },
    ];

    // Only non-critical task completed -> high risk
    const failCheck = evaluatePreComplianceReadiness(['task-3'], tasks);
    expect(failCheck.readinessScore).toBe(33);
    expect(failCheck.status).toBe('high_risk_of_failure');
    expect(failCheck.criticalMissing.length).toBe(2);

    // All critical tasks completed
    const passCheck = evaluatePreComplianceReadiness(['task-1', 'task-2', 'task-3'], tasks);
    expect(passCheck.readinessScore).toBe(100);
    expect(passCheck.status).toBe('lab_ready');
    expect(passCheck.criticalMissing.length).toBe(0);
  });

  it('formats compliance cost into Indian Lakhs or thousands', () => {
    expect(formatComplianceCost(25000)).toBe('₹25,000');
    expect(formatComplianceCost(450000)).toBe('₹4.50 Lakhs');
  });
});

describe('remote testbeds and high-capex laboratory equipment schema', () => {
  it('validates SCPI commands and catches dangerous destructive operations', () => {
    const validScript = `*IDN?\n*RST\n:SENS:FREQ:CENT 2.45GHz\n:MEAS:POW?`;
    const validResult = validateScpiCommandScript(validScript);
    expect(validResult.isValid).toBe(true);
    expect(validResult.commandCount).toBe(4);
    expect(validResult.errors.length).toBe(0);

    const destructiveScript = `*IDN?\n:SYST:SEC:ERA\n:MEAS:VOLT?`;
    const destructiveResult = validateScpiCommandScript(destructiveScript);
    expect(destructiveResult.isValid).toBe(false);
    expect(destructiveResult.errors.length).toBeGreaterThan(0);
  });

  it('calculates testbed booking cost with 50% startup and student subsidy', () => {
    // 4 hours on Keysight 20 GHz analyzer @ ₹1,200/hr regular, ₹450/hr student
    const commercialBooking = calculateTestbedBookingCost(4, 1200, 450, false);
    expect(commercialBooking.totalCostInr).toBe(4800);
    expect(commercialBooking.savingsInr).toBe(0);
    expect(commercialBooking.appliedHourlyRate).toBe(1200);

    const subsidizedBooking = calculateTestbedBookingCost(4, 1200, 450, true);
    expect(subsidizedBooking.totalCostInr).toBe(1800);
    expect(subsidizedBooking.savingsInr).toBe(3000);
    expect(subsidizedBooking.appliedHourlyRate).toBe(450);
  });

  it('filters testbed facilities by city and equipment category', () => {
    const items = [
      {
        id: 'tb-1',
        slug: 'keysight-rf-analyzer',
        name: 'Keysight N9020B 20 GHz Spectrum Analyzer',
        model: 'N9020B MXA',
        manufacturer: 'Keysight Technologies',
        category: 'rf_spectrum_analyzer' as const,
        hostLab: {
          name: 'IIT Madras 5G Testbed',
          city: 'Chennai',
          state: 'Tamil Nadu',
          institution: 'IIT Madras Research Park',
          nablAccredited: true,
        },
        accessType: 'remote_scpi' as const,
        specifications: { bandwidth: '10 Hz - 20 GHz' },
        hourlyRateInr: 1200,
        studentSubsidyRateInr: 450,
        safetyInductionRequired: false,
        activeQueueLength: 2,
        scriptRunner: {
          scriptType: 'pyvisa_scpi' as const,
          sampleScript: '*IDN?\n:MEAS:FREQ?',
          supportedInterfaces: ['lan_scpi' as const],
        },
        description: '20 GHz microwave spectrum analyzer.',
        rulesAndGuidelines: ['Max input +30 dBm'],
      },
      {
        id: 'tb-2',
        slug: 'chroma-battery-cycler',
        name: 'Chroma 17020 Regenerative Battery Pack Cycler',
        model: '17020-100-1000',
        manufacturer: 'Chroma ATE',
        category: 'battery_cycler' as const,
        hostLab: {
          name: 'ARAI EV Center of Excellence',
          city: 'Pune',
          state: 'Maharashtra',
          institution: 'Automotive Research Association of India',
          nablAccredited: true,
        },
        accessType: 'physical_onsite' as const,
        specifications: { maxCurrent: '1000 A' },
        hourlyRateInr: 2500,
        studentSubsidyRateInr: 1000,
        safetyInductionRequired: true,
        activeQueueLength: 4,
        scriptRunner: {
          scriptType: 'json_profile' as const,
          sampleScript: '{"cycle": "AIS-156"}',
          supportedInterfaces: ['lan_scpi' as const],
        },
        description: 'Regenerative 1000A EV pack test bench.',
        rulesAndGuidelines: ['Operator mandatory'],
      },
    ];

    const chennaiOnly = filterTestbedFacilities(items, { city: 'chennai' });
    expect(chennaiOnly.length).toBe(1);
    expect(chennaiOnly[0]?.slug).toBe('keysight-rf-analyzer');

    const batteryCategory = filterTestbedFacilities(items, { category: 'battery_cycler' });
    expect(batteryCategory.length).toBe(1);
    expect(batteryCategory[0]?.slug).toBe('chroma-battery-cycler');

    const searchResult = filterTestbedFacilities(items, { search: 'Keysight' });
    expect(searchResult.length).toBe(1);
  });
});








