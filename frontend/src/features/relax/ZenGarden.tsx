import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface ZenGardenProps {
  onExit: () => void;
}

export default function ZenGarden({ onExit }: ZenGardenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas resolution
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        setCtx(context);
        
        // Fill initial sand color
        context.fillStyle = '#EBE3D5'; // soft sand color
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const handleReset = () => {
    if (ctx && canvasRef.current) {
      ctx.fillStyle = '#EBE3D5';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    const { x, y } = getCoordinates(e);
    
    // Draw multiple parallel lines to simulate a rake
    ctx.strokeStyle = '#D9CDB8'; // slightly darker sand color for lines
    ctx.lineWidth = 2;
    
    // We simulate rake by drawing 3 parallel paths, but it's tricky without saving all points.
    // Let's do a simple multi-line brush:
    const offsets = [-8, 0, 8];
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Actually, drawing parallel lines dynamically requires perpendicular vectors.
    // For a simple calm effect, a single thick textured line or just a simple path is good.
    // We will stick to a soft single or triple stroke by just drawing a thick line with a shadow/blur.
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Enhance the draw function for rake effect
  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    e.preventDefault(); // prevent scrolling on touch
    
    const { x, y } = getCoordinates(e);
    
    // Clear the path and create a new one every tiny movement to avoid connecting all lines?
    // No, we want a continuous line. But we want a rake effect.
    // A simple hack: draw a wide line with a pattern or just multiple wide lines.
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(217, 205, 184, 0.4)'; // soft sand shadow
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Draw inner lines
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(180, 165, 140, 0.5)';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5EFE6] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full p-6 flex justify-between items-center z-10">
        <h2 className="text-2xl font-serif font-bold text-stone-700">Zen Garden</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleReset}
            className="p-2 text-stone-500 hover:bg-stone-200/50 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 stroke-[1.5]" />
          </button>
          <button 
            onClick={onExit}
            className="p-2 text-stone-500 hover:bg-stone-200/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col relative">
        <div className="flex-1 rounded-3xl overflow-hidden shadow-inner border border-stone-300 relative bg-[#EBE3D5]">
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={handleDraw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={handleDraw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <p className="mt-6 text-stone-500 text-center text-sm font-medium">
          Drag to rake the sand and clear your mind.
        </p>
      </div>
    </div>
  );
}
