"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import DoodlesSection from "./DoodleSection";

const formatDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

const DoodleGrid = () => {
  const { data: session } = useSession();
  const [todayDoodles, setTodayDoodles] = useState([]);
  const [yesterdayDoodles, setYesterdayDoodles] = useState([]);
  const [loadingToday, setLoadingToday] = useState(true);
  const [loadingYesterday, setLoadingYesterday] = useState(true);

  const DoodlesLoader = () => (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-60 h-72 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"
        />
      ))}
    </div>
  );

  // Fetch today's doodles
  useEffect(() => {
    const fetchTodayDoodles = async () => {
      setLoadingToday(true);
      const today = formatDate(0);
      try {
        const res = await fetch(`/api/doodles?date=${today}`);
        const data = await res.json();
        setTodayDoodles(data);
      } catch (error) {
        console.error("Failed to fetch today's doodles:", error);
      } finally {
        setLoadingToday(false);
      }
    };
    fetchTodayDoodles();
  }, []);

  // Fetch yesterday's doodles
  useEffect(() => {
    const fetchYesterdayDoodles = async () => {
      setLoadingYesterday(true);
      const yesterday = formatDate(1);
      try {
        const res = await fetch(`/api/doodles?date=${yesterday}`);
        const data = await res.json();
        setYesterdayDoodles(data);
      } catch (error) {
        console.error("Failed to fetch yesterday's doodles:", error);
      } finally {
        setLoadingYesterday(false);
      }
    };
    fetchYesterdayDoodles();
  }, []);

  const handleDoodleDeleted = (deletedDoodleId) => {
    setTodayDoodles((prevDoodles) =>
      prevDoodles.filter((doodle) => doodle.id !== deletedDoodleId)
    );
    setYesterdayDoodles((prevDoodles) =>
      prevDoodles.filter((doodle) => doodle.id !== deletedDoodleId)
    );
  };

  return (
    <div>
      {loadingToday ? (
        <DoodlesLoader />
      ) : todayDoodles.length > 0 ? (
        <DoodlesSection
          date="Today"
          prompt={todayDoodles[0].dailyPrompt}
          doodles={todayDoodles}
          currentUserProfile={session?.user || null}
          onDoodleDeleted={handleDoodleDeleted}
        />
      ) : (
        <p className="text-muted-foreground">No doodles today.</p>
      )}

      {/* Yesterday's Section */}
      {loadingYesterday ? (
        <DoodlesLoader />
      ) : yesterdayDoodles.length > 0 ? (
        <DoodlesSection
          date="Yesterday"
          prompt={yesterdayDoodles[0].dailyPrompt}
          doodles={yesterdayDoodles}
          currentUserProfile={session?.user || null}
          onDoodleDeleted={handleDoodleDeleted}
        />
      ) : (
        <p className="text-muted-foreground">No doodles yesterday.</p>
      )}

      {todayDoodles.length === 0 &&
        yesterdayDoodles.length === 0 &&
        !loadingToday &&
        !loadingYesterday && (
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