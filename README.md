# Yugan Ayurved & Panchkarma Products

> **Premium Multi-Mode Commerce Platform — B2B Wholesale • B2C Retail • SPECIAL Atelier**

A modern, scalable multi-mode commerce ecosystem engineered with Next.js, Tailwind CSS, Prisma ORM, and Framer Motion. The platform delivers three distinct commerce experiences under a unified, luxury Ayurvedic wellness brand.

---

## 🏛️ Specialized Commerce Experiences

```
                            YUGAN AYURVED
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
        B2C                      B2B                    SPECIAL
    Retail Store          Wholesale Portal          Sovereign Atelier
  Consumer Wellness       Clinical Procurement     Turnkey Sanctuary Sets
```

1. **B2C (Retail Wellness & Daily Panchkarma)**:
   - Direct-to-consumer shopping experience with classical Ayurvedic formulations (Mahanarayan, Ksheerabala 101, Kumkumadi Saffron oil, Organic Triphala).
   - Real-time sliding cart drawer, product filtering, classical benefits breakdown, customer accounts, and wishlist.

2. **B2B (Clinical Wholesale & Hospital Supply)**:
   - Institutional procurement portal for Ayurvedic hospitals, clinics, and wellness resorts.
   - Bulk 5L & 25L drum supply, tiered volume discount matrix (up to 38% off), and real-time **RFQ (Request for Quotation) Builder** with downloadable PDF generation.

3. **SPECIAL (The Sovereign Atelier)**:
   - Bespoke luxury sanctuary suites, single-log hand-carved Burmese teak Droni tables, and hand-hammered brass Shirodhara arches.
   - Private consultation booking with Master Vaidyas and white-glove turnkey clinic calibration.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Frontend**: [React 18](https://react.dev/), [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/), PostCSS, Autoprefixer
- **Database & ORM**: [Prisma ORM 5.22](https://www.prisma.io/) (PostgreSQL in production, SQLite in development)
- **State & Transitions**: [Framer Motion 11](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: JWT & Cookie-based RBAC (Super Admin, Sales Manager, Customer)

---

## ✨ Platform Features

- **Global Live Search**: Debounced instant catalog search with multi-faceted filtering by commerce mode, category, dosage form, and price.
- **Pure-White Dropdown Mega Menus**: Full-width structured navigation drawers on desktop with featured product spotlights.
- **Mobile-First Responsive Architecture**: 100% responsive down to 320px viewports with zero horizontal scrolling or cramped buttons.
- **Global Floating Actions**:
  - **Left**: Circular Scroll-To-Top button with smooth easing.
  - **Right**: Circular `#25D366` WhatsApp floating button with gentle pulse ring and mode-specific consultation intents.
- **Admin Dashboard**: Comprehensive order fulfillment, quotation review, inquiry management, product catalog administration, and role-based access control.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd bhairavi-surgical
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secure-jwt-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Setup Database & Seed Initial Catalog
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to local SQLite database
npm run prisma:push

# Seed authentic classical Ayurvedic products, categories, and admin users
npm run prisma:seed
```

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the portal.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles optimized production bundles for all 40+ routes |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs Next.js ESLint code verification |
| `npm run prisma:generate` | Generates the type-safe Prisma Client SDK |
| `npm run prisma:push` | Syncs schema changes directly to the database |
| `npm run prisma:seed` | Seeds classical product catalog, pricing tiers, and admin accounts |

---

## 📂 Project Structure

```
├── app/                        # Next.js 14 App Router routes & API endpoints
│   ├── (auth)/account/         # Customer account login, registration & profile
│   ├── admin/                  # RBAC Admin dashboards (orders, quotes, inquiries)
│   ├── api/                    # REST API endpoints (auth, products, search, quotes)
│   ├── b2b/                    # B2B Wholesale portal & RFQ builder
│   ├── b2c/                    # B2C Retail storefront & cart
│   ├── special/                # SPECIAL Sovereign Atelier bespoke collections
│   ├── globals.css             # Global Tailwind styles & design tokens
│   ├── layout.jsx              # Root application layout with Context providers
│   └── page.jsx                # Pre-landing mode selector & admin auth entrance
├── components/                 # Reusable UI component design system
│   ├── auth/                   # ModeSelector, AdminAuthCard, LoginForm
│   ├── hero/                   # Video & static hero banners for B2B/B2C/SPECIAL
│   ├── layout/                 # Navbar, Mega Menus, Footer, QuickBar
│   ├── products/               # B2C, B2B & Special product cards & filters
│   ├── search/                 # Global full-width live search panel
│   └── ui/                     # Button, Modal, GlobalFloatingActions
├── context/                    # React Contexts (AuthContext, CartContext, QuoteContext)
├── lib/                        # Prisma client instance, JWT utilities, cn helpers
├── prisma/                     # Database schema (schema.prisma) & seed script (seed.js)
├── public/                     # Static media assets & videos
├── .env.example                # Safe environment variable configuration template
├── .gitignore                  # Production Git ignore rules
└── tailwind.config.js          # Custom color palette (forest, cream, gold, terracotta)
```

---

## 🔒 Security & Best Practices

- **Zero Secrets Committed**: Environment variables (`.env`, `.env.local`) are strictly excluded via `.gitignore`.
- **Sanitized Inputs**: All quote requests, consultation forms, and inquiries are validated.
- **Secure Password Hashing**: Passwords stored using bcrypt with salt rounds.

---

## 📄 License

This project is proprietary and confidential to **Yugan Ayurved & Panchkarma Products**. All rights reserved.
