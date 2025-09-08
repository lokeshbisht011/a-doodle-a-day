import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ exists: false, error: "Not authenticated" }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { email: session.user.email },
  })

  return NextResponse.json({ exists: !!profile })
}
