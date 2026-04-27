import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import DGIGauge from './components/DGIGauge';
import GrowthCard from './components/GrowthCard';
import RecommendationCard from './components/RecommendationCard';
import WeatherCard from './components/WeatherCard';
import DGIChart from './components/DGIChart';
import HistoryPanel from './components/HistoryPanel';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import {
  classifyDGI,
  getIrrigationRecommendation,
  getCropRecommendations,
  calculateDGI,
} from './utils/dgiCalculator';
import {
  AlertTriangle, ServerCrash, CheckCircle2, Loader2,
  BarChart3, Layers, Cpu, Wifi, WifiOff
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/* Animated background particle */
function BgParticle({ x, y, size, color, delay, duration }) {
  return (
    <div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent)`,
        animationName: 'float-particle',
        animationDuration: `${duration}s`,
        animationTimingFunction: 'ease-in-out',
        animationDelay: `${delay}s`,
        animationIterationCount: 'infinite',
        opacity: 0.4,
      }}
    />
  );
}

const BG_PARTICLES = [
  { x: 10, y: 20, size: 6, color: '#a78bfa', delay: 0,   duration: 5 },
  { x: 80, y: 15, size: 4, color: '#a3e635', delay: 1.5, duration: 7 },
  { x: 60, y: 75, size: 5, color: '#fbbf24', delay: 0.8, duration: 6 },
  { x: 25, y: 65, size: 3, color: '#22d3ee', delay: 2,   duration: 8 },
  { x: 90, y: 50, size: 4, color: '#a78bfa', delay: 1,   duration: 5.5 },
  { x: 45, y: 35, size: 3, color: '#a3e635', delay: 3,   duration: 7.5 },
];

/* Status banner */
function StatusBanner({ status, url }) {
  const configs = {
    checking: {
      icon: Loader2,
      iconClass: 'animate-spin',
      bg: 'rgba(139,92,246,0.07)',
      border: 'rgba(139,92,246,0.2)',
      text: 'rgba(167,139,250,0.7)',
      msg: `Connecting to RayScale backend (${url})...`,
    },
    online: {
      icon: CheckCircle2,
      iconClass: '',
      bg: 'rgba(163,230,53,0.07)',
      border: 'rgba(163,230,53,0.25)',
      text: '#a3e635',
      msg: null,
    },
    offline: {
      icon: WifiOff,
      iconClass: '',
      bg: 'rgba(251,191,36,0.07)',
      border: 'rgba(251,191,36,0.25)',
      text: '#fbbf24',
      msg: null,
    },
  };

  const c = configs[status];
  const Icon = c.icon;

  return (
    <div
      className="flex items-center gap-2.5 text-xs px-4 py-2.5 rounded-xl"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${c.iconClass}`} />
      {status === 'checking' && <span>{c.msg}</span>}
      {status === 'online' && (
        <span>
          <strong>Backend online</strong> — Keras Neural Network ready at{' '}
          <code className="font-mono px-1 py-0.5 rounded text-xs"
            style={{ background: 'rgba(163,230,53,0.1)' }}>{url}</code>
        </span>
      )}
      {status === 'offline' && (
        <span>
          <strong>Backend offline</strong> — Using mock formula. Start:{' '}
          <code className="font-mono px-1 py-0.5 rounded text-xs"
            style={{ background: 'rgba(251,191,36,0.1)' }}>cd backend && python main.py</code>
        </span>
      )}
    </div>
  );
}

