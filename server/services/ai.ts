import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const generateHooks = async (topic: string, tone: string, format: string) => {
  if (!aiClient) throw new Error("Gemini API Key not configured");

  const systemInstruction = `You are a viral content expert. Generate 20 scroll-stopping hooks.
  Topic: ${topic}
  Tone: ${tone}
  Format: ${format}
  
  Output: A JSON array of strings. No markdown.`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 20 viral hooks about "${topic}"`,
      config: { systemInstruction },
    });

    const text = response.text || "[]";
    // Clean markdown
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Hook Gen Error:", error);
    throw error;
  }
};

export const generateAssetPrompt = async (type: string, prompt: string, brandStyle: any) => {
  if (!aiClient) throw new Error("Gemini API Key not configured");

  const systemInstruction = `You are an expert art director. 
  Convert the user's request into a detailed image generation prompt optimized for high quality.
  
  Asset Type: ${type}
  User Prompt: ${prompt}
  Brand Style: ${JSON.stringify(brandStyle)}
  
  Output: Just the refined prompt string.`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Refine this image prompt.",
      config: { systemInstruction },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Asset Prompt Error:", error);
    throw error;
  }
};
