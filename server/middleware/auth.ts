import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import prisma from '../db/prisma.ts';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        getToken: () => Promise<string | null>;
      };
      user?: any; // For our DB user
    }
  }
}

// Mock Auth Middleware for Development/Preview without Clerk Keys
const mockAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Check if we have a mock token from our custom auth
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // In a real app we'd verify the JWT. 
    // Here we just decode it or assume it's valid for the preview if it matches our structure
    // For simplicity in this specific preview environment, we'll look up the user by email if provided in header
    // OR just use a default test user if one exists.
    
    // BETTER APPROACH:
    // The previous custom auth issued a JWT. We can try to decode it if we want, 
    // but since we are switching to "Clerk" mode, we might just want to bypass if CLERK_KEY is missing.
    
    // Let's try to find ANY user in the DB to attach, or create a temporary one.
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // Create a dummy user for preview
      user = await prisma.user.create({
        data: {
          clerkId: 'mock_clerk_id_' + Date.now(),
          email: 'preview@example.com',
        }
      });
      
      // Create brand profile for this user
      await prisma.brandProfile.create({
        data: {
          userId: user.id,
          name: 'Preview Brand',
          niche: 'General',
          tone: 'Professional'
        }
      });
    }
    
    req.auth = {
      userId: user.clerkId,
      sessionId: 'mock_session',
      getToken: async () => 'mock_token'
    };
    req.user = user;
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthenticated (Mock)' });
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // If Clerk keys are present, use Clerk
  if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    return ClerkExpressRequireAuth()(req, res, async () => {
      try {
        if (!req.auth?.userId) {
          return res.status(401).json({ error: 'Unauthenticated' });
        }

        // Sync/Get User from DB
        let user = await prisma.user.findUnique({
          where: { clerkId: req.auth.userId }
        });

        if (!user) {
          // JIT Provisioning
          // Note: In production, you might want to use webhooks for this
          // But for simple start, we can check/create here
          // We need email, which might not be in req.auth. 
          // For now, we'll create with a placeholder or fetch from Clerk API if needed.
          // Simplified: We assume user exists or created via webhook. 
          // If not found, we return 401 or create a stub.
          
          // Let's return 401 and expect the frontend to have triggered a sync or webhook
          // OR create a stub if we can't get email.
          // For this MVP, let's assume the webhook handles creation, 
          // but if missing, we might fail.
          return res.status(401).json({ error: 'User not found in database. Please sign up.' });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  // Fallback to mock auth for preview
  return mockAuthMiddleware(req, res, next);
};
