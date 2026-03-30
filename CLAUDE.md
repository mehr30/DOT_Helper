# AI Handoff Context: Greenlight USDOT

> **Note to Claude/AI agent**: This file serves as your canonical source of truth for the Greenlight USDOT codebase. Read this entire document before executing any commands or making code changes.

## 1. Project Overview & Architecture
Greenlight USDOT is a SaaS platform designed to help small business fleet owners (1-50 vehicles) achieve and maintain FMCSA/DOT compliance.
- **Framework**: Turborepo monorepo (`apps/web` Next.js 16 App Router, `apps/mobile` Expo React Native).
- **Database**: PostgreSQL hosted on **Neon** (`packages/database/prisma/schema.prisma`).
- **Auth**: `better-auth` v1.5 with Prisma adapter.
- **Email**: Resend API for transactional emails (verification, password reset, admin notifications).
- **Deployment**: Vercel (Production URL: `https://dot-helper-web.vercel.app`).
- **Custom Domain**: `greenlightusdot.com` (update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` in Vercel env vars if domain changes).

## 2. Current State (As of March 2026)
**Phase 1 (COMPLETE):** Security & Auth Hardening + Pricing Updates.
**Phase 2 (COMPLETE):** Wire Dashboard to Real Data.
**Content & SEO (COMPLETE):** Blog posts, static pages, shared components.

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

### Content & SEO Summary (March 2026)
- **43+ blog posts** covering all DOT compliance topics — all updated with:
  - Amber "Who does this apply to?" callout boxes (`styles.calloutAmber`)
  - Inline jargon definitions (GVWR, CMV, CDL, MVR, DQF, Clearinghouse, etc.)
  - CDL vs non-CDL accuracy fixes (drug/alcohol testing correctly scoped to CDL-only)
  - Plain English labels — no CFR code references in reader-facing text
  - OG metadata for social sharing on every post
- **Shared Footer** (`components/Footer.tsx`): 4-column layout (Product/Resources/Company/Legal). Used on landing page, blog, pricing, and all static pages.
- **Shared BlogPostLayout** (`blog/BlogPostLayout.tsx`): Wraps all blog posts with nav, metadata, related posts, CTA, and footer.
- **Shared StaticPageLayout** (`components/StaticPageLayout.tsx`): Wraps non-blog static pages (about, contact, help, privacy, terms).
- **Static pages created**: `/about`, `/contact`, `/help`, `/privacy`, `/terms`
- **Landing page hero**: "Stop chasing paperwork. Start running your fleet."
- **Blog CSS**: `blog.module.css` includes `.callout` (blue) and `.calloutAmber` (amber/yellow) callout styles.

### Key Architecture
- **Auth**: Fully functioning email/password signup, login, password reset, email verification.
- **Signup Notification**: Every new signup sends email to `scottmehr10@gmail.com` via `databaseHooks.user.create.after` in `auth.ts`.
- **Emails (Resend)**: Must have `RESEND_API_KEY` set in Vercel.
- **Pricing**: $49/mo (Starter), $99/mo (Growth), $199/mo (Fleet). Flat-fee, not per-driver.
- **Demo Mode**: `?demo=true` bypasses auth in middleware + shows mock data in all dashboard pages.

## 3. Immediate Next Steps & Full Roadmap

### Phase 3 — Payments & Billing (NEXT)
- Stripe product/price setup (use the $49/$99/$199 pricing model).
- Checkout flow & subscription management portal.
- Free trial logic (14-day, no CC required) and feature gating by plan.

### Phase 4 — Polish & Ops
- Error monitoring (Sentry) and Analytics (PostHog/Vercel).
- OAuth providers (Google/Apple real keys).
- "Compliance Audit" free tool for lead gen.

### Phase 5 — Driver Record Check Integration
- Partner with **SambaSafety** for MVR pulls (REST API, ~$3-8/pull wholesale, charge $12-15).
- FMCSA Clearinghouse API for drug & alcohol queries ($1.25/query, charge $5-10).
- Checkr for broader background checks ($15-30 wholesale, charge $35-50).
- Needs: partner agreement, Stripe metered billing, `RecordCheck` DB model, driver profile UI.

## 4. Key Files to Know

### Core
- **`apps/web/lib/auth.ts`**: `better-auth` configuration — database adapter, email handlers (verification, password reset), admin signup notification hook, security settings.
- **`apps/web/lib/auth-client.ts`**: React client export for `better-auth` (`signIn`, `signUp`, etc.).
- **`apps/web/lib/session.ts`**: Server-side session helpers — `getServerSession()` and `requireCompanyUser()`.
- **`apps/web/lib/validations/`**: Zod schemas shared between server actions and react-hook-form.
- **`apps/web/app/actions/`**: Server actions for company, drivers, vehicles, dashboard stats.
- **`apps/web/middleware.ts`**: Protects `/dashboard` routes. Checks for `better-auth.session_token` cookie. Passes `x-pathname` header.
- **`packages/database/prisma/schema.prisma`**: Source of truth for the data model. Run `npx prisma db push` from `packages/database` to migrate Neon.

### Marketing & Content
- **`apps/web/app/page.tsx`**: Landing page.
- **`apps/web/app/pricing/page.tsx`**: Pricing page.
- **`apps/web/app/blog/page.tsx`**: Blog index page.
- **`apps/web/app/blog/BlogPostLayout.tsx`**: Shared layout wrapping all blog posts (nav, article structure, related posts, CTA, footer).
- **`apps/web/app/blog/blog.module.css`**: Blog styles including `.callout` (blue) and `.calloutAmber` (amber) callout boxes.
- **`apps/web/app/components/Footer.tsx`**: Shared footer used across all public pages.
- **`apps/web/app/components/Footer.module.css`**: Footer styles.
- **`apps/web/app/components/StaticPageLayout.tsx`**: Shared layout for static pages (about, contact, help, privacy, terms).
- **`apps/web/app/components/StaticPageLayout.module.css`**: Static page styles (includes `.helpGrid`, `.helpCard`, `.contactGrid`, etc.).
- **`apps/web/app/components/GreenlightLogo.tsx`**: SVG logo component used in nav and footer.

### Static Pages
- **`apps/web/app/about/page.tsx`**: Company mission and info.
- **`apps/web/app/contact/page.tsx`**: Contact info and support channels.
- **`apps/web/app/help/page.tsx`**: Help center with card grid linking to compliance guides.
- **`apps/web/app/privacy/page.tsx`**: Privacy policy.
- **`apps/web/app/terms/page.tsx`**: Terms of service.

## 5. DOT Compliance Domain Knowledge
These rules govern how the platform models compliance requirements:
- **Two-tier weight system**: 10,001-26,000 lbs (non-CDL CMV) vs 26,001+ lbs (CDL required).
- **Drug/alcohol testing**: Triggered by CDL + CMV operation, NOT just CDL holding. Non-CDL CMV drivers (10,001-26,000 lbs) are NOT subject to FMCSA drug & alcohol testing.
- **CDL holder in non-CMV role**: NOT subject to FMCSA D&A testing, NOT in DOT random pool.
- **DQF (Driver Qualification File)**: Required for ALL CMV drivers (10,001+ lbs). Includes: employment application (10yr history), MVR (annual), road test certificate, medical card, previous employer checks, annual violations certificate. Drug/alcohol items are CDL-only additions.
- **Two separate testing programs**: DOT (mandatory, CDL+CMV) vs company-wide (optional) — cannot mix pools.
- **Clearinghouse "prohibited" status**: Employer must not permit CMV operation regardless of job role.
- **MC number phase-out**: FMCSA is eliminating separate MC numbers as of October 2025. USDOT number becoming the single identifier for both safety and authority.
- **State-level variability**: DQF thresholds, random testing restrictions, marijuana rules vary by state.

## 6. Development Commands
```bash
# Run web app locally
npx turbo dev --filter=web

# Sync Prisma Schema to Neon Database (run inside packages/database)
DATABASE_URL="..." npx prisma db push --accept-data-loss

# Build web app (useful for checking TypeScript/build errors)
npx turbo build --filter=web
```

## 7. Environment Variables (`apps/web/.env`)
The following are required for local development. Make sure they are also set in Vercel for production.
```env
# Neon Database
DATABASE_URL="postgresql://...neon.tech/..."

# Better Auth
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000" # Use production domain in prod
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Use production domain in prod

# Resend (Email)
RESEND_API_KEY="re_UiqEwxgZ_H5ZPoKczkmfuzAUm5WcKFbuW"
EMAIL_FROM="Greenlight USDOT <noreply@greenlightusdot.com>"
```

## 8. Troubleshooting & Known Issues

### Auth Signup 500 "Bad escaped character in JSON"
**Symptom**: POST `/api/auth/sign-up/email` returns 500 with `SyntaxError: Bad escaped character in JSON at position N`.
**Root Cause**: The request body JSON contains invalid escape sequences. Common trigger: using bash `echo -n` to generate JSON with special characters like `!` — bash escapes `!` to `\!`, producing invalid JSON.
**Fix**: Not a code bug. Use `printf` or Python to generate test JSON, or single-quote the string in bash.

### Prisma DB Pull Overwrites Schema
**Symptom**: Running `npx prisma db pull` replaces the hand-crafted `schema.prisma` with an introspected version.
**Fix**: Use `git restore packages/database/prisma/schema.prisma` immediately. Always use `prisma db push` to sync schema → DB.

### OAuth Social Providers Not Working
**Symptom**: Google/Apple sign-in buttons redirect but fail.
**Root Cause**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET` are empty.
**Fix**: Create OAuth apps in Google Cloud Console and Apple Developer Portal, then populate the env vars.

### Emails Not Sending Locally
**Symptom**: Console shows `[auth] RESEND_API_KEY not set — skipping email`.
**Fix**: Add `RESEND_API_KEY` to `apps/web/.env`. The `sendEmail()` function in `auth.ts` gracefully skips when missing.

## 9. AI Persona & Constraints
- Write complete, robust production code. Do not leave `// TODO`s for the user unless it requires a proprietary key.
- ALWAYS use absolute paths when editing files.
- The UI must look incredibly modern and polished (premium SaaS aesthetic). Avoid basic/default component looks.
- Use `lucide-react` for icons.
- Avoid using `any` in TypeScript. Rely on generated Prisma types where possible.
- Admin notification email: `scottmehr10@gmail.com`.
- De-jargon everything — no CFR codes in UI, plain English labels.
- Operate autonomously — don't ask before doing things unless explicitly told to ask.
- Push to GitHub regularly with updates.
