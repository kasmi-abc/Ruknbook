# Rukn Books

An online bookstore for Algeria built with Next.js 15 (App Router) — catalog, cart,
checkout with cash on delivery, order tracking, and a full admin panel.

## Tech Stack

- **Framework:** Next.js 15.1.4 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** Auth.js v5 (credentials login, guest checkout supported)
- **State:** Zustand (cart + wishlist)
- **UI:** Radix UI primitives, Lucide icons, Sonner toasts
- **Animations:** Framer Motion

## Features

- 3 languages: English (default), Arabic (RTL), French
- Dark mode
- Book catalog with categories, filters, search, pagination, best sellers,
  new releases and offers
- Cart & checkout: gift card message option, delivery notes, Algerian
  address validation (58 wilayas), strict input validation
- Cash on delivery only (no online payment)
- Order confirmation page with printable A5 receipt
- Order tracking by order number + phone
- Reviews and personal wishlists for logged-in users
- Admin panel: dashboard KPIs, 7-day sales chart, order management with
  status updates and detail drawer, printable invoice / shipping label /
  gift card, inline stock & price editing, low-stock alerts, CSV export,
  customers and newsletter subscribers

## Getting Started

```bash
npm install
npx prisma db push        # sync the database schema
npm run dev               # start the dev server
```

Open [http://localhost:3000](http://localhost:3000).

For production:

```bash
npm run build
npm run start
```

## Environment Variables

Create a `.env` file (see `.env.example` conventions):

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="..."
```

## Default Admin Account

```
admin@ruknbooks.dz / *******
```

Admin panel: `/en/admin` (or `/ar/admin`, `/fr/admin`)

## Project Structure

```
src/
  app/            routes ([locale] pages + API routes)
  components/     UI components + admin panel
  lib/            prisma, auth, book queries, validation, i18n, print documents
  store/          Zustand stores (cart, wishlist)
prisma/           schema.prisma
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start development server       |
| `npm run build`   | Build for production           |
| `npm run start`   | Start production server        |
| `npm run lint`    | Run ESLint                     |

---

Designed by [K.Haithem](https://www.instagram.com/abdelkader_haith/)
