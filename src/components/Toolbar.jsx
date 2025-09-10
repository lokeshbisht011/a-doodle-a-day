// components/Toolbar.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Import Slider
import {
  Paintbrush,
  Eraser,
  PaintBucket,
  Plus,
  Square,
  Circle,
  Triangle,
  Star,
  Undo,
  Redo,
  Trash2,
  MousePointer2,
  Brush, // New icon for Brush Size dropdown
  Maximize, // New icon for Zoom dropdown
  Palette, // New icon for Color Picker dropdown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ColorPicker from "./ColorPicker"; // Import ColorPicker

export default function Toolbar({
  activeTool,
  setActiveTool,
  handleUndo,
  handleRedo,
  handleClear,
  addShape,
  canUndo,
  canRedo,
  // New props for mobile-specific controls
  brushSize,
  setBrushSize,
  zoomLevel,
  setZoomLevel,
  colors,
  activeColor,
  setActiveColor,
}) {
  return (
    <div className="flex flex-col">
      {/* Desktop Toolbar (Hidden on mobile) */}
      <div className="hidden lg:grid grid-cols-2 gap-2 mb-4">
        <Button
          variant={activeTool === "brush" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setActiveTool("brush")}
        >
          <Paintbrush className="mr-2 h-5 w-5" /> Brush
        </Button>
        <Button
          variant={activeTool === "eraser" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setActiveTool("eraser")}
        >
          <Eraser className="mr-2 h-5 w-5" /> Eraser
        </Button>
        <Button
          variant={activeTool === "fill" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setActiveTool("fill")}
        >
          <PaintBucket className="mr-2 h-5 w-5" /> Fill
        </Button>
        <Button
          variant={activeTool === "select" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setActiveTool("select")}
        >
          <MousePointer2 className="mr-2 h-5 w-5" /> Select
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <Plus className="mr-2 h-5 w-5" /> Add Shape
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addShape("rect")}>
              <Square className="mr-2 h-4 w-4" />
              <span>Square</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addShape("circle")}>
              <Circle className="mr-2 h-4 w-4" />
              <span>Circle</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addShape("triangle")}>
              <Triangle className="mr-2 h-4 w-4" />
              <span>Triangle</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addShape("star")}>
              <Star className="mr-2 h-4 w-4" />
              <span>Star</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="col-span-2 flex items-center justify-center gap-2 mt-2 p-2 border-t border-b border-gray-200">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <Undo className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <Redo className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleClear}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Toolbar (Visible on mobile only) */}
      <div className="lg:hidden flex flex-wrap justify-center gap-2 p-4 bg-gray-50 rounded-lg shadow-inner">
        {/* Main Tools */}
        <Button
          variant={activeTool === "brush" ? "default" : "outline"}
          size="icon"
          className="rounded-full"
          onClick={() => setActiveTool("brush")}
        >
          <Paintbrush className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "eraser" ? "default" : "outline"}
          size="icon"
          className="rounded-full"
          onClick={() => setActiveTool("eraser")}
        >
          <Eraser className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "fill" ? "default" : "outline"}
          size="icon"
          className="rounded-full"
          onClick={() => setActiveTool("fill")}
        >
          <PaintBucket className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTool === "select" ? "default" : "outline"}
          size="icon"
          className="rounded-full"
          onClick={() => setActiveTool("select")}
        >
          <MousePointer2 className="h-5 w-5" />
        </Button>

        {/* Dropdowns for sliders and other controls */}
        {/* Brush Size */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Brush className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-4">
            <DropdownMenuLabel>Brush Size: {brushSize}px</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Slider
              value={[brushSize]}
              min={1}
              max={50}
              step={1}
              onValueChange={(val) => setBrushSize(val[0])}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Zoom */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Maximize className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-4">
            <DropdownMenuLabel>Zoom: {(zoomLevel * 100).toFixed(0)}%</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Slider
              value={[zoomLevel]}
              min={0.2}
              max={2}
              step={0.1}
              onValueChange={(val) => setZoomLevel(val[0])}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Colors */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Palette className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4 w-72">
            <ColorPicker
              colors={colors}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Shapes Dropdown (already existed) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addShape("rect")}>
              <Square className="mr-2 h-4 w-4" />
              <span>Square</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addShape("circle")}>
              <Circle className="mr-2 h-4 w-4" />
              <span>Circle</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addShape("triangle")}>
              <Triangle className="mr-2 h-4 w-4" />
              <span>Triangle</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addShape("star")}>
              <Star className="mr-2 h-4 w-4" />
              <span>Star</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Undo, Redo, Clear */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleUndo}
          disabled={!canUndo}
        >
          <Undo className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleRedo}
          disabled={!canRedo}
        >
          <Redo className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleClear}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}