import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import { textService } from '../services/ai/index.ts';
import prisma from '../db/prisma.ts';

const router = Router();

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { topic, format } = req.body;
    const userId = req.user.id;

    if (!topic || !format) {
      return res.status(400).json({ error: 'Topic and format are required' });
    }

    // Get brand context
    const brand = await prisma.brandProfile.findUnique({
      where: { userId }
    });

    const brandContext = brand ? {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : [],
      referenceContent: brand.referenceContent || undefined
    } : undefined;

    const scriptResult = await textService.generateScript(topic, format, brandContext);

    // Save to DB
    const script = await prisma.script.create({
      data: {
        userId,
        topic,
        format,
        content: scriptResult.content,
        viralScore: scriptResult.viralScore,
        storyboard: JSON.stringify(scriptResult.storyboard)
      }
    });

    res.json(script);
  } catch (error: any) {
    console.error('Script Generation Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const scripts = await prisma.script.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(scripts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
