import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.ts';
import prisma from '../db/prisma.ts';
import { textService } from '../services/ai/text.ts';
import { PROMPT_TEMPLATES } from '../services/promptTemplates.ts';
import { usageService } from '../services/usage.ts';

const router = express.Router();

const generateSchema = z.object({
  topic: z.string().min(3),
  tone: z.string().optional(),
  format: z.string().optional(),
});

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { topic, tone, format } = generateSchema.parse(req.body);
    const userId = req.user.id;

    // Check usage limits
    await usageService.checkLimit(userId, 'HOOK_GEN');

    // Fetch brand profile
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId }
    });

    // Default brand context if not set
    const brandContext = {
      name: brandProfile?.name || 'Creator',
      niche: brandProfile?.niche || 'General',
      tone: tone || brandProfile?.tone || 'Professional',
      audience: brandProfile?.audience || 'General Audience',
      platforms: brandProfile?.platforms ? JSON.parse(brandProfile.platforms) : ['Instagram']
    } as any;
    
    // Use modular service with prompt templates
    const { systemInstruction, userPrompt } = PROMPT_TEMPLATES.viralHooks(topic, brandContext);
    
    const rawText = await textService.generate(userPrompt, brandContext, systemInstruction);
    
    // Parse JSON output
    let hooks = [];
    try {
      const cleanText = (rawText || "[]").replace(/```json/g, '').replace(/```/g, '').trim();
      hooks = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse hooks JSON", e);
      // Fallback: try to split by newlines if JSON fails
      hooks = rawText ? rawText.split('\n').filter(line => line.trim().length > 0) : [];
    }

    // Store batch
    const batch = await prisma.hookBatch.create({
      data: {
        userId,
        topic,
        tone: brandContext.tone,
        format: format || 'Listicle',
        hooks: JSON.stringify(hooks),
      }
    });

    // Log usage
    await usageService.trackUsage(userId, 'HOOK_GEN', 1);

    res.json({ batchId: batch.id, hooks });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Limit reached')) {
      return res.status(403).json({ error: error.message, code: 'LIMIT_REACHED' });
    }
    console.error('Hook generation error:', error);
    res.status(500).json({ error: 'Failed to generate hooks' });
  }
});

export default router;
