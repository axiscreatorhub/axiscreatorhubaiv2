import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import prisma from '../db/prisma.ts';

const router = Router();

// Get current user's media kit settings
router.get('/', requireAuth, async (req, res) => {
  try {
    const brand = await prisma.brandProfile.findUnique({
      where: { userId: req.user.id },
      include: { mediaKit: true }
    });
    res.json(brand);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update media kit settings
router.patch('/', requireAuth, async (req, res) => {
  try {
    const { slug, bio, referenceContent, links, stats, theme, isPublic } = req.body;
    const userId = req.user.id;

    // Update brand profile
    const brand = await prisma.brandProfile.update({
      where: { userId },
      data: {
        slug,
        bio,
        referenceContent,
        links: links ? JSON.stringify(links) : undefined,
        stats: stats ? JSON.stringify(stats) : undefined,
      }
    });

    // Update or create media kit
    const mediaKit = await prisma.mediaKit.upsert({
      where: { brandProfileId: brand.id },
      update: { theme, isPublic },
      create: {
        brandProfileId: brand.id,
        theme,
        isPublic
      }
    });

    res.json({ ...brand, mediaKit });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Public route to view media kit
// Note: This should be mounted on a public base path if possible, or handled specially
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await prisma.brandProfile.findUnique({
      where: { slug },
      include: { 
        mediaKit: true,
        user: {
          select: {
            clerkId: true
          }
        }
      }
    });

    if (!brand || !brand.mediaKit?.isPublic) {
      return res.status(404).json({ error: 'Media kit not found or private' });
    }

    // Increment view count
    await prisma.mediaKit.update({
      where: { id: brand.mediaKit.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(brand);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
