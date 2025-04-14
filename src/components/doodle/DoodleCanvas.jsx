
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import {
  Paintbrush,
  Eraser,
  Square,
  Circle,
  Undo,
  Download,
  Trash2,
  Save
} from 'lucide-react';

const DoodleCanvas = ({ onSave, initialImage, userId }) => {
  const canvasRef = useRef(null);
  const canvasElRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [brushSize, setBrushSize] = useState(5);
  const [activeColor, setActiveColor] = useState('#000000');
  const [activeTool, setActiveTool] = useState('brush');
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const undoInProgressRef = useRef(false);

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#ff9900', '#9900ff'
  ];

  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    // Set up drawing brush
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = activeColor;

    // Handle window resize
    const handleResize = () => {
      const container = canvasRef.current;
      if (!container) return;
      
      const canvasContainer = container.querySelector('.canvas-container');
      if (canvasContainer) {
        const width = Math.min(600, canvasContainer.clientWidth);
        const scale = width / 600;
        
        canvas.setWidth(width);
        canvas.setHeight(width);
        canvas.setZoom(scale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize with blank state
    setFabricCanvas(canvas);
    
    // Create initial history entry
    saveCanvasState(canvas);

    // Load initial image if provided
    if (initialImage) {
      fabric.Image.fromURL(initialImage, (img) => {
        canvas.clear();
        canvas.add(img);
        canvas.renderAll();
        saveCanvasState(canvas);
      });
    }

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update brush when tool or color changes
  useEffect(() => {
    if (!fabricCanvas) return;

    if (activeTool === 'brush' || activeTool === 'eraser') {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      fabricCanvas.freeDrawingBrush.color = activeTool === 'eraser' ? '#ffffff' : activeColor;
    } else {
      fabricCanvas.isDrawingMode = false;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  // Set up canvas event listeners for object changes
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectModification = () => {
      if (!undoInProgressRef.current) {
        saveCanvasState(fabricCanvas);
      }
    };

    fabricCanvas.on('object:added', handleObjectModification);
    fabricCanvas.on('path:created', handleObjectModification);
    fabricCanvas.on('object:modified', handleObjectModification);
    
    return () => {
      fabricCanvas.off('object:added', handleObjectModification);
      fabricCanvas.off('path:created', handleObjectModification);
      fabricCanvas.off('object:modified', handleObjectModification);
    };
  }, [fabricCanvas]);

  // Function to save the current canvas state
  const saveCanvasState = (canvas) => {
    if (!canvas || undoInProgressRef.current) return;
    
    // Get canvas state as JSON
    const json = canvas.toJSON();
    const snapshot = JSON.stringify(json);
    
    // Remove future states if we're in the middle of the history
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    
    // Limit history size
    if (newHistory.length > 30) newHistory.shift();
    
    setCanvasHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleToolClick = (tool) => {
    setActiveTool(tool);

    if (tool === 'rectangle') {
      addShape('rect');
    } else if (tool === 'circle') {
      addShape('circle');
    }
  };

  const addShape = (type) => {
    if (!fabricCanvas) return;

    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({
        left: fabricCanvas.width / 2 - 50,
        top: fabricCanvas.height / 2 - 50,
        fill: activeColor,
        width: 100,
        height: 100,
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: fabricCanvas.width / 2 - 50,
        top: fabricCanvas.height / 2 - 50,
        fill: activeColor,
        radius: 50,
      });
    }

    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
  };

  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    
    try {
      // Set flag to prevent new history entries during undo
      undoInProgressRef.current = true;
      
      // Get the previous state from history
      const newIndex = historyIndex - 1;
      const snapshot = canvasHistory[newIndex];
      
      // Load the previous state
      fabricCanvas.clear();
      fabricCanvas.loadFromJSON(JSON.parse(snapshot), () => {
        fabricCanvas.renderAll();
        setHistoryIndex(newIndex);
        
        toast({
          title: "Undo successful",
          description: "Last action has been undone",
        });
        
        // Reset flag after undo is complete
        setTimeout(() => {
          undoInProgressRef.current = false;
        }, 50);
      });
    } catch (error) {
      console.error("Error during undo operation:", error);
      undoInProgressRef.current = false;
      
      toast({
        title: "Undo failed",
        description: "Could not undo the last action",
        variant: "destructive"
      });
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    saveCanvasState(fabricCanvas);
    toast({
      title: "Canvas cleared",
      description: "Your canvas has been cleared",
    });
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `doodle-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
    
    toast({
      title: "Doodle downloaded",
      description: "Your doodle has been downloaded successfully",
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    // Pass the user ID to the onSave callback
    onSave && onSave(dataURL, userId);
    
    toast({
      title: "Doodle saved",
      description: "Your doodle has been saved successfully",
    });
  };

  const handleBrushSizeChange = (value) => {
    const size = value[0];
    setBrushSize(size);
    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = size;
    }
  };

  return (
    <div ref={canvasRef} className="flex flex-col items-center gap-4">
      <div className="canvas-container">
        <canvas ref={canvasElRef} />
      </div>
      
      <div className="w-full max-w-[600px] flex flex-col gap-4">
        <div className="flex items-center justify-between p-2 bg-card rounded-lg shadow-sm">
          <div className="flex gap-2">
            <Button
              variant={activeTool === 'brush' ? "default" : "outline"}
              size="icon"
              onClick={() => handleToolClick('brush')}
              title="Brush"
            >
              <Paintbrush className="h-4 w-4" />
            </Button>
            
            <Button
              variant={activeTool === 'eraser' ? "default" : "outline"}
              size="icon"
              onClick={() => handleToolClick('eraser')}
              title="Eraser"
            >
              <Eraser className="h-4 w-4" />
            </Button>
            
            <Button
              variant={activeTool === 'rectangle' ? "default" : "outline"}
              size="icon"
              onClick={() => handleToolClick('rectangle')}
              title="Rectangle"
            >
              <Square className="h-4 w-4" />
            </Button>
            
            <Button
              variant={activeTool === 'circle' ? "default" : "outline"}
              size="icon"
              onClick={() => handleToolClick('circle')}
              title="Circle"
            >
              <Circle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleClear}
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              onClick={handleSave}
              title="Save"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-lg shadow-sm">
            <p className="text-sm font-medium mb-2">Brush Size: {brushSize}px</p>
            <Slider
              value={[brushSize]}
              min={1}
              max={50}
              step={1}
              onValueChange={handleBrushSizeChange}
            />
          </div>
          
          <div className="p-4 bg-card rounded-lg shadow-sm">
            <p className="text-sm font-medium mb-2">Color</p>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-full border-2 ${
                    color === activeColor ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setActiveColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoodleCanvas;
