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
    const options = process.env.CLERK_JWT_KEY ? { jwtKey: process.env.CLERK_JWT_KEY } : {};
    
    return ClerkExpressRequireAuth(options)(req, res, async () => {
      try {
        if (!req.auth?.userId) {
          return res.status(401).json({ error: 'Unauthenticated' });
        }

        // Sync/Get User from DB
        let user = await prisma.user.findUnique({
          where: { clerkId: req.auth.userId }
        });

        if (!user) {
          // JIT Provisioning: Create user in our DB if they exist in Clerk but not in our DB
          // We can't easily get the email from req.auth alone without a Clerk API call,
          // but we can create a stub and let the onboarding process fill it, 
          // or just use a placeholder email for now.
          
          user = await prisma.user.create({
            data: {
              clerkId: req.auth.userId,
              email: `${req.auth.userId}@clerk.user`, // Placeholder, should be updated via webhook or onboarding
            }
          });

          // Initialize brand profile
          await prisma.brandProfile.create({
            data: {
              userId: user.id,
              name: 'New Creator',
            }
          });
          
          // Initialize usage
          await prisma.usageLedger.create({
            data: {
              userId: user.id,
              feature: 'INITIAL_GRANT',
              credits: 0,
              day: new Date()
            }
          });
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
