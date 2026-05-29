# PlanPal — AI Group Activity Planner

No more "what should we do?" back-and-forth. PlanPal analyses everyone's personalities and finds activities your whole group will love.

## What it does

1. **Personality quiz** — 10 questions that map you to one of 6 archetypes (The Adventurer, The Socialite, The Creative, etc.)
2. **Interest selection** — pick from 26 interests across Outdoors, Food, Entertainment, Sports, Culture, and Travel
3. **Groups** — create a group, share an invite link, friends join with one click
4. **AI recommendations** — Claude analyses the group's combined archetypes, traits, and interests and suggests 5 activities everyone will enjoy
5. **Voting** — members vote on recommendations; the group sees what wins

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth.js v5 (Google OAuth, JWT sessions) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma v7 (pg adapter) |
| AI | Groq (llama-3.3-70b-versatile) via OpenAI-compatible API |
| Animations | Framer Motion |
| Charts | Recharts |
| Deploy | Vercel |

## Local development

### Prerequisites

- Node.js 20+
- PostgreSQL (local or Supabase)
- Google OAuth credentials
- Groq API key (free at console.groq.com)

### Setup

```bash
# 1. Install dependencies
cd planpal
npm install

# 2. Copy env template and fill in your values
cp .env.example .env.local

# 3. Generate Prisma client
npx prisma generate

# 4. Push schema to your database
npx prisma db push

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
DATABASE_URL=postgresql://user:password@host:5432/planpal
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-random-32-char-secret
NEXTAUTH_SECRET=your-random-32-char-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GROQ_API_KEY=gsk_your-groq-api-key
```

Generate `AUTH_SECRET` / `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Project structure

```
planpal/
├── prisma/
│   └── schema.prisma          # DB models: User, VibeGroup, GroupMember, Recommendation, Vote
├── src/
│   ├── app/
│   │   ├── api/               # Route handlers
│   │   │   ├── auth/          # NextAuth handler
│   │   │   ├── groups/        # CRUD + join + AI recommend
│   │   │   ├── interests/     # Save user interests
│   │   │   ├── quiz/submit    # Save quiz results + compute archetype
│   │   │   └── vote/          # Cast votes on recommendations
│   │   ├── auth/              # Sign-in / error pages
│   │   ├── dashboard/         # User's groups
│   │   ├── group/[id]/        # Group detail, recommend, vote
│   │   ├── join/[code]/       # Invite link landing page
│   │   ├── onboarding/        # Quiz + interest selection
│   │   └── profile/           # User profile + edit interests
│   ├── components/            # Shared UI components
│   └── lib/
│       ├── auth.ts            # NextAuth config
│       ├── archetypes.ts      # 6 archetypes + scoring
│       ├── interests.ts       # 26 interests by category
│       ├── openai.ts          # Anthropic AI client + prompt caching
│       ├── prisma.ts          # Prisma singleton
│       ├── quiz-data.ts       # 10 quiz questions + trait scoring
│       ├── types.ts           # Shared TypeScript types
│       └── validators.ts      # Zod schemas
```

## Rate limiting

| Limit | Value | Scope |
|-------|-------|-------|
| AI recommendations | 10 / day | Per group |
| AI recommendations | 3 / hour | Per user |

Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After` headers.

## Deployment

Deployed on Vercel. Root directory: `planpal/`. Build command: `prisma generate && next build`.

Set these environment variables in Vercel → Settings → Environment Variables (same as `.env.example` but with real values).

---

## Future Plans

PlanPal is designed to grow into a full end-to-end group planning platform. Here's the roadmap:

### Budget Planner
Split costs fairly across the group before you commit to a plan. Set a per-person budget and filter AI recommendations to only show options within range. Track who owes what after the activity.

### Cost Tracker
After an activity, log what everyone spent. PlanPal calculates the balance automatically and shows a simple "who pays whom" summary — like Splitwise, but built into your plan.

### Find Best Prices
PlanPal searches multiple booking and review platforms (Google, Yelp, TripAdvisor, Eventbrite) to surface the best price for each recommended activity. No more 12 browser tabs.

### Build Packages
Combine multiple activities into a full-day or weekend itinerary package. AI sequences them logically (brunch → afternoon activity → dinner) with travel time estimates between stops.

### Find Package Costs
Get a total cost estimate for a multi-activity package — including venue prices, transport, and optional extras — so the group knows the full spend before committing.

### One-Stop Payment
Connect directly with venue booking APIs (OpenTable, Eventbrite, Airbnb Experiences, etc.) so the group can reserve and pay for everything inside PlanPal. No jumping between apps, no "can someone book this?" back-and-forth.

### Vendor Network
A curated marketplace of local vendors — restaurants, activity operators, experience providers — who offer group packages and exclusive discounts to PlanPal users.

### Smart Notifications
Remind members to vote, alert the group when a recommendation sells out, and send a "time to plan again" nudge when the group hasn't met in a while.
