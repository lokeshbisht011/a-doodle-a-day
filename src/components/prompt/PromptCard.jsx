
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Clock } from 'lucide-react';
import Link from 'next/link';

const PromptCard = ({ prompt, timeRemaining }) => {
  return (
    <Card className="overflow-hidden border-2 border-primary animate-bounce-in">
      <CardHeader className="p-6 pb-4 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl md:text-2xl">Today's Prompt</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeRemaining}</span>
          </div>
        </div>
        <CardDescription>
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 pt-4">
        <h3 className="text-2xl md:text-3xl font-bold text-center my-4 text-primary">
          {prompt.title}
        </h3>
        
        <p className="text-muted-foreground text-center mb-6">
          {prompt.description}
        </p>
        
        <div className="flex justify-center">
          <Link href="/create">
            <Button className="gap-2">
              <PenLine className="h-4 w-4" />
              Start Doodling
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
