import { prisma } from '@/lib/db'
import { getLLMProvider } from '@/lib/llm'

export interface RetrievedPassage {
  id: string
  sourceType: 'SLIDE' | 'PYQ'
  title: string
  citation: string
  content: string
  relevanceScore: number
}

/**
 * Compute cosine similarity between two numeric vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Hybrid retrieval combining vector semantic similarity with keyword & metadata filters.
 */
export async function hybridRetrieve({
  query,
  courseId,
  topK = 5,
}: {
  query: string
  courseId: string
  topK?: number
}): Promise<RetrievedPassage[]> {
  const llm = getLLMProvider()
  const lowerQuery = query.toLowerCase()

  // 1. Compute query vector
  let queryVector: number[] = []
  try {
    queryVector = await llm.getEmbedding(query)
  } catch (err) {
    console.warn('Embedding computation failed during retrieval, relying on keyword ranking:', err)
  }

  // 2. Fetch candidate Slide Chunks
  const slideChunks = await prisma.slideChunk.findMany({
    where: { courseId },
    include: { document: { select: { title: true } } },
    take: 30,
  })

  // 3. Fetch candidate Approved Questions
  const questions = await prisma.question.findMany({
    where: { courseId, isApproved: true },
    include: {
      sourceDocument: { select: { title: true } },
      solutions: { select: { content: true, isVerified: true, authorType: true } },
    },
    take: 30,
  })

  const results: RetrievedPassage[] = []

  // Score slide chunks
  for (const chunk of slideChunks) {
    let score = 0
    // Vector similarity
    if (queryVector.length > 0 && Array.isArray(chunk.embedding)) {
      score += cosineSimilarity(queryVector, chunk.embedding as unknown as number[]) * 0.7
    }
    // Keyword match
    if (chunk.text.toLowerCase().includes(lowerQuery)) score += 0.3
    if (chunk.topic?.toLowerCase().includes(lowerQuery)) score += 0.4

    results.push({
      id: chunk.id,
      sourceType: 'SLIDE',
      title: `${chunk.document.title} (Slide ${chunk.slideNo})`,
      citation: `[Slide ${chunk.slideNo}: ${chunk.topic || chunk.document.title}]`,
      content: chunk.text,
      relevanceScore: Math.min(1.0, score || 0.5),
    })
  }

  // Score questions
  for (const q of questions) {
    let score = 0
    if (queryVector.length > 0 && Array.isArray(q.embedding)) {
      score += cosineSimilarity(queryVector, q.embedding as unknown as number[]) * 0.7
    }
    if (q.text.toLowerCase().includes(lowerQuery)) score += 0.3
    if (q.topicTags.some((t) => lowerQuery.includes(t.toLowerCase()))) score += 0.4

    const solutionSnippet = q.solutions[0]?.content
      ? `\nSolution:\n${q.solutions[0].content.slice(0, 300)}...`
      : ''

    results.push({
      id: q.id,
      sourceType: 'PYQ',
      title: `${q.evalType} ${q.year} - ${q.questionNumber || 'Question'} (${q.marks}M)`,
      citation: `[TIET ${q.evalType} ${q.year}: ${q.questionNumber || 'Q'}, ${q.marks} Marks]`,
      content: `${q.text}${solutionSnippet}`,
      relevanceScore: Math.min(1.0, score || 0.6),
    })
  }

  // Sort by relevanceScore descending and return topK
  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK)
}
