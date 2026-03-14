# 🚀 Project Run Guide

Is project ko start karne ke liye niche diye gaye steps follow karein.

## 🛠️ Prerequisites
- **Node.js**: (v18 or above recommended)
- **Python**: (v3.10 or above recommended)

---

## ⚡ Quick Start (Recommended)

Agar aapne setup pehle se kar liya hai, toh aap dono (Frontend aur Backend) ek saath start kar sakte hain:

```powershell
npm run dev:all
```
*Yeh command Next.js aur Flask dono servers ko ek saath parallel terminals mein run karegi.*

---

## 📂 Manual Start (Step-by-Step)

Agar aap servers ko alag-alag terminals mein run karna chahte hain:

### 1️⃣ Step 1: Backend Setup & Run
Pehle backend server start karein:

```powershell
# Backend folder mein jayein
cd backend

# Virtual environment activate karein (Windows)
.\venv\Scripts\activate

# Backend run karein
python run.py
```
> **Note:** Backend defaults to `http://localhost:5000`

### 2️⃣ Step 2: Frontend Setup & Run
Naya terminal open karein aur root directory mein:

```powershell
# Dependencies install karein (agar nahi ki)
npm install

# Frontend run karein
npm run dev
```
> **Note:** Frontend defaults to `http://localhost:3000`

---

## 📝 Environment Variables
Project start karne se pehle check karein ki aapki `.env` files ready hain:
- **Frontend**: Root mein `.env.local` honi chahiye.
- **Backend**: `backend/` folder mein `.env` honi chahiye.

> [!TIP]
> Agar files nahi hain, toh `.env.local.example` aur `.env.example` ko copy karke naye `.env` files banayein.

---

## 📜 Available NPM Scripts

Aap root directory se ye commands use kar sakte hain:

| Command | Description |
| :--- | :--- |
| `npm run dev:all` | **Frontend + Backend dono start karein** |
| `npm run dev` | Sirf frontend start karein |
| `npm run backend:dev` | Sirf backend start karein |
| `npm run backend:setup` | Backend virtual environment aur dependencies setup karein |

---

## 🔐 Admin Panel Access

Aap apne portfolio ka content manage karne ke liye Admin Panel use kar sakte hain.

- **URL:** `http://localhost:3000/admin`
- **Username:** `Admin`
- **Password:** `Admin@123`

> [!WARNING]
> Production mein jaane se pehle `backend/.env` file mein ye credentials zaroor change kar lein.

---

## 🌐 Production Mein Kaise Chalayein?

Production mein project ko run karne ka tarika development se thoda alag hota hai.

### 1. Frontend (Next.js)
Production ke liye pehle optimized build banani padti hai:
```powershell
npm run build
npm run start
```

### 2. Backend (Flask)
Production mein `python run.py` ki jagah ek **Production WSGI Server** use karein:
- **Windows par:** `waitress-serve --port=5000 wsgi:app`
- **Linux par:** `gunicorn -w 4 -b 0.0.0.0:5000 "wsgi:app"`

### 3. Recommendation for Single Server (PM2)
Agar aap dono ko ek saath background mein chalana chahte hain:
1. [PM2](https://pm2.keymetrics.io/) install karein: `npm install pm2 -g`
2. Ek `ecosystem.config.js` file banayein aur dono process add karein.

---

Happy Coding! 🚀
