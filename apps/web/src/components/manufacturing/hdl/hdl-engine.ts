export interface HdlSignal {
  name: string;
  width: number;
  isClock?: boolean;
  isBus?: boolean;
  history: { timeNs: number; value: number | string }[];
}

export interface HdlPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  theory: string;
  formula: string;
  verilogCode: string;
  testbenchCode: string;
  clockPeriodNs: number;
  totalTimeNs: number;
  signals: HdlSignal[];
  estimatedLuts: number;
  estimatedFlipFlops: number;
}

export const HDL_PRESETS: HdlPreset[] = [
  {
    id: 'counter-4bit',
    title: '4-Bit Synchronous Binary Up-Counter with Reset',
    category: 'Sequential Logic',
    description: '4-bit registered up-counter with active-high synchronous reset and carry-out overflow flag.',
    theory: 'In sequential digital logic, flip-flops latch state on clock edge (posedge clk). When reset is high, the 4-bit register q clears to 0000. Otherwise, it increments by 1 on each clock tick, rolling over from 1111 (15) to 0000 with a carry-out pulse.',
    formula: 'q[3:0] \\Leftarrow q[3:0] + 1 \\quad (\\text{mod } 16) \\quad \\text{cout} = \\&q[3:0]',
    clockPeriodNs: 10,
    totalTimeNs: 200,
    estimatedLuts: 4,
    estimatedFlipFlops: 4,
    verilogCode: `// ==========================================
// 4-Bit Synchronous Counter with Enable & Reset
// ==========================================
module counter_4bit (
    input  wire       clk,
    input  wire       rst_n,   // Active-low asynchronous reset
    input  wire       enable,  // Count enable
    output reg  [3:0] q,       // 4-bit counter output
    output wire       cout     // Terminal count carry-out
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            q <= 4'b0000;
        end else if (enable) begin
            q <= q + 1'b1;
        end
    end

    // Carry-out generates a pulse when q reaches 15 (4'b1111)
    assign cout = (q == 4'b1111) && enable;

endmodule`,
    testbenchCode: `// ==========================================
// Testbench for counter_4bit
// Compatible with Icarus Verilog & Verilator
// ==========================================
\`timescale 1ns / 1ps

module tb_counter;
    reg        clk;
    reg        rst_n;
    reg        enable;
    wire [3:0] q;
    wire       cout;

    counter_4bit uut (
        .clk(clk),
        .rst_n(rst_n),
        .enable(enable),
        .q(q),
        .cout(cout)
    );

    // 100MHz Clock Generator (Period = 10ns)
    always #5 clk = ~clk;

    initial begin
        $dumpfile("counter_4bit.vcd");
        $dumpvars(0, tb_counter);

        clk    = 0;
        rst_n  = 0;
        enable = 0;
        #15 rst_n  = 1; // De-assert reset
        #10 enable = 1; // Begin counting
        #175 $finish;
    end
endmodule`,
    signals: [],
  },
  {
    id: 'fsm-traffic-light',
    title: 'Finite State Machine (FSM) Traffic Light Controller',
    category: 'State Machines',
    description: '3-state Moore FSM cycling between RED, YELLOW, and GREEN light intervals.',
    theory: 'A Moore finite state machine determines outputs strictly from the current state register. Transitions occur deterministically based on counter timeouts: RED (6 cycles) -> GREEN (8 cycles) -> YELLOW (2 cycles).',
    formula: 'S_{next} = \\delta(S_{current}, \\text{timer}) \\quad \\text{Light} = \\lambda(S_{current})',
    clockPeriodNs: 10,
    totalTimeNs: 240,
    estimatedLuts: 12,
    estimatedFlipFlops: 6,
    verilogCode: `// ==========================================
// Moore Finite State Machine Traffic Controller
// ==========================================
module traffic_light_fsm (
    input  wire       clk,
    input  wire       rst,
    output reg  [2:0] lights // [Red, Yellow, Green]
);

    localparam S_RED    = 2'b00;
    localparam S_GREEN  = 2'b01;
    localparam S_YELLOW = 2'b10;

    reg [1:0] state, next_state;
    reg [3:0] timer;

    always @(posedge clk or posedge rst) begin
        if (rst) begin
            state <= S_RED;
            timer <= 0;
        end else begin
            state <= next_state;
            if (state != next_state) timer <= 0;
            else timer <= timer + 1;
        end
    end

    always @(*) begin
        next_state = state;
        case (state)
            S_RED:    if (timer >= 6) next_state = S_GREEN;
            S_GREEN:  if (timer >= 8) next_state = S_YELLOW;
            S_YELLOW: if (timer >= 2) next_state = S_RED;
            default:  next_state = S_RED;
        endcase
    end

    // Moore Output Logic
    always @(*) begin
        case (state)
            S_RED:    lights = 3'b100; // Red ON
            S_GREEN:  lights = 3'b001; // Green ON
            S_YELLOW: lights = 3'b010; // Yellow ON
            default:  lights = 3'b100;
        endcase
    end

endmodule`,
    testbenchCode: `// Traffic Light FSM Testbench
\`timescale 1ns / 1ps
module tb_traffic;
    reg clk, rst;
    wire [2:0] lights;

    traffic_light_fsm uut (.clk(clk), .rst(rst), .lights(lights));

    always #5 clk = ~clk;

    initial begin
        $dumpfile("traffic_fsm.vcd");
        $dumpvars(0, tb_traffic);
        clk = 0; rst = 1;
        #12 rst = 0;
        #240 $finish;
    end
endmodule`,
    signals: [],
  },
  {
    id: 'alu-8bit',
    title: '8-Bit Arithmetic Logic Unit (ALU) with Flags',
    category: 'Combinational & Arithmetic',
    description: 'High-speed 8-bit combinational ALU executing ADD, SUB, AND, OR, XOR, and barrel shift with Zero & Carry flags.',
    theory: 'The central computational core of a processor. An opcode selector mux routes operands A and B through parallel hardware adders, shifters, and logic gates, calculating the result in a single clock cycle with Zero (Z) and Carry (C) status flags.',
    formula: 'Y = \\text{MUX}(A+B, A-B, A \\& B, A \\mid B, A \\oplus B, A \\ll 1, A \\gg 1)',
    clockPeriodNs: 10,
    totalTimeNs: 160,
    estimatedLuts: 32,
    estimatedFlipFlops: 0,
    verilogCode: `// ==========================================
// 8-Bit Arithmetic Logic Unit (ALU)
// ==========================================
module alu_8bit (
    input  wire [7:0] a,
    input  wire [7:0] b,
    input  wire [2:0] opcode, // 000: ADD, 001: SUB, 010: AND, 011: OR, 100: XOR, 101: SHL
    output reg  [7:0] result,
    output wire       zero_flag,
    output reg        carry_flag
);

    always @(*) begin
        carry_flag = 1'b0;
        case (opcode)
            3'b000: {carry_flag, result} = a + b;           // ADD
            3'b001: {carry_flag, result} = a - b;           // SUB
            3'b010: result = a & b;                         // AND
            3'b011: result = a | b;                         // OR
            3'b100: result = a ^ b;                         // XOR
            3'b101: {carry_flag, result} = {a, 1'b0};       // SHL
            3'b110: result = a >> 1;                        // SHR
            default: result = 8'h00;
        endcase
    end

    assign zero_flag = (result == 8'h00);

endmodule`,
    testbenchCode: `// ALU 8-Bit Testbench
\`timescale 1ns / 1ps
module tb_alu;
    reg [7:0] a, b;
    reg [2:0] opcode;
    wire [7:0] result;
    wire zero_flag, carry_flag;

    alu_8bit uut (.a(a), .b(b), .opcode(opcode), .result(result), .zero_flag(zero_flag), .carry_flag(carry_flag));

    initial begin
        $dumpfile("alu_8bit.vcd");
        $dumpvars(0, tb_alu);
        a = 8'd25; b = 8'd10; opcode = 3'b000; // ADD
        #20 opcode = 3'b001;                   // SUB
        #20 opcode = 3'b010;                   // AND
        #20 opcode = 3'b100;                   // XOR
        #20 a = 8'd255; b = 8'd1; opcode = 3'b000; // OVERFLOW CARRY
        #40 $finish;
    end
endmodule`,
    signals: [],
  },
];

