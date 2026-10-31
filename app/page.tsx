"use client";
import { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, UploadCloud, ChevronRight, Zap, Target, XCircle, CheckCircle, Lightbulb, ExternalLink } from 'lucide-react';

const PulsarLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10v6"/><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M12 22V7"/><path d="m9 14 2.5 2.5 5-5"/>
  </svg>
);

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', 'Solve this handwritten past question step-by-step. Break down the math or logic clearly.');

    try {
      const res = await fetch('/api/solve', { method: 'POST', body: formData });
      const data = await res.json();
      setSolution(data.solution || data.error);
    } catch (err) {
      setSolution("An error occurred connecting to the AI.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
      
      {/* BANNER */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-2.5 px-4 text-center relative z-50">
        <p className="text-xs md:text-sm font-medium text-white flex items-center justify-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Gemma 4</span>
          Multimodal AI integration is now live for Hacktoberfest 2026!
        </p>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl border-b border-white/5 bg-[#030305]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <PulsarLogo className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-serif">OpenSolve<span className="text-indigo-500">.</span></span>
          </div>
          <div className="flex gap-4 items-center">
             <a href="https://github.com/maskedwolf-01/opensolve-ng" target="_blank" className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/5">
               View Repository <ExternalLink className="w-4 h-4" />
             </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] -z-10 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left animate-fade-in z-10 pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">
              Nigerian University Past Questions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white font-serif leading-[1.05]">
              Don't Just Practice. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Understand.</span>
            </h1>
            <p className="text-lg text-zinc-400 mb-10 max-w-lg leading-relaxed">
              Upload blurry, handwritten past questions from your WhatsApp groups. Gemma 4 reads the handwriting and breaks down the solution step-by-step.
            </p>
            
            {/* GEMMA 4 UPLOADER */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md bg-[#0a0a0c]/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <label className="flex flex-col p-4 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">Upload PQ Image</span>
                    <span className="text-xs text-zinc-400">Handwritten or typed (Max 5MB)</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </label>

              {file && (
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-bold text-emerald-400 truncate">
                  Selected: {file.name}
                </div>
              )}

              <button type="submit" disabled={loading || !file} className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${loading || !file ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.15)]'}`}>
                {loading ? 'Gemma 4 is Analyzing...' : 'Solve Question'} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* DYNAMIC SOLUTION OR GRAPHIC AREA */}
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-[#0a0a0c]/80 rounded-3xl border border-white/5 p-4 backdrop-blur-md shadow-2xl flex-col justify-center items-center overflow-hidden flex">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5"></div>
             
             {solution ? (
                <div className="w-full h-full overflow-y-auto bg-[#121216] border border-white/10 rounded-2xl p-6 relative z-10 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap no-scrollbar">
                  <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                    <CheckCircle className="w-5 h-5" /> Solution Generated
                  </h3>
                  {solution}
                </div>
             ) : (
                <div className="w-[90%] bg-[#121216] border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl transform rotate-[-2deg] transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">AI</div>
                    <div className="h-4 w-3/4 bg-zinc-800 rounded-full"></div>
                  </div>
                  <div className="space-y-3 mb-6 opacity-50">
                    <div className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-3 w-48 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4">
                    <Lightbulb className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Awaiting Image...</div>
                      <div className="h-2 w-full bg-indigo-500/20 rounded-full"></div>
                      <div className="h-2 w-5/6 bg-indigo-500/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-[#030305]">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="text-xs text-zinc-700">
             © {new Date().getFullYear()} OpenSolve NG. Built for MLH Hacktoberfest using Gemma 4.
           </div>
        </div>
      </footer>
    </div>
  );
}
