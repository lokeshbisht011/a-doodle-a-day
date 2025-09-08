import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id: doodleId, commentId } = params;

  const profile = await prisma.profile.findUnique({
    where: { email: session.user.email },
  });

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment || comment.profileId !== profile.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.doodle.update({
    where: { id: comment.doodleId },
    data: {
      comments: { disconnect: { id: commentId } },
    },
  });
  
  await prisma.profile.update({
    where: { id: comment.profileId },
    data: {
      comments: { disconnect: { id: commentId } },
    },
  });

  await prisma.comment.delete({ where: { id: commentId } });

  return NextResponse.json({ success: true });
}