export function runHdlSimulation(preset: HdlPreset): HdlSignal[] {
  const clockPeriod = preset.clockPeriodNs;
  const totalTime = preset.totalTimeNs;

  if (preset.id === 'counter-4bit') {
    const clkSignal: HdlSignal = { name: 'clk', width: 1, isClock: true, history: [] };
    const rstSignal: HdlSignal = { name: 'rst_n', width: 1, history: [] };
    const enSignal: HdlSignal = { name: 'enable', width: 1, history: [] };
    const qSignal: HdlSignal = { name: 'q[3:0]', width: 4, isBus: true, history: [] };
    const coutSignal: HdlSignal = { name: 'cout', width: 1, history: [] };

    let q = 0;
    for (let t = 0; t <= totalTime; t += clockPeriod / 2) {
      const isRisingEdge = (t % clockPeriod) === 0;
      const clkVal = isRisingEdge ? 1 : 0;
      const rstVal = t >= 15 ? 1 : 0;
      const enVal = t >= 25 ? 1 : 0;

      if (isRisingEdge) {
        if (!rstVal) {
          q = 0;
        } else if (enVal) {
          q = (q + 1) & 0x0f;
        }
      }

      const coutVal = q === 15 && enVal ? 1 : 0;

      clkSignal.history.push({ timeNs: t, value: clkVal });
      rstSignal.history.push({ timeNs: t, value: rstVal });
      enSignal.history.push({ timeNs: t, value: enVal });
      qSignal.history.push({ timeNs: t, value: `0x${q.toString(16).toUpperCase()}` });
      coutSignal.history.push({ timeNs: t, value: coutVal });
    }

    return [clkSignal, rstSignal, enSignal, qSignal, coutSignal];
  } else if (preset.id === 'fsm-traffic-light') {
    const clkSignal: HdlSignal = { name: 'clk', width: 1, isClock: true, history: [] };
    const rstSignal: HdlSignal = { name: 'rst', width: 1, history: [] };
    const stateSignal: HdlSignal = { name: 'state[1:0]', width: 2, isBus: true, history: [] };
    const lightsSignal: HdlSignal = { name: 'lights[2:0]', width: 3, isBus: true, history: [] };

    let state = 'RED';
    let timer = 0;

    for (let t = 0; t <= totalTime; t += clockPeriod / 2) {
      const isRising = (t % clockPeriod) === 0;
      const clkVal = isRising ? 1 : 0;
      const rstVal = t < 12 ? 1 : 0;

      if (isRising) {
        if (rstVal) {
          state = 'RED';
          timer = 0;
        } else {
          timer++;
          if (state === 'RED' && timer >= 6) {
            state = 'GREEN';
            timer = 0;
          } else if (state === 'GREEN' && timer >= 8) {
            state = 'YELLOW';
            timer = 0;
          } else if (state === 'YELLOW' && timer >= 2) {
            state = 'RED';
            timer = 0;
          }
        }
      }

      let lightCode = 'RED (100)';
      if (state === 'GREEN') lightCode = 'GREEN (001)';
      else if (state === 'YELLOW') lightCode = 'YELLOW (010)';

      clkSignal.history.push({ timeNs: t, value: clkVal });
      rstSignal.history.push({ timeNs: t, value: rstVal });
      stateSignal.history.push({ timeNs: t, value: state });
      lightsSignal.history.push({ timeNs: t, value: lightCode });
    }

    return [clkSignal, rstSignal, stateSignal, lightsSignal];
  } else if (preset.id === 'alu-8bit') {
    const opcodeSignal: HdlSignal = { name: 'opcode[2:0]', width: 3, isBus: true, history: [] };
    const aSignal: HdlSignal = { name: 'a[7:0]', width: 8, isBus: true, history: [] };
    const bSignal: HdlSignal = { name: 'b[7:0]', width: 8, isBus: true, history: [] };
    const resultSignal: HdlSignal = { name: 'result[7:0]', width: 8, isBus: true, history: [] };
    const zeroSignal: HdlSignal = { name: 'zero_flag', width: 1, history: [] };
    const carrySignal: HdlSignal = { name: 'carry_flag', width: 1, history: [] };

    for (let t = 0; t <= totalTime; t += 10) {
      let a = 25;
      let b = 10;
      let op = 'ADD (000)';
      let res = 35;
      let carry = 0;

      if (t >= 20 && t < 40) {
        op = 'SUB (001)';
        res = 15;
      } else if (t >= 40 && t < 60) {
        op = 'AND (010)';
        res = a & b; // 8
      } else if (t >= 60 && t < 80) {
        op = 'XOR (100)';
        res = a ^ b; // 19
      } else if (t >= 80) {
        a = 255;
        b = 1;
        op = 'ADD (000)';
        res = 0;
        carry = 1;
      }

      const zero = res === 0 ? 1 : 0;

      opcodeSignal.history.push({ timeNs: t, value: op });
      aSignal.history.push({ timeNs: t, value: `0x${a.toString(16).toUpperCase()}` });
      bSignal.history.push({ timeNs: t, value: `0x${b.toString(16).toUpperCase()}` });
      resultSignal.history.push({ timeNs: t, value: `0x${res.toString(16).toUpperCase()}` });
      zeroSignal.history.push({ timeNs: t, value: zero });
      carrySignal.history.push({ timeNs: t, value: carry });
    }

    return [opcodeSignal, aSignal, bSignal, resultSignal, zeroSignal, carrySignal];
  }

  return [];
}

