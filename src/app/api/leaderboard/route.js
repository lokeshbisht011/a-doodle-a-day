// app/api/leaderboard/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";

// A single API route to handle all leaderboard queries
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const timeframe = searchParams.get("timeframe");
  const limit = 100;

  let orderBy;
  let where = {};
  let include = {};

  // Set the date filter based on the timeframe
  const now = new Date();
  switch (timeframe) {
    case "daily":
      where.createdAt = { gte: startOfDay(now) };
      break;
    case "monthly":
      where.createdAt = { gte: startOfMonth(now) };
      break;
    case "overall":
    default:
      // No filter needed for overall
      break;
  }

  // Determine the query based on the category
  try {
    switch (category) {
      case "most-liked":
        orderBy = { likesReceivedCount: "desc" };
        break;

      case "top-doodlers":
        orderBy = { doodles: { _count: "desc" } };
        // We still need to filter by doodle creation time for top doodlers
        if (timeframe !== 'overall') {
            const dateFilter = where.createdAt;
            where = {
                doodles: {
                    some: {
                        createdAt: dateFilter
                    }
                }
            };
        }
        break;

      case "most-active":
        orderBy = { maxStreakCount: "desc" };
        break;

      default:
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error building leaderboard query:", error);
    return NextResponse.json(
      { error: "Failed to build leaderboard query" },
      { status: 500 }
    );
  }

  // Fetch the leaderboard data
  try {
    const leaders = await prisma.profile.findMany({
      where,
      orderBy,
      take: limit,
      select: {
        id: true,
        username: true,
        avatarConfig: true,
        badges: {
          select: {
            badge: {
              select: {
                name: true,
              },
            },
          },
        },
        likesReceivedCount: true,
        maxStreakCount: true,
        doodles: {
          select: {
            id: true
          },
          where: where.doodles ? where.doodles.some : {}
        }
      },
    });

    // Format the results to match the client component
    const formattedLeaders = leaders.map(leader => ({
      id: leader.id,
      username: leader.username,
      avatarConfig: leader.avatarConfig,
      badges: leader.badges.map(b => b.badge),
      mostLikes: leader.likesReceivedCount,
      streak: leader.maxStreakCount,
      submissions: leader.doodles.length,
    }));

    return NextResponse.json(formattedLeaders);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}