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
  calculateCampaignProgress,
  calculateMilestonePayout,
  verifyMilestoneQuorum,
  matchGrantsForProject,
  campaignSchema,
  calculateBomMarkup,
  validatePinoutAnnotation,
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
  matchComplianceRequirements,
  evaluatePreComplianceReadiness,
  formatComplianceCost,
  validateScpiCommandScript,
  calculateTestbedBookingCost,
  filterTestbedFacilities,
  sprintEntrySchema,
  calculateSprintProgress,
  validateMilestoneSubmission,
  calculatePrizeDistribution,
  filterSprints,
  componentSourcingRecordSchema,
  calculateLandedComponentCost,
  findBestAlternate,
  filterSourcingRecords,
  pcbaAssemblyProjectSchema,
  calculatePnpFeederSetup,
  calculatePcbaTurnkeyCost,
  validatePnpCentroidCsv,
  emcScanProjectSchema,
  evaluateEmcCompliance,
  calculateCommonModeChoke,
  filterEmcProjects,
  calculateRfTransmissionLine,
  synthesizeTraceWidth,
  calculateLSectionMatch,
  RF_SUBSTRATES_DATABASE,
  batteryEisProjectSchema,
  calculateRandlesImpedance,
  evaluateBatterySoH,
  filterBatteryEisProjects,
  calculateThermalDissipation,
  filterThermalProjects,
  TIM_DATABASE,
  simulateSolarMppt,
  filterSolarMpptProjects,
  solarMpptProjectSchema,
  simulateMotorFoc,
  filterMotorFocProjects,
  motorFocProjectSchema,
  type MotorParameters,
  type MotorFocProject,
  simulateCanBus,
  filterCanBusProjects,
  canBusProjectSchema,
  type CanBusProject,
  type ClubChapter,
  type DefensivePublication,
  type JuniorChallenge,
  type TestbedFacility,
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
  const sampleClub: ClubChapter = {
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
    const clubs = [sampleClub];
    const filteredKerala = filterClubs(clubs, { state: 'Kerala' });
    expect(filteredKerala.length).toBe(1);

    const filteredDelhi = filterClubs(clubs, { state: 'Delhi' });
    expect(filteredDelhi.length).toBe(0);

    const filteredCategory = filterClubs(clubs, { category: 'school_atl' });
    expect(filteredCategory.length).toBe(0);
  });
});

describe('open invention network and ip defense ledger schema', () => {
  const samplePublication: DefensivePublication = {
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

    expect(verifyInventionIntegrity(samplePublication, validHash)).toBe(true);
    expect(verifyInventionIntegrity(samplePublication, fakeHash)).toBe(false);
  });

  it('generates statutory legal affidavit with 35 USC 102 and Indian Patents Act Sec 29 citations', () => {
    const affidavit = generatePriorArtAffidavitText(samplePublication);
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
    const ledger = [samplePublication];
    const matchCategory = filterDefensiveLedger(ledger, { category: 'clean_mobility_bms' });
    expect(matchCategory.length).toBe(1);

    const nonMatchCategory = filterDefensiveLedger(ledger, { category: 'avionics_aerospace' });
    expect(nonMatchCategory.length).toBe(0);

    const matchSearch = filterDefensiveLedger(ledger, { search: 'CAN-FD' });
    expect(matchSearch.length).toBe(1);
  });
});

