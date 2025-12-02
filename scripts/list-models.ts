import * as dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error('API Key not found');
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // The new SDK might have a different way to list models.
    // Checking documentation or common patterns.
    // Usually it's ai.models.list() or similar.
    // Based on the error message "Call ListModels", it implies such a method exists.
    
    // In the new @google/genai SDK, it might be slightly different than google-generative-ai.
    // Let's try the standard way for the new SDK.
    
    const response = await ai.models.list();
    console.log('Gemini Models:');
    for await (const model of response) {
        if (model.name.includes('gemini')) {
            console.log(model.name);
        }
    }

  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
