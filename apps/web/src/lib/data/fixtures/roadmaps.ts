import type { RoadmapView } from '../types';

/* =========================================================================
   1. CODE TRACK
   ========================================================================= */

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
          url: 'https://www.freecodecamp.org',
        },
        {
          title: 'MDN Web Standards Deep Dive',
          provider: 'MDN Web Docs',
          hours: 20,
          free: true,
          certified: false,
          url: 'https://developer.mozilla.org',
        },
      ],
    },
    {
      title: 'Modern React & State Management',
      status: 'active',
      modules: [
        {
          title: 'Full Stack Open: Deep Dive Into Modern Web Development',
          provider: 'University of Helsinki',
          hours: 40,
          free: true,
          certified: true,
          url: 'https://fullstackopen.com/en/',
        },
      ],
    },
    {
      title: 'Full Stack Architecture & APIs',
      status: 'locked',
      modules: [
        {
          title: 'Back End Development and APIs Certification',
          provider: 'freeCodeCamp',
          hours: 20,
          free: true,
          certified: true,
          url: 'https://www.freecodecamp.org',
        },
      ],
    },
  ],
};

export const ROADMAP_RUST_SYSTEMS: RoadmapView = {
  slug: 'rust-systems-programming',
  title: 'Rust Systems & Embedded Concurrency',
  track: 'code',
  level: 'intermediate',
  summary:
    'Build memory-safe systems software, asynchronous network services, and bare-metal microcontroller drivers with Rust.',
  hours: 85,
  learners: 1820,
  stages: [
    {
      title: 'Rust Language Fundamentals & Ownership',
      status: 'done',
      modules: [
        {
          title: 'The Rust Programming Language Book',
          provider: 'Rust Foundation',
          hours: 35,
          free: true,
          certified: false,
          url: 'https://doc.rust-lang.org/book/',
        },
      ],
    },
    {
      title: 'Idiomatic Patterns & Error Handling',
      status: 'active',
      modules: [
        {
          title: 'Rust by Example & CLI Tool Building',
          provider: 'Rust Community',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://doc.rust-lang.org/rust-by-example/',
        },
      ],
    },
    {
      title: 'Async Runtimes & Concurrency',
      status: 'locked',
      modules: [
        {
          title: 'Tokio Async Network Programming',
          provider: 'Tokio Project',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://tokio.rs/',
        },
      ],
    },
  ],
};

