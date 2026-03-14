# 🚀 Project ko GitHub par kaise upload karein (A to Z Guide)

Ye ek simple aur step-by-step guide hai jo aapko batayegi ki apne project ko safe tareeke se GitHub par kaise upload karna hai.

---

## 1. Tayyari (Prerequisites)
Pehle check karein ki aapke paas ye dono cheezein hain:
1. **GitHub Account:** [github.com](https://github.com/) par ek account bana lein.
2. **Git Installed:** Apne computer par Git install karein ([git-scm.com](https://git-scm.com/) se).

---

## 2. GitHub par Repository Banana
1. GitHub par login karein.
2. Top right corner mein **+** icon par click karein aur **New repository** sunein.
3. Repository ko ek naam dein (Jaise: `my-portfolio`).
4. Isko **Public** ya **Private** sunein (Aapki marzi).
5. **Create repository** button par click karein.
6. Aapko ek "URL" milega (Jaise: `https://github.com/aapka-username/my-portfolio.git`). Ise copy kar lein.

---

## 3. Local Project mein Git Setup karna (VS Code Terminal mein)
Apne VS Code mein terminal kholein aur ye commands ek-ek karke chalayein:

### Step A: Git ko Initialize karein
```bash
git init
```

### Step B: Files ko Stage karein (Prepare karein)
*.gitignore file hone ki wajah se node_modules aur venv upload nahi honge, jo ki achha hai.*
```bash
git add .
```

### Step C: Pehla Commit karein
```bash
git commit -m "First commit: Portfolio project setup"
```

### Step D: GitHub Repository se Link karein
*(Yahan apna copy kiya hua URL paste karein)*
```bash
git remote add origin https://github.com/aapka-username/my-portfolio.git
```

### Step E: Files ko Push karein (Upload)
```bash
git branch -M main
git push -u origin main
```

---

## 4. .gitignore ka Maqsad (Zaroori Yaad rakhein)
Aapke project mein ek `.gitignore` file hai. Iska kaam ye hai ki ye "Faltu" aur "Secret" files ko GitHub par jaane se rokti hai:
- **node_modules/**: Ye bohot badi hoti hain, GitHub par inki zarurat nahi (Next stage par `npm install` se wapas aa jati hain).
- **venv/**: Python ki environment files, ye bhi upload nahi honi chahiye.
- **.env.local**: Isme aapke passwords aur keys hote hain. Inhe **KABHI** GitHub par public mat hone dena.

---

## 5. Future mein Updates kaise karein?
Jab bhi aap project mein koi naya badlav karein aur use GitHub par bhejna ho, toh bas ye 3 commands chalayein:

1. `git add .` (Changes save karne ke liye)
2. `git commit -m "Maine ye naya feature add kiya"` (Ek message ke saath save karein)
3. `git push` (GitHub par bhej dein)

---

## ⚠️ Zaroori Warning
Agar aapka project **Public** hai, toh kabhi bhi `.env` file mein apna asli password ya credit card/API key mat chhodna. Hamesha `.env.local.example` ka use karein logon ko template dikhane ke liye.

---

**Mubarak ho!** Aapka project ab GitHub par live hai. 🎉
