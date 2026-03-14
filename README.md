# 🖥️ Developer Portfolio — Full-Stack

> VS Code-themed developer portfolio — **Next.js 14** frontend + **Flask REST API** backend.  
> Clean separation of concerns, production-ready configuration, zero `.bat` files.

---

## 📁 Folder Structure

```
portfolio-root/
│
├── app/                        # Next.js 14 App Router pages
│   ├── layout.tsx              # Root layout (fonts, global CSS)
│   ├── page.tsx                # Main portfolio page
│   └── admin/                  # Admin dashboard
│       └── page.tsx
│
├── components/                 # Reusable React components
│   ├── HeroSection.tsx
│   ├── SkillsSection.tsx
│   ├── ProjectsSection.tsx
│   ├── BlogSection.tsx
│   ├── ContactSection.tsx
│   └── admin/                  # Admin-specific components
│
├── lib/                        # Frontend utilities / API clients
│   ├── api.ts                  # Public portfolio API client
│   ├── admin-api.ts            # Admin API client
│   ├── admin-types.ts          # TypeScript interfaces
│   ├── toast.ts                # Toast notification helper
│   └── validation.ts           # Form validation utilities
│
├── styles/                     # Global CSS stylesheets
│
├── public/                     # Static assets (favicon, images)
│
├── backend/                    # ── Flask REST API ──────────────────────
│   ├── app.py                  # Application factory (create_app)
│   ├── wsgi.py                 # WSGI / dev entry point
│   ├── config.py               # All config from env vars
│   ├── requirements.txt        # Python dependencies
│   ├── render.yaml             # Render.com deployment blueprint
│   ├── .env.example            # Safe template — commit this
│   ├── .env                    # Real secrets — NEVER commit
│   ├── .gitignore              # Backend-specific ignores
│   │
│   ├── routes/
│   │   ├── api.py              # Public API endpoints
│   │   └── admin.py            # Admin-protected endpoints
│   │
│   ├── models/
│   │   ├── database.py         # SQLite ORM / data layer
│   │   ├── admin.py            # Admin model / auth
│   │   └── portfolio_data.py   # Default seed data
│   │
│   └── venv/                   # Virtual environment (git-ignored)
│
├── .env.local.example          # Frontend env template — commit this
├── .env.local                  # Real frontend env — git-ignored
├── .gitignore                  # Frontend ignores
├── package.json                # npm scripts for frontend + orchestration
├── vercel.json                 # Vercel deployment config
├── next.config.js              # Next.js config
└── tsconfig.json               # TypeScript config
```

---

## ⚡ Quick Start — Development

### 1. Clone & Install Frontend

```bash
git clone https://github.com/your-username/your-portfolio.git
cd your-portfolio
npm install
```

### 2. Configure Frontend Environment

```bash
cp .env.local.example .env.local
# .env.local is already set to http://localhost:5000/api — no changes needed for local dev
```

### 3. Set Up Python Backend

```powershell
# --- Windows (PowerShell) ---
cd backend
python -m venv venv                              # create virtual env
venv\Scripts\Activate.ps1                        # activate it
venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env                           # then edit .env
cd ..
```

```bash
# --- macOS / Linux ---
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                             # then edit .env
cd ..
```

### 4. Start Both Servers

**Option A — One command (recommended):**

```powershell
# From the project root — backend venv must be activated first:
# Open a terminal, run: backend\venv\Scripts\Activate.ps1
npm run dev:all
```

This uses `concurrently` to start both Next.js (port 3000) and Flask (port 5000) in a single terminal with colour-coded output.

> **Note (Windows PowerShell):** PowerShell does **not** support `&&` between commands.  
> Always run commands on **separate lines** or use `;` as separator.

**Option B — Two separate terminals:**

```powershell
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend
backend\venv\Scripts\Activate.ps1
npm run backend:dev
```

### 5. Open in Browser

| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:3000      |
| Backend API| http://localhost:5000      |
| API Health | http://localhost:5000/api/health |
| Admin Panel| http://localhost:3000/admin |

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/api/health`               | Health check                 |
| GET    | `/api/personal-info`        | Personal information         |
| GET    | `/api/skills`               | All skills by category       |
| GET    | `/api/skills/<category>`    | Skills by specific category  |
| GET    | `/api/projects`             | All projects                 |
| GET    | `/api/projects?featured=true` | Featured projects only     |
| GET    | `/api/projects/<id>`        | Single project               |
| GET    | `/api/experience`           | Work experience              |
| GET    | `/api/education`            | Education history            |
| GET    | `/api/certifications`       | Certifications               |
| GET    | `/api/achievements`         | Stats & achievements         |
| GET    | `/api/testimonials`         | Testimonials                 |
| GET    | `/api/blog`                 | Blog posts                   |
| GET    | `/api/stats`                | Aggregate portfolio stats    |
| POST   | `/api/contact`              | Submit contact form          |
| POST   | `/api/admin/login`          | Admin login (returns JWT)    |
| GET    | `/api/admin/dashboard`      | Admin dashboard data (JWT)   |

---

## 📝 Sample API Route (Flask)

```python
# backend/routes/api.py

