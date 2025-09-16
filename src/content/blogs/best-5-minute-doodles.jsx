// content/blogs/best-5-minute-doodles.jsx

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Pencil, Sparkles, Zap, Timer, Type, Layout as LayoutIcon, Shapes } from "lucide-react";
import Image from "next/image";

const BlogPostFiveMinuteDoodles = () => {
  const { data: session } = useSession();

  return (
      <div className="container py-12 max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">
            Best 5-Minute Doodles You Can Draw During Coffee Breaks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Maximize your coffee break with a creative dose of doodling! Discover
            5-minute doodle ideas that boost creativity and help you relax, even
            if you’re a beginner.
          </p>
        </header>

        <section className="prose dark:prose-invert lg:prose-xl mx-auto">
          <p className="lead">
            Your coffee break is a precious window of time. It's a chance to step
            away from your to-do list, clear your head, and recharge. But what if
            you could use those 5 minutes not just to rest, but to spark a little
            creativity and mindfulness?
          </p>
          <p>
            Doodling is the perfect activity for a short break. It's low-pressure,
            requires minimal supplies, and offers a proven way to reduce stress
            and improve focus. You don’t need to be an artist; you just need a pen
            and a few minutes. Here are some of the best 5-minute doodle ideas
            that you can easily tackle during your next coffee break.
          </p>

          <Card className="my-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
              <Coffee className="h-12 w-12 text-primary flex-shrink-0 animate-pulse-slow" />
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  The Power of a Mindful Break
                </h2>
                <p>
                  This simple, creative act is a form of active meditation. It's
                  repetitive and almost meditative, allowing your mind to wander
                  while your hand stays busy. It's pure mindfulness on a page.
                </p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mt-10 mb-6 text-primary-600">
            5 Quick & Easy Doodle Ideas
          </h2>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Pencil className="h-8 w-8 text-secondary mb-3" />
                <h3 className="text-xl font-semibold mb-2">
                  1. The Pattern Doodle
                </h3>
                <p className="text-muted-foreground">
                  Start with a simple shape—a square, a circle, or a section of a
                  larger shape. Fill it with a repeating, meditative pattern like
                  checkerboards, tiny dots, or waves.
                </p>
              </CardContent>
            </Card>
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Type className="h-8 w-8 text-secondary mb-3" />
                <h3 className="text-xl font-semibold mb-2">
                  2. The Word Doodle
                </h3>
                <p className="text-muted-foreground">
                  Choose a word and turn it into a creative challenge. Write the
                  word in bold letters and fill them with smaller, related doodles.
                  Great for visual thinking.
                </p>
              </CardContent>
            </Card>
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Timer className="h-8 w-8 text-secondary mb-3" />
                <h3 className="text-xl font-semibold mb-2">
                  3. The Memory Map Doodle
                </h3>
                <p className="text-muted-foreground">
                  Quickly sketch an object from your immediate memory. It's a
                  simple way to practice observation and turn a fleeting moment
                  into a mini-journal entry.
                </p>
              </CardContent>
            </Card>
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <LayoutIcon className="h-8 w-8 text-secondary mb-3" />
                <h3 className="text-xl font-semibold mb-2">
                  4. The Object Doodle
                </h3>
                <p className="text-muted-foreground">
                  Look around and choose one simple object. Use quick, confident
                  lines to capture its basic shape and a few key details. The goal
                  isn’t perfection; it’s observation.
                </p>
              </CardContent>
            </Card>
            <Card className="transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <Shapes className="h-8 w-8 text-secondary mb-3" />
                <h3 className="text-xl font-semibold mb-2">
                  5. The Shape Chaos Doodle
                </h3>
                <p className="text-muted-foreground">
                  Start by drawing three or four random shapes on your page. Then,
                  draw a swirling line that connects them all, crossing through
                  the shapes. Color in the different sections created by the
                  intersections for a fun, abstract piece.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-bold mt-10 mb-4 text-primary-600">
            Your 5-Minute Creative Break Awaits
          </h2>
          <p>
            You don’t need a lot of time to tap into your creativity. By embracing
            these simple, 5-minute doodles, you can turn a short break into a moment
            of mindfulness and creative expression. The next time you find yourself
            with a spare few minutes, reach for a pen and give one of these ideas a
            try. Your mind and your creativity will thank you for it.
          </p>
        </section>

        <div className="text-center mt-12">
          <Link href="/create" passHref>
            <Button size="lg" className="text-lg font-semibold animate-bounce-in">
              Start Your First Doodle Today
            </Button>
          </Link>
        </div>
      </div>
  );
};

export default BlogPostFiveMinuteDoodles;