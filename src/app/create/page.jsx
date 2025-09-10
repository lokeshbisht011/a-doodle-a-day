"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import DoodleCanvas from "@/components/doodle/DoodleCanvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBadges } from "@/hooks/useBadges";
import LoginModal from "@/components/LoginModal";
import { Badge } from "@/components/ui/badge";
import NewBadgeModal from "@/components/badges/NewBadgeModal";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const CreateDoodle = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const {
    handleUserAction,
    showNewBadgeModal,
    setShowNewBadgeModal,
    earnedBadges,
  } = useBadges(session?.user?.id ?? "");

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

  const handleSaveDoodle = async ({
    title,
    json,
    imageUrl,
    zoomLevel,
    addToTodaysDoodles,
    editable,
  }) => {
    if (!title) {
      toast({ title: "Missing title", description: "Please add a title." });
      return;
    }

    if (!session) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to save your doodle.",
        variant: "destructive",
      });
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const today = new Date();
      const localDate = today.toISOString().split("T")[0];
      const response = await fetch(`/api/saveDoodle?date=${localDate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          json,
          imageUrl,
          zoomLevel,
          addToTodaysDoodles,
          editable,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = await handleUserAction("doodle_created");
        toast({
          title: "Doodle submitted",
          description: "Your daily doodle has been submitted!",
        });
        router.push(`/edit?id=${data.doodle.id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to save doodle",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving doodle:", error);
    }
  };

  const isLastHour = timeLeft.hours === 0;
  const countdownColor = isLastHour ? "text-red-600" : "text-green-600";

  return (
    <Layout>
      <motion.div
        className="container py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Doodle Canvas Section */}
        <motion.div variants={itemVariants} className="flex-grow">
          <DoodleCanvas
            onSave={handleSaveDoodle}
            userId={session?.user?.id ?? ""}
            prompt={prompt}
          />
        </motion.div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          reason="save-doodle"
        />

        <NewBadgeModal
          isOpen={showNewBadgeModal}
          onClose={() => setShowNewBadgeModal(false)}
          badges={earnedBadges}
        />
      </motion.div>
    </Layout>
  );
};

export default CreateDoodle;
