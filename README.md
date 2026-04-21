# ResumeAI — AI Resume Analyzer

A complete, production-ready AI Resume Analyzer web application with a premium dark-gold UI. Built with vanilla HTML/CSS/JavaScript — zero dependencies required. Deploy in one click to Vercel.

---

## ✦ Features

- **10 fully connected pages** — Home, About, Features, Contact, Login, Signup, Dashboard, Analyzer, Result, Profile
- **PDF text extraction** via PDF.js (client-side, no server needed)
- **ATS Score analysis** — keyword matching across 15+ in-demand skills
- **Smart suggestions** — contextual, actionable improvement tips
- **Auth system** — signup/login with localStorage
- **History dashboard** — saved analyses with score cards
- **Download report** — export results as a .txt file
- **Mobile responsive** — collapsible sidebar, touch-friendly
- **Smooth transitions** — page fade animations, micro-interactions

---

## 🚀 Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
cd resume-analyzer
vercel
```

### Option 2 — Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Framework preset: **Other** (static site)
5. Build command: *(leave empty)*
6. Output directory: *(leave empty / `.`)*
7. Click **Deploy**

---

## 🗂 Project Structure

```
resume-analyzer/
├── index.html          # Entry point — single HTML file
├── vercel.json         # Vercel SPA rewrite rules
├── css/
│   └── styles.css      # All styles (dark-gold premium theme)
├── js/
│   ├── app.js          # Core: auth, routing, analyzer, helpers
│   └── pages.js        # All 10 page renderers + event bindings
└── README.md
```

---

## 🔑 How It Works

### Authentication
- Uses `localStorage` — no backend required
- Passwords stored as base64 (demo-grade; add real auth for production)

### PDF Analysis
- PDF.js extracts text client-side from uploaded PDFs
- Text is scored against 15 required skills + bonus keywords
- Score = skill match (60pts) + bonus keywords (15pts) + length (15pts) + format signals (10pts)

### Routing
- Hash-based SPA routing (`#home`, `#dashboard`, etc.)
- Protected routes redirect unauthenticated users to `/login`

---

## 🛠 Local Development

No build step needed — just open in a browser or serve with any static server:

```bash
# Python
python -m http.server 3000

# Node.js (npx)
npx serve .

# VS Code
# Use the "Live Server" extension
```

Then open `http://localhost:3000`.

---

## 📋 Pages

| Route | Page | Auth |
|-------|------|------|
| `#home` | Landing page | Public |
| `#about` | About page | Public |
| `#features` | Features page | Public |
| `#contact` | Contact form | Public |
| `#login` | Login | Public |
| `#signup` | Signup | Public |
| `#dashboard` | User dashboard | Protected |
| `#analyzer` | Resume upload & analysis | Protected |
| `#result` | Analysis result | Protected |
| `#profile` | Edit profile | Protected |

---

© 2025 ResumeAI
