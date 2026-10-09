<div align="center">

# 🎓 TIET-Prep: Thapar Smart Exam-Prep Platform
### *An AI-Powered Academic Intelligence & Exam Preparation Ecosystem*

[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_pgvector-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

<p align="center">
  <b>"A platform that knows our college, our courses, our professors' paper patterns, and our academic calendar."</b><br>
  Built specifically for <b>Thapar Institute of Engineering & Technology (TIET), Patiala</b>.<br>
  <i>Tailored prototype subject: <b>UCS503 (Software Engineering)</b> &bull; Subgroup Context: <b>COE-3-3C72</b></i>
</p>

[Key Features](#-key-features) •
[System Architecture](#-system-architecture) •
[Quickstart](#-quickstart) •
[Demo Accounts](#-demo-accounts) •
[5-Minute Demo Script](#-5-minute-demo-walkthrough) •
[Engineering Guarantees](#-engineering-guarantees)

---

</div>

## 📌 Problem & Motivation

TIET students traditionally gather past year papers (PYQs), tutorial sheets, and sessional questions through fragmented WhatsApp groups, senior drives, and Discord servers. When seeking AI assistance, students upload these heavy PDFs repeatedly to generic LLMs. This introduces significant issues:
1. **Redundant token cost**: Every student forces the LLM to re-parse the same 40-page slide decks repeatedly.
2. **Hallucination & lack of grounding**: Generic chatbots invent exam structures or syllabus topics that are irrelevant to Thapar's specific curriculum.
3. **No academic memory**: Bots have no understanding of historical topic weightages, mark distributions, or batch-specific calendar deadlines.

**TIET-Prep fixes this with a fundamental principle:**
> **Parse & Embed Once, Query for All.** Documents are parsed, vectorized into `pgvector`, and cross-indexed with TIET course syllabi just once upon upload. All AI responses are grounded strictly in authentic college material via Hybrid RAG with deterministic metric guarantees.

---

## 🌟 Key Features

### 1. 🤖 TIET-GPT: Grounded AI Exam Assistant
- **Strict Citation Guarantee**: Every generated explanation or revision note links directly to exact lecture slides and past papers (e.g. `[Slide 12: Unit 1]`, `[TIET MST 2023, Q1(a)]`). If a concept falls outside course material, the assistant explicitly reports that it is not present.
- **Empirical Topic Predictions**: Ranks high-probability topics for upcoming exams with calculated confidence levels and historical evidence.
- **Dynamic Shift Detection**: Flags syllabus transitions (e.g., *"Shift detected: 2024 papers increased Agile User Story questions from 15% to 35% compared to 2022"*).
- **Downloadable Revision Packs**: Generates comprehensive offline prep study guides in Markdown/PDF formats.

### 2. 📊 Deterministic Topic Weightage Analytics
- **Pure SQL/Code Computation**: Weightage graphs, marks shares, and frequency rankings are computed deterministically via PostgreSQL aggregation—**never fabricated by an LLM**.
- **Exam-Type Switcher**: Toggle between **MST** and **EST** evaluation criteria to inspect how topic weightages dynamically re-balance.

### 3. 🎯 Faceted Question Bank & Interactive Practice
- **Authentic Past Exam Papers**: Filter by evaluation type (`MST`, `EST`, `Quiz`), curriculum topic, difficulty, and marks.
- **Transparent Solution Verification**:
  - `AI-generated, unverified`: Amber notice ensuring students verify auto-generated steps.
  - `Verified by moderator/senior`: Emerald badge indicating faculty/senior verification.
- **Self-Graded Practice Runner**: Interactive scratchpad, step-by-step model answer comparisons, and self-evaluation sliders.
- **Timed 30-Minute Mock Quiz**: Live countdown exam simulation featuring instant scorecard generation and a **Weak Topics Diagnostic Report**.

### 4. 📅 Batch-Specific Academic Calendar
- **Batch Isolation (`COE-3-3C72`)**: Major evaluations (MST/EST) span all 85+ subgroups, while specific lab evaluations and vivas are filtered strictly to the student's group.
- **Prep Integration**: Live readiness count (*"MST in 5 days"*) with a 1-click shortcut to launch the AI Assistant pre-scoped to the tested syllabus units.
- **Sync**: Direct `.ics` export for Google Calendar, Apple Calendar, and Outlook.

### 5. 💬 Public Discussion Forum & Live Crunch Chat
- **Course Discussion Board**: Threaded conversations tagged with `#MST`, `#Doubt`, `#Syllabus`, upvoting, and "Mark as Accepted Answer".
- **Live Exam Crunch Chatbox**: Real-time collaborative chat sidebar for peer communication during examination periods.

### 6. 🛡️ Ingestion Pipeline & Moderator Queue (`/admin`)
- Contributor uploads are staged in `PENDING_REVIEW`.
- Moderators review, edit tags, adjust marks, or reject invalid files before items become searchable.

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Next.js 15 App Router Shell                         │
│       React 18 • TypeScript • Tailwind CSS • Radix UI • KaTeX MathRenderer    │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ Server Actions & API Routes
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                               Platform Engine Layer                           │
│  ┌─────────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  │   Deterministic Stats   │  │   Hybrid Retrieval    │  │ Moderator Queue  │ │
│  │ (Weightage & Patterns)  │  │ (pgvector + Keyword)  │  │  (/admin Portal) │ │
│  └─────────────────────────┘  └───────────────────────┘  └──────────────────┘ │
└───────────────────────┬───────────────────────────────────────┬───────────────┘
                        │                                       │
                        ▼                                       ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────┐
│           PostgreSQL 16 + pgvector           │ │   Provider-Agnostic LLM SDK  │
│  • Course Documents & Slide Chunks           │ │ • Google Gemini 2.0 Flash    │
│  • Tagged Questions & Peer Solutions         │ │ • text-embedding-004         │
│  • Academic Calendar & Discussion Threads    │ │ • Deterministic Mock Provider│
└──────────────────────────────────────────────┘ └──────────────────────────────┘
```

---

## 🚀 Quickstart

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on macOS, Windows, or Linux.

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/your-username/tiet-prep.git
cd tiet-prep
cp .env.example .env
```

*(Optional)* To use live Gemini inference, open `.env` and provide your API key. If left blank, the platform automatically switches to the built-in deterministic `MockLLMProvider`:
```env
GEMINI_API_KEY="AIzaSy..."
LLM_PROVIDER="gemini"
```

### 2. Launch the Application
```bash
docker compose up --build
```
The Docker entrypoint automatically:
- Starts PostgreSQL 16 with the `pgvector` extension
- Deploys database migrations (`prisma db push`)
- Seeds initial data including batch `COE-3-3C72`, course `UCS503`, sample questions, and calendar milestones
- Boots the development server at **`http://localhost:3000`**

*(For 1-click launching on macOS without opening terminal, double-click `start.command` in the project root).*

---

## 🔑 Demo Accounts

Navigate to **[http://localhost:3000/login](http://localhost:3000/login)** to log in via one-click profile cards:

| Role | Email | Password | Scope & Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@thapar.edu` | `demo123` | Enrolled in `UCS503`, Batch `COE-3-3C72`. Access to Question Bank, practice runner, quizzes, AI assistant, calendar, and forum. |
| **Contributor** | `contributor@thapar.edu` | `demo123` | Uploads course slides, tutorial sheets, and past question papers. |
| **Moderator** | `moderator@thapar.edu` | `demo123` | Full access to `/admin` review queue to approve/reject questions and verify solutions. |
| **CR (Class Rep)** | `cr@thapar.edu` | `demo123` | Can create and schedule batch-specific lab evaluations and academic calendar events. |

*(Roles can also be switched instantly via the user profile menu at `/profile`).*

---

## 🎬 5-Minute Demo Walkthrough

Follow this script to demonstrate the platform workflow:

1. **Student Dashboard (`/dashboard`)**:
   - Log in as **Student** (`student@thapar.edu`).
   - Notice the greeting customized for batch **`COE-3-3C72`** and the urgent exam alert: *"MST 1 Examination in 5 days"*.
   - Open **UCS503 - Software Engineering**.

2. **Topic Weightage Dashboard (`/courses/1/weightage`)**:
   - Observe historical topic weightages computed deterministically from real TIET exam papers (*Software Processes & Agile* represent highest MST frequency).
   - Switch evaluation filter between **MST** and **EST**.

3. **Academic Calendar (`/courses/1/calendar`)**:
   - Inspect the upcoming **MST 1** examination scheduled for `COE-3-3C72`.
   - Click **"Prepare for this Exam with AI"** to open the assistant scoped directly to tested syllabus units.

4. **AI Exam Prep Assistant (`/courses/1/assistant`)**:
   - **Pattern Analysis**: View paper structure breakdown (sections, marks distribution, question types).
   - **Change Detection**: Review alerts highlighting structural question format shifts.
   - **Predictions**: Check topics ranked by likelihood with empirical confidence metrics.
   - **Study Plan**: Review the structured 5-day syllabus timetable.
   - **Grounded Chat**: Prompt the assistant (*"Compare Agile and Waterfall with reference to our slides"*) and observe inline verified slide citations (`[Slide 12: Unit 1]`).

5. **Question Bank & Timed Practice (`/courses/1/questions` & `/practice`)**:
   - Filter questions by exam type and topic.
   - Note the difference between amber `AI-generated, unverified` and green `Verified by moderator/senior` solution badges.
   - Launch a **Practice Session** or test the **30-Minute Timed Mock Quiz**.

6. **Public Forum & Live Crunch Chat (`/courses/1/discuss`)**:
   - Browse discussion threads filtered by `#MST` or `#Doubt`.
   - Test the **Live Exam Chatbox** sidebar for real-time peer communication.

7. **Moderator Portal (`/admin`)**:
   - Switch to the **Moderator** role and visit `/admin`.
   - Review pending question submissions, edit tags/marks, and approve items to trigger background vector re-indexing.

---

## 📁 Repository Structure

```
├── app/                        # Next.js 15 App Router pages & server actions
│   ├── (auth)/login/           # Institute authentication portal
│   ├── admin/                  # Moderator review queue (/admin)
│   ├── courses/                # Course catalog & tab navigation hub
│   │   └── [id]/               # Hub: Questions, Practice, Weightage, Assistant, Calendar, Discuss
│   └── dashboard/              # Student dashboard with batch context
├── components/                 # Reusable UI component modules
│   ├── analytics/              # Weightage distribution charts
│   ├── assistant/              # Grounded chat, predictions, study plans
│   ├── calendar/               # Batch calendar & readiness countdown
│   ├── forum/                  # Discussions & live exam crunch chatbox
│   ├── math/                   # KaTeX Markdown/LaTeX renderer
│   ├── practice/               # Interactive practice runner & self-grading
│   └── question/               # Question cards & solution verification
├── lib/                        # Core backend libraries
│   ├── analytics/              # Deterministic SQL pattern & weightage engines
│   ├── auth/                   # NextAuth role & batch token enrichment
│   ├── ingestion/              # PDF text parser & question segmenter
│   ├── llm/                    # Provider-agnostic SDK (Gemini & Mock)
│   └── vector/                 # pgvector hybrid semantic retrieval
├── prisma/                     # Database schema & demo seed script
├── scripts/                    # Ingestion pipelines & evaluation test harnesses
├── seed-data/                  # Real UCS503 lecture slides & past exam papers
├── diagrams/                   # Native draw.io architectural & UML diagrams
└── docker-compose.yml          # Container orchestration definition
```

---

## 🧪 Testing & Evaluation Harness

Run the evaluation harness to verify retrieval relevance, citation validity, and response latency:
```bash
# Inside Docker
docker compose exec app npm run test:eval

# Locally
npm run test:eval
```
- **Hold-Out Prediction Test**: Validates prediction engine against historical exam data.
- **Retrieval Precision & Citation Audit**: Verifies that all citations point to authentic course assets.
- **Latency Verification**: Benchmarks retrieval and generation response times (target $\le 30\text{s}$).

---

## 🛡️ Engineering Guarantees

- **Zero Fabricated Stats**: Mark shares, question counts, and historical frequencies are calculated through strict database aggregation.
- **Domain Restriction**: Authentication enforces institutional `@thapar.edu` identity.
- **Privacy & Copyright**: Uploads require authorization, solutions carry clear attribution, and student data remains private.

---

<div align="center">
  <sub>Developed for the Software Engineering Course (UCS503) &bull; Thapar Institute of Engineering & Technology, Patiala</sub>
</div>
