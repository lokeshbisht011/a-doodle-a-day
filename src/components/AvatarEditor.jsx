"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Avatar from "boring-avatars";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

// Palettes from your original code
const palettes = [
  ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
  ["#6DB3F2", "#1C4E80", "#E6F7FF", "#F0A6CA", "#9B5DE5"],
  ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
  ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
];

const generateAvatars = (count) => {
  const newAvatars = Array.from({ length: count }, () => ({
    seed: Math.random().toString(36).slice(2, 9),
    variant: "beam",
    colors: palettes[Math.floor(Math.random() * palettes.length)],
  }));
  return newAvatars;
};

export default function AvatarEditor({ value, onChange }) {
  const [avatars, setAvatars] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setAvatars(generateAvatars(20));
  }, []);

  const handleScroll = useCallback(() => {
    const scrollDiv = scrollRef.current;
    if (scrollDiv) {
      const { scrollWidth, scrollLeft, clientWidth } = scrollDiv;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 100;
      
      if (isAtEnd && !isGenerating) {
        setIsGenerating(true);
        setTimeout(() => {
          setAvatars((prevAvatars) => [
            ...prevAvatars,
            ...generateAvatars(10),
          ]);
          setIsGenerating(false);
        }, 500);
      }
    }
  }, [isGenerating]);

  useEffect(() => {
    const scrollDiv = scrollRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener("scroll", handleScroll);
      return () => scrollDiv.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm font-medium">Choose your Avatar</p>
      </div>
      <div 
        ref={scrollRef}
        className="overflow-x-auto"
        style={{ 
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex items-center gap-3 py-2 pr-3">
          {avatars.map((config) => {
            const selected = value?.seed === config.seed;
            return (
              <button
                key={config.seed}
                type="button"
                onClick={() => onChange(config)}
                className={`relative flex-shrink-0 rounded-full p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected ? "ring-2 ring-purple-500" : "ring-0"
                }`}
                aria-label={`Choose avatar ${config.seed}`}
              >
                <Avatar
                  size={64}
                  name={config.seed}
                  variant={config.variant}
                  colors={config.colors}
                />
              </button>
            );
          })}
          {isGenerating && (
            <div className="flex-shrink-0 flex items-center justify-center w-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}