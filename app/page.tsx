'use client';
import { useState } from 'react';

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
    <main className="min-h-screen bg-white font-sans text-charcoal flex flex-col">
      {/* Navbar Placeholder */}
      <header className="flex justify-between items-center p-4 border-b border-gray-200 px-8">
        <div className="font-bold text-xl text-charcoal-100 flex items-center gap-2">
          <span className="text-amethyst_smoke text-2xl">⬡</span> OpenSolve NG
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/maskedwolf-01/opensolve-ng" target="_blank" className="px-4 py-2 text-sm font-semibold hover:bg-alice_blue rounded-md transition">GitHub</a>
        </div>
      </header>

      {/* Hero Section matching Khan Academy layout */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-8 py-16 gap-12 items-center">
        
        {/* Left Column: Copywriting */}
        <div className="flex-1 text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-charcoal-100 leading-tight mb-6">
            Turn blurry past questions into <span className="italic">real</span> solutions.
          </h1>
          <p className="text-lg text-charcoal-700 mb-8 max-w-lg leading-relaxed">
            OpenSolve NG helps Nigerian university students instantly transcribe and solve handwritten past questions using Gemma 4 multimodal AI. Keep pace with your studies and prepare for exams with step-by-step breakdowns.
          </p>
        </div>

        {/* Right Column: Action Area replacing the Login Cards */}
        <div className="flex-1 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-charcoal-100">Get started</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Upload Card */}
            <label className="flex flex-col p-4 border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-amethyst_smoke hover:shadow-md transition group">
              <div className="flex justify-between items-center">
                <div>
                  <span className="block font-bold text-charcoal-100 group-hover:text-amethyst_smoke">1. Upload Image</span>
                  <span className="text-sm text-charcoal-600">Select a handwritten past question</span>
                </div>
                <span className="text-amethyst_smoke font-bold">›</span>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                required 
              />
            </label>

            {file && (
              <div className="p-3 bg-alice_blue border border-pale_sky-200 rounded-lg text-sm font-medium text-cool_sky-200">
                Selected: {file.name}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !file} 
              className={`flex justify-between items-center p-4 border rounded-lg transition-all ${
                loading || !file 
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                : 'border-amethyst_smoke bg-amethyst_smoke text-white hover:bg-amethyst_smoke-400 shadow-md'
              }`}
            >
              <div className="text-left">
                <span className="block font-bold">2. Analyze with AI</span>
                <span className="text-sm opacity-90">{loading ? 'Processing via Gemini API...' : 'Generate step-by-step solution'}</span>
              </div>
              <span className="font-bold">›</span>
            </button>
          </form>
        </div>
      </div>

      {/* Solution Rendering Area */}
      {solution && (
        <div className="max-w-5xl mx-auto w-full px-8 py-12 border-t border-gray-200">
           <div className="p-8 bg-ghost_white rounded-xl border border-charcoal-800 shadow-sm">
             <h2 className="text-2xl font-bold text-charcoal-100 mb-6 flex items-center gap-2">
                <span className="text-amethyst_smoke">✦</span> Gemma 4 Solution
             </h2>
             <div className="text-charcoal-700 whitespace-pre-wrap leading-relaxed font-medium">
               {solution}
             </div>
           </div>
        </div>
      )}

      {/* Impact Stats matching Khan Academy layout */}
      <div className="bg-ghost_white border-t border-b border-gray-200 py-12 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 px-4 text-center">
          <div>
            <div className="text-3xl font-extrabold text-charcoal-100 mb-1">Gemma 4</div>
            <div className="text-sm font-medium text-charcoal-600">Open-weights model</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-charcoal-100 mb-1">Free</div>
            <div className="text-sm font-medium text-charcoal-600">for Nigerian students</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-charcoal-100 mb-1">Open Source</div>
            <div className="text-sm font-medium text-charcoal-600">MIT Licensed</div>
          </div>
        </div>
      </div>
      
    </main>
  );
}
