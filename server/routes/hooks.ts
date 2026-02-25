import express from 'express';
import prisma from '../db/prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import { generateHooks } from '../services/ai.ts';
import { z } from 'zod';

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

    // Check rate limit / credits here (omitted for brevity, but schema supports UsageLedger)
    
    // Generate hooks
    const hooks = await generateHooks(topic, tone || 'Professional', format || 'Listicle');

    // Store batch
    const batch = await prisma.hookBatch.create({
      data: {
        userId,
        topic,
        tone,
        format,
        hooks: JSON.stringify(hooks),
      }
    });

    // Log usage
    await prisma.usageLedger.create({
      data: {
        userId,
        feature: 'HOOK_GEN',
        credits: 1,
      }
    });

    res.json({ batchId: batch.id, hooks });
  } catch (error) {
    console.error('Hook generation error:', error);
    res.status(500).json({ error: 'Failed to generate hooks' });
  }
});

export default router;
