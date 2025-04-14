'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import DoodleCanvas from '@/components/doodle/DoodleCanvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBadges } from '@/hooks/useBadges';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [initialImage, setInitialImage] = useState(null);
  const [prompt, setPrompt] = useState(mockPrompt);

  const { handleUserAction } = useBadges(mockUser.id);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditMode(true);
      setInitialImage(mockDoodle.imageUrl);
    }
  }, [searchParams]);

  const handleSaveDoodle = (imageData, userId) => {
    console.log('Saving doodle:', imageData);

    if (userId) {
      const result = handleUserAction('doodle_created');
      if (result?.newBadges?.length > 0) {
        // Badge hook handles toast
      }
    }

    toast({
      title: editMode ? 'Doodle updated' : 'Doodle submitted',
      description: editMode
        ? 'Your doodle has been updated successfully!'
        : 'Your daily doodle has been submitted!',
    });

    setTimeout(() => {
      router.push(`/profile/${mockUser.id}`);
    }, 1500);
  };

  return (
    <Layout user={mockUser}>
      <div className="container py-8">
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>
              {editMode ? 'Edit Your Doodle' : "Today's Prompt"}
            </CardTitle>
            <CardDescription>
              {editMode
                ? 'Make changes to your previous submission'
                : new Date().toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <h3 className="text-xl font-semibold mb-2">{prompt.title}</h3>
            <p className="text-muted-foreground">{prompt.description}</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {editMode ? 'Edit Your Doodle' : 'Create Your Doodle'}
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
