import express from 'express';
import { requireAuth } from '../middleware/auth.ts';
import prisma from '../db/prisma.ts';
import { textService } from '../services/ai/text.ts';

const router = express.Router();

router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Fetch brand context
    const brand = await prisma.brandProfile.findUnique({ where: { userId } });
    
    // Use the modular text service
    // We need to map the Prisma brand object to the BrandProfileContext interface if needed,
    // or the service handles partials.
    const brandContext = brand ? {
      name: brand.name,
      niche: brand.niche,
      tone: brand.tone,
      audience: brand.audience,
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    } : undefined;

    const reply = await textService.chat(message, [], brandContext);

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to chat' });
  }
});

export default router;
