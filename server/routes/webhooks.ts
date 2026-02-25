import express from 'express';
import prisma from '../db/prisma.ts';
import crypto from 'crypto';

const router = express.Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

router.post('/paystack', async (req, res) => {
  if (!PAYSTACK_SECRET) return res.sendStatus(200);

  // Validate signature
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;

  try {
    if (event.event === 'charge.success') {
      const { metadata, customer } = event.data;
      const userId = metadata?.userId;

      if (userId) {
        // Update subscription
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            status: 'ACTIVE',
            plan: metadata.plan || 'PRO',
            paystackCustomerId: String(customer.id),
            paystackSubscriptionId: String(event.data.id), // Transaction ID as placeholder
          },
          create: {
            userId,
            status: 'ACTIVE',
            plan: metadata.plan || 'PRO',
            paystackCustomerId: String(customer.id),
            paystackSubscriptionId: String(event.data.id),
          },
        });
      }
    }
    // Handle other events like subscription.create, etc.
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

export default router;
