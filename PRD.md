# PRD – Antigravity
### Video Editor Portfolio Platform — Full Stack Edition
**Version:** 1.0  
**Owner:** Kshitiz Sharma  
**Last Updated:** June 2026  
**Status:** Ready for Development

---

## 1. Product Overview

**Antigravity** is a full-stack, CMS-powered portfolio platform built for premium short-form video editors. It is designed to be a high-conversion client acquisition machine — not just a portfolio. The platform combines a cinematic dark-mode frontend with a headless backend, secure admin CMS, video delivery pipeline, and analytics layer.

### 1.1 Product Vision

> "The best video editor portfolio on the internet. Every scroll should feel like a trailer."

### 1.2 Core Objectives

| # | Objective |
|---|-----------|
| 1 | Showcase 8–24 video projects with zero friction |
| 2 | Convert visitors into Instagram DM inquiries |
| 3 | Let the editor manage content without touching code |
| 4 | Load in under 2 seconds on mobile |
| 5 | Scale to agency-level with multi-editor support (V2) |

---

## 2. Tech Stack

### 2.1 Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Animation | GSAP 3 + ScrollTrigger |
| Video Player | Video.js (custom skinned) |
| Icons | Lucide React |
| Fonts | Clash Display (headings) + Cabinet Grotesk (body) |
| Deployment | Vercel |

### 2.2 Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth (JWT) |
| File Storage | Cloudflare R2 (S3-compatible) |
| Video CDN | Cloudflare Stream |
| Caching | Redis (Upstash) |
| Deployment | Railway |

### 2.3 Infrastructure

```
User Browser
    │
    ▼
Vercel Edge (Next.js SSR/SSG)
    │
    ├──► Cloudflare Stream (video delivery, HLS adaptive)
    │
    └──► Railway API Server (Express)
              │
              ├──► Supabase PostgreSQL (project data, analytics)
              ├──► Cloudflare R2 (thumbnails, assets)
              └──► Upstash Redis (rate limiting, cache)
```

---

## 3. Database Schema

### 3.1 Tables

#### `users`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
email           TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL
name            TEXT
role            TEXT DEFAULT 'editor'        -- 'editor' | 'admin'
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `projects`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id) ON DELETE CASCADE
title           TEXT NOT NULL
description     TEXT
category        TEXT                          -- 'reel' | 'short' | 'commercial' | 'motion'
cloudflare_video_id   TEXT NOT NULL           -- Cloudflare Stream video UID
thumbnail_url   TEXT NOT NULL                -- R2 public URL
sort_order      INT DEFAULT 0
is_featured     BOOLEAN DEFAULT false
is_published    BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

#### `analytics_events`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
event_type      TEXT NOT NULL               -- 'page_view' | 'video_play' | 'cta_click' | 'modal_open'
project_id      UUID REFERENCES projects(id)
session_id      TEXT
referrer        TEXT
device_type     TEXT                        -- 'mobile' | 'desktop'
country         TEXT
created_at      TIMESTAMPTZ DEFAULT now()
```

#### `site_config`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
key             TEXT UNIQUE NOT NULL
value           TEXT
updated_at      TIMESTAMPTZ DEFAULT now()
```
*Used for: instagram handle, hero tagline, CTA text, SEO meta, etc.*

---

## 4. API Design

**Base URL:** `https://api.antigravity.studio/v1`

All protected routes require: `Authorization: Bearer <jwt_token>`

### 4.1 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | ✗ | Email + password login |
| POST | `/auth/logout` | ✓ | Invalidate session |
| GET | `/auth/me` | ✓ | Get current user |

**POST /auth/login**
```json
Request:  { "email": "kshitiz@example.com", "password": "••••••••" }
Response: { "token": "eyJ...", "user": { "id": "...", "name": "Kshitiz", "role": "editor" } }
```

---

### 4.2 Projects (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | ✗ | List all published projects |
| GET | `/projects/:id` | ✗ | Get single project |

**GET /projects Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Nike Reel Cut",
      "category": "commercial",
      "thumbnail_url": "https://cdn.antigravity.studio/thumbs/nike.jpg",
      "stream_url": "https://videodelivery.net/abc123/manifest/video.m3u8",
      "is_featured": true,
      "sort_order": 1
    }
  ]
}
```

---

### 4.3 Projects (Admin)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/projects` | ✓ | All projects (incl. drafts) |
| POST | `/admin/projects` | ✓ | Create new project |
| PATCH | `/admin/projects/:id` | ✓ | Update project |
| DELETE | `/admin/projects/:id` | ✓ | Delete project |
| POST | `/admin/projects/reorder` | ✓ | Drag-drop reorder |
| POST | `/admin/upload/thumbnail` | ✓ | Upload thumbnail → R2 |
| POST | `/admin/upload/video` | ✓ | Upload video → Cloudflare Stream |

**POST /admin/projects Body:**
```json
{
  "title": "Nike Reel Cut",
  "description": "30s commercial for Nike India",
  "category": "commercial",
  "cloudflare_video_id": "abc123xyz",
  "thumbnail_url": "https://cdn.antigravity.studio/thumbs/nike.jpg",
  "is_featured": true,
  "is_published": false,
  "sort_order": 1
}
```

**POST /admin/upload/video Flow:**
```
Client → POST /admin/upload/video (multipart)
       → Server creates Cloudflare Stream upload URL
       → Returns { upload_url, video_id }
Client → PUT upload_url (direct to Cloudflare Stream)
       → Cloudflare processes, returns playback URL
Client → PATCH /admin/projects/:id { cloudflare_video_id }
```

---

### 4.4 Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/analytics/event` | ✗ | Track frontend event |
| GET | `/admin/analytics/summary` | ✓ | Dashboard stats |
| GET | `/admin/analytics/events` | ✓ | Raw event log |

**POST /analytics/event Body:**
```json
{
  "event_type": "video_play",
  "project_id": "uuid",
  "session_id": "anon-abc123",
  "device_type": "mobile",
  "referrer": "https://instagram.com"
}
```

**GET /admin/analytics/summary Response:**
```json
{
  "total_views": 1482,
  "total_plays": 876,
  "cta_clicks": 143,
  "top_projects": [...],
  "avg_session_sec": 142,
  "top_referrers": [{ "source": "instagram.com", "count": 612 }]
}
```

---

### 4.5 Site Config

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/config` | ✗ | Get public site config |
| PATCH | `/admin/config` | ✓ | Update config values |

**Config Keys:**
```
hero_name, hero_tagline, instagram_handle, cta_text,
cta_subtext, seo_title, seo_description, seo_keywords
```

---

## 5. Frontend Architecture

### 5.1 Pages (App Router)

```
app/
├── page.tsx                  ← Public portfolio (SSG, revalidate: 60s)
├── admin/
│   ├── login/page.tsx        ← Login form
│   ├── dashboard/page.tsx    ← Project list + analytics
│   ├── projects/
│   │   ├── new/page.tsx      ← Upload + create form
│   │   └── [id]/edit/page.tsx ← Edit project
│   └── settings/page.tsx     ← Site config editor
└── api/
    └── revalidate/route.ts   ← On-demand ISR revalidation
```

### 5.2 Component Tree

```
<RootLayout>
  <PublicPage>
    <HeroSection />              ← Name, tagline, social icons, CTA
    <PortfolioGrid>
      <VideoCard />              ← Autoplay, muted, looping preview
      <VideoCard />
      ...×8
    </PortfolioGrid>
    <VideoModal />               ← Fullscreen player modal
    <CTASection />               ← DM CTA, Instagram redirect
  </PublicPage>

  <AdminLayout>                  ← Protected, JWT-gated
    <Sidebar />
    <Dashboard />
    <ProjectForm />
    <VideoUploader />
    <AnalyticsDashboard />
    <SiteConfigEditor />
  </AdminLayout>
</RootLayout>
```

---

## 6. Frontend Sections — Detailed Spec

### 6.1 Hero Section

**Layout:** Full viewport height, content vertically centered

**Elements:**
- Name: `Kshitiz Sharma` — Clash Display, 96px, white
- Tagline: `Premium Video Editor & Motion Designer` — Cabinet Grotesk, 20px, `#888`
- Social Row: Instagram, YouTube, LinkedIn, Email — 24px icons, 16px gap, hover lifts + glows
- CTA Button: `View My Work` — outlined, white border, hover fills white, text inverts, 4px scale

**Animation Sequence (GSAP Timeline):**
```
t=0.0s  → Background noise grain fades in
t=0.3s  → Name slides up from y:40 + fades in, duration: 0.8s
t=0.7s  → Tagline slides up, duration: 0.6s
t=1.0s  → Social icons stagger in (0.1s each), duration: 0.4s
t=1.4s  → CTA button pops in with slight bounce
```

---

### 6.2 Portfolio Grid

