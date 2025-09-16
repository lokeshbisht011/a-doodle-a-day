"use client";

import React from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brush, Palette, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

const BlogPost = () => {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">
          How to Start a Daily Doodle Habit Without Feeling Overwhelmed
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ready to start a daily doodle habit but don't know where to begin?
          Learn how to overcome the pressure and start small with these simple,
          actionable tips for beginners.
        </p>
      </header>

      <section className="prose dark:prose-invert lg:prose-xl mx-auto">
        <p className="lead">
          Have you ever wanted to start a creative habit—something like daily
          doodling or sketching—but the idea of it feels like another item on an
          already long to-do list? You get excited about a new sketchbook, a
          fresh set of pens, and then… nothing. The blank page feels
          intimidating, and the pressure to create something “good” stops you
          before you even begin.
        </p>
        <p>
          You’re not alone. The biggest hurdle to starting a daily creative
          practice isn’t a lack of talent or time; it’s the pressure we put on
          ourselves. But what if you could start a consistent doodle habit that
          feels fun and easy, not like a chore? This guide will show you how to
          ditch the overwhelm and embrace the joy of daily doodling, one tiny
          step at a time.
        </p>

        <Card className="my-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
            <Sparkles className="h-12 w-12 text-primary flex-shrink-0 animate-pulse-slow" />
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Why a "Daily" Doodle Habit is a Great Goal
              </h2>
              <p>
                Before we dive into the "how," let's quickly touch on the "why."
                A daily doodling habit is a powerful form of creative
                mindfulness. It's a way to quiet your mind, process emotions,
                and improve focus. It’s not about becoming a professional
                artist; it’s about making space for yourself and your
                creativity. A consistent, small habit builds momentum far more
                effectively than an intense, sporadic one.
              </p>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold mt-10 mb-6 text-primary-600">
          5 Simple Tips to Start Doodling Today
        </h2>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <Brush className="h-8 w-8 text-secondary mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                1. Redefine "Daily" and Embrace Imperfection
              </h3>
              <p className="text-muted-foreground">
                The word "daily" can feel heavy. Let's redefine it. Your doodle
                doesn’t need to be a masterpiece. It can be a single line, a
                simple shape, or a squiggly pattern. Give yourself permission to
                make a mess. Your doodle can be just for you.
              </p>
            </CardContent>
          </Card>
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <Palette className="h-8 w-8 text-secondary mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                2. Start with the Easiest Supplies Imaginable
              </h3>
              <p className="text-muted-foreground">
                Forget the expensive sketchbooks and fancy art markers. The more
                friction you create, the less likely you are to start. Grab the
                cheapest pen and a scrap of paper you have right now. Keep them
                visible to make starting effortless.
              </p>
            </CardContent>
          </Card>
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-secondary mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                3. Ditch the Blank Page with Prompts
              </h3>
              <p className="text-muted-foreground">
                One of the biggest obstacles is simply not knowing what to draw.
                Use daily prompts to bypass the creative block. An app that
                provides a fresh idea every morning can be a game-changer for
                new artists, helping you dive right in.
              </p>
            </CardContent>
          </Card>
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-secondary mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                4. Time Block Your Doodling (Even If It’s Just 5 Minutes)
              </h3>
              <p className="text-muted-foreground">
                You don’t need an hour a day. In fact, a dedicated 5-minute
                block can be far more effective. Schedule your doodle time like
                a mini-meditation session. Commit to it, even if you only draw a
                few circles.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mt-10 mb-4 text-primary-600">
          Track Your Progress and See Your Habit Grow
        </h2>
        <p>
          You might not notice improvement day-to-day, but looking back at your
          progress over time is incredibly motivating. It proves that your small
          efforts are adding up. Keep all your doodles in one place. Flip
          through your sketchbook or digital folder after a week or a month.
          Seeing the collection of your work can be incredibly rewarding. Some
          creative tools even have a built-in streak tracker and reward badges
          to make this process more fun and to help you celebrate your
          consistency.
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-4 text-primary-600">
          Conclusion: Just Start and Let Go
        </h2>
        <p>
          Starting a daily doodle habit doesn't have to be a monumental task. By
          redefining what it means to "doodle daily," starting with low-friction
          tools, using prompts to bypass overwhelm, and committing just a few
          minutes of your day, you can build a sustainable creative practice.
        </p>
        <p>
          The goal isn't perfection; it’s presence. The act of doodling is its
          own reward. So grab a pen, make your first mark, and let your creative
          journey begin. What’s one small doodle you can create today?
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

export default BlogPost;
