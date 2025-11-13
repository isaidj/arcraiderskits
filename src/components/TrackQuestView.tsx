"use client";

import { useEffect } from "react";

interface TrackQuestViewProps {
  questId: string;
}

export default function TrackQuestView({ questId }: TrackQuestViewProps) {
  useEffect(() => {
    // Track the quest view
    const trackView = async () => {
      try {
        await fetch("/api/track-quest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questId }),
        });
      } catch (error) {
        // Silent fail - tracking is not critical
        console.debug("Failed to track quest view:", error);
      }
    };

    trackView();
  }, [questId]);

  return null; // This component doesn't render anything
}
