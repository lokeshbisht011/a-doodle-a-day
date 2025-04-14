
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DoodleGrid from '@/components/doodle/DoodleGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock user for now
const mockUser = {
  id: '1',
  name: 'Alex Chen',
  image: 'https://i.pravatar.cc/150?img=1',
};

// Mock data for doodles
const mockDoodles = Array(12).fill(null).map((_, index) => ({
  id: `${index + 1}`,
  prompt: ['Fantasy Creature', 'Underwater City', 'Space Explorer', 'Dream Landscape'][index % 4],
  imageUrl: `https://via.placeholder.com/400?text=Doodle+${index + 1}`,
  upvotes: Math.floor(Math.random() * 50),
  commentCount: Math.floor(Math.random() * 10),
  createdAt: new Date(Date.now() - (index * 3600000)).toISOString(),
  user: {
    id: `${(index % 3) + 1}`,
    name: ['Alex Chen', 'Jordan Smith', 'Taylor Kim'][(index % 3)],
    image: `https://i.pravatar.cc/150?img=${(index % 3) + 1}`,
  },
}));

const Gallery = () => {
  const [doodles, setDoodles] = useState(mockDoodles);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, this would filter doodles based on the search query
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    
    let sortedDoodles = [...mockDoodles];
    
    if (value === 'popular') {
      sortedDoodles.sort((a, b) => b.upvotes - a.upvotes);
    } else if (value === 'recent') {
      sortedDoodles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setDoodles(sortedDoodles);
  };

  return (
    <Layout user={mockUser}>
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
        
        <DoodleGrid doodles={doodles} />
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
