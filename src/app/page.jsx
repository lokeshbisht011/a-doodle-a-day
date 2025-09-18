"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PromptCard from "@/components/prompt/PromptCard";
import DoodleGrid from "@/components/doodle/DoodleGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import HowItWorksSection from "@/components/HowItWorks";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user) {
        try {
          const response = await fetch("/api/profile/user");
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    }
    fetchProfile();
  }, [session]);

  return (
    <Layout>
      <div className="container py-8">
        <div className="">
          <div className="lg:col-span-4 space-y-6">
            <PromptCard />
            <div className="lg:col-span-8 bg-card p-6 rounded-lg border shadow-sm">
              <DoodleGrid currentUserProfile={profile} />
            </div>
            <HowItWorksSection />
            <FAQSection />
          </div>
        </div>
      </div>
    </Layout>
  );
}
