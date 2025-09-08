'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Award, Sparkles, Heart, Pencil, Timer } from 'lucide-react';
import { useSession } from "next-auth/react";
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

const LeaderboardShimmer = () => (
  <div className="bg-card rounded-lg shadow-sm animate-pulse">
    <div className="py-4 px-6 border-b">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const Leaderboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('most-liked');
  const [activeTimeframe, setActiveTimeframe] = useState('daily');
  const [leaders, setLeaders] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debounced fetching function
  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?category=${activeTab}&timeframe=${activeTimeframe}`);
        const data = await res.json();
        setLeaders(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };
    
    const handler = setTimeout(() => {
      fetchLeaders();
    }, 500); // Debounce to prevent multiple API calls on fast tab changes

    return () => clearTimeout(handler);
  }, [activeTab, activeTimeframe]);

  const getTableProps = () => {
    switch (activeTab) {
      case 'most-liked':
        return {
          valueLabel: 'Most Liked',
          icon: <Heart className="h-4 w-4 text-red-500" />,
          dataKey: 'mostLikes',
        };
      case 'top-doodlers':
        return {
          valueLabel: 'Submissions',
          icon: <Pencil className="h-4 w-4 text-blue-500" />,
          dataKey: 'submissions',
        };
      case 'most-active':
        return {
          valueLabel: 'Longest Streak',
          icon: <Flame className="h-4 w-4 text-orange-500" />,
          dataKey: 'streak',
        };
      default:
        return {};
    }
  };

  const { valueLabel, icon, dataKey } = getTableProps();

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
        
        <Tabs defaultValue="most-liked" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="most-liked">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Most Liked</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="top-doodlers">
              <div className="flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                <span>Top Doodlers</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="most-active">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                <span>Most Active</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Tabs defaultValue="daily" onValueChange={setActiveTimeframe}>
              <TabsList className="mb-6">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="overall">Overall</TabsTrigger>
              </TabsList>
              
              <motion.div
                key={`${activeTab}-${activeTimeframe}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-card rounded-lg shadow-sm"
              >
                <div className="py-4 px-6 border-b">
                  <h2 className="text-xl font-semibold">{valueLabel}</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeTimeframe === 'daily' && 'Top users over the last 24 hours'}
                    {activeTimeframe === 'monthly' && 'Top users this month'}
                    {activeTimeframe === 'overall' && 'All-time top users'}
                  </p>
                </div>
                {loading ? (
                  <LeaderboardShimmer />
                ) : leaders && leaders.length > 0 ? (
                  <LeaderboardTable
                    leaders={leaders}
                    valueLabel={valueLabel}
                    icon={icon}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No data available for this category</p>
                  </div>
                )}
              </motion.div>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboard;