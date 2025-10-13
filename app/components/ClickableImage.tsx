"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ZoomIn } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ClickableImageProps {
  src: string;
  alt: string;
  featured?: boolean;
  className?: string;
}

export default function ClickableImage({
  src,
  alt,
  featured = false,
  className = "",
}: ClickableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`relative group cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 dark:bg-black/90 rounded-full p-3">
              <ZoomIn className="w-6 h-6" />
            </div>
          </div>
        </div>

        {featured && (
          <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur pointer-events-none">
            Featured
          </Badge>
        )}
      </div>

      {/* Full image dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
          <VisuallyHidden>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
