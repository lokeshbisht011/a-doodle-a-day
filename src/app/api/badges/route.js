// app/api/badges/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Badge definitions (should be moved to a shared file)
const BADGES = {
  FIRST_DOODLE: { id: 'first_doodle', name: 'First Creation', description: 'Created your first doodle', icon: '🎨', requirement: 1, type: 'doodle_count' },
  DOODLE_COLLECTOR_10: { id: 'doodle_collector_10', name: 'Doodle Collector', description: 'Created 10 doodles', icon: '🖼️', requirement: 10, type: 'doodle_count' },
  DOODLE_MASTER_100: { id: 'doodle_master_100', name: 'Doodle Master', description: 'Created 100 doodles', icon: '🏆', requirement: 100, type: 'doodle_count' },
  FIRST_COMMENT: { id: 'first_comment', name: 'Commentator', description: 'Left your first comment', icon: '💬', requirement: 1, type: 'comment_count' },
  FIRST_STREAK: { id: 'first_streak', name: 'Consistency', description: 'Maintained a 3-day streak', icon: '🔥', requirement: 3, type: 'streak' },
  STREAK_MASTER: { id: 'streak_master', name: 'Streak Master', description: 'Maintained a 7-day streak', icon: '🔥🔥', requirement: 7, type: 'streak' }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        doodleCount: true,
        commentCount: true,
        currentStreak: true,
        lastActivity: true,
        badges: {
          include: { badge: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const stats = {
      doodleCount: profile.doodleCount,
      commentCount: profile.commentCount,
      currentStreak: profile.currentStreak,
      lastActivity: profile.lastActivity,
    };
    
    const earnedBadges = profile.badges.map(badgeOnProfile => ({
      ...badgeOnProfile.badge,
      earnedAt: badgeOnProfile.awardedAt,
    }));
    
    const allBadges = Object.values(BADGES);

    return NextResponse.json({ allBadges, earnedBadges, stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST request to update stats and check for new badges
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { userId, action } = await req.json();

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        badges: {
          include: { badge: true }
        }
      }
    });

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let stats = {
      doodleCount: profile.doodleCount,
      commentCount: profile.commentCount,
      currentStreak: profile.currentStreak,
      lastActivity: profile.lastActivity,
    };
    
    if (action === 'doodle_created') {
      stats.doodleCount += 1;
    } else if (action === 'comment_added') {
      stats.commentCount += 1;
    }
    
    const today = new Date();
    const lastActivity = stats.lastActivity ? new Date(stats.lastActivity) : null;
    if (lastActivity) {
      const timeDiff = today.getTime() - lastActivity.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        stats.currentStreak += 1;
      } else if (daysDiff > 1) {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
    stats.lastActivity = today;

    const newBadges = [];
    const existingBadgeIds = new Set(profile.badges.map(b => b.badgeId));

    for (const badge of Object.values(BADGES)) {
      if (!existingBadgeIds.has(badge.id)) {
        let requirementMet = false;

        if (badge.type === 'doodle_count' && stats.doodleCount >= badge.requirement) {
          requirementMet = true;
        } else if (badge.type === 'comment_count' && stats.commentCount >= badge.requirement) {
          requirementMet = true;
        } else if (badge.type === 'streak' && stats.currentStreak >= badge.requirement) {
          requirementMet = true;
        }

        if (requirementMet) {
          newBadges.push(badge);
          await prisma.badgeOnProfile.create({
            data: {
              profileId: profile.id,
              badgeId: badge.id
            }
          });
        }
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        doodleCount: stats.doodleCount,
        commentCount: stats.commentCount,
        currentStreak: stats.currentStreak,
        lastActivity: stats.lastActivity,
        maxStreakCount: Math.max(profile.maxStreakCount, stats.currentStreak)
      },
      include: {
        badges: {
          include: { badge: true }
        }
      }
    });

    const earnedBadges = updatedProfile.badges.map(badgeOnProfile => ({
      ...badgeOnProfile.badge,
      earnedAt: badgeOnProfile.awardedAt,
    }));
    
    const allBadges = Object.values(BADGES);

    const updatedStats = {
      doodleCount: updatedProfile.doodleCount,
      commentCount: updatedProfile.commentCount,
      currentStreak: updatedProfile.currentStreak,
      lastActivity: updatedProfile.lastActivity,
    };

    return NextResponse.json({
      stats: updatedStats,
      badges: earnedBadges,
      allBadges,
      newBadges
    });

  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}