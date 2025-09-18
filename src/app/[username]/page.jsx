"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProfileHeader from "@/components/user/ProfileHeader";
import DoodleCard from "@/components/doodle/DoodleCard";
import BadgeCard from "@/components/user/BadgeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBadges } from "@/hooks/useBadges";
import { useParams } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [doodles, setDoodles] = useState(null);
  const [likedDoodles, setLikedDoodles] = useState(null);
  const [currentTab, setCurrentTab] = useState("doodles");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const { badges, loading } = useBadges();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${params.username}`);
        const data = await response.json();
        setProfile(data);
        setDoodles(data.doodles);
        setLikedDoodles(data.likedDoodles);
        setFollowersCount(data.followers.length);
        setFollowingCount(data.following.length);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const checkCurrentUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/profile/user");
          const data = await response.json();
          setIsCurrentUser(data.username === params.username);
          setCurrentUserProfile(data);
        } catch (error) {
          console.error("Error checking own profile:", error);
          setIsCurrentUser(false);
          setCurrentUserProfile(null);
        }
      } else {
        setIsCurrentUser(false);
      }
    };

    fetchProfile();
    checkCurrentUser();
  }, [params.username, session]);
  
  const handleDoodleDeleted = (deletedDoodleId) => {
    setDoodles((prevDoodles) =>
      prevDoodles.filter((doodle) => doodle.id !== deletedDoodleId)
    );
    setLikedDoodles((prevLikedDoodles) =>
      prevLikedDoodles.filter((doodle) => doodle.id !== deletedDoodleId)
    );
  };

  const ProfileLoader = () => (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-3 mt-3">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-48 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );

  if (!profile) {
    return (
      <Layout>
        <div className="container py-8">
          <ProfileLoader />
        </div>
      </Layout>
    );
  }

  const sortedBadges = badges
    ? [...badges].sort((a, b) => (b.isEarned - a.isEarned))
    : [];

  return (
    <Layout>
      <div className="container py-8">
        <ProfileHeader 
          profile={profile} 
          isCurrentUser={isCurrentUser} 
          followersCount={followersCount}
          followingCount={followingCount}
          currentUserProfile={currentUserProfile}
          followers={profile.followers}
          following={profile.following}
        />

        <div className="mt-8">
          <Tabs defaultValue="doodles" onValueChange={setCurrentTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="doodles">Doodles</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
            </TabsList>

            <TabsContent value="doodles">
              {doodles?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {doodles.map((doodle) => (
                    <div key={doodle.id} className="flex-shrink-0">
                      <DoodleCard
                        doodle={doodle}
                        currentUserProfile={currentUserProfile}
                        onDoodleDeleted={handleDoodleDeleted}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No doodles yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="badges">
              {sortedBadges.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {sortedBadges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No badges have been defined yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="liked">
              {likedDoodles?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {likedDoodles.map((doodle) => (
                    <div key={doodle.id} className="flex-shrink-0">
                      <DoodleCard
                        doodle={doodle}
                        currentUserProfile={currentUserProfile}
                        onDoodleDeleted={handleDoodleDeleted}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No liked doodles yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}