**Desktop:** 4 columns × 2 rows = 8 cards  
**Mobile:** 2 columns × 4 rows

**Card Spec:**
- Aspect ratio: `9/16` (vertical Reels format)
- Border radius: 12px
- Video: `autoplay muted loop playsInline`, no controls
- Overlay: gradient bottom fade, project title on hover
- Hover: `scale(1.03)`, `brightness(1.15)`, neon-blue box-shadow `0 0 24px rgba(0,191,255,0.4)`

**ScrollTrigger Animation:**
- Trigger: when grid enters viewport (threshold: 20%)
- Effect: each card fades in + slides up 40px, stagger 0.1s
- Easing: `power3.out`

**Lazy Loading:**
- Videos use `IntersectionObserver` — only load src when card is within 200px of viewport

---

### 6.3 Video Modal

**Trigger:** Click any VideoCard

**Animation:**
- GSAP `fromTo` — expands from card's bounding rect to fullscreen
- `clipPath` or `transform: scale()` morph, duration 0.45s, ease `expo.out`
- Background overlay fades to `rgba(0,0,0,0.92)`

**Player:**
- Video.js with custom dark skin
- HLS stream from Cloudflare Stream
- Controls: play/pause, volume, fullscreen, progress bar
- Unmuted, HD (adaptive bitrate via HLS)

**Close:**
- X button (top-right)
- ESC key listener
- Click backdrop
- Reverse expansion animation on close

---

### 6.4 CTA Section

**Layout:** Full-width, 100vh height, centered

**Content:**
```
[Line 1] "Want your content to look smoother,
          more premium, and impossible to ignore?"

[Line 2] "DM @kshitizedits on Instagram."

[Button] "Let's Work Together →"
```

**Animation:**
- Character-by-character reveal on Line 1 (GSAP SplitText)
- Line 2 fades up with 0.3s delay
- Button slides up last

**Button Action:** Opens `https://instagram.com/[handle]` in new tab

---

## 7. Admin CMS — Detailed Spec

### 7.1 Login Page

- Email + password form
- JWT stored in `httpOnly` cookie
- Redirect → `/admin/dashboard` on success
- Rate limited: 5 attempts / 15 min per IP

### 7.2 Dashboard

**Stats Bar (top):**
- Total Views, Total Video Plays, CTA Clicks, Avg Session Time

**Project Table:**
| Thumbnail | Title | Category | Status | Plays | Actions |
|-----------|-------|----------|--------|-------|---------|
| (preview) | Nike Reel | commercial | Published | 312 | Edit / Delete |

- Toggle Published/Draft inline
- Drag-and-drop row reorder → calls `/admin/projects/reorder`

### 7.3 Project Upload Form

**Fields:**
```
Title*              [text input]
Category*           [dropdown: reel / short / commercial / motion]
Description         [textarea]
Thumbnail*          [image upload → R2, max 2MB, JPG/WebP]
Video File*         [video upload → Cloudflare Stream, max 500MB, MP4]
Featured            [toggle]
Published           [toggle]
```

**Video Upload UX:**
1. User selects MP4
2. Frontend calls `POST /admin/upload/video` → gets Cloudflare Stream upload URL
3. Frontend uploads directly to Cloudflare (progress bar shown)
4. On completion, `cloudflare_video_id` saved to project record
5. Processing status polled until `ready`

### 7.4 Analytics Dashboard

**Charts:**
- Views over time (line chart, last 30 days)
- Plays per project (horizontal bar chart)
- Device split (mobile vs desktop, donut)
- Top referrers (table)

**Library:** Recharts (client component)

### 7.5 Site Config Editor

Key-value form for:
- Hero name, tagline
- Instagram handle
- CTA text, sub-text
- SEO title, description, keywords

Save → `PATCH /admin/config` → triggers ISR revalidation

---

## 8. Video Delivery Pipeline

```
Admin uploads MP4
       │
       ▼
Cloudflare Stream
  ├── Transcodes to HLS (adaptive bitrate)
  ├── Generates thumbnail (or uses custom)
  ├── Assigns video_id + signed playback URL
  └── Serves via global CDN (edge nodes)
       │
       ▼
Frontend fetches HLS manifest
  └── Video.js plays adaptive stream
```

**Why Cloudflare Stream:**
- Automatic transcoding (360p → 1080p adaptive)
- Global edge delivery
- Per-minute pricing (not per GB)
- No egress cost from Vercel

---

## 9. Security

