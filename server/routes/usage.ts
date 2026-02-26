import express from 'express';
import { requireAuth } from '../middleware/auth.ts';
import { usageService } from '../services/usage.ts';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const usageData = await usageService.getUsage(req.user.id);
    res.json(usageData);
  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

export default router;
