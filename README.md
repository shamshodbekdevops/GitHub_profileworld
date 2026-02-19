# GitHub Profile World

GitHub Profile World is a full-stack web app that turns a GitHub username/profile into a premium interactive 3D city visualization.

## Stack

- Backend: Django + Django REST Framework
- Database: PostgreSQL
- Frontend: Next.js (App Router) + Tailwind CSS + React Three Fiber (Three.js)

## Features (MVP)

- Generate world from `username` or `github_url`
- Data mapping:
  - repo -> building
  - commits -> forest density
  - stars -> glowing particles
  - languages -> district colors
  - followers/following -> population metrics
- Interactive world viewer:
  - orbit/zoom controls
  - click building to open repo details
  - language filter + sort + search
  - forest density toggle
  - reduced motion mode
- Public share page:
  - read-only summary
  - copy link
  - downloadable poster SVG
- Caching and rate-limit fallback behavior

## Project Structure

- `backend/` Django + DRF API
- `frontend/` Next.js app

## Backend Setup

1. Create Python environment and install deps:
   - `cd backend`
   - `python -m venv .venv`
   - `.\\.venv\\Scripts\\activate`
   - `pip install -r requirements.txt`
2. Copy env template:
   - `copy .env.example .env`
3. Run migrations:
   - `python manage.py migrate`
4. Start server:
   - `python manage.py runserver 127.0.0.1:8000`

### Backend API

- `POST /api/world/generate`
- `GET /api/world/{id}`
- `GET /api/world/{id}/share`

## Frontend Setup

1. Install deps:
   - `cd frontend`
   - `npm install`
2. Copy env template:
   - `copy .env.example .env.local`
3. Start dev server:
   - `npm run dev`

App runs on `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env.example`)

- `DJANGO_DEBUG`
- `DJANGO_SECRET_KEY`
- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `GITHUB_TOKEN`
- `WORLD_TTL_HOURS`
- `API_ANON_THROTTLE`
- `USE_SQLITE` (optional local fallback)

### Frontend (`frontend/.env.example`)

- `NEXT_PUBLIC_API_BASE`

## Notes

- If GitHub API rate limit is hit, generation falls back to latest cached world (if available).
- Default DB target is PostgreSQL. Set `USE_SQLITE=1` for quick local testing.
- For production, use Redis cache backend and background jobs for heavy generation.
