export interface RiscvRegister {
  index: number;
  name: string;
  abiName: string;
  role: string;
  value: number;
}

export interface ParsedInstruction {
  address: number;
  rawText: string;
  mnemonic: string;
  machineCode: string;
  rd?: number;
  rs1?: number;
  rs2?: number;
  imm?: number;
  label?: string;
  comment?: string;
}

export interface CpuPipeline {
  fetch: string;
  decode: string;
  execute: string;
  memory: string;
  writeback: string;
}

export interface CpuState {
  pc: number;
  registers: number[];
  lastModifiedReg: number | null;
  cycles: number;
  instructionCount: number;
  memory: Record<number, number>; // address -> 32-bit word
  lastMemoryAccess: { address: number; isWrite: boolean; value: number } | null;
  flags: {
    zero: boolean;
    negative: boolean;
    overflow: boolean;
  };
  pipeline: CpuPipeline;
  isHalted: boolean;
}

export interface IssProgramPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  theory: string;
  formula: string;
  sourceCode: string;
  expectedResult: string;
  initialMemory?: Record<number, number>;
}

export const ABI_REGISTER_NAMES = [
  'zero', // x0
  'ra',   // x1 (return address)
  'sp',   // x2 (stack pointer)
  'gp',   // x3 (global pointer)
  'tp',   // x4 (thread pointer)
  't0',   // x5 (temporary 0)
  't1',   // x6 (temporary 1)
  't2',   // x7 (temporary 2)
  's0',   // x8 (saved 0 / frame pointer)
  's1',   // x9 (saved 1)
  'a0',   // x10 (function arg / return 0)
  'a1',   // x11 (function arg / return 1)
  'a2',   // x12 (function arg 2)
  'a3',   // x13 (function arg 3)
  'a4',   // x14 (function arg 4)
  'a5',   // x15 (function arg 5)
  'a6',   // x16 (function arg 6)
  'a7',   // x17 (function arg 7 / syscall)
  's2',   // x18 (saved 2)
  's3',   // x19 (saved 3)
  's4',   // x20 (saved 4)
  's5',   // x21 (saved 5)
  's6',   // x22 (saved 6)
  's7',   // x23 (saved 7)
  's8',   // x24 (saved 8)
  's9',   // x25 (saved 9)
  's10',  // x26 (saved 10)
  's11',  // x27 (saved 11)
  't3',   // x28 (temporary 3)
  't4',   // x29 (temporary 4)
  't5',   // x30 (temporary 5)
  't6',   // x31 (temporary 6)
];

export const REGISTER_ROLES: Record<string, string> = {
  zero: 'Hardwired Constant Zero (0x0)',
  ra: 'Return Address for subroutine calls',
  sp: 'Top of Stack Pointer (0x7FFFFFF0)',
  gp: 'Global Pointer for static memory',
  tp: 'Thread Pointer (TLS base)',
  t0: 'Temporary register / scratchpad',
  t1: 'Temporary register / scratchpad',
  t2: 'Temporary register / scratchpad',
  s0: 'Saved register / Frame pointer',
  s1: 'Saved register across calls',
  a0: 'Function Argument 0 / Return value',
  a1: 'Function Argument 1 / Return value',
  a2: 'Function Argument 2',
  a3: 'Function Argument 3',
  a4: 'Function Argument 4',
  a5: 'Function Argument 5',
  a6: 'Function Argument 6',
  a7: 'Function Argument 7 / Syscall ID',
  s2: 'Saved register 2',
  s3: 'Saved register 3',
  s4: 'Saved register 4',
  s5: 'Saved register 5',
  s6: 'Saved register 6',
  s7: 'Saved register 7',
  s8: 'Saved register 8',
  s9: 'Saved register 9',
  s10: 'Saved register 10',
  s11: 'Saved register 11',
  t3: 'Temporary register 3',
  t4: 'Temporary register 4',
  t5: 'Temporary register 5',
  t6: 'Temporary register 6',
};

