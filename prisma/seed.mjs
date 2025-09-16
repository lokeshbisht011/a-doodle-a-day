import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const BADGES = {
  FIRST_DOODLE: {
    id: "first_doodle",
    name: "First Creation",
    description: "Created your first doodle",
    icon: "🎨",
    requirement: 1,
    type: "doodle_count",
  },
  DOODLE_COLLECTOR_10: {
    id: "doodle_collector_10",
    name: "Doodle Collector",
    description: "Created 10 doodles",
    icon: "🖼️",
    requirement: 10,
    type: "doodle_count",
  },
  DOODLE_MASTER_100: {
    id: "doodle_master_100",
    name: "Doodle Master",
    description: "Created 100 doodles",
    icon: "🏆",
    requirement: 100,
    type: "doodle_count",
  },
  FIRST_COMMENT: {
    id: "first_comment",
    name: "Commentator",
    description: "Left your first comment",
    icon: "💬",
    requirement: 1,
    type: "comment_count",
  },
  FIRST_STREAK: {
    id: "first_streak",
    name: "Consistency",
    description: "Maintained a 3-day streak",
    icon: "🔥",
    requirement: 3,
    type: "streak",
  },
  STREAK_MASTER: {
    id: "streak_master",
    name: "Streak Master",
    description: "Maintained a 7-day streak",
    icon: "🔥🔥",
    requirement: 7,
    type: "streak",
  },
  LIKER_1: {
    id: "liker_1",
    name: "First Liker",
    description: "Liked your first doodle",
    icon: "👍",
    requirement: 1,
    type: "doodles_liked",
  },
  LIKER_10: {
    id: "liker_10",
    name: "Thumbs Up",
    description: "Liked 10 doodles",
    icon: "👍👍",
    requirement: 10,
    type: "doodles_liked",
  },
  LIKER_100: {
    id: "liker_100",
    name: "Big Fan",
    description: "Liked 100 doodles",
    icon: "💖",
    requirement: 100,
    type: "doodles_liked",
  },
  LIKED_1: {
    id: "liked_1",
    name: "First Like",
    description: "Got your first like",
    icon: "⭐",
    requirement: 1,
    type: "likes_received",
  },
  LIKED_10: {
    id: "liked_10",
    name: "Popular",
    description: "Received 10 likes",
    icon: "🌟",
    requirement: 10,
    type: "likes_received",
  },
  LIKED_100: {
    id: "liked_100",
    name: "Superstar",
    description: "Received 100 likes",
    icon: "✨",
    requirement: 100,
    type: "likes_received",
  },
};

const BADGES_DATA = Object.values(BADGES)

async function main() {
  for (const badgeData of BADGES_DATA) {
    await prisma.badge.upsert({
      where: { id: badgeData.id },
      update: {},
      create: {
        id: badgeData.id,
        name: badgeData.name,
        description: badgeData.description,
        icon: badgeData.icon,
        requirement: badgeData.requirement,
        type: badgeData.type
      },
    })
  }
  console.log('Badges seeded successfully!')
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })