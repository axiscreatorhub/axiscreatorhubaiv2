import express from 'express';
import prisma from '../db/prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import axios from 'axios';
import { z } from 'zod';

const router = express.Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const initSchema = z.object({
  plan: z.enum(['PRO', 'BUSINESS']),
});

router.post('/paystack/initialize', requireAuth, async (req, res) => {
  if (!PAYSTACK_SECRET) {
    return res.status(500).json({ error: 'Paystack not configured' });
  }

  try {
    const { plan } = initSchema.parse(req.body);
    const user = req.user;

    // Define amount based on plan (in kobo)
    const amount = plan === 'PRO' ? 1900 * 100 : 4900 * 100; // Example amounts

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount,
        metadata: {
          userId: user.id,
          plan,
        },
        callback_url: `${process.env.APP_URL}/dashboard?payment=success`,
      },
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    );

    res.json(response.data.data);
  } catch (error) {
    console.error('Paystack init error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

export default router;
