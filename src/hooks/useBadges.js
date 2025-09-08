import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { BadgeAlert } from 'lucide-react';

export const useBadges = (userId) => {
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showNewBadgeModal, setShowNewBadgeModal] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);

  const processBadges = useCallback((allBadges, earnedBadgeIds, stats) => {
    const allBadgesWithProgress = allBadges.map(badge => {
      const isEarned = earnedBadgeIds.has(badge.id);
      return {
        ...badge,
        progress: isEarned ? 100 : calculateBadgeProgress(badge, stats),
        isEarned,
      };
    });
    setBadges(allBadgesWithProgress);
  }, []);

  const fetchBadges = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/badges?userId=${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch user badges and stats');
      }
      const data = await res.json();
      setStats(data.stats);

      // 🔹 Pass all badges and earned badges to the processor
      const earnedBadgeIds = new Set(data.earnedBadges.map(b => b.id));
      processBadges(data.allBadges, earnedBadgeIds, data.stats);

    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to load user badges.');
    } finally {
      setLoading(false);
    }
  }, [userId, processBadges]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const handleUserAction = useCallback(async (action) => {
    if (!userId) return;

    try {
      const res = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user stats');
      }

      const result = await res.json();
      setStats(result.stats);
      
      // 🔹 Re-process badges with the updated data from the server
      const earnedBadgeIds = new Set(result.earnedBadges.map(b => b.id));
      processBadges(result.allBadges, earnedBadgeIds, result.stats);
      
      if (result.newBadges?.length > 0) {
        setEarnedBadges(result.newBadges);
        setShowNewBadgeModal(true);
      }
      return result;
    } catch (error) {
      console.error('Error handling user action:', error);
      toast.error('An error occurred while performing this action.');
    }
  }, [userId, processBadges]);

  return {
    badges,
    stats,
    loading,
    handleUserAction,
    showNewBadgeModal,
    setShowNewBadgeModal,
    earnedBadges,
  };
};

const calculateBadgeProgress = (badge, stats) => {
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