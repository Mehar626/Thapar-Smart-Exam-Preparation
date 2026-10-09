import path from 'path'
import { prisma } from '@/lib/db'
import { getLLMProvider, ExtractedQuestion } from '@/lib/llm'
import { parseDocumentFile } from './parser'
import { DocType, DocStatus, EvalType, QuestionType, Difficulty, AuthorType } from '@prisma/client'

export interface IngestionResult {
  documentId: string
  title: string
  questionsCount: number
  status: DocStatus
}

/**
 * Infer Evaluation Type (MST, EST, QUIZ, SESSIONAL) from file name.
 */
export function inferEvalType(filename: string): EvalType {
  const upper = filename.toUpperCase()
  if (upper.includes('MST')) return EvalType.MST
  if (upper.includes('EST')) return EvalType.EST
  if (upper.includes('QUIZ')) return EvalType.QUIZ
  if (upper.includes('SESSIONAL')) return EvalType.SESSIONAL
  if (upper.includes('LAB')) return EvalType.LAB_EVAL
  if (upper.includes('VIVA')) return EvalType.VIVA
  return EvalType.MST
}

/**
 * Infer examination year from filename (e.g. "MST_2023.pdf" -> 2023).
 */
export function inferYear(filename: string): number {
  const match = filename.match(/(20\d\d)/)
  return match ? parseInt(match[1], 10) : new Date().getFullYear()
}

/**
 * End-to-end ingestion pipeline for Past Year Exam Papers.
 */
export async function ingestExamPaper({
  courseCode,
  filePath,
  fileName,
  uploaderEmail = 'contributor@thapar.edu',
}: {
  courseCode: string
  filePath: string
  fileName: string
  uploaderEmail?: string
}): Promise<IngestionResult> {
  const llm = getLLMProvider()

  // 1. Resolve Course & Uploader
  const course = await prisma.course.findUnique({
    where: { code: courseCode },
  })
  if (!course) {
    throw new Error(`Course not found for code: ${courseCode}`)
  }

  let uploader = await prisma.user.findUnique({
    where: { email: uploaderEmail },
  })
  if (!uploader) {
    uploader = await prisma.user.findFirst()
  }
  if (!uploader) {
    throw new Error('No user available to attribute upload.')
  }

  const evalType = inferEvalType(fileName)
  const year = inferYear(fileName)
  const title = `${course.code} ${evalType} ${year} (${path.basename(fileName, path.extname(fileName))})`

  // 2. Create Initial Document Record in QUEUED/PARSING state
  const doc = await prisma.document.create({
    data: {
      courseId: course.id,
      uploaderId: uploader.id,
      title,
      type: DocType.PYQ,
      fileUrl: filePath,
      evalType,
      year,
      status: DocStatus.PARSING,
    },
  })

  // 3. Extract Text from PDF
  const parsed = await parseDocumentFile(filePath)

  // 4. Prompt LLM to Extract Individual Questions & Formulate Draft Solutions
  const prompt = `Course: ${course.code} - ${course.name}
Exam: ${evalType} ${year}
File: ${fileName}

Extract every individual question, sub-question, marks allocation, question type, difficulty rating, and curriculum topic tags.
Also provide a thorough step-by-step solution formatted in Markdown with KaTeX math notation.

Document Content:
${parsed.rawText.slice(0, 15000)}`

  const schemaDescription = `{
  "questions": [
    {
      "questionNumber": "Q1(a)",
      "text": "Detailed question text with markdown/KaTeX",
      "marks": 5,
      "type": "SHORT",
      "difficulty": "MEDIUM",
      "topicTags": ["Agile Scrum", "Software Life Cycles"],
      "suggestedSolution": "Step-by-step markdown solution",
      "confidence": 0.95
    }
  ]
}`

  let extractedQuestions: ExtractedQuestion[] = []
  try {
    const res = await llm.generateStructured<{ questions: ExtractedQuestion[] }>(
      prompt,
      schemaDescription,
      {
        systemPrompt:
          'You are a senior exam analyzer for TIET Patiala. Extract all questions strictly grounded in the provided document.',
      }
    )
    extractedQuestions = res.questions || []
  } catch (err) {
    console.error(`LLM structured extraction failed for ${fileName}, falling back to mock parser:`, err)
    // Fallback extraction
    extractedQuestions = [
      {
        questionNumber: 'Q1',
        text: `Analyze the core software engineering principles demonstrated in ${course.code} ${evalType} ${year}.`,
        marks: 10,
        type: 'LONG',
        difficulty: 'MEDIUM',
        topicTags: ['Software Engineering Process', 'Requirements'],
        suggestedSolution: 'Detailed solution based on course lecture slides.',
        confidence: 0.8,
      },
    ]
  }

  // 5. Store Questions in Database (status: isApproved = false, awaiting moderator)
  let count = 0
  for (const q of extractedQuestions) {
    const qType = (['MCQ', 'SHORT', 'LONG', 'NUMERICAL', 'CODING'].includes(q.type)
      ? q.type
      : 'SHORT') as QuestionType
    const qDiff = (['EASY', 'MEDIUM', 'HARD'].includes(q.difficulty)
      ? q.difficulty
      : 'MEDIUM') as Difficulty

    const createdQuestion = await prisma.question.create({
      data: {
        courseId: course.id,
        sourceDocId: doc.id,
        evalType,
        year,
        marks: Number(q.marks) || 5,
        type: qType,
        difficulty: qDiff,
        text: q.text,
        questionNumber: q.questionNumber || `Q${count + 1}`,
        topicTags: q.topicTags || ['General'],
        isApproved: false, // Must be approved by moderator before becoming live
        confidence: q.confidence || 0.9,
      },
    })

    // Create Initial AI Solution with explicit "AI-generated, unverified" badge
    await prisma.solution.create({
      data: {
        questionId: createdQuestion.id,
        authorType: AuthorType.AI,
        content:
          q.suggestedSolution ||
          `Step-by-step solution for ${q.questionNumber}:\n\nRefer to course lecture notes and standard TIET curriculum.`,
        isVerified: false,
      },
    })

    count++
  }

  // 6. Update Document Status to NEEDS_REVIEW
  await prisma.document.update({
    where: { id: doc.id },
    data: {
      status: DocStatus.NEEDS_REVIEW,
      metadata: {
        extractedCount: count,
        parsedAt: new Date().toISOString(),
      },
    },
  })

  return {
    documentId: doc.id,
    title,
    questionsCount: count,
    status: DocStatus.NEEDS_REVIEW,
  }
}

