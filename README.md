# ⚡ ResumeForge — ATS-Optimized Resume Builder

ResumeForge is a fully client-side, interactive web application that helps job seekers build professional, ATS-friendly resumes in minutes. Instead of paying for resume services, users get real-time ATS scoring, keyword optimization, smart suggestions, and beautiful templates — all running privately in the browser with zero data sent to any server.

---

## 🚀 Project Overview

This project was developed to give every job seeker the tools that previously only expensive career coaches provided. It acts as a personal HR expert — analyzing resume content, flagging weak language, matching job description keywords, and scoring the resume live as the user types.

### Key Features

- **Real-Time ATS Scoring**: 0–100 compatibility score with a live ring gauge, broken into 5 weighted dimensions (completeness, keywords, format, achievements, length)
- **7 Professional Templates**: Executive, Modern, Creative, Minimal, Tech, DevOps (GitHub dark), and Full-Stack (indigo two-column) — all ATS-tested
- **Live Preview**: Resume updates instantly as you type — what you see is what recruiters get
- **JD Keyword Matcher**: Paste any job description to see exactly which keywords are missing from your resume
- **Smart Suggestion Engine**: Detects weak action verbs, missing quantification, incomplete sections, and low skill counts
- **PDF Export (Styled)**: Full-template PDF export with all CSS embedded inline — prints exactly as it looks on screen
- **Multi-Format Export**: PDF (print dialog), self-contained HTML download, plain text clipboard copy
- **Auto-Save**: All resume data saved automatically to `localStorage` — no account needed
- **100% Private**: Everything runs in your browser — no data ever leaves your device

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS, JavaScript (ES Modules) |
| **Styling** | Custom CSS Design System (Dark Glassmorphism) |
| **Fonts** | Google Fonts — Inter, JetBrains Mono |
| **Storage** | Browser `localStorage` (no backend needed) |
| **Export** | Blob URLs, `window.print()`, Clipboard API |
| **Notifications** | Twilio API (WhatsApp), Gmail SMTP (Email) |
| **Hosting** | Any static host — Netlify, GitHub Pages, Vercel |

---

## 📊 The Core Logic

ResumeForge operates on a 6-step guided wizard that builds and analyzes the resume simultaneously.

**ATS Score = Completeness (35%) + Keywords (20%) + Format (20%) + Achievements (15%) + Length (10%)**

### User Journey

| Stage | User Action | System Response |
| :--- | :--- | :--- |
| **Step 1** | Fill personal info | ATS score updates, preview renders name & contacts |
| **Step 2** | Write professional summary | Keyword matcher scans JD, starter templates offered |
| **Step 3** | Add work experience | Bullet builder with weak-verb detection activated |
| **Step 4** | Add education | GPA and honors fields, date formatting |
| **Step 5** | Tag skills | 4 categories: Technical, Soft, Languages, Tools |
| **Step 6** | Add projects & awards | GitHub links, tech stack, certification dates |
| **Export** | Choose PDF / HTML / Text | Styled export with all CSS embedded inline |

---

## 📁 Project Structure

```
Resume maker/
├── index.html              ← Main SPA shell (landing + builder + modals)
└── static/
    ├── css/
    │   └── styles.css      ← Full design system + 7 template styles
    └── js/
        ├── app.js          ← Core state manager, navigation, localStorage
        ├── resume-form.js  ← 6-step form wizard, dynamic cards, skill tags
        ├── ats-analyzer.js ← ATS scoring engine (5-dimension weighted score)
        ├── suggestions.js  ← Smart suggestion engine (verbs, metrics, gaps)
        ├── templates.js    ← 7 resume template renderers
        ├── preview.js      ← Live preview dispatcher
        └── export.js       ← PDF, HTML, and plain-text export logic
```

---

## 💻 How to Run Locally

No installation required — this is a pure static web app.

### Option 1 — VS Code Live Server (Recommended)
1. Install the **Live Server** extension by Ritwick Dey in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500` with auto-reload on save ✅

### Option 2 — Python HTTP Server
```bash
python -m http.server 3000 --directory "path/to/Resume maker"
```
Navigate to `http://localhost:3000` in your browser.

### Option 3 — Direct File
> ⚠️ Note: Opening `index.html` directly via `file://` will **not** work because ES Modules require an HTTP server due to browser CORS restrictions. Use Option 1 or 2.

---

## 🌐 Deploy Live (Free)

Since ResumeForge is a static app, it can be hosted for free on any static platform:

### Netlify (Easiest — 2 minutes)
1. Go to [netlify.com](https://netlify.com) and sign up free
2. Drag and drop the entire `Resume maker` folder onto the Netlify dashboard
3. Get a live URL like `https://resumeforge.netlify.app` instantly

### GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages → Source: main branch**
3. Access at `https://yourusername.github.io/resume-maker`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project with attribution.

---

## 👤 Author

**Shaurya Pradhan**  
GitHub: [@shauryapradhan546](https://github.com/shauryapradhan546)

---

> *"Your data never leaves your browser. 100% private and free."* ⚡
