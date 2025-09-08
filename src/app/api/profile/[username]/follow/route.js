import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  const { username } = params;

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const followerProfile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });
    const followingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (!followerProfile || !followingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (followerProfile.id === followingProfile.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: followerProfile.id,
        followingId: followingProfile.id,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  const { username } = params;

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const followerProfile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });
    const followingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (!followerProfile || !followingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (followerProfile.id === followingProfile.id) {
      return NextResponse.json({ error: 'Cannot unfollow yourself' }, { status: 400 });
    }
    
    // Perform the delete in a single query using the composite unique key.
    // The `delete` method will throw an error if the record doesn't exist.
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerProfile.id,
          followingId: followingProfile.id,
        },
      },
    });

    return NextResponse.json({ message: 'Unfollowed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    // If the record was not found, the delete operation will throw an error.
    // We can handle this gracefully.
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Not following this user' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 });
  }
}