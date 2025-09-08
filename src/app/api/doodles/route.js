import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const doodles = await prisma.doodle.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        dailyPrompt: {
          isNot: null, // ✅ correct way to filter non-null relations
        },
      },
      orderBy: [
        { likes: { _count: 'desc' } }, // ✅ order by count of likes
        { createdAt: 'desc' },
      ],
      include: {
        likes: true,
        profile: {
          select: {
            username: true,
            avatarConfig: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" }, // newest comments first
          include: {
            profile: {
              select: {
                username: true,
                avatarConfig: true,
              },
            },
          },
        },
      },
      take: limit,
    });
    
    return NextResponse.json(doodles);
  } catch (error) {
    console.error('Error fetching doodles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
