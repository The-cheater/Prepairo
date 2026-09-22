Architecture Reorganization Completed
We have restructured the project into clear frontend/ and backend/ folders for readability, and updated all import paths and TypeScript path aliases.

New Project Directory Structure

```
pyq/
├── frontend/                     # All Client-side & UI Code
│   ├── components/
│   │   ├── admin/                # Admin Moderation Dashboard
│   │   ├── auth/                 # AuthProvider, LoginForm, RegisterForm
│   │   ├── browse/               # GuidedBrowse & Category selectors
│   │   ├── dashboard/            # UserDashboard & Profile management
│   │   ├── gamification/         # CreditBadge, LeaderboardTable
│   │   ├── landing/              # HeroSection, FeaturedSchools, StatTiles
│   │   ├── navigation/           # Navbar, Footer
│   │   ├── papers/               # PaperCard, PaperGrid, PaperModal
│   │   ├── pdf/                  # In-app PdfViewer with zoom & download
│   │   ├── react-bits/           # BranchedMenu, DotGrid, PillNav
│   │   ├── requests/             # RequestBoard, RequestCarousel, Modal
│   │   ├── search/               # CommandSearch (⌘K)
│   │   └── upload/               # UploadForm, SubjectSuggestModal
│   ├── store/
│   │   └── store.ts              # Client-side state & localStorage sync
│   ├── lib/
│   │   └── utils.ts              # UI formatters & Tailwind helper
│   └── shims/                    # GSAP & router shims
│
├── backend/                      # All Server-side & Data Layer Code
│   ├── db/
│   │   └── db.ts                 # Persistent JSON database operations
│   ├── services/
│   │   ├── credits.ts            # Credit allocation & redemption logic
│   │   └── cloudinary.ts         # PDF cloud upload & formatting
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   ├── server.ts             # Supabase server client
│   │   ├── middleware.ts         # Auth session middleware
│   │   └── schema.sql            # Database schema & RLS policies
│   └── models/
│       ├── mock-papers.ts        # PaperRecord, PaperRequest, SubjectSuggestion
│       └── subjects-seed.ts      # School & subject taxonomy
│
├── app/                          # Next.js App Router (Routing & API Endpoints)
│   ├── (auth)/                   # /login, /register
│   ├── (dashboard)/              # /dashboard
│   ├── admin/                    # /admin (Protected by rohanjena / 1234554321)
│   ├── browse/                   # /browse
│   ├── leaderboard/              # /leaderboard
│   ├── requests/                 # /requests
│   ├── upload/                   # /upload
│   └── api/                      # Backend API Route Handlers
│       ├── auth/callback/
│       ├── credits/
│       ├── leaderboard/
│       ├── papers/ & papers/[id]/
│       ├── profile/
│       ├── redeem/
│       ├── requests/ & requests/[id]/
│       ├── stats/
│       └── upload/
│
└── tsconfig.json                 # Configured with @/frontend/* and @/backend/*

```
