
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  Share2,
  Edit,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const DoodleCard = ({ doodle }) => {
  const [upvotes, setUpvotes] = useState(doodle.upvotes || 0);
  const [upvoted, setUpvoted] = useState(false);

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (upvoted) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setUpvoted(!upvoted);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <CardHeader className="p-4 flex flex-row items-center gap-3">
        <Link href={`/profile/${doodle.user.id}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={doodle.user.image} alt={doodle.user.name} />
            <AvatarFallback>{doodle.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex flex-col">
          <Link href={`/profile/${doodle.user.id}`} className="font-medium text-sm">
            {doodle.user.name}
          </Link>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(doodle.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <Badge variant="secondary" className="ml-auto">
          {doodle.prompt}
        </Badge>
      </CardHeader>
      
      <Link href={`/doodle/${doodle.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={doodle.imageUrl}
            alt={`Doodle for prompt: ${doodle.prompt}`}
            className="object-cover w-full h-full"
          />
        </div>
      </Link>
      
      <CardFooter className="p-4 flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUpvote}
            className={`flex items-center gap-1 ${upvoted ? 'text-primary' : ''}`}
          >
            <Heart className="h-4 w-4" fill={upvoted ? 'currentColor' : 'none'} />
            <span>{upvotes}</span>
          </Button>
          
          <Link href={`/doodle/${doodle.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{doodle.commentCount || 0}</span>
            </Button>
          </Link>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Link href={`/create?edit=${doodle.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DoodleCard;
