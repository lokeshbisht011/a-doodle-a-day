
import { toast } from '@/hooks/use-toast';
import { BadgeAlert } from 'lucide-react';

// Badge definitions with requirements
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

// Get local storage keys
const getUserBadgesKey = (userId) => `user_${userId}_badges`;
const getUserStatsKey = (userId) => `user_${userId}_stats`;

// Initialize or get user stats
export const getUserStats = (userId) => {
  const statsKey = getUserStatsKey(userId);
  const storedStats = localStorage.getItem(statsKey);
  
  if (storedStats) {
    return JSON.parse(storedStats);
  }
  
  // Default stats
  const initialStats = {
    doodleCount: 0,
    commentCount: 0,
    currentStreak: 0,
    lastActivity: null,
    joinedAt: new Date().toISOString()
  };
  
  localStorage.setItem(statsKey, JSON.stringify(initialStats));
  return initialStats;
};

// Get user badges
export const getUserBadges = (userId) => {
  const badgesKey = getUserBadgesKey(userId);
  const storedBadges = localStorage.getItem(badgesKey);
  
  if (storedBadges) {
    return JSON.parse(storedBadges);
  }
  
  localStorage.setItem(badgesKey, JSON.stringify([]));
  return [];
};

// Save user badges
const saveUserBadges = (userId, badges) => {
  const badgesKey = getUserBadgesKey(userId);
  localStorage.setItem(badgesKey, JSON.stringify(badges));
};

// Save user stats
export const saveUserStats = (userId, stats) => {
  const statsKey = getUserStatsKey(userId);
  localStorage.setItem(statsKey, JSON.stringify(stats));
};

// Update stats and check for new badges
export const updateStats = (userId, action) => {
  const stats = getUserStats(userId);
  const badges = getUserBadges(userId);
  const today = new Date();
  let statsUpdated = false;
  const newBadges = [];
  
  // Update stats based on action
  if (action === 'doodle_created') {
    stats.doodleCount += 1;
    statsUpdated = true;
  } else if (action === 'comment_added') {
    stats.commentCount += 1;
    statsUpdated = true;
  }
  
  // Check and update streak
  if (stats.lastActivity) {
    const lastActivityDate = new Date(stats.lastActivity);
    const timeDiff = today.getTime() - lastActivityDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      stats.currentStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      stats.currentStreak = 1;
    }
    // If same day, streak stays the same
  } else {
    // First activity
    stats.currentStreak = 1;
  }
  
  // Update last activity
  stats.lastActivity = today.toISOString();
  statsUpdated = true;
  
  // Check for badges
  Object.values(BADGES).forEach(badge => {
    // Skip if already earned
    if (badges.some(b => b.id === badge.id)) {
      return;
    }
    
    // Check if badge requirements are met
    let requirementMet = false;
    
    if (badge.type === 'doodle_count' && stats.doodleCount >= badge.requirement) {
      requirementMet = true;
    } else if (badge.type === 'comment_count' && stats.commentCount >= badge.requirement) {
      requirementMet = true;
    } else if (badge.type === 'streak' && stats.currentStreak >= badge.requirement) {
      requirementMet = true;
    }
    
    if (requirementMet) {
      const newBadge = {
        ...badge,
        earnedAt: today.toISOString(),
        level: 1,
        progress: 0
      };
      
      badges.push(newBadge);
      newBadges.push(newBadge);
    }
  });
  
  // Save updated stats and badges
  if (statsUpdated) {
    saveUserStats(userId, stats);
  }
  
  if (newBadges.length > 0) {
    saveUserBadges(userId, badges);
    
    // Notify user of new badges
    newBadges.forEach(badge => {
      toast({
        title: "New Badge Earned!",
        description: `${badge.name}: ${badge.description}`,
        icon: <BadgeAlert className="h-4 w-4" />,
      });
    });
  }
  
  return {
    stats,
    badges,
    newBadges
  };
};

// Calculate progress to next level for a badge
export const calculateBadgeProgress = (badge, stats) => {
  if (!badge || !stats) return 0;
  
  let currentValue = 0;
  let nextRequirement = 0;
  
  if (badge.type === 'doodle_count') {
    currentValue = stats.doodleCount;
    
    if (badge.id === 'doodle_collector_10') {
      nextRequirement = 10;
    } else if (badge.id === 'doodle_master_100') {
      nextRequirement = 100;
    } else {
      nextRequirement = 1;
    }
  } else if (badge.type === 'streak') {
    currentValue = stats.currentStreak;
    
    if (badge.id === 'first_streak') {
      nextRequirement = 3;
    } else if (badge.id === 'streak_master') {
      nextRequirement = 7;
    }
  } else if (badge.type === 'comment_count') {
    currentValue = stats.commentCount;
    nextRequirement = badge.requirement;
  }
  
  // Calculate progress percentage
  if (nextRequirement <= 0) return 100;
  
  const progress = Math.min(Math.floor((currentValue / nextRequirement) * 100), 100);
  return progress;
};
