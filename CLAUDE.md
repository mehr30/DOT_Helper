# AI Handoff Context: Greenlight DOT

> **Note to Claude/AI agent**: This file serves as your canonical source of truth for the Greenlight DOT codebase. Read this entire document before executing any commands or making code changes.

## 1. Project Overview & Architecture
Greenlight DOT is a SaaS platform designed to help small business fleet owners (1-50 vehicles) achieve and maintain FMCSA/DOT compliance.
- **Framework**: Turborepo monorepo (`apps/web` Next.js 16 App Router, `apps/mobile` Expo React Native).
- **Database**: PostgreSQL hosted on **Neon** (`packages/database/prisma/schema.prisma`).
- **Auth**: `better-auth` v1.5 with Prisma adapter.
- **Deployment**: Vercel (Production URL: `https://dot-helper-web.vercel.app`).

## 2. Current State (As of Last Session)
**Phase 1 (COMPLETE):** Security & Auth Hardening + Pricing Updates.
**Phase 2 (COMPLETE):** Wire Dashboard to Real Data.

### Phase 2 Summary
- **Session Utility** (`lib/session.ts`): `getServerSession()` and `requireCompanyUser()` for auth + multi-tenant scoping.
- **Zod Validation** (`lib/validations/`): Shared schemas for company, driver, vehicle (used by server actions + react-hook-form).
- **Company Onboarding** (`/dashboard/onboarding`): After signup, users create a Company record. Layout redirects users without a company to onboarding.
- **Server Actions** (`app/actions/`): Full CRUD for companies, drivers, vehicles, and dashboard stats. All mutations use `requireCompanyUser()`.
- **Dashboard Layout**: Converted to server component → `DashboardShell` client wrapper. Checks for company and redirects to onboarding if missing.
- **Driver Pages**: Server component pages → `DriversTable`/`DriverDetail` client components. Forms wired to server actions via react-hook-form.
- **Vehicle Pages**: Same pattern — server component pages → `VehiclesTable`/`VehicleDetail` client components.
- **Dashboard Home**: Server component fetching real stats (driver/vehicle counts, upcoming expirations). `DashboardContent` client component shows "Get Started" when empty.
- **CompanyProfileContext**: Loads from DB for authenticated users, falls back to localStorage for demo mode.
- **Demo Mode**: Fully preserved. `isDemoMode` flag in client components falls back to mock data.

### Key Architecture
- **Auth**: Fully functioning email/password signup, login, password reset, email verification.
- **Emails (Resend)**: `re_UiqEwxgZ_H5ZPoKczkmfuzAUm5WcKFbuW` — must be set in Vercel.
- **Pricing**: $49/mo (Starter), $99/mo (Growth), $199/mo (Fleet). Flat-fee, not per-driver.
- **Demo Mode**: `?demo=true` bypasses auth in middleware + shows mock data in all dashboard pages.

## 3. Immediate Next Steps & Full Roadmap
Your primary objective when picking up this session is to begin **Phase 2**, but you should be aware of the full remaining roadmap.

### Phase 3 — Payments & Billing (START HERE)
- Stripe product/price setup (use the $49/$99/$199 pricing model).
- Checkout flow & subscription management portal.
- Free trial logic (14-day, no CC required) and feature gating by plan.

### Phase 4 — Polish & Ops
- Error monitoring (Sentry) and Analytics (PostHog/Vercel).
- OAuth providers (Google/Apple real keys).
- Custom domain setup.
- "Compliance Audit" free tool for lead gen.

## 4. Key Files to Know
- **`apps/web/lib/auth.ts`**: The `better-auth` configuration (database adapter, email sending handlers, security settings).
- **`apps/web/lib/auth-client.ts`**: The React client export for `better-auth` (`signIn`, `signUp`, etc.).
- **`apps/web/lib/session.ts`**: Server-side session helpers — `getServerSession()` and `requireCompanyUser()`.
- **`apps/web/lib/validations/`**: Zod schemas shared between server actions and react-hook-form.
- **`apps/web/app/actions/`**: Server actions for company, drivers, vehicles, dashboard stats.
- **`apps/web/middleware.ts`**: Protects `/dashboard` routes. Checks for `better-auth.session_token` cookie. Passes `x-pathname` header.
- **`packages/database/prisma/schema.prisma`**: The source of truth for the data model. Run `npx prisma db push` from `packages/database` to migrate Neon.
- **`apps/web/app/page.tsx` & `apps/web/app/pricing/page.tsx`**: Marketing and pricing boundaries.

## 5. Development Commands
```bash
# Run web app locally
npx turbo dev --filter=web

# Sync Prisma Schema to Neon Database (run inside packages/database)
DATABASE_URL="..." npx prisma db push --accept-data-loss

# Build web app (useful for checking TypeScript/build errors)
npx turbo build --filter=web
```

## 6. Environment Variables (`apps/web/.env`)
The following are required for local development. Make sure they are also set in Vercel for production.
```env
# Neon Database
DATABASE_URL="postgresql://...neon.tech/..."

# Better Auth
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000" # Use vercel URL in prod

# Resend (Email)
RESEND_API_KEY="re_UiqEwxgZ_H5ZPoKczkmfuzAUm5WcKFbuW"
EMAIL_FROM="Greenlight DOT <noreply@yourdomain.com>"
```

## 7. Troubleshooting & Known Issues

### Auth Signup 500 "Bad escaped character in JSON"
**Symptom**: POST `/api/auth/sign-up/email` returns 500 with `SyntaxError: Bad escaped character in JSON at position N`.
**Root Cause**: The request body JSON contains invalid escape sequences. Common trigger: using bash `echo -n` to generate JSON with special characters like `!` — bash escapes `!` to `\!`, producing invalid JSON (`"Test1234\!"` instead of `"Test1234!"`).
**Fix**: Not a code bug. Use `printf` or Python to generate test JSON, or single-quote the string in bash to prevent history expansion.

### Prisma DB Pull Overwrites Schema
**Symptom**: Running `npx prisma db pull` replaces the hand-crafted `schema.prisma` with an introspected version that loses comments, enums, and relation naming.
**Fix**: Use `git restore packages/database/prisma/schema.prisma` immediately. Always use `prisma db push` to sync schema → DB, never `db pull` unless intentionally introspecting.

### OAuth Social Providers Not Working
**Symptom**: Google/Apple sign-in buttons redirect but fail.
**Root Cause**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET` are empty in `.env`.
**Fix**: Create OAuth apps in Google Cloud Console and Apple Developer Portal, then populate the env vars.

### Emails Not Sending Locally
**Symptom**: Console shows `[auth] RESEND_API_KEY not set — skipping email`.
**Fix**: Add `RESEND_API_KEY=re_UiqEwxgZ_H5ZPoKczkmfuzAUm5WcKFbuW` to `apps/web/.env`. The `sendEmail()` function in `auth.ts` gracefully skips when the key is missing.

### Signup Notification
Every new user signup sends a notification email to `scottmehr10@gmail.com` via the `databaseHooks.user.create.after` hook in `auth.ts`.

## 8. AI Persona & Constraints
- Write complete, robust production code. Do not leave `// TODO`s for the user unless it requires a proprietary key.
- ALWAYS use absolute paths when editing files.
- The UI must look incredibly modern and polished (premium SaaS aesthetic). Avoid basic/default component looks.
- Use `lucide-react` for icons.
- Avoid using `any` in TypeScript. Rely on generated Prisma types where possible.
