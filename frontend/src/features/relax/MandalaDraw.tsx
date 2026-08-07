import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MandalaDraw({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  };

  const getCoordinates = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    lastPos.current = getCoordinates(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPos = getCoordinates(e);
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const segments = 8;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#a8a29e'; // stone-400

    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 * i) / segments;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      
      const px1 = lastPos.current.x - cx;
      const py1 = lastPos.current.y - cy;
      const px2 = currentPos.x - cx;
      const py2 = currentPos.y - cy;
      
      drawLine(ctx, px1, py1, px2, py2);
      
      // Mirror
      ctx.scale(1, -1);
      drawLine(ctx, px1, py1, px2, py2);
      
      ctx.restore();
    }
    
    lastPos.current = currentPos;
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    // Resize canvas to match screen size roughly
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#F5EFE6] touch-none"
    >
      <div className="absolute top-4 right-4 z-10 pt-safe flex space-x-2">
        <button onClick={clearCanvas} className="p-2 bg-stone-200/50 rounded-full text-stone-500 hover:bg-stone-200">
          <Eraser className="w-6 h-6" />
        </button>
        <button onClick={onExit} className="p-2 bg-stone-200/50 rounded-full text-stone-500 hover:bg-stone-200">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-12 w-full text-center pointer-events-none z-10">
        <p className="text-stone-500 font-serif font-medium text-lg">Draw a mandala</p>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        className="w-full h-full cursor-crosshair"
      />
    </motion.div>
  );
}
