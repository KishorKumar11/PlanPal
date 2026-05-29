@AGENTS.md

# PlanPal — AI context for Claude

## What this app is

PlanPal is an AI group activity planner. Users take a personality quiz, pick interests, form groups with friends, and get Claude-powered activity recommendations tailored to the whole group's combined personality profile.

## Critical version warnings

This project uses **non-standard versions** with breaking changes from what you likely know:

| Package | Version | Key breaking change |
|---------|---------|-------------------|
| Next.js | 16.2.6 | App Router only; check `node_modules/next/dist/docs/` before writing any route or page |
| Prisma | 7.8.0 | `provider = "prisma-client"` in schema; output to `src/generated/prisma`; `PrismaClient` requires `adapter` arg; config in `prisma.config.ts` |
| Tailwind CSS | 4.x | CSS-based config via `@theme {}` in `globals.css` — no `tailwind.config.ts`; `@import url()` MUST come before `@import "tailwindcss"` |
| NextAuth | 5.0.0-beta.31 | New API: `handlers`, `auth`, `signIn`, `signOut` exported from `src/lib/auth.ts`; JWT sessions (no Prisma adapter) |
| Zod | 4.4.3 | Some v3 APIs changed |

## Architecture decisions

- **JWT sessions** (not database sessions) — avoids type incompatibility between NextAuth v5 and Prisma v7 generated client
- **`@prisma/adapter-pg`** — Prisma connects via `pg` pool, not the default connector; see `src/lib/prisma.ts`
- **Prisma client import path** — always `@/generated/prisma/client`, never `@prisma/client`
- **AI module** — `src/lib/openai.ts` (legacy name, now uses Groq via OpenAI-compatible API). Client is lazy-init **inside** the function — never at module level (breaks Vercel build-time page data collection)
- **`VibeGroup`** — the Prisma model for groups is named `VibeGroup` (not `Group`) to avoid reserved word conflicts

## Key files

```
planpal/
├── prisma/schema.prisma          # DB schema — edit here for model changes
├── prisma.config.ts              # Prisma v7 config (dotenv + defineConfig)
├── src/lib/auth.ts               # NextAuth config + session typing
├── src/lib/prisma.ts             # Prisma singleton with pg adapter
├── src/lib/openai.ts             # Anthropic AI client + getGroupRecommendations()
├── src/lib/archetypes.ts         # 6 archetypes + determineArchetype()
├── src/lib/quiz-data.ts          # 10 quiz questions + calculateTraitScores()
├── src/lib/interests.ts          # 26 interests across 6 categories
├── src/lib/types.ts              # TraitScores, GroupWithMembers, etc.
├── src/lib/validators.ts         # Zod v4 schemas
└── src/app/globals.css           # Tailwind v4 @theme tokens + custom utilities
```

## Environment variables

```
DATABASE_URL           PostgreSQL connection string (Supabase)
AUTH_SECRET            NextAuth secret (32+ chars)
NEXTAUTH_SECRET        Same value as AUTH_SECRET
NEXTAUTH_URL           App URL (http://localhost:3000 locally)
GOOGLE_CLIENT_ID       Google OAuth
GOOGLE_CLIENT_SECRET   Google OAuth
GROQ_API_KEY           Groq API key (gsk_...)
```

## Common patterns

**Server action auth check:**
```ts
const session = await auth();
if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

**Prisma JSON field cast (traitScores is `Json` type):**
```ts
m.user.traitScores as unknown as TraitScores
traitScores as unknown as Record<string, number>  // when writing
```

**Prisma model name:** use `prisma.vibeGroup` (camelCase of `VibeGroup`)

## Rate limits (AI endpoint)
- 10 AI calls / day per group
- 3 AI calls / hour per user
- Returns `Retry-After` + `X-RateLimit-*` headers on 429
