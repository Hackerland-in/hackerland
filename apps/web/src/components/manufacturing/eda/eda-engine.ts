export type EdaStageId =
  | 'synthesis'
  | 'floorplan'
  | 'placement'
  | 'cts'
  | 'routing'
  | 'verification'
  | 'tapeout';

export interface EdaFlowStage {
  id: EdaStageId;
  name: string;
  tool: string;
  category: string;
  description: string;
  logSnippet: string;
  outputArtifact: string;
  metricLabel: string;
  metricValue: string;
}

export interface StandardCell {
  id: string;
  name: string;
  type: 'NAND2' | 'NOR2' | 'INV' | 'DFF' | 'AND2' | 'MUX2' | 'BUF';
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
}

export interface MetalWire {
  id: string;
  layer: 'metal1' | 'metal2' | 'metal3' | 'metal4';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  net: string;
}

export interface DrcRuleViolation {
  rule: string;
  description: string;
  layer: string;
  severity: 'error' | 'warning' | 'clean';
  location: string;
}

export interface EdaPreset {
  id: string;
  title: string;
  targetNode: string;
  description: string;
  theory: string;
  formula: string;
  verilogSource: string;
  yosysScript: string;
  dieWidthUm: number;
  dieHeightUm: number;
  coreAreaUm2: number;
  cellCount: number;
  maxFreqMHz: number;
  metalLayerCount: number;
  stages: Record<EdaStageId, { logSnippet: string; metricValue: string }>;
  cells: StandardCell[];
  wires: MetalWire[];
  drcViolations: DrcRuleViolation[];
}

export const EDA_FLOW_STAGES: { id: EdaStageId; name: string; tool: string; category: string; description: string; metricLabel: string; outputArtifact: string }[] = [
  {
    id: 'synthesis',
    name: 'Logic Synthesis & Technology Mapping',
    tool: 'Yosys + ABC',
    category: 'RTL to Netlist',
    description: 'Translates high-level Verilog RTL into standard cells (SkyWater SKY130 / FreePDK45) using graph-based boolean optimization.',
    metricLabel: 'Standard Cell Count',
    outputArtifact: 'synth.v (Gate-Level Netlist)',
  },
  {
    id: 'floorplan',
    name: 'Floorplanning & Power Grid (PDN)',
    tool: 'OpenROAD (InitFloorplan & PDN)',
    category: 'Physical Design',
    description: 'Establishes core aspect ratio, die margins, I/O pad rings, and dual VDD/VSS power distribution rings & stripes.',
    metricLabel: 'Core Utilization',
    outputArtifact: 'floorplan.def',
  },
  {
    id: 'placement',
    name: 'Global & Detailed Placement',
    tool: 'OpenROAD RePlace & OpenDP',
    category: 'Physical Design',
    description: 'Performs electrostatic-driven global placement followed by non-overlapping legal placement on standard cell rows.',
    metricLabel: 'Half-Perimeter Wirelength (HPWL)',
    outputArtifact: 'placed.def',
  },
  {
    id: 'cts',
    name: 'Clock Tree Synthesis (CTS)',
    tool: 'OpenROAD TritonCTS',
    category: 'Timing Optimization',
    description: 'Builds balanced H-tree buffer networks to deliver clock edges simultaneously to all flip-flops with minimal skew.',
    metricLabel: 'Max Clock Skew',
    outputArtifact: 'cts.def',
  },
  {
    id: 'routing',
    name: 'Global & Detailed Routing',
    tool: 'OpenROAD FastRoute & TritonRoute',
    category: 'Physical Design',
    description: 'Routes all signal nets on Metal 1 through Metal 5 layers while honoring spacing, width, and via rules.',
    metricLabel: 'Route Vias Inserted',
    outputArtifact: 'routed.def',
  },
  {
    id: 'verification',
    name: 'Physical Verification (DRC & LVS)',
    tool: 'Magic VLSI & Netgen',
    category: 'Signoff Verification',
    description: 'Runs geometric Design Rule Checking (DRC) and Layout-Versus-Schematic (LVS) matching layout against synthesized netlist.',
    metricLabel: 'DRC Clean Status',
    outputArtifact: 'signoff_drc.rpt',
  },
  {
    id: 'tapeout',
    name: 'Mask Generation & GDSII Signoff',
    tool: 'KLayout',
    category: 'Foundry Tapeout',
    description: 'Streams layout data into industry standard GDSII/OASIS format for photomask fabrication at foundry (e.g. SkyWater Fab).',
    metricLabel: 'GDSII Stream File',
    outputArtifact: 'chip_final.gds (OASIS)',
  },
];

// Helper to generate simulated standard cells in rows
function generateSampleCells(count: number, width: number, height: number): StandardCell[] {
  const cells: StandardCell[] = [];
  const rowCount = 8;
  const rowHeight = height / rowCount;
  const types: StandardCell['type'][] = ['NAND2', 'INV', 'DFF', 'NOR2', 'AND2', 'MUX2', 'BUF'];

  for (let i = 0; i < count; i++) {
    const row = i % rowCount;
    const col = Math.floor(i / rowCount);
    const cellW = 8 + (i % 5) * 2;
    const cellH = rowHeight - 2;
    const x = 12 + col * 18;
    const y = 8 + row * rowHeight + 1;
    const cellType = types[i % types.length]!;

    cells.push({
      id: `cell_${i}`,
      name: `${cellType}_X${(i % 3) + 1}`,
      type: cellType,
      x: Math.min(x, width - 20),
      y: Math.min(y, height - 15),
      width: cellW,
      height: cellH,
      row,
    });
  }

  return cells;
}

