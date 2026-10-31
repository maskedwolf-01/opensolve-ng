import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prompt = formData.get('prompt'] as string || "Analyze this document or image thoroughly.";
    const historyParam = formData.get('history') as string;
    const history = historyParam ? JSON.parse(historyParam) : [];

    // System instruction: broad academic tutor, never confined only to math, warm and intelligent mentor tone
    const systemInstruction = `You are OpenSolve NG's advanced AI study tutor, built for Nigerian university students. 
    - You handle ANY academic prompt thrown at you: Computer Science, networking, programming code, algorithms, physics, essays, logic, theory, or calculations. 
    - Do NOT restrict yourself only to mathematics. 
    - Explain complex concepts simply, break things down step-by-step, use clean markdown tables and bullet points, and maintain an encouraging mentor tone.`;

    const contents: any[] = [];

    // Append prior conversation history safely
    for (const h of history) {
      if (h && h.content) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        });
      }
    }

    const currentParts: any[] = [{ text: prompt }];

    // Handle mobile/PC file attachments safely
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      currentParts.push({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: file.type || 'image/jpeg'
        }
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemma 4 API Error on Mobile/PC:", error);
    return NextResponse.json({ error: `AI Processing Error: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
