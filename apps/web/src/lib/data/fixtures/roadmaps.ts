import type { RoadmapView } from '../types';

export const ROADMAP_EMBEDDED: RoadmapView = {
  slug: 'embedded-systems-from-zero',
  title: 'Embedded Systems from Zero',
  track: 'make',
  level: 'beginner',
  summary:
    'Go from basic digital logic and breadboards to programming bare-metal ARM Cortex-M microcontrollers and hardware communication protocols.',
  hours: 75,
  learners: 1240,
  stages: [
    {
      title: 'Digital Electronics & Circuit Theory',
      status: 'done',
      modules: [
        {
          title: 'Circuits and Electronics',
          provider: 'MIT OpenCourseWare',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://ocw.mit.edu',
        },
        {
          title: 'Digital Circuits and Systems',
          provider: 'NPTEL',
          hours: 20,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
    {
      title: 'Microcontroller Architecture & Bare-metal C',
      status: 'active',
      modules: [
        {
          title: 'Embedded Systems - Shape the World: Microcontroller I/O',
          provider: 'NPTEL',
          hours: 30,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
    {
      title: 'RTOS & Hardware Communication Protocols',
      status: 'locked',
      modules: [
        {
          title: 'Real-Time Operating Systems for Embedded Applications',
          provider: 'NPTEL',
          hours: 20,
          free: true,
          certified: false,
          url: 'https://nptel.ac.in',
        },
      ],
    },
  ],
};

export const ROADMAP_FULL_STACK: RoadmapView = {
  slug: 'full-stack-web',
  title: 'Full-Stack Modern Web Engineering',
  track: 'code',
  level: 'beginner',
  summary:
    'Master modern TypeScript, React, Next.js, and backend web architecture with hands-on open-source projects.',
  hours: 120,
  learners: 3410,
  stages: [
    {
      title: 'JavaScript Algorithms and Data Structures',
      status: 'done',
      modules: [
        {
          title: 'JavaScript Algorithms and Data Structures Certification',
          provider: 'freeCodeCamp',
          hours: 40,
          free: true,
          certified: true,
          url: 'https://freecodecamp.org',
        },
      ],
    },
    {
      title: 'Front End Development Libraries',
      status: 'active',
      modules: [
        {
          title: 'Front End Development Libraries (React & Redux)',
          provider: 'freeCodeCamp',
          hours: 40,
          free: true,
          certified: true,
          url: 'https://freecodecamp.org',
        },
      ],
    },
    {
      title: 'Full Stack Architecture & Databases',
      status: 'locked',
      modules: [
        {
          title: 'Back End Development and APIs',
          provider: 'freeCodeCamp',
          hours: 40,
          free: true,
          certified: true,
          url: 'https://freecodecamp.org',
        },
      ],
    },
  ],
};

export const ROADMAP_PRODUCT_DESIGN: RoadmapView = {
  slug: 'product-design-foundations',
  title: 'Product & Accessibility Design Foundations',
  track: 'design',
  level: 'intermediate',
  summary:
    'Human-centred design systems, accessibility standards (WCAG), tactile affordances, and Figma to production handoff.',
  hours: 60,
  learners: 890,
  stages: [
    {
      title: 'User Interface & Ergonomic Principles',
      status: 'done',
      modules: [
        {
          title: 'User Interface Design and Implementation',
          provider: 'MIT OpenCourseWare',
          hours: 30,
          free: true,
          certified: false,
          url: 'https://ocw.mit.edu',
        },
      ],
    },
    {
      title: 'Universal Design & Assistive Accessibility',
      status: 'active',
      modules: [
        {
          title: 'Interaction Design & Accessible Interfaces',
          provider: 'NPTEL',
          hours: 30,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
  ],
};

export const ROADMAP_CUBESAT: RoadmapView = {
  slug: 'cubesat-engineering',
  title: 'CubeSat Engineering & Subsystems',
  track: 'research',
  level: 'advanced',
  summary:
    'Structural, thermal, telemetry and orbital mechanics foundations for building and launching 1U–3U scientific nanosatellites.',
  hours: 90,
  learners: 640,
  stages: [
    {
      title: 'Orbital Mechanics & Spacecraft Dynamics',
      status: 'active',
      modules: [
        {
          title: 'Astrodynamics and Spacecraft Attitude Control',
          provider: 'MIT OpenCourseWare',
          hours: 45,
          free: true,
          certified: false,
          url: 'https://ocw.mit.edu',
        },
      ],
    },
    {
      title: 'Small Satellite Power & RF Telemetry Payloads',
      status: 'locked',
      modules: [
        {
          title: 'Spacecraft Design and Subsystems Engineering',
          provider: 'NPTEL',
          hours: 45,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
  ],
};

export const ALL_ROADMAPS: RoadmapView[] = [
  ROADMAP_EMBEDDED,
  ROADMAP_FULL_STACK,
  ROADMAP_PRODUCT_DESIGN,
  ROADMAP_CUBESAT,
];
