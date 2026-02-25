# Product Requirements Document: AXIS Creator Hub

## 1. Product Overview
**Product Name:** AXIS Creator Hub
**Tagline:** The AI-Powered Operating System for Modern Creators.
**Mission:** To empower creators to scale their brand identity, automate content creation, and maintain aesthetic consistency across Instagram, TikTok, and YouTube.

## 2. Target Users
*   **Solo Creators / Influencers:** Need to post consistently but lack time for brainstorming and design.
*   **Social Media Managers (SMMs):** Managing multiple client accounts, need efficient batching tools.
*   **Small Business Owners:** Want professional-looking social presence without hiring a full agency.

## 3. Top 5 Jobs-to-be-Done (JTBD)
1.  **"Help me stop staring at a blank page"** -> Generate viral hooks and content ideas instantly based on my niche.
2.  **"Make my brand look expensive"** -> Generate aesthetic visual assets (thumbnails, stories, covers) that match my specific brand identity.
3.  **"Save me time"** -> Batch create content plans for the entire week in one sitting.
4.  **"Keep me consistent"** -> Store my brand voice, colors, and fonts so every output feels like "me".
5.  **"Help me grow"** -> Provide templates and structures that are proven to drive engagement.

## 4. Core Features (MVP vs V1)

| Feature Category | MVP (Immediate Scope) | V1 (Future Scope) |
| :--- | :--- | :--- |
| **Authentication** | Email/Password Sign-up, Google Auth | Social Login (IG/TikTok), Team Accounts |
| **Brand Profile** | Single Brand Profile (Name, Niche, Tone, Colors) | Multiple Brand Profiles, Brand Voice Analysis from URL |
| **Hook Generator** | Text-based AI generation (Gemini), Filter by emotion/format | Trend-jacking (Real-time trends), Script generation |
| **Asset Generator** | Basic Image Generation (Gemini/Imagen), Simple Text Overlays | Drag-and-drop Editor, Layered Templates, Video generation |
| **Content Management** | Save items to "Library", Export as Text/Image | Calendar View, Direct Publishing/Scheduling |
| **Monetization** | Simple Tier gating (UI only or basic limits) | Stripe Integration, Usage-based billing |

## 5. User Flows

### Flow 1: Sign Up
1.  Landing Page -> "Get Started"
2.  Auth Page (Sign up with Email/Google)
3.  Success -> Redirect to Onboarding

### Flow 2: Onboarding Brand Profile
1.  **Welcome Screen:** "Let's define your AXIS."
2.  **Input Niche:** e.g., "Fitness", "SaaS", "Lifestyle".
3.  **Input Tone:** e.g., "Witty", "Professional", "Minimalist".
4.  **Visual Identity:** Select primary color, font style (Serif/Sans/Mono).
5.  **Save:** Profile created in database.

### Flow 3: Generate Hooks (Batching)
1.  Dashboard -> Click "Hook Generator".
2.  Input Topic (e.g., "Productivity hacks").
3.  Select Format (e.g., "Controversial", "Listicle", "Storytime").
4.  Click "Generate".
5.  System calls Gemini API with Brand Tone.
6.  Result: List of 10 viral hooks.
7.  Action: "Save to Library" or "Copy".

### Flow 4: Generate Assets (Aesthetic)
1.  Dashboard -> Click "Asset Studio".
2.  Select Type: "IG Story", "YouTube Thumbnail", "Post Cover".
3.  Input Prompt or use a generated Hook.
4.  Click "Generate".
5.  System calls Gemini/Imagen API using Brand Colors/Style.
6.  Result: 4 Image variations.
7.  Action: "Download" or "Save".

### Flow 5: Save/Export
1.  User views "Library".
2.  Selects saved hooks/images.
3.  Click "Export".
4.  Format: CSV (for hooks) or ZIP (for images).

### Flow 6: Upgrade Plan
1.  User hits usage limit (e.g., 5 generations/day).
2.  Modal appears: "Unlock Unlimited with AXIS Pro".
3.  Click "Upgrade".
4.  (MVP) Mock payment flow -> Update User Tier.
5.  (V1) Stripe Checkout.

## 6. Data Model

### `users`
*   `id` (UUID, PK)
*   `email` (String, Unique)
*   `password_hash` (String)
*   `tier` (Enum: 'FREE', 'PRO', 'BUSINESS')
*   `created_at` (Timestamp)

### `brand_profiles`
*   `id` (UUID, PK)
*   `user_id` (UUID, FK)
*   `name` (String)
*   `niche` (String)
*   `tone` (String)
*   `primary_color` (String)
*   `font_preference` (String)

### `generated_content`
*   `id` (UUID, PK)
*   `user_id` (UUID, FK)
*   `type` (Enum: 'HOOK', 'IMAGE')
*   `content_data` (Text/JSON - stores the text or image URL)
*   `metadata` (JSON - prompt used, settings)
*   `created_at` (Timestamp)

## 7. Plan Gating & Usage Limits

| Tier | Price | Limits |
| :--- | :--- | :--- |
| **Free** | $0 | 1 Brand Profile, 5 Hook Batches/day, 5 Image Gens/day |
| **Pro** | $19/mo | 1 Brand Profile, Unlimited Hooks, 50 Image Gens/day |
| **Business** | $49/mo | 5 Brand Profiles, Unlimited Everything, Priority Support |

## 8. Non-Functional Requirements
*   **Security:**
    *   Passwords hashed (bcrypt).
    *   Row Level Security (RLS) logic (users can only see their own data).
    *   API Keys for Gemini stored securely on server-side.
*   **Rate Limiting:**
    *   Prevent API abuse (e.g., max 10 requests/minute per user).
*   **Logging:**
    *   Log all AI generation requests (prompt, tokens used) for cost monitoring.
*   **Tech Stack:**
    *   Frontend: React + Tailwind CSS + Framer Motion.
    *   Backend: Node.js (Express) + SQLite (for MVP persistence).
    *   AI: Google Gemini API (Flash for text, Pro Vision/Imagen for images).
