# PRD: 3D Prints Shop Website

## Introduction

A Next.js + Tailwind CSS showcase website for a 3D prints business. Visitors can browse a catalog of pre-made prints with fixed prices and submit an order inquiry via a contact form. A password-protected admin panel allows the shop owner to manage the product catalog. No payment processing in this version.

---

## Goals

- Display a browsable catalog of pre-made 3D print products
- Allow visitors to view product details and submit order inquiries
- Provide an admin panel for managing (add / edit / delete) products
- Ship an MVP with no payment integration

---

## User Stories

### US-001: Project scaffold
**Description:** As a developer, I want the Next.js + Tailwind project initialized so that all subsequent stories have a working base.

**Acceptance Criteria:**
- [x] `create-next-app` with TypeScript and App Router
- [x] Tailwind CSS installed and configured
- [x] Prisma installed with SQLite provider (dev) configured
- [x] `.env.example` documents required env vars (`DATABASE_URL`, `ADMIN_PASSWORD`, `CONTACT_EMAIL`)
- [x] `npm run dev` starts without errors
- [x] Typecheck passes

---

### US-002: Product database schema
**Description:** As a developer, I want a Product table in the database so that product data can be persisted.

**Acceptance Criteria:**
- [x] `Product` model includes: `id`, `name`, `description`, `price` (Float), `imageUrl` (String), `category` (String), `available` (Boolean, default true), `createdAt`
- [x] Prisma migration runs successfully (`npx prisma migrate dev`)
- [x] Prisma Client generated without errors
- [x] Typecheck passes

---

### US-003: Product seed script
**Description:** As a developer, I want sample products seeded so that the catalog is not empty during development.

**Acceptance Criteria:**
- [x] `prisma/seed.ts` inserts at least 6 diverse sample products across 2+ categories
- [x] `npx prisma db seed` runs without errors
- [x] Products are visible via `npx prisma studio`
- [x] Typecheck passes

---

### US-004: Admin authentication
**Description:** As the shop owner, I want a login page protecting the admin panel so that unauthorized users cannot modify the catalog.

**Acceptance Criteria:**
- [x] `/admin/login` page with email + password form
- [x] Credentials checked against `ADMIN_PASSWORD` env var
- [x] Successful login sets a secure HTTP-only session cookie
- [x] All `/admin/*` routes redirect to `/admin/login` when unauthenticated
- [x] Logout clears the session cookie and redirects to login
- [x] Typecheck passes
- [x] Verify changes work in browser

---

### US-005: Admin product list
**Description:** As the shop owner, I want to see all products in the admin panel so that I can manage them.

**Acceptance Criteria:**
- [x] `/admin/products` lists all products in a table (name, category, price, available status)
- [x] Each row has Edit and Delete action buttons
- [x] Page is only accessible when authenticated
- [x] Typecheck passes
- [x] Verify changes work in browser

---

### US-006: Admin create product
**Description:** As the shop owner, I want to add a new product so that it appears in the public catalog.

**Acceptance Criteria:**
- [x] `/admin/products/new` renders a form with fields: name, description, price, imageUrl, category, available toggle
- [x] Submitting valid data creates the product and redirects to `/admin/products`
- [x] Required fields (name, price, imageUrl, category) show inline validation errors when blank
- [x] New product appears immediately in the admin list
- [x] Typecheck passes
- [x] Verify changes work in browser

---

### US-007: Admin edit and delete product
**Description:** As the shop owner, I want to edit or remove a product so that the catalog stays accurate.

**Acceptance Criteria:**
- [x] `/admin/products/[id]/edit` pre-fills all fields from the existing product
- [x] Saving updates the record and redirects to `/admin/products`
- [x] Delete button on the list page removes the product after a confirmation prompt
- [x] Deleted product no longer appears in admin list or public catalog
- [x] Typecheck passes
- [x] Verify changes work in browser

---

### US-008: Site layout (header + footer)
**Description:** As a visitor, I want consistent navigation so that I can move around the site easily.

**Acceptance Criteria:**
- [x] Header includes site logo/name and nav links: Home, Catalog, Contact
- [x] Active nav link is visually highlighted
- [x] Footer includes site name and a brief tagline
- [x] Layout is responsive (mobile hamburger menu collapses nav links)
- [x] Layout wraps all public pages
- [x] Typecheck passes
- [x] Verify changes work in browser

---

### US-009: Public catalog page
**Description:** As a visitor, I want to browse all available prints so that I can find something I like.

**Acceptance Criteria:**
- [x] `/catalog` displays a responsive grid of product cards (image, name, category, price)
- [x] Only products with `available: true` are shown
- [x] Category filter buttons above the grid filter products client-side
- [x] Clicking a card navigates to the product detail page
- [x] Empty state message shown when no products match the filter
- [x] Typecheck passes
- [x] Verify changes work in browser

---

### US-010: Product detail page
**Description:** As a visitor, I want to view full details of a print so that I can decide whether to order it.

**Acceptance Criteria:**
- [ ] `/catalog/[id]` shows product image, name, description, category, and price
- [ ] "Request Order" button links to the contact form with the product name pre-filled
- [ ] 404 page returned for unknown product IDs
- [ ] Typecheck passes
- [ ] Verify changes work in browser

---

### US-011: Order inquiry contact form
**Description:** As a visitor, I want to submit an order inquiry so that the shop owner can follow up with me.

**Acceptance Criteria:**
- [ ] `/contact` form collects: name, email, product of interest (pre-filled if arriving from detail page), message
- [ ] All fields required; inline validation errors shown for empty/invalid values
- [ ] Valid submission sends an email to `CONTACT_EMAIL` via Nodemailer (or Resend)
- [ ] Success message shown after submission; form fields cleared
- [ ] Error message shown if the email send fails
- [ ] Typecheck passes
- [ ] Verify changes work in browser

---

## Non-Goals

- Payment processing (Stripe or otherwise) — out of scope for this version
- User accounts or order history for customers
- Customizable / made-to-order product flows
- Digital file / STL downloads
- Inventory quantity tracking
- Product reviews or ratings
- Multi-language / i18n support

---

## Technical Notes

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM with SQLite for development (can be swapped to PostgreSQL in production)
- **Admin auth:** Lightweight cookie-based session (no NextAuth needed for single-owner MVP)
- **Email:** Nodemailer with SMTP or Resend SDK — configured via env vars
- **Images:** Use standard `<img>` or Next.js `<Image>` with external URL strings for now (no file upload)
- **Deployment target:** Vercel (configure `DATABASE_URL` to point at a hosted Postgres or PlanetScale for prod)
