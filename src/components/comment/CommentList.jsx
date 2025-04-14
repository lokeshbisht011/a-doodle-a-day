
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const CommentItem = ({ comment }) => {
  return (
    <div className="flex gap-4 py-4">
      <Link href={`/profile/${comment.user.id}`}>
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={comment.user.image} alt={comment.user.name} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Link
            to={`/profile/${comment.user.id}`}
            className="font-medium hover:underline"
          >
            {comment.user.name}
          </Link>
          
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
