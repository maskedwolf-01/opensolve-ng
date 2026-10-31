"use client";
import { useState } from 'react';
import { Terminal, UploadCloud, ChevronRight, FileText, CheckCircle, Lightbulb } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* BANNER */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800 py-2 px-4 text-center">
        <p className="text-xs font-medium text-zinc-400 flex items-center justify-center gap-2">
          <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border border-zinc-700">Gemma 4</span>
          OpenSolve NG is live for Hacktoberfest 2026.
        </p>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl border-b border-zinc-800 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-100 font-mono">opensolve-ng</span>
          </div>
          <div className="flex gap-4 items-center">
             <a href="https://github.com/maskedwolf-01/opensolve-ng" target="_blank" className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
               View Repository
             </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden border-b border-zinc-900">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="text-left animate-fade-in z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-100 leading-[1.1]">
              Solve handwritten <br/> past questions.
            </h1>
            <p className="text-lg text-zinc-400 mb-10 max-w-lg leading-relaxed font-light">
              An open-source academic engine for Nigerian universities. Upload your physical handouts. Let Gemma 4 extract and solve the logic.
            </p>
            
            {/* UPLOADER */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
              <label className="flex flex-col p-6 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl cursor-pointer bg-zinc-950/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-medium text-zinc-100">Upload Image</span>
                    <span className="text-xs text-zinc-500">PNG, JPG up to 5MB</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </label>

              {file && (
                <div className="px-4 py-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-xs font-medium text-blue-400 truncate flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {file.name}
                </div>
              )}

              <button type="submit" disabled={loading || !file} className={`w-full py-3.5 font-medium rounded-xl flex items-center justify-center gap-2 transition-all ${loading || !file ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800' : 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg'}`}>
                {loading ? 'Processing via Gemini API...' : 'Generate Solution'} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* DYNAMIC SOLUTION AREA */}
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-zinc-900/30 rounded-3xl border border-zinc-800 p-4 flex-col justify-center items-center overflow-hidden flex">
             {solution ? (
                <div className="w-full h-full overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative z-10 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap no-scrollbar">
                  <h3 className="text-zinc-100 font-medium mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Analysis Complete
                  </h3>
                  {solution}
                </div>
             ) : (
                <div className="w-[90%] bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div className="h-3 w-3/4 bg-zinc-800 rounded-full"></div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-4">
                    <Lightbulb className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                    <div className="space-y-3 w-full pt-1">
                      <div className="h-2 w-full bg-zinc-800 rounded-full"></div>
                      <div className="h-2 w-5/6 bg-zinc-800 rounded-full"></div>
                      <div className="h-2 w-4/6 bg-zinc-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
           <div className="text-xs text-zinc-600 font-medium">
             OpenSolve NG • MIT License
           </div>
           <div className="text-xs text-zinc-600 font-medium">
             Hacktoberfest 2026
           </div>
        </div>
      </footer>
    </div>
  );
}
