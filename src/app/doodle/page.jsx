// app/doodle/page.jsx

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import BoringAvatar from "boring-avatars";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

import quotes from "@/lib/quotes.json";

// The component that contains the client-side logic
const DoodleContent = () => {
  const searchParams = useSearchParams();
  const doodleId = searchParams.get("id");
  const { data: session } = useSession();
  const { toast } = useToast();

  const [doodle, setDoodle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);

    if (!doodleId) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchDoodle = async () => {
      try {
        const response = await fetch(`/api/doodles/${doodleId}`);
        if (!response.ok) {
          setError(true);
          throw new Error("Doodle not found");
        }
        const data = await response.json();
        setDoodle(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDoodle();
  }, [doodleId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="mt-4 text-center max-w-sm px-4">
          {quote ? (
            <>
              <span className="font-semibold italic">"{quote.quote}"</span>
              <span className="block mt-2 text-sm font-medium"> - {quote.author}</span>
            </>
          ) : (
            "Loading doodle..."
          )}
        </div>
      </div>
    );
  }
  
  if (error || !doodle) {
    return (
      <div className="container py-8 text-center text-destructive">
        <p>Error: Doodle not found.</p>
      </div>
    );
  }
  
  const likes = doodle.likesCount || 0;
  const comments = doodle.comments?.length || 0;
  
  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={doodle.imageUrl}
            alt={doodle.title || `Doodle by ${doodle.profile.username}`}
            fill
            className="object-contain bg-gray-100"
          />
        </div>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{doodle.title}</h1>
          <div className="flex items-center gap-3 mb-4">
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
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{likes} Likes</span>
              </Button>
              <Button variant="ghost" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{comments} Comments</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// The parent component that wraps the content in a Suspense boundary
const DoodlePage = () => {
  const { data: session } = useSession();

  return (
    <Layout user={session?.user}>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }>
        <DoodleContent />
      </Suspense>
    </Layout>
  );
};

export default DoodlePage;