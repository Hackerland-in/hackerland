import type { ComplianceRoadmapItem } from '@hackerland/core';

export const COMPLIANCE_ROADMAPS: ComplianceRoadmapItem[] = [
  {
    id: 'comp_dgca_drone',
    slug: 'dgca-drone-type-certification',
    title: 'DGCA Commercial Drone Type Certification',
    productCategory: 'drone_uav',
    tagline: 'Mandatory Rule 8 & 9 compliance under Drone Rules 2021 for agricultural sprayers & commercial UAVs',
    description:
      'Statutory airworthiness and design certification required by the Directorate General of Civil Aviation (DGCA) before any drone can be commercially sold, registered on DigitalSky, or flown for mapping/spraying in India. Requires comprehensive structural load analysis, fail-safe Return-to-Launch validation, and full EMI/EMC chamber immunity.',
    statutoryBodies: ['dgca_type', 'wpc_eta', 'bis_crs'],
    applicableStandards: [
      {
        code: 'Drone Rules 2021 (Rule 8 & 9)',
        name: 'Certification of Drone Type and Quality Standards',
        body: 'dgca_type',
        mandatory: true,
        description: 'Statutory compliance baseline published by Ministry of Civil Aviation.',
        testParameters: [
          'Fail-safe autonomous Return-to-Launch on lost command link (C2 link loss)',
          'Structural factor of safety 1.5x at maximum take-off weight (MTOW)',
          'Geofencing compliance with DigitalSky Yellow and Red Zone boundaries',
          'Flight termination system / emergency rotor motor cutoff within 250ms',
        ],
      },
      {
        code: 'IS 16046 (Part 2):2018',
        name: 'Secondary Lithium Cells & Batteries Safety',
        body: 'bis_crs',
        mandatory: true,
        description: 'Mandatory battery safety certification for high-capacity 6S/12S drone flight packs.',
        testParameters: [
          'External short-circuit at 55°C',
          'Overcharge and forced discharge thermal limit',
          'Vibration and mechanical drop from 1.0 meter',
        ],
      },
      {
        code: 'WPC ETA (GSR 564(E))',
        name: 'Equipment Type Approval for 2.4 GHz & 5.8 GHz telemetry',
        body: 'wpc_eta',
        mandatory: true,
        description: 'Radio equipment approval for C2 command telemetry and digital video transmitters.',
        testParameters: [
          'Conducted RF output power (< 1 Watt EIRP on 2.4 GHz)',
          'Occupied bandwidth and unwanted harmonic emissions',
        ],
      },
    ],
    mandatoryGovtPortals: [
      {
        name: 'DigitalSky Platform',
        url: 'https://digitalsky.dgca.gov.in',
        department: 'Directorate General of Civil Aviation (MoCA)',
      },
      {
        name: 'Saral Sanchar Portal',
        url: 'https://saralsanchar.gov.in',
        department: 'Wireless Planning & Coordination (DoT)',
      },
      {
        name: 'BIS CRS Portal',
        url: 'https://www.crsbis.in',
        department: 'Bureau of Indian Standards (MeitY)',
      },
    ],
    sampleUnitsTotal: 2,
    estimatedTotalTestingCostInr: {
      minInr: 380000,
      maxInr: 550000,
    },
    estimatedTimelineWeeks: {
      minWeeks: 12,
      maxWeeks: 18,
    },
    penaltiesForNonCompliance:
      'Confiscation of drone airframe, grounding under Aircraft Act 1934 Section 10(2), and compounding fine of ₹1,00,000 under Rule 49 of Drone Rules 2021 per unauthorized flight.',
    recommendedLabs: [
      {
        labName: 'SAMEER Centre for Electromagnetics',
        nablAccreditationNo: 'TC-5432',
        city: 'Chennai',
        state: 'Tamil Nadu',
        estimatedCostInr: 210000,
        estimatedLeadTimeWeeks: 5,
        sampleUnitsRequired: 1,
        testsCovered: [
          '10m Semi-Anechoic RF Radiated Emissions (CISPR 32)',
          'RF Immunity against high-voltage transmission lines (IEC 61000-4-3)',
          'Electrostatic Discharge (ESD 8kV contact / 15kV air)',
        ],
      },
      {
        labName: 'CSIR-NAL (National Aerospace Laboratories)',
        nablAccreditationNo: 'TC-7811',
        city: 'Bengaluru',
        state: 'Karnataka',
        estimatedCostInr: 190000,
        estimatedLeadTimeWeeks: 6,
        sampleUnitsRequired: 1,
        testsCovered: [
          'Flight test dynamic telemetry audit (20 hours continuous)',
          'Wind tunnel aerodynamic stability at 15 m/s gust',
          'Rotor arm carbon-fiber deflection static load bench',
        ],
      },
    ],
    preComplianceChecklist: [
      {
        id: 'chk_c2_link',
        task: 'Validate automated Return-To-Launch on C2 link loss within 3 seconds',
        critical: true,
        tip: 'In ArduPilot or PX4, configure FS_GCS_ENABLE=1 and ensure RTL altitude is set above local obstacle height.',
      },
      {
        id: 'chk_geofence',
        task: 'Implement hardware geofence lockout for DigitalSky Red Zone airspaces',
        critical: true,
        tip: 'Integrate the Indian airspace polygon geoJSON with active GPS lock pre-arm check.',
      },
      {
        id: 'chk_emi_rf',
        task: 'Conduct near-field sniffer pre-scan around ESC motor wiring harness',
        critical: true,
        tip: 'Switching ringing on 50V battery lines can radiate broadband noise that fails CISPR 32 radiated limits.',
      },
      {
        id: 'chk_flight_log',
        task: 'Prepare 10-hour flight log demonstrating zero uncommanded yaw or pitch drift',
        critical: false,
        tip: 'Export ULog / MAVLink bin logs with attitude vibration metrics (accel clipping < 10 events).',
      },
    ],
    documentationRequirements: [
      'Form D-1 Type Certification application format with OEM DPIIT startup certificate',
      'Quality Manual meeting ISO 9001:2015 traceability requirements for batch assembly',
      'Complete bill of materials (BOM) with country-of-origin tags for all critical avionics',
      'Electrical schematic and power budget calculation under maximum motor stall current',
      'Flight manual and emergency emergency procedures checklist (Pilot Operating Handbook)',
    ],
  },
  {
    id: 'comp_ais156_bms',
    slug: 'ais156-ev-battery-pack',
    title: 'AIS-156 Phase 2 EV Battery Pack Safety Certification',
    productCategory: 'ev_powertrain',
    tagline: 'Statutory thermal runaway, nail penetration, and immersion safety for electric 2W & 3W battery packs',
    description:
      'Mandatory safety standard enforced by the Ministry of Road Transport and Highways (MoRTH) under Central Motor Vehicles Rules (CMVR). Enforces 5-minute pre-warning audio buzzers before thermal runaway, minimum 50mm cell spacing, IP67 dust/water immersion, and smart telemetry logging.',
    statutoryBodies: ['ais_automotive', 'wpc_eta'],
    applicableStandards: [
      {
        code: 'AIS-156 (Amendment 3 Phase 2)',
        name: 'Specific Requirements for L-Category Electric Power Train Vehicles',
        body: 'ais_automotive',
        mandatory: true,
        description: 'Mandatory EV battery pack standard testing thermal propagation and ingress.',
        testParameters: [
          'Single cell thermal runaway trigger test (minimum 5-minute evacuation warning)',
          'Active passive cell voltage delta monitoring (must trigger balancing at > 40mV)',
          'Mechanical shock at 50G and vibration sweep from 10Hz to 500Hz',
          'IP67 immersion test in 1-meter water column for 30 minutes',
          'Short circuit test with internal resistance < 5 milliohms',
        ],
      },
      {
        code: 'AIS-038 (Rev 2)',
        name: 'Electric Power Train Safety Requirements for M and N Category Vehicles',
        body: 'ais_automotive',
        mandatory: false,
        description: 'For four-wheeler commercial delivery EV vans.',
        testParameters: ['Overcharge protection and mechanical crush test'],
      },
    ],
    mandatoryGovtPortals: [
      {
        name: 'MoRTH VAHAN Portal',
        url: 'https://vahan.parivahan.gov.in',
        department: 'Ministry of Road Transport and Highways',
      },
      {
        name: 'ARAI Certification System',
        url: 'https://www.araiindia.com',
        department: 'Automotive Research Association of India',
      },
    ],
    sampleUnitsTotal: 3,
    estimatedTotalTestingCostInr: {
      minInr: 350000,
      maxInr: 520000,
    },
    estimatedTimelineWeeks: {
      minWeeks: 8,
      maxWeeks: 14,
    },
    penaltiesForNonCompliance:
      'Blacklisting of OEM on national VAHAN registry, prohibition of vehicle road registration, and mandatory vehicle recalls under Motor Vehicles Act Section 182A with fine up to ₹10 Lakhs per vehicle.',
    recommendedLabs: [
      {
        labName: 'ARAI (Automotive Research Association of India)',
        nablAccreditationNo: 'TC-5012',
        city: 'Pune',
        state: 'Maharashtra',
        estimatedCostInr: 280000,
        estimatedLeadTimeWeeks: 6,
        sampleUnitsRequired: 2,
        testsCovered: [
          'Thermal runaway propagation induction chamber test',
          'IP67 vacuum dust and pressurized water immersion',
          'Battery pack crush testing with hydraulic ram at 100 kN',
        ],
      },
      {
        labName: 'ICAT (International Centre for Automotive Technology)',
        nablAccreditationNo: 'TC-5198',
        city: 'Manesar (Gurugram)',
        state: 'Haryana',
        estimatedCostInr: 240000,
        estimatedLeadTimeWeeks: 5,
        sampleUnitsRequired: 1,
        testsCovered: [
          'Overcharge and overdischarge protection circuit trip test',
          'Electrical isolation resistance test (> 100 ohms/volt DC)',
          'Climatic thermal shock cycle (-20°C to +65°C)',
        ],
      },
    ],
    preComplianceChecklist: [
      {
        id: 'chk_thermal_precursor',
        task: 'Verify BMS triggers acoustic/visual warning 5 minutes prior to cell thermal runaway',
        critical: true,
        tip: 'Monitor $dT/dt$ rate of rise (> 1°C/sec) and individual cell voltage drop ($> 50mV$ under constant current).',
      },
      {
        id: 'chk_ip67_gasket',
        task: 'Conduct positive pressure bubble leak test on battery pack enclosure',
        critical: true,
        tip: 'Ensure silicone gasket has at least 30% compression with torque-controlled M4 fasteners every 40mm.',
      },
      {
        id: 'chk_fuse_rating',
        task: 'Verify pyrofuse or high-voltage DC fuse clears 500A prospective short within 10ms',
        critical: true,
        tip: 'Ensure fuse arc quenching voltage is rated for minimum 1.5x full pack nominal voltage.',
      },
      {
        id: 'chk_busbar_welding',
        task: 'Inspect laser or ultrasonic wire bonds with pull-force test (> 15 N per tap)',
        critical: false,
        tip: 'Cold solder or weak spot welds will heat up during 1C continuous discharge and trigger premature thermal cutoff.',
      },
    ],
    documentationRequirements: [
      'BMS functional safety architecture document conforming to ISO 26262 ASIL-B',
      'Cell manufacturer technical specification sheet with UN 38.3 transport certification',
      'Thermal simulation report proving heat dissipation under 45°C ambient Indian summer',
      'Wiring harness insulation diagram with flame retardancy rating (UL 94 V-0)',
    ],
  },
  {
    id: 'comp_wpc_lora_meter',
    slug: 'wpc-eta-lora-iot',
    title: 'WPC ETA & BIS Smart Energy Meter & LoRaWAN Node',
    productCategory: 'iot_wireless',
    tagline: 'Equipment Type Approval (ETA) for India IN865 de-licensed frequency band & smart meter standards',
    description:
      'Required by the Wireless Planning and Coordination (WPC) wing of the Department of Telecommunications for any device emitting radio frequency in India. Covers LoRa, BLE, Zigbee, and Wi-Fi transceivers operating in the 865–867 MHz and 2.4 GHz industrial de-licensed frequency slots.',
    statutoryBodies: ['wpc_eta', 'bis_isi'],
    applicableStandards: [
      {
        code: 'WPC GSR 564(E)',
        name: 'De-licensing of 865–867 MHz frequency band for low-power devices',
        body: 'wpc_eta',
        mandatory: true,
        description: 'Statutory frequency allocation rule limiting transmission power to +20 dBm (100mW EIRP).',
        testParameters: [
          'Effective Isotropic Radiated Power (EIRP < +20 dBm)',
          'Carrier frequency tolerance and occupied channel bandwidth < 200 kHz',
          'Spurious conducted emissions outside 865-867 MHz slot',
        ],
      },
      {
        code: 'IS 16444 (Part 1):2015',
        name: 'A.C. Static Direct Connected Smart Meter',
        body: 'bis_isi',
        mandatory: true,
        description: 'Mandatory standard for smart electricity meters under the Revamped Distribution Sector Scheme (RDSS).',
        testParameters: [
          'Accuracy Class 1.0 energy measurement',
          'Tamper detection against high magnetic field and neutral disconnection',
          'Surge immunity at 6 kV (IEC 61000-4-5)',
        ],
      },
    ],
    mandatoryGovtPortals: [
      {
        name: 'Saral Sanchar (DoT)',
        url: 'https://saralsanchar.gov.in',
        department: 'Wireless Planning & Coordination (WPC)',
      },
      {
        name: 'BIS Manakonline',
        url: 'https://www.manakonline.in',
        department: 'Bureau of Indian Standards',
      },
    ],
    sampleUnitsTotal: 4,
    estimatedTotalTestingCostInr: {
      minInr: 65000,
      maxInr: 120000,
    },
    estimatedTimelineWeeks: {
      minWeeks: 3,
      maxWeeks: 6,
    },
    penaltiesForNonCompliance:
      'Confiscation of imported modules by Customs under Indian Telegraph Act 1885 Section 20, wireless equipment seizure, and commercial embargo from government power utility procurement.',
    recommendedLabs: [
      {
        labName: 'SAMEER Centre for Electromagnetics (Kolkata)',
        nablAccreditationNo: 'TC-5310',
        city: 'Kolkata',
        state: 'West Bengal',
        estimatedCostInr: 45000,
        estimatedLeadTimeWeeks: 2,
        sampleUnitsRequired: 2,
        testsCovered: [
          'Radiated spurious emissions in 30 MHz - 6 GHz range',
          'Conducted RF output power meter verification',
          'Frequency drift across temperature range (-10°C to +55°C)',
        ],
      },
      {
        labName: 'CPRI (Central Power Research Institute)',
        nablAccreditationNo: 'TC-5099',
        city: 'Bengaluru',
        state: 'Karnataka',
        estimatedCostInr: 55000,
        estimatedLeadTimeWeeks: 3,
        sampleUnitsRequired: 2,
        testsCovered: [
          'Meter accuracy Class 1.0 bench run',
          '6 kV lightning impulse surge withstand',
          'Fast transient burst immunity (4 kV per IEC 61000-4-4)',
        ],
      },
    ],
    preComplianceChecklist: [
      {
        id: 'chk_rf_power_clamp',
        task: 'Confirm firmware locks LoRa PA output to maximum +14 dBm (effective +16 dBm with antenna)',
        critical: true,
        tip: 'Exceeding +20 dBm EIRP is an immediate statutory WPC failure.',
      },
      {
        id: 'chk_test_firmware',
        task: 'Burn dedicated continuous-wave (CW) test firmware on the submitted sample',
        critical: true,
        tip: 'Testing labs cannot test normal LoRa packet sleep mode; they require a button to toggle continuous unmodulated carrier on 865.0625 MHz.',
      },
      {
        id: 'chk_antenna_matching',
        task: 'Verify return loss $S_{11} < -10\\text{ dB}$ on 865 MHz antenna trace with VNA',
        critical: false,
        tip: 'High reflected power causes harmonic distortion into the 1.7 GHz second harmonic.',
      },
    ],
    documentationRequirements: [
      'Self-declaration ETA application on Saral Sanchar portal with RF test report',
      'Antenna datasheet with gain plot in dBi signed by authorized OEM engineer',
      'Detailed circuit schematic highlighting RF transceiver matching network',
    ],
  },
  {
    id: 'comp_bis_smps',
    slug: 'bis-crs-smps-adapter',
    title: 'BIS CRS Mains AC-DC SMPS Power Adapter & Charger',
    productCategory: 'power_adapter',
    tagline: 'Compulsory Registration Scheme (CRS) safety standard for AC-DC power supplies & laptop chargers',
    description:
      'Mandatory registration enforced under MeitY Electronics and Information Technology Goods (Requirement for Compulsory Registration) Order. Required before any consumer or commercial electronics power adapter can be sold on e-commerce platforms or cleared through Indian Customs.',
    statutoryBodies: ['bis_crs', 'bee_energy'],
    applicableStandards: [
      {
        code: 'IS 13252 (Part 1):2010',
        name: 'Information Technology Equipment - Safety (General Requirements)',
        body: 'bis_crs',
        mandatory: true,
        description: 'Mandatory standard testing electric shock, insulation breakdown, and fire hazards.',
        testParameters: [
          'Dielectric electric strength test at 3000 V AC between primary and secondary',
          'Creepage and clearance distance audit (> 6.0 mm reinforced insulation)',
          'Glow wire test at 850°C on plastic enclosure materials (IEC 60695-2-11)',
          'Earth leakage current < 0.25 mA under full load',
        ],
      },
      {
        code: 'BEE Schedule 16',
        name: 'Star Labeling Scheme for External Power Supplies',
        body: 'bee_energy',
        mandatory: true,
        description: 'Mandatory active-mode efficiency and no-load standby power limits (< 0.1W).',
        testParameters: ['Average active efficiency at 25%, 50%, 75%, and 100% load', 'No-load standby power dissipation'],
      },
    ],
    mandatoryGovtPortals: [
      {
        name: 'BIS CRS Portal',
        url: 'https://www.crsbis.in',
        department: 'Bureau of Indian Standards',
      },
      {
        name: 'BEE India Star Label Portal',
        url: 'https://www.beestarlabel.com',
        department: 'Bureau of Energy Efficiency (Ministry of Power)',
      },
    ],
    sampleUnitsTotal: 6,
    estimatedTotalTestingCostInr: {
      minInr: 85000,
      maxInr: 145000,
    },
    estimatedTimelineWeeks: {
      minWeeks: 4,
      maxWeeks: 7,
    },
    penaltiesForNonCompliance:
      'Immediate delisting from Amazon, Flipkart, and GeM portals, seizure of inventory under BIS Act 2016 Section 17, and fine up to ₹5 Lakhs plus imprisonment.',
    recommendedLabs: [
      {
        labName: 'ERTL (North) Electronics Regional Test Laboratory',
        nablAccreditationNo: 'TC-5102',
        city: 'New Delhi',
        state: 'Delhi NCR',
        estimatedCostInr: 72000,
        estimatedLeadTimeWeeks: 3,
        sampleUnitsRequired: 4,
        testsCovered: [
          'Dielectric withstand 3 kV AC hi-pot test',
          'Temperature rise audit under 40°C chamber at full rated load',
          'Overload and single-component failure simulation',
        ],
      },
      {
        labName: 'UL India Private Limited',
        nablAccreditationNo: 'TC-5520',
        city: 'Bengaluru',
        state: 'Karnataka',
        estimatedCostInr: 95000,
        estimatedLeadTimeWeeks: 2,
        sampleUnitsRequired: 2,
        testsCovered: [
          'Creepage & clearance microscopic optical measurement',
          'Glow-wire and flammability testing',
          'BEE Star rating standby power measurement',
        ],
      },
    ],
    preComplianceChecklist: [
      {
        id: 'chk_creepage_distance',
        task: 'Confirm physical isolation slot between primary AC and secondary DC traces is >= 6.0 mm',
        critical: true,
        tip: 'Measure PCB optocoupler isolation gap and Y-capacitor spacing with digital caliper before fabricating final board revision.',
      },
      {
        id: 'chk_transformer_insulation',
        task: 'Verify high-frequency flyback transformer uses triple-insulated wire (TIW) or margin tape',
        critical: true,
        tip: 'Single enamel magnet wire will fail the 3 kV AC dielectric breakdown spark test.',
      },
      {
        id: 'chk_fuse_varistor',
        task: 'Ensure primary side includes certified time-lag fuse (T2A/250V) and 470V MOV surge varistor',
        critical: true,
        tip: 'The MOV and fuse must have valid component VDE/UL safety marks.',
      },
    ],
    documentationRequirements: [
      'Comprehensive transformer construction datasheet with winding turns and wire insulation specs',
      'Critical component list (CCL) detailing manufacturer, model, and approval certificate for fuse, optocoupler, bridge rectifier, and electrolytic capacitors',
      'PCB layout Gerber files showing reinforced insulation barrier',
      'Bilingual instruction manual in English and Hindi with statutory BIS R-number mark format',
    ],
  },
  {
    id: 'comp_tec_cellular',
    slug: 'tec-mtcte-cellular-router',
    title: 'TEC MTCTE 4G/5G Cellular Gateway & Edge Router',
    productCategory: 'telecom_networking',
    tagline: 'Mandatory Testing and Certification of Telecom Equipment under Indian Telegraph Rules',
    description:
      'Required by the Telecommunication Engineering Centre (TEC) under the Ministry of Communications for all telecom equipment connected to public Indian telecommunication networks. Covers cellular routers, optical network terminals (ONT), and NB-IoT devices.',
    statutoryBodies: ['tec_mtcte', 'wpc_eta'],
    applicableStandards: [
      {
        code: 'TEC MTCTE Phase IV (ER)',
        name: 'Essential Requirements for IoT Gateway & Cellular Equipment',
        body: 'tec_mtcte',
        mandatory: true,
        description: 'Mandatory technical standard for telecom security and electromagnetic compatibility.',
        testParameters: [
          'EMI/EMC radiated emissions (CISPR 32 Class B)',
          'Telecom port conducted immunity (IEC 61000-4-6)',
          'IPv6 protocol stack conformance and security audit (no default admin/admin passwords)',
          'Safety requirements conforming to IEC 62368-1',
        ],
      },
    ],
    mandatoryGovtPortals: [
      {
        name: 'TEC MTCTE Portal',
        url: 'https://www.mtcte.tec.gov.in',
        department: 'Telecommunication Engineering Centre (DoT)',
      },
    ],
    sampleUnitsTotal: 2,
    estimatedTotalTestingCostInr: {
      minInr: 160000,
      maxInr: 250000,
    },
    estimatedTimelineWeeks: {
      minWeeks: 6,
      maxWeeks: 10,
    },
    penaltiesForNonCompliance:
      'DoT order directing telecom service providers (Jio, Airtel, Vi) to block network registration of non-certified devices based on TAC/IMEI, and penalty under Section 20A of Indian Telegraph Act.',
    recommendedLabs: [
      {
        labName: 'SAMEER Chennai (Centre for Electromagnetics)',
        nablAccreditationNo: 'TC-5432',
        city: 'Chennai',
        state: 'Tamil Nadu',
        estimatedCostInr: 120000,
        estimatedLeadTimeWeeks: 4,
        sampleUnitsRequired: 1,
        testsCovered: [
          'Radiated and conducted emissions CISPR 32',
          'Electrostatic Discharge (ESD) and Surge testing',
          'Telecom Ethernet port surge 1.5 kV withstand',
        ],
      },
      {
        labName: 'TÜV Rheinland India',
        nablAccreditationNo: 'TC-5801',
        city: 'Bengaluru',
        state: 'Karnataka',
        estimatedCostInr: 140000,
        estimatedLeadTimeWeeks: 3,
        sampleUnitsRequired: 1,
        testsCovered: [
          'IPv6 Ready Logo protocol conformance',
          'Telecom security vulnerability evaluation (port scan, default credentials)',
        ],
      },
    ],
    preComplianceChecklist: [
      {
        id: 'chk_hardcoded_passwords',
        task: 'Ensure device firmware forces unique initial password setup on first boot',
        critical: true,
        tip: 'TEC security requirements strictly fail any router with generic default passwords (e.g. admin/password).',
      },
      {
        id: 'chk_ethernet_surge',
        task: 'Add TVS diode array (e.g. SLVU2.8-4) on all RJ45 Ethernet differential pairs',
        critical: true,
        tip: 'Protects PHY silicon from IEC 61000-4-5 telecom surge pulses.',
      },
      {
        id: 'chk_modem_imei',
        task: 'Verify 4G/5G cellular module carries legal GSMA TAC registration',
        critical: false,
        tip: 'Cloned or unallocated IMEIs fail customs clearance and carrier verification.',
      },
    ],
    documentationRequirements: [
      'TEC MTCTE online application with designated CAB test reports',
      'Network architecture diagram showing IPv6 routing and firewall topology',
      'Security compliance affidavit declaring absence of backdoors per DoT guidelines',
    ],
  },
  {
    id: 'comp_cdsco_vital_monitor',
    slug: 'cdsco-med-class-b-vital-monitor',
    title: 'CDSCO Class B Medical Vital Signs & Oximeter Monitor',
    productCategory: 'medical_device',
    tagline: 'Central Drugs Standard Control Organisation (CDSCO) Form MD-5 manufacturing license & IEC 60601 safety',
    description:
      'Statutory medical device registration required under Medical Devices Rules 2017 for low-moderate risk diagnostic devices including ECG monitors, pulse oximeters, and patient telemetry hubs. Involves rigorous electrical patient isolation testing and biocompatibility verification.',
    statutoryBodies: ['cdsco_med', 'bis_crs'],
    applicableStandards: [
      {
        code: 'IEC 60601-1:2020',
        name: 'Medical electrical equipment - General requirements for basic safety and essential performance',
        body: 'cdsco_med',
        mandatory: true,
        description: 'Mandatory standard testing patient leakage currents and cardiac defibrillation protection.',
        testParameters: [
          'Patient leakage current < 100 µA under single-fault condition (Type BF)',
          'Defibrillation-proof protection (5 kV pulse withstand)',
          'Biocompatibility testing on patient skin contact pads (ISO 10993)',
        ],
      },
      {
        code: 'IEC 60601-1-2:2020',
        name: 'Medical electrical equipment - Electromagnetic disturbances',
        body: 'cdsco_med',
        mandatory: true,
        description: 'Hospital-grade immunity against surgical diathermy and cellular RF noise.',
        testParameters: ['Immunity to proximity magnetic fields and radiated RF fields at 10 V/m'],
      },
    ],
    mandatoryGovtPortals: [
      {
        name: 'CDSCO SUGAM Medical Device Portal',
        url: 'https://cdscomdonline.gov.in',
        department: 'Central Drugs Standard Control Organisation (MoHFW)',
      },
    ],
    sampleUnitsTotal: 4,
    estimatedTotalTestingCostInr: {
      minInr: 220000,
      maxInr: 380000,
    },
    estimatedTimelineWeeks: {
      minWeeks: 10,
      maxWeeks: 16,
    },
    penaltiesForNonCompliance:
      'Immediate criminal prosecution and product recall under Drugs and Cosmetics Act 1940 Section 27, fine up to ₹10 Lakhs, and imprisonment up to 3 years.',
    recommendedLabs: [
      {
        labName: 'Kalam Institute of Health Technology (KIHT)',
        nablAccreditationNo: 'TC-6190',
        city: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        estimatedCostInr: 160000,
        estimatedLeadTimeWeeks: 5,
        sampleUnitsRequired: 2,
        testsCovered: [
          'IEC 60601-1 patient leakage current and dielectric isolation',
          'Defibrillator protection surge test (5 kV)',
          'Pulse oximeter calibration accuracy bench run across 70%-100% SpO2',
        ],
      },
      {
        labName: 'SAMEER Centre for Electromagnetics (Chennai)',
        nablAccreditationNo: 'TC-5432',
        city: 'Chennai',
        state: 'Tamil Nadu',
        estimatedCostInr: 110000,
        estimatedLeadTimeWeeks: 4,
        sampleUnitsRequired: 1,
        testsCovered: [
          'IEC 60601-1-2 Medical EMC radiated immunity (10 V/m)',
          'Electrostatic discharge testing (8 kV contact / 15 kV air)',
        ],
      },
    ],
    preComplianceChecklist: [
      {
        id: 'chk_patient_isolation',
        task: 'Confirm dual means of patient protection (2x MOPP) with 4000 V AC isolation transformer',
        critical: true,
        tip: 'Optocouplers and DC-DC converters in the patient circuit path must explicitly carry medical 2 MOPP ratings.',
      },
      {
        id: 'chk_biocompatibility',
        task: 'Verify pulse oximeter finger clip uses medical-grade silicone with ISO 10993 cytotoxicity test certificates',
        critical: true,
        tip: 'Uncertified plastics will fail biological skin irritation audits.',
      },
      {
        id: 'chk_fail_safe_alarms',
        task: 'Implement independent hardware watchdog alarm for sensor detachment within 2 seconds',
        critical: false,
        tip: 'IEC 60601-1-8 requires distinct audio-visual alarm priority for probe disconnections.',
      },
    ],
    documentationRequirements: [
      'Device Master File (DMF) conforming to ASEAN Common Submission Dossier Template (CSDT)',
      'Plant Master File (PMF) detailing cleanroom assembly and sterilisation controls',
      'Clinical evaluation report demonstrating equivalence with predicate devices',
      'Risk management file prepared in accordance with ISO 14971:2019',
    ],
  },
];
