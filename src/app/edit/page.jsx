"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import LoginModal from "@/components/LoginModal";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import quotes from "@/lib/quotes.json";

const DoodleEditor = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [doodle, setDoodle] = useState(null);
  const [doodleId, setDoodleId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quote, setQuote] = useState(null); // New state for the random quote

  // Use a single useEffect for all data fetching and state initialization
  useEffect(() => {
    // Select a random quote on component mount
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);

    const doodleIdParam = searchParams.get("id");
    if (doodleIdParam) {
      setDoodleId(doodleIdParam);
      const fetchDoodle = async () => {
        try {
          const response = await fetch(`/api/doodles/${doodleIdParam}`);
          if (!response.ok) throw new Error("Failed to fetch doodle");
          const data = await response.json();
          setDoodle(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchDoodle();
    }
  }, [searchParams]);

  const handleUpdateDoodle = async ({ title, json, imageUrl, zoomLevel, addToTodaysDoodles, editable }) => {
    if (!title) {
      toast({ title: "Missing title", description: "Please add a title." });
      return;
    }

    if (!session) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to edit a doodle.",
        variant: "destructive",
      });
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const today = new Date();
      const localDate = today.toISOString().split("T")[0];
      const response = await fetch(`/api/updateDoodle/${doodleId}?date=${localDate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, json, imageUrl, zoomLevel, addToTodaysDoodles, editable }),
      });

      if (response.ok) {
        toast({ title: "Doodle updated", description: "Your doodle has been updated!" });
      } else {
        toast({ title: "Error", description: "Failed to update doodle", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating doodle:", error);
    }
  };

  return (
    <>
      {doodle ? (
        <DoodleCanvas
          onSave={handleUpdateDoodle}
          doodle={doodle}
          userId={session?.user?.id ?? ""}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-center max-w-sm px-4">
            {quote ? (
              <>
                <span className="font-semibold italic">"{quote.quote}"</span>
                <span className="block mt-2 text-sm font-medium"> - {quote.author}</span>
              </>
            ) : (
              "Loading doodle..."
            )}
          </p>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        reason="edit-doodle"
      />
    </>
  );
};

const EditDoodle = () => {
  return (
    <Layout>
      <div className="container py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <DoodleEditor />
        </Suspense>
      </div>
    </Layout>
  );
};

export default EditDoodle;