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

const DoodleGrid = ({ currentUserProfile }) => {
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
    <section className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Latest Doodles
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A gallery of the most recent and popular doodles from our community.
          </p>
        </div>

        <div>
          {loadingToday ? (
            <DoodlesLoader />
          ) : (
            todayDoodles.length > 0 && (
              <DoodlesSection
                date="Today's Doodles"
                prompt={todayDoodles[0].dailyPrompt}
                doodles={todayDoodles}
                currentUserProfile={currentUserProfile}
                onDoodleDeleted={handleDoodleDeleted}
              />
            )
          )}
          {loadingYesterday ? (
            <DoodlesLoader />
          ) : (
            yesterdayDoodles.length > 0 && (
              <DoodlesSection
                date="Yesterday's Doodles"
                prompt={yesterdayDoodles[0].dailyPrompt}
                doodles={yesterdayDoodles}
                currentUserProfile={currentUserProfile}
                onDoodleDeleted={handleDoodleDeleted}
              />
            )
          )}

          {todayDoodles.length === 0 &&
            yesterdayDoodles.length === 0 &&
            !loadingToday &&
            !loadingYesterday && (
              <p className="text-muted-foreground">
                No recent doodles to display.
              </p>
            )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/gallery">
            <Button variant="outline">View More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoodleGrid;