export const ISS_PRESETS: IssProgramPreset[] = [
  {
    id: 'fibonacci',
    title: 'Fibonacci Series Computation (RV32I Loop)',
    category: 'Iterative Algorithms',
    description: 'Computes the first 8 numbers of the Fibonacci sequence using registers a0, a1, and stores into memory buffer at 0x1000.',
    theory: 'An Instruction Set Simulator models a Von Neumann CPU with sequential instruction fetch, register file modification, and conditional branch evaluations. Fibonacci iteratively updates F_{n} = F_{n-1} + F_{n-2} using ADDI, ADD, and BNE loop control.',
    formula: 'F_n = F_{n-1} + F_{n-2} \\quad \\text{with } F_0=0, F_1=1',
    expectedResult: 'Memory at 0x1000 contains F_7 = 13 (0x0000000D), a0 contains 13, a1 contains 21',
    sourceCode: `# RISC-V RV32I Assembly - Fibonacci Sequence
# Computes Fibonacci numbers and writes to Data RAM (0x1000)

_start:
    addi  t0, zero, 0x1000   # t0 = Base RAM Address 0x1000
    addi  a0, zero, 0        # a0 = F(0) = 0
    addi  a1, zero, 1        # a1 = F(1) = 1
    addi  t1, zero, 7        # t1 = Loop Counter = 7 iterations
    sw    a0, 0(t0)          # Store F(0) at 0x1000

loop:
    add   t2, a0, a1         # t2 = F(n) = F(n-2) + F(n-1)
    addi  t0, t0, 4          # Increment memory pointer by 4 bytes
    sw    t2, 0(t0)          # Store F(n) in RAM
    add   a0, zero, a1       # a0 = a1
    add   a1, zero, t2       # a1 = t2
    addi  t1, t1, -1         # Decrement counter
    bne   t1, zero, loop     # If counter != 0, continue loop

halt:
    ecall                    # Terminate program execution
`,
  },
  {
    id: 'array-sum',
    title: 'Array Summation & Memory Load/Store (LW / SW)',
    category: 'Memory & Pointers',
    description: 'Iterates through an integer array stored in Data RAM (0x1000), loads each word with LW, calculates the total sum, and stores back.',
    theory: 'Demonstrates RISC-V byte-addressed load-store architecture. Data must be transferred between memory and registers using explicit LW (Load Word) and SW (Store Word) instructions. Pointer arithmetic offsets addresses by 4 bytes per 32-bit word.',
    formula: '\\text{Sum} = \\sum_{i=0}^{N-1} \\text{Array}[i] \\quad \\text{Address}_{i} = \\text{Base} + 4i',
    expectedResult: 'Array [10, 25, 40, 5, 100] summed to 180 (0x000000B4) in register s0 and stored at 0x1014.',
    initialMemory: {
      0x1000: 10,
      0x1004: 25,
      0x1008: 40,
      0x100c: 5,
      0x1010: 100,
    },
    sourceCode: `# RISC-V RV32I Assembly - Array Summation
# Reads 5 elements from 0x1000..0x1010 and saves sum at 0x1014

_start:
    addi  t0, zero, 0x1000   # t0 = Base address of array
    addi  t1, zero, 5        # t1 = Number of elements
    addi  s0, zero, 0        # s0 = Total Accumulator (Sum = 0)

sum_loop:
    lw    t2, 0(t0)          # Load word from memory: t2 = Mem[t0]
    add   s0, s0, t2         # s0 = s0 + t2
    addi  t0, t0, 4          # Move pointer to next element (+4 bytes)
    addi  t1, t1, -1         # Decrement loop count
    bne   t1, zero, sum_loop # Continue if elements remain

save_result:
    sw    s0, 0(t0)          # Store final sum at 0x1014
    ecall                    # Halt CPU
`,
  },
  {
    id: 'factorial-loop',
    title: 'Factorial Calculation with Conditional Branches',
    category: 'Arithmetic & Control Flow',
    description: 'Calculates 5! (5 factorial = 120) using repeated multiplication and conditional branch evaluation (BNE/BLT).',
    theory: 'Shows conditional instruction sequencing and accumulator pattern in integer arithmetic. Evaluates branch hazard avoidance and loop termination flags.',
    formula: 'N! = N \\times (N-1) \\times \\cdots \\times 1 \\quad 5! = 120 \\text{ (0x78)}',
    expectedResult: 'Register a0 = 120 (0x00000078), loops 4 times.',
    sourceCode: `# RISC-V RV32I Assembly - Factorial of 5
# Computes 5! = 5 * 4 * 3 * 2 * 1 = 120

_start:
    addi  a0, zero, 1        # a0 = Result accumulator (init to 1)
    addi  t0, zero, 5        # t0 = N = 5
    addi  t1, zero, 1        # t1 = Constant 1 for comparison

fact_loop:
    # Multiply accumulator a0 by t0 using addition loop
    add   t2, zero, a0       # t2 = Current multiplicand
    addi  t3, t0, -1         # t3 = Multiplier loop counter

mult_loop:
    beq   t3, zero, mult_done
    add   a0, a0, t2         # a0 += t2
    addi  t3, t3, -1
    bne   t3, zero, mult_loop

mult_done:
    addi  t0, t0, -1         # Decrement N
    bne   t0, t1, fact_loop  # Loop while N > 1

end:
    ecall                    # Done: a0 contains 120 (0x78)
`,
  },
  {
    id: 'bitwise-logic',
    title: 'Bitwise Masking, Shift & Parity Check',
    category: 'Bit Manipulation & Logic',
    description: 'Performs bitwise AND, OR, XOR, SLLI (Shift Left Logical), and SRLI (Shift Right Logical) on 32-bit words.',
    theory: 'In microprocessors, bit manipulation instructions are vital for device driver registers, peripheral control, and encryption. SLLI shifts bits left, doubling values by powers of 2, while AND applies bitmasks.',
    formula: '\\text{Mask} = X \\,\\&\\, 0x0F \\quad \\text{Shift} = X \\ll 4 \\quad \\text{XOR Parity} = X \\oplus Y',
    expectedResult: 'Shifted values verified in t1, t2; masked byte in t3.',
    sourceCode: `# RISC-V RV32I Assembly - Bitwise Operations & Shifts
# Tests ALU logical bit manipulations

_start:
    addi  t0, zero, 0x2A      # t0 = 42 (0x0000002A, binary 00101010)
    slli  t1, t0, 4          # t1 = t0 << 4 = 672 (0x000002A0)
    srli  t2, t1, 2          # t2 = t1 >> 2 = 168 (0x000000A8)
    andi  t3, t2, 0x0F       # t3 = t2 & 0x0F = 8   (0x00000008)
    ori   t4, t3, 0x30       # t4 = t3 | 0x30 = 56  (0x00000038)
    xori  t5, t4, 0x38       # t5 = t4 ^ 0x38 = 0   (Zero Flag active)

halt:
    ecall
`,
  },
];