// Helper to generate routing wires
function generateSampleWires(cells: StandardCell[]): MetalWire[] {
  const wires: MetalWire[] = [];
  const layers: MetalWire['layer'][] = ['metal1', 'metal2', 'metal3', 'metal4'];

  for (let i = 0; i < cells.length - 1; i += 2) {
    const c1 = cells[i]!;
    const c2 = cells[i + 1]!;
    const layer = layers[i % layers.length]!;

    wires.push({
      id: `wire_${i}_h`,
      layer,
      x1: c1.x + c1.width / 2,
      y1: c1.y + c1.height / 2,
      x2: c2.x + c2.width / 2,
      y2: c1.y + c1.height / 2,
      net: `net_${i}`,
    });

    wires.push({
      id: `wire_${i}_v`,
      layer: layer === 'metal1' ? 'metal2' : 'metal1',
      x1: c2.x + c2.width / 2,
      y1: c1.y + c1.height / 2,
      x2: c2.x + c2.width / 2,
      y2: c2.y + c2.height / 2,
      net: `net_${i}`,
    });
  }

  return wires;
}

export const EDA_PRESETS: EdaPreset[] = [
  {
    id: 'pico-rv32',
    title: 'PicoRV32 RISC-V 32-Bit Micro-Core ASIC',
    targetNode: 'SkyWater SKY130 (130nm CMOS)',
    description: 'Complete synthesis and tapeout flow for a compact RISC-V RV32IMC integer microprocessor core.',
    theory: 'Open-source EDA allows fully automated silicon design without proprietary EDA licenses. Yosys synthesizes Verilog into logic equations; ABC maps to SkyWater 130nm standard cells; OpenROAD performs floorplanning, placement, and clock tree synthesis; KLayout streams the final GDSII photomask.',
    formula: '\\text{Die Area} = \\frac{\\sum \\text{Cell Area}}{\\text{Utilization}} \\quad \\text{Slack} = T_{\\text{clk}} - (T_{\\text{prop}} + T_{\\text{setup}})',
    dieWidthUm: 160,
    dieHeightUm: 160,
    coreAreaUm2: 25600,
    cellCount: 1840,
    maxFreqMHz: 125,
    metalLayerCount: 5,
    verilogSource: `// PicoRV32 RISC-V RV32I Micro-Core Top
module picorv32 (
    input clk, resetn,
    output reg trap,
    output reg mem_valid,
    input      mem_ready,
    output reg [31:0] mem_addr,
    output reg [31:0] mem_wdata,
    input      [31:0] mem_rdata
);
    // Integer register file, ALU, PC decoder and bus controller
    reg [31:0] pc, next_pc;
    reg [31:0] regs [0:31];
    // Hardware execution engine...
endmodule`,
    yosysScript: `# Yosys OpenROAD Synthesis Script
read_verilog picorv32.v
synth -top picorv32
dfflibmap -liberty sky130_fd_sc_hd.lib
abc -liberty sky130_fd_sc_hd.lib
clean
write_verilog synth.v
stat -liberty sky130_fd_sc_hd.lib`,
    stages: {
      synthesis: {
        logSnippet: `Yosys 0.38 (git sha1 e6a0b12)
Executing ABC speed optimization...
Mapping logic gates to sky130_fd_sc_hd...
Chip area for module 'picorv32': 18,420 um^2
Number of cells: 1,840 (NAND2: 520, NOR2: 310, DFF: 480, INV: 320, MUX: 210)`,
        metricValue: '1,840 Standard Cells',
      },
      floorplan: {
        logSnippet: `[INFO] Initializing floorplan: 160.0um x 160.0um
[INFO] Core area: 130.0um x 130.0um (Utilization: 52.4%)
[INFO] Inserting IO pad pins and power rings (met4/met5)
[INFO] Generating VDD/VSS power grid stripes`,
        metricValue: '52.4% Target Density',
      },
      placement: {
        logSnippet: `[INFO] Running RePlace global placement
[INFO] Iteration 240: HPWL = 18.42 mm
[INFO] Legalizing overlapping cells with OpenDP
[INFO] Placement completed: 0 violations, 100% legal rows`,
        metricValue: '18.42 mm HPWL',
      },
      cts: {
        logSnippet: `[INFO] TritonCTS: Constructing clock tree for net 'clk'
[INFO] Root buffer: sky130_fd_sc_hd__clkbuf_16
[INFO] Total clock sinks: 480 Flip-Flops
[INFO] Max clock latency: 1.12 ns | Clock skew: 38 ps`,
        metricValue: '38 ps Clock Skew',
      },
      routing: {
        logSnippet: `[INFO] FastRoute global routing completed with 0 congestion
[INFO] TritonRoute: Detailed routing on met1..met5
[INFO] Total wire length: 42.1 mm | Vias inserted: 4,812
[INFO] DRC violations after routing: 0`,
        metricValue: '4,812 Vias / 0 Violations',
      },
      verification: {
        logSnippet: `Magic VLSI v8.3: DRC Verification
Checking 18 design rule layers for SKY130A...
DRC Summary: 0 errors found.
Netgen v1.5: LVS Comparison
Device counts match: 1,840 instances. Net counts match.
LVS Result: Netlists match uniquely. PASS`,
        metricValue: 'DRC & LVS: 100% PASS',
      },
      tapeout: {
        logSnippet: `KLayout v0.28: Streaming GDSII / OASIS
Writing cell hierarchy 'picorv32'...
Bounding Box: (0, 0) to (160um, 160um)
Mask layers exported: 32 (Active, Poly, Met1-5, Overglass)
Checksum generated: 0x9AF83E12. Tapeout Ready.`,
        metricValue: 'GDSII Ready (160x160um)',
      },
    },
    cells: generateSampleCells(36, 160, 160),
    wires: [],
    drcViolations: [
      {
        rule: 'met1.1',
        description: 'Minimum width of metal1 is 0.14um',
        layer: 'Metal 1',
        severity: 'clean',
        location: 'All nets compliant (0.14um min)',
      },
      {
        rule: 'met2.2',
        description: 'Minimum spacing between metal2 wires is 0.14um',
        layer: 'Metal 2',
        severity: 'clean',
        location: '0 violations across 1,840 nets',
      },
      {
        rule: 'poly.1a',
        description: 'Polysilicon gate overhang of active area is 0.15um',
        layer: 'Polysilicon',
        severity: 'clean',
        location: 'Standard cell library DRC certified',
      },
    ],
  },
  {
    id: 'sha256-engine',
    title: 'Hardware Cryptographic SHA-256 Accelerator',
    targetNode: 'SkyWater SKY130 (130nm CMOS)',
    description: 'Pipelined hardware engine computing SHA-256 compression iterations in standard cells.',
    theory: 'Hardware hashing implements 64 rounds of non-linear boolean operations (Ch, Maj, \\Sigma_0, \\Sigma_1) with 32-bit adder trees, achieving gigabit-throughput silicon acceleration with minimal dynamic power dissipation.',
    formula: '\\text{Throughput} = \\frac{512 \\text{ bits} \\times f_{\\text{clk}}}{64 \\text{ cycles}} \\approx 1.0 \\text{ Gbps @ 125MHz}',
    dieWidthUm: 110,
    dieHeightUm: 110,
    coreAreaUm2: 12100,
    cellCount: 680,
    maxFreqMHz: 150,
    metalLayerCount: 4,
    verilogSource: `module sha256_core (
    input clk, rst_n,
    input [511:0] block_in,
    output reg [256:0] digest_out
);
    // 64 round hardware compression pipeline
endmodule`,
    yosysScript: `read_verilog sha256_core.v
synth -top sha256_core
abc -liberty sky130_fd_sc_hd.lib
stat`,
    stages: {
      synthesis: {
        logSnippet: `Yosys 0.38: Synthesizing sha256_core
Cell count: 680 standard cells
Critical path delay: 5.82 ns (Estimated max clock: 171 MHz)`,
        metricValue: '680 Standard Cells',
      },
      floorplan: {
        logSnippet: `Floorplan: 110um x 110um die
Core utilization: 48.2%
Power grid: Ring width 4.8um`,
        metricValue: '48.2% Density',
      },
      placement: {
        logSnippet: `RePlace: Global placement converged in 180 iterations
HPWL: 9.14 mm`,
        metricValue: '9.14 mm HPWL',
      },
      cts: {
        logSnippet: `TritonCTS: Clock tree balanced for 256 state registers
Clock skew: 24 ps`,
        metricValue: '24 ps Clock Skew',
      },
      routing: {
        logSnippet: `TritonRoute: Met1-Met4 routing finished
Vias: 2,140 | Violations: 0`,
        metricValue: '2,140 Vias / Clean',
      },
      verification: {
        logSnippet: `Magic DRC: PASS (0 errors)
Netgen LVS: Circuits are identical!`,
        metricValue: 'DRC & LVS: 100% PASS',
      },
      tapeout: {
        logSnippet: `KLayout: Streamed sha256_core.gds`,
        metricValue: 'GDSII Ready (110x110um)',
      },
    },
    cells: generateSampleCells(28, 110, 110),
    wires: [],
    drcViolations: [
      {
        rule: 'met1.1',
        description: 'Minimum width of metal1 is 0.14um',
        layer: 'Metal 1',
        severity: 'clean',
        location: 'Clean',
      },
      {
        rule: 'via1.1',
        description: 'Via1 size 0.15um x 0.15um',
        layer: 'Via 1',
        severity: 'clean',
        location: 'Clean',
      },
    ],
  },
];

// Initialize wires for presets
EDA_PRESETS.forEach((preset) => {
  preset.wires = generateSampleWires(preset.cells);
});
