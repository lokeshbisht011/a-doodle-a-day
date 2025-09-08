// app/api/profile/setup/route.ts
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/authOptions"

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { name, username, bio, avatarConfig } = await req.json()

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.create({
      data: {
        user: { connect: { id: user.id } },
        email: session.user.email,
        name: name,
        username: username || null,
        bio: bio || "",
        avatarConfig: avatarConfig || {
          seed: "default",
          variant: "beam",
          colors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
        },
        socialLinks: {},

        doodleCount: 0,
        commentCount: 0,
        currentStreak: 0,
        likesReceivedCount: 0,
        maxStreakCount: 0,
        lastActivity: null,

        doodles: { create: [] },
        likes: { create: [] },
        followers: { create: [] },
        following: { create: [] },
        streaks: { create: [] },
        badges: { create: [] },
        comments: { create: [] },
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (err) {
    console.error("Profile setup error:", err)
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
}