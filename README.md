# Nilaksh Jaiswal — Portfolio + Admin CMS

A premium developer portfolio combining a cinematic video hero (mouse-scrub
control, typewriter intro) with a 3D-creator-style layout (silver gradient
headings, scrolling marquee, sticky scaling project cards). All public
content is editable through a private `/admin` panel, backed by a real
Express + MongoDB API — nothing on the public site is hardcoded.

```
portfolio/
  frontend/   React + TypeScript + Vite + Tailwind + Framer Motion
  backend/    Express + TypeScript + Mongoose + Cloudinary
```

---

## ⚠️ Important: this was built without a network connection

This project was generated in a sandboxed environment whose outbound network
access did not include the npm registry (every `npm install` attempt failed
with DNS/connection errors enforced by the environment's egress policy). That
means:

- **`npm install` was never run** in either `frontend/` or `backend/` — no
  `node_modules`, no `package-lock.json`.
- **`npm run build` / `tsc` were never run.** The code has been written
  carefully and manually cross-checked (import paths, exported names, API
  endpoint paths between frontend and backend, brace/paren balance across
  every file), but it has **not** been compiled or executed.
- **MongoDB and Cloudinary were never connected** — there was no live
  database or image host available either.

**You must run the install and build yourself** (see below) before trusting
this as "working" software. I'd expect minor issues at most — a missed
import, a version-specific API change in one of the pinned dependencies — not
structural problems, but please don't skip the build step.

If you'd rather I fix issues myself, re-run this request in a session where
`npm install` can actually reach the registry (e.g. check your Claude.ai
network/capability settings, as I noted when this limitation first came up),
and I can install, build, and iterate for real.

---

## 1. Local development

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD at minimum
npm run create-admin   # one-time: creates your administrator account
npm run dev            # starts the API on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env: VITE_API_URL=http://localhost:5000
npm run dev             # starts the site on http://localhost:5173
```

Visit `http://localhost:5173` for the public site and
`http://localhost:5173/admin/login` for the admin panel.

### Type checking & production builds

```bash
# backend
cd backend && npm run typecheck && npm run build

# frontend
cd frontend && npm run typecheck && npm run build
```

---

## 2. MongoDB configuration

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
(or run MongoDB locally) and put the connection string in
`backend/.env` as `MONGODB_URI`. The database starts **completely empty** —
no seed data, no example projects. You add everything through `/admin`.

## 3. Image uploads (Cloudinary)

Create a free account at [cloudinary.com](https://cloudinary.com), then copy
your Cloud Name, API Key and API Secret into `backend/.env`
(`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
Without these, the upload endpoint returns a clear 503 error instead of
silently failing — you can still paste raw image URLs into any image field
in the admin panel as a fallback.

## 4. First administrator setup

```bash
cd backend
# in .env: set ADMIN_EMAIL and ADMIN_PASSWORD (10+ characters)
npm run create-admin
```

This script only runs once — it refuses to create a second administrator if
one already exists, and it never seeds any portfolio content. After setup,
consider removing `ADMIN_PASSWORD` from `.env`. Log in at `/admin/login`.

## 5. Using the admin panel

1. **Settings** — site name, nav labels, hero heading/typewriter text,
   background video URL, hero action buttons, marquee images, footer text,
   and section visibility toggles.
2. **About** — heading, intro, biography, profile image, resume URL.
3. **Skills** — add/edit/delete, grouped by category, toggle visibility.
4. **Services** — the five "what I build" items, toggle visibility.
5. **Projects** — title, category, description, tech tags, GitHub/live
   links, thumbnail + screenshots (upload or paste a URL). New projects are
   created as **drafts**; click the globe icon to publish.
6. **Experience** — work history entries with dates and tags.
7. **Contact** — email, socials, and an optional real contact form (needs
   SMTP configured in the backend `.env` to actually send mail — it will
   never report "sent" without actually sending).

**Draft vs. published:** About, Contact and Settings use a draft/publish
model — click **Save draft** to keep editing without affecting the live
site, then **Publish** when ready. Skills/Services/Experience use a simple
visibility toggle; Projects use an explicit draft/published status.

## 6. Deployment

- **Frontend**: any static host (Vercel, Netlify, Cloudflare Pages). Set
  `VITE_API_URL` to your deployed backend's URL at build time.
- **Backend**: needs a platform that runs a persistent Node process — Render,
  Railway, Fly.io, or a VM — **not** a static/serverless-only host. Set all
  variables from `backend/.env.example`, especially `CORS_ORIGIN` (your
  frontend's deployed URL) and `COOKIE_SECURE=true` once served over HTTPS.
  A health check is available at `GET /api/health`.

### Deploying the backend to Vercel (optional)

The backend can run as a Vercel serverless function through `backend/api/index.ts`.
Create a **separate** Vercel project for it:

- **Root Directory:** `backend` (not the repository root)
- **Framework Preset:** Other (`backend/vercel.json` sets `framework: null`, so Vercel
  does not auto-detect `src/app.ts` as an Express entry point)
- **Build Command:** leave empty. Vercel compiles `api/index.ts` itself. A build
  command makes Vercel expect a static output folder and fails with `STATIC_BUILD_NO_OUT_DIR`.
- **Output Directory:** leave empty · **Install Command:** `npm install`
- **Environment Variables:** `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
  `CORS_ORIGIN` (your frontend URL), `COOKIE_SECURE=true`, and the `CLOUDINARY_*`
  and `SMTP_*` values if used. Do not set `PORT`. Set these in the Vercel dashboard only,
  never in committed files.
- Test with `GET /api/health`. `GET /` returns a 404 JSON response by design.

Deploy the frontend as a second project with **Root Directory** `frontend`, and set
`VITE_API_URL` to the backend project's URL.

## 7. Customization quick-reference

| What | Where |
|---|---|
| Name, hero heading, typewriter text, nav labels | `/admin/settings` |
| Email, GitHub/LinkedIn links | `/admin/contact` |
| Project descriptions, URLs, screenshots | `/admin/projects` |
| Skills list | `/admin/skills` |
| Resume path | `/admin/about` → Resume/CV URL |
| Background video | `/admin/settings` → Background video URL |
| Colors / fonts (code-level) | `frontend/src/styles/index.css` (`.hero-heading` gradient), `frontend/tailwind.config.js` |
| GitHub profile used as fallback link | `https://github.com/NilakshJaiswal` (set via `/admin/contact`, not hardcoded) |

## 8. What was NOT fabricated

Per the brief, nothing in this codebase hardcodes personal content:

- No seed scripts or example projects/skills/experience in the database.
- No invented email, phone number, or live-demo/GitHub URLs for individual
  projects — those fields stay empty (and their buttons hidden) until you
  add real ones in `/admin`.
- The hero portrait is an original abstract gradient composition (CSS/SVG,
  not a photo), since no personal photo was supplied — swap it for a real
  photo via a small code change in `HeroSection.tsx`, or extend `/admin` to
  manage it if you'd like that configurable too.
- Marquee tiles not marked "My work" in `/admin/settings` are labeled
  "Inspiration reference" on the public site.

## 9. Checks actually run in this session

- ✅ Directory/brace/paren balance verified across every `.ts`/`.tsx` file.
- ✅ Every import path cross-checked against the file it points to.
- ✅ Every component/route export name cross-checked against its imports.
- ✅ Every frontend API call path cross-checked against the matching backend
  route registration.
- ❌ `npm install` — blocked (no npm registry access in this session).
- ❌ `tsc` / `vite build` / `npm run build` — not run (requires installed
  dependencies).
- ❌ Runtime testing (login flow, CRUD, image upload, publish workflow) —
  not run (requires a live MongoDB + the app actually running).

Run the commands in section 1 to perform the checks that couldn't be run
here, and let me know what comes up if anything fails to compile — most
likely candidates for a first pass are a stray TypeScript type mismatch or a
dependency version needing a minor adjustment.
