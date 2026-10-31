import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageFile.type;
    
    // Call Gemma 4 Multimodal API
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

    const solutionText = response.text;

    // Log solution to Supabase vault securely on backend
    const { error: dbError } = await supabase
      .from('pq_solutions')
      .insert([{ solution_text: solutionText }]);

    if (dbError) {
      console.error("Supabase Log Error:", dbError.message);
    }

    return NextResponse.json({ solution: solutionText });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Failed to process image with Gemma 4.' }, { status: 500 });
  }
}
