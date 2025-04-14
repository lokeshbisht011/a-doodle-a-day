
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProfileHeader from '@/components/user/ProfileHeader';
import DoodleGrid from '@/components/doodle/DoodleGrid';
import BadgeCard from '@/components/user/BadgeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBadges } from '@/hooks/useBadges';

// Mock user data for base data
const mockUserBase = {
  id: '1',
  name: 'Alex Chen',
  image: 'https://i.pravatar.cc/150?img=1',
  bio: 'Digital artist and illustrator. I love creating whimsical characters and colorful worlds.',
  createdAt: '2023-01-15',
};

// Mock doodles
const mockDoodles = Array(6).fill(null).map((_, index) => ({
  id: `${index + 1}`,
  prompt: ['Fantasy Creature', 'Underwater City', 'Space Explorer', 'Dream Landscape'][index % 4],
  imageUrl: `https://via.placeholder.com/400?text=Doodle+${index + 1}`,
  upvotes: Math.floor(Math.random() * 50),
  commentCount: Math.floor(Math.random() * 10),
  createdAt: new Date(Date.now() - (index * 3600000)).toISOString(),
  user: mockUserBase,
}));

const Profile = () => {
  const { id } = useParams();
  const userId = id || '1';
  const [doodles, setDoodles] = useState(mockDoodles);
  const [currentTab, setCurrentTab] = useState('doodles');
  
  // Use the badge hook
  const { badges, stats, loading } = useBadges(userId);
  
  // Combine base user data with dynamic stats and badges
  const [user, setUser] = useState({
    ...mockUserBase,
    badges: [],
    doodleCount: 0,
    commentCount: 0,
    currentStreak: 0
  });
  
  // Update user data when badges or stats change
  useEffect(() => {
    if (!loading && stats) {
      setUser({
        ...mockUserBase,
        badges,
        doodleCount: stats.doodleCount,
        commentCount: stats.commentCount,
        currentStreak: stats.currentStreak
      });
    }
  }, [badges, stats, loading]);
  
  const isCurrentUser = true; // In a real app, check if viewing user's own profile

  return (
    <Layout user={user}>
      <div className="container py-8">
        <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
        
        <div className="mt-8">
          <Tabs defaultValue="doodles" onValueChange={setCurrentTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="doodles">Doodles</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="doodles">
              {doodles.length > 0 ? (
                <DoodleGrid doodles={doodles} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No doodles yet</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="badges">
              {badges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No badges earned yet. Start creating doodles to earn badges!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="saved">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No saved doodles yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
