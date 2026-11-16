'use client';

interface AttitudeIndicatorProps {
  rollDeg: number;
  pitchDeg: number;
  size?: number;
}

export function AttitudeIndicator({ rollDeg, pitchDeg, size = 180 }: AttitudeIndicatorProps) {
  // Constrain pitch to sensible visual range (-45 to 45 degrees translates to vertical offset)
  const clampedPitch = Math.max(-45, Math.min(45, pitchDeg));
  const clampedRoll = Math.max(-90, Math.min(90, rollDeg));

  // Each degree of pitch moves the horizon by 1.2% of height
  const pitchPixelOffset = (clampedPitch / 45) * (size * 0.45);

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-stone-950 p-3 shadow-inner"
      style={{ width: size + 24, height: size + 56 }}
    >
      <div className="text-xs font-mono tracking-wider text-stone-400 mb-1">ATTITUDE GYRO</div>
      <div
        className="relative overflow-hidden rounded-full border-2 border-stone-700 bg-stone-900 shadow-lg"
        style={{ width: size, height: size }}
      >
        {/* Rotating Horizon container based on roll and pitch */}
        <div
          className="absolute inset-0 transition-transform duration-75 ease-out"
          style={{
            transform: `rotate(${-clampedRoll}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Sky (Upper Half) */}
          <div
            className="absolute left-[-50%] right-[-50%] top-[-100%] h-[200%] bg-gradient-to-b from-sky-600 to-sky-500 transition-transform duration-75"
            style={{
              transform: `translateY(${pitchPixelOffset}px)`,
            }}
          >
            {/* Pitch ladder lines (positive pitch / nose up) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-white/80">
                <span>+20°</span>
                <div className="h-0.5 w-12 bg-white/80" />
                <span>+20°</span>
              </div>
              <div className="flex items-center space-x-2 text-[9px] font-mono text-white/80">
                <span>+10°</span>
                <div className="h-0.5 w-8 bg-white/80" />
                <span>+10°</span>
              </div>
            </div>
          </div>

          {/* Earth / Ground (Lower Half) */}
          <div
            className="absolute left-[-50%] right-[-50%] top-[50%] h-[200%] bg-gradient-to-b from-amber-800 to-stone-900 transition-transform duration-75"
            style={{
              transform: `translateY(${pitchPixelOffset}px)`,
            }}
          >
            {/* Horizon separator line */}
            <div className="h-0.5 w-full bg-white shadow-sm" />
            {/* Pitch ladder lines (negative pitch / nose down) */}
            <div className="pt-3 flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-amber-200/80">
                <span>-10°</span>
                <div className="h-0.5 w-8 bg-amber-200/80" />
                <span>-10°</span>
              </div>
              <div className="flex items-center space-x-2 text-[9px] font-mono text-amber-200/80">
                <span>-20°</span>
                <div className="h-0.5 w-12 bg-amber-200/80" />
                <span>-20°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Aircraft Reticle / Crosshair */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Center pip */}
          <div className="h-2 w-2 rounded-full border border-amber-400 bg-amber-400 shadow-sm" />
          {/* Left Wing bar */}
          <div className="absolute left-6 h-1 w-10 rounded-l bg-amber-400 shadow-sm" />
          <div className="absolute left-16 h-3 w-1 bg-amber-400" />
          {/* Right Wing bar */}
          <div className="absolute right-6 h-1 w-10 rounded-r bg-amber-400 shadow-sm" />
          <div className="absolute right-16 h-3 w-1 bg-amber-400" />
        </div>

        {/* Outer Roll Reticle Top Marker */}
        <div className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-amber-400 font-bold">
          ▼
        </div>
      </div>

      {/* Readout label */}
      <div className="mt-2 flex w-full justify-around text-[11px] font-mono">
        <span className="text-stone-400">
          Roll: <strong className="text-white">{clampedRoll.toFixed(1)}°</strong>
        </span>
        <span className="text-stone-400">
          Pitch: <strong className="text-white">{clampedPitch.toFixed(1)}°</strong>
        </span>
      </div>
    </div>
  );
}
