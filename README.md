# PlanPal

No more "what should we do?" back-and-forth. PlanPal analyses everyone's personalities and finds activities your whole group will love.

## What it does

1. **Personality quiz**: 10 questions that map you to one of 6 archetypes (The Adventurer, The Socialite, The Creative, etc.)
2. **Interest selection**: pick from 26 interests across Outdoors, Food, Entertainment, Sports, Culture, and Travel
3. **Groups**: create a group, share an invite link, friends join with one click
4. **AI recommendations**: Claude analyses the group's combined archetypes, traits, and interests and suggests 5 activities everyone will enjoy
5. **Voting**: members vote on recommendations; the group sees what wins

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

## What's coming

### Budget planner
Set a per-person budget before committing to anything. Recommendations filter to what the group can actually afford, and you can track who owes what afterwards.

### Cost tracker
Log what everyone spent after an activity. PlanPal works out the balance and shows a simple "who pays whom" split (like Splitwise, but inside your plan).

### Best price search
Search across booking and review platforms (Google, Yelp, TripAdvisor, Eventbrite) to find the best price for each activity. No more 12 browser tabs.

### Day packages
String multiple activities into a full-day or weekend itinerary. AI sequences them sensibly (brunch, afternoon activity, dinner) and estimates travel time between stops.

### Package cost estimates
Get a total spend estimate for a multi-activity package before the group commits, including venue costs, transport, and extras.

### Booking inside the app
Reserve and pay for everything without leaving PlanPal, via direct integrations with OpenTable, Eventbrite, Airbnb Experiences, and others.

### Vendor marketplace
Local restaurants, activity operators, and experience providers can list group packages and exclusive discounts for PlanPal users.

### Smart nudges
Reminders to vote, alerts when a recommendation sells out, and a gentle ping when the group is overdue for a catch-up.
