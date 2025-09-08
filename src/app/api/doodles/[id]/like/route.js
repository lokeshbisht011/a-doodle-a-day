import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const doodleId = params.id;

  try {
    // Find the current user's profile and the doodle being liked, including its creator's profile
    const [profile, doodle] = await Promise.all([
      prisma.profile.findUnique({
        where: { email: session.user.email },
      }),
      prisma.doodle.findUnique({
        where: { id: doodleId },
        include: { profile: true }, // Include the doodle creator's profile
      }),
    ]);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    if (!doodle || !doodle.profile) {
      return NextResponse.json({ error: "Doodle or creator profile not found" }, { status: 404 });
    }

    // Check if the like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        doodleId: doodleId,
        profileId: profile.id,
      },
    });

    let liked;

    if (existingLike) {
      // User is unliking the doodle
      await prisma.$transaction([
        // 1. Delete the like record
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        // 2. Decrement the likes count on the doodle
        prisma.doodle.update({
          where: { id: doodleId },
          data: { likesCount: { decrement: 1 } },
        }),
        // 3. Decrement the total likes on the creator's profile
        prisma.profile.update({
          where: { id: doodle.profileId },
          data: { likesReceivedCount: { decrement: 1 } },
        }),
      ]);
      liked = false;
    } else {
      // User is liking the doodle
      await prisma.$transaction([
        // 1. Create a new like record
        prisma.like.create({
          data: { doodleId, profileId: profile.id },
        }),
        // 2. Increment the likes count on the doodle
        prisma.doodle.update({
          where: { id: doodleId },
          data: { likesCount: { increment: 1 } },
        }),
        // 3. Increment the total likes on the creator's profile
        prisma.profile.update({
          where: { id: doodle.profileId },
          data: { likesReceivedCount: { increment: 1 } },
        }),
      ]);
      liked = true;
    }

    return NextResponse.json({ liked });
  } catch (error) {
    console.error("Error updating like status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}