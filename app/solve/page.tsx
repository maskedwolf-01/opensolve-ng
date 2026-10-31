"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, UploadCloud, ChevronRight, FileText, CheckCircle, Lightbulb, Cpu, ArrowLeft, Loader2, BookOpen, Zap } from 'lucide-react';

export default function SolveWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('Solve this handwritten past question step-by-step. Break down the math or logic clearly.');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when solution updates
  useEffect(() => {
    if (solution) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [solution]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setSolution(''); // Reset solution when a new file is uploaded
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setSolution('');
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);

    try {
      const res = await fetch('/api/solve', { method: 'POST', body: formData });
      const data = await res.json();
      setSolution(data.solution || data.error);
    } catch (err) {
      setSolution("An error occurred connecting to the Gemma 4 API. Please check your network and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl border-b border-zinc-800 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="w-px h-6 bg-zinc-800"></div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                 <Terminal className="w-5 h-5 text-zinc-950" />
               </div>
               <span className="text-xl font-bold tracking-tight text-zinc-100 font-mono">Workspace</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
            <Cpu className="w-3 h-3" /> Gemma 4 Active
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOAD & CONFIGURATION */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
           
           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                 <UploadCloud className="w-5 h-5 text-zinc-400" /> Image Input
              </h2>
              
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl cursor-pointer bg-zinc-950/50 transition-all group mb-4 relative overflow-hidden">
                {previewUrl ? (
                   <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity" />
                ) : null}
                <div className="flex flex-col items-center gap-3 relative z-10 text-center">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-medium text-zinc-100">Select Document</span>
                    <span className="text-xs text-zinc-500 mt-1 block">Supported: PNG, JPG</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
              </label>

              {file && (
                <div className="px-4 py-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-xs font-medium text-blue-400 truncate flex items-center justify-between">
                  <span className="truncate pr-4">{file.name}</span>
                  <span className="text-blue-500 opacity-70">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                 <Terminal className="w-5 h-5 text-zinc-400" /> System Prompt
              </h2>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all resize-none mb-4 custom-scrollbar"
                placeholder="Instruct Gemma 4 on how to solve this..."
              />
              <button 
                onClick={handleSubmit} 
                disabled={loading || !file} 
                className={`w-full py-3.5 font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${loading || !file ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800' : 'bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-white/10'}`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {loading ? 'Processing...' : 'Run Analysis'}
              </button>
           </div>

        </div>

        {/* RIGHT COLUMN: OUTPUT AREA */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 min-h-[600px] flex flex-col">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                 <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" /> Analysis Output
                 </h2>
                 <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800">
                    gemma-4-26b-a4b-it
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                 {!solution && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50 py-20">
                       <BookOpen className="w-12 h-12 mb-4" />
                       <p className="font-medium text-lg">Awaiting Input</p>
                       <p className="text-sm max-w-sm text-center mt-2">Upload a past question and run the analysis to generate a step-by-step solution.</p>
                    </div>
                 )}

                 {loading && (
                    <div className="animate-pulse space-y-6 py-4">
                       <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
                       <div className="space-y-3">
                         <div className="h-4 w-full bg-zinc-800 rounded"></div>
                         <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>
                         <div className="h-4 w-4/6 bg-zinc-800 rounded"></div>
                       </div>
                       <div className="space-y-3 pt-6">
                         <div className="h-4 w-full bg-zinc-800 rounded"></div>
                         <div className="h-4 w-[90%] bg-zinc-800 rounded"></div>
                         <div className="h-4 w-[85%] bg-zinc-800 rounded"></div>
                       </div>
                    </div>
                 )}

                 {solution && (
                    <div className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap animate-fade-in font-medium">
                       {solution}
                    </div>
                 )}
                 <div ref={bottomRef} />
              </div>

           </div>
        </div>

      </main>
    </div>
  );
}