// Helper to resolve register index from name or number
export function resolveRegisterIndex(nameOrAbi: string): number {
  const clean = nameOrAbi.trim().toLowerCase().replace(',', '');
  if (clean.startsWith('x')) {
    const num = parseInt(clean.substring(1), 10);
    if (!isNaN(num) && num >= 0 && num <= 31) return num;
  }
  const abiIdx = ABI_REGISTER_NAMES.indexOf(clean);
  if (abiIdx !== -1) return abiIdx;
  return 0;
}

// Generate pseudo-machine code hex for display (RV32I style encoding)
export function encodePseudoMachineCode(mnemonic: string, rd?: number, rs1?: number, rs2?: number, imm?: number): string {
  // Return clean 32-bit hex
  const m = mnemonic.toUpperCase();
  let baseOpcode = 0x13; // default OP-IMM (ADDI)
  if (['ADD', 'SUB', 'AND', 'OR', 'XOR'].includes(m)) baseOpcode = 0x33; // R-type
  else if (['LW'].includes(m)) baseOpcode = 0x03; // I-type load
  else if (['SW'].includes(m)) baseOpcode = 0x23; // S-type store
  else if (['BEQ', 'BNE', 'BLT', 'BGE'].includes(m)) baseOpcode = 0x63; // B-type branch
  else if (['JAL'].includes(m)) baseOpcode = 0x6f; // J-type
  else if (['ECALL'].includes(m)) return '0x00000073';

  const rdBits = ((rd ?? 0) & 0x1f) << 7;
  const rs1Bits = ((rs1 ?? 0) & 0x1f) << 15;
  const rs2Bits = ((rs2 ?? 0) & 0x1f) << 20;
  const immBits = ((imm ?? 0) & 0xfff) << 20;

  const code = (immBits | rs2Bits | rs1Bits | rdBits | baseOpcode) >>> 0;
  return '0x' + code.toString(16).padStart(8, '0').toUpperCase();
}

