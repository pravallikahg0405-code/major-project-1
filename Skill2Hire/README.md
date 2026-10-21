# Skill2Hire — AI-Powered Career Companion
**Computer Science & Engineering Final-Year Capstone Project**

---

## 🌟 Executive Summary

**Skill2Hire** is a student-centric, production-ready AI career companion designed to empower students and job seekers across every phase of recruitment. Built with a **Clean Modular-Monolith Architecture**, Skill2Hire features **five completely independent career-related modules** backed by **MongoDB Atlas Cloud Database**, server-side **OpenAI LLM Integration**, and a friction-free **Lazy / Progressive Registration** system.

---

## 🚀 The 5 Completely Independent Modules

The platform is strictly organized around five standalone feature modules. Users can open, explore, and extract immediate value from **any** module directly without prerequisites.

| # | Module Name | Key Features | Registration Trigger Point |
| :--- | :--- | :--- | :--- |
| **1** | **Resume Builder** | 3 Single-column ATS templates (*ATS Classic, ATS Modern, ATS Technical*), rule-based keyword compatibility meter (0–100), AI Google X-Y-Z bullet enhancer, PDF & DOCX downloads. | **Clicking "Download PDF" or "Download DOCX"** |
| **2** | **Resume Tailoring** | Compare candidate resume against target Job Description, before/after match score lift, **Zero Fake Skills** isolation under *Skill Gaps*, tailored PDF & DOCX export. | **Clicking "Download PDF" or "Download DOCX"** |
| **3** | **Job Suggestions** | Normalized live job aggregator, personalized *Skill2Hire Job Compatibility Score*, **BEST FIT JOB** highlight + 5 Good Matches, direct external application URLs. | **Clicking "Search Jobs"** |
| **4** | **Mock Interview** | 4-Round placement simulation: **Round 1 (Eligibility Check)** $\rightarrow$ **Round 2 (Timed Aptitude MCQs)** $\rightarrow$ **Round 3 (Dynamic Technical AI)** $\rightarrow$ **Round 4 (Behavioral HR Round)**. Web Speech STT/TTS + optional webcam preview. | **Clicking "Start Interview"** |
| **5** | **Tech News** | Verified tech feeds (Dev.to, HackerNews, RSS), category filtering, AI 3-bullet developer takeaways, direct source links. | **100% Public Access (No registration required anywhere)** |

> [!NOTE]
> **Module Independence:** While optional shortcuts exist (e.g., *"Use this resume in Tailoring"* or *"Practice interview for this job"*), they are strictly optional and never mandatory prerequisites.

---

## 🔐 Lazy / Progressive Registration & Data Preservation

1. **Zero Barrier Exploration:** Guests can enter resume details, generate AI bullets, tailor CVs against JDs, configure job filters, and explore tech news without signing in.
2. **Context-Driven Action Triggers:** Authentication modals appear strictly at high-value persistent action points (e.g., downloading documents, running live job searches, launching full interview simulations).
3. **Guaranteed Data Preservation:** Draft states are persisted in temporary browser storage (`s2h_guest_*`). Upon successful registration or login, the user's active work is automatically synced to **MongoDB Atlas**, and their intended action continues seamlessly.

---

## 🛠️ Technology Stack

```
Frontend:    React 18+, Vite, TypeScript, Tailwind CSS, React Router v6, Axios, Lucide React
Backend:     Node.js, Express.js, TypeScript, Mongoose, Multer, Helmet, CORS, Rate-Limiting
Database:    MongoDB Atlas Cloud Database (Sole & Primary Database — No local MongoDB needed)
AI Engine:   OpenAI API (gpt-4o-mini / gpt-4o isolated server-side)
Document:    pdf-parse, mammoth, pdfkit, docx (Single-column ATS PDF & editable DOCX)
```

---

## 🍃 MongoDB Atlas Setup & Configuration

Skill2Hire runs exclusively on **MongoDB Atlas**. Local MongoDB installation is **NOT** required.

### 1. Create a Free MongoDB Atlas Cluster
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free **M0 Cluster**.
2. Under **Security $\rightarrow$ Database Access**, add a database user with Read/Write privileges.
3. Under **Security $\rightarrow$ Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) for seamless evaluation.
4. Under **Deployment $\rightarrow$ Database**, click **Connect** $\rightarrow$ **Drivers** (Node.js) and copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/skill2hire?retryWrites=true&w=majority
   ```

---

## 🎓 Database Demonstration Guide for Project Viva

Skill2Hire is purpose-built for an impressive, live presentation to project guides and examiners.

### Live End-to-End Tracing Walkthrough
```
1. Open MongoDB Atlas in your browser ➔ Select database: `skill2hire`
2. Perform an action on the Skill2Hire frontend ➔ Refresh Atlas collection to show stored document:
   • Register User ➔ Open `users` collection ➔ Show bcrypt password hash ($2a$10...) & profile.
   • Build & Save Resume ➔ Open `resumes` collection ➔ Show structured JSON & ATS score.
   • Tailor Resume ➔ Open `tailored_resumes` collection ➔ Show before/after score & skill gaps.
   • Save Job ➔ Open `saved_jobs` collection ➔ Show bookmarked job & match percentage.
   • Complete Interview ➔ Open `interview_reports` collection ➔ Show 4-round scorecard.
