import { useState, useEffect } from 'react';
import { Sun, Leaf, Moon, Activity, Cpu, Zap } from 'lucide-react';

/* Tiny floating particle rendered in the header */
function Particle({ style }) {
  return (
    <div
      className="absolute pointer-events-none rounded-full"
      style={{
        width: 4,
        height: 4,
        background: 'radial-gradient(circle, #a78bfa, transparent)',
        animationName: 'float-particle',
        animationDuration: '5s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        ...style,
      }}
    />
  );
}

const particles = [
  { top: '20%', left: '8%',  animationDelay: '0s' },
  { top: '60%', left: '15%', animationDelay: '1.2s' },
  { top: '30%', left: '92%', animationDelay: '0.5s' },
  { top: '70%', left: '85%', animationDelay: '2s' },
];

export default function Header({ darkMode, onToggleDark, currentView, setCurrentView }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="relative z-20 px-6 py-4 flex items-center justify-between"
      style={{
        borderBottom: '1px solid rgba(139, 92, 246, 0.18)',
        background: scrolled
          ? 'rgba(6, 4, 15, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      {/* Particle decorations */}
      {particles.map((p, i) => (
        <Particle key={i} style={p} />
      ))}

      {/* ── Logo + Title ── */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Animated logo icon */}
        <div
          className="relative w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a3e635)',
            boxShadow: '0 0 24px rgba(124,58,237,0.45), 0 0 60px rgba(163,230,53,0.15)',
          }}
        >
          <Leaf className="w-5 h-5 text-white" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))' }} />
          {/* Spinning ring */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-transparent"
            style={{
              borderTopColor: 'rgba(163, 230, 53, 0.6)',
              borderRightColor: 'rgba(139, 92, 246, 0.3)',
              animationName: 'spinBorder',
              animationDuration: '4s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          />
        </div>

        <div>
          <h1
            className="text-2xl font-black tracking-tight leading-none header-gradient cursor-pointer"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            onClick={() => setCurrentView('dashboard')}
          >
            RayScale
          </h1>
          <p className="text-xs mt-0.5 leading-none" style={{ color: 'rgba(167, 139, 250, 0.55)', fontWeight: 500 }}>
            Smart Agriculture AI
          </p>
        </div>
      </div>

      {/* ── Center Nav ── */}
      <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentView === 'home' ? 'text-white shadow-md' : 'hover:bg-white/5'}`}
          style={currentView === 'home' ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : { color: 'rgba(167, 139, 250, 0.7)' }}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentView === 'about' ? 'text-white shadow-md' : 'hover:bg-white/5'}`}
          style={currentView === 'about' ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : { color: 'rgba(167, 139, 250, 0.7)' }}
          onClick={() => setCurrentView('about')}
        >
          About Project
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentView === 'dashboard' ? 'text-white shadow-md' : 'hover:bg-white/5'}`}
          style={currentView === 'dashboard' ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : { color: 'rgba(167, 139, 250, 0.7)' }}
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </button>
      </div>

    </header>
  );
}
