import { GoogleGenAI, Type } from "@google/genai";
import { FlavorSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlavorMatch = async (mood: string): Promise<FlavorSuggestion | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a creative and unique "marcianito" (frozen juice pop) flavor based on this mood/vibe: "${mood}". 
      Return the response in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A catchy, aesthetic name for the flavor" },
            description: { type: Type.STRING, description: "A short, poetic description of the taste sensation (max 20 words)" },
            ingredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 main ingredients" 
            }
          },
          required: ["name", "description", "ingredients"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FlavorSuggestion;
    }
    return null;
  } catch (error) {
    console.error("Error generating flavor:", error);
    return null;
  }
};