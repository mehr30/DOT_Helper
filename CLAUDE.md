# DOT Helper — Project Context

## Overview
DOT Helper is a SaaS platform (web + mobile) that helps small business fleet owners achieve and maintain DOT/FMCSA compliance. Built as a Turborepo monorepo.

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------  |
| Monorepo | Turborepo | 2.8.3 |
| Web App | Next.js (App Router) | 16.1.5 |
| Mobile App | Expo / React Native | 54 / 0.81.5 |
| Styling | CSS Modules + globals.css | — |
| Icons | Lucide React | 0.487.0 |
| Database Schema | Prisma (PostgreSQL) | — |
| Payments | Stripe (stripe + @stripe/stripe-js) | — |
| Auth | NextAuth.js v4 (Google, Apple, Credentials) | 4.24.13 |
| Language | TypeScript | 5.9.2 |

## Monorepo Structure
```
DOT_Helper/
├── apps/
│   ├── web/          # Next.js 16 web app (port 3000)
│   │   ├── app/
│   │   │   ├── page.tsx              # Marketing landing page
│   │   │   ├── layout.tsx            # Root layout w/ SEO meta + JSON-LD + AuthProvider
│   │   │   ├── globals.css           # Design system (CSS custom properties)
│   │   │   ├── pricing/              # Stripe-integrated pricing page
│   │   │   ├── login/                # Login page (email + Google/Apple OAuth)
│   │   │   ├── register/             # Registration page (email + Google/Apple OAuth)
│   │   │   ├── features/             # Features page
│   │   │   ├── blog/                 # Blog index + 55 SEO-optimized posts
│   │   │   │   ├── BlogPostLayout.tsx  # Shared blog post component
│   │   │   │   ├── blog.module.css     # Blog styling
│   │   │   │   └── [slug]/page.tsx     # Individual post pages
│   │   │   ├── checkout/             # Stripe success/cancel pages
│   │   │   ├── api/auth/[...nextauth]/ # NextAuth API route
│   │   │   ├── actions/stripe.ts     # Stripe Server Actions
│   │   │   ├── robots.ts             # SEO robots.txt
│   │   │   ├── sitemap.ts            # SEO sitemap.xml (55 blog URLs)
│   │   │   ├── components/
│   │   │   │   ├── Sidebar.tsx       # Dashboard sidebar nav
│   │   │   │   ├── AuthProvider.tsx   # NextAuth SessionProvider wrapper
│   │   │   │   └── Sidebar.module.css
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Dashboard overview
│   │   │       ├── compliance/       # Compliance checklist
│   │   │       ├── alerts/           # Alerts & notifications
│   │   │       ├── drivers/          # Driver management
│   │   │       ├── vehicles/         # Vehicle management
│   │   │       ├── hos/              # Hours of Service
│   │   │       └── documents/        # Document management
│   │   ├── lib/
│   │   │   └── auth.ts              # NextAuth config (Google, Apple, Credentials)
│   │   └── public/
│   └── mobile/       # Expo React Native app
│       ├── App.tsx                   # Main app with tab nav
│       └── screens/                  # Screen components
├── packages/
│   ├── database/     # Prisma schema (schema.prisma)
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

# Mobile
cd apps/mobile && npx expo start
```

## Design System
- **Color scheme**: Professional blue/gray with CSS custom properties in `globals.css`
- **Font**: Inter (Google Fonts)
- **Styling**: CSS Modules per page (`page.module.css`) + global utility classes
- **Dark mode**: Supported via `prefers-color-scheme`
- **Pattern**: Each dashboard page has `page.tsx` + `page.module.css`

## Authentication
- **NextAuth.js v4** with JWT session strategy (30-day sessions)
- **Providers**: Google OAuth, Apple Sign In, Email/Password (Credentials)
- **Config**: `lib/auth.ts` → imported by `app/api/auth/[...nextauth]/route.ts`
- **Session**: Wrapped via `AuthProvider` in root layout
- **Custom pages**: `/login` (sign in), `/register` (sign up)
- **Post-auth redirect**: `/dashboard`
- **Credentials provider**: Currently accepts any email/password (replace with DB lookup for production)

## Database Models (Prisma)
Company, User, Driver, Vehicle, HOSLog, HOSEntry, DrugTest, Inspection, MaintenanceRecord, Violation, Document, Alert

## SEO Content Hub (55 pages)
5 pillar pages + 50 cluster pages (10 per pillar):
- **P1**: DOT Compliance Checklist + 10 clusters
- **P2**: FMCSA Regulations & Audit + 10 clusters
- **P3**: Driver Compliance & Qualification + 10 clusters
- **P4**: Vehicle Maintenance & Inspection + 10 clusters
- **P5**: Drug & Alcohol Testing + 10 clusters

All content uses anti-AI writing style: first-person voice, specific CFR citations, industry jargon, varied sentence structure.

## Current State
- All dashboard pages use **mock/hardcoded data** (no database connection yet)
- Stripe integration uses **Server Actions** with placeholder price IDs (need real Stripe keys)
- Auth uses **development credentials provider** (accepts any email/password)
- Blog posts are **static Next.js pages** (no CMS)
- Mobile app has **tab navigation** with Home, DVIR, Compliance, Alerts, Profile screens

## Environment Variables Needed
```
# Auth
NEXTAUTH_SECRET=...          # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_YEARLY=price_...
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
STRIPE_PRICE_PROFESSIONAL_YEARLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_YEARLY=price_...

# Database
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=https://dothelper.com
```