@api.route("/projects", methods=["GET"])
def get_projects():
    """Return all projects, optionally filtered to featured only."""
    projects = db.get_projects()
    featured_only = request.args.get("featured", "false").lower() == "true"
    if featured_only:
        projects = [p for p in projects if p.get("featured", False)]
    return jsonify(projects)
```

---

## 📡 Sample React API Call (Next.js / TypeScript)

```typescript
// lib/api.ts — already configured; use like this in any component:

import { portfolioAPI } from "@/lib/api";

// Inside a React Server Component or Client Component with useEffect:
const projects = await portfolioAPI.getProjects(/* featured= */ true);

// Or with React hooks:
const [projects, setProjects] = useState([]);
useEffect(() => {
    portfolioAPI.getProjects().then(setProjects).catch(console.error);
}, []);
```

---

## 🚀 Production Deployment

### Frontend → Vercel (recommended)

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Set the environment variable in the Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL = https://your-flask-backend.onrender.com/api
   ```
4. Click **Deploy** — Vercel auto-detects Next.js and builds it.

### Backend → Render (recommended)

1. Push your repo to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your repo and set the **Root Directory** to `backend`.
4. Use these settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
5. Add environment variables in the Render dashboard (see `backend/.env.example`).
6. Copy the generated Render URL and update `NEXT_PUBLIC_API_URL` in Vercel + `CORS_ORIGINS` in Render.

### Alternative Backend Platforms

| Platform  | Notes                                              |
|-----------|----------------------------------------------------|
| Railway   | Similar to Render; good free tier                  |
| Fly.io    | Edge deployment; add a `fly.toml` config file      |
| Heroku    | Paid only; add a `Procfile`: `web: gunicorn wsgi:app` |

---

## 🔐 Environment Variables Reference

### Frontend (`.env.local`)

| Variable              | Description                       | Default                         |
|-----------------------|-----------------------------------|---------------------------------|
| `NEXT_PUBLIC_API_URL` | Flask backend API base URL        | `http://localhost:5000/api`     |

### Backend (`backend/.env`)

| Variable              | Description                          | Required |
|-----------------------|--------------------------------------|----------|
| `SECRET_KEY`          | Flask session secret                 | ✅       |
| `JWT_SECRET_KEY`      | JWT signing key                      | ✅       |
| `FLASK_ENV`           | `development` or `production`        | ✅       |
| `PORT`                | Server port (set by Render auto)     | ➖       |
| `CORS_ORIGINS`        | Comma-separated allowed origins      | ✅       |
| `ADMIN_USERNAME`      | Admin panel username                 | ✅       |
| `ADMIN_PASSWORD`      | Admin panel password                 | ✅       |
| `ADMIN_EMAIL`         | Admin email                          | ✅       |
| `MAIL_SERVER`         | SMTP server                          | ➖       |
| `MAIL_PORT`           | SMTP port (default: 587)             | ➖       |
| `MAIL_USE_TLS`        | Enable TLS (default: true)           | ➖       |
| `MAIL_USERNAME`       | SMTP username / email                | ➖       |
| `MAIL_PASSWORD`       | SMTP App Password                    | ➖       |
| `MAIL_DEFAULT_SENDER` | From address for contact emails      | ➖       |

---

## 🛠️ Available npm Scripts

| Script               | Description                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Start Next.js dev server (port 3000)             |
| `npm run build`      | Build Next.js for production                      |
| `npm run start`      | Start Next.js production server                   |
| `npm run lint`       | Run ESLint                                        |
| `npm run type-check` | TypeScript type checking (no emit)                |
| `npm run backend:setup` | Install Python backend dependencies           |
| `npm run backend:dev`   | Start Flask dev server (port 5000)            |
| `npm run dev:all`    | Start both servers concurrently (recommended)    |

---

## 🏗️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | Next.js 14 (App Router) |
| UI Library | React 18                |
| Styling    | Vanilla CSS             |
| Animation  | Framer Motion           |
| Icons      | Lucide React            |
| Language   | TypeScript              |
| Backend    | Flask 2.3 (Python)      |
| Auth       | Flask-JWT (PyJWT)       |
| Email      | Flask-Mail              |
| CORS       | Flask-CORS              |
| Database   | SQLite (local dev)      |
| Server     | Gunicorn (production)   |
| Frontend Deploy | Vercel            |
| Backend Deploy  | Render            |

---

## 📄 License

MIT