'use client'

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import DoodlesByDateSection from '@/components/doodle/DoodleSection';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const fetchDoodlesByDate = async (date) => {
  try {
    const res = await fetch(`/api/doodles?date=${date}`);
    if (!res.ok) throw new Error("Failed to fetch doodles");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const formatDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

const Gallery = () => {
  const { data: session } = useSession();
  const [doodlesByDate, setDoodlesByDate] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const daysLoaded = useRef(0);

  const loadMoreDoodles = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const dateToFetch = formatDate(daysLoaded.current);
    const data = await fetchDoodlesByDate(dateToFetch);

    if (data && data.doodles?.length > 0) {
      setDoodlesByDate(prev => [...prev, { date: dateToFetch, doodles: data.doodles, prompt: data.prompt }]);
      daysLoaded.current += 1;
      setLoading(false);
    } else {
      setHasMore(false);
      setLoading(false);
    }
  };

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
  }, [loading, hasMore]);


  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    console.log('Sorting by:', value);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Doodle Gallery</h1>
          <div className="flex w-full md:w-auto flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doodles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <Select value={sortBy} onValueChange={handleSortChange}>
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
          <Button variant="outline" className="rounded-full" size="sm">All Prompts</Button>
          <Button variant="outline" className="rounded-full" size="sm">Fantasy Creature</Button>
          <Button variant="outline" className="rounded-full" size="sm">Underwater City</Button>
          <Button variant="outline" className="rounded-full" size="sm">Space Explorer</Button>
          <Button variant="outline" className="rounded-full" size="sm">Dream Landscape</Button>
        </div>
        
        <motion.div initial="hidden" animate="visible" className="space-y-8">
          {doodlesByDate.map((section) => (
            <DoodlesByDateSection
              key={section.date}
              date={section.date}
              prompt={section.prompt}
              doodles={section.doodles}
              currentUserProfile={session?.user || null}
            />
          ))}
        </motion.div>

        <div ref={observerTarget} className="py-8">
          {loading && (
            <p className="text-center text-muted-foreground">Loading more doodles...</p>
          )}
          {!hasMore && (
            <p className="text-center text-muted-foreground">You've reached the end of the gallery.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
