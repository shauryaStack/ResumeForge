# ⚡ ResumeForge

<div align="center">

**ATS-Optimized Resume Builder — 100% Free, Private & Browser-Based**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=for-the-badge)](#)

[🚀 Live Demo](#-deploy-live-free) · [📖 Features](#-features) · [💻 Run Locally](#-run-locally) · [📁 Project Structure](#-project-structure)

</div>

---

## 📌 What is ResumeForge?

**ResumeForge** is a fully client-side, interactive web application that helps job seekers build professional, ATS-friendly resumes in minutes — for **free**.

> No sign-up. No subscription. No data ever leaves your browser.

It acts as a personal HR expert — analyzing your resume content in real time, flagging weak language, matching job description keywords, scoring your resume live as you type, and generating styled, print-ready PDFs.

---

## ✨ Features

| Feature | Description |
|:---|:---|
| 🎯 **Real-Time ATS Scoring** | Live 0–100 score with a ring gauge, broken into 5 weighted dimensions |
| 🖼️ **7 Professional Templates** | Executive, Modern, Creative, Minimal, Tech, DevOps, Full-Stack — all ATS-tested |
| 👁️ **Live Resume Preview** | Resume updates instantly as you type — WYSIWYG |
| 🔍 **JD Keyword Matcher** | Paste a job description to surface missing keywords instantly |
| 💡 **Smart Suggestion Engine** | Detects weak verbs, missing metrics, incomplete sections, low skill counts |
| 📄 **Styled PDF Export** | Full-template PDF with all CSS embedded inline — prints exactly as it looks |
| 📦 **Multi-Format Export** | PDF (print dialog), self-contained HTML download, plain text clipboard copy |
| 💾 **Auto-Save** | All data saved automatically to `localStorage` — no account needed |
| 🔒 **100% Private** | Everything runs in your browser — zero server requests |

---

## 📊 ATS Scoring Engine

ResumeForge operates on a **6-step guided wizard** that builds and analyzes the resume simultaneously.

```
ATS Score = Completeness (35%) + Keywords (20%) + Format (20%) + Achievements (15%) + Length (10%)
```

### User Journey

| Step | User Action | System Response |
|:---:|:---|:---|
| **1** | Fill personal info | ATS score updates, preview renders name & contacts |
| **2** | Write professional summary | Keyword matcher scans JD, starter templates offered |
| **3** | Add work experience | Bullet builder with weak-verb detection activated |
| **4** | Add education | GPA and honors fields, date formatting |
| **5** | Tag skills | 4 categories: Technical, Soft, Languages, Tools |
| **6** | Add projects & awards | GitHub links, tech stack, certification dates |
| **↓** | **Export** | Choose PDF / HTML / Text — styled export with all CSS inline |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | HTML5, Vanilla CSS, JavaScript (ES Modules) |
| **Styling** | Custom CSS Design System (Dark Glassmorphism) |
| **Fonts** | Google Fonts — Inter, JetBrains Mono |
| **Storage** | Browser `localStorage` (no backend needed) |
| **Export** | Blob URLs, `window.print()`, Clipboard API |
| **Hosting** | Netlify, GitHub Pages, Vercel (any static host) |

---

## 📁 Project Structure

```
ResumeForge/
├── index.html              ← Main SPA shell (landing page + builder + modals)
├── .gitignore
└── static/
    ├── css/
    │   └── styles.css      ← Full design system + 7 resume template styles
    └── js/
        ├── app.js          ← Core state manager, navigation, localStorage sync
        ├── resume-form.js  ← 6-step form wizard, dynamic cards, skill tag UI
        ├── ats-analyzer.js ← ATS scoring engine (5-dimension weighted scorer)
        ├── suggestions.js  ← Smart suggestion engine (verbs, metrics, gaps)
        ├── templates.js    ← 7 resume template renderers
        ├── preview.js      ← Live preview dispatcher
        └── export.js       ← PDF, HTML, and plain-text export logic
```

---

## 💻 Run Locally

No installation or build step required — this is a **pure static web app**.

### Option 1 — VS Code Live Server *(Recommended)*

1. Install the **Live Server** extension by Ritwick Dey in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500` with hot-reload on save ✅

### Option 2 — Python HTTP Server

```bash
# Navigate to the project folder first
python -m http.server 3000
```

Then open `http://localhost:3000` in your browser.

### Option 3 — Node.js (npx serve)

```bash
npx serve .
```

> ⚠️ **Important:** Do **not** open `index.html` directly via `file://`. ES Modules require an HTTP server due to browser CORS restrictions. Always use one of the options above.

---

## 🌐 Deploy Live (Free)

ResumeForge is a static app — deploy it for free in minutes.

### ▶ Netlify *(Easiest — ~2 minutes)*

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Drag and drop the project folder onto the Netlify dashboard
3. Get a live URL instantly (e.g., `https://resumeforge.netlify.app`)

### ▶ GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source → main branch**
3. Your site is live at `https://<your-username>.github.io/ResumeForge`

### ▶ Vercel

```bash
npx vercel
```

Follow the prompts — your app will be deployed in under 60 seconds.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork this repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project with proper attribution.

---

## 👤 Author

**Shaurya Pradhan**
- GitHub: [@shauryaStack](https://github.com/shauryaStack)

---

<div align="center">

*"Your data never leaves your browser. 100% private and free."* ⚡

⭐ If you found this helpful, please consider giving it a star!

</div>