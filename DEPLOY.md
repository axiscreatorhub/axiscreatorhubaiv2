# Production Deployment Guide (Google Cloud Run)

## 1. Prerequisites
- Google Cloud Project created
- `gcloud` CLI installed and authenticated
- Postgres Database (e.g. Neon, Supabase, or Cloud SQL) provisioned

## 2. Environment Variables Setup
Create a `.env.prod` file (do not commit this!) with your production secrets:

```env
NODE_ENV=production
APP_URL=https://your-service-url.a.run.app
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
GEMINI_API_KEY=AIza...
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
```

## 3. Build & Deploy Command
Run this command from the root of your project to build and deploy directly to Cloud Run:

```bash
gcloud run deploy axis-creator-hub \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require" \
  --set-env-vars "CLERK_PUBLISHABLE_KEY=pk_live_..." \
  --set-env-vars "CLERK_SECRET_KEY=sk_live_..." \
  --set-env-vars "GEMINI_API_KEY=AIza..." \
  --set-env-vars "PAYSTACK_SECRET_KEY=sk_live_..." \
  --set-env-vars "PAYSTACK_PUBLIC_KEY=pk_live_..."
```

*Note: For better security, use Google Secret Manager instead of passing secrets in the command line.*

## 4. Post-Deployment Configuration

### A. Update APP_URL
After deployment, get the Service URL (e.g., `https://axis-creator-hub-xyz.a.run.app`).
Update the `APP_URL` environment variable in Cloud Run to this URL.

### B. Configure Webhooks
1. **Paystack**: Go to Settings > API Keys & Webhooks.
   - Set Webhook URL to: `https://YOUR_APP_URL/api/webhooks/paystack`
2. **Clerk**: Go to Webhooks.
   - Add Endpoint: `https://YOUR_APP_URL/api/webhooks/clerk` (if implemented later)
   - Or configure Redirect URLs in Clerk > API Keys > Paths:
     - Sign-in: `https://YOUR_APP_URL/sign-in`
     - Sign-up: `https://YOUR_APP_URL/sign-up`

## 5. Troubleshooting Common Issues

### "Container failed to start"
- **Check Logs**: Go to Cloud Run > Logs.
- **Port Binding**: Ensure `PORT` env var is set to `3000` (Cloud Run sets this automatically usually, but our Dockerfile defaults it).
- **Database Connection**: Verify `DATABASE_URL` is reachable from Cloud Run. If using Cloud SQL, you need a VPC connector or public IP. Neon/Supabase usually work over public internet.

### "Prisma Client not initialized"
- Ensure `npx prisma generate` ran during the build (it is in the Dockerfile).
- Ensure `npx prisma migrate deploy` runs on startup (it is in the CMD).

### "Vite manifest not found"
- Ensure `npm run build` ran successfully in the builder stage.
- Check if `dist/` folder exists in the final image.

## 6. Health Check
Cloud Run automatically checks if the container is listening on the port.
You can manually verify with:
`curl https://YOUR_APP_URL/api/health`
Should return `{"status":"ok"}`.
