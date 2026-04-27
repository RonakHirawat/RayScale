import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Trash2, Activity } from 'lucide-react';

const getAccent = (label) =>
  label === 'High' ? '#a3e635' : label === 'Moderate' ? '#fbbf24' : '#a78bfa';

export default function HistoryPanel({ history, onClear }) {
  const [isOpen, setIsOpen] = useState(true);

  if (history.length === 0) return null;

  return (
    <div
      className="glass-card overflow-hidden card-entry-4"
      style={{ border: '1px solid rgba(139,92,246,0.2)' }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer"
        style={{ borderBottom: isOpen ? '1px solid rgba(139,92,246,0.1)' : 'none' }}
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
          >
            <Activity className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'rgba(167,139,250,0.7)' }}>
            Prediction History
          </span>
          <span
            className="text-xs font-black px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all"
            style={{ color: 'rgba(167,139,250,0.5)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fb7185';
              e.currentTarget.style.background = 'rgba(251,113,133,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(167,139,250,0.5)';
              e.currentTarget.style.background = 'transparent';
            }}
            onClick={(e) => { e.stopPropagation(); onClear(); }}
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          {isOpen
            ? <ChevronUp className="w-4 h-4" style={{ color: 'rgba(139,92,246,0.5)' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: 'rgba(139,92,246,0.5)' }} />}
        </div>
      </div>

      {/* Table */}
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                {['#', 'Time', 'DGI', 'Condition', 'Temp', 'Humidity', 'DNI'].map((h) => (
                  <th
                    key={h}
                    className={`py-2 font-bold uppercase tracking-wider ${h === '#' ? 'pl-5 pr-3 text-left' : h === 'DGI' || h === 'Condition' ? 'px-3 text-center' : 'px-3 text-left'}`}
                    style={{ color: 'rgba(139,92,246,0.45)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((entry, idx) => {
                const accent = getAccent(entry.label);
                return (
                  <tr
                    key={entry.id}
                    className="transition-colors group"
                    style={{ borderBottom: '1px solid rgba(139,92,246,0.07)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139,92,246,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="pl-5 pr-3 py-2.5 font-mono font-bold" style={{ color: 'rgba(139,92,246,0.4)' }}>
                      {history.length - idx}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: 'rgba(167,139,250,0.6)' }}>
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className="font-mono font-black px-2 py-0.5 rounded-lg"
                        style={{
                          background: `${accent}12`,
                          border: `1px solid ${accent}30`,
                          color: accent,
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      >
                        {entry.dgi.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className="font-bold"
                        style={{ color: accent }}
                      >
                        {entry.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5" style={{ color: 'rgba(167,139,250,0.6)' }}>
                      {entry.inputs?.temperature ?? '—'}°C
                    </td>
                    <td className="px-3 py-2.5" style={{ color: 'rgba(167,139,250,0.6)' }}>
                      {entry.inputs?.humidity ?? '—'}%
                    </td>
                    <td className="px-3 py-2.5" style={{ color: 'rgba(167,139,250,0.6)' }}>
                      {entry.inputs?.dni ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
