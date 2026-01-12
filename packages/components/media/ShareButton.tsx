"use client";

import { Button } from "@research-homepage/ui";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export default function ShareButton({ title, text = "", url }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title,
        text,
        url: shareUrl,
      }).catch(() => {
        // Fallback: copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl);
        }
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
}