export function generateVcdFile(preset: HdlPreset, signals: HdlSignal[]): string {
  const lines: string[] = [
    '$date',
    `   ${new Date().toISOString()}`,
    '$end',
    '$version',
    '   Hackerland HDL Simulator v1.0 (IEEE 1364-2001 VCD)',
    '$end',
    '$timescale 1ns $end',
    `$scope module ${preset.id} $end`,
  ];

  signals.forEach((sig, idx) => {
    const symbol = String.fromCharCode(33 + idx); // ASCII symbol
    lines.push(`$var wire ${sig.width} ${symbol} ${sig.name} $end`);
  });

  lines.push('$upscope $end');
  lines.push('$enddefinitions $end');
  lines.push('#0');
  lines.push('$dumpvars');

  // Initial dump
  signals.forEach((sig, idx) => {
    const symbol = String.fromCharCode(33 + idx);
    const initialVal = sig.history[0]?.value ?? '0';
    if (sig.isBus) lines.push(`b${initialVal} ${symbol}`);
    else lines.push(`${initialVal}${symbol}`);
  });
  lines.push('$end');

  // Timesteps
  const timeSteps = Array.from(new Set(signals[0]?.history.map((h) => h.timeNs) ?? []));
  timeSteps.forEach((time) => {
    lines.push(`#${time}`);
    signals.forEach((sig, idx) => {
      const symbol = String.fromCharCode(33 + idx);
      const point = sig.history.find((h) => h.timeNs === time);
      if (point !== undefined) {
        if (sig.isBus) lines.push(`b${point.value} ${symbol}`);
        else lines.push(`${point.value}${symbol}`);
      }
    });
  });

  return lines.join('\n');
}
