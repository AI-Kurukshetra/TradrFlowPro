# TradeFlow Pro

Production-ready **Next.js 14 App Router** SaaS for Supply Chain Finance.

## Stack

- Next.js 14 (App Router, TypeScript)
- Supabase (Auth + PostgreSQL + Storage)
- Tailwind CSS + shadcn/ui
- Recharts
- Deploy-ready for Vercel

## Implemented Pages

- `/` Landing page (hero, features, pricing, CTA)
- `/login` Auth login
- `/signup` Auth signup
- `/dashboard/buyer` Buyer dashboard
- `/dashboard/supplier` Supplier dashboard
- `/invoices` Invoice management (list/create/approve)
- `/purchase-orders` Purchase order management (list/create)
- `/analytics` Analytics dashboard (TPV + payment metrics)
- `/onboarding/supplier` Supplier onboarding (KYC + document upload)

## Environment

`.env.local` is already created with the provided Supabase values.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is only required for running the Node seed script.

## Database Setup

Run these SQL files in Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Tables included:

- `users`
- `organizations`
- `suppliers`
- `buyers`
- `invoices`
- `purchase_orders`
- `payments`
- `financing_requests`
- `documents`
- `audit_logs`
- `notifications`

## Seed Script

A TypeScript seed script is included at `scripts/seed.ts`.

It inserts demo data with exactly:

- 10 suppliers
- 20 invoices
- 5 purchase orders

Run it with:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_key npm run seed
```

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run lint
npm run build
npm start
```

## Vercel Deployment

1. Push repo to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## Notes

- Auth-protected routes are enforced by `middleware.ts`.
- Supabase clients are separated for browser/server usage.
- Server Actions handle secure writes for invoices, POs, financing requests, and KYC submissions.
