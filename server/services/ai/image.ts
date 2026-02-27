import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const imageService = {
  async generate(prompt: string, style?: string, size: "512px" | "1K" | "2K" | "4K" = "1K") {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const stylePrompts: Record<string, string> = {
      'MrBeast': 'High contrast, vibrant colors, expressive face, bold text, YouTube thumbnail style, 4k, hyper-realistic',
      'Minimalist': 'Clean, plenty of negative space, elegant typography, muted tones, professional photography',
      'Glowy': 'Cinematic lighting, neon accents, soft bokeh, ethereal atmosphere, high fashion aesthetic',
      'Tech': 'Sleek, futuristic, blue and silver tones, high-tech gadgets, sharp focus, macro photography'
    };

    const refinedPrompt = style && stylePrompts[style] 
      ? `${stylePrompts[style]}: ${prompt}` 
      : prompt;

    try {
      // Using gemini-3.1-flash-image-preview for high quality
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: refinedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: size
          }
        }
      });

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
