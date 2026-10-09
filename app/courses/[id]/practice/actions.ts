'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { EvalType } from '@prisma/client'

export async function createPracticeSession(
  courseId: string,
  evalType?: EvalType
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to practice.')
  }

  const newSession = await prisma.practiceSession.create({
    data: {
      userId: session.user.id,
      courseId,
      evalType: evalType || undefined,
    },
  })

  return { sessionId: newSession.id }
}

export async function recordPracticeAttempt({
  sessionId,
  questionId,
  selfMarks,
  userAnswer,
}: {
  sessionId: string
  questionId: string
  selfMarks: number
  userAnswer?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const attempt = await prisma.practiceAttempt.create({
    data: {
      sessionId,
      questionId,
      selfMarks,
      userAnswer,
      isCorrect: selfMarks > 0,
    },
  })

  return { attemptId: attempt.id }
}

export async function completePracticeSession(
  sessionId: string,
  totalScore: number
) {
  await prisma.practiceSession.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      totalScore,
    },
  })

  return { success: true }
}
