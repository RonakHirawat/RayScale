import { Thermometer, Droplets, Wind, CloudRain, Eye, Gauge, MapPin } from 'lucide-react';

const weatherCards = [
  {
    key: 'temperature', label: 'Temperature', unit: '°C',
    Icon: Thermometer, color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.25)',
    format: (v) => `${v}°C`,
  },
  {
    key: 'humidity', label: 'Humidity', unit: '%',
    Icon: Droplets, color: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.22)',
    format: (v) => `${v}%`,
  },
  {
    key: 'windSpeed', label: 'Wind Speed', unit: 'm/s',
    Icon: Wind, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.22)',
    format: (v) => `${v} m/s`,
  },
  {
    key: 'precipitation', label: 'Precipitation', unit: 'mm',
    Icon: CloudRain, color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.22)',
    format: (v) => `${v} mm`,
  },
  {
    key: 'pressure', label: 'Pressure', unit: 'hPa',
    Icon: Gauge, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.22)',
    format: (v) => v ? `${v} hPa` : '—',
  },
  {
    key: 'visibility', label: 'Visibility', unit: 'km',
    Icon: Eye, color: '#a3e635', bg: 'rgba(163,230,53,0.08)', border: 'rgba(163,230,53,0.22)',
    format: (v) => v ? `${v} km` : '—',
  },
];

export default function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <div
      className="glass-card p-5 hover-card card-entry-4"
      style={{ border: '1px solid rgba(139,92,246,0.2)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#a3e635' }} />
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(167,139,250,0.55)' }}>
              Live Weather Data
            </span>
          </div>
          {data.city && (
            <p className="text-sm font-semibold mt-1 flex items-center gap-1" style={{ color: '#e2d9f3' }}>
              <MapPin className="w-3 h-3" style={{ color: '#fb7185' }} />
              {data.city}{data.country ? `, ${data.country}` : ''}
            </p>
          )}
        </div>
        {data.description && (
          <span
            className="text-xs capitalize px-3 py-1 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#a78bfa',
            }}
          >
            {data.description}
          </span>
        )}
      </div>

      {/* Demo notice */}
      {data.isDemo && (
        <div
          className="mb-3 text-xs rounded-xl px-3 py-2"
          style={{
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.25)',
            color: '#fbbf24',
          }}
        >
          ⚠️ Demo data – configure{' '}
          <code className="font-mono px-1 rounded" style={{ background: 'rgba(251,191,36,0.12)' }}>
            VITE_OPENWEATHER_API_KEY
          </code>{' '}
          in <code>.env</code> for live data
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {weatherCards.map(({ key, label, Icon, color, bg, border, format }) => (
          <div
            key={key}
            className="rounded-xl p-3 flex flex-col items-center gap-1.5 text-center transition-all"
            style={{ background: bg, border: `1px solid ${border}` }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon className="w-4 h-4" style={{ color }} />
            <span className="text-xs" style={{ color: 'rgba(167,139,250,0.5)' }}>{label}</span>
            <span className="text-sm font-black" style={{ color, fontFamily: 'Outfit, sans-serif' }}>
              {data[key] !== undefined ? format(data[key]) : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Sunrise / Sunset */}
      {(data.sunrise || data.sunset) && (
        <div
          className="flex gap-6 mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
        >
          {data.sunrise && (
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(167,139,250,0.55)' }}>
              🌅 <span className="font-semibold" style={{ color: '#fbbf24' }}>
                {data.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              Sunrise
            </div>
          )}
          {data.sunset && (
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(167,139,250,0.55)' }}>
              🌇 <span className="font-semibold" style={{ color: '#fb923c' }}>
                {data.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              Sunset
            </div>
          )}
        </div>
      )}
    </div>
  );
}
