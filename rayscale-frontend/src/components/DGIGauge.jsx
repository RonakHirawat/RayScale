import { useEffect, useRef, useState } from 'react';

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* Animated ring segment for the "halo" effect */
function HaloRing({ value, color, delay = 0, radius, width = 3, opacity = 0.15 }) {
  const circ = 2 * Math.PI * radius;
  return (
    <circle
      cx="110" cy="110" r={radius}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${circ * value} ${circ * (1 - value)}`}
      transform="rotate(-90 110 110)"
      opacity={opacity}
      style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    />
  );
}

export default function DGIGauge({ value = 0, animate = true }) {
  const [displayed, setDisplayed] = useState(0);
  const [arcValue, setArcValue] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (!animate) { setDisplayed(value); setArcValue(value); return; }

    const start = displayed;
    const end = value;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplayed(parseFloat(current.toFixed(3)));
      setArcValue(current);
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - arcValue);

  const getGaugeColor = (v) => {
    if (v >= 0.65) return {
      stroke: '#a3e635',
      glow: 'rgba(163,230,53,0.5)',
      text: '#a3e635',
      grad2: '#22d3ee',
      label: 'High',
    };
    if (v >= 0.35) return {
      stroke: '#fbbf24',
      glow: 'rgba(251,191,36,0.5)',
      text: '#fbbf24',
      grad2: '#fb923c',
      label: 'Moderate',
    };
    return {
      stroke: '#a78bfa',
      glow: 'rgba(167,139,250,0.5)',
      text: '#a78bfa',
      grad2: '#fb7185',
      label: 'Low',
    };
  };

  const colors = getGaugeColor(arcValue);
  const pct = Math.round(arcValue * 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 220, height: 220 }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          <defs>
            <filter id="gaugGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.stroke} />
              <stop offset="100%" stopColor={colors.grad2} />
            </linearGradient>

            <radialGradient id="innerBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16,8,38,0.9)" />
              <stop offset="100%" stopColor="rgba(6,4,15,0.95)" />
            </radialGradient>
          </defs>

          {/* Outer decorative halo rings */}
          <HaloRing value={arcValue} color={colors.stroke} radius={95} width={1.5} opacity={0.25} />
          <HaloRing value={1} color="rgba(139,92,246,0.12)" radius={95} width={1} opacity={1} />

          {/* Track ring */}
          <circle cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="rgba(139,92,246,0.1)"
            strokeWidth="14"
          />

          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const angle = tick * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 110 + (RADIUS - 16) * Math.cos(rad);
            const y1 = 110 + (RADIUS - 16) * Math.sin(rad);
            const x2 = 110 + (RADIUS + 6) * Math.cos(rad);
            const y2 = 110 + (RADIUS + 6) * Math.sin(rad);
            return (
              <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
            );
          })}

          {/* Progress arc */}
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 110 110)"
            filter="url(#gaugGlow)"
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />

          {/* Inner circle */}
          <circle cx="110" cy="110" r="62"
            fill="url(#innerBg)"
            stroke="rgba(139,92,246,0.15)"
            strokeWidth="1"
          />

          {/* Center DGI number */}
          <text x="110" y="100" textAnchor="middle" fontSize="38" fontWeight="900"
            fill={colors.text} fontFamily="Outfit, sans-serif"
            style={{ filter: `drop-shadow(0 0 10px ${colors.glow})` }}
          >
            {displayed.toFixed(2)}
          </text>

          <text x="110" y="117" textAnchor="middle" fontSize="10"
            fill="rgba(167,139,250,0.55)" fontFamily="Space Grotesk, sans-serif" fontWeight="600"
            letterSpacing="0.1em"
          >
            DAILY GROWTH INDEX
          </text>

          {/* Label badge */}
          <rect x="82" y="128" width="56" height="20" rx="10"
            fill={`${colors.stroke}18`} stroke={`${colors.stroke}40`} strokeWidth="1"
          />
          <text x="110" y="142" textAnchor="middle" fontSize="11" fontWeight="700"
            fill={colors.text} fontFamily="Space Grotesk, sans-serif"
          >
            {colors.label}
          </text>
        </svg>

        {/* CSS glow ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 50px ${colors.glow}`,
            borderRadius: '50%',
          }}
        />

        {/* Percentage badge top-right */}
        <div
          className="absolute top-3 right-3 text-xs font-black px-2 py-0.5 rounded-full stat-pop"
          style={{
            background: `${colors.stroke}18`,
            border: `1px solid ${colors.stroke}40`,
            color: colors.text,
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          {pct}%
        </div>
      </div>

      {/* Scale legend */}
      <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(167,139,250,0.5)' }}>
        {[
          { color: '#a78bfa', label: 'Low' },
          { color: '#fbbf24', label: 'Moderate' },
          { color: '#a3e635', label: 'High' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