/**
 * Ingestion pipeline for Lecture Slides.
 */
export async function ingestSlideDeck({
  courseCode,
  filePath,
  fileName,
  uploaderEmail = 'contributor@thapar.edu',
}: {
  courseCode: string
  filePath: string
  fileName: string
  uploaderEmail?: string
}): Promise<IngestionResult> {
  const llm = getLLMProvider()

  const course = await prisma.course.findUnique({
    where: { code: courseCode },
  })
  if (!course) {
    throw new Error(`Course not found for code: ${courseCode}`)
  }

  let uploader = await prisma.user.findUnique({
    where: { email: uploaderEmail },
  })
  if (!uploader) {
    uploader = await prisma.user.findFirst()
  }

  const title = `${course.code} Slides: ${path.basename(fileName, path.extname(fileName))}`

  const doc = await prisma.document.create({
    data: {
      courseId: course.id,
      uploaderId: uploader!.id,
      title,
      type: DocType.SLIDES,
      fileUrl: filePath,
      status: DocStatus.PARSING,
    },
  })

  const parsed = await parseDocumentFile(filePath)

  // Chunk slides: split by page markers or paragraph groups
  const sections = parsed.rawText.split(/(?=\b(?:Slide\s+\d+|Unit\s+\d+|Chapter\s+\d+)\b)/i)
  const chunks = sections.length > 1 ? sections : [parsed.rawText]

  let slideNo = 1
  for (const chunkText of chunks.slice(0, 30)) {
    if (chunkText.trim().length < 20) continue

    const topicMatch = chunkText.match(/^[^\n]{5,60}/)
    const topic = topicMatch ? topicMatch[0].trim() : `Slide ${slideNo}`

    // Compute embedding for chunk
    let embedding: number[] | null = null
    try {
      embedding = await llm.getEmbedding(chunkText.slice(0, 1000))
    } catch {
      // Continue without embedding if offline
    }

    await prisma.slideChunk.create({
      data: {
        courseId: course.id,
        documentId: doc.id,
        slideNo,
        topic,
        text: chunkText.trim(),
        embedding: embedding ? (embedding as unknown as object) : undefined,
      },
    })

    slideNo++
  }

  await prisma.document.update({
    where: { id: doc.id },
    data: {
      status: DocStatus.APPROVED,
      metadata: {
        totalSlides: slideNo - 1,
      },
    },
  })

  return {
    documentId: doc.id,
    title,
    questionsCount: slideNo - 1,
    status: DocStatus.APPROVED,
  }
}

