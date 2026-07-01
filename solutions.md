# Solutions & Patterns

## Prisma 7 (libsql/SQLite)
- **Adapter required:** `new PrismaClient()` alone throws — must use `PrismaLibSql` from `@prisma/adapter-libsql`
- **Config location:** `prisma.config.ts` (not `package.json`); seed config goes under `migrations.seed`
- **Generated client path:** `app/generated/prisma/`; import as `@/app/generated/prisma`
- **Singleton pattern:** `lib/prisma.ts` uses `globalThis` guard — required for Next.js hot-reload safety
- **Corporate proxy:** prefix all `npx prisma` commands with `NODE_TLS_REJECT_UNAUTHORIZED=0`

## Next.js Server Actions (React 18)
- Use `useFormState` from `react-dom` — `useActionState` is React 19+ only
- `"use server"` files must be separate from `"use client"` components — no mixing in the same file
- Call `revalidatePath(path)` **before** `redirect(path)` in server actions; reversed order silently breaks
- Admin layout has its own logout `<form>` — use `:has-text("...")` or specific selectors to disambiguate submit buttons

## Admin Auth (Middleware)
- **Middleware** (`middleware.ts`) runs in Edge Runtime — use `crypto.subtle` (Web Crypto API), not Node.js `crypto`
- **API route handlers** use Node.js `crypto` (`createHmac`) — both produce identical HMAC-SHA256 output
- Session cookie: HMAC-SHA256 signed, HttpOnly; validated by recomputing hash server-side

## Contact Form
- **Form reset on success:** add `key={formKey}` to `<form>` and a `useEffect` that increments `formKey` when `state.status === "success"` — resets uncontrolled inputs
- **Nodemailer:** `createTransport(config)` + `sendMail(options)` in try/catch; return clean error state on failure
- **Pre-fill:** `?product=<name>` query param is read in the page and passed as default value to the form
- Browser `type="email"` blocks invalid addresses before the server action fires; still add server-side regex validation

## Routing
- Route groups: `app/(public)/` wraps public pages in Header+Footer layout; `app/admin/(protected)/` wraps admin pages
- One `page.tsx` per resolved URL — `app/page.tsx` and `app/(public)/page.tsx` cannot coexist (conflict)
- After deleting a `page.tsx`, clear `.next/` cache before running `tsc --noEmit` or the old file lingers

## Images
- Use plain `<img>` with `{/* eslint-disable-next-line @next/next/no-img-element */}` instead of `next/image`
- Avoids needing `remotePatterns` in `next.config.mjs` for arbitrary external image URLs
