import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BADGES = {
  FIRST_DOODLE: {
    id: "first_doodle",
    name: "First Creation",
    description: "Created your first doodle",
    icon: "🎨",
    requirement: 3,
    type: "doodle_count",
  },
  DOODLE_COLLECTOR_10: {
    id: "doodle_collector_10",
    name: "Doodle Collector",
    description: "Created 10 doodles",
    icon: "🖼️",
    requirement: 10,
    type: "doodle_count",
  },
  DOODLE_MASTER_100: {
    id: "doodle_master_100",
    name: "Doodle Master",
    description: "Created 100 doodles",
    icon: "🏆",
    requirement: 100,
    type: "doodle_count",
  },
  FIRST_COMMENT: {
    id: "first_comment",
    name: "Commentator",
    description: "Left your first comment",
    icon: "💬",
    requirement: 1,
    type: "comment_count",
  },
  FIRST_STREAK: {
    id: "first_streak",
    name: "Consistency",
    description: "Maintained a 3-day streak",
    icon: "🔥",
    requirement: 3,
    type: "streak",
  },
  STREAK_MASTER: {
    id: "streak_master",
    name: "Streak Master",
    description: "Maintained a 7-day streak",
    icon: "🔥🔥",
    requirement: 7,
    type: "streak",
  },
  LIKER_1: {
    id: "liker_1",
    name: "First Liker",
    description: "Liked your first doodle",
    icon: "👍",
    requirement: 1,
    type: "doodles_liked",
  },
  LIKER_10: {
    id: "liker_10",
    name: "Thumbs Up",
    description: "Liked 10 doodles",
    icon: "👍👍",
    requirement: 10,
    type: "doodles_liked",
  },
  LIKER_100: {
    id: "liker_100",
    name: "Big Fan",
    description: "Liked 100 doodles",
    icon: "💖",
    requirement: 100,
    type: "doodles_liked",
  },
  LIKED_1: {
    id: "liked_1",
    name: "First Like",
    description: "Got your first like",
    icon: "⭐",
    requirement: 1,
    type: "likes_received",
  },
  LIKED_10: {
    id: "liked_10",
    name: "Popular",
    description: "Received 10 likes",
    icon: "🌟",
    requirement: 10,
    type: "likes_received",
  },
  LIKED_100: {
    id: "liked_100",
    name: "Superstar",
    description: "Received 100 likes",
    icon: "✨",
    requirement: 100,
    type: "likes_received",
  },
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
      select: {
        doodleCount: true,
        commentCount: true,
        currentStreak: true,
        lastActivity: true,
        doodlesLikedCount: true,
        likesReceivedCount: true,
        badges: {
          include: { badge: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const stats = {
      doodleCount: profile.doodleCount,
      commentCount: profile.commentCount,
      currentStreak: profile.currentStreak,
      lastActivity: profile.lastActivity,
      doodlesLikedCount: profile.doodlesLikedCount,
      likesReceivedCount: profile.likesReceivedCount,
    };

    const earnedBadges = profile.badges.map((badgeOnProfile) => ({
      ...badgeOnProfile.badge,
      earnedAt: badgeOnProfile.awardedAt,
    }));

    const allBadges = Object.values(BADGES);

    return NextResponse.json({ allBadges, earnedBadges, stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST request to update stats and check for new badges
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { action, recipientUserId } = await req.json();

  try {
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
      include: { badges: { include: { badge: true } } },
    });

    let stats = {
      doodleCount: profile.doodleCount,
      commentCount: profile.commentCount,
      currentStreak: profile.currentStreak,
      lastActivity: profile.lastActivity,
      doodlesLikedCount: profile.doodlesLikedCount,
      likesReceivedCount: profile.likesReceivedCount,
    };

    // Second, the recipient of the like
    let recipientProfile = null;
    if (action === "like_received" && recipientUserId) {
      recipientProfile = await prisma.profile.findUnique({
        where: { userId: recipientUserId },
        include: { badges: { include: { badge: true } } },
      });
    }

    const newBadges = [];
    const existingBadgeIds = new Set(profile.badges.map((b) => b.badgeId));
    let recipientNewBadges = [];
    const recipientExistingBadgeIds = recipientProfile
      ? new Set(recipientProfile.badges.map((b) => b.badgeId))
      : new Set();

    // ✅ Handle new actions
    if (action === "doodle_created") {
      stats.doodleCount += 1;
      // Streak logic will be the same
    } else if (action === "comment_added") {
      stats.commentCount += 1;
    } else if (action === "like_given") {
      stats.doodlesLikedCount += 1;
    } else if (action === "like_received" && recipientProfile) {
      // This is a special case where we update the recipient's stats
      let recipientStats = {
        doodleCount: recipientProfile.doodleCount,
        commentCount: recipientProfile.commentCount,
        currentStreak: recipientProfile.currentStreak,
        lastActivity: recipientProfile.lastActivity,
        doodlesLikedCount: recipientProfile.doodlesLikedCount,
        likesReceivedCount: recipientProfile.likesReceivedCount + 1, // ✅ Increment likes received
      };

      // ✅ Check for new badges for the recipient
      for (const badge of Object.values(BADGES)) {
        if (!recipientExistingBadgeIds.has(badge.id)) {
          let requirementMet = false;
          if (
            badge.type === "likes_received" &&
            recipientStats.likesReceivedCount >= badge.requirement
          ) {
            requirementMet = true;
          }
          if (requirementMet) {
            recipientNewBadges.push(badge);
            await prisma.badgeOnProfile.create({
              data: {
                profileId: recipientProfile.id,
                badgeId: badge.id,
              },
            });
          }
        }
      }

      // ✅ Update the recipient's profile in the database
      await prisma.profile.update({
        where: { userId: recipientUserId },
        data: {
          likesReceivedCount: recipientStats.likesReceivedCount,
        },
      });
      return NextResponse.json({
        message: "Recipient's stats updated",
        newBadges: recipientNewBadges,
      });
    }

    if (action !== "like_received") {
      const today = new Date();
      const lastActivity = stats.lastActivity
        ? new Date(stats.lastActivity)
        : null;
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
    }

    // ✅ Check for new badges for the current user
    for (const badge of Object.values(BADGES)) {
      if (existingBadgeIds.has(badge.id)) {//TODO correct
        let requirementMet = false;
        if (
          badge.type === "doodle_count" &&
          stats.doodleCount >= badge.requirement
        ) {
          requirementMet = true;
        } else if (
          badge.type === "comment_count" &&
          stats.commentCount >= badge.requirement
        ) {
          requirementMet = true;
        } else if (
          badge.type === "streak" &&
          stats.currentStreak >= badge.requirement
        ) {
          requirementMet = true;
        } else if (
          badge.type === "doodles_liked" &&
          stats.doodlesLikedCount >= badge.requirement
        ) {
          // ✅ New: check liked count
          requirementMet = true;
        }

        if (requirementMet) {
          newBadges.push(badge);
          await prisma.badgeOnProfile.create({
            data: {
              profileId: profile.id,
              badgeId: badge.id,
            },
          });
        }
      }
    }

    // ✅ Update the current user's profile
    const updatedProfile = await prisma.profile.update({
      where: { email: session.user.email },
      data: {
        doodleCount: stats.doodleCount,
        commentCount: stats.commentCount,
        currentStreak: stats.currentStreak,
        lastActivity: stats.lastActivity,
        doodlesLikedCount: stats.doodlesLikedCount,
        likesReceivedCount: stats.likesReceivedCount,
        maxStreakCount: Math.max(profile.maxStreakCount, stats.currentStreak),
      },
      include: {
        badges: {
          include: { badge: true },
        },
      },
    });

    const earnedBadges = updatedProfile.badges.map((badgeOnProfile) => ({
      ...badgeOnProfile.badge,
      earnedAt: badgeOnProfile.awardedAt,
    }));

    const allBadges = Object.values(BADGES);

    const updatedStats = {
      doodleCount: updatedProfile.doodleCount,
      commentCount: updatedProfile.commentCount,
      currentStreak: updatedProfile.currentStreak,
      lastActivity: updatedProfile.lastActivity,
      doodlesLikedCount: updatedProfile.doodlesLikedCount,
      likesReceivedCount: updatedProfile.likesReceivedCount,
    };

    return NextResponse.json({
      stats: updatedStats,
      earnedBadges,
      allBadges,
      newBadges,
    });
  } catch (error) {
    console.error("Error updating stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
