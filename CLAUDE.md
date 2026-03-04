# DOT Helper — Project Context

## Overview
DOT Helper is a SaaS platform (web + mobile) that helps small business fleet owners achieve and maintain DOT/FMCSA compliance. Built as a Turborepo monorepo. Live at **https://dot-helper-web.vercel.app**.

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Monorepo | Turborepo | 2.8.3 |
| Web App | Next.js (App Router) | 16.1.5 |
| Mobile App | Expo / React Native | 54 / 0.81.5 |
| Styling | CSS Modules + globals.css | — |
| Icons | Lucide React | 0.487.0 |
| Database | Prisma + PostgreSQL (Neon) | 6.19.2 |
| Payments | Stripe (stripe + @stripe/stripe-js) | — |
| Auth | better-auth (email/password + Google/Apple OAuth) | 1.5.3 |
| Language | TypeScript | 5.9.2 |

## Monorepo Structure
```
DOT_Helper/
├── apps/
│   ├── web/          # Next.js 16 web app (port 3000)
│   │   ├── app/
│   │   │   ├── page.tsx              # Marketing landing page (w/ product showcase)
│   │   │   ├── layout.tsx            # Root layout w/ SEO meta + JSON-LD
│   │   │   ├── globals.css           # Design system (CSS custom properties)
│   │   │   ├── pricing/              # Stripe-integrated pricing page
│   │   │   ├── login/                # Login page (email + Google/Apple OAuth)
│   │   │   ├── register/             # Registration page
│   │   │   ├── features/             # Features page
│   │   │   ├── blog/                 # Blog index + 55 SEO-optimized posts
│   │   │   │   ├── BlogPostLayout.tsx  # Shared blog post component
│   │   │   │   ├── blog.module.css     # Blog styling
│   │   │   │   └── [slug]/page.tsx     # Individual post pages
│   │   │   ├── checkout/             # Stripe success/cancel pages
│   │   │   ├── api/auth/[...all]/    # better-auth API catch-all route
│   │   │   ├── actions/stripe.ts     # Stripe Server Actions
│   │   │   ├── robots.ts             # SEO robots.txt
│   │   │   ├── sitemap.ts            # SEO sitemap.xml (55 blog URLs)
│   │   │   ├── components/
│   │   │   │   ├── Sidebar.tsx         # Dashboard sidebar nav
│   │   │   │   ├── DemoModeContext.tsx  # Demo mode state (activates via ?demo=true)
│   │   │   │   ├── AuthProvider.tsx     # No-op wrapper (better-auth handles sessions)
│   │   │   │   └── Sidebar.module.css
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Dashboard overview
│   │   │       ├── compliance/       # Compliance checklist
│   │   │       ├── alerts/           # Alerts & notifications
│   │   │       ├── drivers/          # Driver management
│   │   │       ├── vehicles/         # Vehicle management
│   │   │       ├── hos/              # Hours of Service
│   │   │       └── documents/        # Document management + compliance wizard
│   │   ├── lib/
│   │   │   ├── auth.ts              # better-auth server (Prisma adapter, PostgreSQL)
│   │   │   └── auth-client.ts       # better-auth React client (signIn, signUp, signOut, useSession)
│   │   ├── middleware.ts            # Route protection (/dashboard requires session, ?demo=true bypasses)
│   │   ├── public/screenshots/      # Marketing screenshots (dashboard, drivers, compliance)
│   │   └── .env.example             # Template for env vars
│   └── mobile/       # Expo React Native app
│       ├── App.tsx                   # Main app with tab nav
│       └── screens/                  # Screen components
├── packages/
│   ├── database/     # Prisma schema + client
│   │   └── prisma/schema.prisma     # 14 models + better-auth tables
│   ├── ui/           # Shared React component library
│   ├── eslint-config/
│   └── typescript-config/
```

