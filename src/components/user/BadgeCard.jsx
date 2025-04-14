
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const BadgeCard = ({ badge }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 text-center">
        <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-full bg-secondary">
          <span className="text-3xl">{badge.icon}</span>
        </div>
        <CardTitle className="text-base">{badge.name}</CardTitle>
        <CardDescription>{badge.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 text-center">
        <p className="text-xs text-muted-foreground">
          Earned {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-center">
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${badge.progress}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-muted-foreground">
          Level {badge.level} • {badge.progress}% to next level
        </p>
      </CardFooter>
    </Card>
  );
};

export default BadgeCard;
