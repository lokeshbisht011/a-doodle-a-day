
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const CommentForm = ({ user, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to comment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(comment);
      setComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={user?.image} alt={user?.name || "User"} />
        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[80px]"
        />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? "Submitting..." : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