/* =========================================================================
   2. MAKE TRACK
   ========================================================================= */

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
          title: 'Embedded System Design with ARM Cortex-M',
          provider: 'NPTEL',
          hours: 20,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
        {
          title: 'Virtual Embedded Simulation Lab (ESP32 & RP2040)',
          provider: 'Wokwi',
          hours: 10,
          free: true,
          certified: false,
          url: 'https://wokwi.com/',
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

export const ROADMAP_ROBOTICS_ROS2: RoadmapView = {
  slug: 'robotics-and-ros2',
  title: 'Autonomous Robotics with ROS 2',
  track: 'make',
  level: 'intermediate',
  summary:
    'Architect distributed robotics systems, sensor fusion filters, URDF kinematic models, and Nav2 SLAM pipelines with ROS 2 Humble.',
  hours: 90,
  learners: 1450,
  stages: [
    {
      title: 'ROS 2 Core Architecture & Nodes',
      status: 'done',
      modules: [
        {
          title: 'ROS 2 Humble Documentation & Tutorials',
          provider: 'Open Robotics',
          hours: 30,
          free: true,
          certified: false,
          url: 'https://docs.ros.org/en/humble/',
        },
      ],
    },
    {
      title: 'Microcontrollers to ROS: micro-ROS',
      status: 'active',
      modules: [
        {
          title: 'micro-ROS on Embedded Microcontrollers',
          provider: 'micro-ROS Project',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://micro.ros.org/',
        },
      ],
    },
    {
      title: 'Kinematics & Nav2 Navigation Stack',
      status: 'locked',
      modules: [
        {
          title: 'Gazebo Physics Simulation & Navigation 2',
          provider: 'Open Robotics',
          hours: 35,
          free: true,
          certified: false,
          url: 'https://gazebosim.org/',
        },
      ],
    },
  ],
};

export const ROADMAP_KICAD_PCB: RoadmapView = {
  slug: 'kicad-pcb-design',
  title: 'KiCad Schematic & Multi-Layer PCB Design',
  track: 'make',
  level: 'intermediate',
  summary:
    'Design professional 2-to-4 layer PCBs from schematic capture to differential pair routing, ground plane management, and Gerber fabrication outputs.',
  hours: 65,
  learners: 980,
  stages: [
    {
      title: 'Schematic Capture & Component Selection',
      status: 'done',
      modules: [
        {
          title: 'KiCad Getting Started & Schematic Capture Guide',
          provider: 'KiCad Project',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://www.kicad.org/',
        },
      ],
    },
    {
      title: 'Multi-layer Routing & Design Rules',
      status: 'active',
      modules: [
        {
          title: 'High-Speed Layout & Impedance Control',
          provider: "Phil's Lab",
          hours: 25,
          free: true,
          certified: false,
          url: 'https://www.kicad.org/help/tutorials/',
        },
      ],
    },
    {
      title: 'DFM & SMT Assembly Fabrication',
      status: 'locked',
      modules: [
        {
          title: 'Design for Manufacturing & IPC-2221 Standards',
          provider: 'NPTEL',
          hours: 15,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
  ],
};

/* =========================================================================
   3. DESIGN TRACK
   ========================================================================= */

export const ROADMAP_PRODUCT_DESIGN: RoadmapView = {
  slug: 'product-design-foundations',
  title: 'Product & Accessibility Design Foundations',
  track: 'design',
  level: 'intermediate',
  summary:
    'Human-centred design systems, accessibility standards (WCAG 2.2), tactile affordances, and Figma to production handoff.',
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
          hours: 20,
          free: true,
          certified: false,
          url: 'https://ocw.mit.edu',
        },
        {
          title: 'Material Design 3 Architecture & Elevation Tokens',
          provider: 'Google Design',
          hours: 10,
          free: true,
          certified: false,
          url: 'https://m3.material.io/',
        },
      ],
    },
    {
      title: 'Universal Design & Assistive Accessibility',
      status: 'active',
      modules: [
        {
          title: 'Web Content Accessibility Guidelines (WCAG 2.2)',
          provider: 'W3C / WAI',
          hours: 15,
          free: true,
          certified: false,
          url: 'https://www.w3.org/WAI/',
        },
        {
          title: 'Interaction Design & Accessible Interfaces',
          provider: 'NPTEL',
          hours: 15,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
  ],
};

export const ROADMAP_CAD_ENCLOSURES: RoadmapView = {
  slug: 'mechanical-cad-and-enclosures',
  title: 'Parametric 3D CAD & Hardware Enclosures',
  track: 'design',
  level: 'beginner',
  summary:
    'Design rugged hardware enclosures, snap-fit latches, and custom mounting brackets for 3D printing and CNC milling using open-source FreeCAD.',
  hours: 50,
  learners: 720,
  stages: [
    {
      title: 'Sketcher & Parametric Part Design',
      status: 'done',
      modules: [
        {
          title: 'FreeCAD Part Design & Constrained Sketching',
          provider: 'FreeCAD Project',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://wiki.freecad.org/Main_Page',
        },
      ],
    },
    {
      title: 'Enclosure Tolerances & 3D Print Preparation',
      status: 'active',
      modules: [
        {
          title: 'Snap-fits, Tolerances & Rapid Prototyping',
          provider: 'FreeCAD Project',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://wiki.freecad.org/Tutorials',
        },
      ],
    },
  ],
};

/* =========================================================================
   4. RESEARCH TRACK
   ========================================================================= */

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

export const ROADMAP_DEEP_LEARNING_TINYML: RoadmapView = {
  slug: 'deep-learning-and-tinyml',
  title: 'Deep Learning, Transformers & Edge TinyML',
  track: 'research',
  level: 'intermediate',
  summary:
    'Train and fine-tune open-weight deep neural networks, quantize transformer models, and deploy INT8 computer vision on sub-$5 edge microcontrollers.',
  hours: 110,
  learners: 2150,
  stages: [
    {
      title: 'Machine Learning Foundations',
      status: 'done',
      modules: [
        {
          title: 'CS229: Machine Learning Lecture Notes',
          provider: 'Stanford University',
          hours: 35,
          free: true,
          certified: false,
          url: 'https://cs229.stanford.edu/',
        },
      ],
    },
    {
      title: 'Deep Learning with PyTorch',
      status: 'active',
      modules: [
        {
          title: 'Practical Deep Learning for Coders',
          provider: 'Fast.ai',
          hours: 45,
          free: true,
          certified: false,
          url: 'https://course.fast.ai/',
        },
      ],
    },
    {
      title: 'Open Transformers & Edge Quantization',
      status: 'locked',
      modules: [
        {
          title: 'Hugging Face Open Source LLM & Transformers Course',
          provider: 'Hugging Face',
          hours: 30,
          free: true,
          certified: true,
          url: 'https://huggingface.co/learn',
        },
      ],
    },
  ],
};

/* =========================================================================
   5. EARN TRACK
   ========================================================================= */

export const ROADMAP_OPEN_SOURCE_LEADERSHIP: RoadmapView = {
  slug: 'open-source-squad-leadership',
  title: 'Open-Source Squad Leadership & Grants',
  track: 'earn',
  level: 'intermediate',
  summary:
    'Assemble multi-disciplinary squads, conduct transparent sprint planning, manage RFCs, and secure micro-grants from open-source foundations.',
  hours: 40,
  learners: 950,
  stages: [
    {
      title: 'Startup Principles for Open Builders',
      status: 'done',
      modules: [
        {
          title: 'Startup School for Builders',
          provider: 'Y Combinator',
          hours: 25,
          free: true,
          certified: true,
          url: 'https://www.startupschool.org/',
        },
      ],
    },
    {
      title: 'Open Source Community Stewardship',
      status: 'active',
      modules: [
        {
          title: 'Building Welcoming Open Source Communities',
          provider: 'GitHub Guides',
          hours: 15,
          free: true,
          certified: false,
          url: 'https://opensource.guide/how-to-contribute/',
        },
      ],
    },
  ],
};

export const ROADMAP_BOUNTY_ENGINEERING: RoadmapView = {
  slug: 'bounty-engineering-and-protocols',
  title: 'Bounty Engineering & Digital Public Infrastructure',
  track: 'earn',
  level: 'intermediate',
  summary:
    'Solve funded protocol bounties, build verified adapters on open protocols (ONDC, Beckn), and earn through milestone delivery.',
  hours: 55,
  learners: 1320,
  stages: [
    {
      title: 'Decentralized Protocol Specifications',
      status: 'done',
      modules: [
        {
          title: 'Beckn Protocol Developer Academy',
          provider: 'Beckn Foundation',
          hours: 30,
          free: true,
          certified: false,
          url: 'https://becknprotocol.io/',
        },
      ],
    },
    {
      title: 'Digital Commerce & India Stack Integrations',
      status: 'active',
      modules: [
        {
          title: 'ONDC Developer Knowledge Base & Sandbox',
          provider: 'ONDC India',
          hours: 25,
          free: true,
          certified: false,
          url: 'https://ondc.org/',
        },
      ],
    },
  ],
};

/* =========================================================================
   6. LEARN TRACK
   ========================================================================= */

export const ROADMAP_SYSTEMS_ENGINEERING: RoadmapView = {
  slug: 'systems-engineering-and-architecture',
  title: 'Systems Engineering & Fault Tolerance',
  track: 'learn',
  level: 'advanced',
  summary:
    'Master high-reliability architecture, failover state machines, telemetry feedback loops, and root-cause failure analysis across hardware and software.',
  hours: 60,
  learners: 780,
  stages: [
    {
      title: 'Systems Architecture & Requirements Modeling',
      status: 'done',
      modules: [
        {
          title: 'Engineering Systems: Concepts, Principles, and Practice',
          provider: 'MIT OpenCourseWare',
          hours: 35,
          free: true,
          certified: false,
          url: 'https://ocw.mit.edu',
        },
      ],
    },
    {
      title: 'Fault Tolerance & Reliability Analysis',
      status: 'active',
      modules: [
        {
          title: 'System Reliability Engineering & FMEA',
          provider: 'NPTEL',
          hours: 25,
          free: true,
          certified: true,
          url: 'https://nptel.ac.in',
        },
      ],
    },
  ],
};

export const ROADMAP_META_LEARNING: RoadmapView = {
  slug: 'meta-learning-for-engineers',
  title: 'Meta-Learning & Cognitive Mastery for Builders',
  track: 'learn',
  level: 'beginner',
  summary:
    'Learn cognitive models for rapid deep-tech skill acquisition: chunking, deliberate practice, Feynman explanation technique, and debugging psychology.',
  hours: 30,
  learners: 1640,
  stages: [
    {
      title: 'Cognitive Science of Technical Mastery',
      status: 'done',
      modules: [
        {
          title: 'Learning How to Learn: Powerful Mental Tools',
          provider: 'Deep Teaching Solutions / Coursera',
          hours: 15,
          free: true,
          certified: true,
          url: 'https://www.coursera.org',
        },
      ],
    },
    {
      title: 'Computational Thinking & First Principles',
      status: 'active',
      modules: [
        {
          title: 'Computing & Information Theory',
          provider: 'Khan Academy',
          hours: 15,
          free: true,
          certified: false,
          url: 'https://www.khanacademy.org/',
        },
      ],
    },
  ],
};

export const ROADMAP_EXPORT_COMPLIANCE: RoadmapView = {
  slug: 'export-compliance-and-global-trade',
  title: 'India-to-World Export, Customs, BIS/CE & Margin Engineering',
  track: 'earn',
  level: 'beginner',
  summary:
    'Go from local MSME shopfloor to container/air-cargo exports: IEC & AD Code, RoDTEP duty drawbacks, LUT zero-rated GST, Incoterms 2020 (EXW/FOB/CIF/DDP), and BIS/NABL-to-CE/FCC certification.',
  hours: 45,
  learners: 2140,
  stages: [
    {
      title: 'DGFT Registrations, HSN Coding & RoDTEP Incentives',
      status: 'done',
      modules: [
        {
          title: 'DGFT Niryat Bandhu: Export Onboarding, IEC & ITC-HS Codes',
          provider: 'DGFT Govt of India (100% Free)',
          hours: 15,
          free: true,
          certified: true,
          url: 'https://www.dgft.gov.in',
        },
        {
          title: 'Indian Trade Portal: Corridor Tariffs & FTA Rules of Origin',
          provider: 'FIEO / Dept. of Commerce',
          hours: 10,
          free: true,
          certified: false,
          url: 'https://www.indiantradeportal.in',
        },
      ],
    },
    {
      title: 'CE, FCC, REACH & Buyer PPAP Certification Readiness',
      status: 'active',
      modules: [
        {
          title: 'NABL Accredited Lab Bridging & EU REACH / RoHS Compliance Guide',
          provider: 'QCI / EEPC India',
          hours: 20,
          free: true,
          certified: false,
          url: 'https://nabl-india.org',
        },
      ],
    },
  ],
};

export const ROADMAP_VERNACULAR_DPI_ONDC: RoadmapView = {
  slug: 'india-dpi-ondc-bhashini-ai',
  title: 'India Stack, ONDC Beckn Protocol & Bhashini Voice AI',
  track: 'code',
  level: 'beginner',
  summary:
    'Build billion-scale inclusive software: Bhashini ULCA Indic ASR/TTS APIs, Beckn/ONDC open commerce protocols, UPI deep-links, and edge quantized AI models for rural India.',
  hours: 65,
  learners: 2680,
  stages: [
    {
      title: 'India Digital Public Infrastructure & Beckn Open Protocols',
      status: 'done',
      modules: [
        {
          title: 'ONDC Academy: Seller & Logistics Protocol Builder Track',
          provider: 'ONDC Academy (Free)',
          hours: 20,
          free: true,
          certified: true,
          url: 'https://academy.ondc.org',
        },
        {
          title: 'Beckn Protocol Sandbox & Open Commerce Schemas',
          provider: 'Beckn Foundation',
          hours: 15,
          free: true,
          certified: false,
          url: 'https://becknprotocol.io',
        },
      ],
    },
    {
      title: 'Indic Speech & Regional-Language AI Applications',
      status: 'active',
      modules: [
        {
          title: 'Bhashini ULCA Pipeline & AI4Bharat Open Models',
          provider: 'Digital India Bhashini / IIT Madras',
          hours: 30,
          free: true,
          certified: false,
          url: 'https://bhashini.gov.in',
        },
      ],
    },
  ],
};

export const ROADMAP_AGRI_COLDCHAIN_FOOD: RoadmapView = {
  slug: 'agri-coldchain-food-processing',
  title: 'Agri Food-Processing, FSSAI, Solar Cold-Chain & Value-Add',
  track: 'make',
  level: 'beginner',
  summary:
    'Turn raw Indian harvest (spices, fruits, dairy, millets, marine catch) into shelf-stable, APEDA/USFDA-compliant export SKUs using solar dehydrators, clean packaging, and IoT monitoring.',
  hours: 50,
  learners: 1490,
  stages: [
    {
      title: 'Food Safety, Shelf-Life Science & PMFME Subsidy Prep',
      status: 'done',
      modules: [
        {
          title: 'PMFME Micro Food Processing & FSSAI Hygiene Standards',
          provider: 'MoFPI / NIFTEM Kundli (Free)',
          hours: 20,
          free: true,
          certified: true,
          url: 'https://pmfme.mofpi.gov.in',
        },
      ],
    },
    {
      title: 'Solar Dehydration, Cold Storage & Traceable Packaging',
      status: 'active',
      modules: [
        {
          title: 'Post-Harvest Cold-Chain & APEDA Export Residue Norms',
          provider: 'CSIR-CFTRI / APEDA',
          hours: 30,
          free: true,
          certified: false,
          url: 'https://apeda.gov.in',
        },
      ],
    },
  ],
};

export const ROADMAP_TEXTILES_GI_EXPORTS: RoadmapView = {
  slug: 'technical-textiles-gi-crafts-export',
  title: 'Technical Textiles, Zero-Defect Looms & Heritage GI Craft Export',
  track: 'design',
  level: 'beginner',
  summary:
    'Modernize apparel, technical fabrics, bamboo/wood products, and Geographical Indication (GI) artisan clusters to win European, US, and GCC wholesale orders.',
  hours: 48,
  learners: 1320,
  stages: [
    {
      title: 'Material Testing, Sustainable Dyeing & GI Authentication',
      status: 'done',
      modules: [
        {
          title: 'ATIRA & NITRA Textile Quality, GSM & Tensile Testing Primer',
          provider: 'Ministry of Textiles / NTTM',
          hours: 22,
          free: true,
          certified: false,
          url: 'https://nttm.texmin.gov.in',
        },
      ],
    },
    {
      title: 'Export Tech Packs, OEKO-TEX / REACH & Global D2C Cataloging',
      status: 'active',
      modules: [
        {
          title: 'EPCH & ODOP Craft-to-Global Export Packaging & B2B Specs',
          provider: 'EPCH / ODOP India',
          hours: 26,
          free: true,
          certified: false,
          url: 'https://www.epch.in',
        },
      ],
    },
  ],
};

/* =========================================================================
   ALL ROADMAPS EXPORT
   ========================================================================= */

export const ALL_ROADMAPS: RoadmapView[] = [
  // Code
  ROADMAP_FULL_STACK,
  ROADMAP_RUST_SYSTEMS,
  ROADMAP_VERNACULAR_DPI_ONDC,
  // Make
  ROADMAP_EMBEDDED,
  ROADMAP_ROBOTICS_ROS2,
  ROADMAP_KICAD_PCB,
  ROADMAP_AGRI_COLDCHAIN_FOOD,
  // Design
  ROADMAP_PRODUCT_DESIGN,
  ROADMAP_CAD_ENCLOSURES,
  ROADMAP_TEXTILES_GI_EXPORTS,
  // Research
  ROADMAP_CUBESAT,
  ROADMAP_DEEP_LEARNING_TINYML,
  // Earn
  ROADMAP_OPEN_SOURCE_LEADERSHIP,
  ROADMAP_BOUNTY_ENGINEERING,
  ROADMAP_EXPORT_COMPLIANCE,
  // Learn
  ROADMAP_SYSTEMS_ENGINEERING,
  ROADMAP_META_LEARNING,
];
