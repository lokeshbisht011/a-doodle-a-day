import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Fetch doodle by query parameter ID
export async function GET({ request }, { params }) {
  const doodleId = params.id; // Get 'id' from URL params

  if (!doodleId) {
    return NextResponse.json(
      { error: "Doodle ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the doodle from the database
    const doodle = await prisma.doodle.findUnique({
      where: {
        id: doodleId,
      },
      include: {
        profile: true, // Include related profile if necessary
      },
    });

    // Check if doodle exists
    if (!doodle) {
      return NextResponse.json({ error: "Doodle not found" }, { status: 404 });
    }

    // Return the doodle data
    return NextResponse.json(doodle, { status: 200 });
  } catch (error) {
    console.error("Error fetching doodle:", error);
    return NextResponse.json(
      { error: "Failed to fetch doodle" },
      { status: 500 }
    );
  }
}

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
