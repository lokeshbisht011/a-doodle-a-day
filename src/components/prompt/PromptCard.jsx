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
import { motion } from "framer-motion";
import Image from "next/image";

// Import your custom icons
import PaintPaletteIcon from "/public/palette-icon.png";
import CrayonBoxIcon from "/public/crayons-icon.png";
import EaselIcon from "/public/easel-icon.png";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden border-2 border-primary rounded-xl"
    >
      <Card className="bg-background">
        {/* Animated Icons - Decorative Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          {/* Paint Palette - Top Left */}
          <motion.div
            className="absolute top-[10px] left-[50px] lg:top-[70px] lg:left-[200px]"
            animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image
              src={PaintPaletteIcon}
              alt="Palette"
              width={48}
              height={48}
            />
          </motion.div>
          {/* Paint Palette - Mid Right */}
          <motion.div
            className="absolute top-[180px] right-[90px] lg:top-[200px] lg:right-[400px]"
            animate={{ y: [0, 5, 0], rotate: [0, -5, 5, 0] }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image
              src={PaintPaletteIcon}
              alt="Palette"
              width={42}
              height={42}
            />
          </motion.div>

          {/* Crayon Box - Top Right */}
          <motion.div
            className="absolute top-[50px] right-[20px] lg:top-[100px] lg:right-[200px]"
            animate={{ y: [0, 8, 0], rotate: [0, -7, 7, 0] }}
            transition={{
              y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image src={CrayonBoxIcon} alt="Crayons" width={56} height={56} />
          </motion.div>
          {/* Crayon Box - Bottom Left */}
          <motion.div
            className="absolute bottom-[50px] left-[20px] lg:bottom-[200px] lg:left-[400px]"
            animate={{ x: [0, -5, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image src={CrayonBoxIcon} alt="Crayons" width={50} height={50} />
          </motion.div>

          {/* Easel - Mid Left */}
          <motion.div
            className="absolute top-[150px] left-[50px] lg:left-[150px] lg:top-[300px]"
            animate={{ x: [0, 5, 0], rotate: [0, -3, 3, 0] }}
            transition={{
              x: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image src={EaselIcon} alt="Easel" width={48} height={48} />
          </motion.div>
          {/* Easel - Bottom Right */}
          <motion.div
            className="absolute bottom-[30px] right-[50px] lg:bottom-[80px] lg:right-[200px]"
            animate={{ x: [0, 5, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image src={EaselIcon} alt="Easel" width={52} height={52} />
          </motion.div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <CardHeader className="p-6 pb-2 text-center bg-primary/5">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-xl md:text-4xl">
                Today's Prompt
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="mt-1">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 pt-2 text-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold my-3 text-primary">
                {prompt.prompt}
              </h3>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-muted-foreground mb-6">
                {prompt.promptDescription}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              animate={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
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
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
              <Link href="/create">
                <Button className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Start Doodling
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
}