| Concern | Solution |
|---------|----------|
| Admin auth | Supabase JWT, `httpOnly` cookies |
| API rate limiting | Upstash Redis + sliding window |
| File upload validation | MIME type check + max size server-side |
| SQL injection | Prisma parameterized queries |
| XSS | Next.js default escaping + CSP headers |
| CORS | Whitelist only `antigravity.studio` origin |
| Secrets | Railway env vars + Vercel env vars |

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 1.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| TTI | < 2s |
| Lighthouse Score | > 90 |
| Video load to first frame | < 800ms |

**Optimization Techniques:**
- Next.js ISR (revalidate 60s) for portfolio page
- `next/image` for all thumbnails (WebP, lazy)
- Videos loaded via IntersectionObserver
- GSAP loaded async, animations deferred post-LCP
- Redis cache on `/projects` API (TTL: 60s)
- Cloudflare R2 + CDN for all static assets

---

## 11. SEO

**Meta Tags (per page):**
```html
<title>Kshitiz Sharma — Premium Video Editor & Motion Designer</title>
<meta name="description" content="Short-form video editing for brands, creators, and agencies. Reels, Shorts, TikTok, Commercials." />
<meta name="keywords" content="video editor, reel editor, motion designer, short form content editor, instagram reels editor" />
<meta property="og:image" content="/og-cover.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

**Schema.org JSON-LD:**
```json
{
  "@type": "Person",
  "name": "Kshitiz Sharma",
  "jobTitle": "Video Editor & Motion Designer",
  "url": "https://antigravity.studio"
}
```

---

## 12. Deployment

### Frontend (Vercel)

```
vercel.json:
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### Backend (Railway)

```
Dockerfile:
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --production
CMD ["node", "src/index.js"]
```

**Environment Variables:**

```env
# Supabase
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_STREAM_API_TOKEN=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=antigravity-assets
R2_PUBLIC_URL=https://cdn.antigravity.studio

# Redis
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...

# Auth
JWT_SECRET=...
ALLOWED_ORIGIN=https://antigravity.studio
```

---

## 13. Project Folder Structure

```
antigravity/
├── frontend/                        ← Next.js App
│   ├── app/
│   │   ├── page.tsx
│   │   ├── admin/
│   │   └── api/revalidate/
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── PortfolioGrid.tsx
│   │   ├── VideoCard.tsx
│   │   ├── VideoModal.tsx
│   │   ├── CTASection.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── ProjectForm.tsx
│   │       ├── VideoUploader.tsx
│   │       └── AnalyticsCharts.tsx
│   ├── lib/
│   │   ├── api.ts                   ← API client
│   │   ├── analytics.ts             ← Event tracker
│   │   └── gsap.ts                  ← Animation helpers
│   └── public/
│       └── og-cover.jpg
│
└── backend/                         ← Express API
    ├── src/
    │   ├── index.ts                 ← Server entry
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── projects.ts
    │   │   ├── admin.ts
    │   │   ├── analytics.ts
    │   │   └── config.ts
    │   ├── middleware/
    │   │   ├── auth.ts              ← JWT verify
    │   │   ├── rateLimit.ts         ← Redis rate limiter
    │   │   └── validate.ts          ← Zod schemas
    │   ├── services/
    │   │   ├── cloudflareStream.ts
    │   │   ├── r2Storage.ts
    │   │   └── cache.ts
    │   └── prisma/
    │       └── schema.prisma
    └── Dockerfile
```

---

## 14. V2 Roadmap

| Feature | Priority | Notes |
|---------|----------|-------|
| Client Testimonials | High | Star rating + text, admin-managed |
| Before/After Slider | High | Side-by-side video comparison |
| Pricing Packages | Medium | 3-tier card layout |
| Booking Form | Medium | Calendly embed or custom + email notify |
| Case Studies | Medium | Long-form project breakdown pages |
| Multi-Editor Mode | Low | Multiple editor profiles under one domain |
| Analytics Export | Low | CSV download of events |
| Password-Protected Projects | Medium | For client-only previews |

---

## 15. Success Metrics

| Metric | Target |
|--------|--------|
| Avg session duration | > 2 min |
| Portfolio section scroll-through rate | > 70% |
| Video play rate (visitors who play ≥1 video) | > 60% |
| CTA section reach rate | > 40% |
| Instagram CTA click-through rate | > 15% |
| Client inquiry conversion | > 5% of CTA clicks |

---

*PRD prepared for Antigravity v1.0 — Full-stack video editor portfolio platform.*  
*Ready to begin sprint planning and component breakdown.*