describe('young innovators track and safety sandbox schema', () => {
  const sampleJuniorChallenge: JuniorChallenge = {
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
    const challenges = [sampleJuniorChallenge];
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
    const items: TestbedFacility[] = [
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

describe('sprints & rapid hardware hackathons', () => {
  const sampleSprint = {
    id: 'sprint_48h_autopilot',
    slug: '48h-indigenous-autopilot-sprint',
    title: '48H Indigenous Autopilot & Gimbal Sprint',
    tagline: 'Design and bring up a flight-ready dual-IMU autopilot board in 48 hours.',
    track: 'robotics_uav' as const,
    sponsor: {
      name: 'CSIR-NAL & iDEX Defence Innovation',
      grantAmount: 500000,
      grantCurrency: 'INR' as const,
      type: 'gov_grant' as const,
    },
    totalPrizePoolINR: 500000,
    startDate: '2026-11-20T09:00:00Z',
    endDate: '2026-11-22T09:00:00Z',
    durationHours: 48,
    currentStatus: 'active' as const,
    registeredTeamsCount: 24,
    maxTeams: 32,
    milestones: [
      {
        id: 'm1',
        hour: 12,
        title: 'Hour 12: Mechanical CAD & BOM Release',
        deliverables: ['STEP 3D model', 'BOM with LCSC part numbers'],
        reviewCriteria: ['Dual IMU vibration damping mount', 'Under 45g weight'],
        points: 25,
      },
      {
        id: 'm2',
        hour: 24,
        title: 'Hour 24: KiCad PCB Schematic & DRC Pass',
        deliverables: ['KiCad 8 schematic', 'Gerber layout zip'],
        reviewCriteria: ['4-layer stackup with controlled 50 ohm trace impedance'],
        points: 25,
      },
      {
        id: 'm3',
        hour: 36,
        title: 'Hour 36: Firmware Bringup & UART Telemetry',
        deliverables: ['Git repository with Zephyr RTOS or ArduPilot driver'],
        reviewCriteria: ['AHRS 400Hz telemetry loop over MAVLink'],
        points: 25,
      },
      {
        id: 'm4',
        hour: 48,
        title: 'Hour 48: Integrated Physical Demo Video',
        deliverables: ['Loom / YouTube prototype demo video showing gyro response'],
        reviewCriteria: ['Hardware-in-the-loop validation without sensor clipping'],
        points: 25,
      },
    ],
    eligibilityCriteria: ['Indian engineering students or DPIIT startups'],
    hardwarePerks: ['Free PCB fabrication credit', 'SAMEER vibration shaker slot voucher'],
    juryPanel: [
      {
        name: 'Dr. K. Sivanathan',
        role: 'Chief UAV Flight Controls Scientist',
        organization: 'CSIR National Aerospace Laboratories',
      },
    ],
    rules: ['All code and hardware designs must be open-source under CERN-OHL-P or Apache 2.0.'],
  };

  it('validates a complete sprint schema', () => {
    const parseResult = sprintEntrySchema.safeParse(sampleSprint);
    expect(parseResult.success).toBe(true);
  });

  it('computes sprint progress correctly before, during, and after sprint duration', () => {
    // Before start
    const before = calculateSprintProgress(sampleSprint, '2026-11-19T09:00:00Z');
    expect(before.currentHour).toBe(0);
    expect(before.progressPercent).toBe(0);
    expect(before.isCompleted).toBe(false);

    // Midway: 24 hours in
    const midway = calculateSprintProgress(sampleSprint, '2026-11-21T09:00:00Z');
    expect(midway.currentHour).toBe(24);
    expect(midway.progressPercent).toBe(50);
    expect(midway.activeMilestoneIndex).toBe(1);

    // Completed
    const after = calculateSprintProgress(sampleSprint, '2026-11-23T09:00:00Z');
    expect(after.currentHour).toBe(48);
    expect(after.progressPercent).toBe(100);
    expect(after.isCompleted).toBe(true);
    expect(after.timeRemainingMinutes).toBe(0);
  });

  it('validates milestone submission deliverables according to milestone type', () => {
    const cadMilestone = sampleSprint.milestones[0]!;
    const invalidSub = validateMilestoneSubmission(cadMilestone, { notes: 'hello' });
    expect(invalidSub.valid).toBe(false);
    expect(invalidSub.errors.some((e) => e.includes('CAD'))).toBe(true);

    const validSub = validateMilestoneSubmission(cadMilestone, {
      cadUrl: 'https://cad.onshape.com/documents/abc123',
    });
    expect(validSub.valid).toBe(true);
    expect(validSub.errors.length).toBe(0);
  });

  it('calculates prize distribution and filters sprints accurately', () => {
    const prizes = calculatePrizeDistribution(500000);
    expect(prizes.firstPlaceINR).toBe(250000);
    expect(prizes.secondPlaceINR).toBe(150000);
    expect(prizes.thirdPlaceINR).toBe(75000);
    expect(prizes.runnerUpsINR).toBe(25000);
    expect(prizes.firstPlaceINR + prizes.secondPlaceINR + prizes.thirdPlaceINR + prizes.runnerUpsINR).toBe(500000);

    const filtered = filterSprints([sampleSprint], { track: 'robotics_uav', search: 'Autopilot' });
    expect(filtered.length).toBe(1);

    const none = filterSprints([sampleSprint], { track: 'clean_energy' });
    expect(none.length).toBe(0);
  });
});

describe('component alternate & domestic sourcing recommender', () => {
  const sampleRecord = {
    id: 'src_stm32f405',
    mpn: 'STM32F405RGT6',
    manufacturer: 'STMicroelectronics',
    description: 'High-performance ARM Cortex-M4 MCU with 1MB Flash, 168 MHz CPU, USB OTG, CAN 2.0B.',
    category: 'microcontroller' as const,
    package: 'LQFP-64 (10x10mm)',
    lifecycle: 'active' as const,
    primarySpecs: {
      Core: 'ARM Cortex-M4 with FPU',
      'Clock Speed': '168 MHz',
      Flash: '1024 KB',
      SRAM: '192 KB',
      OperatingVoltage: '1.8V to 3.6V',
    },
    basePriceINR: 485,
    suppliers: [
      {
        supplierName: 'Robu.in',
        country: 'IN' as const,
        unitPriceINR: 520,
        moq: 1,
        inStockCount: 140,
        leadTimeDays: 2,
      },
      {
        supplierName: 'LCSC',
        country: 'CN' as const,
        unitPriceINR: 410,
        moq: 10,
        inStockCount: 4200,
        leadTimeDays: 6,
      },
    ],
    alternates: [
      {
        mpn: 'GD32F405RGT6',
        manufacturer: 'GigaDevice',
        compatibilityLevel: 'pin_compatible' as const,
        compatibilityScore: 98,
        keyDifferences: [
          'Direct drop-in pin-to-pin compatible on LQFP-64',
          'Faster core clock up to 200 MHz with zero-wait state flash',
          'Slightly lower current consumption under high load',
        ],
        firmwareChangesRequired: [
          'Flash write wait-state timing adjustment in system_stm32f4xx.c',
          'Option byte programming structure delta',
        ],
        unitPriceINR: 320,
        availabilityStatus: 'in_stock' as const,
      },
      {
        mpn: 'Mindgrove Secure IoT SoC',
        manufacturer: 'Mindgrove Technologies',
        compatibilityLevel: 'requires_pcb_redesign' as const,
        compatibilityScore: 65,
        keyDifferences: [
          'Indigenous Indian RISC-V 130nm ASIC architecture',
          'On-chip hardware TRNG and cryptographic engine',
        ],
        firmwareChangesRequired: [
          'Port firmware from ARM CMSIS to Zephyr RISC-V HAL',
        ],
        unitPriceINR: 280,
        availabilityStatus: 'in_stock' as const,
      },
    ],
    notes: [
      'Standard MCU choice for ArduPilot / Betaflight quadcopter flight controllers.',
    ],
  };

  it('validates a complete component sourcing record schema', () => {
    const parseResult = componentSourcingRecordSchema.safeParse(sampleRecord);
    expect(parseResult.success).toBe(true);
  });

  it('calculates domestic landed cost with 18% GST and zero customs duty', () => {
    const domestic = calculateLandedComponentCost(500, 10, 'IN');
    expect(domestic.subtotalINR).toBe(5000);
    expect(domestic.customsDutyINR).toBe(0);
    expect(domestic.socialWelfareSurchargeINR).toBe(0);
    expect(domestic.gstINR).toBe(900); // 18% of 5000
    expect(domestic.totalLandedINR).toBe(5900);
    expect(domestic.effectiveUnitCostINR).toBe(590);
  });

  it('calculates imported landed cost with 7.5% BCD, 10% SWS, and 18% IGST', () => {
    const imported = calculateLandedComponentCost(1000, 1, 'CN');
    expect(imported.subtotalINR).toBe(1000);
    expect(imported.customsDutyINR).toBe(75); // 7.5% of 1000
    expect(imported.socialWelfareSurchargeINR).toBe(7.5); // 10% of 75
    // IGST Base = 1000 + 75 + 7.5 = 1082.5
    // IGST = 1082.5 * 0.18 = 194.85
    expect(imported.gstINR).toBe(194.85);
    expect(imported.totalLandedINR).toBe(1277.35);
    expect(imported.effectiveUnitCostINR).toBe(1277.35);
  });

  it('finds the best alternate and filters sourcing records accurately', () => {
    const best = findBestAlternate(sampleRecord);
    expect(best).not.toBeNull();
    expect(best?.mpn).toBe('GD32F405RGT6');
    expect(best?.compatibilityScore).toBe(98);

    const mcuFiltered = filterSourcingRecords([sampleRecord], { category: 'microcontroller' });
    expect(mcuFiltered.length).toBe(1);

    const searched = filterSourcingRecords([sampleRecord], { search: 'GigaDevice' });
    expect(searched.length).toBe(1);

    const noMatch = filterSourcingRecords([sampleRecord], { category: 'rf_transceiver' });
    expect(noMatch.length).toBe(0);
  });
});

describe('assembly line & smt stencil visualizer', () => {
  const sampleProject = {
    id: 'pcba_drone_autopilot',
    slug: 'drone-autopilot-v4-pcba',
    name: 'ArduPilot Autopilot Flight Controller PCBA',
    boardDimensions: { widthMm: 65, heightMm: 65 },
    layerCount: 4,
    placements: [
      {
        designator: 'U1',
        val: 'STM32F405RGT6',
        pkg: 'qfp' as const,
        posX: 32.5,
        posY: 32.5,
        rotation: 0,
        side: 'top' as const,
      },
      {
        designator: 'U2',
        val: 'ICM-42688-P',
        pkg: 'qfn' as const,
        posX: 20.0,
        posY: 45.0,
        rotation: 90,
        side: 'top' as const,
      },
      {
        designator: 'C1',
        val: '100nF',
        pkg: '0402' as const,
        posX: 30.0,
        posY: 38.0,
        rotation: 0,
        side: 'top' as const,
      },
      {
        designator: 'C2',
        val: '100nF',
        pkg: '0402' as const,
        posX: 35.0,
        posY: 38.0,
        rotation: 0,
        side: 'top' as const,
      },
      {
        designator: 'J1',
        val: 'GH-6P',
        pkg: 'connector' as const,
        posX: 10.0,
        posY: 5.0,
        rotation: 180,
        side: 'bottom' as const,
      },
    ],
    recommendedFoilThickness: '0.12mm' as const,
    hasBgaOrQfn: true,
    hasConformalCoating: true,
    description: 'High-density 4-layer UAV flight controller board.',
    recommendedEmsPartner: {
      name: 'Kaynes Technology India Ltd',
      city: 'Mysore',
      state: 'Karnataka',
      certifications: ['ISO 9001', 'AS 9100D', 'IPC-A-610 Class 3'],
    },
  };

  it('validates a complete PCBA assembly project schema', () => {
    const parseResult = pcbaAssemblyProjectSchema.safeParse(sampleProject);
    expect(parseResult.success).toBe(true);
  });

  it('calculates feeder setup requirements and package breakdown', () => {
    const setup = calculatePnpFeederSetup(sampleProject.placements);
    expect(setup.totalParts).toBe(5);
    expect(setup.smdPartsCount).toBe(4);
    expect(setup.thtPartsCount).toBe(1); // J1 connector
    expect(setup.sideDistribution.top).toBe(4);
    expect(setup.sideDistribution.bottom).toBe(1);
    // Unique parts: STM32_qfp, ICM_qfn, 100nF_0402 (shared by C1 and C2), GH-6P_connector = 4 feeders
    expect(setup.feederSlotsRequired).toBe(4);
    expect(setup.packageBreakdown['0402']).toBe(2);
    expect(setup.packageBreakdown['qfp']).toBe(1);
  });

  it('calculates turnkey assembly costs across prototype and high-reliability tiers', () => {
    const protoCost = calculatePcbaTurnkeyCost(sampleProject, 10, 'standard_prototyping');
    expect(protoCost.totalAssemblyINR).toBeGreaterThan(5000);
    // Double-sided placement includes 4500 stencil fee
    expect(protoCost.stencilFeeINR).toBe(4500);
    expect(protoCost.unitAssemblyCostINR).toBe(Math.round((protoCost.totalAssemblyINR / 10) * 100) / 100);

    const aeroCost = calculatePcbaTurnkeyCost(sampleProject, 10, 'aerospace_class3');
    // Aerospace Class 3 has higher setup and inspection fees
    expect(aeroCost.totalAssemblyINR).toBeGreaterThan(protoCost.totalAssemblyINR);
  });

  it('validates and parses centroid CSV files correctly', () => {
    const csvData = `
Designator,Val,Package,PosX,PosY,Rot,Side
U1,STM32F405RGT6,LQFP-64,32.5,32.5,0,top
C1,100nF,0402,12.0,15.5,90,top
R1,10k,0402,14.2,15.5,180,bottom
`;
    const res = validatePnpCentroidCsv(csvData);
    expect(res.valid).toBe(true);
    expect(res.placements.length).toBe(3);
    expect(res.placements[0]?.pkg).toBe('qfp');
    expect(res.placements[1]?.pkg).toBe('0402');
    expect(res.placements[2]?.side).toBe('bottom');

    const invalidCsv = `Invalid single line`;
    const invalidRes = validatePnpCentroidCsv(invalidCsv);
    expect(invalidRes.valid).toBe(false);
    expect(invalidRes.errors.length).toBeGreaterThan(0);
  });
});

describe('emi / emc radiation pre-scan analyzer & near-field probe visualizer', () => {
  const sampleEmcProject = {
    id: 'emc_ev_bms_can',
    slug: 'ev-bms-isolated-can-cispr25',
    title: 'AIS-156 EV BMS Isolated CAN & Buck Conducted Emissions (CISPR 25)',
    deviceUnderTesting: 'Ather 450 Compatible 16S Smart BMS (HW Rev 3.2)',
    standard: 'cispr_25_class5' as const,
    scanType: 'conducted_emissions' as const,
    spectralTrace: [
      { frequencyMHz: 0.15, amplitudeDbuV: 48, limitDbuV: 66 },
      { frequencyMHz: 0.50, amplitudeDbuV: 52, limitDbuV: 56 },
      { frequencyMHz: 2.10, amplitudeDbuV: 42, limitDbuV: 46 },
      { frequencyMHz: 10.5, amplitudeDbuV: 31, limitDbuV: 40 },
      { frequencyMHz: 30.0, amplitudeDbuV: 22, limitDbuV: 34 },
    ],
    hotspots: [
      {
        id: 'hs1',
        nodeName: 'SW_NODE_LM5164',
        posX: 25.0,
        posY: 60.0,
        peakEmissionMHz: 2.1,
        peakDbuV: 52.4,
        noiseSource: 'switching_dv_dt' as const,
        mitigation: 'Add RC snubber (10R + 470pF) and shield inductor ground loop.',
      },
      {
        id: 'hs2',
        nodeName: 'CAN_DIFF_CHOKE',
        posX: 95.0,
        posY: 40.0,
        peakEmissionMHz: 10.5,
        peakDbuV: 34.0,
        noiseSource: 'clock_harmonic' as const,
        mitigation: 'Place 51uH common mode choke adjacent to CAN connector.',
      },
    ],
    testLabFacility: 'SAMEER Centre for Electromagnetics (Chennai)',
    overallStatus: 'compliant' as const,
    filterRecommendations: [
      'Install 100uH common-mode choke on high-voltage DC input rails.',
      'Reduce buck switching gate resistance from 4.7R to 10R to curb dv/dt rise time.',
    ],
    notes: [
      'Pre-scan verified using Rohde & Schwarz ESR26 receiver and LISN under CISPR 25 Class 5 limits.',
    ],
  };

  it('validates a complete emc scan project schema', () => {
    const parseResult = emcScanProjectSchema.safeParse(sampleEmcProject);
    expect(parseResult.success).toBe(true);
  });

  it('evaluates emc compliance margin correctly for compliant and non-compliant traces', () => {
    const compliantEval = evaluateEmcCompliance(sampleEmcProject.spectralTrace);
    expect(compliantEval.isCompliant).toBe(true);
    expect(compliantEval.violationCount).toBe(0);
    // 0.50 MHz: limit 56 - amplitude 52 = 4.0 dB worst margin
    expect(compliantEval.worstMarginDb).toBe(4.0);
    expect(compliantEval.maxPeakDbuV).toBe(52);

    const failingTrace = [
      { frequencyMHz: 1.2, amplitudeDbuV: 62, limitDbuV: 56 }, // +6 dB violation
      { frequencyMHz: 2.4, amplitudeDbuV: 40, limitDbuV: 46 },
    ];
    const failingEval = evaluateEmcCompliance(failingTrace);
    expect(failingEval.isCompliant).toBe(false);
    expect(failingEval.violationCount).toBe(1);
    expect(failingEval.worstMarginDb).toBe(-6.0);
    expect(failingEval.peakViolationFrequencyMHz).toBe(1.2);
  });

  it('calculates common-mode choke inductance and insertion loss attenuation', () => {
    const filter = calculateCommonModeChoke(10.0, 1000); // 10 MHz target
    expect(filter.requiredInductanceUh).toBeGreaterThan(10);
    expect(filter.recommendedCapacitanceNf).toBe(2.2);
    expect(filter.attenuationAtTargetDb).toBeGreaterThan(15);
  });

  it('filters emc projects by standard and search keyword', () => {
    const matched = filterEmcProjects([sampleEmcProject], { standard: 'cispr_25_class5' });
    expect(matched.length).toBe(1);

    const searched = filterEmcProjects([sampleEmcProject], { search: 'SAMEER' });
    expect(searched.length).toBe(1);

    const noMatch = filterEmcProjects([sampleEmcProject], { standard: 'mil_std_461g' });
    expect(noMatch.length).toBe(0);
  });
});

describe('RF Impedance & Transmission Line Synthesizer', () => {
  it('calculates microstrip characteristic impedance accurately using Hammerstad Jensen', () => {
    // 50 ohm microstrip on 1.6mm FR4 (Er=4.4): W is typically around 3.0mm
    const result = calculateRfTransmissionLine({
      lineType: 'microstrip',
      frequencyGHz: 2.4,
      traceWidthMm: 3.0,
      substrateHeightMm: 1.6,
      copperThicknessUm: 35,
      dielectricConstantEr: 4.4,
      lossTangent: 0.02,
    });

    expect(result.characteristicImpedanceZ0).toBeGreaterThan(45);
    expect(result.characteristicImpedanceZ0).toBeLessThan(55);
    expect(result.effectiveDielectricConstantEeff).toBeGreaterThan(3.0);
    expect(result.effectiveDielectricConstantEeff).toBeLessThan(4.4);
    expect(result.phaseVelocityPercentC).toBeGreaterThan(50);
    expect(result.skinDepthUm).toBeGreaterThan(1.0);
    expect(result.skinDepthUm).toBeLessThan(2.0); // ~1.33 um at 2.4 GHz
    expect(result.totalLossDbPerMm).toBeGreaterThan(0);
  });

  it('calculates grounded coplanar waveguide (GCPW) impedance', () => {
    // GCPW on Rogers RO4350B (Er=3.48, H=0.508mm)
    const result = calculateRfTransmissionLine({
      lineType: 'gcpw',
      frequencyGHz: 5.8,
      traceWidthMm: 1.1,
      substrateHeightMm: 0.508,
      groundGapMm: 0.4,
      copperThicknessUm: 35,
      dielectricConstantEr: 3.48,
      lossTangent: 0.0037,
    });

    expect(result.characteristicImpedanceZ0).toBeGreaterThan(40);
    expect(result.characteristicImpedanceZ0).toBeLessThan(60);
    expect(result.totalLossDbPerMm).toBeLessThan(0.05); // low loss ceramic
  });

  it('calculates differential microstrip impedance', () => {
    const result = calculateRfTransmissionLine({
      lineType: 'differential_microstrip',
      frequencyGHz: 5.0,
      traceWidthMm: 0.3,
      substrateHeightMm: 0.2,
      differentialSpacingMm: 0.25,
      copperThicknessUm: 18,
      dielectricConstantEr: 4.04,
      lossTangent: 0.015,
    });

    expect(result.differentialImpedanceZdiff).toBeDefined();
    expect(result.differentialImpedanceZdiff!).toBeGreaterThan(70);
    expect(result.differentialImpedanceZdiff!).toBeLessThan(120);
  });

  it('synthesizes trace width for target impedance via binary search', () => {
    // Target 50 ohms on 0.2mm prepreg FR4 (Er=4.04)
    const targetZ0 = 50.0;
    const synthesizedWidthMm = synthesizeTraceWidth('microstrip', targetZ0, 0.2, 4.04, 35);
    expect(synthesizedWidthMm).toBeGreaterThan(0.3);
    expect(synthesizedWidthMm).toBeLessThan(0.5);

    // Verify recalculation matches target within 0.1 ohm
    const verify = calculateRfTransmissionLine({
      lineType: 'microstrip',
      frequencyGHz: 1.0,
      traceWidthMm: synthesizedWidthMm,
      substrateHeightMm: 0.2,
      copperThicknessUm: 35,
      dielectricConstantEr: 4.04,
      lossTangent: 0.015,
    });
    expect(Math.abs(verify.characteristicImpedanceZ0 - targetZ0)).toBeLessThan(0.2);
  });

  it('synthesizes L-section matching network with valid components and Smith chart points', () => {
    // Match 25 - j15 load to 50 ohms at 865 MHz (IN865 LoRa)
    const match = calculateLSectionMatch(865, 50, 25, -15, true);

    expect(match.vswr).toBeGreaterThan(1.0);
    expect(match.returnLossDb).toBeGreaterThan(0);
    expect(match.seriesComponent.valuePicoOrNano).toBeGreaterThan(0);
    expect(match.shuntComponent.valuePicoOrNano).toBeGreaterThan(0);
    expect(match.smithChartPoints.length).toBe(3);
  });

  it('provides verified RF substrates database with FR-4, Rogers, and DuPont', () => {
    expect(RF_SUBSTRATES_DATABASE.rogers_ro4350b.dielectricConstantEr).toBe(3.48);
    expect(RF_SUBSTRATES_DATABASE.rogers_rt5880.lossTangent).toBe(0.0009);
    expect(RF_SUBSTRATES_DATABASE.fr4_standard.dielectricConstantEr).toBe(4.4);
  });
});

describe('Battery EIS & State-of-Health (SoH) Diagnostics', () => {
  const sampleEisProject = {
    id: 'eis-test-1',
    slug: 'lfp-32700-fresh',
    title: 'LFP 32700 6.0Ah Baseline Cell',
    cellModel: 'Gotion High-Tech 32700',
    chemistry: 'lfp_32700' as const,
    nominalVoltageV: 3.2,
    nominalCapacityAh: 6.0,
    cycleCount: 10,
    testTemperatureC: 25,
    stateOfChargeSocPercent: 50,
    eisSpectrum: [
      { frequencyHz: 10000, zRealOhm: 0.015, zImagOhm: 0.002, magnitudeOhm: 0.0151, phaseDeg: 7.6 },
      { frequencyHz: 1000, zRealOhm: 0.016, zImagOhm: -0.0002, magnitudeOhm: 0.016, phaseDeg: -0.7 },
      { frequencyHz: 100, zRealOhm: 0.022, zImagOhm: -0.004, magnitudeOhm: 0.0224, phaseDeg: -10.3 },
      { frequencyHz: 10, zRealOhm: 0.028, zImagOhm: -0.007, magnitudeOhm: 0.0289, phaseDeg: -14.0 },
      { frequencyHz: 1, zRealOhm: 0.034, zImagOhm: -0.005, magnitudeOhm: 0.0344, phaseDeg: -8.4 },
      { frequencyHz: 0.1, zRealOhm: 0.045, zImagOhm: -0.018, magnitudeOhm: 0.0485, phaseDeg: -21.8 },
    ],
    fittedEcm: {
      rBulkOhm: 0.016,
      rSeiOhm: 0.005,
      cSeiFarad: 0.15,
      rCtOhm: 0.018,
      cDlFarad: 1.2,
      warburgSigma: 0.008,
    },
    diagnostics: {
      sohPercent: 99.2,
      capacityAh: 5.95,
      nominalCapacityAh: 6.0,
      internalResistanceIncreasePercent: 2.1,
      seiLayerGrowthWarning: false,
      lithiumPlatingRisk: 'none' as const,
      estimatedCycleLifeRemaining: 1440,
      ais156SafetyVerdict: 'certified_safe' as const,
    },
    testFacility: 'ARAI Pune - Centre of Excellence for Electric Vehicles',
    testingNotes: 'Pristine baseline cell after 10 formation cycles.',
  };

  it('validates a complete battery EIS project schema', () => {
    const parsed = batteryEisProjectSchema.parse(sampleEisProject);
    expect(parsed.chemistry).toBe('lfp_32700');
    expect(parsed.eisSpectrum.length).toBe(6);
    expect(parsed.diagnostics.sohPercent).toBe(99.2);
  });

  it('calculates analytical Randles complex impedance', () => {
    const point1kHz = calculateRandlesImpedance(sampleEisProject.fittedEcm, 1000);
    expect(point1kHz.zReal).toBeGreaterThan(0.015);
    expect(point1kHz.magnitude).toBeGreaterThan(0.015);
    expect(point1kHz.phaseDeg).toBeDefined();

    const point01Hz = calculateRandlesImpedance(sampleEisProject.fittedEcm, 0.1);
    expect(point01Hz.zReal).toBeGreaterThan(point1kHz.zReal); // Warburg tail increases real impedance
  });

  it('evaluates battery SoH and triggers AIS-156 derate or quarantine upon severe degradation', () => {
    // Fresh cell
    const freshEval = evaluateBatterySoH(sampleEisProject.eisSpectrum, 6.0, 0.016);
    expect(freshEval.sohPercent).toBeGreaterThan(90);
    expect(freshEval.ais156SafetyVerdict).toBe('certified_safe');
    expect(freshEval.lithiumPlatingRisk).toBe('none');

    // Heavily degraded cell with 2.5x resistance increase (e.g. after 45C Indian heatwave cycling)
    const degradedSpectrum = [
      { frequencyHz: 1000, zRealOhm: 0.038, zImagOhm: 0.0001, magnitudeOhm: 0.038, phaseDeg: 0.1 },
      { frequencyHz: 10, zRealOhm: 0.085, zImagOhm: -0.025, magnitudeOhm: 0.0886, phaseDeg: -16.4 },
      { frequencyHz: 0.1, zRealOhm: 0.145, zImagOhm: -0.065, magnitudeOhm: 0.159, phaseDeg: -24.1 },
    ];
    const degradedEval = evaluateBatterySoH(degradedSpectrum, 6.0, 0.016);
    expect(degradedEval.internalResistanceIncreasePercent).toBeGreaterThan(80);
    expect(degradedEval.sohPercent).toBeLessThan(80);
    expect(degradedEval.ais156SafetyVerdict).toBe('quarantine_isolate');
    expect(degradedEval.seiLayerGrowthWarning).toBe(true);
  });

  it('filters battery EIS projects by chemistry, safety verdict and keyword', () => {
    const matchedChem = filterBatteryEisProjects([sampleEisProject], { chemistry: 'lfp_32700' });
    expect(matchedChem.length).toBe(1);

    const noMatchChem = filterBatteryEisProjects([sampleEisProject], { chemistry: 'nmc_21700' });
    expect(noMatchChem.length).toBe(0);

    const searchMatch = filterBatteryEisProjects([sampleEisProject], { search: 'ARAI' });
    expect(searchMatch.length).toBe(1);
  });
});

describe('Thermal Management & Computational Heat Sink Profiler', () => {
  const sampleParams = {
    powerDissipationWatts: 35, // 35W MOSFET dissipation
    ambientTemperatureC: 45, // 45C Indian summer ambient
    maxJunctionTemperatureC: 150,
    junctionToCaseResistanceCPerW: 0.8,
    timMaterial: 'phase_change_ptm7950' as const,
    timContactAreaCm2: 4.5,
    heatsinkMaterial: 'aluminum_6063_t5' as const,
    coolingMethod: 'forced_convection_low_cfm' as const,
    heatsinkWidthMm: 80,
    heatsinkLengthMm: 100,
    baseThicknessMm: 6,
    finHeightMm: 30,
    finThicknessMm: 1.5,
    numberOfFins: 14,
  };

  it('calculates 1D thermal resistor network accurately', () => {
    const result = calculateThermalDissipation(sampleParams);

    expect(result.thetaJc).toBe(0.8);
    expect(result.thetaCs).toBeGreaterThan(0);
    expect(result.thetaCs).toBeLessThan(0.05); // PTM7950 is high performance
    expect(result.thetaSa).toBeGreaterThan(0.5);
    expect(result.thetaSa).toBeLessThan(3.0);
    expect(result.junctionTemperatureC).toBeGreaterThan(sampleParams.ambientTemperatureC);
    expect(result.junctionTemperatureC).toBeLessThan(sampleParams.maxJunctionTemperatureC);
    expect(result.thermalHeadroomC).toBeGreaterThan(0);
    expect(result.isThermalRunawayRisk).toBe(false);
    expect(result.finEfficiencyPercent).toBeGreaterThan(70);
  });

  it('detects thermal throttling and runaway risk when dissipation exceeds cooling capacity', () => {
    // 120W on tiny natural convection heatsink
    const overloaded = calculateThermalDissipation({
      ...sampleParams,
      powerDissipationWatts: 120,
      coolingMethod: 'natural_convection',
      numberOfFins: 6,
      finHeightMm: 15,
    });

    expect(overloaded.junctionTemperatureC).toBeGreaterThan(150);
    expect(overloaded.thermalHeadroomC).toBeLessThanOrEqual(0);
    expect(overloaded.isThermalRunawayRisk).toBe(true);
  });

  it('provides verified TIM database with Honeywell PTM7950 and Bergquist Sil-Pad', () => {
    expect(TIM_DATABASE.phase_change_ptm7950.thermalConductivityWmk).toBe(8.5);
    expect(TIM_DATABASE.sil_pad_elastomeric.dielectricIsolationKv).toBe(4.5);
    expect(TIM_DATABASE.ceramic_alumina_wafer.dielectricIsolationKv).toBe(10.0);
  });

  it('filters thermal profile projects by cooling method and search query', () => {
    const sampleProject = {
      id: 'thm-1',
      slug: 'sic-traction-inverter-10kw',
      title: '10 kW SiC Traction Inverter Heat Sink',
      application: 'Electric Bus Powertrain',
      deviceType: 'Wolfspeed 1200V SiC Half-Bridge',
      powerDissipationWatts: 350,
      operatingAmbientTemperatureC: 50,
      coolingMethod: 'forced_convection_high_cfm' as const,
      heatsinkMaterial: 'copper_c11000' as const,
      timMaterial: 'ceramic_alumina_wafer' as const,
      params: {
        heatsinkWidthMm: 160,
        heatsinkLengthMm: 220,
        baseThicknessMm: 12,
        finHeightMm: 45,
        finThicknessMm: 2.0,
        numberOfFins: 28,
        timContactAreaCm2: 24,
        junctionToCaseResistanceCPerW: 0.25,
        maxJunctionTemperatureC: 175,
      },
      designNotes: ['Skived copper fin design', 'Air duct velocity 4.5 m/s'],
      indianTestFacility: 'ARAI Pune - Powertrain Climate & Thermal Chamber',
      regulatoryStandard: 'AIS-041 / AIS-156',
    };

    const filtered = filterThermalProjects([sampleProject], {
      coolingMethod: 'forced_convection_high_cfm',
      search: 'Wolfspeed',
    });
    expect(filtered.length).toBe(1);

    const noMatch = filterThermalProjects([sampleProject], {
      coolingMethod: 'natural_convection',
    });
    expect(noMatch.length).toBe(0);
  });
});

describe('Solar PV & MPPT Battery Charge Controller Simulator', () => {
  const samplePanel = {
    panelModel: 'Waaree Bi-55-540W Mono PERC',
    technology: 'mono_perc' as const,
    nominalPmaxW: 540,
    nominalVmpV: 41.8,
    nominalImpA: 12.92,
    nominalVocV: 49.6,
    nominalIscA: 13.68,
    tempCoeffVocPercentPerC: -0.27,
    tempCoeffIscPercentPerC: 0.048,
    tempCoeffPmaxPercentPerC: -0.35,
    seriesCells: 72,
  };

  it('calculates IV & PV curves and dynamic MPPT tracking under Standard Test Conditions (STC)', () => {
    const result = simulateSolarMppt({
      irradianceWPerM2: 1000,
      cellTemperatureC: 25,
      panelSpecs: samplePanel,
      algorithm: 'incremental_conductance',
      targetBatteryType: 'lfp_48v',
      converterSwitchingFreqKhz: 150,
    });

    expect(result.vocActualV).toBeCloseTo(49.6, 0);
    expect(result.iscActualA).toBeCloseTo(13.68, 0);
    expect(result.pmppActualW).toBeGreaterThan(500);
    expect(result.trackingEfficiencyPercent).toBeGreaterThan(99);
    expect(result.converterDutyCycle).toBeGreaterThan(0.5);
    expect(result.converterInductanceMicroH).toBeGreaterThan(5);
    expect(result.ivCurve.length).toBeGreaterThan(20);
    expect(result.batteryCurrentA).toBeGreaterThan(9.0);
  });

  it('models thermal voltage drop and power loss in extreme 65C Rajasthan desert heat', () => {
    const hotResult = simulateSolarMppt({
      irradianceWPerM2: 1000,
      cellTemperatureC: 65, // +40C over STC
      panelSpecs: samplePanel,
      algorithm: 'incremental_conductance',
      targetBatteryType: 'lfp_48v',
    });

    // At +40C, Voc drops by ~ -0.27% * 40 = -10.8% (~ -5.3V)
    expect(hotResult.vocActualV).toBeLessThan(46.0);
    // Pmax drops by ~ -0.35% * 40 = -14%
    expect(hotResult.pmppActualW).toBeLessThan(480);
    expect(hotResult.pmppActualW).toBeGreaterThan(430);
  });

  it('simulates partial shading and evaluates global MPPT vs standard P&O efficiency', () => {
    const poResult = simulateSolarMppt({
      irradianceWPerM2: 1000,
      cellTemperatureC: 25,
      panelSpecs: samplePanel,
      algorithm: 'perturb_and_observe',
      partialShadingRatio: 0.4, // 40% shaded
    });

    const gmppResult = simulateSolarMppt({
      irradianceWPerM2: 1000,
      cellTemperatureC: 25,
      panelSpecs: samplePanel,
      algorithm: 'global_sweep_partial_shading',
      partialShadingRatio: 0.4,
    });

    expect(gmppResult.trackingEfficiencyPercent).toBeGreaterThan(poResult.trackingEfficiencyPercent);
    expect(gmppResult.mpptTrackedPowerW).toBeGreaterThan(poResult.mpptTrackedPowerW);
  });

  it('validates a complete solar MPPT project schema and filters projects', () => {
    const sampleProject = {
      id: 'sol-1',
      slug: 'rajasthan-canal-top-solar-500w',
      title: '500W High-Efficiency Monocrystalline Bifacial Panel',
      application: 'Canal-Top Solar Grid',
      systemCapacityWatts: 540,
      panelSpecs: samplePanel,
      targetBattery: 'lfp_48v' as const,
      mpptAlgorithm: 'incremental_conductance' as const,
      operatingConditions: {
        designIrradianceWPerM2: 1000,
        designTemperatureC: 60,
        ambientEnvironment: 'Thar Desert / Indira Gandhi Canal',
      },
      converterSpecs: {
        topology: 'Synchronous 4-Switch Buck-Boost',
        switchingFrequencyKhz: 150,
        peakEfficiencyPercent: 98.4,
        inductorValueUh: 47,
        outputCapacitanceUf: 220,
      },
      designDirectives: ['Bifacial albedo reflection gain of +12% from water surface'],
      indianContextFacility: 'National Institute of Solar Energy (NISE), Gurugram',
      standardsCompliance: 'IS 14286 / IEC 61215 Terrestrial PV Modules',
    };

    const parsed = solarMpptProjectSchema.parse(sampleProject);
    expect(parsed.systemCapacityWatts).toBe(540);

    const filtered = filterSolarMpptProjects([sampleProject], {
      algorithm: 'incremental_conductance',
      search: 'Indira Gandhi',
    });
    expect(filtered.length).toBe(1);

    const noMatch = filterSolarMpptProjects([sampleProject], {
      batteryType: 'lead_acid_12v',
    });
    expect(noMatch.length).toBe(0);
  });
});

describe('BLDC & PMSM Field-Oriented Control (FOC) Simulator', () => {
  const sampleIpmMotor: MotorParameters = {
    motorModel: 'Ather 450X 6kW IPM Traction Motor',
    topology: 'interior_pmsm',
    polePairs: 4,
    statorResistanceOhm: 0.038,
    dAxisInductanceMilliH: 0.22,
    qAxisInductanceMilliH: 0.36,
    permanentMagnetFluxWb: 0.032,
    ratedSpeedRpm: 4500,
    maxSpeedRpm: 8000,
    ratedTorqueNm: 26,
    peakTorqueNm: 40,
    dcBusVoltageV: 51.2,
    maxInverterCurrentA: 160,
  };

  it('calculates Clarke/Park transforms, torque generation, and SVPWM dwell times for Interior PMSM', () => {
    const result = simulateMotorFoc({
      targetSpeedRpm: 3200,
      loadTorqueNm: 15,
      motor: sampleIpmMotor,
      pwmFrequencyKhz: 20,
      dcBusVoltageV: 51.2,
      enableFieldWeakening: false,
      currentLoopBandwidthHz: 1200,
    });

    expect(result.electricalRpm).toBe(12800); // 3200 * 4
    expect(result.iqCurrentA).toBeGreaterThan(50);
    expect(result.reluctanceTorqueNm).toBeGreaterThan(0.5); // IPM reluctance torque boost
    expect(result.totalTorqueNm).toBeGreaterThan(14.5);
    expect(result.mechanicalPowerWatts).toBeGreaterThan(4800);
    expect(result.inverterEfficiencyPercent).toBeGreaterThan(90);
    expect(result.currentSector).toBeGreaterThanOrEqual(1);
    expect(result.currentSector).toBeLessThanOrEqual(6);
    // At 20 kHz, T_pwm = 50 us. Dwell times T1 + T2 + T0 should equal ~50 us
    expect(result.dwellTimeT1Us + result.dwellTimeT2Us + result.dwellTimeT0Us).toBeCloseTo(50, 0);
    expect(result.waveforms.length).toBeGreaterThanOrEqual(30);
  });

  it('triggers field weakening when back-EMF approaches DC bus limit at high speed', () => {
    const highSpeedResult = simulateMotorFoc({
      targetSpeedRpm: 7500, // High speed near max
      loadTorqueNm: 8,
      motor: sampleIpmMotor,
      pwmFrequencyKhz: 20,
      dcBusVoltageV: 51.2,
      enableFieldWeakening: true,
    });

    // In high-speed field weakening, Id is forced negative to counteract PM back-EMF
    expect(highSpeedResult.idCurrentA).toBeLessThan(0);
    expect(highSpeedResult.backEmfPeakV).toBeGreaterThan(90);
    expect(highSpeedResult.mechanicalRpm).toBe(7500);
  });

  it('synthesizes PI current loop gains (Kp, Ki) based on specified loop bandwidth', () => {
    const result = simulateMotorFoc({
      targetSpeedRpm: 2000,
      loadTorqueNm: 10,
      motor: sampleIpmMotor,
      currentLoopBandwidthHz: 1000, // 1 kHz current loop
    });

    // Kp = Lq * 2 * pi * f_bw = 0.00036 * 6283.18 ~ 2.26
    expect(result.kpGain).toBeGreaterThan(2.0);
    expect(result.kpGain).toBeLessThan(2.5);
    // Ki = Rs * 2 * pi * f_bw = 0.038 * 6283.18 ~ 238.7
    expect(result.kiGain).toBeGreaterThan(200);
  });

  it('validates a complete motor FOC project schema and filters projects', () => {
    const sampleProject: MotorFocProject = {
      id: 'foc-proj-1',
      slug: 'ather-450x-pmsm-traction',
      title: 'Ather 450X 6 kW IPM PMSM Mid-Drive Traction Controller',
      vehicleApplication: 'Electric 2-wheeler scooter powertrain operating in urban stop-and-go Bengaluru traffic',
      peakPowerWatts: 6000,
      motorParams: sampleIpmMotor,
      defaultOperatingSpeedRpm: 3500,
      defaultLoadTorqueNm: 18,
      recommendedPwmKhz: 20,
      feedbackSensor: 'absolute_magnetic_as5047',
      inverterSpecs: {
        topology: '3-Phase Full-Bridge Synchronous Inverter',
        switchTechnology: 'silicon_mosfet',
        deadTimeNanoseconds: 450,
        currentShuntTopology: 'low_side_three_shunt',
      },
      designDirectives: [
        'MTPA algorithm utilizes 36% IPM reluctance saliency torque (Lq > Ld) reducing RMS phase current by 12%.',
        'Field weakening injects up to -45A Id above 55 km/h to reach 90 km/h top speed.',
      ],
      indianContextFacility: 'ARAI Pune - Centre of Excellence for Electric Vehicles',
      standardsCompliance: 'ARAI AIS-041 (Electric Powertrain Measurement) & AIS-156',
    };

    const parsed = motorFocProjectSchema.parse(sampleProject);
    expect(parsed.peakPowerWatts).toBe(6000);

    const filtered = filterMotorFocProjects([sampleProject], {
      topology: 'interior_pmsm',
      search: 'Ather',
    });
    expect(filtered.length).toBe(1);

    const noMatch = filterMotorFocProjects([sampleProject], {
      sensorType: 'hall_sensors_120deg',
    });
    expect(noMatch.length).toBe(0);
  });
});

describe('Automotive CAN Bus & ISO 11898 Network Simulator', () => {
  it('calculates nominal bit time, sample point percentage, and CiA compliance at 500 kbps', () => {
    const result = simulateCanBus({
      standard: 'can_2_0b_standard',
      baudRateKbps: 500,
      clockFrequencyMhz: 40, // 40 MHz CAN controller peripheral clock
      busLengthMeters: 15,
      numberOfNodes: 8,
      averagePayloadBytes: 8,
      totalMessageFrequencyHz: 400,
      termination: 'split_termination_filtered',
    });

    expect(result.actualBaudRateKbps).toBe(500);
    expect(result.nominalBitTimeNs).toBe(2000); // 1 / 500k = 2000 ns
    expect(result.samplePointPercent).toBeGreaterThanOrEqual(75.0);
    expect(result.samplePointPercent).toBeLessThanOrEqual(88.0);
    expect(result.samplePointStatus).toBe('optimal_cia');
    expect(result.busLoadPercent).toBeGreaterThan(5);
    expect(result.busLoadPercent).toBeLessThan(65);
    expect(result.busUtilizationHealth).toBe('optimal_safe');
  });

  it('evaluates propagation delay and maximum cable length for physical bus arbitration', () => {
    const result = simulateCanBus({
      standard: 'can_2_0b_standard',
      baudRateKbps: 250, // 250 kbps allows longer bus runs
      clockFrequencyMhz: 40,
      busLengthMeters: 40,
      cableSpecificDelayNsPerMeter: 5,
      transceiverLoopDelayNs: 150,
    });

    expect(result.nominalBitTimeNs).toBe(4000);
    expect(result.oneWayPropDelayNs).toBeGreaterThan(200);
    expect(result.roundTripDelayNs).toBeGreaterThan(500);
    expect(result.maxAllowableBusLengthMeters).toBeGreaterThan(30);
  });

  it('models differential oscilloscope voltage levels (CAN_H, CAN_L, Vdiff) during dominant and recessive states', () => {
    const result = simulateCanBus({
      standard: 'can_2_0b_standard',
      baudRateKbps: 500,
    });

    expect(result.waveforms.length).toBeGreaterThanOrEqual(50);

    // Dominant bit (logic 0): CAN_H ~3.5V, CAN_L ~1.5V, V_diff ~2.0V
    const dominantSample = result.waveforms.find((w) => w.bitLogicState === 'dominant_0');
    expect(dominantSample).toBeDefined();
    expect(dominantSample!.vCanH).toBeGreaterThan(3.3);
    expect(dominantSample!.vCanL).toBeLessThan(1.7);
    expect(dominantSample!.vDiff).toBeGreaterThan(1.8);

    // Recessive bit (logic 1): CAN_H ~2.5V, CAN_L ~2.5V, V_diff ~0.0V
    const recessiveSample = result.waveforms.find((w) => w.bitLogicState === 'recessive_1');
    expect(recessiveSample).toBeDefined();
    expect(recessiveSample!.vCanH).toBeCloseTo(2.5, 1);
    expect(recessiveSample!.vCanL).toBeCloseTo(2.5, 1);
    expect(recessiveSample!.vDiff).toBeLessThan(0.2);
  });

  it('validates a complete CAN bus project schema and filters projects', () => {
    const sampleProject: CanBusProject = {
      id: 'can-proj-1',
      slug: 'ather-450x-powertrain-can',
      title: 'Ather 450X ISO 11898-2 Powertrain & Telematics CAN Bus',
      automotiveDomain: 'Electric 2-wheeler intra-vehicle communication network',
      protocolStandard: 'can_2_0b_standard',
      nominalBaudRateKbps: 500,
      busTopology: {
        busLengthMeters: 4.2,
        nodeCount: 6,
        cableType: 'Shielded Twisted Pair (STP) Automotive Grade 0.35mm²',
        terminationMethod: 'split_termination_filtered',
        isolationType: 'capacitive_digital_isolator',
      },
      designDirectives: [
        'Split termination with 2x 60Ω resistors and 4.7nF ceramic cap filters common-mode RF noise without shifting differential DC bias.',
        'Sample point set at 80% to absorb 150ns transceiver propagation loop delay.',
      ],
      indianContextFacility: 'ARAI Pune - Centre of Excellence for Electric Vehicles',
      standardsCompliance: 'ARAI AIS-004 Part 3 (Automotive EMC) & ISO 11898-2:2016',
    };

    const parsed = canBusProjectSchema.parse(sampleProject);
    expect(parsed.nominalBaudRateKbps).toBe(500);

    const filtered = filterCanBusProjects([sampleProject], {
      standard: 'can_2_0b_standard',
      search: 'Ather',
    });
    expect(filtered.length).toBe(1);

    const noMatch = filterCanBusProjects([sampleProject], {
      termination: 'single_end_high_z_unterminated',
    });
    expect(noMatch.length).toBe(0);
  });
});














