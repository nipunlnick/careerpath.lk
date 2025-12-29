import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("No API key found in environments");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function listModels() {
  try {
    console.log("Fetching available models...");
    // @ts-ignore - The type definition might be slighty different depending on sdk version
    const response = await ai.models.list();
    
    console.log("Available Models:");
    // The response structure might vary, let's try to log broadly
    if (Array.isArray(response)) {
        response.forEach((m: any) => console.log(`- ${m.name}`));
    } else if ((response as any).models) {
        (response as any).models.forEach((m: any) => console.log(`- ${m.name}`));
    } else {
        console.log(JSON.stringify(response, null, 2));
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
