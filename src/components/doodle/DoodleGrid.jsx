'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DoodleSection from "./DoodleSection"
import { useSession } from "next-auth/react"

const formatDate = (daysAgo = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split("T")[0]
}

const DoodleGrid = () => {
  const { data: session } = useSession();
  const [doodlesByDate, setDoodlesByDate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDoodles = async () => {
      setLoading(true);
      const today = formatDate(0);
      const yesterday = formatDate(1);

      try {
        const [todayRes, yesterdayRes] = await Promise.all([
          fetch(`/api/doodles?date=${today}`),
          fetch(`/api/doodles?date=${yesterday}`)
        ]);

        const todayData = await todayRes.json();
        const yesterdayData = await yesterdayRes.json();

        const newDoodles = [];
        if (todayData?.doodles?.length > 0) {
          newDoodles.push({ date: today, doodles: todayData.doodles, prompt: todayData.prompt });
        }
        if (yesterdayData?.doodles?.length > 0) {
          newDoodles.push({ date: yesterday, doodles: yesterdayData.doodles, prompt: yesterdayData.prompt });
        }
        setDoodlesByDate(newDoodles);

      } catch (error) {
        console.error("Failed to fetch recent doodles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentDoodles();
  }, []);

  const DoodlesLoader = () => (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-60 h-72 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      {loading ? (
        <DoodlesLoader />
      ) : doodlesByDate.length > 0 ? (
        doodlesByDate.map((section) => (
          <DoodleSection
            key={section.date}
            date={section.date}
            prompt={section.prompt}
            doodles={section.doodles}
            currentUserProfile={session?.user || null}
          />
        ))
      ) : (
        <p className="text-muted-foreground">No recent doodles to display.</p>
      )}

      <div className="text-center mt-6">
        <Link href="/gallery">
          <Button variant="outline">View More</Button>
        </Link>
      </div>
    </div>
  );
};

export default DoodleGrid;
