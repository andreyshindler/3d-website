# Project Memory

## Project
**3D Prints Shop Website** — MVP for a solo shop owner. Public catalog + admin panel + contact form. No payment processing.

## Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Prisma 7 with libsql adapter (SQLite via `dev.db`)
- Nodemailer (SMTP contact form)

## Status
Feature-complete per PRD.md. All 11 user stories (US-001–US-011) are done. Any new work is post-MVP.

## Key Routes
| Route | Purpose |
|---|---|
| `/catalog` | Public product grid with category filter |
| `/catalog/[id]` | Product detail + "Request Order" link |
| `/contact` | Inquiry form; accepts `?product=` pre-fill param |
| `/admin/login` | Password-protected admin entry |
| `/admin/products` | Product CRUD (list, create, edit, delete) |

## Key Files
| File | Purpose |
|---|---|
| `lib/prisma.ts` | Prisma singleton (globalThis guard for hot-reload safety) |
| `middleware.ts` | Session cookie auth — Edge Runtime, Web Crypto API |
| `prisma/schema.prisma` | Database schema |
| `prisma.config.ts` | Prisma 7 config (adapter + seed) |
| `app/generated/prisma/` | Generated Prisma client — import as `@/app/generated/prisma` |
| `app/(public)/` | Route group: public pages with Header+Footer layout |
| `app/admin/(protected)/` | Route group: admin pages with admin layout |

## Environment Variables (`.env`)
- `DATABASE_URL` — libsql connection string (e.g. `file:./dev.db`)
- `SESSION_SECRET` — HMAC secret for session cookie signing
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO` — Nodemailer config

## Dev Environment Notes
- Run `NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma ...` on corporate proxy machines
- Clear `.next/` cache after deleting page files before running `tsc --noEmit`
- Seed: `npx prisma db seed` (config under `migrations.seed` in `prisma.config.ts`)
