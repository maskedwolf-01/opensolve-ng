import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const prompt = formData.get('prompt') as string || "Solve this step-by-step.";
    const historyParam = formData.get('history') as string;
    const history = historyParam ? JSON.parse(historyParam) : [];

    // Construct the contents payload for Gemma 4 multimodal reasoning
    const contents: any[] = [];

    // Add prior conversation history if available
    for (const h of history) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      });
    }

    // Build the current user message parts
    const currentParts: any[] = [{ text: prompt }];

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      currentParts.push({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: imageFile.type
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
