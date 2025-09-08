import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const doodleId = params.id;
  const { content } = await req.json();

  const profile = await prisma.profile.findUnique({
    where: { email: session.user.email },
  });

  const comment = await prisma.comment.create({
    data: {
      content,
      doodleId,
      profileId: profile.id,
    },
    include: {
      profile: {
        select: {
          username: true,
          avatarConfig: true,
        },
      },
    },
  });

  await prisma.doodle.update({
    where: { id: doodleId },
    data: {
      comments: { connect: { id: comment.id } },
    },
  });

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      comments: { connect: { id: comment.id } },
    },
  });

  return NextResponse.json(comment);
}