```

### Instant Demonstration Seeding Script
To immediately populate all 7 MongoDB Atlas collections with realistic demonstration data:
```bash
cd server
npm run seed:demo
```
**Demonstration Credentials:**
- **Email:** `student.demo@skill2hire.edu`
- **Password:** `DemoPass@2026`

---

## 📂 Project Folder Structure

```
Skill2Hire/
├── .env.example              # Environment variables template
├── README.md                 # Complete documentation and viva guide
├── package.json              # Root orchestration scripts
│
├── frontend/                 # React + Vite + TypeScript Client
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── src/
│       ├── components/       # Reusable Navbar, Footer, AuthModal, Button, Card, Badge
│       ├── context/          # AuthContext (Progressive registration & draft preservation)
│       ├── modules/          # 5 Feature-Based Independent Modules
│       │   ├── resume-builder/
│       │   ├── resume-tailoring/
│       │   ├── job-suggestions/
│       │   ├── mock-interview/
│       │   └── tech-news/
│       ├── pages/            # LandingPage, DashboardPage, NotFoundPage
│       └── services/         # Central Axios API client
│
└── server/                   # Node.js + Express + TypeScript Backend
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── config/           # db.ts (Atlas connection), env.ts
        ├── controllers/      # auth, resume, tailor, job, interview, news controllers
        ├── middleware/       # JWT auth, optional auth, rate limiter, upload
        ├── models/           # 7 Mongoose schemas (User, Resume, TailoredResume, etc.)
        ├── routes/           # REST endpoints
        ├── services/         # AI gateway, ATS scoring, Job aggregator, PDF/DOCX exporters
        ├── utils/            # seedData.ts, jwt.ts
        └── server.ts         # Express bootstrap
```

---

## 💻 Local Development & Execution in VS Code

### Step 1: Clone & Install Dependencies
```bash
# Open root directory in VS Code
cd Skill2Hire

# Install dependencies across root, server, and frontend
npm run install:all
```

### Step 2: Configure Environment Variables
Create `.env` in `server/` (or copy `.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/skill2hire?retryWrites=true&w=majority
JWT_SECRET=skill2hire_super_secret_jwt_key_2026_capstone_project
JWT_EXPIRES_IN=7d

OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Create `.env` in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Skill2Hire
```

### Step 3: Run Full-Stack Application
From the project root:
```bash
npm run dev
```
- **Frontend Application:** `http://localhost:5173`
- **Backend REST API:** `http://localhost:5000`
- **Database:** `MongoDB Atlas Cloud`

---

## 🧪 Testing Scenarios for Viva Evaluation

1. **Test 1 — Resume Builder:** Guest enters personal details $\rightarrow$ AI suggests bullet improvement $\rightarrow$ ATS score calculated $\rightarrow$ clicks "Download PDF" $\rightarrow$ Auth modal triggers $\rightarrow$ registers $\rightarrow$ resume downloaded & stored in Atlas.
2. **Test 2 — Resume Tailoring:** Uploads resume $\rightarrow$ pastes target JD $\rightarrow$ AI generates tailored CV with zero fake skills $\rightarrow$ clicks "Download DOCX" $\rightarrow$ logs in $\rightarrow$ tailored docx downloaded & stored in Atlas.
3. **Test 3 — Job Suggestions:** Configures role/location $\rightarrow$ clicks "Search Jobs" $\rightarrow$ registers $\rightarrow$ Best Fit + 5 Matches displayed with direct external application URLs.
4. **Test 4 — Mock Interview:** Configures role $\rightarrow$ clicks "Start Interview" $\rightarrow$ registers $\rightarrow$ Completes Round 1 (Eligibility) $\rightarrow$ Round 2 (Timed MCQs) $\rightarrow$ Round 3 (Technical AI) $\rightarrow$ Round 4 (HR) $\rightarrow$ Final scorecard saved in Atlas.
5. **Test 5 — Tech News:** Publicly browses, searches, and reads AI 3-bullet developer takeaways without any registration prompt.

---

## 🛡️ Security & Defensive Design
- **Stateless JWT:** Signed SHA-256 tokens with 7-day expiration.
- **Bcrypt Hashing:** Passwords securely hashed with 10 salt rounds.
- **Server-Side API Key Isolation:** OpenAI keys and database credentials strictly isolated on backend.
- **In-Memory File Processing:** Multer in-memory buffers prevent orphaned server disk files.
- **API Guardrails:** Helmet security headers, CORS origin whitelist, and Express rate limiting.

---

## 👨‍💻 Project Authors & Academic Submission
- **Project Title:** Skill2Hire — Student-Centric AI Career Companion
- **Department:** Computer Science & Engineering (CSE)
- **Evaluation Year:** 2026
- **Architecture Type:** Clean Modular-Monolith REST Architecture
