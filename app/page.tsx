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
    <main className="min-h-screen bg-ghost_white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-pale_sky-200 overflow-hidden">
        
        <div className="bg-pale_sky-500 p-8 text-center">
          <h1 className="text-4xl font-extrabold text-charcoal-100 tracking-tight mb-2">OpenSolve NG</h1>
          <p className="text-charcoal-700 text-lg">Nigeria's First Open-Source Multimodal Learning Platform</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-amethyst_smoke-400 rounded-lg cursor-pointer bg-alice_blue hover:bg-pale_sky-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-charcoal-600 font-semibold">Click to upload your Past Question</p>
                  <p className="text-xs text-charcoal-400">PNG, JPG or JPEG (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  required 
                />
              </label>
              {file && <p className="mt-3 text-sm text-sage_green-600 font-medium">Selected: {file.name}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading || !file} 
              className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                loading ? 'bg-charcoal-400 cursor-not-allowed' : 'bg-amethyst_smoke hover:bg-amethyst_smoke-600 shadow-md'
              }`}
            >
              {loading ? 'Gemma 4 is Analyzing...' : 'Solve Question with AI'}
            </button>
          </form>

          {solution && (
            <div className="mt-8 p-6 bg-mint_cream rounded-xl border border-sage_green-300">
              <h2 className="text-xl font-bold text-charcoal-100 mb-4">Gemma 4 Solution:</h2>
              <div className="text-charcoal-700 whitespace-pre-wrap leading-relaxed">
                {solution}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
