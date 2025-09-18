"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share2, Edit, MessageCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import BoringAvatar from "boring-avatars";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useBadges } from "@/hooks/useBadges";

const DoodleModal = ({ doodle, isOpen, onClose, currentUserProfile }) => {
  if (!doodle) {
    return null;
  }

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(doodle.likesCount || 0);
  const [comments, setComments] = useState(doodle.comments || []);
  const [commentText, setCommentText] = useState("");

  const { handleUserAction } = useBadges();

  useEffect(() => {
    if (currentUserProfile) {
      setLiked(
        doodle.likes.some((like) => like.profileId === currentUserProfile.id)
      );
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
        toast.error("Failed to like doodle. Please try again.");
      }
    } catch (err) {
      setLiked(previousLikedState);
      setLikes(previousLikesCount);
      toast.error("Network error. Please try again.")
      console.error("Error liking doodle:", err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`/api/doodles/${doodle.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        handleUserAction("comment_added");
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `/api/doodles/${doodle.id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleDeleteDoodle = async () => {
    if (!window.confirm("Are you sure you want to delete this doodle? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/deleteDoodle/${doodle.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Doodle deleted successfully!");
        onClose();
      } else {
        toast.error("Failed to delete doodle. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Failed to delete doodle.");
      console.error("Error deleting doodle:", err);
    }
  };

  if (!isOpen) return null;

  const renderCommentSection = (commentsList) => (
    <div className="space-y-4">
      {commentsList.length > 0 ? (
        commentsList.map((c) => (
          <div key={c.id} className="flex items-start gap-2">
            {c.profile?.avatarConfig ? (
              <BoringAvatar
                size={32}
                name={c.profile.avatarConfig.seed}
                variant={c.profile.avatarConfig.variant}
                colors={c.profile.avatarConfig.colors}
              />
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarImage alt={c.profile?.username} />
                <AvatarFallback>
                  {c.profile?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 text-sm">
              <p>
                <span className="font-medium">
                  {c.profile?.username}
                </span>{" "}
                {c.content}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(c.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {currentUserProfile?.id === c.profileId && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs p-1 h-auto"
                onClick={() => handleDeleteComment(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-sm">No comments yet</p>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-lg">
        {doodle && (
          <div className="flex flex-col md:flex-row w-full h-[800px] md:h-[700px] border bg-background">
            {/* Doodle Image Section */}
            <div className="flex-1 w-full md:w-auto relative flex items-center justify-center border-b md:border-b-0 md:border-r p-4">
              <Image
                src={doodle.imageUrl}
                alt={doodle.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Content, Actions, and Comments Section */}
            <div className="flex-1 flex flex-col w-full md:w-auto">

              {/* Mobile-first Layout (Hidden on md and up) */}
              <div className="flex flex-col md:hidden flex-1">
                <div className="px-4 py-2 border-b flex items-center gap-3">
                  {doodle.profile?.avatarConfig ? (
                    <BoringAvatar
                      size={32}
                      name={doodle.profile.avatarConfig.seed}
                      variant={doodle.profile.avatarConfig.variant}
                      colors={doodle.profile.avatarConfig.colors}
                    />
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage alt={doodle.profile?.username} />
                      <AvatarFallback>
                        {doodle.profile?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <a
                      href={`/${doodle.profile?.username}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {doodle.profile?.username}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(doodle.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2">
                  <h2 className="font-semibold text-lg">{doodle.title}</h2>
                </div>
                
                {/* Actions Block */}
                <div className="px-4 py-2 border-y">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleLike}>
                      <Heart
                        className={`h-6 w-6 transition-colors ${
                          liked ? "text-primary" : ""
                        }`}
                        fill={liked ? "currentColor" : "none"}
                      />
                      <span>{likes}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-6 w-6" />
                      <span>{comments.length}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-6 w-6" />
                    </Button>
                    {currentUserProfile?.id === doodle.profileId && (
                      <>
                        <Link href={`/edit?id=${doodle.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-6 w-6" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={handleDeleteDoodle}>
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      className="rounded-full"
                    >
                      Post
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[150px]">
                  {renderCommentSection(comments)}
                </div>
              </div>


              {/* Desktop Layout (Hidden on mobile) */}
              <div className="hidden md:flex flex-col flex-1">
                <div className="p-4 border-b flex items-center gap-3">
                  {doodle.profile?.avatarConfig ? (
                    <BoringAvatar
                      size={32}
                      name={doodle.profile.avatarConfig.seed}
                      variant={doodle.profile.avatarConfig.variant}
                      colors={doodle.profile.avatarConfig.colors}
                    />
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage alt={doodle.profile?.username} />
                      <AvatarFallback>
                        {doodle.profile?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <a
                      href={`/${doodle.profile?.username}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {doodle.profile?.username}
                    </a>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(doodle.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                  </div>
                </div>
                
                {/* Scrollable comments panel for desktop */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[500px]">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-semibold text-lg">{doodle.title}</h2>
                  </div>
                  {renderCommentSection(comments)}
                </div>

                {/* Actions and Comment Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <Button variant="ghost" size="icon" onClick={handleLike}>
                      <Heart
                        className={`h-6 w-6 transition-colors ${
                          liked ? "text-primary" : ""
                        }`}
                        fill={liked ? "currentColor" : "none"}
                      />
                      <span>{likes}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-6 w-6" />
                      <span>{comments.length}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-6 w-6" />
                    </Button>
                    {currentUserProfile?.id === doodle.profileId && (
                      <>
                        <Link href={`/edit?id=${doodle.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-6 w-6" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={handleDeleteDoodle}>
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      className="rounded-full"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DoodleModal;