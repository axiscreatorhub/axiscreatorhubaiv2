import express from 'express';
import prisma from '../db/prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import { z } from 'zod';

const router = express.Router();

const brandSchema = z.object({
  name: z.string().min(1),
  niche: z.string().optional(),
  tone: z.string().optional(),
  audience: z.string().optional(),
  platforms: z.array(z.string()).optional(),
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const data = brandSchema.parse(req.body);
    const userId = req.user.id;

    const profile = await prisma.brandProfile.upsert({
      where: { userId },
      update: {
        ...data,
        platforms: JSON.stringify(data.platforms || []),
      },
      create: {
        userId,
        ...data,
        platforms: JSON.stringify(data.platforms || []),
      },
    });

    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors });
    }
    console.error('Brand update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const profile = await prisma.brandProfile.findUnique({
      where: { userId: req.user.id }
    });
    res.json(profile || {});
  } catch (error) {
    console.error('Brand fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
