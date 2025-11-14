# AI-assisted Teacher Diary and Class Assistant

A tablet-friendly Next.js application that helps teachers plan lessons, capture in-lesson notes, and request AI-generated daily lesson flows.

## Features

- Passwordless email sign-in powered by NextAuth credentials.
- Dashboard timeline for the next 7 days with reminder toasts.
- Class management with lesson plan CRUD and session scheduling.
- Live lesson view with AI-assisted plans, pacing nudges, and quick progress notes.
- Optional Google Calendar sync stub and JSON export for backups.
- Prisma/PostgreSQL data model with seed data for demo usage.
- Offline-friendly TypeScript test harness alongside Playwright e2e scaffolds.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate Prisma client**
   ```bash
   npm run prepare
   ```
3. **Configure environment**
   Copy `.env.example` to `.env.local` and update the values (database URL, secrets, optional API keys).

4. **Database setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Development server**
   ```bash
   npm run dev
   ```

6. **Running tests**
   ```bash
   npm run test        # Compile once and run all tests
   npm run test:unit   # UI-focused suite (render to markup)
   npm run test:server # Server utility suite
   npm run test:e2e    # Playwright (requires running dev server)
   ```

7. **Linting**
   ```bash
   npm run lint
   ```

## Data model

The Prisma schema models teachers, classes, students, lesson plans, sessions, progress notes, integration tokens, and notifications. See `prisma/schema.prisma` for details. Run `npx prisma studio` for a UI explorer.

Seed data provides:
- 1 demo teacher (`demo.teacher@example.com`)
- 2 classes (Maths, Literature)
- 4 lesson plans across the week
- 2 sessions with example progress notes

## Security and accessibility

- All API routes validate input with Zod and enforce ownership checks.
- AI endpoints include a simple in-memory rate limiter.
- Secrets remain server-side; client components call typed API routes.
- Tailwind styling targets WCAG AA colour contrast and keyboard focus states.

## Integrations

- `lib/ai/lessonPlanner.ts` uses OpenAI if `OPENAI_API_KEY` is provided, otherwise a deterministic fallback generator.
- `lib/google/calendar.ts` documents the TODOs for full OAuth2 calendar sync.
- Resource suggestion toggle in the live lesson view surfaces stubbed recommendations until AI integration is available.

## Testing notes

- Custom TypeScript harness renders UI components to static markup for assertions.
- The same harness exercises deterministic server utilities (AI fallback, validation).
- Playwright smoke test ensures the sign-in page renders in CI.

## Scripts

- `npm run db:migrate` – run migrations in development.
- `npm run db:seed` – seed the database with demo content.
- `npm run build` / `npm run start` – build and run the production bundle.

Happy teaching!