## Commands
```bash
# Dev (all apps)
npm run dev           # or: npx turbo dev

# Dev (web only)
npx turbo dev --filter=web

# Build
npx turbo build --filter=web

# Type check
npx turbo check-types --filter=web

# Database
cd packages/database && npx prisma db push       # Push schema to Neon
cd packages/database && npx prisma studio         # Open Prisma Studio

# Mobile
cd apps/mobile && npx expo start
```

## Design System
- **Color scheme**: Professional blue/gray with CSS custom properties in `globals.css`
- **Font**: Inter (Google Fonts)
- **Styling**: CSS Modules per page (`page.module.css`) + global utility classes
- **Dark mode**: Supported via `prefers-color-scheme`
- **Pattern**: Each dashboard page has `page.tsx` + `page.module.css`

## Authentication (better-auth)
- **better-auth v1.5** with Prisma adapter for PostgreSQL (Neon)
- **Providers**: Email/Password, Google OAuth, Apple Sign In
- **Server**: `lib/auth.ts` → `betterAuth()` with `prismaAdapter()`
- **Client**: `lib/auth-client.ts` → `signIn.email()`, `signUp.email()`, `signIn.social()`, `signOut()`, `useSession()`
- **API route**: `app/api/auth/[...all]/route.ts` → `toNextJsHandler(auth)`
- **Middleware**: `middleware.ts` protects `/dashboard/*` routes; redirects to `/login` if no session
- **Demo bypass**: `?demo=true` query param bypasses auth (for screenshots/demos)
- **Sessions**: 30-day expiry, 5-minute cookie cache

## Database (Neon PostgreSQL + Prisma)
- **Host**: Neon (us-east-2)
- **Schema**: `packages/database/prisma/schema.prisma`
- **Auth models**: User, Session, Account, Verification
- **DOT models**: Company, Driver, Vehicle, HOSLog, HOSEntry, DrugTest, Inspection, MaintenanceRecord, Violation, Document, Alert
- **Build**: `prisma generate` runs as postinstall and before `next build`

## Demo Mode
- Dashboard pages use **demo/mock data** by default (via `DemoModeContext`)
- Activated by `?demo=true` URL parameter
- Middleware allows unauthenticated access with `?demo=true`
- Useful for marketing screenshots and product demos
- Subtle "Viewing sample data / Exit demo" banner in sidebar

## SEO Content Hub (55 pages)
5 pillar pages + 50 cluster pages (10 per pillar):
- **P1**: DOT Compliance Checklist + 10 clusters
- **P2**: FMCSA Regulations & Audit + 10 clusters
- **P3**: Driver Compliance & Qualification + 10 clusters
- **P4**: Vehicle Maintenance & Inspection + 10 clusters
- **P5**: Drug & Alcohol Testing + 10 clusters

Blog posts use plain-language, beginner-friendly tone with practical examples.

## Deployment
- **Hosting**: Vercel (hobby plan)
- **URL**: https://dot-helper-web.vercel.app
- **Auto-deploy**: Pushes to `main` branch auto-deploy via GitHub integration
- **Build command**: `prisma generate && next build` (configured in `package.json`)

## Environment Variables
```
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require

# better-auth
BETTER_AUTH_SECRET=...          # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000   # Production: https://dot-helper-web.vercel.app

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Current State
- ✅ Auth: Real email/password signup + login via better-auth + Neon
- ✅ Database: 14 tables live on Neon PostgreSQL
- ✅ Middleware: Dashboard routes protected, demo mode bypass
- ✅ Marketing: Homepage with product screenshot showcase (3 tabbed views)
- ✅ Blog: 55 SEO-optimized posts with beginner-friendly tone
- ⏳ Dashboard data: Uses demo/mock data (not yet wired to database)
- ⏳ Stripe: Uses placeholder price IDs (need real Stripe keys)
- ⏳ OAuth: Google/Apple configured but need real client IDs
- ⏳ Mobile: Tab navigation with placeholder screens
