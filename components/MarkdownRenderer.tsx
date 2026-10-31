// components/MarkdownRenderer.tsx
import React from 'react';

const formatBold = (text: string) => text ? text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') : "";

export const MarkdownRenderer = ({ text }: { text: string }) => {
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
