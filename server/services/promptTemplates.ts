export interface BrandProfileContext {
  name: string;
  niche: string;
  tone: string;
  audience: string;
  platforms: string[];
  referenceContent?: string;
}

export const PROMPT_TEMPLATES = {
  /**
   * Generates 20 viral hooks with mixed styles
   */
  viralHooks: (topic: string, brand: BrandProfileContext) => ({
    systemInstruction: `You are a world-class content strategist specializing in the ${brand.niche} niche. 
Your goal is to write viral hooks that stop the scroll for a ${brand.audience} audience.
Adopt a ${brand.tone} tone of voice.`,
    userPrompt: `Generate 20 viral hooks about "${topic}".
    
    Requirements:
    - Output MUST be a raw JSON array of strings.
    - No numbering, no markdown code blocks, just the array.
    - Mix these specific styles:
      1. Contrarian/Polarizing (e.g., "Stop doing X")
      2. Story Openers (e.g., "I lost everything when...")
      3. Negative/Warning (e.g., "The biggest mistake...")
      4. Listicle/Value (e.g., "5 ways to...")
      5. Insider Secret (e.g., "What they don't tell you...")
    
    Ensure the hooks sound natural for ${brand.platforms.join(', ')}.`,
  }),

  /**
   * Generates a caption based on length and platform
   */
  caption: (topic: string, length: 'SHORT' | 'MEDIUM' | 'LONG', brand: BrandProfileContext) => {
    const lengthGuidelines = {
      SHORT: "Under 50 words. Punchy, direct, one clear CTA.",
      MEDIUM: "100-150 words. Hook -> Value -> CTA structure.",
      LONG: "300+ words. Storytelling style, micro-blog format, deep value.",
    };

    return {
      systemInstruction: `You are a social media copywriter for ${brand.name}. 
      Your niche is ${brand.niche} and your tone is ${brand.tone}.`,
      userPrompt: `Write a ${length.toLowerCase()} caption about "${topic}".
      
      Guidelines:
      - ${lengthGuidelines[length]}
      - Target Audience: ${brand.audience}
      - Platform context: Optimized for ${brand.platforms[0] || 'Instagram/TikTok'}
      - Include 3-5 relevant hashtags at the end.
      - formatting: Use line breaks for readability.`,
    };
  },

  /**
   * Generates a content calendar
   */
  contentCalendar: (days: 7 | 14 | 30, brand: BrandProfileContext) => ({
    systemInstruction: `You are an expert content planner. Plan a ${days}-day content strategy for a ${brand.niche} creator.`,
    userPrompt: `Create a ${days}-day content calendar.
    
    Brand Context:
    - Niche: ${brand.niche}
    - Audience: ${brand.audience}
    - Tone: ${brand.tone}
    
    Output Requirement:
    - Return ONLY a raw JSON array of objects.
    - Schema: Array<{ day: number, pillar: string, hook: string, format: string, description: string }>
    - Formats should vary between: Reel, Carousel, Static Post, Story.
    - Ensure a logical flow of topics.`,
  }),

  /**
   * Rewrites text to match brand voice
   */
  brandVoiceTransformer: (originalText: string, brand: BrandProfileContext) => ({
    systemInstruction: `You are a ghostwriter for ${brand.name}. Your job is to rewrite content to perfectly match their specific brand voice.`,
    userPrompt: `Rewrite the following text.
    
    Target Voice Settings:
    - Tone: ${brand.tone}
    - Niche Authority: ${brand.niche}
    - Audience: ${brand.audience}
    
    Original Text:
    "${originalText}"
    
    Output:
    - The rewritten version only.
    - Do not explain the changes.
    - Make it sound human and authentic.`,
  }),
};
