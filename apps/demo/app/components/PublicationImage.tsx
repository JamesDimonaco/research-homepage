"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicationImageProps {
  src: string;
  alt: string;
  title: string;
}

export function PublicationImage({ src, alt, title }: PublicationImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  return (
    <>
      <div 
        className="relative overflow-hidden rounded-lg cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative w-full h-48 md:h-56 lg:h-64">
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              "object-contain bg-gray-50 dark:bg-gray-900",
              "transition-transform duration-300 group-hover:scale-105"
            )}
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          
          <div className="relative w-full h-full bg-black/90 flex flex-col">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
              <h3 className="text-white text-sm font-medium max-w-[60%] truncate">{title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="text-white hover:bg-white/20"
                >
                  Reset
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image container */}
            <div 
              ref={containerRef}
              className="flex-1 overflow-hidden relative cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={1200}
                  height={1200}
                  className="object-contain max-w-none"
                  quality={100}
                  priority
                />
              </div>
            </div>

            {/* Scale indicator */}
            <div className="absolute bottom-4 left-4 text-white/70 text-sm bg-black/50 px-2 py-1 rounded">
              {Math.round(scale * 100)}%
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}