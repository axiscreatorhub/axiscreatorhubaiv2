import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.ts';
import prisma from '../db/prisma.ts';
import { imageService } from '../services/ai/image.ts';
import { usageService } from '../services/usage.ts';

const router = express.Router();

const generateSchema = z.object({
  type: z.enum(['THUMBNAIL', 'AVATAR', 'COVER']),
  prompt: z.string(),
  style: z.string().optional(),
});

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { type, prompt, style } = generateSchema.parse(req.body);
    const userId = req.user.id;

    // Check usage limits
    await usageService.checkLimit(userId, 'ASSET_GEN');

    // Create Job first to track it
    const job = await prisma.assetJob.create({
      data: {
        userId,
        type,
        prompt,
        status: 'PROCESSING',
        outputUrls: '[]',
      }
    });

    // Generate image using modular service
    try {
      const imageUrl = await imageService.generate(prompt, style);
      
      // Update job with success
      await prisma.assetJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          outputUrls: JSON.stringify([imageUrl]),
        }
      });

      // Track usage
      await usageService.trackUsage(userId, 'ASSET_GEN', 1);
      
      res.json({ jobId: job.id, status: 'COMPLETED', outputUrls: [imageUrl] });
    } catch (genError) {
      console.error("Image generation failed", genError);
      await prisma.assetJob.update({
        where: { id: job.id },
        data: { status: 'FAILED' }
      });
      // Return error but with job context
      res.status(500).json({ error: 'Image generation failed', jobId: job.id });
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('Limit reached')) {
      return res.status(403).json({ error: error.message, code: 'LIMIT_REACHED' });
    }
    console.error('Generate asset error:', error);
    res.status(500).json({ error: 'Failed to generate asset' });
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
