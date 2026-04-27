import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'rgba(148, 163, 184, 0.8)',
        font: { family: 'Inter', size: 11 },
        boxWidth: 12,
        boxHeight: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      titleColor: '#94a3b8',
      bodyColor: '#f1f5f9',
      cornerRadius: 10,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.04)' },
      ticks: { color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.04)' },
      ticks: { color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
      min: 0, max: 1,
    },
  },
};

export default function DGIChart({ history }) {
  const labels = history.map((h, i) => `#${i + 1}`);
  const values = history.map((h) => h.dgi);

  const lineData = {
    labels,
    datasets: [
      {
        label: 'DGI Trend',
        data: values,
        borderColor: '#4ade80',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
          gradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: values.map((v) =>
          v >= 0.65 ? '#4ade80' : v >= 0.35 ? '#facc15' : '#f87171'
        ),
        pointBorderColor: 'rgba(15, 23, 42, 0.8)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Scatter: mock actual vs predicted
  const scatterData = {
    datasets: [
      {
        label: 'Actual vs Predicted',
        data: history.map((h) => ({
          x: parseFloat((h.dgi + (Math.random() - 0.5) * 0.1).toFixed(3)),
          y: h.dgi,
        })),
        backgroundColor: values.map((v) =>
          v >= 0.65
            ? 'rgba(74, 222, 128, 0.7)'
            : v >= 0.35
            ? 'rgba(250, 204, 21, 0.7)'
            : 'rgba(248, 113, 113, 0.7)'
        ),
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 9,
      },
      {
        label: 'Perfect Prediction',
        data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        backgroundColor: 'transparent',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        showLine: true,
        type: 'line',
      },
    ],
  };

  const scatterOptions = {
    ...baseOptions,
    scales: {
      x: {
        ...baseOptions.scales.x,
        title: { display: true, text: 'Actual DGI', color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
        min: 0, max: 1,
      },
      y: {
        ...baseOptions.scales.y,
        title: { display: true, text: 'Predicted DGI', color: 'rgba(148, 163, 184, 0.6)', font: { size: 10 } },
      },
    },
  };

  if (history.length === 0) {
    return (
      <div className="glass-card p-5 border border-white/10 flex flex-col items-center justify-center gap-3 h-48">
        <TrendingUp className="w-8 h-8 text-slate-600" />
        <p className="text-sm text-slate-500">Run predictions to see DGI trends here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Line Chart */}
      <div className="glass-card p-5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DGI Trend</span>
          </div>
          <span className="text-xs text-slate-500">{history.length} prediction{history.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="chart-container">
          <Line data={lineData} options={baseOptions} />
        </div>
      </div>

      {/* Scatter Plot */}
      {history.length >= 2 && (
        <div className="glass-card p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              📊 Actual vs Predicted (Demo)
            </span>
          </div>
          <div className="chart-container">
            <Scatter data={scatterData} options={scatterOptions} />
          </div>
        </div>
      )}

      {/* Feature importance placeholder */}
      <div className="glass-card p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            🧩 Feature Importance (Model Output)
          </span>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Solar Irradiance (DNI)', pct: 35, color: 'bg-yellow-400' },
            { name: 'Temperature', pct: 25, color: 'bg-orange-400' },
            { name: 'Precipitation', pct: 15, color: 'bg-cyan-400' },
            { name: 'Humidity', pct: 15, color: 'bg-blue-400' },
            { name: 'Wind Speed', pct: 10, color: 'bg-slate-400' },
          ].map((f) => (
            <div key={f.name} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-40 flex-shrink-0">{f.name}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${f.color} rounded-full transition-all duration-700`}
                  style={{ width: `${f.pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-8 text-right">{f.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
