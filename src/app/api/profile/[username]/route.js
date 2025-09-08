import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { username } = params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        doodles: {
          include: {
            profile: true,
            likes: true,
            comments: {
              include: {
                profile: {
                  select: {
                    username: true,
                    avatarConfig: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 9,
        },

        likes: {
          include: {
            doodle: {
              include: {
                profile: true,
                likes: true,
                comments: {
                  include: {
                    profile: {
                      select: {
                        username: true,
                        avatarConfig: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 9,
        },
        comments: {
          include: {
            doodle: {
              include: {
                profile: true,
                likes: true,
                comments: {
                  include: {
                    profile: {
                      select: {
                        username: true,
                        avatarConfig: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 9,
        },

        streaks: {
          orderBy: { startDate: "desc" },
          take: 5,
        },

        badges: {
          include: {
            badge: true,
          },
        },

        followers: {
          include: {
            follower: {
              select: {
                username: true,
                avatarConfig: true,
              },
            },
          },
          take: 20,
        },
        following: {
          include: {
            following: {
              select: {
                username: true,
                avatarConfig: true,
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedDoodles = profile.likes.map((like) => like.doodle);

    return NextResponse.json({
      ...profile,
      likedDoodles,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { username } = params;
  const data = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        bio: data.bio,
        twitter: data.twitter,
        instagram: data.instagram,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