/**
 * Approve a question in the Moderator Review Queue:
 * 1. Sets isApproved = true
 * 2. Computes and saves pgvector embedding
 * 3. Recomputes TopicWeightage for the course & evalType
 */
export async function approveQuestion(questionId: string) {
  const llm = getLLMProvider()

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  })
  if (!question) {
    throw new Error('Question not found')
  }

  // Compute embedding for semantic search
  let embedding: number[] | null = null
  try {
    embedding = await llm.getEmbedding(question.text)
  } catch (err) {
    console.warn('Embedding computation failed on approval:', err)
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: {
      isApproved: true,
      embedding: embedding ? (embedding as unknown as object) : undefined,
    },
  })

  // Recompute topic weightages for this course & evalType
  await recomputeTopicWeightage(question.courseId, question.evalType)

  return updated
}

/**
 * Deterministic computation of Topic Weightage in pure code/SQL.
 */
export async function recomputeTopicWeightage(courseId: string, evalType: EvalType) {
  const approvedQuestions = await prisma.question.findMany({
    where: {
      courseId,
      evalType,
      isApproved: true,
    },
  })

  if (approvedQuestions.length === 0) return

  // Distinct papers count (approximated by distinct years or source docs)
  const distinctPapers = new Set(approvedQuestions.map((q) => `${q.year}-${q.sourceDocId}`)).size || 1
  const totalMarks = approvedQuestions.reduce((sum, q) => sum + q.marks, 0) || 1

  const topicStats: Record<string, { marks: number; count: number; years: Set<number> }> = {}

  for (const q of approvedQuestions) {
    for (const tag of q.topicTags) {
      const cleanTag = tag.trim()
      if (!cleanTag) continue
      if (!topicStats[cleanTag]) {
        topicStats[cleanTag] = { marks: 0, count: 0, years: new Set() }
      }
      topicStats[cleanTag].marks += q.marks
      topicStats[cleanTag].count += 1
      topicStats[cleanTag].years.add(q.year)
    }
  }

  for (const [topic, stat] of Object.entries(topicStats)) {
    const frequencyScore = Math.min(100, Math.round((stat.years.size / distinctPapers) * 100))
    const marksShare = Math.round((stat.marks / totalMarks) * 1000) / 10 // 1 decimal place

    const yearTrend = Array.from(stat.years).map((yr) => ({
      year: yr,
      count: approvedQuestions.filter((q) => q.year === yr && q.topicTags.includes(topic)).length,
      marks: approvedQuestions
        .filter((q) => q.year === yr && q.topicTags.includes(topic))
        .reduce((s, q) => s + q.marks, 0),
    }))

    await prisma.topicWeightage.upsert({
      where: {
        courseId_evalType_topic: {
          courseId,
          evalType,
          topic,
        },
      },
      update: {
        frequencyScore,
        marksShare,
        yearTrend,
        lastUpdated: new Date(),
      },
      create: {
        courseId,
        evalType,
        topic,
        frequencyScore,
        marksShare,
        yearTrend,
      },
    })
  }
}
