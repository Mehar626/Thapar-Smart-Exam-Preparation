'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { EventType } from '@prisma/client'

export async function createCalendarEvent(data: {
  courseId: string
  batchId?: string | null
  title: string
  type: EventType
  start: string
  venue?: string
  syllabusTopicIds: string[]
  weightage?: number
  notes?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Please sign in to schedule events.')
  }

  const role = session.user.role
  const isAuthorizedToApprove = role === 'CR' || role === 'MODERATOR'

  const event = await prisma.calendarEvent.create({
    data: {
      courseId: data.courseId,
      batchId: data.batchId || null,
      title: data.title,
      type: data.type,
      start: new Date(data.start),
      venue: data.venue,
      syllabusTopicIds: data.syllabusTopicIds,
      weightage: data.weightage,
      notes: data.notes,
      isApproved: isAuthorizedToApprove,
    },
  })

  revalidatePath(`/courses/${data.courseId}/calendar`)
  revalidatePath('/dashboard')

  return { success: true, eventId: event.id, isApproved: isAuthorizedToApprove }
}

export async function approveCalendarEvent(eventId: string, courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user.role !== 'CR' && session.user.role !== 'MODERATOR')) {
    throw new Error('Only Class Representatives (CR) or Moderators can approve events.')
  }

  await prisma.calendarEvent.update({
    where: { id: eventId },
    data: { isApproved: true },
  })

  revalidatePath(`/courses/${courseId}/calendar`)
  revalidatePath('/dashboard')
  return { success: true }
}