// Parse Assembly Source into executable instructions
export function parseAssembly(source: string): ParsedInstruction[] {
  const lines = source.split('\n');
  const instructions: ParsedInstruction[] = [];
  let currentAddress = 0x0000;
  const labels: Record<string, number> = {};

  // First pass: scan labels
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const commentSplit = trimmed.split('#');
    const codePart = commentSplit[0]!.trim();
    if (codePart.includes(':')) {
      const parts = codePart.split(':');
      const labelName = parts[0]!.trim();
      labels[labelName] = currentAddress;
      const remainingCode = parts[1]?.trim();
      if (remainingCode) {
        currentAddress += 4;
      }
    } else {
      currentAddress += 4;
    }
  }

  // Second pass: parse instructions
  currentAddress = 0x0000;
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const commentParts = rawLine.split('#');
    const comment = commentParts.length > 1 ? commentParts.slice(1).join('#').trim() : undefined;
    let codePart = commentParts[0]!.trim();

    let labelFound: string | undefined;
    if (codePart.includes(':')) {
      const parts = codePart.split(':');
      labelFound = parts[0]!.trim();
      codePart = parts[1]?.trim() ?? '';
    }

    if (!codePart) continue;

    // Tokenize
    const tokens = codePart.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    const mnemonic = tokens[0]!.toUpperCase();

    let rd: number | undefined;
    let rs1: number | undefined;
    let rs2: number | undefined;
    let imm: number | undefined;

    if (mnemonic === 'ECALL') {
      // No operands
    } else if (['ADDI', 'ANDI', 'ORI', 'XORI', 'SLLI', 'SRLI'].includes(mnemonic)) {
      rd = resolveRegisterIndex(tokens[1] ?? 'x0');
      rs1 = resolveRegisterIndex(tokens[2] ?? 'x0');
      const immStr = tokens[3] ?? '0';
      imm = immStr.startsWith('0x') ? parseInt(immStr, 16) : parseInt(immStr, 10);
    } else if (['ADD', 'SUB', 'AND', 'OR', 'XOR'].includes(mnemonic)) {
      rd = resolveRegisterIndex(tokens[1] ?? 'x0');
      rs1 = resolveRegisterIndex(tokens[2] ?? 'x0');
      rs2 = resolveRegisterIndex(tokens[3] ?? 'x0');
    } else if (['LW', 'SW'].includes(mnemonic)) {
      const reg = resolveRegisterIndex(tokens[1] ?? 'x0');
      // Format: offset(rs1) e.g. 0(t0) or 4(t0)
      const memOp = tokens[2] ?? '0(x0)';
      const match = memOp.match(/(-?\w+)\((\w+)\)/);
      if (match) {
        const offsetStr = match[1] ?? '0';
        imm = offsetStr.startsWith('0x') ? parseInt(offsetStr, 16) : parseInt(offsetStr, 10);
        rs1 = resolveRegisterIndex(match[2] ?? 'x0');
      } else {
        imm = 0;
        rs1 = resolveRegisterIndex(memOp);
      }
      if (mnemonic === 'LW') {
        rd = reg;
      } else {
        rs2 = reg;
      }
    } else if (['BEQ', 'BNE', 'BLT', 'BGE'].includes(mnemonic)) {
      rs1 = resolveRegisterIndex(tokens[1] ?? 'x0');
      rs2 = resolveRegisterIndex(tokens[2] ?? 'x0');
      const targetLabel = tokens[3] ?? '';
      if (labels[targetLabel] !== undefined) {
        imm = labels[targetLabel]; // absolute or relative target
      } else {
        imm = parseInt(targetLabel, 10) || 0;
      }
    }

    const machineCode = encodePseudoMachineCode(mnemonic, rd, rs1, rs2, imm);

    instructions.push({
      address: currentAddress,
      rawText: codePart,
      mnemonic,
      machineCode,
      rd,
      rs1,
      rs2,
      imm,
      label: labelFound,
      comment,
    });

    currentAddress += 4;
  }

  return instructions;
}

// Initialize CPU state from preset
export function initCpuState(preset: IssProgramPreset): CpuState {
  const registers = new Array(32).fill(0);
  // sp = 0x7FFFFFF0 (typical RISC-V stack pointer initialization)
  registers[2] = 0x7ffffff0;

  return {
    pc: 0x0000,
    registers,
    lastModifiedReg: null,
    cycles: 0,
    instructionCount: 0,
    memory: { ...(preset.initialMemory ?? {}) },
    lastMemoryAccess: null,
    flags: { zero: false, negative: false, overflow: false },
    pipeline: {
      fetch: 'IDLE',
      decode: 'IDLE',
      execute: 'IDLE',
      memory: 'IDLE',
      writeback: 'IDLE',
    },
    isHalted: false,
  };
}

