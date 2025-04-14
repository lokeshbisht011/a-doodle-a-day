
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Award, Sparkles } from 'lucide-react';

// Mock user for current user
const mockUser = {
  id: '1',
  name: 'Alex Chen',
  image: 'https://i.pravatar.cc/150?img=1',
};

// Mock data for leaderboards
const mockStreakLeaders = Array(10).fill(null).map((_, index) => ({
  id: `${index + 1}`,
  name: ['Alex Chen', 'Jordan Smith', 'Taylor Kim', 'Riley Johnson', 'Casey Williams', 
        'Morgan Lee', 'Quinn Park', 'Avery Thompson', 'Blake Wilson', 'Drew Davis'][index],
  image: `https://i.pravatar.cc/150?img=${index + 1}`,
  streak: 30 - index * 2,
  badges: index < 3 ? ['Streak Master', 'Community Leader'] : ['Streak Master'],
}));

const mockUpvoteLeaders = Array(10).fill(null).map((_, index) => ({
  id: `${index + 1}`,
  name: ['Morgan Lee', 'Jordan Smith', 'Drew Davis', 'Riley Johnson', 'Taylor Kim', 
        'Casey Williams', 'Alex Chen', 'Quinn Park', 'Blake Wilson', 'Avery Thompson'][index],
  image: `https://i.pravatar.cc/150?img=${(index + 5) % 10 + 1}`,
  upvotes: 500 - index * 40,
  badges: index < 3 ? ['Top Creator', 'Community Leader'] : [],
}));

const mockBadgeLeaders = Array(10).fill(null).map((_, index) => ({
  id: `${index + 1}`,
  name: ['Riley Johnson', 'Avery Thompson', 'Casey Williams', 'Morgan Lee', 'Jordan Smith', 
        'Blake Wilson', 'Drew Davis', 'Quinn Park', 'Taylor Kim', 'Alex Chen'][index],
  image: `https://i.pravatar.cc/150?img=${(index + 8) % 10 + 1}`,
  badgeCount: 15 - index,
  badges: index < 3 ? ['Badge Collector', 'Early Adopter'] : [],
}));

const LeaderboardTable = ({ leaders, valueLabel, icon }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-4 px-4 font-medium">Rank</th>
            <th className="text-left py-4 px-4 font-medium">User</th>
            <th className="text-right py-4 px-4 font-medium">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={user.id} className="border-b hover:bg-muted/50">
              <td className="py-4 px-4">
                {index < 3 ? (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </span>
                ) : (
                  <span className="px-3">{index + 1}</span>
                )}
              </td>
              <td className="py-4 px-4">
                <Link to={`/profile/${user.id}`} className="flex items-center gap-3 hover:underline">
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="flex gap-1 mt-1">
                      {user.badges && user.badges.map((badge, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1 font-semibold">
                  <span>{icon}</span>
                  {valueLabel === 'Streak' ? `${user.streak} days` : 
                   valueLabel === 'Upvotes' ? user.upvotes : 
                   `${user.badgeCount} badges`}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('streaks');

  return (
    <Layout user={mockUser}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
        
        <Tabs defaultValue="streaks" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="streaks">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                <span>Streaks</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="upvotes">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Upvotes</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="badges">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Badges</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="streaks" className="bg-card rounded-lg shadow-sm">
            <div className="py-4 px-6 border-b">
              <h2 className="text-xl font-semibold">Longest Streaks</h2>
              <p className="text-sm text-muted-foreground">Users with the most consecutive days of doodling</p>
            </div>
            <LeaderboardTable 
              leaders={mockStreakLeaders} 
              valueLabel="Streak" 
              icon={<Flame className="h-4 w-4 text-orange-500" />} 
            />
          </TabsContent>
          
          <TabsContent value="upvotes" className="bg-card rounded-lg shadow-sm">
            <div className="py-4 px-6 border-b">
              <h2 className="text-xl font-semibold">Most Upvoted</h2>
              <p className="text-sm text-muted-foreground">Users with the highest number of upvotes on their doodles</p>
            </div>
            <LeaderboardTable 
              leaders={mockUpvoteLeaders} 
              valueLabel="Upvotes" 
              icon={<Award className="h-4 w-4 text-yellow-500" />} 
            />
          </TabsContent>
          
          <TabsContent value="badges" className="bg-card rounded-lg shadow-sm">
            <div className="py-4 px-6 border-b">
              <h2 className="text-xl font-semibold">Badge Collectors</h2>
              <p className="text-sm text-muted-foreground">Users who have earned the most badges</p>
            </div>
            <LeaderboardTable 
              leaders={mockBadgeLeaders} 
              valueLabel="Badges" 
              icon={<Sparkles className="h-4 w-4 text-purple-500" />} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboard;
