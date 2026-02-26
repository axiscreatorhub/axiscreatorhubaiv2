# Production Deployment Guide

This guide covers deploying the AXIS Creator AI Hub to Google Cloud Run (recommended for full-stack) and syncing with GitHub.

## 1. Sync with GitHub

Since I cannot push code directly, you need to initialize a repository and push this code:

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create Repository**:
    - Go to [GitHub](https://github.com/new) and create a new repository named `axiscreatorhubaiv2`.

3.  **Push Code**:
    ```bash
    git remote add origin https://github.com/axiscreatorhub/axiscreatorhubaiv2.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy to Google Cloud Run (Recommended)

This application uses a custom Express server for the backend and Vite for the frontend. **Google Cloud Run** is the best host because it supports Docker containers natively.

### Prerequisites
- Google Cloud Project created
- `gcloud` CLI installed
- Postgres Database (e.g. Neon, Supabase, or Cloud SQL)

### Deployment Steps

1.  **Build & Deploy**:
    Run this from your terminal:
    ```bash
    gcloud run deploy axis-creator-hub \
      --source . \
      --platform managed \
      --region europe-west1 \
      --allow-unauthenticated \
      --set-env-vars "NODE_ENV=production" \
      --set-env-vars "APP_URL=https://axiscreatorhub.com" \
      --set-env-vars "DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require" \
      --set-env-vars "CLERK_PUBLISHABLE_KEY=pk_live_..." \
      --set-env-vars "CLERK_SECRET_KEY=sk_live_..." \
      --set-env-vars "GEMINI_API_KEY=AIza..." \
      --set-env-vars "PAYSTACK_SECRET_KEY=sk_live_..." \
      --set-env-vars "PAYSTACK_PUBLIC_KEY=pk_live_..."
    ```

2.  **Map Custom Domain**:
    - Go to [Cloud Run Console](https://console.cloud.google.com/run).
    - Select `axis-creator-hub`.
    - Click **Manage Custom Domains**.
    - Add `axiscreatorhub.com`.
    - Follow the instructions to update your DNS records (A and AAAA records) at your domain registrar.

## 3. Vercel Deployment (Frontend Only)

**Note:** This is a full-stack application with a custom Node.js backend. Vercel is optimized for Next.js or static sites. Deploying this specific architecture to Vercel requires splitting the frontend and backend or complex configuration.

**Recommendation:** Use Google Cloud Run (Step 2) for the full application.

If you strictly want to use Vercel:
1.  **Connect GitHub**: Import the `axiscreatorhubaiv2` repo in Vercel.
2.  **Configure Project**:
    - Framework Preset: `Vite`
    - Build Command: `npm run build`
    - Output Directory: `dist`
3.  **Limitations**: The backend API (`/api/*`) defined in `server.ts` **will not work** on Vercel without refactoring to Vercel Functions.

## 4. Post-Deployment Configuration

### A. Update Environment Variables
Ensure `APP_URL` is set to `https://axiscreatorhub.com` in your deployment environment variables.

### B. Configure Webhooks
1. **Paystack**: Settings > API Keys & Webhooks.
   - URL: `https://axiscreatorhub.com/api/webhooks/paystack`
2. **Clerk**: Webhooks.
   - Endpoint: `https://axiscreatorhub.com/api/webhooks/clerk`

## 5. Troubleshooting

### "Container failed to start"
- **Check Logs**: Cloud Run > Logs.
- **Port**: Ensure the container listens on port 3000 (default in Dockerfile).
- **Database**: Ensure `DATABASE_URL` is correct and accessible.

### "Prisma Client not initialized"
- The Dockerfile includes `npx prisma generate`, so this should work automatically.
