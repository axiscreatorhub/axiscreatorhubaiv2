import { GoogleGenAI } from "@google/genai";
import { BrandProfileContext } from "../promptTemplates.ts";

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const textService = {
  async generate(prompt: string, brand?: BrandProfileContext, systemInstruction?: string) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = brand 
      ? `Brand Context: Name: ${brand.name}, Niche: ${brand.niche}, Tone: ${brand.tone}, Audience: ${brand.audience}`
      : "";

    const finalSystemInstruction = systemInstruction || `You are an expert content creator AI. 
    ${brandContext}
    Generate high-quality, engaging content based on the user's request.`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { systemInstruction: finalSystemInstruction },
      });
      return response.text;
    } catch (error) {
      console.error("Text Generation Error:", error);
      throw error;
    }
  },

  async chat(message: string, history: any[], brand?: BrandProfileContext) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = brand 
      ? `You are assisting ${brand.name}, a creator in the ${brand.niche} niche. Tone: ${brand.tone}.`
      : "You are assisting a content creator.";

    const systemInstruction = `You are AXIS AI, an elite creative strategist.
    ${brandContext}
    Your goal is to help the user grow their audience, improve their content, and monetize.
    Keep answers concise, actionable, and encouraging.`;

    try {
      // Note: In a real chat implementation, we would maintain history properly.
      // For this stateless example, we just use generateContent with the message.
      // To use history, we would use aiClient.chats.create() and pass history.
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: { systemInstruction },
      });
      return response.text;
    } catch (error) {
      console.error("Chat Error:", error);
      throw error;
    }
  },

  async refine(text: string, instruction: string) {
    if (!aiClient) throw new Error("Gemini API Key not configured");
    
    const prompt = `Original Text: "${text}"\n\nInstruction: ${instruction}\n\nRefined Text:`;
    
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Refine Error:", error);
      throw error;
    }
  }
};
