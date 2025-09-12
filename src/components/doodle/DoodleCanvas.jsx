"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Loader2, Save, Search } from "lucide-react";
import Toolbar from "../Toolbar";
import ColorPicker from "../ColorPicker";

const DoodleCanvas = ({ onSave, doodle, userId, prompt }) => {
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

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (doodle) {
      // If a doodle exists, set its properties
      if (doodle.dailyPromptId) {
        setAddToTodaysDoodles(true);
      } else {
        setAddToTodaysDoodles(false);
      }
      setAllowEdit(doodle.editable);
      // Only set the title from the prompt if the doodle doesn't already have one
      if (!doodle.title && prompt?.prompt) {
        setTitle(prompt.prompt);
      }
    } else if (prompt?.prompt) {
      // If there's no doodle but there is a prompt, set the title from the prompt
      setTitle(prompt.prompt);
      // Default values for a new doodle
      setAddToTodaysDoodles(true);
      setAllowEdit(true);
    }
  }, [doodle, prompt]);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#008080",
    "#808080",
    "#2E8B57",
    "#FFD700",
    "#1E90FF",
    "#FF4500",
    "#4B0082",
    "#A52A2A",
    "#2F4F4F",
    "#191970",
  ];

  const hexToRgba = (hex, alpha = 255) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, alpha];
  };

  const floodFill = useCallback(
    // Added a tolerance parameter
    (ctx, x, y, fillColor, imageData, originalColor, tolerance = 16) => {
      const { width, height } = imageData;
      const stack = [[x, y]];
      const [fr, fg, fb, fa] = hexToRgba(fillColor);
      const originalR = originalColor[0];
      const originalG = originalColor[1];
      const originalB = originalColor[2];
      const originalA = originalColor[3];
      const toleranceSq = tolerance * tolerance;

      const getPixelOffset = (px, py) => (py * width + px) * 4;

      const colorsMatch = (offset) => {
        const r = imageData.data[offset];
        const g = imageData.data[offset + 1];
        const b = imageData.data[offset + 2];
        const a = imageData.data[offset + 3];

        // Full transparency is always a match for other fully transparent pixels
        if (a < tolerance && originalA < tolerance) return true;

        const dr = r - originalR;
        const dg = g - originalG;
        const db = b - originalB;
        const da = a - originalA;
        // Compare squared distance to avoid expensive square roots
        return dr * dr + dg * dg + db * db + da * da < toleranceSq;
      };

      const targetFillColor = hexToRgba(fillColor);
      // Check if the target area is already the fill color
      if (
        colorsMatch(getPixelOffset(x, y)) &&
        originalR === targetFillColor[0] &&
        originalG === targetFillColor[1] &&
        originalB === targetFillColor[2] &&
        originalA === targetFillColor[3]
      ) {
        return;
      }

      const visited = new Uint8Array(width * height);

      stack.push([x, y]);
      visited[y * width + x] = 1;

      while (stack.length) {
        const [cx, cy] = stack.pop();

        const offset = getPixelOffset(cx, cy);

        if (colorsMatch(offset)) {
          imageData.data[offset] = fr;
          imageData.data[offset + 1] = fg;
          imageData.data[offset + 2] = fb;
          imageData.data[offset + 3] = fa;

          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ];
          for (const [nx, ny] of neighbors) {
            if (
              nx >= 0 &&
              nx < width &&
              ny >= 0 &&
              ny < height &&
              !visited[ny * width + nx]
            ) {
              stack.push([nx, ny]);
              visited[ny * width + nx] = 1;
            }
          }
        }
      }
    },
    []
  );

  const saveCanvasState = useCallback(
    (canvas, overwrite = false) => {
      const snapshot = JSON.stringify(canvas.toJSON());
      setHistory((prevHistory) => {
        let newHistory = overwrite
          ? [snapshot]
          : prevHistory.slice(0, historyIndex + 1).concat(snapshot);
        if (newHistory.length > 50)
          newHistory = newHistory.slice(newHistory.length - 50);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => (overwrite ? 0 : prevIndex + 1));
    },
    [historyIndex]
  );

  // Initialize canvas
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

    // Load doodle from prop or save a clean state
    if (doodle?.json) {
      try {
        const jsonToLoad = JSON.parse(doodle.json);
        canvas.loadFromJSON(
          jsonToLoad,
          () => {
            canvas.requestRenderAll();
            saveCanvasState(canvas, true);
          },
          {
            reviver: function (o, object) {
              if (
                object &&
                object.type === "path" &&
                (!object.path || object.path.length === 0)
              ) {
                return false;
              }
            },
            onError: (o, e) => {
              console.error("Error loading doodle JSON:", e);
              canvas.clear();
              saveCanvasState(canvas, true);
            },
          }
        );
      } catch (err) {
        console.error("Error parsing doodle JSON:", err);
        canvas.clear();
        saveCanvasState(canvas, true);
      }
    } else {
      saveCanvasState(canvas, true);
    }

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [doodle]);

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
    } else if (activeTool === "select") {
      fabricCanvas.isDrawingMode = false;
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  // Update zoom
  useEffect(() => {
    if (!fabricCanvas) return;

    const center = new fabric.Point(
      fabricCanvas.getWidth() / 2,
      fabricCanvas.getHeight() / 2
    );
    fabricCanvas.zoomToPoint(center, zoomLevel);

    fabricCanvas.requestRenderAll();
  }, [zoomLevel, fabricCanvas]);

  // Watch for drawing changes to update history
  const onCanvasChange = useCallback(() => {
    if (!fabricCanvas || undoInProgressRef.current) {
      return;
    }
    saveCanvasState(fabricCanvas);
  }, [fabricCanvas, saveCanvasState]);

  useEffect(() => {
    if (!fabricCanvas) return;
    const debounceTimeout = setTimeout(() => {
      fabricCanvas.on("path:created", onCanvasChange);
      fabricCanvas.on("object:modified", onCanvasChange);
    }, 250);

    return () => {
      clearTimeout(debounceTimeout);
      if (fabricCanvas) {
        fabricCanvas.off("path:created", onCanvasChange);
        fabricCanvas.off("object:modified", onCanvasChange);
      }
    };
  }, [fabricCanvas, onCanvasChange]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleCanvasClick = (options) => {
      if (activeTool === "fill" && options.e) {
        const pointer = fabricCanvas.getPointer(options.e);
        const x = Math.floor(pointer.x);
        const y = Math.floor(pointer.y);
        if (
          x < 0 ||
          x >= fabricCanvas.width ||
          y < 0 ||
          y >= fabricCanvas.height
        ) {
          return;
        }

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = fabricCanvas.width;
        tempCanvas.height = fabricCanvas.height;
        const tempCtx = tempCanvas.getContext("2d", {
          willReadFrequently: true,
        }); // Optimization for getImageData

        // Draw current canvas state onto the temporary one
        tempCtx.drawImage(fabricCanvas.getElement(), 0, 0);

        const tempImageData = tempCtx.getImageData(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        const pixel = tempCtx.getImageData(x, y, 1, 1).data;
        const originalColor = [pixel[0], pixel[1], pixel[2], pixel[3]];

        floodFill(tempCtx, x, y, activeColor, tempImageData, originalColor, 32); // Pass tolerance

        tempCtx.putImageData(tempImageData, 0, 0);

        const newImage = new fabric.Image(tempCanvas, {
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        });

        fabricCanvas.add(newImage);

        saveCanvasState(fabricCanvas);

        tempCanvas.remove();
      }
    };

    fabricCanvas.on("mouse:down", handleCanvasClick);

    return () => {
      if (fabricCanvas) {
        fabricCanvas.off("mouse:down", handleCanvasClick);
      }
    };
  }, [fabricCanvas, activeTool, activeColor, floodFill, saveCanvasState]); // Added saveCanvasState to dependencies

  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    undoInProgressRef.current = true;
    const newIndex = historyIndex - 1;
    const snapshotString = history[newIndex];
    const snapshot = JSON.parse(snapshotString);

    fabricCanvas.loadFromJSON(snapshot, () => {
      if (!canvasElRef.current) return;
      fabricCanvas.backgroundColor = snapshot.background || "#ffffff";
      fabricCanvas.requestRenderAll();
      setHistoryIndex(newIndex);
      undoInProgressRef.current = false;
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= history.length - 1) return;
    undoInProgressRef.current = true;
    const newIndex = historyIndex + 1;
    const snapshotString = history[newIndex];
    const snapshot = JSON.parse(snapshotString);

    fabricCanvas.loadFromJSON(snapshot, () => {
      if (!canvasElRef.current) return;
      fabricCanvas.backgroundColor = snapshot.background || "#ffffff";

      fabricCanvas.requestRenderAll();
      setHistoryIndex(newIndex);
      undoInProgressRef.current = false;
    });
  };

  const addShape = (type) => {
    if (!fabricCanvas) return;
    let shape;
    const center = fabricCanvas.getCenter();

    const shapeOptions = {
      left: center.left,
      top: center.top,
      fill: "transparent",
      stroke: activeColor,
      strokeWidth: brushSize,
      originX: "center",
      originY: "center",
    };

    if (type === "rect") {
      shape = new fabric.Rect({
        ...shapeOptions,
        width: 100,
        height: 100,
      });
    } else if (type === "circle") {
      shape = new fabric.Circle({
        ...shapeOptions,
        radius: 50,
      });
    } else if (type === "triangle") {
      shape = new fabric.Triangle({
        ...shapeOptions,
        width: 100,
        height: 100,
      });
    } else if (type === "star") {
      const starPoints = [
        { x: 0, y: -50 },
        { x: 14, y: -20 },
        { x: 47, y: -15 },
        { x: 23, y: 7 },
        { x: 29, y: 40 },
        { x: 0, y: 20 },
        { x: -29, y: 40 },
        { x: -23, y: 7 },
        { x: -47, y: -15 },
        { x: -14, y: -20 },
      ];
      shape = new fabric.Polyline(starPoints, {
        ...shapeOptions,
        fill: "transparent",
        stroke: activeColor,
      });
    }

    if (shape) {
      setActiveTool("select");
      fabricCanvas.isDrawingMode = false; // Disable drawing mode to interact with the shape
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.requestRenderAll();
      saveCanvasState(fabricCanvas);
    }
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

  const handleSave = async () => {
    if (!fabricCanvas) return;

    setIsSaving(true);

    const imageUrl = fabricCanvas.toDataURL({ format: "png", quality: 1 });
    const json = JSON.stringify(fabricCanvas.toJSON());

    try {
      await onSave({
        imageUrl,
        json,
        title,
        zoomLevel,
        userId,
        addToTodaysDoodles,
        editable: allowEdit,
      });
    } catch (err) {
      console.error("Failed to save doodle:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center p-4 min-h-screen bg-gray-50">
      {/* Mobile-first: Toolbar and controls at the top */}
      <div className="flex-1 w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-xl lg:mr-8 mb-6 lg:mb-0 lg:hidden">
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
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleClear={handleClear}
          addShape={addShape}
          canUndo={!(historyIndex <= 0)}
          canRedo={!(historyIndex >= history.length - 1)}
          // Pass state and setters for dropdowns
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          colors={colors}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
        />
        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={addToTodaysDoodles}
              onCheckedChange={setAddToTodaysDoodles}
            />
            <span>Add to Today’s Doodle</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={allowEdit} onCheckedChange={setAllowEdit} />
            <span>Allow others to edit</span>
          </label>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSave}
            className="w-full rounded-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" /> Save Doodle
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="w-full rounded-full"
          >
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
        </div>
      </div>

      {/* Canvas Section */}
      <div
        ref={canvasRef}
        className="flex-1 max-w-[600px] relative flex items-start justify-center p-4 bg-gray-100 rounded-lg shadow-inner order-first lg:order-none w-full"
      >
        <canvas
          ref={canvasElRef}
          className="border border-border rounded-lg shadow-md"
        />
      </div>

      {/* Desktop View: Toolbar and controls on the side */}
      <div className="hidden lg:flex flex-1 w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-xl lg:ml-8 mb-6 lg:mb-0 flex-col">
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
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleClear={handleClear}
          addShape={addShape}
          canUndo={!(historyIndex <= 0)}
          canRedo={!(historyIndex >= history.length - 1)}
        />
        {/* Sliders and other controls that are only visible on desktop */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
          <p className="text-sm font-medium mb-2">Brush Size: {brushSize}px</p>
          <Slider
            value={[brushSize]}
            min={1}
            max={50}
            step={1}
            onValueChange={(val) => setBrushSize(val[0])}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">
              Zoom: {(zoomLevel * 100).toFixed(0)}%
            </p>
            <Button variant="ghost" size="sm" onClick={() => setZoomLevel(1)}>
              <Search className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
          <Slider
            value={[zoomLevel]}
            min={0.2}
            max={2}
            step={0.1}
            onValueChange={(val) => setZoomLevel(val[0])}
          />
        </div>
        <ColorPicker
          colors={colors}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
        />
        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={addToTodaysDoodles}
              onCheckedChange={setAddToTodaysDoodles}
            />
            <span>Add to Today’s Doodle</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={allowEdit} onCheckedChange={setAllowEdit} />
            <span>Allow others to edit</span>
          </label>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSave}
            className="w-full rounded-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" /> Save Doodle
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="w-full rounded-full"
          >
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoodleCanvas;
