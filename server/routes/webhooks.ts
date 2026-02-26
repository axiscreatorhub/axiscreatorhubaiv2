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
    console.error('Paystack Webhook error:', error);
    res.sendStatus(500);
  }
});

// Clerk Webhook
router.post('/clerk', async (req, res) => {
  // In production, you MUST verify the Svix signature
  // For now, we'll implement the logic to handle user.created and user.updated
  const { data, type } = req.body;

  try {
    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: { email },
        create: {
          clerkId: id,
          email,
        }
      });
    }

    if (type === 'user.deleted') {
      const { id } = data;
      await prisma.user.delete({
        where: { clerkId: id }
      }).catch(() => {}); // Ignore if already deleted
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Clerk Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
