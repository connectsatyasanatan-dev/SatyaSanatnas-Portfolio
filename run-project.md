# 🚀 Project Run Guide

Is project ko start karne ke liye niche diye gaye steps follow karein.

## 🛠️ Prerequisites
- **Node.js**: v18 or above
- **Python**: v3.10 or above

---

## ⚡ Quick Start (Recommended)

Agar aapne setup pehle se kar liya hai, toh frontend folder se dono servers ek saath start karein:

```powershell
cd frontend
npm run dev:all
```
*Yeh command Next.js aur Flask dono servers ko ek saath parallel terminals mein run karegi.*

---

## 📂 Manual Start (Step-by-Step)

### 1️⃣ Step 1: Backend Setup & Run

```powershell
# Backend folder mein jayein
cd backend

# Virtual environment activate karein (Windows)
.\venv\Scripts\activate

# Backend run karein
python run.py
```
> Backend defaults to `http://localhost:5000`

### 2️⃣ Step 2: Frontend Setup & Run

Naya terminal open karein aur frontend folder mein:

```powershell
cd frontend

# Dependencies install karein (agar pehli baar hai)
npm install

# Frontend run karein
npm run dev
```
> Frontend defaults to `http://localhost:3000`

---

## 📝 Environment Variables

Project start karne se pehle check karein ki `.env` files ready hain:
- **Frontend**: `frontend/.env.local`
- **Backend**: `backend/.env`

> [!TIP]
> Agar files nahi hain, toh `.env.local.example` aur `backend/.env.example` ko copy karke naye `.env` files banayein.

---

## 📜 Available NPM Scripts

Ye commands `frontend/` folder se run karein:

| Command | Description |
| :--- | :--- |
| `npm run dev:all` | Frontend + Backend dono start karein |
| `npm run dev` | Sirf frontend start karein |
| `npm run backend:dev` | Sirf backend start karein |
| `npm run backend:setup` | Backend virtual environment aur dependencies setup karein |

---

## 🔐 Admin Panel Access

- **URL:** `http://localhost:3000/admin`
- **Username:** `Admin`
- **Password:** `Admin@123`

> [!WARNING]
> Production mein jaane se pehle `backend/.env` file mein ye credentials zaroor change kar lein.

---

## 🌐 Production Mein Kaise Chalayein?

### 1. Frontend (Next.js)
```powershell
cd frontend
npm run build
npm run start
```

### 2. Backend (Flask)
Production mein `python run.py` ki jagah ek WSGI server use karein:
- **Windows:** `waitress-serve --port=5000 wsgi:app`
- **Linux:** `gunicorn -w 4 -b 0.0.0.0:5000 "wsgi:app"`

### 3. PM2 (Both together in background)
1. Install karein: `npm install pm2 -g`
2. `ecosystem.config.js` banayein aur dono processes add karein.

---

Happy Coding! 🚀
