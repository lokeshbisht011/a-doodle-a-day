import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/authOptions'

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify the doodle exists and belongs to the user
    const existingDoodle = await prisma.doodle.findUnique({
      where: { id },
      select: { profileId: true },
    });

    if (!existingDoodle) {
      return NextResponse.json({ error: "Doodle not found" }, { status: 404 });
    }

    if (existingDoodle.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this doodle" },
        { status: 403 }
      );
    }

    // Delete the doodle from the database
    await prisma.doodle.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Doodle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doodle:", error);
    return NextResponse.json(
      { error: "Failed to delete doodle" },
      { status: 500 }
    );
  }
}
