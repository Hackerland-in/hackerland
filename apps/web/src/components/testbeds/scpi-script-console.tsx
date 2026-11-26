'use client';

import { useState } from 'react';
import type { TestbedScriptRunner } from '@hackerland/core';
import { validateScpiCommandScript } from '@hackerland/core';
import { Button } from '@hackerland/ui';

interface ScpiScriptConsoleProps {
  scriptRunner: TestbedScriptRunner;
  equipmentName: string;
}

export function ScpiScriptConsole({ scriptRunner, equipmentName }: ScpiScriptConsoleProps) {
  const [scriptCode, setScriptCode] = useState<string>(scriptRunner.sampleScript);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const validation = validateScpiCommandScript(scriptCode);

  const runSimulation = async () => {
    setIsRunning(true);
    setTerminalOutput([
      `[CLIENT] Connecting to instrument socket over ${scriptRunner.supportedInterfaces[0]?.toUpperCase() ?? 'LAN_SCPI'}...`,
      `[CLIENT] Connection established (Port 5025). Sending ${validation.commandCount} SCPI commands...`,
    ]);

    const lines = scriptCode
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

    for (const line of lines) {
      await new Promise((r) => setTimeout(r, 200));

      let response = '';
      const upper = line.toUpperCase();

      if (upper.includes('*IDN?')) {
        response = `${equipmentName},REV_3.4.12,SN_IN_2026_9011,FPGA_0x4A`;
      } else if (upper.includes('*RST')) {
        response = `[OK] Instrument registers reset to factory preset`;
      } else if (upper.includes(':MEAS:VOLT?')) {
        response = `+5.842100E+01 V`;
      } else if (upper.includes(':MEAS:CURR?')) {
        response = `+1.425000E+02 A`;
      } else if (upper.includes(':MEAS:TEMP?')) {
        response = `+3.420000E+01 C`;
      } else if (upper.includes(':CALC:MARK1:Y?')) {
        response = `-1.284000E+01 dBm`;
      } else if (upper.includes(':CALC:MARK1:X?')) {
        response = `+2.450000000E+09 Hz`;
      } else if (upper.includes(':ACQ:MEM:TRANS:VCD?')) {
        response = `$timescale 1ns $end\n$scope module testbed $end\n$var wire 1 # AXI_READY $end\n$dumpvars 1# $end`;
      } else if (upper.includes('?')) {
        response = `+1.000000E+00`;
      } else {
        response = `[ACK] ${line}`;
      }

      setTerminalOutput((prev) => [...prev, `>> ${line}`, `<< ${response}`]);
    }

    setTerminalOutput((prev) => [
      ...prev,
      `[CLIENT] Remote SCPI execution sequence finished successfully (0 instrument errors).`,
    ]);
    setIsRunning(false);
  };

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <h3 className="font-display text-xs font-bold tracking-wider text-fg uppercase">
              REMOTE INSTRUMENTATION SCRIPT RUNNER (SCPI / PyVISA)
            </h3>
          </div>
          <p className="text-[11px] text-fg-muted mt-0.5">
            Automate frequency sweeps, battery cycling loops, and waveform captures via standardized SCPI socket
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {validation.isValid ? (
            <span className="rounded-full border border-success/35 bg-success/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-success-fg">
              SYNTAX VALID ✓ ({validation.commandCount} Cmds)
            </span>
          ) : (
            <span className="rounded-full border border-danger/35 bg-danger/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-danger-fg">
              SYNTAX ERROR ({validation.errors.length})
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted">
            <span>SCPI SCRIPT COMMANDS</span>
            <button
              type="button"
              onClick={() => setScriptCode(scriptRunner.sampleScript)}
              className="text-accent-fg hover:underline font-semibold text-[10px]"
            >
              Reset to Preset
            </button>
          </div>
          <textarea
            rows={10}
            value={scriptCode}
            onChange={(e) => setScriptCode(e.target.value)}
            className="w-full rounded-xl border border-line bg-sunken p-3 font-mono text-xs text-fg focus:border-accent focus:outline-none"
            spellCheck={false}
          />
          {validation.errors.map((err, idx) => (
            <div
              key={`err-${idx}`}
              className="rounded-lg border border-danger/35 bg-danger/10 p-2 text-xs font-mono text-danger-fg"
            >
              {err}
            </div>
          ))}
          {validation.warnings.map((w, idx) => (
            <div
              key={`warn-${idx}`}
              className="rounded-lg border border-warning/35 bg-warning/10 p-2 text-[11px] font-mono text-warning-fg"
            >
              {w}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted">
            <span>INSTRUMENT ASCII RESPONSE BUS</span>
            <button
              type="button"
              onClick={() => setTerminalOutput([])}
              className="text-fg-subtle hover:text-fg text-[10px]"
            >
              Clear
            </button>
          </div>
          <div className="h-[210px] overflow-y-auto rounded-xl border border-hairline bg-sunken p-3 font-mono text-[11px] space-y-1">
            {terminalOutput.length === 0 ? (
              <span className="text-fg-subtle">
                {`// Click 'Execute SCPI Sequence' below to query instrument over socket.`}
              </span>
            ) : (
              terminalOutput.map((log, idx) => (
                <div
                  key={`out-${idx}`}
                  className={log.startsWith('>>') ? 'text-fg-muted' : 'text-accent-fg font-semibold'}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-3">
        <div className="text-[11px] font-mono text-fg-subtle">
          Supported Protocols: {scriptRunner.supportedInterfaces.map((i) => i.toUpperCase()).join(', ')}
        </div>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={runSimulation}
          disabled={isRunning || !validation.isValid}
        >
          {isRunning ? 'Streaming SCPI...' : 'Execute SCPI Sequence ⚡'}
        </Button>
      </div>
    </div>
  );
}
