'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getLLMProvider } from '@/lib/llm'
import { hybridRetrieve } from '@/lib/vector/hybrid'

export async function createThreadAction(data: {
  courseId?: string
  questionId?: string
  title: string
  content: string
  tags: string[]
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to start a discussion.')
  }

  const thread = await prisma.forumThread.create({
    data: {
      courseId: data.courseId || null,
      questionId: data.questionId || null,
      authorId: session.user.id,
      title: data.title.trim(),
      content: data.content.trim(),
      tags: data.tags,
    },
  })

  if (data.courseId) {
    revalidatePath(`/courses/${data.courseId}/discuss`)
  }
  revalidatePath('/dashboard')

  return { threadId: thread.id }
}

export async function createPostAction(data: {
  threadId: string
  content: string
  courseId: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to reply.')
  }

  const post = await prisma.forumPost.create({
    data: {
      threadId: data.threadId,
      authorId: session.user.id,
      content: data.content.trim(),
    },
  })

  revalidatePath(`/courses/${data.courseId}/discuss/${data.threadId}`)
  return { postId: post.id }
}

export async function votePostAction(postId: string, isUpvote: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to vote.')
  }

  await prisma.forumPost.update({
    where: { id: postId },
    data: {
      upvotes: { [isUpvote ? 'increment' : 'decrement']: 1 },
    },
  })

  return { success: true }
}

export async function markAcceptedAnswerAction(
  threadId: string,
  postId: string,
  courseId: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const thread = await prisma.forumThread.findUnique({
    where: { id: threadId },
  })

  // Author or moderator can accept
  const isAuthor = thread?.authorId === session.user.id
  const isModerator = session.user.role === 'MODERATOR'

  if (!isAuthor && !isModerator) {
    throw new Error('Only the thread author or a moderator can mark the accepted answer.')
  }

  // Clear previous accepted
  await prisma.forumPost.updateMany({
    where: { threadId, isAccepted: true },
    data: { isAccepted: false },
  })

  await prisma.forumPost.update({
    where: { id: postId },
    data: { isAccepted: true },
  })

  await prisma.forumThread.update({
    where: { id: threadId },
    data: { acceptedPostId: postId },
  })

  revalidatePath(`/courses/${courseId}/discuss/${threadId}`)
  return { success: true }
}

export async function moderateThreadAction(
  threadId: string,
  action: 'PIN' | 'LOCK' | 'DELETE',
  courseId: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'MODERATOR') {
    throw new Error('Only moderators can perform moderation actions.')
  }

  if (action === 'DELETE') {
    await prisma.forumThread.delete({
      where: { id: threadId },
    })
  } else if (action === 'PIN') {
    const thread = await prisma.forumThread.findUnique({ where: { id: threadId } })
    await prisma.forumThread.update({
      where: { id: threadId },
      data: { isPinned: !thread?.isPinned },
    })
  } else if (action === 'LOCK') {
    const thread = await prisma.forumThread.findUnique({ where: { id: threadId } })
    await prisma.forumThread.update({
      where: { id: threadId },
      data: { isLocked: !thread?.isLocked },
    })
  }

  revalidatePath(`/courses/${courseId}/discuss`)
  revalidatePath(`/courses/${courseId}/discuss/${threadId}`)
  return { success: true }
}

export async function askAiInThreadAction(
  threadId: string,
  questionPrompt: string,
  courseId: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to trigger AI help.')
  }

  const llm = getLLMProvider()
  const passages = await hybridRetrieve({ query: questionPrompt, courseId, topK: 3 })

  const contextStr = passages.map((p) => `${p.citation}: ${p.content}`).join('\n\n')

  const systemPrompt = `You are TIET-GPT answering a student doubt in the course discussion forum.
Ground your answer ONLY in the provided course material. Provide concise bullet points and cite the exact slide numbers or past papers.`

  const answer = await llm.generateText(
    `Context:\n${contextStr}\n\nStudent Doubt:\n${questionPrompt}`,
    { systemPrompt }
  )

  const citations = passages.map((p) => ({ title: p.title, citation: p.citation }))

  const aiPost = await prisma.forumPost.create({
    data: {
      threadId,
      authorId: session.user.id,
      content: answer,
      isAiGenerated: true,
      citations,
    },
  })

  revalidatePath(`/courses/${courseId}/discuss/${threadId}`)
  return { postId: aiPost.id }
}
