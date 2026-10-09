'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { approveQuestion, recomputeTopicWeightage } from '@/lib/ingestion/pipeline'
import { revalidatePath } from 'next/cache'
import { Difficulty } from '@prisma/client'

async function requireModerator() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'MODERATOR') {
    throw new Error('Unauthorized: Moderator role required.')
  }
  return session.user
}

export async function approveQuestionAction(questionId: string) {
  await requireModerator()
  await approveQuestion(questionId)
  revalidatePath('/admin')
  revalidatePath('/courses')
  return { success: true }
}

export async function rejectQuestionAction(questionId: string, reason: string) {
  await requireModerator()
  await prisma.question.delete({
    where: { id: questionId },
  })
  revalidatePath('/admin')
  return { success: true }
}

export async function updateQuestionAction(
  questionId: string,
  data: {
    marks?: number
    topicTags?: string[]
    difficulty?: Difficulty
    text?: string
  }
) {
  await requireModerator()
  await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(data.marks !== undefined && { marks: data.marks }),
      ...(data.topicTags && { topicTags: data.topicTags }),
      ...(data.difficulty && { difficulty: data.difficulty }),
      ...(data.text && { text: data.text }),
    },
  })
  revalidatePath('/admin')
  return { success: true }
}

export async function approveAllPendingAction(courseId?: string) {
  await requireModerator()

  const pending = await prisma.question.findMany({
    where: {
      isApproved: false,
      ...(courseId && { courseId }),
    },
  })

  for (const q of pending) {
    await approveQuestion(q.id)
  }

  // Update associated documents status to APPROVED
  const docIds = Array.from(new Set(pending.map((p) => p.sourceDocId).filter(Boolean))) as string[]
  for (const docId of docIds) {
    await prisma.document.update({
      where: { id: docId },
      data: { status: 'APPROVED' },
    })
  }

  revalidatePath('/admin')
  revalidatePath('/courses')
  return { approvedCount: pending.length }
}
