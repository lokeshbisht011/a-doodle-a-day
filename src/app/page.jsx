"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PromptCard from "@/components/prompt/PromptCard";
import DoodleGrid from "@/components/doodle/DoodleGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockPrompt = {
  id: "1",
  title: "Fantasy Creature",
  description:
    "Draw a mythical creature from your imagination. What unique features does it have?",
  createdAt: new Date().toISOString(),
};

const mockDoodles = [
  {
    id: "1",
    prompt: "Fantasy Creature",
    imageUrl: "https://via.placeholder.com/400",
    upvotes: 24,
    commentCount: 5,
    createdAt: new Date().toISOString(),
    user: {
      id: "1",
      name: "Alex Chen",
      image: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: "2",
    prompt: "Fantasy Creature",
    imageUrl: "https://via.placeholder.com/400",
    upvotes: 18,
    commentCount: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: {
      id: "2",
      name: "Jordan Smith",
      image: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: "3",
    prompt: "Fantasy Creature",
    imageUrl: "https://via.placeholder.com/400",
    upvotes: 32,
    commentCount: 7,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    user: {
      id: "3",
      name: "Taylor Kim",
      image: "https://i.pravatar.cc/150?img=3",
    },
  },
];

const mockUser = {
  id: "1",
  name: "Alex Chen",
  image: "https://i.pravatar.cc/150?img=1",
};

export default function Home() {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout user={mockUser}>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Left sidebar with prompt */}
          <div className="lg:col-span-4 space-y-6">
            <PromptCard prompt={mockPrompt} timeRemaining={timeRemaining} />

            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-3">What is Doodle a Day?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A daily doodle challenge where you can unleash your creativity,
                improve your drawing skills, and connect with fellow artists.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary p-1 rounded mt-0.5">
                    <span className="text-sm">1</span>
                  </div>
                  <p className="text-sm">See the daily prompt</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary p-1 rounded mt-0.5">
                    <span className="text-sm">2</span>
                  </div>
                  <p className="text-sm">Create your doodle</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary p-1 rounded mt-0.5">
                    <span className="text-sm">3</span>
                  </div>
                  <p className="text-sm">Share and get feedback</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary p-1 rounded mt-0.5">
                    <span className="text-sm">4</span>
                  </div>
                  <p className="text-sm">Build your streak and earn badges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content with doodle grid */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Latest Doodles</h2>
              <Link href="/gallery">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <DoodleGrid doodles={mockDoodles} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
