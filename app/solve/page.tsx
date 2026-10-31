"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, UploadCloud, FileText, Send, ArrowLeft, Loader2, Cpu, Sparkles, User, X } from 'lucide-react';

// --- INLINE MARKDOWN RENDERER ---
const formatBold = (text: string) => text ? text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') : "";

const MarkdownRenderer = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const renderedContent = [];
  let tableBuffer: string[] = [];
  let inTable = false;

  const flushTable = (key: number) => {
    if (tableBuffer.length === 0) return null;
    const headers = tableBuffer[0].split('|').filter(c => c.trim()).map(c => c.trim());
    const rows = tableBuffer.slice(2).map(row => row.split('|').filter(c => c.trim()).map(c => c.trim()));

    return (
      <div key={`table-${key}`} className="my-4 w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
        <table className="w-full text-left text-sm border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-zinc-900 text-blue-400">
              {headers.map((h, i) => <th key={i} className="p-3 border-b border-zinc-800 font-bold whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/50 transition-colors">
                {row.map((cell, j) => <td key={j} className="p-3 align-top text-zinc-300 break-words" dangerouslySetInnerHTML={{__html: formatBold(cell)}}></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true; tableBuffer.push(line);
    } else {
      if (inTable) { renderedContent.push(flushTable(i)); tableBuffer = []; inTable = false; }
      
      if (line.startsWith('### ')) renderedContent.push(<h3 key={i} className="text-blue-400 font-bold text-lg mt-4 mb-2 break-words">{line.replace('### ', '')}</h3>);
      else if (line.startsWith('## ')) renderedContent.push(<h2 key={i} className="text-blue-300 font-bold text-xl mt-5 mb-3 border-b border-zinc-800 pb-2 break-words">{line.replace('## ', '')}</h2>);
      else if (line.startsWith('* ')) renderedContent.push(<div key={i} className="flex gap-2 ml-1 my-1"><span className="text-blue-500 font-bold">•</span><span className="break-words text-zinc-300" dangerouslySetInnerHTML={{ __html: formatBold(line.replace('* ', '')) }}></span></div>);
      else if (line.startsWith('- ')) renderedContent.push(<div key={i} className="flex gap-2 ml-1 my-1"><span className="text-blue-500 font-bold">•</span><span className="break-words text-zinc-300" dangerouslySetInnerHTML={{ __html: formatBold(line.replace('- ', '')) }}></span></div>);
      else if (line === '') renderedContent.push(<div key={i} className="h-2"></div>);
      else renderedContent.push(<p key={i} className="leading-relaxed break-words whitespace-pre-wrap text-zinc-300" dangerouslySetInnerHTML={{ __html: formatBold(line) }}></p>);
    }
  }
  if (inTable) renderedContent.push(flushTable(lines.length));
  return <div className="space-y-1 w-full">{renderedContent}</div>;
};

export default function SolveWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !file) || loading) return;

    const userMsgText = input.trim() || (file ? `Analyze this attached file: ${file.name}` : '');
    const newMessages = [...messages, { role: 'user', text: userMsgText, fileName: file?.name }];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('prompt', userMsgText);
    formData.append('history', JSON.stringify(messages.map(m => ({ role: m.role, content: m.text }))));

    try {
      const res = await fetch('/api/solve', { method: 'POST', body: formData });
      const data = await res.json();
      
      const reply = data.reply || data.error || "An error occurred with Gemma 4.";
      setMessages([...newMessages, { role: 'ai', text: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', text: "⚠️ Network error connecting to Gemma 4 engine." }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl border-b border-zinc-800 bg-zinc-950/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
               <Terminal className="w-5 h-5 text-zinc-950" />
             </div>
             <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 font-mono">OpenSolve NG</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
            <Cpu className="w-3 h-3" /> Gemma 4 Multimodal
          </div>
        </div>
      </nav>

      {/* CHAT CONTAINER */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col justify-between">
        
        {/* MESSAGES LIST */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-28 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">What are we solving today?</h1>
              <p className="text-zinc-400 text-sm max-w-md mt-2 leading-relaxed">
                Upload any past question image or PDF syllabus. Ask questions, request breakdowns, and chat live with Gemma 4.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                <div className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base max-w-[90%] sm:max-w-[80%] shadow-lg ${
                  msg.role === 'ai' 
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm' 
                    : 'bg-zinc-100 text-zinc-950 rounded-tr-sm font-medium'
                }`}>
                  {msg.fileName && (
                    <div className="mb-3 p-2 bg-zinc-950/40 rounded-lg border border-zinc-800 text-xs font-mono flex items-center gap-2 text-zinc-300">
                      <FileText className="w-4 h-4 text-blue-400" /> {msg.fileName}
                    </div>
                  )}
                  {msg.role === 'ai' ? <MarkdownRenderer text={msg.text} /> : msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-zinc-300" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* LOADING PROGRESS STATE */}
          {loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Gemma 4 is parsing layers & synthesizing solution...
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT & FILE ATTACHMENT BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent p-4 z-30">
          <div className="max-w-5xl mx-auto">
            
            {file && (
              <div className="mb-2 flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit text-xs text-zinc-300">
                {previewUrl ? <img src={previewUrl} alt="Thumb" className="w-5 h-5 object-cover rounded" /> : <FileText className="w-4 h-4 text-blue-400" />}
                <span className="truncate max-w-[200px]">{file.name}</span>
                <button onClick={() => { setFile(null); setPreviewUrl(null); }} className="text-zinc-500 hover:text-zinc-100 ml-2">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
              <label className="p-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors">
                <UploadCloud className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
              </label>

              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Gemma anything or paste instructions..."
                className="flex-1 bg-transparent border-none text-zinc-100 px-2 py-2 text-sm focus:outline-none placeholder:text-zinc-600"
                disabled={loading}
              />

              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !file) || loading}
                className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                  (input.trim() || file) && !loading 
                    ? 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="text-center mt-2 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
              Open-Source AI Engine • Powered by Gemma 4 Multimodal
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