/* Stat chip for the input summary row */
function StatChip({ label, value, unit, color, delay = 0 }) {
  return (
    <div
      className="stat-chip"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(139,92,246,0.5)' }}>{label}</p>
      <p className="text-sm font-black" style={{ color, fontFamily: 'Outfit, sans-serif' }}>
        {value ?? '—'}
        {unit && <span className="text-xs font-normal ml-0.5" style={{ color: `${color}99` }}>{unit}</span>}
      </p>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('output');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/`, { signal: AbortSignal.timeout(3000) });
        setBackendStatus(res.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const handlePredict = useCallback(async (inputs) => {
    setLoading(true);
    setApiError(null);

    try {
      if (backendStatus === 'online') {
        const payload = {
          ALLSKY_SFC_SW_DNI:  inputs.dni,
          ALLSKY_SFC_SW_DIFF: inputs.dhi,
          ALLSKY_KT:          inputs.kt,
          T2M:                inputs.temperature,
          RH2M:               inputs.humidity,
          WS10M:              inputs.windSpeed,
          PRECTOTCORR:        inputs.precipitation,
        };

        const res = await fetch(`${BACKEND_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(err.error || `Backend error ${res.status}`);
        }

        const data = await res.json();
        const dgi   = data.DGI;
        const label = data.Category;
        const irrigation = getIrrigationRecommendation(dgi, inputs.precipitation);
        const crops      = getCropRecommendations(dgi);

        setResult({ dgi, label, irrigation, crops, inputs, modelUsed: 'Keras Neural Network', source: 'backend' });
        setHistory((prev) => [...prev, { id: Date.now(), timestamp: Date.now(), dgi, label, inputs, source: 'backend' }]);
      } else {
        await new Promise((r) => setTimeout(r, 900));
        const dgi   = calculateDGI(inputs);
        const { label } = classifyDGI(dgi);
        const irrigation = getIrrigationRecommendation(dgi, inputs.precipitation);
        const crops      = getCropRecommendations(dgi);

        setResult({ dgi, label, irrigation, crops, inputs, source: 'mock' });
        setHistory((prev) => [...prev, { id: Date.now(), timestamp: Date.now(), dgi, label, inputs, source: 'mock' }]);
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [backendStatus]);

  const STAT_CHIPS = result ? [
    { label: 'DNI',  value: result.inputs.dni,         unit: 'W/m²', color: '#fbbf24', delay: 0 },
    { label: 'DHI',  value: result.inputs.dhi,         unit: 'W/m²', color: '#fb923c', delay: 0.05 },
    { label: 'KT',   value: result.inputs.kt,          unit: '',     color: '#a3e635', delay: 0.1 },
    { label: 'Temp', value: result.inputs.temperature, unit: '°C',   color: '#fb7185', delay: 0.15 },
    { label: 'Hum',  value: result.inputs.humidity,    unit: '%',    color: '#22d3ee', delay: 0.2 },
    { label: 'Wind', value: result.inputs.windSpeed,   unit: 'm/s',  color: '#a78bfa', delay: 0.25 },
    { label: 'Rain', value: result.inputs.precipitation, unit: 'mm', color: '#38bdf8', delay: 0.3 },
  ] : [];

  const TABS = [
    { id: 'output', label: 'Results', icon: Layers },
    { id: 'charts', label: 'Visualizations', icon: BarChart3 },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="animated-bg min-h-screen text-slate-100 relative">

        {/* Background particles */}
        {BG_PARTICLES.map((p, i) => <BgParticle key={i} {...p} />)}

        <Header 
          darkMode={darkMode} 
          onToggleDark={() => setDarkMode((d) => !d)} 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {currentView === 'dashboard' ? (
          <>
            {/* Status banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-3">
          <StatusBanner status={backendStatus} url={BACKEND_URL} />
        </div>

        {/* ── Main layout ── */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

          {/* Left: Input Panel */}
          <aside className="card-entry-1">
            <InputPanel
              onPredict={handlePredict}
              loading={loading}
              onWeatherFetch={setWeatherData}
            />
          </aside>

          {/* Right: Output */}
          <section className="flex flex-col gap-5">

            {/* Tab bar */}
            <div
              className="flex items-center gap-1 px-2 py-1.5 w-fit rounded-xl"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}
            >
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`toggle-btn flex items-center gap-1.5 px-4 py-2 text-sm ${activeTab === id ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* ── OUTPUT TAB ── */}
            {activeTab === 'output' && (
              <div className="flex flex-col gap-5 fade-in-up">

                {/* API error */}
                {apiError && (
                  <div
                    className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm fade-in-scale"
                    style={{
                      background: 'rgba(251,113,133,0.08)',
                      border: '1px solid rgba(251,113,133,0.3)',
                      color: '#fb7185',
                    }}
                  >
                    <ServerCrash className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Prediction failed</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(251,113,133,0.7)' }}>{apiError}</p>
                    </div>
                    <button
                      className="ml-auto hover:opacity-70 transition-opacity"
                      onClick={() => setApiError(null)}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Empty state */}
                {!result && !loading && !apiError && (
                  <div
                    className="glass-card p-14 flex flex-col items-center justify-center gap-5 text-center fade-in-scale"
                    style={{ border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    {/* Animated plant icon */}
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl relative"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(163,230,53,0.08))',
                        border: '1px solid rgba(139,92,246,0.25)',
                        boxShadow: '0 0 30px rgba(139,92,246,0.15)',
                        animationName: 'float-particle',
                        animationDuration: '4s',
                        animationTimingFunction: 'ease-in-out',
                        animationIterationCount: 'infinite',
                      }}
                    >
                      🌱
                    </div>

                    <div>
                      <h2 className="text-xl font-black mb-2" style={{ color: '#e2d9f3', fontFamily: 'Outfit, sans-serif' }}>
                        Ready to Predict Growth
                      </h2>
                      <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'rgba(167,139,250,0.55)' }}>
                        Enter environmental and solar parameters in the left panel, then click{' '}
                        <strong style={{ color: '#a78bfa' }}>Predict DGI</strong> to get AI-powered farming insights.
                      </p>
                    </div>

                    <div className="flex gap-4 text-xs mt-1" style={{ color: 'rgba(139,92,246,0.4)' }}>
                      {['☀️ Solar inputs', '🌡️ Weather inputs', '🧠 ML inference'].map((item) => (
                        <span key={item} className="flex items-center gap-1">{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div
                    className="glass-card p-12 flex flex-col items-center justify-center gap-5 fade-in-scale"
                    style={{ border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    {/* Dual-ring spinner */}
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full"
                        style={{ border: '3px solid rgba(139,92,246,0.1)' }} />
                      <div className="absolute inset-0 rounded-full"
                        style={{
                          border: '3px solid transparent',
                          borderTopColor: '#a78bfa',
                          animation: 'spinBorder 1s linear infinite',
                        }} />
                      <div className="absolute inset-2 rounded-full"
                        style={{
                          border: '2px solid transparent',
                          borderTopColor: '#a3e635',
                          animation: 'spinBorder 0.7s linear infinite reverse',
                        }} />
                      <div className="absolute inset-0 flex items-center justify-center text-lg">🧠</div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-bold" style={{ color: '#e2d9f3' }}>Predicting DGI...</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(167,139,250,0.5)' }}>
                        Running ML inference on your inputs
                      </p>
                    </div>

                    {/* Shimmer lines */}
                    <div className="w-full max-w-md space-y-3 mt-2">
                      {[75, 55, 65].map((w, i) => (
                        <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Result panels */}
                {result && !loading && (
                  <>
                    {/* DGI Gauge + Growth Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div
                        className="glass-card p-6 flex flex-col items-center justify-center gap-2 hover-card card-entry-1"
                        style={{ border: '1px solid rgba(139,92,246,0.2)' }}
                      >
                        <p className="text-xs font-bold uppercase tracking-widest self-start mb-1"
                          style={{ color: 'rgba(167,139,250,0.55)' }}>
                          🌱 Daily Growth Index
                        </p>
                        <DGIGauge value={result.dgi} />
                      </div>
                      <GrowthCard label={result.label} dgi={result.dgi} />
                    </div>

                    {/* Recommendations */}
                    <RecommendationCard irrigation={result.irrigation} crops={result.crops} />

                    {/* Model source badge */}
                    {result.source && (
                      <div
                        className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl card-entry-4"
                        style={result.source === 'backend'
                          ? { background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.25)', color: '#a3e635' }
                          : { background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }
                        }
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        {result.source === 'backend'
                          ? <>Predicted by <strong className="mx-1">{result.modelUsed}</strong> — Keras Neural Network</>
                          : 'Using mock formula — run python main.py to activate live ML'}
                      </div>
                    )}

                    {/* Input Summary */}
                    <div
                      className="glass-card p-5 hover-card card-entry-4"
                      style={{ border: '1px solid rgba(139,92,246,0.15)' }}
                    >
                      <p className="text-xs font-bold uppercase tracking-widest mb-3"
                        style={{ color: 'rgba(167,139,250,0.55)' }}>
                        🔍 Input Summary
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {STAT_CHIPS.map((chip) => (
                          <StatChip key={chip.label} {...chip} />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Weather card */}
                {weatherData && <WeatherCard data={weatherData} />}
              </div>
            )}

            {/* ── CHARTS TAB ── */}
            {activeTab === 'charts' && (
              <div className="fade-in-up">
                <DGIChart history={history} />
              </div>
            )}

            {/* History panel */}
            <HistoryPanel history={history} onClear={() => setHistory([])} />
          </section>
        </main>
          </>
        ) : currentView === 'about' ? (
          <AboutPage />
        ) : (
          <HomePage setCurrentView={setCurrentView} />
        )}

        {/* Footer */}
        <footer
          className="relative z-10 text-center py-5 text-xs"
          style={{
            borderTop: '1px solid rgba(139,92,246,0.12)',
            color: 'rgba(153, 194, 16, 0.35)',
          }}
        >
          <span className="header-gradient font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            RayScale
          </span>
          {' '}: Smart Agriculture Intelligence
        </footer>
      </div>
    </div>
  );
}
