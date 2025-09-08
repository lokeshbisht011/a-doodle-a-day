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

const DoodleEditor = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [doodle, setDoodle] = useState(null);
  const [doodleId, setDoodleId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const doodleIdParam = searchParams.get("id");
    if (doodleIdParam) {
      setDoodleId(doodleIdParam);
      const fetchDoodle = async () => {
        try {
          const response = await fetch(`/api/doodle/${doodleIdParam}`);
          if (!response.ok) throw new Error("Failed to fetch doodle");
          const data = await response.json();
          setDoodle(data.doodle);
        } catch (err) {
          console.error(err);
        }
      };
      fetchDoodle();
    }
  }, [searchParams]);

  const handleUpdateDoodle = async ({ title, json, imageUrl, zoomLevel, editable }) => {
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
      // Use the correct API endpoint and HTTP method (PUT)
      const response = await fetch(`/api/doodle/${doodleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, json, imageUrl, zoomLevel, editable }),
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
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Your Doodle</h1>
      {doodle ? (
        <DoodleCanvas
          onSave={handleUpdateDoodle}
          doodle={doodle}
          userId={session?.user?.id ?? ""}
        />
      ) : (
        <p className="text-center text-muted-foreground">Loading doodle...</p>
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
  const { data: session } = useSession();

  return (
    <Layout user={session?.user ?? null}>
      <div className="container py-8">
        {/* Wrap the client component in a Suspense boundary */}
        <Suspense fallback={<div>Loading...</div>}>
          <DoodleEditor />
        </Suspense>
      </div>
    </Layout>
  );
};

export default EditDoodle;
