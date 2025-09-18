// app/api/doodles/paginated/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
  const sortBy = searchParams.get('sortBy') || 'recent';
  const tag = searchParams.get('tag') || 'All';
  const query = searchParams.get('query') || '';

  const skip = (page - 1) * pageSize;

  let orderBy = { createdAt: 'desc' };
  if (sortBy === 'popular') {
    orderBy = { likesCount: 'desc' };
  }

  // Build the `where` clause for Prisma
  let where = {};
  if (tag && tag !== 'All') {
    where.tags = { has: tag }; 
  }
  if (query) {
    // Search for the query string in the doodle title
    where.title = { contains: query, mode: 'insensitive' };
  }

  try {
    const doodles = await prisma.doodle.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        profile: {
          select: { username: true, avatarConfig: true }
        },
        likes: true,
        comments: true
      },
    });

    const totalDoodles = await prisma.doodle.count({ where });
    const totalPages = Math.ceil(totalDoodles / pageSize);

    return NextResponse.json({
      doodles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching paginated doodles:', error);
    return NextResponse.json({ error: 'Failed to fetch doodles' }, { status: 500 });
  }
}