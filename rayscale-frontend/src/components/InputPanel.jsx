import { useState } from 'react';
import {
  Sun, Wind, Droplets, Thermometer, Wifi,
  Loader2, CloudRain, Zap, SlidersHorizontal,
  MapPin, Navigation
} from 'lucide-react';
import { fetchWeatherByCoords, getUserLocation } from '../utils/weatherApi';

const defaultInputs = {
  dni: '',
  dhi: '',
  kt: '',
  temperature: '',
  humidity: '',
  windSpeed: '',
  precipitation: '',
  latitude: '',
  longitude: '',
};

/* Labeled input with icon */
function InputRow({ label, icon: Icon, iconColor, name, value, onChange, placeholder, min, max, step }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
        style={{ color: 'rgba(167,139,250,0.65)' }}>
        <Icon className="w-3 h-3" style={{ color: iconColor }} />
        {label}
      </label>
      <input
        className="input-field"
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

export default function InputPanel({ onPredict, loading }) {
  const [mode, setMode] = useState('manual');
  const [inputs, setInputs] = useState(defaultInputs);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [weatherMsg, setWeatherMsg] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFetchWeather = async () => {
    setFetchingWeather(true);
    setWeatherMsg(null);
    try {
      const lat = parseFloat(inputs.latitude) || 20.5937;
      const lon = parseFloat(inputs.longitude) || 78.9629;
      const data = await fetchWeatherByCoords(lat, lon);

      setInputs((prev) => ({
        ...prev,
        temperature: String(data.temperature),
        humidity: String(data.humidity),
        windSpeed: String(data.windSpeed),
        precipitation: String(data.precipitation),
      }));

      const msg = data.isDemo
        ? '⚠️ Demo data shown – add VITE_OPENWEATHER_API_KEY to .env for live data'
        : `✅ Live weather fetched for ${data.city}, ${data.country}`;
      setWeatherMsg({ type: data.isDemo ? 'warning' : 'success', text: msg });
    } catch (err) {
      setWeatherMsg({ type: 'error', text: err.message });
    } finally {
      setFetchingWeather(false);
    }
  };

  const handlePredict = () => {
    const parsed = {
      dni: parseFloat(inputs.dni) || 0,
      dhi: parseFloat(inputs.dhi) || 0,
      kt: parseFloat(inputs.kt) || 0,
      temperature: parseFloat(inputs.temperature) || 25,
      humidity: parseFloat(inputs.humidity) || 60,
      windSpeed: parseFloat(inputs.windSpeed) || 3,
      precipitation: parseFloat(inputs.precipitation) || 0,
      latitude: parseFloat(inputs.latitude) || null,
      longitude: parseFloat(inputs.longitude) || null,
    };
    onPredict(parsed);
  };

  const canPredict = inputs.temperature !== '' || inputs.dni !== '';

  const msgStyles = {
    success: { bg: 'rgba(163,230,53,0.08)', border: 'rgba(163,230,53,0.3)', text: '#a3e635' },
    warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    error:   { bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.3)', text: '#fb7185' },
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-5" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>

      {/* ── Mode Toggle ── */}
      <div>
        <div className="section-label">
          <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
          Input Mode
        </div>
        <div
          className="flex p-1 gap-1 rounded-xl"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <button
            className={`toggle-btn flex-1 ${mode === 'manual' ? 'active' : 'inactive'}`}
            onClick={() => setMode('manual')}
          >
            ✏️ Manual
          </button>
          <button
            className={`toggle-btn flex-1 ${mode === 'live' ? 'active' : 'inactive'}`}
            onClick={() => setMode('live')}
          >
            📡 Live Data
          </button>
        </div>
      </div>

      {/* ── Location Parameters ── */}
      <div>
        <div className="section-label flex justify-between items-center w-full">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
            Location
          </div>
          <button 
            onClick={async () => {
              setWeatherMsg(null);
              try {
                const pos = await getUserLocation();
                setInputs(prev => ({...prev, latitude: pos.lat.toFixed(4), longitude: pos.lon.toFixed(4)}));
              } catch (e) {
                setWeatherMsg({ type: 'error', text: 'Failed to get location. Please allow location access.' });
              }
            }}
            className="text-xs flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer"
            style={{ color: 'rgba(167,139,250,0.8)' }}
            title="Get My Location"
          >
            <Navigation className="w-3 h-3" />
            Get Current
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <InputRow label="Latitude" icon={MapPin} iconColor="#a78bfa"
            name="latitude" value={inputs.latitude} onChange={handleChange}
            placeholder="-90 to 90" />
          <InputRow label="Longitude" icon={MapPin} iconColor="#a78bfa"
            name="longitude" value={inputs.longitude} onChange={handleChange}
            placeholder="-180 to 180" />
        </div>
      </div>

      {/* ── Solar Parameters ── */}
      <div>
        <div className="section-label">
          <Sun className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
          Solar Parameters
        </div>
        <div className="grid grid-cols-3 gap-2">
          <InputRow label="DNI (W/m²)" icon={Sun} iconColor="#fbbf24"
            name="dni" value={inputs.dni} onChange={handleChange}
            placeholder="0–1000" min="0" max="1000" />
          <InputRow label="DHI (W/m²)" icon={Zap} iconColor="#fb923c"
            name="dhi" value={inputs.dhi} onChange={handleChange}
            placeholder="0–400" min="0" max="400" />
          <InputRow label="Clearness KT" icon={Sun} iconColor="#a3e635"
            name="kt" value={inputs.kt} onChange={handleChange}
            placeholder="0–1" min="0" max="1" step="0.01" />
        </div>
      </div>

      {/* ── Weather Parameters ── */}
      <div>
        <div className="section-label">
          <Thermometer className="w-3.5 h-3.5" style={{ color: '#fb7185' }} />
          Weather Parameters
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputRow label="Temperature (°C)" icon={Thermometer} iconColor="#fb7185"
            name="temperature" value={inputs.temperature} onChange={handleChange}
            placeholder="-10 to 50" />
          <InputRow label="Humidity (%)" icon={Droplets} iconColor="#22d3ee"
            name="humidity" value={inputs.humidity} onChange={handleChange}
            placeholder="0–100" min="0" max="100" />
          <InputRow label="Wind Speed (m/s)" icon={Wind} iconColor="#a78bfa"
            name="windSpeed" value={inputs.windSpeed} onChange={handleChange}
            placeholder="0–30" min="0" />
          <InputRow label="Precipitation (mm)" icon={CloudRain} iconColor="#38bdf8"
            name="precipitation" value={inputs.precipitation} onChange={handleChange}
            placeholder="0–100" min="0" />
        </div>
      </div>

      {/* ── Live Weather Fetch ── */}
      {mode === 'live' && (
        <div className="fade-in-up">
          <div className="section-label">
            <Wifi className="w-3.5 h-3.5" style={{ color: '#22d3ee' }} />
            Live Weather
          </div>
          <button
            className="btn-secondary w-full flex items-center justify-center gap-2 py-2.5"
            onClick={handleFetchWeather}
            disabled={fetchingWeather}
          >
            {fetchingWeather ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#22d3ee' }} />
            ) : (
              <Wifi className="w-4 h-4" style={{ color: '#22d3ee' }} />
            )}
            <span>{fetchingWeather ? 'Fetching weather...' : 'Fetch Live Weather'}</span>
          </button>
        </div>
      )}

      {/* ── Status message ── */}
      {weatherMsg && (() => {
        const s = msgStyles[weatherMsg.type] || msgStyles.success;
        return (
          <div
            className="text-xs rounded-xl px-3 py-2.5 fade-in-up"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
          >
            {weatherMsg.text}
          </div>
        );
      })()}

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }} />

      {/* ── Predict Button ── */}
      <button
        className="btn-primary w-full flex items-center justify-center gap-2"
        onClick={handlePredict}
        disabled={loading || !canPredict}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span className="text-lg">🧠</span>
            <span>Predict DGI</span>
          </>
        )}
      </button>

      {!canPredict && !loading && (
        <p className="text-center text-xs" style={{ color: 'rgba(139,92,246,0.4)', marginTop: '-0.75rem' }}>
          Enter at least Temperature or DNI to predict
        </p>
      )}
    </div>
  );
}
