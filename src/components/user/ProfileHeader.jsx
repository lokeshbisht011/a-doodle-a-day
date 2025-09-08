"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Users, X } from "lucide-react";
import BoringAvatar from "boring-avatars";
import ProfileSetupModal from "../ProfileModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";

const ProfileHeader = ({ 
  profile, 
  isCurrentUser, 
  followersCount, 
  followingCount,
  currentUserProfile,
  followers,
  following
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentFollowersCount, setCurrentFollowersCount] = useState(followersCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    if (currentUserProfile && profile.followers) {
      const alreadyFollowing = profile.followers.some(
        (follow) => follow.followerId === currentUserProfile.id
      );
      setIsFollowing(alreadyFollowing);
    }
    setCurrentFollowersCount(followersCount);
  }, [profile, currentUserProfile, followersCount]);

  const handleFollow = async () => {
    if (!currentUserProfile) {
      toast.error("You must be logged in to follow users.");
      return;
    }
    
    setIsLoading(true);
    const method = isFollowing ? "DELETE" : "POST";
    const newFollowersCount = isFollowing ? currentFollowersCount - 1 : currentFollowersCount + 1;

    setIsFollowing(!isFollowing);
    setCurrentFollowersCount(newFollowersCount);

    try {
      const res = await fetch(`/api/profile/${profile.username}/follow`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setIsFollowing(isFollowing);
        setCurrentFollowersCount(currentFollowersCount);
        toast.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}. Please try again.`);
      } else {
        toast.success(isFollowing ? `You have unfollowed ${profile.username}.` : `You are now following ${profile.username}!`);
      }
    } catch (error) {
      setIsFollowing(isFollowing);
      setCurrentFollowersCount(currentFollowersCount);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollowFromList = async (targetUsername, followRecordId) => {
    const previousFollowingCount = following.length;

    try {
      const res = await fetch(`/api/profile/${targetUsername}/follow`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`You have unfollowed ${targetUsername}.`);
        // Update the state to reflect the change
        // This is a simplified approach assuming a direct relationship
        // In a real app, you might need to re-fetch the lists or use a more complex state update
        setShowFollowingModal(false);
        // The parent component would need to re-fetch to update the count
      } else {
        toast.error(`Failed to unfollow ${targetUsername}.`);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };


  const renderUserList = (list, type) => (
    list.map((item) => {
      const userProfile = type === 'followers' ? item.follower : item.following;
      if (!userProfile) return null;
      
      const isCurrentlyFollowingUser = type === 'following' && userProfile.username === profile.username;
      
      return (
        <div key={userProfile.username} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
          <Link href={`/${userProfile.username}`} className="flex items-center gap-2">
            {userProfile?.avatarConfig ? (
              <BoringAvatar
                size={32}
                name={userProfile.avatarConfig.seed}
                variant={userProfile.avatarConfig.variant}
                colors={userProfile.avatarConfig.colors}
              />
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarImage alt={userProfile.username} />
                <AvatarFallback>{userProfile.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            )}
            <span className="font-medium hover:underline">{userProfile.username}</span>
          </Link>
          {type === 'following' && isCurrentUser && currentUserProfile?.id !== userProfile.id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnfollowFromList(userProfile.username, item.id)}
            >
              Unfollow
            </Button>
          )}
        </div>
      );
    })
  );


  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {profile?.avatarConfig ? (
          <BoringAvatar
            size={96}
            name={profile.avatarConfig.seed}
            variant={profile.avatarConfig.variant}
            colors={profile.avatarConfig.colors}
          />
        ) : (
          <Avatar className="h-24 w-24">
            <AvatarImage alt={profile.username || "User"} />
            <AvatarFallback className="text-4xl">
              {profile.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            {profile.bio || "No bio yet"}
          </p>

          <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{profile.doodles.length || 0} doodles</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{profile.comments.length || 0} comments</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
            <Button variant="ghost" className="text-sm p-0 h-auto" onClick={() => setShowFollowersModal(true)}>
              <span className="font-bold">{currentFollowersCount}</span> Followers
            </Button>
            <Button variant="ghost" className="text-sm p-0 h-auto" onClick={() => setShowFollowingModal(true)}>
              <span className="font-bold">{followingCount}</span> Following
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {profile.badges &&
              profile.badges.map((badge) => (
                <Badge key={badge.id} variant="secondary" className="px-3 py-1">
                  {badge.icon && <span className="mr-1">{badge.icon}</span>}
                  {badge.name}
                </Badge>
              ))}

            {profile.currentStreak > 0 && (
              <Badge className="bg-gradient-to-r from-orange-400 to-red-500 px-3 py-1">
                🔥 {profile.currentStreak} day streak
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          {isCurrentUser ? (
            <Button variant="outline" onClick={() => setShowProfileModal(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              disabled={isLoading}
              variant={isFollowing ? "secondary" : "default"}
            >
              {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
      />

      {/* Followers Modal */}
      <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
        <DialogContent className="max-w-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto space-y-2">
            {renderUserList(followers, 'followers')}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Following Modal */}
      <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
        <DialogContent className="max-w-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto space-y-2">
            {renderUserList(following, 'following')}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;