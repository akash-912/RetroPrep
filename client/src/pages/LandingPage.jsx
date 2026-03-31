import { useNavigate } from 'react-router-dom';
import { 
  Brain, BookOpen, CalendarDays, Heart, 
  ChevronRight, Sparkles, GalleryVerticalEnd 
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Dynamic Curriculum',
      desc: 'Access your exact semester syllabus, PDFs, PYQs, and curated YouTube lectures in one structured dashboard.',
      color: 'from-teal-400 to-emerald-500',
      shadow: 'shadow-teal-500/20'
    },
    {
      icon: CalendarDays,
      title: 'Execution Planner',
      desc: 'Break down complex engineering subjects into daily, actionable tasks and build your show-up streak.',
      color: 'from-orange-400 to-amber-500',
      shadow: 'shadow-orange-500/20'
    },
    {
      icon: Brain,
      title: 'AI Tutor',
      desc: 'Generate custom mock exams and get instant, rigorous feedback on your answers with zero-latency AI.',
      color: 'from-violet-400 to-cyan-400',
      shadow: 'shadow-violet-500/20'
    },
    {
      icon: Heart,
      title: 'Safe Space ',
      desc: 'An anonymous, peer-to-peer community for venting, advice, and empathy when academic burnout hits.',
      color: 'from-rose-400 to-pink-500',
      shadow: 'shadow-rose-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-teal-500/30 overflow-hidden relative">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <GalleryVerticalEnd size={28} className="text-zinc-100" strokeWidth={1.5} />
          <span className="font-bold font-sans text-xl tracking-tight bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
            RetroPrep
          </span>
        </div>
        <div className="flex items-center gap-4">
          
          <button 
            onClick={() => navigate('/login')}
            className="bg-zinc-100 hover:bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-8 text-xs font-medium text-zinc-300">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>The ultimate workspace for engineering students</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Master your syllabus. <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            Protect your peace.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          RetroPrep replaces your scattered PDFs, to-do lists, and bookmarks with one unified, AI-powered engine designed to help you crush your exams without the burnout.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:-translate-y-1"
          >
            Enter Workspace <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-zinc-300 bg-[#121212] border border-zinc-800 hover:bg-[#18181b] hover:text-white transition-all"
          >
            Explore Features
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-zinc-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, in one place.</h2>
          <p className="text-zinc-400">Stop switching between five different apps just to study.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-[#121212] border border-zinc-800/80 p-8 rounded-[2rem] hover:bg-[#18181b] transition-colors group">
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
        <div className="bg-gradient-to-b from-[#18181b] to-[#0a0a0a] border border-zinc-800/80 rounded-[2.5rem] p-12 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to upgrade your workflow?</h2>
          <p className="text-zinc-400 mb-8">Join the platform built entirely for modern students.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
          >
            Start Learning Now
          </button>
        </div>
      </div>

    </div>
  );
}