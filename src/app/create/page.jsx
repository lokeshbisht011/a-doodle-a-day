
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DoodleCanvas from '@/components/doodle/DoodleCanvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBadges } from '@/hooks/useBadges';

// Mock data
const mockPrompt = {
  id: '1',
  title: 'Fantasy Creature',
  description: 'Draw a mythical creature from your imagination. What unique features does it have?',
};

const mockUser = {
  id: '1',
  name: 'Alex Chen',
  image: 'https://i.pravatar.cc/150?img=1',
};

const mockDoodle = {
  id: '1',
  prompt: 'Fantasy Creature',
  imageUrl: 'https://via.placeholder.com/600x600',
  createdAt: new Date().toISOString(),
  user: {
    id: '1',
    name: 'Alex Chen',
    image: 'https://i.pravatar.cc/150?img=1',
  },
};

const CreateDoodle = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [initialImage, setInitialImage] = useState(null);
  const [prompt, setPrompt] = useState(mockPrompt);
  
  // Use the badge hook
  const { handleUserAction } = useBadges(mockUser.id);

  useEffect(() => {
    // Check if we're in edit mode
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    
    if (editId) {
      setEditMode(true);
      // In a real app, fetch the doodle data
      setInitialImage(mockDoodle.imageUrl);
    }
  }, [location.search]);

  const handleSaveDoodle = (imageData, userId) => {
    console.log('Saving doodle:', imageData);
    
    // In a real app, this would make an API call to save the doodle
    
    // Update user stats and check for badges
    if (userId) {
      const result = handleUserAction('doodle_created');
      
      // Show additional toast if new badges were earned
      if (result && result.newBadges && result.newBadges.length > 0) {
        // Toast is already shown by the badge service
      }
    }
    
    toast({
      title: editMode ? "Doodle updated" : "Doodle submitted",
      description: editMode 
        ? "Your doodle has been updated successfully!" 
        : "Your daily doodle has been submitted!",
    });
    
    // In a real app, navigate to the gallery or profile
    setTimeout(() => {
      navigate('/profile/1');
    }, 1500);
  };

  return (
    <Layout user={mockUser}>
      <div className="container py-8">
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>
              {editMode ? "Edit Your Doodle" : "Today's Prompt"}
            </CardTitle>
            <CardDescription>
              {editMode 
                ? "Make changes to your previous submission" 
                : new Date().toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">{prompt.title}</h3>
            <p className="text-muted-foreground">{prompt.description}</p>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editMode ? "Edit Your Doodle" : "Create Your Doodle"}
        </h2>
        
        <DoodleCanvas 
          onSave={handleSaveDoodle} 
          initialImage={initialImage}
          userId={mockUser.id}
        />
      </div>
    </Layout>
  );
};

export default CreateDoodle;
