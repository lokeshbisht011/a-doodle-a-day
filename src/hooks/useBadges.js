
import { useState, useEffect } from 'react';
import { getUserBadges, getUserStats, updateStats, calculateBadgeProgress } from '@/services/badgeService';

export const useBadges = (userId) => {
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Load badges and stats
    const userBadges = getUserBadges(userId);
    const userStats = getUserStats(userId);

    // Calculate progress for each badge
    const badgesWithProgress = userBadges.map(badge => ({
      ...badge,
      progress: calculateBadgeProgress(badge, userStats)
    }));

    setBadges(badgesWithProgress);
    setStats(userStats);
    setLoading(false);
  }, [userId]);

  // Handler for user actions
  const handleUserAction = (action) => {
    if (!userId) return;

    const result = updateStats(userId, action);
    
    // Update badges with progress
    const updatedBadges = result.badges.map(badge => ({
      ...badge,
      progress: calculateBadgeProgress(badge, result.stats)
    }));

    setBadges(updatedBadges);
    setStats(result.stats);
    
    return {
      stats: result.stats,
      badges: updatedBadges,
      newBadges: result.newBadges
    };
  };

  return {
    badges,
    stats,
    loading,
    handleUserAction
  };
};
