# PROMPT FOR ANTIGRAVITY

You are a senior full-stack engineer + product designer. Build a working PROTOTYPE of **"Thapar Smart Exam-Prep Platform"**: an exam-prep system specific to Thapar Institute of Engineering and Technology (TIET), Patiala. Think of it as "a ChatGPT that knows our college, our courses, our professors' paper patterns, and our exam calendar."

Before writing any code, produce an **Implementation Plan artifact** (architecture, data model, folder structure, increments, risks) and wait for my approval. Then build increment by increment, running and testing each one (use the browser to verify the UI) before moving on.

---

## 1. Problem (why this exists)
TIET students collect PYQs, quiz papers and sessional papers manually from seniors, WhatsApp groups and drives. For AI help they re-upload the same files to a generic chatbot every time. That bot has no memory of the course, no sense of historical topic weightage, and re-parses the same documents for every student.

**Core principle: parse + embed every document ONCE at upload, reuse it for every student. All AI output must be grounded in retrieved TIET material (RAG), never invented from nothing.**

## 2. Tech stack (from our design document; keep it unless you have a strong reason)
- Frontend: Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui
- Backend: Next.js API routes / server actions (or a small FastAPI service for ingestion if cleaner)
- DB: PostgreSQL + pgvector (Prisma or Drizzle ORM)
- Object storage: local disk / S3-compatible for raw PDFs, images, slides
- LLM + embeddings: Gemini API behind a provider-agnostic interface (`LLMProvider`), so we can swap models via env var
- OCR/parsing: PDF text extraction first, OCR fallback for scanned papers/handwritten solutions
- Auth: institute-email login (only `@thapar.edu`), OTP or Google SSO restricted to that domain. For the prototype, a dev-mode mock login is fine behind an env flag.
- Everything runs locally with `docker compose up` + `.env.example`. Include seed scripts and a README.

## 3. Roles
- **Student**: browses, practises, chats with the AI tutor, uses calendar and forum.
- **Contributor**: any student/senior who uploads PYQs, quizzes, sessionals, slides, solutions.
- **Moderator**: approves/rejects uploads, edits tags, verifies solutions, moderates the forum.
- **System/LLM**: auto-tags, embeds, generates, analyses.

## 4. Features

### 4.1 Question Bank (PYQs + solutions)  — core
- Courses catalog (course code, name, department, semester). Student enrols in courses and has a **batch** (e.g. branch + year + group like "COE 2nd year, 2C12").
- Question bank organised per course, with filters: **evaluation type** (Quiz, Sessional, MST, EST, Lab Eval, Viva), **year/session**, **topic**, **difficulty**, **marks**, **question type** (MCQ / short / long / numerical / coding).
- Each question stores: text (Markdown + LaTeX/KaTeX rendering), marks, topic tags, difficulty, source paper (year, exam type, set/variant), embedding, and one or more **solutions**.
- **Solutions**: each question can have (a) an AI-generated step-by-step solution, clearly badged **"AI-generated, unverified"**, (b) community/contributor-submitted solutions, (c) a **"Verified by moderator/senior"** badge once approved. Allow upvotes and "report wrong solution". Never present an unverified AI solution as authoritative.
- **Practice mode**: pick course, eval type, topic(s) → get real PYQs → attempt (MCQs auto-graded; subjective questions: reveal solution, self-mark). Track **practice history** so questions aren't repeated excessively.
- **Quiz mode**: timed mock quiz built from real PYQs + (optionally) AI-generated questions, with score + weak-topic report.
- **Topic weightage dashboard**: per course and eval type, a ranked chart of topics by historical frequency and marks share, with year-wise trend (recomputed whenever new material is approved).

### 4.2 Ingestion + Moderation pipeline
Contributor uploads PDF/image → parse/OCR → split into individual questions (preserve marks, sub-parts, diagrams as images) → LLM auto-tags (course, topic, difficulty, eval type, year) → **moderator review queue** (approve / edit tags / reject with reason) → approved questions embedded into pgvector → topic weightage recomputed. Nothing becomes searchable before moderator approval. Also support uploading **lecture slides** (chunked by slide, tagged to course + topic/chapter/week) and **syllabus documents** (parsed into a unit → topics tree). Show ingestion status (queued / parsing / needs review / live).

