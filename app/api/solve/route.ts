import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const prompt = formData.get('prompt') as string || "Analyze this document or image thoroughly.";
    const historyParam = formData.get('history') as string;
    const history = historyParam ? JSON.parse(historyParam) : [];

    const contents: any[] = [];

    // Append prior conversation history
    for (const h of history) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      });
    }

    const currentParts: any[] = [{ text: prompt }];

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      currentParts.push({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: file.type
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
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemma 4 API Error:", error);
    return NextResponse.json({ error: 'Failed to process request with Gemma 4.' }, { status: 500 });
  }
}
