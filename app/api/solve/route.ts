import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageFile.type;
    
    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: buffer.toString('base64'), mimeType } },
            { text: prompt || "Solve this handwritten past question step-by-step." }
          ]
        }
      ]
    });

    return NextResponse.json({ solution: response.text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
