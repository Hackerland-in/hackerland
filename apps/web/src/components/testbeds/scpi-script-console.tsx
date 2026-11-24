'use client';

import { useState } from 'react';
import type { TestbedScriptRunner } from '@hackerland/core';
import { validateScpiCommandScript } from '@hackerland/core';

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

      // Generate realistic instrument response based on SCPI query
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
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              REMOTE INSTRUMENTATION SCRIPT RUNNER (SCPI / PyVISA)
            </h3>
          </div>
          <p className="text-[11px] text-stone-400">
            Automate frequency sweeps, battery cycling loops, and waveform captures via standardized SCPI socket
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {validation.isValid ? (
            <span className="rounded-md border border-emerald-500/50 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
              SYNTAX VALID ✓ ({validation.commandCount} Cmds)
            </span>
          ) : (
            <span className="rounded-md border border-red-500/50 bg-red-950/40 px-2.5 py-0.5 text-[10px] font-mono text-red-300">
              SYNTAX ERROR ({validation.errors.length})
            </span>
          )}
        </div>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Code Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span>SCPI SCRIPT COMMANDS</span>
            <button
              onClick={() => setScriptCode(scriptRunner.sampleScript)}
              className="text-amber-400 hover:underline text-[10px]"
            >
              Reset to Preset
            </button>
          </div>
          <textarea
            rows={10}
            value={scriptCode}
            onChange={(e) => setScriptCode(e.target.value)}
            className="w-full rounded-xl border border-stone-800 bg-stone-900/80 p-3 font-mono text-xs text-stone-200 focus:border-amber-500 focus:outline-none"
            spellCheck={false}
          />
          {validation.errors.map((err, idx) => (
            <div
              key={`err-${idx}`}
              className="rounded-lg border border-red-500/40 bg-red-950/30 p-2 text-xs font-mono text-red-300"
            >
              {err}
            </div>
          ))}
          {validation.warnings.map((w, idx) => (
            <div
              key={`warn-${idx}`}
              className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-2 text-[11px] font-mono text-amber-300"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Right: Live Terminal Reply Window */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span>INSTRUMENT ASCII RESPONSE BUS</span>
            <button
              onClick={() => setTerminalOutput([])}
              className="text-stone-500 hover:text-stone-300 text-[10px]"
            >
              Clear
            </button>
          </div>
          <div className="h-[210px] overflow-y-auto rounded-xl border border-stone-900 bg-black p-3 font-mono text-[11px] text-emerald-400 space-y-1">
            {terminalOutput.length === 0 ? (
              <span className="text-stone-600">
                {'//'} Click &apos;Execute SCPI Sequence&apos; below to query instrument over socket.
              </span>
            ) : (
              terminalOutput.map((log, idx) => (
                <div
                  key={`out-${idx}`}
                  className={log.startsWith('>>') ? 'text-stone-400' : 'text-emerald-400 font-semibold'}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-stone-800/80 pt-3">
        <div className="text-[11px] font-mono text-stone-500">
          Supported Protocols: {scriptRunner.supportedInterfaces.map((i) => i.toUpperCase()).join(', ')}
        </div>
        <button
          onClick={runSimulation}
          disabled={isRunning || !validation.isValid}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-md"
        >
          {isRunning ? 'Streaming SCPI...' : 'Execute SCPI Sequence ⚡'}
        </button>
      </div>
    </div>
  );
}
