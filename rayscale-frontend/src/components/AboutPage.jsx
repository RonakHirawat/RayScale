import { BrainCircuit, Sprout, Network, Zap, CloudCog, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 fade-in-up">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1
          className="text-4xl md:text-5xl font-black mb-4 header-gradient"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          About RayScale
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(167,139,250,0.7)' }}>
          RayScale is an advanced Smart Agriculture Intelligence platform that predicts the 
          Daily Growth Index (DGI) of crops using deep learning and real-time environmental data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Our Mission */}
        <div
          className="glass-card p-8 card-entry-1"
          style={{ border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 0 40px rgba(139,92,246,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(163,230,53,0.1)' }}>
              <Sprout className="w-6 h-6" style={{ color: '#a3e635' }} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: '#e2d9f3', fontFamily: 'Outfit, sans-serif' }}>
              Our Mission
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: 'rgba(167,139,250,0.65)' }}>
            To empower farmers and agricultural experts with highly accurate, localized, 
            and real-time insights into crop growth potential. By combining solar parameters 
            with local weather conditions, RayScale minimizes guesswork and maximizes yield.
          </p>
        </div>

        {/* How It Works */}
        <div
          className="glass-card p-8 card-entry-2"
          style={{ border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 0 40px rgba(139,92,246,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)' }}>
              <BrainCircuit className="w-6 h-6" style={{ color: '#fbbf24' }} />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: '#e2d9f3', fontFamily: 'Outfit, sans-serif' }}>
              How It Works
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: 'rgba(167,139,250,0.65)' }}>
            Users input live or historical weather data alongside specific solar measurements 
            (like Direct Normal Irradiance and Clearness Index). Our Keras Neural Network backend 
            processes these features to predict the optimal growth condition rating (DGI) for the day.
          </p>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-16 card-entry-3">
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: '#a78bfa', fontFamily: 'Outfit, sans-serif' }}>
          Core Technologies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
  { 
    title: 'ANN Prediction Engine', 
    desc: 'Artificial Neural Network for accurate DGI predictions.', 
    icon: Network, 
    color: '#a78bfa' 
  },
  { 
    title: 'FastAPI / Flask', 
    desc: 'Robust and scalable backend infrastructure.', 
    icon: CloudCog, 
    color: '#22d3ee' 
  },
  { 
    title: 'React + Vite', 
    desc: 'Blazing fast frontend with dynamic visualizations.', 
    icon: Zap, 
    color: '#a3e635' 
  },
  { 
    title: 'Real-time APIs', 
    desc: 'Integration with OpenWeather for live data.', 
    icon: ShieldCheck, 
    color: '#fbbf24' 
  }
].map((tech, idx) => (
            <div
              key={tech.title}
              className="glass-card p-5 hover-card"
              style={{ border: `1px solid ${tech.color}40`, animationDelay: `${idx * 0.1}s` }}
            >
              <tech.icon className="w-8 h-8 mb-3" style={{ color: tech.color }} />
              <h3 className="font-bold text-sm mb-2" style={{ color: '#e2d9f3' }}>{tech.title}</h3>
              <p className="text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Closing Note */}
      <div className="text-center card-entry-4">
        <div className="inline-block px-6 py-3 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <p className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
            Built for the future of sustainable agriculture.
          </p>
        </div>
      </div>
    </div>
  );
}
