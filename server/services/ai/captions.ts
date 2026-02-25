import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const captionService = {
  async generate(videoContext: string) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    // In a real scenario, we would upload the video file to the File API and pass the URI.
    // Here we simulate by taking a text description of the video context.
    
    const prompt = `Generate engaging captions for a video about: "${videoContext}".
    Include timestamps if possible (mock format).`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Caption Generation Error:", error);
      throw error;
    }
  },

  async style(captions: string, style: 'hormozi' | 'minimal' | 'karaoke') {
    // Logic to style captions (e.g., adding CSS classes or formatting text)
    // This is more of a frontend or post-processing task, but AI can help format the text structure.
    return captions; 
  }
};
