"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Terminal, UploadCloud, ChevronRight, FileText, CheckCircle, Lightbulb, Cpu, BookOpen, ShieldCheck, Github, ArrowRight, Sparkles, Layers, Shield, CheckCircle2, Users } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleCode = `// OpenSolve NG - Gemma 4 Multimodal Pipeline
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemma-4-26b-a4b-it",
  contents: [{ role: 'user', parts: [{ inlineData: { data: base64Image, mimeType: "image/png" } }, { text: "Solve step-by-step" }] }]
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 overflow-x-hidden box-border">
      
      {/* MLH BANNER */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800 py-2.5 px-3 sm:px-4 text-center z-50 relative box-border">
        <p className="text-[11px] sm:text-xs font-medium text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider flex-shrink-0">MLH Hacktoberfest 2026</span>
          <span className="truncate">OpenSolve NG is live for the Ikole-Ekiti x Oye-Ekiti Hack Day.</span>
        </p>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl border-b border-zinc-800 bg-zinc-950/80 box-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between box-border">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Terminal className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-base sm:text-xl font-bold tracking-tight text-zinc-100 font-mono truncate">opensolve-ng</span>
            </div>
            <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
              <a href="#demo" className="hover:text-zinc-100 transition-colors">Live Demo</a>
              <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">How it Works</a>
              <a href="#stack" className="hover:text-zinc-100 transition-colors">Architecture</a>
            </div>
          </div>
          <div className="flex gap-3 items-center flex-shrink-0">
             <Link 
               href="/solve" 
               className="px-3.5 sm:px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
             >
               Workspace <ArrowRight className="w-4 h-4" />
             </Link>
             <a 
               href="https://github.com/maskedwolf-01/opensolve-ng" 
               target="_blank" 
               rel="noreferrer"
               className="hidden sm:flex px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-all items-center gap-2 shadow-sm"
             >
               <span>Star on GitHub</span>
             </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="demo" className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden border-b border-zinc-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 box-border">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center box-border">
          
          <div className="text-left z-10 min-w-0 overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Cpu className="w-3.5 h-3.5" /> Powered by Gemma 4
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-100 leading-[1.1] break-words">
              Decode handwritten <br className="hidden sm:block"/> past questions.
            </h1>
            
            <p className="text-sm sm:text-lg text-zinc-400 mb-8 sm:mb-10 max-w-lg leading-relaxed font-light break-words">
              The open-source multimodal engine for Nigerian universities. Upload blurry handouts and let Gemma 4 extract, format, and solve the logic step-by-step.
            </p>
            
            {/* UPLOADER */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800 backdrop-blur-sm box-border">
              <label className="flex flex-col p-4 sm:p-6 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl cursor-pointer bg-zinc-950/50 transition-all group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 group-hover:scale-105 transition-transform flex-shrink-0">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-medium text-zinc-100 text-sm sm:text-base truncate">Upload Past Question</span>
                    <span className="text-xs text-zinc-500">PNG, JPG up to 5MB</span>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
              </label>

              {file && (
                <div className="px-4 py-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-xs font-medium text-blue-400 truncate flex items-center gap-2">
                  <FileText className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{file.name}</span>
                </div>
              )}

              <button type="submit" disabled={loading || !file} className={`w-full py-3.5 font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-sm ${loading || !file ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800' : 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg hover:shadow-white/10'}`}>
                {loading ? 'Gemma 4 is analyzing...' : 'Generate Solution'} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* DYNAMIC SOLUTION AREA */}
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-zinc-900/30 rounded-3xl border border-zinc-800 p-4 flex flex-col justify-center items-center overflow-hidden box-border">
             {solution ? (
                <div className="w-full h-full overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 relative z-10 text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words custom-scrollbar">
                  <h3 className="text-zinc-100 font-medium mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3 sticky top-0 bg-zinc-950 py-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" /> Gemma 4 Solution
                  </h3>
                  {solution}
                </div>
             ) : (
                <div className="w-[90%] bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl transform rotate-[-2deg]">
                  <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 flex-shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="h-3 w-3/4 bg-zinc-800 rounded-full"></div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-4">
                    <Lightbulb className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                    <div className="space-y-3 w-full pt-1 opacity-50">
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 border-b border-zinc-900 box-border">
        <div className="w-full max-w-7xl mx-auto box-border">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4 break-words">From image to understanding in seconds.</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed px-2">Built to handle the harsh realities of student group chats: bad lighting, terrible handwriting, and complex mathematics.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-3xl min-w-0 overflow-hidden">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 text-zinc-300 border border-zinc-700">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3">1. Snap & Upload</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">Take a photo of your physical handout or screenshot a past question from WhatsApp. Drop it right into the platform.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-3xl min-w-0 overflow-hidden">
              <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 border border-blue-900/50">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3">2. Multimodal Processing</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">The Gemma 4 open-weights model uses advanced optical character recognition and reasoning to transcribe the chaotic handwriting.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-3xl min-w-0 overflow-hidden">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 text-zinc-300 border border-zinc-700">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-3">3. Step-by-Step Breakdown</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">You don't just get the final answer. You get a line-by-line explanation of the mathematical working or programming logic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK / OPEN SOURCE & CODE PREVIEW */}
      <section id="stack" className="py-16 sm:py-24 px-4 sm:px-6 box-border">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center box-border">
          <div className="min-w-0 overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-6 break-words">Designed for community contribution.</h2>
            <p className="text-xs sm:text-sm sm:text-base text-zinc-400 mb-6 leading-relaxed break-words">
              OpenSolve NG is fully open-source. We built this so developers from any Nigerian university can fork the repository, add their school's specific prompt grading rubrics via `prompts.json`, and submit a Pull Request.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium"><ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" /> MIT Licensed Infrastructure</li>
              <li className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium"><Terminal className="w-5 h-5 text-blue-400 flex-shrink-0" /> Next.js App Router & Tailwind CSS</li>
              <li className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium"><BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" /> Google Gen AI SDK integration</li>
            </ul>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-xl min-w-0 overflow-hidden box-border">
             <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
               <span className="text-xs font-mono text-zinc-400">app/api/solve/route.ts</span>
               <button 
                 onClick={copyCode}
                 className="px-3 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] font-mono text-zinc-300 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
               >
                 {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Terminal className="w-3 h-3" />}
                 {copied ? 'Copied' : 'Copy'}
               </button>
             </div>
             <div className="w-full overflow-x-auto custom-scrollbar">
               <pre className="text-[11px] sm:text-xs text-blue-300 font-mono leading-loose whitespace-pre sm:whitespace-pre-wrap break-all sm:break-normal">
                <span>// The core multimodal request handling</span><br/>
                const response = await ai.models.generateContent(&#123;<br/>
                &nbsp;&nbsp;model: "gemma-4-26b-a4b-it",<br/>
                &nbsp;&nbsp;contents: [<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role: 'user',<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parts: [<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; inlineData: &#123; data: buffer, mimeType &#125; &#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; text: "Solve this past question." &#125;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                &nbsp;&nbsp;]<br/>
                &#125;);
               </pre>
             </div>
          </div>
        </div>
      </section>

      {/* SUPERB FOOTER */}
      <footer className="pt-16 pb-8 bg-zinc-950 border-t border-zinc-900 box-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 box-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 border-b border-zinc-900 pb-12 mb-8">
            <div className="md:col-span-2 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <span className="text-lg font-bold text-zinc-100 font-mono truncate">opensolve-ng</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-sm leading-relaxed mb-6 break-words">
                Democratizing academic understanding for Nigerian university students through open-weights AI and open-source infrastructure.
              </p>
              <div className="inline-block border border-zinc-800 bg-zinc-900 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400">
                Created for MLH Hacktoberfest 2026
              </div>
            </div>
            
            <div>
              <h4 className="text-zinc-100 font-bold mb-4 text-sm">Project</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-500">
                <li><a href="https://github.com/maskedwolf-01/opensolve-ng" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">GitHub Repository</a></li>
                <li><a href="#how-it-works" className="hover:text-zinc-300 transition-colors">Features</a></li>
                <li><a href="#stack" className="hover:text-zinc-300 transition-colors">Architecture</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-zinc-100 font-bold mb-4 text-sm">Tech Stack</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-500">
                <li><span className="hover:text-zinc-300 transition-colors cursor-default">Gemma 4 Multimodal</span></li>
                <li><span className="hover:text-zinc-300 transition-colors cursor-default">Next.js App Router</span></li>
                <li><span className="hover:text-zinc-300 transition-colors cursor-default">Google Gen AI SDK</span></li>
                <li><span className="hover:text-zinc-300 transition-colors cursor-default">Vercel Edge Network</span></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
            <p>© {new Date().getFullYear()} OpenSolve NG. Built by Majeed Abdulwali.</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>MIT License</span>
              <span>Hack Day Ikole-Ekiti x Oye-Ekiti</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
