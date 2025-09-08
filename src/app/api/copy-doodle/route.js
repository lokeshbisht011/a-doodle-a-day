import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { doodleId } = await request.json();

  try {
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const originalDoodle = await prisma.doodle.findUnique({
      where: { id: doodleId },
    });

    if (!originalDoodle) {
      return NextResponse.json({ error: 'Doodle not found' }, { status: 404 });
    }

    const newDoodle = await prisma.doodle.create({
      data: {
        json: originalDoodle.json,
        imageUrl: originalDoodle.imageUrl,
        title: `Copy of ${originalDoodle.title}`,
        profileId: profile.id,
        editable: true,
        theme: originalDoodle.theme,
      },
    });

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        doodlesIds: {
          push: newDoodle.id,
        },
      },
    });

    return NextResponse.json({ success: true, doodle: newDoodle });
  } catch (error) {
    console.error('Error copying doodle:', error);
    return NextResponse.json({ error: 'Failed to copy doodle' }, { status: 500 });
  }
}