// Single step execution of instruction in ISS
export function stepCpu(state: CpuState, instructions: ParsedInstruction[]): CpuState {
  if (state.isHalted) return state;

  const instr = instructions.find((i) => i.address === state.pc);
  if (!instr) {
    return {
      ...state,
      isHalted: true,
      pipeline: {
        fetch: 'HALT',
        decode: 'HALT',
        execute: 'HALT',
        memory: 'HALT',
        writeback: 'HALT',
      },
    };
  }

  const nextRegs = [...state.registers];
  const nextMem = { ...state.memory };
  let nextPc = state.pc + 4;
  let modifiedReg: number | null = null;
  let memAccess: { address: number; isWrite: boolean; value: number } | null = null;

  const rs1Val = instr.rs1 !== undefined ? (nextRegs[instr.rs1] ?? 0) : 0;
  const rs2Val = instr.rs2 !== undefined ? (nextRegs[instr.rs2] ?? 0) : 0;
  const immVal = instr.imm ?? 0;

  let aluResult = 0;

  switch (instr.mnemonic) {
    case 'ADDI':
      aluResult = (rs1Val + immVal) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'ADD':
      aluResult = (rs1Val + rs2Val) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'SUB':
      aluResult = (rs1Val - rs2Val) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'AND':
      aluResult = (rs1Val & rs2Val) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'ANDI':
      aluResult = (rs1Val & immVal) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'OR':
      aluResult = (rs1Val | rs2Val) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'ORI':
      aluResult = (rs1Val | immVal) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'XOR':
      aluResult = (rs1Val ^ rs2Val) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'XORI':
      aluResult = (rs1Val ^ immVal) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'SLLI':
      aluResult = (rs1Val << (immVal & 0x1f)) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'SRLI':
      aluResult = (rs1Val >>> (immVal & 0x1f)) | 0;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = aluResult;
        modifiedReg = instr.rd;
      }
      break;

    case 'LW': {
      const targetAddr = (rs1Val + immVal) >>> 0;
      const loadedVal = nextMem[targetAddr] ?? 0;
      aluResult = loadedVal;
      if (instr.rd && instr.rd !== 0) {
        nextRegs[instr.rd] = loadedVal;
        modifiedReg = instr.rd;
      }
      memAccess = { address: targetAddr, isWrite: false, value: loadedVal };
      break;
    }

    case 'SW': {
      const targetAddr = (rs1Val + immVal) >>> 0;
      nextMem[targetAddr] = rs2Val;
      aluResult = rs2Val;
      memAccess = { address: targetAddr, isWrite: true, value: rs2Val };
      break;
    }

    case 'BEQ':
      if (rs1Val === rs2Val) {
        nextPc = immVal;
      }
      break;

    case 'BNE':
      if (rs1Val !== rs2Val) {
        nextPc = immVal;
      }
      break;

    case 'BLT':
      if (rs1Val < rs2Val) {
        nextPc = immVal;
      }
      break;

    case 'BGE':
      if (rs1Val >= rs2Val) {
        nextPc = immVal;
      }
      break;

    case 'ECALL':
      return {
        ...state,
        cycles: state.cycles + 1,
        instructionCount: state.instructionCount + 1,
        isHalted: true,
        pipeline: {
          fetch: 'ECALL (Syscall Exit)',
          decode: 'HALT',
          execute: 'HALT',
          memory: 'IDLE',
          writeback: 'IDLE',
        },
      };

    default:
      break;
  }

  // Hardwire x0 to 0
  nextRegs[0] = 0;

  // Flags
  const flags = {
    zero: aluResult === 0,
    negative: aluResult < 0,
    overflow: aluResult > 0x7fffffff || aluResult < -0x80000000,
  };

  // Pipeline representation
  const nextPipeline: CpuPipeline = {
    fetch: `0x${nextPc.toString(16).padStart(4, '0').toUpperCase()}: ${instr.mnemonic}`,
    decode: `Op=${instr.mnemonic} rd=${instr.rd ?? '-'} rs1=${instr.rs1 ?? '-'}`,
    execute: `ALU: ${aluResult} (0x${(aluResult >>> 0).toString(16).toUpperCase()})`,
    memory: memAccess
      ? `${memAccess.isWrite ? 'WRITE' : 'READ'} 0x${memAccess.address.toString(16).toUpperCase()}: ${memAccess.value}`
      : 'NONE',
    writeback: modifiedReg !== null ? `x${modifiedReg} (${ABI_REGISTER_NAMES[modifiedReg]}) <= ${nextRegs[modifiedReg]}` : 'NONE',
  };

  return {
    pc: nextPc,
    registers: nextRegs,
    lastModifiedReg: modifiedReg,
    cycles: state.cycles + 1,
    instructionCount: state.instructionCount + 1,
    memory: nextMem,
    lastMemoryAccess: memAccess,
    flags,
    pipeline: nextPipeline,
    isHalted: false,
  };
}
