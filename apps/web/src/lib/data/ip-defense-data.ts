import type { DefensivePublication, HardwareLicense, InventionCategory } from '@hackerland/core';

export const IP_DEFENSE_PUBLICATIONS: DefensivePublication[] = [
  {
    id: 'ip-led-2026-0814',
    title: 'Decentralized CAN-FD Active Cell Balancing BMS Architecture with Dual-Slope Opto-Isolation',
    inventor: {
      name: 'Dr. Anand Srinivas & Team Chimera',
      handle: 'chimera_ev',
      organization: 'RVCE Team Chimera EV Garage, Bengaluru',
      verifiedKycOrEmail: true,
    },
    category: 'clean_mobility_bms',
    hardwareLicense: 'CERN-OHL-P-2.0',
    firstPublicDisclosureDate: '2026-08-14T09:15:00Z',
    timestampProof: {
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '7d793037a0760186574b0282f2f435e7b1e516b9cfba8feda31f1f9d486f06cf',
      gitCommitHash: '9a3b8f2d1e04b4c7987e9123456789abcdef0123',
      blockHeight: 894120,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCB',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['H01M 10/44', 'G01R 31/36', 'B60L 58/10'],
    abstractSummary:
      'A high-efficiency non-dissipative active cell balancing architecture transferring excess electrical charge directly between any two series-connected lithium-ion cells without dumping energy as heat into balancing resistors. Interconnected via galvanically isolated CAN-FD bus packets operating under harsh ambient thermal conditions.',
    novelMechanisms: [
      'Sub-millisecond capacitive-inductive flyback bridge capable of transferring 2.5A continuous balancing current between disparate cell pairs with >93% conversion efficiency.',
      'Isolated differential CAN-FD communication frame with CRC-17 error trapping, immunity to >25kV/µs transient common-mode noise during motor regenerative braking.',
      'Automated dynamic duty-cycle modulation algorithm executing on STM32G4 microcontroller preventing core saturation across extreme Indian ambient temperature gradients (-10°C to +55°C).',
    ],
    priorArtCitations: [
      {
        title: 'Passive resistor bleed balancing circuits in EV packs',
        patentOrPaperId: 'US8921500B2',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike US8921500B2 which dissipates excess cell energy as heat through 33-ohm power resistors, this invention captures and transfers >92% of excess energy to the weakest cell.',
      },
      {
        title: 'Multi-winding transformer cell balancing network',
        patentOrPaperId: 'WO2019087123A1',
        jurisdiction: 'wipo_pct',
        distinctionSummary:
          'Unlike centralized multi-winding transformers with high leakage inductance, our architecture uses distributed low-cost individual SMD planar coupled inductors on each module board.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_schematic_bms',
        artifactType: 'schematic_pdf',
        fileName: 'rvce-chimera-bms-schematic-v2.1.pdf',
        fileSizeBytes: 2489120,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        downloadUrl: 'https://cdn.hackerland.in/ip/rvce-bms-schematic-v2.1.pdf',
      },
      {
        id: 'art_gerber_bms',
        artifactType: 'gerber_zip',
        fileName: 'rvce-chimera-bms-gerber-4layer-rs274x.zip',
        fileSizeBytes: 5892100,
        sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        downloadUrl: 'https://cdn.hackerland.in/ip/rvce-bms-gerbers.zip',
      },
      {
        id: 'art_firmware_bms',
        artifactType: 'firmware_c',
        fileName: 'chimera_active_balancer_hal_stm32g4.c',
        fileSizeBytes: 42100,
        sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        downloadUrl: 'https://cdn.hackerland.in/ip/chimera_balancer.c',
      },
    ],
    nonAggressionPledgeSigned: true,
  },
  {
    id: 'ip-led-2026-0422',
    title: 'Autonomous Tilt-Rotor UAV Magnetic Cargo Latch with Dual-Stage Redundant Hall Verification',
    inventor: {
      name: 'Arjun Varma & AeroGlide Squad',
      handle: 'aeroglide_team',
      organization: 'Maker Village Kochi, Kerala',
      verifiedKycOrEmail: true,
    },
    category: 'avionics_aerospace',
    hardwareLicense: 'CERN-OHL-W-2.0',
    firstPublicDisclosureDate: '2026-04-22T14:45:00Z',
    timestampProof: {
      sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      merkleRoot: '2c624232cdd221771294dfbb310aca000a0df6ac9b66bbd857a22a36b9900c6d',
      gitCommitHash: '6f8902c5e4d1b8a9203948572910394857291039',
      blockHeight: 878340,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCC',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['B64C 27/28', 'B64U 10/20', 'B64D 1/02'],
    abstractSummary:
      'An ultra-lightweight electromagnetic electro-permanent release mechanism designed for last-mile medical delivery drones that requires zero electrical power in the latched holding state and releases cargo within 12 milliseconds upon a bipolar capacitive discharge pulse.',
    novelMechanisms: [
      'Alnico and NdFeB composite magnet assembly requiring zero static holding current while maintaining 450N payload holding force.',
      'Dual differential Hall effect sensors detecting 0.1mm cargo latch mechanical detachment before flight command initiation.',
      'Reverse-polarity energy recuperation circuit suppressing inductive flyback spikes to <18V to safeguard avionics flight controllers.',
    ],
    priorArtCitations: [
      {
        title: 'Solenoid release hooks for drone payload delivery',
        patentOrPaperId: 'US10457388B2',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike US10457388B2 which draws continuous 2.2A current to maintain magnetic lock, our electro-permanent system consumes zero current while in flight.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_cad_latch',
        artifactType: 'step_cad',
        fileName: 'aeroglide-magnetic-latch-assembly-rev4.step',
        fileSizeBytes: 8492000,
        sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        downloadUrl: 'https://cdn.hackerland.in/ip/aeroglide-latch.step',
      },
      {
        id: 'art_schematic_latch',
        artifactType: 'schematic_pdf',
        fileName: 'aeroglide-pulse-discharge-circuit.pdf',
        fileSizeBytes: 1205000,
        sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        downloadUrl: 'https://cdn.hackerland.in/ip/aeroglide-circuit.pdf',
      },
    ],
    nonAggressionPledgeSigned: true,
  },
  {
    id: 'ip-led-2026-0119',
    title: 'Multi-Depth Soil Dielectric Permittivity Probe with Interleaved Guard Ring Electrodes',
    inventor: {
      name: 'Dr. K. Radhakrishnan & Open Agritech Collective',
      handle: 'kisansense',
      organization: 'IIT Dharwad Agritech Center',
      verifiedKycOrEmail: true,
    },
    category: 'climatetech_agri',
    hardwareLicense: 'TAPR-OHL-1.0',
    firstPublicDisclosureDate: '2026-01-19T11:20:00Z',
    timestampProof: {
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
      gitCommitHash: '5e884898da28047151d0e56f8dc6292773603d0d',
      blockHeight: 864500,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCD',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['G01N 27/22', 'A01G 25/16', 'G01R 27/26'],
    abstractSummary:
      'A low-cost, immersion-gold PCB soil moisture and salinity sensor utilizing high-frequency 100MHz fringing field capacitive measurement with coaxial guard rings that eliminate parasitic soil cable capacitance and ion polarization errors.',
    novelMechanisms: [
      'Active 100MHz unity-gain op-amp guard ring driven at identical potential to sensing trace, attenuating parasitic cable shunt capacitance by >38dB.',
      'Interleaved interdigital copper traces coated in ENIG with 100µm solder mask insulation resistant to soil acidification across pH 4.0 to 9.5.',
      'Integrated temperature-compensating thermistor embedded in copper ground pour within 2mm of capacitive fringing field.',
    ],
    priorArtCitations: [
      {
        title: 'Time-domain reflectometry (TDR) rod probes',
        patentOrPaperId: 'US5444457A',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike expensive high-voltage pulse TDR waveguides costing >$400, this fringing capacitive design is manufactured on standard 2-layer FR4 PCB costing <$2.50 in volume.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_kicad_probe',
        artifactType: 'gerber_zip',
        fileName: 'kisansense-soil-probe-v1.4-gerbers.zip',
        fileSizeBytes: 3120000,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        downloadUrl: 'https://cdn.hackerland.in/ip/kisansense-gerber.zip',
      },
    ],
    nonAggressionPledgeSigned: true,
  },
  {
    id: 'ip-led-2026-0905',
    title: 'High-CMRR Dual-Wavelength Photoplethysmography (PPG) Analog Front-End with Hardware Ambient Light Cancellation',
    inventor: {
      name: 'Priya Sundaram & Saathi Health Lab',
      handle: 'saathi_voice',
      organization: 'AIIMS New Delhi & IIT Delhi',
      verifiedKycOrEmail: true,
    },
    category: 'biomedical_diagnostics',
    hardwareLicense: 'CERN-OHL-S-2.0',
    firstPublicDisclosureDate: '2026-09-05T16:00:00Z',
    timestampProof: {
      sha256Hash: '1a79a4d60de6718e8e5b326e338ae533fb61007706c8ca66f4e1f574768393e8',
      merkleRoot: '9f83c605d4a85b671d1e44f123456789abcdef0123456789abcdef0123456789',
      gitCommitHash: '11223344556677889900aabbccddeeff00112233',
      blockHeight: 897600,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCE',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['A61B 5/1455', 'A61B 5/024', 'H03F 3/45'],
    abstractSummary:
      'An open-source medical-grade pulse oximeter and perfusion index analog front-end featuring correlated double sampling and analog subtractive ambient photodiode current cancellation, capable of measuring arterial pulse waveforms under direct sunlight (100,000 lux).',
    novelMechanisms: [
      'Synchronous demodulation transimpedance amplifier using switched-capacitor charge subtraction to reject up to 150µA of direct sunlight DC photodiode current before first-stage amplification.',
      'Low-noise JFET input stage achieving input-referred noise <15 pA_rms over a 0.5 Hz to 20 Hz physiological band.',
      'Dual-wavelength 660nm (Red) and 940nm (IR) H-bridge drive circuit with programmable current compliance from 1mA to 50mA.',
    ],
    priorArtCitations: [
      {
        title: 'Ambient light cancellation in clinical pulse oximeters',
        patentOrPaperId: 'US6011986A',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike US6011986A requiring proprietary mixed-signal ASIC silicon, our open circuit achieves identical 110dB CMRR using generic off-the-shelf COTS operational amplifiers and analog switches.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_schematic_ppg',
        artifactType: 'schematic_pdf',
        fileName: 'saathi-afe-schematic-rev3.pdf',
        fileSizeBytes: 1845000,
        sha256Hash: '1a79a4d60de6718e8e5b326e338ae533fb61007706c8ca66f4e1f574768393e8',
        downloadUrl: 'https://cdn.hackerland.in/ip/saathi-afe.pdf',
      },
    ],
    nonAggressionPledgeSigned: true,
  },
  {
    id: 'ip-led-2026-0311',
    title: 'Backlash-Free Dual-Stage Cycloidal Speed Reducer with Eccentric Bearing Needle Rollers',
    inventor: {
      name: 'Prof. Jayant Kulkarni & Robotics Team',
      handle: 'coep_robotics',
      organization: 'COEP Technological University, Pune',
      verifiedKycOrEmail: true,
    },
    category: 'robotics_actuation',
    hardwareLicense: 'CERN-OHL-P-2.0',
    firstPublicDisclosureDate: '2026-03-11T12:00:00Z',
    timestampProof: {
      sha256Hash: '2b88fede3e5b61e89f81a7b123456789abcdef0123456789abcdef0123456789',
      merkleRoot: '11223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff',
      gitCommitHash: 'aa11bb22cc33dd44ee55ff667788990011223344',
      blockHeight: 871200,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCF',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['F16H 1/32', 'B25J 9/10', 'F16H 55/17'],
    abstractSummary:
      'A compact, 3D printable and desktop-CNC machinable 40:1 cycloidal gear reducer for robotic joint actuators with dual 180-degree out-of-phase cycloidal discs and needle roller pins that eliminates rotational backlash (<1 arc-minute) without precision ground helical gears.',
    novelMechanisms: [
      'Compound epicycloid profile generated via parameterized mathematical curves allowing standard 3D printed PETG-CF or Delrin discs to distribute tooth loads across 8 simultaneous pin contacts.',
      'Integrated cross-roller output bearing race machined directly into the aluminium housing cover to withstand 120 Nm peak bending moments.',
    ],
    priorArtCitations: [
      {
        title: 'Cycloidal speed reducers with single disc design',
        patentOrPaperId: 'US4672867A',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike US4672867A which suffers severe radial vibration imbalances at high speeds, our dual 180° opposed discs completely neutralize eccentric radial centrifugal forces.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_step_cycloidal',
        artifactType: 'step_cad',
        fileName: 'coep-cycloidal-reducer-40to1.step',
        fileSizeBytes: 14200000,
        sha256Hash: '2b88fede3e5b61e89f81a7b123456789abcdef0123456789abcdef0123456789',
        downloadUrl: 'https://cdn.hackerland.in/ip/coep-cycloidal.step',
      },
    ],
    nonAggressionPledgeSigned: true,
  },
  {
    id: 'ip-led-2026-0703',
    title: '8-Bit Integer Matrix Multiply Vector Coprocessor for 130nm Open Silicon Shuttles',
    inventor: {
      name: 'Open Silicon India Shuttles & IIT Madras Alumni',
      handle: 'opensilicon_in',
      organization: 'Open Silicon Initiative India',
      verifiedKycOrEmail: true,
    },
    category: 'open_silicon_asic',
    hardwareLicense: 'Apache-2.0',
    firstPublicDisclosureDate: '2026-07-03T18:30:00Z',
    timestampProof: {
      sha256Hash: '3c99a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abc',
      merkleRoot: 'aabbccddeeff001122334455667788990011223344556677889900aabbccddeeff',
      gitCommitHash: 'ff99887766554433221100ffeeddccbbaa998877',
      blockHeight: 888900,
      rfc3161TimestampToken: 'MIIB/AYJKoZIhvcNAQcCoIIB7TCCAekCAQMxDzANBglghkgBZQMEAgEFADCG',
      publicNotaryService: 'Hackerland IP Defense Notary & Bitcoin OP_RETURN Anchor',
    },
    ipcClasses: ['G06F 17/16', 'G06N 3/063', 'G06F 9/30'],
    abstractSummary:
      'An open-source hardware systolic array accelerator targeting edge neural network inference, synthesized and verified on SkyWater 130nm PDK using open-source OpenLane/OpenROAD ASIC flow, delivering 12.8 GOPs at 100MHz within 0.8 mm² silicon area.',
    novelMechanisms: [
      'Weight-stationary 4x4 systolic matrix multiplier cell topology with asynchronous clock gating on zero-valued activation operands to reduce dynamic switching power by 34%.',
      'Wishbone B4 bus interface with DMA burst mode enabling direct SRAM-to-register streaming without host CPU intervention.',
    ],
    priorArtCitations: [
      {
        title: 'Systolic array matrix processor architecture',
        patentOrPaperId: 'US9396435B2',
        jurisdiction: 'uspto',
        distinctionSummary:
          'Unlike US9396435B2 which claims monolithic tensor cores in proprietary 7nm nodes, this design is fully synthesizable on open 130nm process design kits with 100% open EDA tools.',
      },
    ],
    openArtifacts: [
      {
        id: 'art_verilog_tpu',
        artifactType: 'firmware_c',
        fileName: 'systolic_matmul_130nm.v',
        fileSizeBytes: 98000,
        sha256Hash: '3c99a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abc',
        downloadUrl: 'https://cdn.hackerland.in/ip/systolic_matmul.v',
      },
    ],
    nonAggressionPledgeSigned: true,
  },
];

export function getDefensivePublicationById(id: string): DefensivePublication | undefined {
  return IP_DEFENSE_PUBLICATIONS.find((p) => p.id === id);
}

export function getAllDefensivePublicationIds(): string[] {
  return IP_DEFENSE_PUBLICATIONS.map((p) => p.id);
}
