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
