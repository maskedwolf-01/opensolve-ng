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
    <main style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>OpenSolve NG</h1>
      <p style={{ color: '#555', marginBottom: '24px' }}>Open-Source Gemma 4 Past Question Solver</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          required 
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={loading || !file} 
          style={{ 
            padding: '12px', 
            backgroundColor: loading ? '#999' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Gemma 4 is Analyzing...' : 'Solve Question'}
        </button>
      </form>

      {solution && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', border: '1px solid #eee', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          <h2 style={{ marginTop: 0 }}>Solution:</h2>
          {solution}
        </div>
      )}
    </main>
  );
}
