import { Droplets, Wheat, AlertCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

const urgencyConfig = {
  high: {
    Icon: AlertCircle,
    color: '#fb7185',
    bg: 'rgba(251,113,133,0.07)',
    border: 'rgba(251,113,133,0.3)',
    glow: '0 0 20px rgba(251,113,133,0.1)',
    label: 'Urgent',
    subtext: 'Immediate action recommended to support crop development.',
  },
  normal: {
    Icon: CheckCircle,
    color: '#a3e635',
    bg: 'rgba(163,230,53,0.07)',
    border: 'rgba(163,230,53,0.25)',
    glow: '0 0 20px rgba(163,230,53,0.08)',
    label: 'Optimal',
    subtext: 'Maintain current irrigation schedule for optimal growth.',
  },
  low: {
    Icon: XCircle,
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.07)',
    border: 'rgba(34,211,238,0.25)',
    glow: '0 0 20px rgba(34,211,238,0.08)',
    label: 'Reduce',
    subtext: 'Reduce water usage to prevent waterlogging and root damage.',
  },
};

export default function RecommendationCard({ irrigation, crops }) {
  const irr = urgencyConfig[irrigation?.urgency] || urgencyConfig.normal;
  const IrrIcon = irr.Icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 card-entry-3">
      {/* ── Irrigation ── */}
      <div
        className="glass-card p-5 hover-card"
        style={{
          border: `1px solid ${irr.border}`,
          boxShadow: irr.glow,
          background: irr.bg,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="w-4 h-4" style={{ color: '#22d3ee' }} />
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'rgba(167,139,250,0.55)' }}>
            Irrigation Recommendation
          </span>
          {/* Urgency pill */}
          <span
            className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{
              background: `${irr.color}15`,
              border: `1px solid ${irr.color}40`,
              color: irr.color,
            }}
          >
            {irr.label}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <IrrIcon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: irr.color }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e2d9f3' }}>
              {irrigation?.icon} {irrigation?.text}
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(167,139,250,0.55)' }}>
              {irr.subtext}
            </p>
          </div>
        </div>
      </div>

      {/* ── Crop Recommendations ── */}
      <div
        className="glass-card p-5 hover-card"
        style={{ border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Wheat className="w-4 h-4" style={{ color: '#fbbf24' }} />
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'rgba(167,139,250,0.55)' }}>
            Crop Recommendations
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: 'rgba(167,139,250,0.45)' }}>{crops?.title}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {crops?.crops.map((c, i) => (
            <span
              key={c.name}
              className="crop-tag"
              style={{
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {c.icon} {c.name}
            </span>
          ))}
        </div>

        <div
          className="text-xs leading-relaxed pt-3"
          style={{
            color: 'rgba(167,139,250,0.6)',
            borderTop: '1px solid rgba(139,92,246,0.12)',
          }}
        >
          <Lightbulb className="w-3.5 h-3.5 inline mr-1.5" style={{ color: '#fbbf24' }} />
          {crops?.advice}
        </div>
      </div>
    </div>
  );
}
