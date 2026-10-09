/**
 * Seed script — idempotent (safe to run multiple times).
 * Creates demo batches, users, courses, and enrollments.
 * All data is clearly marked as DEMO DATA.
 *
 * Run: npm run db:seed
 */

import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_PASSWORD = 'demo123'

async function main() {
  console.log('🌱  Seeding demo data...\n')

  // ── Hash password (used for all demo accounts) ───────────────────────────
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  // ── Batches ───────────────────────────────────────────────────────────────
  const batches = await Promise.all([
    prisma.batch.upsert({
      where: { branch_year_group: { branch: 'COE', year: 3, group: '3C72' } },
      update: {},
      create: { branch: 'COE', year: 3, group: '3C72' },
    }),
    prisma.batch.upsert({
      where: { branch_year_group: { branch: 'COE', year: 2, group: '2C12' } },
      update: {},
      create: { branch: 'COE', year: 2, group: '2C12' },
    }),
    prisma.batch.upsert({
      where: { branch_year_group: { branch: 'CSE', year: 3, group: '3C11' } },
      update: {},
      create: { branch: 'CSE', year: 3, group: '3C11' },
    }),
    prisma.batch.upsert({
      where: { branch_year_group: { branch: 'ENC', year: 2, group: '2E5' } },
      update: {},
      create: { branch: 'ENC', year: 2, group: '2E5' },
    }),
  ])

  const [batchCoe3_72, batchCoe2, batchCse3] = batches
  console.log('✅  Batches created:', batches.map((b) => `${b.branch}-${b.year}-${b.group}`).join(', '))

  // ── Demo Users ────────────────────────────────────────────────────────────
  const usersData: Array<{
    name: string
    email: string
    role: Role
    batchId?: string
  }> = [
    {
      name: 'Arjun Sharma (Demo Student)',
      email: 'student@thapar.edu',
      role: 'STUDENT',
      batchId: batchCoe3_72.id, // COE 3rd Year Subgroup 3C72
    },
    {
      name: 'Priya Kapoor (Demo Contributor)',
      email: 'contributor@thapar.edu',
      role: 'CONTRIBUTOR',
      batchId: batchCse3.id,
    },
    {
      name: 'Dr. Moderator (Demo Moderator)',
      email: 'moderator@thapar.edu',
      role: 'MODERATOR',
    },
    {
      name: 'Rahul CR (Demo Class Rep)',
      email: 'cr@thapar.edu',
      role: 'CR',
      batchId: batchCoe3_72.id, // Class Rep for 3C72
    },
  ]

  const users = await Promise.all(
    usersData.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, role: u.role, batchId: u.batchId ?? null },
        create: { ...u, passwordHash },
      })
    )
  )

  console.log('✅  Users created:', users.map((u) => u.email).join(', '))

  // ── Courses ───────────────────────────────────────────────────────────────
  const coursesData = [
    {
      code: 'UCS503',
      name: 'Software Engineering',
      dept: 'Computer Science & Engineering',
      semester: 5,
    },
    {
      code: 'UCS301',
      name: 'Data Structures & Algorithms',
      dept: 'Computer Science & Engineering',
      semester: 3,
    },
    {
      code: 'UCS201',
      name: 'Computer Organization & Architecture',
      dept: 'Computer Science & Engineering',
      semester: 2,
    },
    {
      code: 'UMA008',
      name: 'Mathematics III',
      dept: 'Mathematics',
      semester: 3,
    },
    {
      code: 'UEC501',
      name: 'Digital Signal Processing',
      dept: 'Electronics & Communication Engineering',
      semester: 5,
    },
    {
      code: 'UCH101',
      name: 'Chemistry',
      dept: 'Chemistry',
      semester: 1,
    },
  ]

  const courses = await Promise.all(
    coursesData.map((c) =>
      prisma.course.upsert({
        where: { code: c.code },
        update: { name: c.name, dept: c.dept, semester: c.semester },
        create: c,
      })
    )
  )

  console.log('✅  Courses created:', courses.map((c) => c.code).join(', '))

  // ── Enrollments ───────────────────────────────────────────────────────────
  const student = users.find((u) => u.email === 'student@thapar.edu')!
  const contributor = users.find((u) => u.email === 'contributor@thapar.edu')!

  const ucs503 = courses.find((c) => c.code === 'UCS503')!
  const ucs301 = courses.find((c) => c.code === 'UCS301')!
  const uma008 = courses.find((c) => c.code === 'UMA008')!

  const enrollmentsData = [
    { userId: student.id, courseId: ucs503.id },
    { userId: student.id, courseId: ucs301.id },
    { userId: student.id, courseId: uma008.id },
    { userId: contributor.id, courseId: ucs503.id },
    { userId: contributor.id, courseId: ucs301.id },
  ]

  for (const e of enrollmentsData) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: e.userId, courseId: e.courseId } },
      update: {},
      create: e,
    })
  }

  console.log('✅  Enrollments seeded')

  // ── Seed Course Materials & Question Bank (UCS503) ────────────────────────
  const ucs503Doc1 = await prisma.document.upsert({
    where: { id: 'demo-doc-ucs503-mst2023' },
    update: {},
    create: {
      id: 'demo-doc-ucs503-mst2023',
      courseId: ucs503.id,
      uploaderId: contributor.id,
      title: 'UCS503 Mid-Semester Test (MST) 2023',
      type: 'PYQ',
      fileUrl: 'seed-data/UCS503/pyqs/MST_2023.txt',
      evalType: 'MST',
      year: 2023,
      session: 'Odd',
      status: 'NEEDS_REVIEW',
    },
  })

  const ucs503Doc2 = await prisma.document.upsert({
    where: { id: 'demo-doc-ucs503-slides-u1' },
    update: {},
    create: {
      id: 'demo-doc-ucs503-slides-u1',
      courseId: ucs503.id,
      uploaderId: contributor.id,
      title: 'UCS503 Unit 1: Process Framework & Agile Principles',
      type: 'SLIDES',
      fileUrl: 'seed-data/UCS503/slides/Unit1_Processes_Agile.txt',
      status: 'APPROVED',
    },
  })

  // Pending questions for Moderator Review Queue
  const q1 = await prisma.question.upsert({
    where: { id: 'demo-q1-ucs503-mst2023' },
    update: {},
    create: {
      id: 'demo-q1-ucs503-mst2023',
      courseId: ucs503.id,
      sourceDocId: ucs503Doc1.id,
      evalType: 'MST',
      year: 2023,
      marks: 5,
      type: 'SHORT',
      difficulty: 'MEDIUM',
      questionNumber: 'Q1(a)',
      text: 'Compare and contrast the Waterfall Model with Agile Scrum. Under what circumstances in an aerospace or medical device system would you recommend Waterfall over Agile? Justify with 4 criteria.',
      topicTags: ['Agile Scrum', 'Waterfall Model', 'Process Framework'],
      isApproved: false, // In Moderator Review Queue!
      confidence: 0.96,
    },
  })

  await prisma.solution.upsert({
    where: { id: 'demo-sol-q1' },
    update: {},
    create: {
      id: 'demo-sol-q1',
      questionId: q1.id,
      authorType: 'AI',
      content: `### Step-by-Step Solution

1. **Fundamental Distinction**:
   - **Waterfall**: Strictly linear and sequential (Requirements $\\to$ Design $\\to$ Implementation $\\to$ Verification $\\to$ Maintenance).
   - **Agile Scrum**: Iterative and incremental delivery organized into 2–4 week time-boxed sprints.

2. **When Waterfall is Preferred**:
   - **Stable Requirements**: Mission-critical specifications that cannot fluctuate during development.
   - **Heavy Regulatory Audits**: FDA/FAA formal milestone documentation gates.
   - **Pre-Determined Interfaces**: Hardware contracts and bus protocols frozen in advance.
   - **Low Tolerance for Emergent Architecture**: Safety-critical constraints requiring upfront proofs.`,
      isVerified: false,
    },
  })

  const q2 = await prisma.question.upsert({
    where: { id: 'demo-q2-ucs503-mst2023' },
    update: {},
    create: {
      id: 'demo-q2-ucs503-mst2023',
      courseId: ucs503.id,
      sourceDocId: ucs503Doc1.id,
      evalType: 'MST',
      year: 2023,
      marks: 10,
      type: 'LONG',
      difficulty: 'HARD',
      questionNumber: 'Q2',
      text: 'For a TIET Hostel Room Allocation and Mess Management Portal, formulate:\n(a) Two Functional Requirements adhering strictly to IEEE 830.\n(b) Two Non-Functional Requirements covering response latency and concurrent lock safety.\n(c) A Level-1 Data Flow Diagram (DFD) showing entity interactions.',
      topicTags: ['Requirements Engineering', 'IEEE 830', 'DFD'],
      isApproved: false, // In Moderator Review Queue!
      confidence: 0.94,
    },
  })

  await prisma.solution.upsert({
    where: { id: 'demo-sol-q2' },
    update: {},
    create: {
      id: 'demo-sol-q2',
      questionId: q2.id,
      authorType: 'AI',
      content: `### Step-by-Step Solution

1. **Functional Requirements (IEEE 830)**:
   - **FR-1**: The portal shall authenticate students using TIET credentials and permit room preference ranking during the active semester selection window.
   - **FR-2**: The allocation engine shall assign rooms based on CGPA merit and generate verifiable digital allotment slips.

2. **Non-Functional Requirements**:
   - **NFR-1 (Latency)**: 95th percentile page load latency under 200 ms during peak allocation traffic (5,000 concurrent users).
   - **NFR-2 (Lock Safety)**: ACID-compliant distributed transaction locks preventing double-booking of any hostel room.`,
      isVerified: false,
    },
  })

  // Seed Slide Chunks
  await prisma.slideChunk.upsert({
    where: { id: 'demo-chunk-u1-s1' },
    update: {},
    create: {
      id: 'demo-chunk-u1-s1',
      courseId: ucs503.id,
      documentId: ucs503Doc2.id,
      slideNo: 1,
      topic: 'Software Engineering Definition & Process Framework',
      text: 'Software is engineered, not manufactured. A software process framework establishes the foundation for a complete software engineering process by identifying a small number of framework activities that are applicable to all software projects: Communication, Planning, Modeling, Construction, and Deployment.',
    },
  })

  await prisma.slideChunk.upsert({
    where: { id: 'demo-chunk-u1-s2' },
    update: {},
    create: {
      id: 'demo-chunk-u1-s2',
      courseId: ucs503.id,
      documentId: ucs503Doc2.id,
      slideNo: 2,
      topic: 'Agile Principles & Scrum Mechanics',
      text: 'Agile philosophy encourages customer satisfaction through early and continuous delivery of valuable software. Scrum implements this through 15-minute Daily Standups, Sprint Planning, Sprint Review, and Sprint Retrospectives, producing a releasable increment every sprint.',
    },
  })

  // Approved questions for Question Bank, Practice Mode & Mock Quiz
  const q3 = await prisma.question.upsert({
    where: { id: 'demo-q3-ucs503-approved' },
    update: {},
    create: {
      id: 'demo-q3-ucs503-approved',
      courseId: ucs503.id,
      evalType: 'MST',
      year: 2022,
      marks: 5,
      type: 'SHORT',
      difficulty: 'MEDIUM',
      questionNumber: 'Q1',
      text: 'Explain the Spiral Model of software development. Why is risk analysis an explicit phase in the Spiral Model compared to traditional linear models? Illustrate with its four quadrants.',
      topicTags: ['Process Framework', 'Spiral Model', 'Risk Analysis'],
      isApproved: true,
      confidence: 1.0,
    },
  })

  await prisma.solution.upsert({
    where: { id: 'demo-sol-q3' },
    update: {},
    create: {
      id: 'demo-sol-q3',
      questionId: q3.id,
      authorId: users.find((u) => u.role === 'MODERATOR')?.id,
      authorType: 'MODERATOR',
      content: `### Step-by-Step Solution

1. **Spiral Model Mechanics**:
   - Developed by Barry Boehm, the Spiral Model combines iterative prototyping with the systematic control aspects of the Waterfall model.
   - It is driven by **risk analysis** at every radial loop.

2. **The Four Quadrants**:
   - **Quadrant 1 (Determine Objectives)**: Identify project objectives, alternative solutions, and constraints.
   - **Quadrant 2 (Identify & Resolve Risks)**: Evaluate alternatives, identify risks, and develop risk mitigation prototypes.
   - **Quadrant 3 (Development & Verification)**: Construct and test the system increment.
   - **Quadrant 4 (Plan Next Iteration)**: Review outcomes and plan the next spiral cycle.`,
      isVerified: true,
      verifiedBy: 'Dr. Moderator',
      upvotes: 14,
    },
  })

  const q4 = await prisma.question.upsert({
    where: { id: 'demo-q4-ucs503-approved' },
    update: {},
    create: {
      id: 'demo-q4-ucs503-approved',
      courseId: ucs503.id,
      evalType: 'MST',
      year: 2022,
      marks: 10,
      type: 'LONG',
      difficulty: 'HARD',
      questionNumber: 'Q2',
      text: 'Explain the Basic COCOMO Estimation Model. If an Organic Mode software project is estimated at $32\\text{ KLOC}$, with coefficients $a = 2.4$ and $b = 1.05$, compute the total effort in Person-Months ($\\\\text{PM}$). Show the calculation step-by-step.',
      topicTags: ['Cost Estimation', 'COCOMO', 'Software Metrics'],
      isApproved: true,
      confidence: 1.0,
    },
  })

  await prisma.solution.upsert({
    where: { id: 'demo-sol-q4' },
    update: {},
    create: {
      id: 'demo-sol-q4',
      questionId: q4.id,
      authorId: users.find((u) => u.role === 'MODERATOR')?.id,
      authorType: 'MODERATOR',
      content: `### Step-by-Step Solution

1. **COCOMO Effort Formula**:
   $$\\text{Effort} = a \\times (\\text{KLOC})^b$$

2. **Given Values**:
   - Software Size: $\\text{KLOC} = 32$
   - Constant $a = 2.4$
   - Constant $b = 1.05$

3. **Step-by-Step Calculation**:
   - Calculate $(32)^{1.05}$:
     $$(32)^{1.05} \\approx 38.055$$
   - Multiply by coefficient $a$:
     $$\\text{Effort} = 2.4 \\times 38.055 \\approx 91.33\\text{ Person-Months (PM)}$$

4. **Conclusion**:
   The required development effort is approximately **$91.33\\text{ PM}$**.`,
      isVerified: true,
      verifiedBy: 'Dr. Moderator',
      upvotes: 22,
    },
  })

  const q5 = await prisma.question.upsert({
    where: { id: 'demo-q5-ucs503-approved' },
    update: {},
    create: {
      id: 'demo-q5-ucs503-approved',
      courseId: ucs503.id,
      evalType: 'MST',
      year: 2023,
      marks: 5,
      type: 'SHORT',
      difficulty: 'EASY',
      questionNumber: 'Q3',
      text: 'Define the 3 key roles in Scrum: Scrum Master, Product Owner, and Developers. What is the explicit purpose of a Sprint Retrospective meeting?',
      topicTags: ['Agile Scrum', 'Scrum Roles', 'Sprint Planning'],
      isApproved: true,
      confidence: 1.0,
    },
  })

  await prisma.solution.upsert({
    where: { id: 'demo-sol-q5' },
    update: {},
    create: {
      id: 'demo-sol-q5',
      questionId: q5.id,
      authorType: 'AI',
      content: `### Step-by-Step Solution

1. **Product Owner**: Defines features and prioritizes the Product Backlog to maximize product value.
2. **Scrum Master**: Facilitates Agile practices, removes external impediments, and shields the sprint team.
3. **Developers**: Self-organizing engineering professionals who create the releasable product increment.
4. **Sprint Retrospective**: An inspection and adaptation meeting held at the end of each sprint to evaluate process effectiveness, interpersonal collaboration, and identify specific improvements for the next sprint.`,
      isVerified: false,
      upvotes: 8,
    },
  })

  // Pre-seed Topic Weightages so Dashboard and Analytics have initial records
  const weightagesData = [
    {
      courseId: ucs503.id,
      evalType: 'MST' as const,
      topic: 'Agile Scrum',
      frequencyScore: 85,
      marksShare: 32.5,
      yearTrend: [{ year: 2022, marks: 10, count: 1 }, { year: 2023, marks: 15, count: 2 }],
    },
    {
      courseId: ucs503.id,
      evalType: 'MST' as const,
      topic: 'Process Framework',
      frequencyScore: 70,
      marksShare: 25.0,
      yearTrend: [{ year: 2022, marks: 10, count: 1 }, { year: 2023, marks: 5, count: 1 }],
    },
    {
      courseId: ucs503.id,
      evalType: 'MST' as const,
      topic: 'Cost Estimation',
      frequencyScore: 60,
      marksShare: 20.0,
      yearTrend: [{ year: 2022, marks: 10, count: 1 }],
    },
    {
      courseId: ucs503.id,
      evalType: 'MST' as const,
      topic: 'Requirements Engineering',
      frequencyScore: 50,
      marksShare: 15.0,
      yearTrend: [{ year: 2023, marks: 10, count: 1 }],
    },
  ]

  for (const w of weightagesData) {
    await prisma.topicWeightage.upsert({
      where: {
        courseId_evalType_topic: {
          courseId: w.courseId,
          evalType: w.evalType,
          topic: w.topic,
        },
      },
      update: {},
      create: w,
    })
  }

  // ── Seed Academic Calendar Events ─────────────────────────────────────────
  const today = new Date()
  const inFourDays = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
  inFourDays.setHours(10, 0, 0, 0)

  const inTwelveDays = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000)
  inTwelveDays.setHours(14, 0, 0, 0)

  const inThirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  inThirtyDays.setHours(9, 30, 0, 0)

  await prisma.calendarEvent.upsert({
    where: { id: 'demo-cal-mst' },
    update: {},
    create: {
      id: 'demo-cal-mst',
      courseId: ucs503.id,
      batchId: null, // Course-wide event
      title: 'Mid-Semester Test (MST)',
      type: 'MST',
      start: inFourDays,
      venue: 'LP-108 & LP-109',
      syllabusTopicIds: [
        'Unit 1: Process Framework & Agile Models',
        'Unit 2: Software Requirements & IEEE 830',
      ],
      weightage: 30,
      notes: 'Standard TIET MST. Calculator allowed. Bring identity card.',
      isApproved: true,
    },
  })

  await prisma.calendarEvent.upsert({
    where: { id: 'demo-cal-lab' },
    update: {},
    create: {
      id: 'demo-cal-lab',
      courseId: ucs503.id,
      batchId: batchCoe2.id, // Group-specific event for COE-2-2C12
      title: 'Lab Evaluation 2: UML Modeling & Git Workflow',
      type: 'LAB_EVAL',
      start: inTwelveDays,
      venue: 'CS Lab 4',
      syllabusTopicIds: ['Use Case Diagrams', 'Class Diagrams', 'Git Collaboration'],
      weightage: 15,
      notes: 'Group viva and live modeling submission.',
      isApproved: true,
    },
  })

  await prisma.calendarEvent.upsert({
    where: { id: 'demo-cal-est' },
    update: {},
    create: {
      id: 'demo-cal-est',
      courseId: ucs503.id,
      batchId: null,
      title: 'End-Semester Examination (EST)',
      type: 'EST',
      start: inThirtyDays,
      venue: 'Central Exam Hall A',
      syllabusTopicIds: ['Comprehensive Syllabus (Units 1 - 4)'],
      weightage: 50,
      notes: 'Final semester examination.',
      isApproved: true,
    },
  })

  // ── Seed Discussion Forum Threads & Posts ─────────────────────────────────
  const thread1 = await prisma.forumThread.upsert({
    where: { id: 'demo-thread-mst-scope' },
    update: {},
    create: {
      id: 'demo-thread-mst-scope',
      courseId: ucs503.id,
      authorId: users.find((u) => u.role === 'CR')?.id || student.id,
      title: 'Official MST Scope & Instructions for 3rd Year COE (All Subgroups)',
      content: 'Hey everyone in 3rd year COE! The faculty confirmed that our upcoming MST will test Units 1 & 2 only (Software Processes, Life Cycle Models, Agile Scrum, and Requirements Engineering adhering to IEEE 830). Calculator is allowed for COCOMO if it appears. Feel free to ask doubts below.',
      tags: ['#MST', '#syllabus', '#COE3'],
      isPinned: true,
      views: 142,
    },
  })

  await prisma.forumPost.upsert({
    where: { id: 'demo-post-t1-reply1' },
    update: {},
    create: {
      id: 'demo-post-t1-reply1',
      threadId: thread1.id,
      authorId: student.id,
      content: 'Thanks Rahul! Are Level-1 DFD diagrams also in scope for the MST?',
      upvotes: 4,
    },
  })

  await prisma.forumPost.upsert({
    where: { id: 'demo-post-t1-reply2' },
    update: {},
    create: {
      id: 'demo-post-t1-reply2',
      threadId: thread1.id,
      authorId: users.find((u) => u.role === 'MODERATOR')?.id || contributor.id,
      content: 'Yes! Review Slide Deck 10 (Data Flow Diagrams). There is consistently a 10-mark question on functional requirements with a DFD or Use Case diagram.',
      isAccepted: true,
      upvotes: 12,
    },
  })

  const thread2 = await prisma.forumThread.upsert({
    where: { id: 'demo-thread-q1-discuss' },
    update: {},
    create: {
      id: 'demo-thread-q1-discuss',
      courseId: ucs503.id,
      questionId: q1.id,
      authorId: student.id,
      title: 'Discussing MST 2023 Q1(a): When to choose Waterfall over Agile Scrum?',
      content: 'I noticed this question appeared in both 2022 and 2023 MST papers. What are the best 4 points to write to get full 5 marks? Does the medical device example count?',
      tags: ['#doubt', '#solutions', '#Agile'],
      views: 89,
    },
  })

  await prisma.forumPost.upsert({
    where: { id: 'demo-post-t2-ai' },
    update: {},
    create: {
      id: 'demo-post-t2-ai',
      threadId: thread2.id,
      authorId: contributor.id,
      content: `Here is the verified answer from senior notes:
1. **Regulatory Compliance**: Strict FDA/FAA audits requiring phase-frozen documentation.
2. **Stable Non-Fluctuating Specs**: Fixed hardware bus interfaces.
3. **Well-Understood Technology**: Team has built identical systems before.
4. **Safety-Critical Verification**: Formal proof requirements where emergent sprint architecture is unacceptable.`,
      isAccepted: true,
      isAiGenerated: false,
      upvotes: 9,
    },
  })

  console.log('✅  Sample course materials, questions, weightages, calendar & forum threads seeded')
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎓  TIET ExamPrep — Demo Accounts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Email                      Role          Password
  student@thapar.edu         STUDENT       demo123
  contributor@thapar.edu     CONTRIBUTOR   demo123
  moderator@thapar.edu       MODERATOR     demo123
  cr@thapar.edu              CR            demo123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  App: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
