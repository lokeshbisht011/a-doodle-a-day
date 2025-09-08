import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ available: false, error: "Username required" }, { status: 400 })
  }

  const existing = await prisma.profile.findUnique({
    where: { username },
  })

  return NextResponse.json({ available: !existing })
}
