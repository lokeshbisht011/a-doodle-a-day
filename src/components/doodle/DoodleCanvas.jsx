"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Paintbrush,
  Eraser,
  Square,
  Circle,
  Undo,
  Redo,
  Download,
  Trash2,
  Save,
  PaintBucket,
  Search,
} from "lucide-react";

const DoodleCanvas = ({ onSave, doodle, userId }) => {
  const canvasRef = useRef(null);
  const canvasElRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [brushSize, setBrushSize] = useState(5);
  // Initialize state from doodle prop, or default to 1
  const [zoomLevel, setZoomLevel] = useState(doodle?.zoomLevel || 1);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState("brush");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const undoInProgressRef = useRef(false);
  // Initialize title from doodle prop
  const [title, setTitle] = useState(doodle?.title || "");
  const [addToTodaysDoodles, setAddToTodaysDoodles] = useState(true);
  const [allowEdit, setAllowEdit] = useState(true);

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB",
    "#008080", "#808080", "#2E8B57", "#FFD700", "#1E90FF",
    "#FF4500", "#4B0082", "#A52A2A", "#2F4F4F", "#191970",
  ];

  const hexToRgba = (hex, alpha = 255) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, alpha];
  };

  const floodFill = useCallback((
    ctx,
    x,
    y,
    fillColor,
    imageData,
    originalColor
  ) => {
    const { width, height } = imageData;
    const stack = [[x, y]];
    const [fr, fg, fb, fa] = hexToRgba(fillColor);

    const getPixel = (px, py) => {
      if (px < 0 || px >= width || py < 0 || py >= height) return [-1, -1, -1, -1];
      const offset = (py * width + px) * 4;
      return [
        imageData.data[offset],
        imageData.data[offset + 1],
        imageData.data[offset + 2],
        imageData.data[offset + 3],
      ];
    };

    const setPixel = (px, py) => {
      const offset = (py * width + px) * 4;
      imageData.data[offset] = fr;
      imageData.data[offset + 1] = fg;
      imageData.data[offset + 2] = fb;
      imageData.data[offset + 3] = fa;
    };

    const colorsMatch = (color1, color2) =>
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3];

    if (colorsMatch(originalColor, hexToRgba(fillColor))) {
      return;
    }

    while (stack.length) {
      const [cx, cy] = stack.pop();

      if (cy < 0 || cy >= height || cx < 0 || cx >= width) continue;

      const currentColor = getPixel(cx, cy);
      if (!colorsMatch(currentColor, originalColor)) {
        continue;
      }

      setPixel(cx, cy);

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }
  }, []);

  // Initialize canvas and load doodle or local state
  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 600,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    const handleResize = () => {
      const container = canvasRef.current;
      if (!container) return;
      const width = Math.min(600, container.clientWidth);
      canvas.setWidth(width);
      canvas.setHeight(width);
      canvas.requestRenderAll();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    setFabricCanvas(canvas);

    // Load doodle from prop or local storage
    if (doodle?.json) {
      try {
        const jsonToLoad = JSON.parse(doodle.json);
        canvas.loadFromJSON(jsonToLoad, () => {
          canvas.requestRenderAll();
          saveCanvasState(canvas, true);
        }, {
          reviver: function(o, object) {
            if (object && object.type === 'path' && (!object.path || object.path.length === 0)) {
              return false;
            }
          },
          onError: (o, e) => {
            console.error("Error loading doodle JSON:", e);
            canvas.clear();
            saveCanvasState(canvas, true);
          }
        });
      } catch (err) {
        console.error("Error parsing doodle JSON:", err);
        canvas.clear();
        saveCanvasState(canvas, true);
      }
    } else {
      const localState = localStorage.getItem('doodle-local-state');
      if (localState) {
        try {
          const { history, historyIndex, title, zoomLevel } = JSON.parse(localState);
          setHistory(history);
          setHistoryIndex(historyIndex);
          setTitle(title);
          setZoomLevel(zoomLevel);
          canvas.loadFromJSON(history[historyIndex], () => {
            canvas.requestRenderAll();
          });
        } catch (err) {
          console.error("Error loading local state:", err);
          saveCanvasState(canvas, true);
        }
      } else {
        saveCanvasState(canvas, true);
      }
    }

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [doodle]);

  // Save state to local storage on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fabricCanvas && history.length > 0) {
        const state = {
          history,
          historyIndex,
          title,
          zoomLevel,
        };
        localStorage.setItem('doodle-local-state', JSON.stringify(state));
        console.log("Doodle state saved to local storage.");
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [history, historyIndex, title, zoomLevel, fabricCanvas]);

  // Update brush
  useEffect(() => {
    if (!fabricCanvas) return;
    
    if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    }
    
    if (activeTool === "brush" || activeTool === "eraser") {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      fabricCanvas.freeDrawingBrush.color =
        activeTool === "eraser" ? "#ffffff" : activeColor;
    } else {
      fabricCanvas.isDrawingMode = false;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  // Update zoom
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const center = new fabric.Point(fabricCanvas.getWidth() / 2, fabricCanvas.getHeight() / 2);
    fabricCanvas.zoomToPoint(center, zoomLevel);
    
    fabricCanvas.requestRenderAll();
  }, [zoomLevel, fabricCanvas]);

  // Watch for drawing changes to update history
  useEffect(() => {
    if (!fabricCanvas) return;

    const handlePathCreated = () => {
      if (!undoInProgressRef.current) {
        saveCanvasState(fabricCanvas);
      }
    };

    fabricCanvas.on("path:created", handlePathCreated);
    fabricCanvas.on("object:modified", handlePathCreated);

    return () => {
      fabricCanvas.off("path:created", handlePathCreated);
      fabricCanvas.off("object:modified", handlePathCreated);
    };
  }, [fabricCanvas]);

  // Handle canvas clicks for fill tool
  useEffect(() => {
      if (!fabricCanvas) return;

      const handleCanvasClick = (options) => {
        if (activeTool === "fill" && options.e) {
          const pointer = fabricCanvas.getPointer(options.e);
          const x = Math.floor(pointer.x);
          const y = Math.floor(pointer.y);

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = fabricCanvas.width;
          tempCanvas.height = fabricCanvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          fabricCanvas.renderAll(false);
          tempCtx.drawImage(fabricCanvas.getElement(), 0, 0);
          
          const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          const pixel = tempCtx.getImageData(x, y, 1, 1).data;
          const originalColor = [pixel[0], pixel[1], pixel[2], pixel[3]];
          
          floodFill(
              tempCtx,
              x,
              y,
              activeColor,
              tempImageData,
              originalColor
          );

          tempCtx.putImageData(tempImageData, 0, 0);

          const newImage = new fabric.Image(tempCanvas, {
              left: 0,
              top: 0,
              selectable: false,
              evented: false,
          });

          fabricCanvas.add(newImage);
          fabricCanvas.sendObjectToBack(newImage); 

          saveCanvasState(fabricCanvas);

          tempCanvas.remove();
        }
      };

      fabricCanvas.on("mouse:down", handleCanvasClick);

      return () => {
        fabricCanvas.off("mouse:down", handleCanvasClick);
      };
  }, [fabricCanvas, activeTool, activeColor, floodFill]);

  const saveCanvasState = (canvas, overwrite = false) => {
    const snapshot = JSON.stringify(canvas.toJSON());
    let newHistory = overwrite
      ? [snapshot]
      : history.slice(0, historyIndex + 1).concat(snapshot);
    if (newHistory.length > 50) newHistory = newHistory.slice(newHistory.length - 50);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    undoInProgressRef.current = true;
    const newIndex = historyIndex - 1;
    const snapshot = history[newIndex];
    fabricCanvas.loadFromJSON(JSON.parse(snapshot), () => {
      fabricCanvas.requestRenderAll();
      setHistoryIndex(newIndex);
      undoInProgressRef.current = false;
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= history.length - 1) return;
    undoInProgressRef.current = true;
    const newIndex = historyIndex + 1;
    const snapshot = history[newIndex];
    fabricCanvas.loadFromJSON(JSON.parse(snapshot), () => {
      fabricCanvas.requestRenderAll();
      setHistoryIndex(newIndex);
      undoInProgressRef.current = false;
    });
  };

  const addShape = (type) => {
    if (!fabricCanvas) return;
    let shape;
    const center = fabricCanvas.getCenter();
    if (type === "rect") {
      shape = new fabric.Rect({
        left: center.left - 50,
        top: center.top - 50,
        fill: activeColor,
        width: 100,
        height: 100,
      });
    } else if (type === "circle") {
      shape = new fabric.Circle({
        left: center.left - 50,
        top: center.top - 50,
        fill: activeColor,
        radius: 50,
      });
    }
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.requestRenderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.requestRenderAll();
    saveCanvasState(fabricCanvas);
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `doodle-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    const imageUrl = fabricCanvas.toDataURL({ format: "png", quality: 1 });
    const json = JSON.stringify(fabricCanvas.toJSON());
    onSave &&
      onSave({
        imageUrl,
        json,
        title,
        zoomLevel,
        userId,
        addToTodaysDoodles,
        editable: allowEdit
      });
      localStorage.removeItem('doodle-local-state');
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center p-4 min-h-screen bg-gray-50">
      <div className="flex-1 w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-xl lg:mr-8 mb-6 lg:mb-0">
        <h1 className="text-2xl font-bold mb-4 text-center">Doodle Pad</h1>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter doodle title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium text-center"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button variant={activeTool === "brush" ? "default" : "outline"} className="rounded-full" onClick={() => setActiveTool("brush")}>
            <Paintbrush className="mr-2 h-5 w-5" /> Brush
          </Button>
          <Button variant={activeTool === "eraser" ? "default" : "outline"} className="rounded-full" onClick={() => setActiveTool("eraser")}>
            <Eraser className="mr-2 h-5 w-5" /> Eraser
          </Button>
          <Button variant={activeTool === "fill" ? "default" : "outline"} className="rounded-full" onClick={() => setActiveTool("fill")}>
            <PaintBucket className="mr-2 h-5 w-5" /> Fill
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => addShape("rect")}>
            <Square className="mr-2 h-5 w-5" /> Square
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => addShape("circle")}>
            <Circle className="mr-2 h-5 w-5" /> Circle
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 p-2 border-t border-b border-gray-200">
          <Button variant="outline" size="icon" className="rounded-full" onClick={handleUndo} disabled={historyIndex <= 0}>
            <Undo className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
            <Redo className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={handleClear}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
          <p className="text-sm font-medium mb-2">Brush Size: {brushSize}px</p>
          <Slider value={[brushSize]} min={1} max={50} step={1} onValueChange={(val) => setBrushSize(val[0])} />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Zoom: {(zoomLevel * 100).toFixed(0)}%</p>
            <Button variant="ghost" size="sm" onClick={() => setZoomLevel(1)}>
              <Search className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
          <Slider value={[zoomLevel]} min={0.2} max={2} step={0.1} onValueChange={(val) => setZoomLevel(val[0])} />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
          <p className="text-sm font-medium mb-2">Colors</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transform transition-transform duration-200 ${
                  color === activeColor ? "border-primary scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setActiveColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={addToTodaysDoodles} onCheckedChange={setAddToTodaysDoodles} />
            <span>Add to Today’s Doodle</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={allowEdit} onCheckedChange={setAllowEdit} />
            <span>Allow others to edit</span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleSave} className="w-full rounded-full">
            <Save className="mr-2 h-5 w-5" /> Save Doodle
          </Button>
          <Button variant="outline" onClick={handleDownload} className="w-full rounded-full">
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
        </div>
      </div>

      <div ref={canvasRef} className="flex-1 max-w-[600px] flex items-start justify-center p-4 bg-gray-100 rounded-lg shadow-inner">
        <canvas ref={canvasElRef} className="border border-border rounded-lg shadow-md" />
      </div>
    </div>
  );
};

export default DoodleCanvas;