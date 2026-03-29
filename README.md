# 🖥️ Developer Portfolio — Full-Stack

> VS Code-themed developer portfolio — **Next.js 14** frontend + **Flask REST API** backend.  
> Clean monorepo structure with `frontend/` and `backend/` fully separated.

---

## 📁 Folder Structure

```
portfolio-root/
│
├── frontend/                   # ── Next.js 14 App ──────────────────────
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, global CSS)
│   │   ├── page.tsx            # Main portfolio page
│   │   └── admin/              # Admin dashboard
│   │
│   ├── components/             # Reusable React components
│   │   ├── HeroSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── BlogSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── admin/              # Admin-specific components
│   │
│   ├── lib/                    # API clients & utilities
│   │   ├── api.ts              # Public portfolio API client
│   │   ├── admin-api.ts        # Admin API client
│   │   ├── admin-types.ts      # TypeScript interfaces
│   │   ├── toast.ts            # Toast notification helper
│   │   └── validation.ts       # Form validation utilities
│   │
│   ├── styles/                 # Global CSS stylesheets
│   ├── public/                 # Static assets (favicon, images)
│   ├── .env.local              # Frontend env vars (git-ignored)
│   ├── next.config.js          # Next.js config
│   ├── tsconfig.json           # TypeScript config
│   └── package.json            # npm scripts
│
├── backend/                    # ── Flask REST API ──────────────────────
│   ├── app.py                  # Application factory (create_app)
│   ├── wsgi.py                 # WSGI / dev entry point
│   ├── config.py               # All config from env vars
│   ├── requirements.txt        # Python dependencies
│   ├── render.yaml             # Render.com deployment blueprint
│   ├── .env.example            # Safe template — commit this
│   ├── .env                    # Real secrets — NEVER commit
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
├── documentation/              # API reference & architecture docs
├── .gitignore
├── README.md
└── run-project.md              # Quick run guide
```

---

## ⚡ Quick Start — Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-portfolio.git
cd your-portfolio
```

### 2. Set up the Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # already points to http://localhost:5000/api
```

### 3. Set up the Backend

```powershell
# Windows (PowerShell)
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env             # then edit .env with your secrets
cd ..
```

```bash
# macOS / Linux
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env               # then edit .env with your secrets
cd ..
```

### 4. Start Both Servers

**Option A — One command (recommended):**

```powershell
cd frontend
npm run dev:all
```

**Option B — Two separate terminals:**

```powershell
# Terminal 1 — Frontend
cd frontend
npm run dev

# Terminal 2 — Backend
cd backend
venv\Scripts\Activate.ps1
python run.py
```

### 5. Open in Browser

| Service     | URL                              |
|-------------|----------------------------------|
| Frontend    | http://localhost:3000            |
| Backend API | http://localhost:5000            |
| API Health  | http://localhost:5000/api/health |
| Admin Panel | http://localhost:3000/admin      |

---

## 🔌 API Endpoints

| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| GET    | `/api/health`                 | Health check               |
| GET    | `/api/personal-info`          | Personal information       |
| GET    | `/api/skills`                 | All skills by category     |
| GET    | `/api/projects`               | All projects               |
| GET    | `/api/projects?featured=true` | Featured projects only     |
| GET    | `/api/experience`             | Work experience            |
| GET    | `/api/education`              | Education history          |
| GET    | `/api/certifications`         | Certifications             |
| GET    | `/api/achievements`           | Stats & achievements       |
| GET    | `/api/testimonials`           | Testimonials               |
| GET    | `/api/blog`                   | Blog posts                 |
| GET    | `/api/stats`                  | Aggregate portfolio stats  |
| POST   | `/api/contact`                | Submit contact form        |
| POST   | `/api/admin/login`            | Admin login (returns JWT)  |
| GET    | `/api/admin/dashboard`        | Admin dashboard data (JWT) |

---

## 📡 Sample API Usage

```python
# backend/routes/api.py
@api.route("/projects", methods=["GET"])
def get_projects():
    projects = db.get_projects()
    featured_only = request.args.get("featured", "false").lower() == "true"
    if featured_only:
        projects = [p for p in projects if p.get("featured", False)]
    return jsonify(projects)
```

```typescript
// frontend/lib/api.ts — use in any component:
import { portfolioAPI } from "@/lib/api";

const projects = await portfolioAPI.getProjects(/* featured= */ true);
```

---

## 🚀 Production Deployment

### Frontend → Vercel

1. Push repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-flask-backend.onrender.com/api
   ```
5. Deploy.

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**.
2. Connect repo, set **Root Directory** to `backend`.
3. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
4. Add env vars from `backend/.env.example`.
5. Copy the Render URL → update `NEXT_PUBLIC_API_URL` in Vercel and `CORS_ORIGINS` in Render.

---

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)

| Variable              | Description                | Default                     |
|-----------------------|----------------------------|-----------------------------|
| `NEXT_PUBLIC_API_URL` | Flask backend API base URL | `http://localhost:5000/api` |

### Backend (`backend/.env`)

| Variable              | Description                     | Required |
|-----------------------|---------------------------------|----------|
| `SECRET_KEY`          | Flask session secret            | ✅       |
| `JWT_SECRET_KEY`      | JWT signing key                 | ✅       |
| `FLASK_ENV`           | `development` or `production`   | ✅       |
| `CORS_ORIGINS`        | Comma-separated allowed origins | ✅       |
| `ADMIN_USERNAME`      | Admin panel username            | ✅       |
| `ADMIN_PASSWORD`      | Admin panel password            | ✅       |
| `ADMIN_EMAIL`         | Admin email                     | ✅       |
| `MAIL_SERVER`         | SMTP server                     | ➖       |
| `MAIL_PORT`           | SMTP port (default: 587)        | ➖       |
| `MAIL_USERNAME`       | SMTP username / email           | ➖       |
| `MAIL_PASSWORD`       | SMTP App Password               | ➖       |
| `MAIL_DEFAULT_SENDER` | From address for contact emails | ➖       |

---

## 📜 npm Scripts

Run these from the `frontend/` folder:

| Script                  | Description                                   |
|-------------------------|-----------------------------------------------|
| `npm run dev`           | Start Next.js dev server (port 3000)          |
| `npm run build`         | Build Next.js for production                  |
| `npm run start`         | Start Next.js production server               |
| `npm run lint`          | Run ESLint                                    |
| `npm run type-check`    | TypeScript type checking                      |
| `npm run backend:setup` | Install Python backend dependencies           |
| `npm run backend:dev`   | Start Flask dev server (port 5000)            |
| `npm run dev:all`       | Start both servers concurrently (recommended) |

---

## 🏗️ Tech Stack

| Layer           | Technology              |
|-----------------|-------------------------|
| Frontend        | Next.js 14 (App Router) |
| UI Library      | React 18                |
| Styling         | Vanilla CSS             |
| Animation       | Framer Motion           |
| Icons           | Lucide React            |
| Language        | TypeScript              |
| Backend         | Flask 2.3 (Python)      |
| Auth            | PyJWT                   |
| Email           | Flask-Mail              |
| CORS            | Flask-CORS              |
| Database        | SQLite                  |
| Server          | Gunicorn (production)   |
| Frontend Deploy | Vercel                  |
| Backend Deploy  | Render                  |

---

## 📄 License

MIT
