/**
 * Universal Course Ingestion CLI
 * Usage:
 *   npx tsx scripts/ingest.ts <COURSE_CODE>
 *   npm run ingest -- <COURSE_CODE>
 *
 * Example:
 *   npm run ingest -- UCS503
 */

import fs from 'fs'
import path from 'path'
import { prisma } from '../lib/db'
import { ingestExamPaper, ingestSlideDeck } from '../lib/ingestion/pipeline'

async function run() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
  const courseCode = (args[0] || 'UCS503').toUpperCase()

  console.log(`\n======================================================`)
  console.log(`  🎓 TIET ExamPrep Ingestion Pipeline — ${courseCode}`)
  console.log(`======================================================\n`)

  const course = await prisma.course.findUnique({
    where: { code: courseCode },
  })

  if (!course) {
    console.error(`❌ Course "${courseCode}" not found in database. Please run db:seed first.`)
    process.exit(1)
  }

  const baseDir = path.resolve(process.cwd(), 'seed-data', courseCode)
  const pyqsDir = path.join(baseDir, 'pyqs')
  const slidesDir = path.join(baseDir, 'slides')

  fs.mkdirSync(pyqsDir, { recursive: true })
  fs.mkdirSync(slidesDir, { recursive: true })

  // ── Seed sample materials if user hasn't dropped files yet ──
  const existingPyqs = fs.readdirSync(pyqsDir).filter((f) => !f.startsWith('.'))
  if (existingPyqs.length === 0) {
    console.log(`ℹ️  No PYQ files found in ${pyqsDir}. Creating starter papers for prototype demonstration...`)
    fs.writeFileSync(
      path.join(pyqsDir, 'MST_2023.txt'),
      `THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY, PATIALA
Department of Computer Science & Engineering
Course: UCS503 Software Engineering | Mid-Semester Test (MST) 2023
Time: 2 Hours | Maximum Marks: 30

Q1(a) [5 Marks] [Agile Scrum, Life Cycle Models]
Compare the Waterfall Model with Agile Scrum. Under what circumstances would you recommend Waterfall over Agile in a defense or medical device application?

Q1(b) [5 Marks] [Extreme Programming, Pair Programming]
Explain the principles of Extreme Programming (XP). How does Pair Programming improve defect detection rates during active development sprints?

Q2 [10 Marks] [Requirements Engineering, IEEE 830, Use Cases]
For a Hospital ICU Patient Monitoring System, write:
(i) Two Functional Requirements conforming to IEEE 830 standard.
(ii) Two Non-Functional Requirements covering latency and fault tolerance.
(iii) Draw a Use Case diagram describing interactions between Nurse, Doctor, and Telemetry Engine.

Q3 [10 Marks] [Software Metrics, Estimation, COCOMO]
Explain the Basic and Intermediate COCOMO models. If a software project is estimated at 32 KLOC in an Organic mode (a=2.4, b=1.05), calculate the required effort in Person-Months.
`
    )

    fs.writeFileSync(
      path.join(pyqsDir, 'MST_2022.txt'),
      `THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY, PATIALA
Course: UCS503 Software Engineering | Mid-Semester Test (MST) 2022
Maximum Marks: 30

Q1 [10 Marks] [Software Processes, Spiral Model, Risk Management]
Explain the Spiral Model of software development. Why is risk analysis an explicit phase in Spiral compared to Waterfall? Draw the four quadrants of the Spiral model.

Q2 [10 Marks] [Requirements Elicitation, SRS Validation]
Discuss the key challenges encountered during Requirements Elicitation. Differentiate between Functional and Non-Functional requirements with concrete TIET examples.

Q3 [10 Marks] [Agile Scrum, Sprint Retrospective]
Describe the roles in a Scrum team: Scrum Master, Product Owner, and Development Team. What occurs during a Sprint Retrospective meeting?
`
    )
  }

  const existingSlides = fs.readdirSync(slidesDir).filter((f) => !f.startsWith('.'))
  if (existingSlides.length === 0) {
    console.log(`ℹ️  No slide files found in ${slidesDir}. Creating starter lecture slides...`)
    fs.writeFileSync(
      path.join(slidesDir, 'Unit1_Processes_Agile.txt'),
      `Slide 1: Introduction to Software Engineering & Processes
Unit 1: Generic Process Framework, Waterfall, V-Model, Prototyping.
Key concept: Software is engineered, not manufactured.

Slide 2: Agile Manifesto & Core Values
1. Individuals and interactions over processes and tools
2. Working software over comprehensive documentation
3. Customer collaboration over contract negotiation
4. Responding to change over following a plan

Slide 3: Scrum Framework Mechanics
Sprint Planning, Daily Standup (15 mins), Sprint Review, Sprint Retrospective.
Artifacts: Product Backlog, Sprint Backlog, Increment (Definition of Done).
`
    )
  }

  // ── Ingest PYQ Papers ──
  const pyqFiles = fs.readdirSync(pyqsDir).filter((f) => !f.startsWith('.'))
  console.log(`📄 Found ${pyqFiles.length} past exam paper(s) to process in ${pyqsDir}`)

  const paperResults = []
  for (const file of pyqFiles) {
    const fullPath = path.join(pyqsDir, file)
    console.log(`   ⏳ Processing paper: ${file}...`)
    try {
      const res = await ingestExamPaper({
        courseCode,
        filePath: fullPath,
        fileName: file,
      })
      paperResults.push(res)
      console.log(`   ✅ Extracted ${res.questionsCount} questions -> status: ${res.status}`)
    } catch (e) {
      console.error(`   ❌ Failed to process ${file}:`, (e as Error).message)
    }
  }

  // ── Ingest Slides ──
  const slideFiles = fs.readdirSync(slidesDir).filter((f) => !f.startsWith('.'))
  console.log(`\n📊 Found ${slideFiles.length} slide deck(s) to process in ${slidesDir}`)

  const slideResults = []
  for (const file of slideFiles) {
    const fullPath = path.join(slidesDir, file)
    console.log(`   ⏳ Processing slide deck: ${file}...`)
    try {
      const res = await ingestSlideDeck({
        courseCode,
        filePath: fullPath,
        fileName: file,
      })
      slideResults.push(res)
      console.log(`   ✅ Parsed ${res.questionsCount} slides -> status: ${res.status}`)
    } catch (e) {
      console.error(`   ❌ Failed to process slide deck ${file}:`, (e as Error).message)
    }
  }

  console.log(`\n======================================================`)
  console.log(`  🎉 Ingestion Complete for ${courseCode}!`)
  console.log(`  - Papers Processed: ${paperResults.length}`)
  console.log(`  - Questions Queued for Review: ${paperResults.reduce((s, r) => s + r.questionsCount, 0)}`)
  console.log(`  - Slide Chunks Indexed: ${slideResults.reduce((s, r) => s + r.questionsCount, 0)}`)
  console.log(`  - Moderator Review: Visit http://localhost:3000/admin to approve questions`)
  console.log(`======================================================\n`)
}

run()
  .catch((e) => {
    console.error('Fatal error during ingestion:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