### 4.3 Public Forum / Discussion Space
- Per-course discussion boards + one general TIET board. Threads with replies, upvotes, tags (e.g. `#MST`, `#doubt`, `#resources`), search, and "mark as accepted answer".
- A **live public chatbox** per course (real-time via WebSockets / SSE / Supabase-style realtime) for quick doubts during exam season.
- Question-linked discussion: every PYQ has a "Discuss this question" thread, so doubts live next to the question.
- Moderation: report button, moderator delete/lock/pin, basic profanity + spam filter, rate limiting. Users appear by display name (option for anonymous posting but moderators can still see the real account).
- Optional: "Ask AI" button inside a thread that answers using only course material and cites sources.

### 4.4 Batch-specific Academic Calendar
- Each student sees a calendar (month / week / agenda views) **filtered to their batch and enrolled courses**.
- Event types: Lab evaluation, Quiz, Sessional, MST, EST, Assignment deadline, Viva, Holiday. Each event: course, date/time, venue, **syllabus covered** (linked to syllabus topics), weightage/marks, notes.
- Events are created by Moderators / batch representatives (role: `CR`) with an approval step; students can "suggest an event" which a CR confirms. Support importing from CSV.
- Reminders (in-app + optional email) e.g. 7 days / 1 day before. Export to Google Calendar via .ics.
- **Calendar ↔ prep integration**: clicking an upcoming MST on the calendar opens the **Exam Prep Assistant** (section 4.5) pre-configured for that course + syllabus scope. Show a "days left / readiness" indicator per upcoming exam.

### 4.5 AI Exam Prep Assistant ("TIET-GPT") — the headline feature
A course-specific, retrieval-grounded assistant. For the **prototype it will be loaded with ONE subject** (I will provide: lecture slides + PYQs). Design the pipeline so adding more subjects is just uploading more data, no code change.

Capabilities, for a selected course + upcoming exam (e.g. MST):
1. **Pattern analysis from PYQs** — across all past papers of that exam type: number of questions, section structure, marks distribution, question types (MCQ/numerical/theory/derivation/coding), average difficulty, topic-wise frequency and marks share, repeated or near-duplicate questions across years, which units/slides the questions come from, and typical phrasing/command words.
2. **Pattern change detection** — compare latest years against older ones and flag shifts (e.g. "theory questions dropped from 40% to 20%, application/numerical questions up", "Unit 3 appeared in every paper but not in the last one", "new question format appeared"). Also consider **this year's syllabus coverage** from the calendar/syllabus (what the MST actually covers) and the **lecture slides emphasis** (topics given more slides/time) to predict what's likely this time.
3. **Likely-question prediction** — produce a ranked list of topics most likely to appear with a **confidence level and the evidence** (which years, which slides). Be explicit that these are *estimates, not guarantees*.
4. **Suggested questions to prepare** — a curated set: (a) must-do real PYQs, (b) **newly generated questions** that match the style, difficulty and marks pattern of real TIET papers, using retrieved real PYQs as few-shot context; each with a solution marked "AI-generated". Also include "concept-gap" questions drawn from slides that PYQs haven't covered yet but could appear.
5. **Study plan** — given today's date and the exam date from the calendar, generate a day-by-day plan allocating time by topic weightage and student's weak topics (from practice history).
6. **Chat interface** — free-form Q&A ("explain Unit 2 simply", "give me 5 hard questions on X like the 2023 MST", "what's the pattern of MST?") with **inline citations** to the exact slide number / PYQ (year, exam, question no.) it used. If the material doesn't contain the answer, say so instead of guessing.
7. **Structured outputs, not just text**: render the pattern analysis as charts/tables (topic frequency bar chart, marks distribution, year-wise trend), and a downloadable "MST Prep Report" (PDF/Markdown).

Implementation notes for 4.5:
- Hybrid retrieval: pgvector semantic search + keyword/metadata filters (course, exam type, year, topic). Re-rank, then pass top-k with source metadata to the LLM.
- Do the **numeric analysis in code (SQL/Python), not in the LLM**: compute frequencies, marks distribution, year trends deterministically from the tagged question table, then give those numbers to the LLM to explain and extrapolate. Never let the LLM make up statistics.
- Keep prompts in versioned files (`/prompts`), with JSON-schema structured outputs for tagging, analysis and question generation. Validate outputs; retry on malformed JSON.
- Add a simple **evaluation harness**: retrieval relevance on a small labelled set, a "hold-out test" where the analyser is given papers up to year N-1 and we check how well its predictions matched year N's actual paper, citation correctness, time-to-first-question (target ≤ 30 s), tokens per session.
- Cache aggressively (parsed docs, embeddings, analysis results per course+exam type; invalidate only when new approved material arrives). Add per-user rate limits.

