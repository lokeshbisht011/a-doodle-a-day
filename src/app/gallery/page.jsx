"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react"; // Imported Loader2
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import DoodleCard from "@/components/doodle/DoodleCard";

// Mock tag data for the filter buttons
const TAGS = ["All", "Fantasy Creature", "Underwater City", "Space Explorer", "Dream Landscape"];

const fetchDoodles = async ({ page, pageSize, sortBy, tag, query }) => {
  try {
    const res = await fetch(`/api/doodles/paginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&tag=${tag}&query=${query}`);
    if (!res.ok) throw new Error("Failed to fetch doodles");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { doodles: [], totalPages: 0 };
  }
};

const Gallery = () => {
  const { data: session } = useSession();
  const [doodles, setDoodles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTag, setSelectedTag] = useState('All');
  
  const observerTarget = useRef(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const refetchDoodles = useCallback(async () => {
    setLoading(true);
    setPage(1);
    const data = await fetchDoodles({ page: 1, pageSize, sortBy, tag: selectedTag, query: debouncedSearchQuery });
    setDoodles(data.doodles);
    setHasMore(data.doodles.length === pageSize);
    setLoading(false);
  }, [pageSize, sortBy, selectedTag, debouncedSearchQuery]);

  useEffect(() => {
    refetchDoodles();
  }, [refetchDoodles]);

  const loadMoreDoodles = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    const data = await fetchDoodles({ page: nextPage, pageSize, sortBy, tag: selectedTag, query: debouncedSearchQuery });
    
    setDoodles((prev) => [...prev, ...data.doodles]);
    setHasMore(data.doodles.length === pageSize);
    setLoading(false);
  }, [loading, hasMore, page, pageSize, sortBy, selectedTag, debouncedSearchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreDoodles();
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, hasMore, loadMoreDoodles]);

  const handleDoodleDeleted = (deletedDoodleId) => {
    setDoodles((prevDoodles) =>
      prevDoodles.filter((doodle) => doodle.id !== deletedDoodleId)
    );
  };

  const DoodlesLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: pageSize }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-full h-80 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Doodle Gallery</h1>
          <div className="flex w-full md:w-auto flex-col sm:flex-row gap-4">
            <form onSubmit={(e) => { e.preventDefault(); }} className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doodles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <Select value={sortBy} onValueChange={(value) => { setSortBy(value); }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6 flex gap-2 flex-wrap">
          {TAGS.map((tag) => (
            <Button 
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="rounded-full"
              size="sm"
              onClick={() => { setSelectedTag(tag); }}
            >
              {tag}
            </Button>
          ))}
        </div>
        
        {loading && page === 1 ? (
          <DoodlesLoader />
        ) : doodles.length > 0 ? (
          <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doodles.map((doodle) => (
              <div key={doodle.id} className="flex-shrink-0">
                <DoodleCard
                  doodle={doodle}
                  currentUserProfile={profile}
                  onDoodleDeleted={handleDoodleDeleted}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground">No doodles found.</p>
        )}
        
        <div ref={observerTarget} className="py-8">
          {loading && page > 1 && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading more doodles...</p>
            </div>
          )}
          {!hasMore && !loading && doodles.length > 0 && (
            <p className="text-center text-muted-foreground">You've reached the end of the gallery.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;