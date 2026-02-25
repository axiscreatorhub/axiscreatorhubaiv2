# AXIS Creator Hub - Technical Architecture

## 1. Architecture Diagram

```mermaid
graph TD
    User[User / Browser]
    
    subgraph "Frontend (Vite + React)"
        UI[React UI]
        AuthClient[Clerk SDK]
        State[React Query / Zustand]
    end
    
    subgraph "Backend (Node/Express)"
        API[Express API]
        AuthMiddleware[Clerk Middleware]
        Prisma[Prisma ORM]
        AI_Service[AI Service Layer]
        Billing[Paystack Webhooks]
    end
    
    subgraph "External Services"
        Clerk[Clerk Auth]
        Neon[Neon Postgres DB]
        Gemini[Google Gemini API]
        Paystack[Paystack API]
        Resend[Resend Email API]
    end

    User --> UI
    UI -->|Auth| Clerk
    UI -->|API Calls| API
    
    API -->|Verify Token| Clerk
    API -->|Query/Mutate| Prisma
    Prisma -->|SQL| Neon
    
    API -->|Generate| AI_Service
    AI_Service -->|Prompt| Gemini
    
    API -->|Emails| Resend
    Paystack -->|Webhook| API
```

## 2. Monorepo Folder Structure

We use a **Modular Monolith** structure. Frontend and Backend live in the same repo but are clearly separated. This simplifies deployment to a single Cloud Run service.

```text
/
├── prisma/
│   └── schema.prisma       # Database schema
├── server/
│   ├── db/                 # Database connection / Prisma client
│   ├── middleware/         # Auth & Error handling
│   ├── routes/             # API Route definitions
│   ├── services/           # Business logic (AI, Billing, Email)
│   ├── utils/              # Shared utilities
│   └── index.ts            # Server entry point
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Frontend utilities (API client)
│   ├── pages/              # Page components
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
├── package.json            # Shared dependencies
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite config (Frontend build)
```

## 3. Environment Variables

```env
# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database (Neon / Prisma)
DATABASE_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/neondb"

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI (Google Gemini)
GEMINI_API_KEY=AIza...

# Billing (Paystack)
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...

# Email (Resend)
RESEND_API_KEY=re_...
```

## 4. Local Development Steps

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Setup Environment:**
    *   Copy `.env.example` to `.env`.
    *   Fill in API keys (Gemini, Clerk, Database URL).

3.  **Database Setup:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *   This runs `tsx server.ts`.
    *   The server launches Express API.
    *   Vite middleware serves the frontend with HMR.

## 5. Deployment Plan (Cloud Run)

We deploy as a single container that serves both the API and the static frontend assets.

**Build Process:**
1.  **Build Frontend:** `npm run build` -> outputs to `dist/`.
2.  **Build Backend:** (Optional, or run with `tsx`/`node` directly).
3.  **Dockerize:**
    *   Base image: `node:20-alpine`.
    *   Copy `package.json` & install production deps.
    *   Copy `prisma` & run `prisma generate`.
    *   Copy source code.
    *   Run `npm run build` (Vite).
    *   CMD: `node dist-server/index.js` (or `tsx server.ts` for simplicity in MVP).

**Cloud Run Configuration:**
*   **Service Name:** `axis-creator-hub`
*   **Region:** `us-central1` (or close to Neon DB).
*   **Memory:** 512MB - 1GB.
*   **Concurrency:** 80.
*   **Env Vars:** Inject from Google Secret Manager.
