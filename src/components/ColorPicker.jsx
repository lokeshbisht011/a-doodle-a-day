// src/components/ColorPicker.jsx
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from "@/components/ui/button";

export default function ColorPicker({ colors, activeColor, setActiveColor }) {
  const [showPicker, setShowPicker] = useState(false);

  const defaultColors = colors.slice(0, 10);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
      <p className="text-sm font-medium mb-2">Colors</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {defaultColors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 transform transition-transform duration-200 ${
              activeColor === color
                ? "border-primary scale-110"
                : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setActiveColor(color);
              setShowPicker(false);
            }}
          />
        ))}
        
        {/* New Button with Conic Gradient */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`w-8 h-8 rounded-full border-2 transform transition-transform duration-200 flex items-center justify-center relative overflow-hidden ${
            showPicker ? "border-primary scale-110" : "border-transparent"
          }`}
          title="Custom Color"
        >
          {/* Background for the gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ 
              background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)`,
            }}
          />
          {/* Inner circle to show the current active color */}
          <div 
            className="w-5 h-5 rounded-full z-10 border-2 border-white"
            style={{ backgroundColor: activeColor }}
          />
        </button>
      </div>
      
      {showPicker && (
        <div className="mt-4">
          <HexColorPicker 
            color={activeColor} 
            onChange={setActiveColor} 
          />
        </div>
      )}
    </div>
  );
}