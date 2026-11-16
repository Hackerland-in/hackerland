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
});

