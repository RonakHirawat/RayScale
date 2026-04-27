import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const CONFIG = {
  High: {
    border: 'rgba(163, 230, 53, 0.35)',
    glow: '0 0 30px rgba(163, 230, 53, 0.15)',
    accent: '#a3e635',
    badge: { bg: 'rgba(163,230,53,0.1)', border: 'rgba(163,230,53,0.3)', text: '#a3e635' },
    barGrad: 'linear-gradient(90deg, #4ade80, #a3e635, #22d3ee)',
    icon: '🌿',
    IconComp: TrendingUp,
    description: 'Excellent photosynthetic potential. Plants can achieve maximum growth rate today.',
    tagline: 'Peak Conditions',
  },
  Moderate: {
    border: 'rgba(251, 191, 36, 0.35)',
    glow: '0 0 30px rgba(251, 191, 36, 0.12)',
    accent: '#fbbf24',
    badge: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    barGrad: 'linear-gradient(90deg, #fbbf24, #fb923c)',
    icon: '🌱',
    IconComp: Minus,
    description: 'Moderate growth conditions. Most crops will grow at 50–75% capacity.',
    tagline: 'Steady Growth',
  },
  Low: {
    border: 'rgba(167, 139, 250, 0.35)',
    glow: '0 0 30px rgba(167, 139, 250, 0.15)',
    accent: '#a78bfa',
    badge: { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', text: '#a78bfa' },
    barGrad: 'linear-gradient(90deg, #a78bfa, #fb7185)',
    icon: '🥀',
    IconComp: TrendingDown,
    description: 'Poor growth conditions. Consider protective measures and shade-tolerant crops.',
    tagline: 'Low Conditions',
  },
};

export default function GrowthCard({ label, dgi }) {
  const cfg = CONFIG[label] || CONFIG.Low;
  const barWidth = Math.round(dgi * 100);
  const [animBar, setAnimBar] = useState(0);
  const { IconComp } = cfg;

  useEffect(() => {
    const t = setTimeout(() => setAnimBar(barWidth), 80);
    return () => clearTimeout(t);
  }, [barWidth]);

  return (
    <div
      className="glass-card p-5 hover-card card-entry-2 flex flex-col gap-4"
      style={{
        border: `1px solid ${cfg.border}`,
        boxShadow: cfg.glow,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(167,139,250,0.55)' }}>
            Growth Condition
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cfg.icon}</span>
            <span className="text-2xl font-black" style={{ color: cfg.accent, fontFamily: 'Outfit, sans-serif' }}>
              {label}
            </span>
          </div>
          <p className="text-xs mt-1 font-semibold" style={{ color: `${cfg.accent}99` }}>
            {cfg.tagline}
          </p>
        </div>

        {/* Badge */}
        <div
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl"
          style={{ background: cfg.badge.bg, border: `1px solid ${cfg.badge.border}` }}
        >
          <IconComp className="w-4 h-4" style={{ color: cfg.accent }} />
          <span className="text-sm font-black" style={{ color: cfg.accent, fontFamily: 'Outfit, sans-serif' }}>
            {dgi.toFixed(3)}
          </span>
          <span className="text-xs" style={{ color: `${cfg.accent}80` }}>DGI</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(167,139,250,0.5)' }}>
          <span>Growth Rate</span>
          <span style={{ color: cfg.accent, fontWeight: 700 }}>{animBar}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.1)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${animBar}%`,
              background: cfg.barGrad,
              boxShadow: `0 0 10px ${cfg.accent}60`,
              transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(167,139,250,0.6)' }}>
        <Sparkles className="w-3 h-3 inline mr-1" style={{ color: cfg.accent }} />
        {cfg.description}
      </p>
    </div>
  );
}
