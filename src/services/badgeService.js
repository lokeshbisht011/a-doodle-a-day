export const BADGES = {
  FIRST_DOODLE: {
    id: 'first_doodle',
    name: 'First Creation',
    description: 'Created your first doodle',
    icon: '🎨',
    requirement: 1,
    type: 'doodle_count'
  },
  DOODLE_COLLECTOR_10: {
    id: 'doodle_collector_10',
    name: 'Doodle Collector',
    description: 'Created 10 doodles',
    icon: '🖼️',
    requirement: 10,
    type: 'doodle_count'
  },
  DOODLE_MASTER_100: {
    id: 'doodle_master_100',
    name: 'Doodle Master',
    description: 'Created 100 doodles',
    icon: '🏆',
    requirement: 100,
    type: 'doodle_count'
  },
  FIRST_COMMENT: {
    id: 'first_comment',
    name: 'Commentator',
    description: 'Left your first comment',
    icon: '💬',
    requirement: 1,
    type: 'comment_count'
  },
  FIRST_STREAK: {
    id: 'first_streak',
    name: 'Consistency',
    description: 'Maintained a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak'
  },
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintained a 7-day streak',
    icon: '🔥🔥',
    requirement: 7,
    type: 'streak'
  }
};

export const calculateBadgeProgress = (badge, stats) => {
  if (!badge || !stats) return 0;
  
  let currentValue = 0;
  let nextRequirement = badge.requirement;
  
  if (badge.type === 'doodle_count') {
    currentValue = stats.doodleCount;
  } else if (badge.type === 'streak') {
    currentValue = stats.currentStreak;
  } else if (badge.type === 'comment_count') {
    currentValue = stats.commentCount;
  }
  
  if (nextRequirement <= 0) return 100;
  
  const progress = Math.min(Math.floor((currentValue / nextRequirement) * 100), 100);
  return progress;
};