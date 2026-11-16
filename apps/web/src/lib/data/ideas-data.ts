import type { Idea } from '@hackerland/core';

export const INITIAL_COMMUNITY_IDEAS: Idea[] = [
  {
    id: 'idea_1',
    creatorId: 'u_aarav',
    creatorHandle: 'aarav_sharma',
    creatorName: 'Aarav Sharma',
    title: 'Autonomous Solar Weeding Rover for Cotton Fields',
    slug: 'autonomous-solar-weeding-rover-cotton',
    summary: 'A lightweight rover with computer vision targeting weed roots using mechanical cutters instead of chemical glyphosate sprays.',
    problemStatement: 'Chemical weedicide sprays poison soil microbiology and cost smallholder cotton farmers up to ₹12,000 per acre annually. Manual weeding is back-breaking and suffers from acute labor shortages during monsoon harvest.',
    targetAudience: 'Smallholder organic and conventional cotton farmers in central India',
    currentStage: 'prototype',
    status: 'exploring',
    domains: ['Agriculture', 'Robotics', 'Computer Vision'],
    neededRoles: ['Embedded Hardware Engineer', 'YOLO / Edge AI Developer'],
    stageWorkbook: {
      observedProblems: [
        'Farmers spend 30% of operating expense on manual weed pulling',
        'Chemical sprays contaminate runoff drinking water wells',
      ],
      customerInterviewNotes: 'Spoke with 12 cotton farmers in Wardha. All expressed willingness to buy a machine under ₹40,000 if it eliminated seasonal labor hiring.',
      prototypeType: 'breadboard_pcb',
      feedbackSummary: 'ESP32 motor controller works, but differential steering struggles in muddy clay soil. Switching to high-torque planetary DC gearmotors.',
    },
    cheersCount: 42,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
  {
    id: 'idea_2',
    creatorId: 'u_priya',
    creatorHandle: 'priya_embedded',
    creatorName: 'Priya Kulkarni',
    title: 'Haptic Obstacle Navigation Belt for Visually Impaired Students',
    slug: 'haptic-obstacle-navigation-belt-visually-impaired',
    summary: 'A discreet waist belt embedded with 6 miniature ultrasonic and millimeter-wave radar sensors providing directional vibration feedback for chest and head-height obstacles.',
    problemStatement: 'Standard white canes detect ground-level curbs and stairs, but completely fail to protect users against head-height tree branches, open truck beds, and low scaffolding poles.',
    targetAudience: 'Blind and visually impaired students and urban commuters',
    currentStage: 'understand',
    status: 'exploring',
    domains: ['Assistive Tech', 'Hardware', 'Haptics'],
    neededRoles: ['Industrial Product Designer', 'Textile / Wearable Fabricator'],
    stageWorkbook: {
      observedProblems: [
        'Head injuries from overhanging branches are common among cane users',
        'Handheld ultrasonic canes tire the user wrist after 15 minutes',
      ],
      customerInterviewNotes: 'Interviewed 8 students at Pune Blind Men Association School. Key insight: device must be invisible under a shirt or jacket so it does not stigmatize the wearer.',
      prototypeType: 'paper_sketch',
    },
    cheersCount: 56,
    createdAt: '2026-06-10T00:00:00.000Z',
    updatedAt: '2026-11-16T00:00:00.000Z',
  },
];

export async function listIdeas(): Promise<Idea[]> {
  return INITIAL_COMMUNITY_IDEAS;
}

export async function getIdea(slug: string): Promise<Idea | null> {
  return INITIAL_COMMUNITY_IDEAS.find((i) => i.slug === slug) || null;
}
