import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const imageService = {
  async generate(prompt: string, style?: string) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const refinedPrompt = style ? `${style} style: ${prompt}` : prompt;

    try {
      // Using gemini-2.5-flash-image for standard generation
      // Or gemini-3-pro-image-preview for high quality if needed
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: refinedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9", // Default for thumbnails
          }
        }
      });

      // Extract image data
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image generated");
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  },

  async edit(imageBuffer: string, instruction: string) {
    // Placeholder for image editing logic
    // Would use gemini-2.5-flash-image with image input + text prompt
    console.log("Image editing not fully implemented yet");
    return imageBuffer; 
  }
};
