'use client';

interface AttitudeIndicatorProps {
  rollDeg: number;
  pitchDeg: number;
  size?: number;
}

export function AttitudeIndicator({ rollDeg, pitchDeg, size = 180 }: AttitudeIndicatorProps) {
  const clampedPitch = Math.max(-45, Math.min(45, pitchDeg));
  const clampedRoll = Math.max(-90, Math.min(90, rollDeg));
  const pitchPixelOffset = (clampedPitch / 45) * (size * 0.45);

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-2xl border border-hairline bg-surface-1 p-3 shadow-xs"
      style={{ width: size + 24, height: size + 56 }}
    >
      <div className="text-[11px] font-mono font-semibold tracking-wider text-fg-muted mb-1">
        ATTITUDE GYRO
      </div>
      <div
        className="relative overflow-hidden rounded-full border-2 border-accent/35 bg-sunken shadow-inner"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 transition-transform duration-75 ease-out"
          style={{
            transform: `rotate(${-clampedRoll}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Sky hemisphere */}
          <div
            className="absolute left-[-50%] right-[-50%] top-[-100%] h-[200%] bg-gradient-to-b from-sky-500 to-sky-400 transition-transform duration-75"
            style={{ transform: `translateY(${pitchPixelOffset}px)` }}
          >
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-on-solid">
                <span>+20°</span>
                <div className="h-0.5 w-12 bg-surface-1/90" />
                <span>+20°</span>
              </div>
              <div className="flex items-center space-x-2 text-[9px] font-mono text-on-solid">
                <span>+10°</span>
                <div className="h-0.5 w-8 bg-surface-1/90" />
                <span>+10°</span>
              </div>
            </div>
          </div>

          {/* Ground hemisphere */}
          <div
            className="absolute left-[-50%] right-[-50%] top-[50%] h-[200%] bg-gradient-to-b from-amber-700 to-amber-900 transition-transform duration-75"
            style={{ transform: `translateY(${pitchPixelOffset}px)` }}
          >
            <div className="h-0.5 w-full bg-surface-1 shadow-sm" />
            <div className="pt-3 flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-amber-100">
                <span>-10°</span>
                <div className="h-0.5 w-8 bg-amber-100/80" />
                <span>-10°</span>
              </div>
              <div className="flex items-center space-x-2 text-[9px] font-mono text-amber-100">
                <span>-20°</span>
                <div className="h-0.5 w-12 bg-amber-100/80" />
                <span>-20°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Aircraft Reticle */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full border border-surface-1 bg-accent shadow-sm" />
          <div className="absolute left-6 h-1 w-10 rounded-l bg-accent shadow-sm" />
          <div className="absolute left-16 h-3 w-1 bg-accent" />
          <div className="absolute right-6 h-1 w-10 rounded-r bg-accent shadow-sm" />
          <div className="absolute right-16 h-3 w-1 bg-accent" />
        </div>

        <div className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-accent-fg font-bold">
          ▼
        </div>
      </div>

      <div className="mt-2 flex items-center space-x-3 text-[11px] font-mono text-fg-muted">
        <span>
          Roll: <span className="text-accent-fg font-bold">{rollDeg.toFixed(1)}°</span>
        </span>
        <span>
          Pitch: <span className="text-fg font-bold">{pitchDeg.toFixed(1)}°</span>
        </span>
      </div>
    </div>
  );
}