## 5. Data model (starting point; refine in your plan)
`User(id, name, email, role, batchId)`, `Batch(id, branch, year, group)`, `Course(id, code, name, dept, semester)`, `Enrollment`, `SyllabusUnit/Topic(tree)`, `Document(type: PYQ|QUIZ|SESSIONAL|SLIDES|SYLLABUS|SOLUTION, fileRef, status)`, `UploadSubmission`, `Question(id, courseId, evalType, year, marks, type, difficulty, text, topicTags[], sourceDocId, embedding)`, `Solution(questionId, authorType: AI|USER, content, verified, votes)`, `SlideChunk(courseId, slideNo, topic, text, embedding)`, `TopicWeightage(courseId, evalType, topic, frequencyScore, marksShare, lastUpdated)`, `PracticeSession`, `QuizAttempt`, `GenerationRequest(basedOn: Question[])`, `CalendarEvent(batchId, courseId, type, start, venue, syllabusTopicIds[], marks)`, `ForumThread/Post/Vote/Report`, `ChatMessage(sessionId, role, content, citations[])`, `PatternReport(courseId, evalType, generatedAt, json)`.

## 6. UX requirements
- Clean, fast, mobile-first (students use phones). Dark mode. Thapar-flavoured but original branding (do NOT copy official logos; use a simple wordmark).
- Home = "what's coming up for me": next exams from my calendar, readiness, quick-resume practice, trending forum threads.
- Course page tabs: **Overview · Question Bank · Practice · Weightage · AI Assistant · Calendar · Discuss · Resources**.
- Accessible, keyboard-friendly, math rendered correctly (KaTeX), code blocks for coding questions.

## 7. Prototype scope & seed data
- I will drop the data for ONE subject into `/seed-data/<COURSE_CODE>/` as `slides/*.pdf|pptx` and `pyqs/*.pdf` (names like `MST_2023.pdf`, `EST_2024.pdf`). Build the ingestion script so `npm run ingest -- <COURSE_CODE>` processes that folder end-to-end (parse → tag → embed → weightage → pattern report) and flags low-confidence items for manual review.
- Seed realistic dummy data for everything else (a couple of batches, a calendar with a upcoming MST, a few forum threads, a handful of users) clearly marked as demo data.
- The demo flow I want to show: login → open the subject → see weightage dashboard → open the upcoming MST in the calendar → AI Assistant produces pattern analysis + predicted changes + suggested questions with solutions and citations → practise them → discuss a question in the forum.

## 8. Quality, safety, and honesty rules
- Every AI answer shows its sources. Unverified AI content is always labelled.
- Predictions are labelled as estimates with confidence and evidence; no claims of "guaranteed to come".
- Respect copyright/privacy: uploads only by authenticated TIET users, moderator approval, a "report/takedown" flow, and a disclaimer that this is a student-run tool, not official TIET.
- Secrets in `.env` only. Input validation, file-type/size limits, malware-safe file handling, XSS-safe Markdown rendering, rate limiting.
- Write tests for: ingestion splitting/tagging, weightage computation, retrieval filters, calendar filtering by batch, and permissions (only moderators can approve).

## 9. Delivery plan (incremental; stop for my feedback after each)
1. **Core platform**: auth, courses, batches, enrolment, base UI shell.
2. **Ingestion + moderation**: upload, parse/OCR, tag, review queue.
3. **Question bank + retrieval**: embeddings, filters, practice + solutions.
4. **Weightage analytics + calendar**: dashboard, batch calendar, syllabus links, reminders.
5. **AI Exam Prep Assistant**: pattern analysis, change detection, predictions, generation, study plan, cited chat, evaluation harness.
6. **Forum + live chat**, polish, performance, README + demo script.

Start now with the Implementation Plan artifact. Ask me at most 5 clarifying questions (batch structure, auth method, LLM provider/key, hosting target, subject name/code) and otherwise make sensible assumptions and list them.
