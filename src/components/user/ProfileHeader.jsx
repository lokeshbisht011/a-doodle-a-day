
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Users } from 'lucide-react';

const ProfileHeader = ({ user, isCurrentUser }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          
          <p className="text-muted-foreground mt-2 max-w-md">{user.bio || "No bio yet"}</p>
          
          <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{user.doodleCount || 0} doodles</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{user.commentCount || 0} comments</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {user.badges && user.badges.map((badge) => (
              <Badge key={badge.id} variant="secondary" className="px-3 py-1">
                {badge.icon && <span className="mr-1">{badge.icon}</span>}
                {badge.name}
              </Badge>
            ))}
            
            {user.currentStreak > 0 && (
              <Badge className="bg-gradient-to-r from-orange-400 to-red-500 px-3 py-1">
                🔥 {user.currentStreak} day streak
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          {isCurrentUser ? (
            <Button variant="outline">Edit Profile</Button>
          ) : (
            <Button>Follow</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
