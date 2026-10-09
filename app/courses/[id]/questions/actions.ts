'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { AuthorType } from '@prisma/client'

export async function voteSolution(solutionId: string, isUpvote: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to vote.')
  }

  const userId = session.user.id

  const existingVote = await prisma.solutionVote.findUnique({
    where: {
      solutionId_userId: {
        solutionId,
        userId,
      },
    },
  })

  if (existingVote) {
    if (existingVote.isUpvote === isUpvote) {
      // Toggle off vote
      await prisma.solutionVote.delete({
        where: { id: existingVote.id },
      })
      await prisma.solution.update({
        where: { id: solutionId },
        data: {
          [isUpvote ? 'upvotes' : 'downvotes']: { decrement: 1 },
        },
      })
    } else {
      // Switch vote
      await prisma.solutionVote.update({
        where: { id: existingVote.id },
        data: { isUpvote },
      })
      await prisma.solution.update({
        where: { id: solutionId },
        data: {
          upvotes: { [isUpvote ? 'increment' : 'decrement']: 1 },
          downvotes: { [isUpvote ? 'decrement' : 'increment']: 1 },
        },
      })
    }
  } else {
    // New vote
    await prisma.solutionVote.create({
      data: {
        solutionId,
        userId,
        isUpvote,
      },
    })
    await prisma.solution.update({
      where: { id: solutionId },
      data: {
        [isUpvote ? 'upvotes' : 'downvotes']: { increment: 1 },
      },
    })
  }

  return { success: true }
}

export async function submitCommunitySolution(
  questionId: string,
  content: string,
  courseId: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to submit a solution.')
  }

  const cleanContent = content.trim()
  if (cleanContent.length < 15) {
    throw new Error('Solution content must be at least 15 characters.')
  }

  const isModerator = session.user.role === 'MODERATOR'

  await prisma.solution.create({
    data: {
      questionId,
      authorId: session.user.id,
      authorType: isModerator ? AuthorType.MODERATOR : AuthorType.USER,
      content: cleanContent,
      isVerified: isModerator, // Automatically verified if moderator submitted
      verifiedBy: isModerator ? session.user.name : undefined,
    },
  })

  revalidatePath(`/courses/${courseId}/questions`)
  return { success: true }
}
