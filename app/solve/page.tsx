"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, UploadCloud, FileText, Send, ArrowLeft, Loader2, Cpu, Sparkles, User, X } from 'lucide-react';

// --- FLUID MARKDOWN RENDERER ---
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
      <div key={`table-${key}`} className="my-3 w-full overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-900 text-blue-400">
              {headers.map((h, i) => <th key={i} className="p-2 sm:p-3 border-b border-zinc-800 font-bold whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/50">
                {row.map((cell, j) => <td key={j} className="p-2 sm:p-3 align-top text-zinc-300 break-words" dangerouslySetInnerHTML={{__html: formatBold(cell)}}></td>)}
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
      
      if (line.startsWith('### ')) renderedContent.push(<h3 key={i} className="text-blue-400 font-bold text-sm sm:text-base mt-3 mb-1.5 break-words">{line.replace('### ', '')}</h3>);
      else if (line.startsWith('## ')) renderedContent.push(<h2 key={i} className="text-blue-300 font-bold text-base sm:text-lg mt-4 mb-2 border-b border-zinc-800 pb-1.5 break-words">{line.replace('## ', '')}</h2>);
      else if (line.startsWith('* ')) renderedContent.push(<div key={i} className="flex gap-2 my-1"><span className="text-blue-500 font-bold">•</span><span className="break-words text-zinc-300 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: formatBold(line.replace('* ', '')) }}></span></div>);
      else if (line.startsWith('- ')) renderedContent.push(<div key={i} className="flex gap-2 my-1"><span className="text-blue-500 font-bold">•</span><span className="break-words text-zinc-300 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: formatBold(line.replace('- ', '')) }}></span></div>);
      else if (line === '') renderedContent.push(<div key={i} className="h-1.5"></div>);
      else renderedContent.push(<p key={i} className="leading-relaxed break-words whitespace-pre-wrap text-zinc-300 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: formatBold(line) }}></p>);
    }
  }
  if (inTable) renderedContent.push(flushTable(lines.length));
  return <div className="space-y-1 w-full overflow-x-hidden">{renderedContent}</div>;
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
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
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
      setMessages([...newMessages, { role: 'ai', text: data.reply || data.error || "An error occurred with Gemma 4." }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', text: "⚠️ Network error connecting to Gemma 4 engine." }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col box-border overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-xl border-b border-zinc-800 bg-zinc-950/90 flex-none box-border">
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between box-border">
          <div className="flex items-center gap-2 min-w-0">
             <Link href="/" className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100 flex-shrink-0">
               <ArrowLeft className="w-4 h-4" />
             </Link>
             <div className="w-7 h-7 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
               <Terminal className="w-4 h-4 text-zinc-950" />
             </div>
             <span className="text-xs sm:text-sm font-bold tracking-tight text-zinc-100 font-mono truncate">OpenSolve NG</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full flex-shrink-0">
            <Cpu className="w-3 h-3" /> Gemma 4
          </div>
        </div>
      </nav>

      {/* CHAT CONTAINER */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 flex flex-col justify-between box-border">
        
        {/* MESSAGES LIST */}
        <div className="flex-1 w-full overflow-y-auto space-y-4 pb-32 box-border">
          {messages.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center px-2">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-3 text-blue-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-base sm:text-xl font-bold text-zinc-100">What are we solving today?</h1>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-xs mt-1.5 leading-relaxed">
                Upload any past question image or PDF syllabus and chat live with Gemma 4.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 sm:gap-3 w-full box-border ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                )}
                <div className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm max-w-[85%] sm:max-w-[80%] shadow-lg break-words box-border ${
                  msg.role === 'ai' 
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm' 
                    : 'bg-zinc-100 text-zinc-950 rounded-tr-sm font-medium'
                }`}>
                  {msg.fileName && (
                    <div className="mb-2 p-1.5 bg-zinc-950/40 rounded border border-zinc-800 text-[10px] font-mono flex items-center gap-1.5 text-zinc-300 truncate">
                      <FileText className="w-3 h-3 text-blue-400 flex-shrink-0" /> <span className="truncate">{msg.fileName}</span>
                    </div>
                  )}
                  {msg.role === 'ai' ? <MarkdownRenderer text={msg.text} /> : msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="space-y-2 max-w-[85%]">
              <div className="flex items-center gap-2 text-[11px] text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" /> <span>Gemma 4 is synthesizing solution...</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden border border-zinc-800">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 h-full rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent p-3 z-30 box-border">
          <div className="w-full max-w-3xl mx-auto box-border">
            
            {file && (
              <div className="mb-2 flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg w-fit text-xs text-zinc-300">
                {previewUrl ? <img src={previewUrl} alt="Thumb" className="w-4 h-4 object-cover rounded" /> : <FileText className="w-3 h-3 text-blue-400" />}
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => { setFile(null); setPreviewUrl(null); }} className="text-zinc-500 hover:text-zinc-100 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 flex items-center gap-2 shadow-2xl box-border w-full">
              <label className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors flex-shrink-0">
                <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
              </label>

              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Gemma anything..."
                className="flex-1 bg-transparent border-none text-zinc-100 px-1 py-1.5 text-xs sm:text-sm focus:outline-none placeholder:text-zinc-600 min-w-0"
                disabled={loading}
              />

              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !file) || loading}
                className={`p-2 rounded-lg transition-all flex items-center justify-center flex-shrink-0 ${
                  (input.trim() || file) && !loading 
                    ? 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="text-center mt-1.5 text-[9px] text-zinc-600 uppercase tracking-widest font-mono">
              Open-Source AI Engine • Powered by Gemma 4 Multimodal
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
