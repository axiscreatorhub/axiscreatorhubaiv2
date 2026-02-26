import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './server/routes/auth.ts'; // Legacy/Custom auth routes (optional if fully switching to Clerk)
import brandRoutes from './server/routes/brand.ts';
import hooksRoutes from './server/routes/hooks.ts';
import assetsRoutes from './server/routes/assets.ts';
import billingRoutes from './server/routes/billing.ts';
import webhookRoutes from './server/routes/webhooks.ts';
import aiRoutes from './server/routes/ai.ts';
import usageRoutes from './server/routes/usage.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(cookieParser());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // API Routes
  app.get('/api/ping', (req, res) => res.send('pong'));
  
  // Mount routes
  app.use('/api/auth', authRoutes); // Keep for local dev/preview fallback
  app.use('/api/brand', brandRoutes);
  app.use('/api/hooks', hooksRoutes);
  app.use('/api/assets', assetsRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/webhooks', webhookRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/usage', usageRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    
    // SPA Fallback
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

