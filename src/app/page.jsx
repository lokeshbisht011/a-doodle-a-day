"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PromptCard from "@/components/prompt/PromptCard";
import DoodleGrid from "@/components/doodle/DoodleGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user) {
        try {
          const response = await fetch("/api/profile/user")
          if (response.ok) {
            const data = await response.json()
            setProfile(data)
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      }
    }
    fetchProfile()
  }, [session])

  return (
    <Layout>
      <div className="container py-8">
        <div className="">
          <div className="lg:col-span-4 space-y-6">
            <PromptCard />
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

          <div className="lg:col-span-8 bg-card p-6 rounded-lg border shadow-sm">
            <DoodleGrid currentUserProfile={profile} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
