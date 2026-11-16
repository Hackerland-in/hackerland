'use client';

interface SmithChartPoint {
  label: string;
  real: number;
  imag: number;
}

interface SmithChartVisualizerProps {
  points?: SmithChartPoint[];
  vswr?: number;
}

export function SmithChartVisualizer({
  points = [],
  vswr = 1.0,
}: SmithChartVisualizerProps) {
  // SVG Smith chart center is at (cx, cy) = (200, 200), radius R = 160
  const cx = 200;
  const cy = 200;
  const r = 160;

  // Convert normalized impedance gamma (real, imag) to SVG coordinates
  // Note: in Smith chart, gamma.real ranges from -1 to 1 (left to right)
  // gamma.imag ranges from -1 to 1 (bottom is capacitive, top is inductive)
  const toSvgCoords = (gammaReal: number, gammaImag: number) => {
    // clamp to boundary
    const mag = Math.sqrt(gammaReal * gammaReal + gammaImag * gammaImag);
    const clampedMag = Math.min(0.98, mag);
    const angle = Math.atan2(gammaImag, gammaReal);
    const effReal = clampedMag * Math.cos(angle);
    const effImag = clampedMag * Math.sin(angle);

    return {
      x: cx + effReal * r,
      y: cy - effImag * r, // invert Y for SVG
    };
  };

  // Precomputed constant resistance circles: r = [0, 0.5, 1.0, 2.0]
  // In reflection plane: center = (r / (r + 1), 0), radius = 1 / (r + 1)
  const rCircles = [
    { rVal: 0, label: '0' },
    { rVal: 0.5, label: '0.5' },
    { rVal: 1.0, label: '1.0 (50Ω)' },
    { rVal: 2.0, label: '2.0' },
    { rVal: 5.0, label: '5.0' },
  ].map(({ rVal, label }) => {
    const centerNormX = rVal / (rVal + 1);
    const radiusNorm = 1 / (rVal + 1);
    return {
      cx: cx + centerNormX * r,
      cy,
      r: radiusNorm * r,
      label,
      isCenterCircle: rVal === 1.0,
    };
  });

  // VSWR circle: radius = (VSWR - 1) / (VSWR + 1)
  const vswrRadiusNorm = Math.min(0.95, Math.max(0.01, (vswr - 1) / (vswr + 1)));
  const vswrSvgRadius = vswrRadiusNorm * r;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 text-xs text-stone-400">
        <span className="font-mono uppercase font-semibold tracking-wider text-emerald-400">
          Normalized Smith Chart (Z₀ = 50Ω)
        </span>
        <span className="font-mono">
          VSWR: <span className={vswr > 2.0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{vswr.toFixed(2)}:1</span>
        </span>
      </div>

      <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full select-none"
          aria-label="Interactive Smith Chart Visualizer"
        >
          <defs>
            {/* Background grid radial gradient */}
            <radialGradient id="smithBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0c1214" />
              <stop offset="100%" stopColor="#05080a" />
            </radialGradient>
            <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Outer circle perimeter */}
          <circle cx={cx} cy={cy} r={r} fill="url(#smithBg)" stroke="#334155" strokeWidth="2" />

          {/* Prime horizontal axis (Pure Real Resistance line) */}
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Constant Resistance Circles */}
          {rCircles.map((circle, idx) => (
            <circle
              key={idx}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              stroke={circle.isCenterCircle ? '#10b981' : '#334155'}
              strokeWidth={circle.isCenterCircle ? '1.5' : '1'}
              opacity={circle.isCenterCircle ? 0.8 : 0.4}
            />
          ))}

          {/* Constant Reactance Arcs (Top = Inductive +jX, Bottom = Capacitive -jX) */}
          {/* Reactance x = +1.0 and -1.0 */}
          {/* Center = (1, 1/x), Radius = 1/x */}
          <circle cx={cx + r} cy={cy - r} r={r} fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" clipPath="url(#chartClip)" />
          <circle cx={cx + r} cy={cy + r} r={r} fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" clipPath="url(#chartClip)" />
          {/* Reactance x = +0.5 and -0.5 */}
          <circle cx={cx + r} cy={cy - 2 * r} r={2 * r} fill="none" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.25" />
          <circle cx={cx + r} cy={cy + 2 * r} r={2 * r} fill="none" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.25" />

          {/* VSWR Circle centered at (200, 200) */}
          {vswr > 1.05 && (
            <circle
              cx={cx}
              cy={cy}
              r={vswrSvgRadius}
              fill="rgba(16, 185, 129, 0.05)"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Perfectly Matched 50Ω Center Crosshair */}
          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="#10b981" strokeWidth="2" />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="#10b981" strokeWidth="2" />
          <text x={cx + 8} y={cy - 6} fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
            50Ω (1.0)
          </text>

          {/* Impedance trajectory line connecting points */}
          {points.length > 1 && (
            <polyline
              points={points
                .map((p) => {
                  const pt = toSvgCoords(p.real, p.imag);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ')}
              fill="none"
              stroke="url(#traceGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Point markers */}
          {points.map((p, idx) => {
            const pt = toSvgCoords(p.real, p.imag);
            const isTarget = idx === points.length - 1;
            const isSource = idx === 0;

            return (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isTarget ? 5 : 4}
                  fill={isTarget ? '#10b981' : isSource ? '#f59e0b' : '#06b6d4'}
                  stroke="#000"
                  strokeWidth="1.5"
                />
                <text
                  x={pt.x + 8}
                  y={pt.y + (pt.y > 200 ? 12 : -6)}
                  fill={isTarget ? '#10b981' : isSource ? '#f59e0b' : '#38bdf8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* Labels for regions */}
          <text x={cx - r + 10} y={cy - 12} fill="#64748b" fontSize="9" fontFamily="monospace">
            Short (0Ω)
          </text>
          <text x={cx + r - 55} y={cy - 12} fill="#64748b" fontSize="9" fontFamily="monospace">
            Open (∞Ω)
          </text>
          <text x={cx - 40} y={cy - r + 20} fill="#0ea5e9" fontSize="9" fontFamily="monospace">
            +jX (Inductive)
          </text>
          <text x={cx - 40} y={cy + r - 15} fill="#ec4899" fontSize="9" fontFamily="monospace">
            -jX (Capacitive)
          </text>
        </svg>
      </div>

      <div className="w-full mt-3 flex items-center justify-around text-[11px] font-mono text-stone-400 border-t border-stone-800 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Load Z_L</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
          <span>Matching Step</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Matched 50Ω</span>
        </div>
      </div>
    </div>
  );
}
