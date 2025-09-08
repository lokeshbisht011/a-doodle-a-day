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
    const updated = await prisma.profile.update({
      where: { email: session.user.email },
      data: {
        name,
        username,
        bio,
        avatarConfig,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, profile: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
