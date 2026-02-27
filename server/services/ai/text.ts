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
  },

  async predictPerformance(topic: string, content: string, niche: string, brand?: BrandProfileContext) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = brand 
      ? `Brand Context: Name: ${brand.name}, Niche: ${brand.niche}, Tone: ${brand.tone}.`
      : "";

    const prompt = `Analyze the following video concept and script for its viral potential in the ${niche} niche.
    Topic: ${topic}
    Script: ${content}
    ${brandContext}
    
    Provide a detailed performance prediction including:
    1. Viral Potential Score (1-100).
    2. Predicted Engagement Rate (%).
    3. Audience Retention Forecast (High/Medium/Low).
    4. Key Strengths (3 points).
    5. Critical Improvements to increase CTR and retention (3 points).
    
    Output as a JSON object: { "score": number, "engagement": string, "retention": string, "strengths": string[], "improvements": string[] }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Performance Prediction Error:", error);
      throw error;
    }
  },

  async generateContract(brandName: string, sponsorName: string, terms: { fee: string; deliverables: string; timeline: string }) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const prompt = `Draft a professional Brand Deal Contract Template.
    Creator/Brand: ${brandName}
    Sponsor: ${sponsorName}
    Fee: ${terms.fee}
    Deliverables: ${terms.deliverables}
    Timeline: ${terms.timeline}
    
    Include standard clauses for:
    1. Scope of Work.
    2. Payment Terms.
    3. Usage Rights & Exclusivity.
    4. Termination.
    5. Confidentiality.
    
    Output as a JSON object: { "title": string, "content": string }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Contract Generation Error:", error);
      throw error;
    }
  },

  async generateThumbnailIdeas(topic: string, niche: string, brand?: BrandProfileContext) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = brand 
      ? `Brand Context: Name: ${brand.name}, Niche: ${brand.niche}, Tone: ${brand.tone}.`
      : "";

    const prompt = `Generate 3 distinct thumbnail concepts for A/B testing a video about "${topic}" in the ${niche} niche.
    ${brandContext}
    
    For each concept, provide:
    1. A descriptive title for the concept.
    2. Visual composition (what's in the frame).
    3. Text overlay (what text is on the thumbnail).
    4. Psychological trigger (why it will get clicks - e.g., curiosity, fear of missing out, authority).
    5. Color palette suggestion.
    
    Output as a JSON array of objects: { "title": string, "visual": string, "text": string, "trigger": string, "colors": string[] }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Thumbnail Ideas Error:", error);
      throw error;
    }
  },

  async generatePitch(sponsorName: string, sponsorDescription: string, brand: BrandProfileContext, stats: any) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = `Brand Context: Name: ${brand.name}, Niche: ${brand.niche}, Tone: ${brand.tone}.`;
    const statsContext = `Live Stats: ${JSON.stringify(stats)}`;

    const prompt = `Draft a highly professional and persuasive sponsorship pitch email to ${sponsorName}.
    Sponsor Info: ${sponsorDescription}
    ${brandContext}
    ${statsContext}
    
    Requirements:
    1. Compelling subject line.
    2. Personalized opening.
    3. Value proposition using the provided stats (e.g., reach, engagement, media kit views).
    4. Call to action (e.g., schedule a call, review media kit).
    5. Maintain the creator's specific tone.
    
    Output Format (JSON):
    {
      "subject": "Email subject line",
      "body": "Full email body text..."
    }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Pitch Generation Error:", error);
      throw error;
    }
  },

  async repurposeContent(originalContent: string, targetPlatform: string, brand?: BrandProfileContext) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = brand 
      ? `Brand Context: Name: ${brand.name}, Niche: ${brand.niche}, Tone: ${brand.tone}.`
      : "";

    const prompt = `Repurpose the following content for ${targetPlatform}.
    Original Content: "${originalContent}"
    ${brandContext}
    
    Requirements:
    - Match the specific formatting and culture of ${targetPlatform}.
    - Maintain the core message but optimize for engagement on the new platform.
    - If it's a Twitter thread, return a JSON array of tweets.
    - If it's a LinkedIn post, use professional but engaging formatting.
    
    Output Format:
    {
      "content": "The repurposed content here..."
    }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Repurpose Error:", error);
      throw error;
    }
  },

  async trendScout(niche: string) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const prompt = `What are the top 5 trending topics, memes, or news items in the ${niche} niche right now (today)? 
    For each trend, provide:
    1. A catchy title.
    2. Why it's trending.
    3. A specific content idea for a creator.
    
    Output as a JSON array of objects: { "title": string, "reason": string, "idea": string }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Trend Scout Error:", error);
      throw error;
    }
  },

  async getSuggestions(niche: string, tone: string, recentTopics: string[]) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const prompt = `Based on this creator's profile and recent scripts, suggest 3 proactive "Next Steps" to grow their brand or monetize.
    Niche: ${niche}
    Tone: ${tone}
    Recent Topics: ${recentTopics.join(', ')}
    
    One suggestion should ideally be about monetization or brand outreach if they have recent content.
    
    Output as a JSON array of objects: { "title": string, "description": string, "action": string, "href": string }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Suggestions Error:", error);
      throw error;
    }
  },

  async generateScript(topic: string, format: string, brand?: BrandProfileContext) {
    if (!aiClient) throw new Error("Gemini API Key not configured");

    const brandContext = brand 
      ? `Brand Context: Name: ${brand.name}, Niche: ${brand.niche}, Tone: ${brand.tone}.`
      : "";
    
    const referenceContext = brand?.referenceContent 
      ? `Reference Content (Match this style/voice): ${brand.referenceContent}`
      : "";

    const prompt = `Generate a high-retention viral video script for ${format}.
    Topic: ${topic}
    ${brandContext}
    ${referenceContext}
    
    The script must include:
    1. A scroll-stopping HOOK (first 3 seconds).
    2. High-value BODY content (fast-paced).
    3. A clear CALL TO ACTION (CTA).
    
    Adopt the creator's specific voice and vocabulary from the reference content if provided.
    
    Output Format (JSON):
    {
      "content": "Full formatted script text here...",
      "viralScore": 85, // A score from 1-100 based on hook strength and pacing
      "storyboard": [
        { "scene": 1, "visual": "Description of visual", "audio": "Script line" },
        ...
      ]
    }`;

    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Script Generation Error:", error);
      throw error;
    }
  }
};
