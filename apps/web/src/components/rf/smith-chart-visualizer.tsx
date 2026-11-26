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
  const cx = 200;
  const cy = 200;
  const r = 160;

  const toSvgCoords = (gammaReal: number, gammaImag: number) => {
    const mag = Math.sqrt(gammaReal * gammaReal + gammaImag * gammaImag);
    const clampedMag = Math.min(0.98, mag);
    const angle = Math.atan2(gammaImag, gammaReal);
    const effReal = clampedMag * Math.cos(angle);
    const effImag = clampedMag * Math.sin(angle);

    return {
      x: cx + effReal * r,
      y: cy - effImag * r,
    };
  };

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

  const vswrRadiusNorm = Math.min(0.95, Math.max(0.01, (vswr - 1) / (vswr + 1)));
  const vswrSvgRadius = vswrRadiusNorm * r;

  return (
    <div className="bg-sunken/70 border border-hairline rounded-2xl p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 text-xs text-fg-muted">
        <span className="font-mono uppercase font-bold tracking-wider text-accent-fg">
          Normalized Smith Chart (Z₀ = 50Ω)
        </span>
        <span className="font-mono">
          VSWR:{' '}
          <span className={vswr > 2.0 ? 'text-warning-fg font-bold' : 'text-success-fg font-bold'}>
            {vswr.toFixed(2)}:1
          </span>
        </span>
      </div>

      <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full select-none"
          aria-label="Interactive Smith Chart Visualizer"
        >
          <defs>
            <radialGradient id="smithBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fdf2f8" />
            </radialGradient>
            <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e11d74" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          <circle cx={cx} cy={cy} r={r} fill="url(#smithBg)" stroke="#cbd5e1" strokeWidth="2" />

          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />

          {rCircles.map((circle, idx) => (
            <circle
              key={idx}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              stroke={circle.isCenterCircle ? '#059669' : '#cbd5e1'}
              strokeWidth={circle.isCenterCircle ? '1.6' : '1'}
              opacity={circle.isCenterCircle ? 0.9 : 0.8}
            />
          ))}

          <circle cx={cx + r} cy={cy - r} r={r} fill="none" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 2" opacity="0.65" />
          <circle cx={cx + r} cy={cy + r} r={r} fill="none" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="2 2" opacity="0.65" />
          <circle cx={cx + r} cy={cy - 2 * r} r={2 * r} fill="none" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
          <circle cx={cx + r} cy={cy + 2 * r} r={2 * r} fill="none" stroke="#f9a8d4" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

          {vswr > 1.05 && (
            <circle
              cx={cx}
              cy={cy}
              r={vswrSvgRadius}
              fill="rgba(225, 29, 116, 0.06)"
              stroke="#e11d74"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="#059669" strokeWidth="2" />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="#059669" strokeWidth="2" />
          <text x={cx + 8} y={cy - 6} fill="#059669" fontSize="10" fontFamily="monospace" fontWeight="bold">
            50Ω (1.0)
          </text>

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

          {points.map((p, idx) => {
            const pt = toSvgCoords(p.real, p.imag);
            const isTarget = idx === points.length - 1;
            const isSource = idx === 0;

            return (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isTarget ? 5.5 : 4.5}
                  fill={isTarget ? '#059669' : isSource ? '#e11d74' : '#2563eb'}
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />
                <text
                  x={pt.x + 8}
                  y={pt.y + (pt.y > 200 ? 12 : -6)}
                  fill={isTarget ? '#047857' : isSource ? '#be185d' : '#1d4ed8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          <text x={cx - r + 10} y={cy - 12} fill="#475569" fontSize="9" fontFamily="monospace">
            Short (0Ω)
          </text>
          <text x={cx + r - 55} y={cy - 12} fill="#475569" fontSize="9" fontFamily="monospace">
            Open (∞Ω)
          </text>
          <text x={cx - 40} y={cy - r + 20} fill="#1d4ed8" fontSize="9" fontFamily="monospace" fontWeight="600">
            +jX (Inductive)
          </text>
          <text x={cx - 40} y={cy + r - 15} fill="#be185d" fontSize="9" fontFamily="monospace" fontWeight="600">
            -jX (Capacitive)
          </text>
        </svg>
      </div>

      <div className="w-full mt-3 flex items-center justify-around text-[11px] font-mono text-fg-muted border-t border-hairline pt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
          <span>Load Z_L</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-info inline-block" />
          <span>Matching Step</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
          <span>Matched 50Ω</span>
        </div>
      </div>
    </div>
  );
}
