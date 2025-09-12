import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/authOptions'

export async function PUT(req, { params }) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = params
  const body = await req.json()
  const { json, imageUrl, zoomLevel, title, addToTodaysDoodles, editable } = body;

  try {
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const existingDoodle = await prisma.doodle.findUnique({
      where: { id },
      select: { profileId: true }
    })

    if (!existingDoodle || existingDoodle.profileId !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized to edit this doodle' }, { status: 403 })
    }

    let dailyPromptId = null;

    if (addToTodaysDoodles) {
      const clientDate = new Date(date + "T00:00:00");
      const startOfDay = new Date(clientDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(clientDate);
      endOfDay.setHours(23, 59, 59, 999);

      const prompt = await prisma.dailyPrompt.findFirst({
        where: {
          promptDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (prompt) {
        dailyPromptId = prompt.id;
      }
    }

    const updatedDoodle = await prisma.doodle.update({
      where: { id },
      data: {
        json,
        imageUrl,
        title,
        zoomLevel,
        editable,
        dailyPromptId,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, doodle: updatedDoodle })
  } catch (error) {
    console.error('Error updating doodle:', error)
    return NextResponse.json({ error: 'Failed to update doodle' }, { status: 500 })
  }
}