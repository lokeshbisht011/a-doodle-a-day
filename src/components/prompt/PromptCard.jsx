"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import Link from "next/link";
import PromptCardSkeleton from "./PromptCardSkeleton";

export default function PromptCard() {
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const today = new Date();
        const localDate = today.toISOString().split("T")[0];
        const res = await fetch(`/api/daily-prompts/today`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: localDate }),
        });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPrompt(data);
      } catch (err) {
        console.error("Error fetching prompt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, []);

  // Countdown timer until local midnight
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <PromptCardSkeleton />;

  const isLastHour = timeLeft.hours === 0;
  const countdownColor = isLastHour ? "text-red-600" : "text-green-600";

  return (
    <Card className="overflow-hidden border-2 border-primary animate-bounce-in">
      <CardHeader className="p-6 pb-2 bg-primary/5 text-center">
        <CardTitle className="text-xl md:text-4xl">Today's Prompt</CardTitle>
        <CardDescription className="mt-1">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-2 text-center">
        {/* Actual prompt closer to header */}
        <h3 className="text-2xl md:text-3xl font-bold my-3 text-primary">
          {prompt.prompt}
        </h3>

        <p className="text-muted-foreground mb-6">{prompt.promptDescription}</p>

        {/* Countdown */}
        <div
          className={`bg-white ${countdownColor} rounded-lg p-4 inline-block mb-6 shadow-md border`}
        >
          <p className="text-sm md:text-base font-bold mb-2">
            Time left to submit today's doodle:
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <p className="text-xs md:text-sm">Hours</p>
            </div>
            <span className="text-2xl md:text-3xl font-bold">:</span>
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <p className="text-xs md:text-sm">Minutes</p>
            </div>
            <span className="text-2xl md:text-3xl font-bold">:</span>
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <p className="text-xs md:text-sm">Seconds</p>
            </div>
          </div>
        </div>

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
}
