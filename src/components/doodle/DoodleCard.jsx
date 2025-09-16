"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import BoringAvatar from "boring-avatars";
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import DoodleModal from "./DoodleModal";
import DeleteDoodleDialog from "./DeleteDoodleDialog";
import ShareModal from "../ShareModal";

const DoodleCard = ({ doodle, currentUserProfile, onDoodleDeleted }) => {
  const { toast } = useToast();
  const [likes, setLikes] = useState(doodle.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // New state for share modal

  useEffect(() => {
    if (currentUserProfile) {
      setLiked(
        doodle.likes.some((like) => like.profileId === currentUserProfile.id)
      );
      setIsCurrentUser(currentUserProfile?.id === doodle.profile.id);
    }
  }, [currentUserProfile, doodle]);

  const handleLike = async () => {
    const previousLikedState = liked;
    const previousLikesCount = likes;

    setLiked(!previousLikedState);
    if (previousLikedState) {
      setLikes((p) => p - 1);
    } else {
      setLikes((p) => p + 1);
    }

    try {
      const res = await fetch(`/api/doodles/${doodle.id}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        setLiked(previousLikedState);
        setLikes(previousLikesCount);
        toast({
          title: "Failed to like doodle",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setLiked(previousLikedState);
      setLikes(previousLikesCount);
      toast({
        title: "Network error",
        description: "Please try again.",
        variant: "destructive",
      });
      console.error("Error liking doodle:", err);
    }
  };

  const handleDeleteDoodle = () => {
    setIsDeleteDialogOpen(true);
  };
  
  // New handler for opening the share modal
  const handleShareClick = (e) => {
    e.stopPropagation(); // Prevents the card's onClick from firing
    setIsShareModalOpen(true);
  };

  // Define the data to be shared
  const shareData = {
    title: `Check out this doodle by ${doodle.profile.username}!`,
    text: `"${doodle.title || 'Untitled doodle'}" - a doodle by ${doodle.profile.username} on A-Doodle-A-Day.`,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/doodle?id=${doodle.id}`,
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      {!isCurrentUser && (
        <CardHeader className="p-4 flex flex-row items-center gap-3">
          <Link href={`/${doodle.profile.username}`}>
            {doodle.profile?.avatarConfig ? (
              <BoringAvatar
                size={36}
                name={doodle.profile.avatarConfig.seed}
                variant={doodle.profile.avatarConfig.variant}
                colors={doodle.profile.avatarConfig.colors}
              />
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarImage alt={doodle.profile.username || "User"} />
                <AvatarFallback>
                  {doodle.profile.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </Link>

          <div className="flex flex-col">
            <Link
              href={`/${doodle.profile.username}`}
              className="font-medium text-sm hover:underline"
            >
              {doodle.profile.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(doodle.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </CardHeader>
      )}

      {doodle.title && (
        <h3 className="text-lg font-semibold px-4 pb-2 text-center line-clamp-1">
          {doodle.title}
        </h3>
      )}

      <div
        className="relative aspect-square overflow-hidden border border-border rounded-lg mx-4 mb-4 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={doodle.imageUrl}
          alt={doodle.title || `Doodle by ${doodle.profile.username}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <CardFooter className="p-4 flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-1 ${liked ? "text-primary" : ""}`}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsModalOpen(true)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{doodle.comments.length || 0}</span>
          </Button>
        </div>

        <div className="flex gap-2">
          {/* Update the Share button */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShareClick}>
            <Share2 className="h-4 w-4" />
          </Button>

          {isCurrentUser && (
            <>
              <Link href={`/edit?id=${doodle.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDeleteDoodle}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>

      {/* Doodle Modal */}
      <DoodleModal
        doodle={doodle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserProfile={currentUserProfile}
      />

      {/* Delete Dialog */}
      <DeleteDoodleDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        doodleId={doodle.id}
        onDoodleDeleted={onDoodleDeleted}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={shareData}
      />
    </Card>
  );
};

export default DoodleCard;