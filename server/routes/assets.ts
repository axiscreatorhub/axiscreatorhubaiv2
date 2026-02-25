import express from 'express';
import prisma from '../db/prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import { generateAssetPrompt } from '../services/ai.ts';
import { z } from 'zod';

const router = express.Router();

const generateSchema = z.object({
  type: z.string(),
  prompt: z.string(),
});

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { type, prompt } = generateSchema.parse(req.body);
    const userId = req.user.id;

    // Get brand profile for style context
    const brand = await prisma.brandProfile.findUnique({ where: { userId } });

    // Refine prompt
    const refinedPrompt = await generateAssetPrompt(type, prompt, brand);

    // Create Job
    const job = await prisma.assetJob.create({
      data: {
        userId,
        type,
        prompt: refinedPrompt || prompt,
        status: 'PENDING',
        outputUrls: '[]',
      }
    });

    // In a real app, we'd push to a queue (BullMQ/SQS).
    // Here we'll just mock the processing or trigger it async.
    // For MVP, let's just return the job ID.
    
    res.json({ jobId: job.id, status: 'PENDING', refinedPrompt });
  } catch (error) {
    console.error('Asset generation error:', error);
    res.status(500).json({ error: 'Failed to queue asset generation' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const job = await prisma.assetJob.findUnique({
      where: { id: req.params.id }
    });

    if (!job || job.userId !== req.user.id) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
