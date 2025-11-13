"use client";

import { useEffect } from "react";

interface TrackItemViewProps {
  itemId: string;
}

export default function TrackItemView({ itemId }: TrackItemViewProps) {
  useEffect(() => {
    // Track the item view
    const trackView = async () => {
      try {
        await fetch("/api/track-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        });
      } catch (error) {
        // Silent fail - tracking is not critical
        console.debug("Failed to track item view:", error);
      }
    };

    trackView();
  }, [itemId]);

  return null; // This component doesn't render anything
}
