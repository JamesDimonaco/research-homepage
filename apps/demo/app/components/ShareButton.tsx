"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || window.location.href;

    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: shareUrl,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
      });
    } else {
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
