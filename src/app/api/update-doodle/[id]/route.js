import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/authOptions'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = params
  const body = await req.json()
  const { json, imageUrl, zoomLevel, title } = body

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

    const updatedDoodle = await prisma.doodle.update({
      where: { id },
      data: {
        json,
        imageUrl,
        zoomLevel,
        title,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, doodle: updatedDoodle })
  } catch (error) {
    console.error('Error updating doodle:', error)
    return NextResponse.json({ error: 'Failed to update doodle' }, { status: 500 })
  }
}