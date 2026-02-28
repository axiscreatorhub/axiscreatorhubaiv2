import express from 'express';
import { requireAuth } from '../middleware/auth.ts';
import { textService } from '../services/ai/index.ts';
import prisma from '../db/prisma.ts';

const router = express.Router();

// Trend Scout - Get trending topics for creator's niche
router.get('/trends', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({
      where: { userId }
    });

    const niche = brand?.niche || 'General Content Creation';
    const trends = await textService.trendScout(niche);
    
    res.json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Proactive Suggestions - AI suggests next steps
router.get('/suggestions', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [scripts, brand] = await Promise.all([
      prisma.script.findMany({ where: { userId }, take: 3, orderBy: { createdAt: 'desc' } }),
      prisma.brandProfile.findUnique({ where: { userId } })
    ]);

    const niche = brand?.niche || 'General';
    const tone = brand?.tone || 'Professional';
    const recentTopics = scripts.map(s => s.topic);

    const suggestions = await textService.getSuggestions(niche, tone, recentTopics);
    res.json(suggestions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Repurpose Content
router.post('/repurpose', requireAuth, async (req, res) => {
  try {
    const { content, platform } = req.body;
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({
      where: { userId }
    });

    const brandContext = brand ? {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    } : undefined;

    const result = await textService.repurposeContent(content, platform, brandContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Sponsorship Pitch
router.post('/pitch', requireAuth, async (req, res) => {
  try {
    const { sponsorName, sponsorDescription } = req.body;
    const userId = req.user.id;
    
    const brand = await prisma.brandProfile.findUnique({ 
      where: { userId },
      include: { mediaKit: true }
    });

    if (!brand) return res.status(404).json({ error: 'Brand profile not found' });

    const brandContext = {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    };

    const stats = {
      mediaKitViews: brand.mediaKit?.viewCount || 0,
      links: brand.links ? JSON.parse(brand.links) : [],
      stats: brand.stats ? JSON.parse(brand.stats) : []
    };

    const result = await textService.generatePitch(sponsorName, sponsorDescription, brandContext, stats);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze Competitor
router.post('/analyze-competitor', requireAuth, async (req, res) => {
  try {
    const { competitorUrl } = req.body;
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({ where: { userId } });

    const brandContext = brand ? {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    } : undefined;

    const niche = brand?.niche || 'General Content';
    const result = await textService.analyzeCompetitor(competitorUrl, niche, brandContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Content Calendar
router.post('/content-calendar', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({ where: { userId } });

    const brandContext = brand ? {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    } : undefined;

    const niche = brand?.niche || 'General Content';
    const result = await textService.generateContentCalendar(niche, brandContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Predict Video Performance
router.post('/predict-performance', requireAuth, async (req, res) => {
  try {
    const { topic, content } = req.body;
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({ where: { userId } });

    const brandContext = brand ? {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    } : undefined;

    const niche = brand?.niche || 'General Content';
    const result = await textService.predictPerformance(topic, content, niche, brandContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Brand Deal Contract
router.post('/generate-contract', requireAuth, async (req, res) => {
  try {
    const { sponsorName, terms } = req.body;
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({ where: { userId } });

    if (!brand) return res.status(404).json({ error: 'Brand profile not found' });

    const result = await textService.generateContract(brand.name || 'Creator', sponsorName, terms);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Thumbnail A/B Strategy
router.post('/thumbnail-ideas', requireAuth, async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;
    const brand = await prisma.brandProfile.findUnique({
      where: { userId }
    });

    const brandContext = brand ? {
      name: brand.name || '',
      niche: brand.niche || '',
      tone: brand.tone || '',
      audience: brand.audience || '',
      platforms: brand.platforms ? JSON.parse(brand.platforms) : []
    } : undefined;

    const niche = brand?.niche || 'General Content';
    const result = await textService.generateThumbnailIdeas(topic, niche, brandContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
