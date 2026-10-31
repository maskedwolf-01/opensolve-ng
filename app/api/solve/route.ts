import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the SDK with the API key from your .env.local file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    // Convert the uploaded file into a buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageFile.type;
    
    // Call the Gemini API utilizing the Gemma 4 model string
    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it", // Official model identifier for Gemma 4
      contents: [
        {
          role: 'user',
          parts: [
            // Pass the image data inline
            { inlineData: { data: buffer.toString('base64'), mimeType } },
            // Pass the user's specific prompt instructions
            { text: prompt || "Solve this handwritten past question step-by-step." }
          ]
        }
      ]
    });

    return NextResponse.json({ solution: response.text });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Failed to process image. Ensure your API key is valid and the image size is reasonable.' }, { status: 500 });
  }
}
