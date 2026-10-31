'use client';
import { useState } from 'react';
import { BrainCircuit, Zap, Target, UploadCloud, ChevronRight, Github } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amethyst_smoke rounded-xl flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-charcoal-100 font-serif">OpenSolve<span className="text-amethyst_smoke">.</span></span>
          </div>
          <div className="flex gap-4 items-center">
             <a href="https://github.com/maskedwolf-01/opensolve-ng" target="_blank" className="text-charcoal-700 hover:text-amethyst_smoke text-sm font-medium transition-colors flex items-center gap-2">
               <Github className="w-5 h-5" /> GitHub Repo
             </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-left z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-charcoal-100 font-serif leading-[1.1]">
              Turn blurry past questions into <span className="text-amethyst_smoke italic">real results.</span>
            </h1>
            <p className="text-lg text-charcoal-700 mb-8 max-w-lg leading-relaxed">
              OpenSolve NG helps Nigerian university students instantly transcribe and solve handwritten past questions using Gemma 4 multimodal AI. 
            </p>
          </div>

          <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative z-10">
            <h2 className="text-xl font-bold mb-6 text-charcoal-100">Get started</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col p-5 border-2 border-dashed border-amethyst_smoke/50 rounded-xl cursor-pointer bg-alice_blue hover:bg-pale_sky-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-amethyst_smoke" />
                  </div>
                  <div>
                    <span className="block font-bold text-charcoal-100">1. Upload Image</span>
                    <span className="text-sm text-charcoal-600">Select a handwritten past question</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </label>

              {file && (
                <div className="p-3 bg-mint_cream border border-sage_green-300 rounded-lg text-sm font-medium text-sage_green-700 flex items-center justify-between">
                  <span>{file.name}</span>
                </div>
              )}

              <button type="submit" disabled={loading || !file} className={`mt-2 p-5 rounded-xl font-bold transition-all flex items-center justify-between ${loading || !file ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amethyst_smoke text-white hover:bg-amethyst_smoke-600 shadow-lg hover:-translate-y-1'}`}>
                <div className="text-left">
                  <span className="block text-lg">2. Analyze with AI</span>
                  <span className="text-xs opacity-90 font-normal">{loading ? 'Processing via Gemini API...' : 'Generate step-by-step solution'}</span>
                </div>
                <ChevronRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SOLUTION RENDER AREA */}
      {solution && (
        <section className="max-w-5xl mx-auto w-full px-6 pb-20 z-20 relative">
           <div className="p-8 bg-white rounded-3xl border border-gray-200 shadow-xl">
             <h2 className="text-2xl font-bold text-charcoal-100 mb-6 flex items-center gap-2 border-b pb-4">
                <BrainCircuit className="w-6 h-6 text-amethyst_smoke" /> Gemma 4 Solution
             </h2>
             <div className="text-charcoal-700 whitespace-pre-wrap leading-relaxed font-medium">
               {solution}
             </div>
           </div>
        </section>
      )}

      {/* IMPACT STATS */}
      <section className="border-y border-gray-200 bg-white py-12">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-32 px-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-charcoal-100 mb-2">Gemma 4</div>
            <div className="text-sm font-medium text-charcoal-600">Open-weights model</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-charcoal-100 mb-2">Free</div>
            <div className="text-sm font-medium text-charcoal-600">For Nigerian students</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-charcoal-100 mb-2">MIT</div>
            <div className="text-sm font-medium text-charcoal-600">Fully open-source</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-charcoal-400" />
            <span className="font-bold text-charcoal-700">OpenSolve NG</span>
          </div>
          <div className="text-sm text-charcoal-500 font-medium">
            Built for MLH Hacktoberfest 2026 by Majeed.
          </div>
        </div>
      </footer>
    </div>
  );
}
