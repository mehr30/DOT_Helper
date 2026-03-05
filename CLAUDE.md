# AI Handoff Context: DOT Helper

> **Note to Claude/AI agent**: This file serves as your canonical source of truth for the DOT Helper codebase. Read this entire document before executing any commands or making code changes.

## 1. Project Overview & Architecture
DOT Helper is a SaaS platform designed to help small business fleet owners (1-50 vehicles) achieve and maintain FMCSA/DOT compliance.
- **Framework**: Turborepo monorepo (`apps/web` Next.js 16 App Router, `apps/mobile` Expo React Native).
- **Database**: PostgreSQL hosted on **Neon** (`packages/database/prisma/schema.prisma`).
- **Auth**: `better-auth` v1.5 with Prisma adapter.
- **Deployment**: Vercel (Production URL: `https://dot-helper-web.vercel.app`).

## 2. Current State (As of Last Session)
We just completed **Phase 1: Security & Auth Hardening** and **Pricing Updates**.
- **Auth**: Fully functioning email/password signup, login, password reset (`/forgot-password`, `/reset-password`), and email verification workflows.
- **Emails (Resend)**: Configured in `apps/web/lib/auth.ts`. We use a custom `sendEmail` lazy-loaded wrapper so the build doesn't crash if the env var is missing. **The user's Resend API key is `re_UiqEwxgZ_H5ZPoKczkmfuzAUm5WcKFbuW`.** It MUST be set in Vercel.
- **Production Login Bug Fix**: In `lib/auth.ts`, `baseURL` is heavily enforced. `trustHost: true` and explicit `trustedOrigins` have been added to fix CORS/Vercel proxy issues.
- **Pricing**: $49/mo (Starter), $99/mo (Growth), $199/mo (Fleet). Flat-fee, not per-driver. Added $11,000 fine ROI conversion copy.
- **Demo Mode**: `?demo=true` in the URL bypasses the `middleware.ts` auth check to allow taking marketing screenshots.
- **Dashboard Data**: Currently, all dashboard components use *hardcoded/mock data* inside of their `page.tsx` or components files.

## 3. Immediate Next Steps (Phase 2: Wiring Data)
Your primary objective when picking up this session is to begin **Phase 2 — Wiring Dashboard to Real Data**:
1. **Company Onboarding**: After signup, a user must create/join a `Company` record. The `User` model has a relation to `Company`.
2. **Driver & Vehicle CRUD**: Wire the `apps/web/app/dashboard/drivers` and `vehicles` pages to fetch and mutate real data from the Neon database via Server Actions or standard API routes.
3. **Remove Mock Data**: Systematically replace the inline arrays in the dashboard components with real database fetch calls.

*Do not start working on Stripe or advanced analytics until the core CRUD functionality for Drivers and Vehicles is wired to the database.*

## 4. Key Files to Know
- **`apps/web/lib/auth.ts`**: The `better-auth` configuration (database adapter, email sending handlers, security settings).
- **`apps/web/lib/auth-client.ts`**: The React client export for `better-auth` (`signIn`, `signUp`, etc.).
- **`apps/web/middleware.ts`**: Protects `/dashboard` routes. Checks for `better-auth.session_token` cookie.
- **`packages/database/prisma/schema.prisma`**: The source of truth for the data model (contains User, Company, Driver, Vehicle, Document, Alert, etc.). Run `npx prisma db push` from `packages/database` to migrate Neon.
- **`apps/web/app/page.tsx` & `apps/web/app/pricing/page.tsx`**: Marketing and pricing boundaries. Contains exact feature arrays and pricing math.

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
EMAIL_FROM="DOT Helper <noreply@yourdomain.com>"
```

## 7. AI Persona & Constraints
- Write complete, robust production code. Do not leave `// TODO`s for the user unless it requires a proprietary key.
- ALWAYS use absolute paths when editing files.
- The UI must look incredibly modern and polished (premium SaaS aesthetic). Avoid basic/default component looks.
- Use `lucide-react` for icons.
- Avoid using `any` in TypeScript. Rely on generated Prisma types where possible.
