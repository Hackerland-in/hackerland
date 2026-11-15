import type { CircuitoComponent } from './circuito-data';

export interface GeneratedCircuitCode {
  filename: string;
  code: string;
  librariesNeeded: string[];
}

export function generateCircuitCode(
  controller: CircuitoComponent,
  selectedComponents: CircuitoComponent[]
): GeneratedCircuitCode {
  const allComponents = [controller, ...selectedComponents];
  const allLibraries = Array.from(new Set(allComponents.flatMap((c) => c.libraries)));

  // 1. Gather all header includes & defines
  const includesSet = new Set<string>();
  includesSet.add('// ==========================================');
  includesSet.add('// HACKERLAND CIRCUITO ENGINE GENERATED CODE');
  includesSet.add(`// Target Controller: ${controller.name}`);
  includesSet.add('// Automatically generated wiring & test sketch');
  includesSet.add('// ==========================================');
  includesSet.add('');

  allComponents.forEach((comp) => {
    comp.codeIncludes.forEach((inc) => includesSet.add(inc));
  });

  // 2. Setup block
  const setupLines: string[] = [
    'void setup() {',
    '  // Initialize primary serial and I2C buses',
  ];

  allComponents.forEach((comp) => {
    if (comp.codeInit.trim()) {
      setupLines.push(`  // --- Setup for ${comp.name} ---`);
      setupLines.push(comp.codeInit);
    }
  });

  setupLines.push('  Serial.println("\\n[CIRCUITO] All peripherals initialized successfully!");');
  setupLines.push('}');

  // 3. Loop block
  const loopLines: string[] = [
    'void loop() {',
  ];

  allComponents.forEach((comp) => {
    if (comp.codeLoop.trim()) {
      loopLines.push(`  // --- Loop handler for ${comp.name} ---`);
      loopLines.push(comp.codeLoop);
      loopLines.push('');
    }
  });

  loopLines.push('  delay(200); // Main loop pacing delay');
  loopLines.push('}');

  const fullCode = [
    Array.from(includesSet).join('\n'),
    '',
    setupLines.join('\n'),
    '',
    loopLines.join('\n'),
  ].join('\n');

  return {
    filename: 'hackerland_circuito_test.ino',
    code: fullCode,
    librariesNeeded: allLibraries,
  };
}
