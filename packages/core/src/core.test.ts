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


