import express from 'express';
import { generateText } from '../services/ai.ts';
import { authenticateToken, AuthRequest } from '../middleware/auth.ts';
import db from '../db/index.ts';
import { z } from 'zod';

const router = express.Router();

const generateHooksSchema = z.object({
  topic: z.string().min(3),
  tone: z.string().optional(),
  format: z.string().optional(),
});

router.post('/generate/hooks', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { topic, tone, format } = generateHooksSchema.parse(req.body);
    const user = req.user!;

    // Check usage limits (mock implementation)
    // In a real app, we would query the DB for usage counts

    const systemInstruction = `You are a viral content expert for social media (Instagram, TikTok, YouTube Shorts).
    Your goal is to generate scroll-stopping hooks based on the user's topic.
    
    Tone: ${tone || 'Professional yet engaging'}
    Format: ${format || 'Listicle/Educational'}
    
    Output format: Return a JSON array of 5 strings. Do not include markdown code blocks. Just the raw JSON array.`;

    const prompt = `Generate 5 viral hooks about: "${topic}".`;

    const text = await generateText(prompt, systemInstruction);
    
    // Parse the response to ensure it's JSON
    let hooks = [];
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      hooks = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse AI response:', text);
      return res.status(500).json({ error: 'Failed to generate valid hooks' });
    }

    // Save to DB (optional for MVP, but good for history)
    const insert = db.prepare('INSERT INTO generated_content (id, user_id, type, content_data, metadata) VALUES (?, ?, ?, ?, ?)');
    insert.run(
      crypto.randomUUID(), 
      user.id, 
      'HOOK', 
      JSON.stringify(hooks), 
      JSON.stringify({ topic, tone, format })
    );

    res.json({ hooks });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors });
    }
    console.error('Generate hooks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
