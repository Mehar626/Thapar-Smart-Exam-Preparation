'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleCourseEnrollment(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('You must be signed in to enroll in a course.')
  }

  const userId = session.user.id

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  })

  if (existing) {
    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })
  } else {
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    })
  }

  revalidatePath('/courses')
  revalidatePath('/dashboard')
  revalidatePath(`/courses/${courseId}`)

  return { enrolled: !existing }
}
