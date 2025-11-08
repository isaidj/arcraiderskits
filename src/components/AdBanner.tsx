"use client";

import { useEffect, useRef } from "react";
import { useAds } from "@/contexts/AdsContext";

interface AdBannerProps {
  position: "left" | "right";
}

export default function AdBanner({ position }: AdBannerProps) {
  const { adsEnabled } = useAds();
  const adRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = position === "left" ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT : process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT;

  useEffect(() => {
    if (adsEnabled && !hasLoadedRef.current && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasLoadedRef.current = true;
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [adsEnabled]);

  if (!adsEnabled) {
    return null;
  }

  return (
    <div className={`fixed top-32 ${position === "left" ? "left-4" : "right-4"} hidden xl:block z-40`} style={{ width: "160px" }}>
      <div ref={adRef} className="bg-[#1a1a1a] border border-red-600/20 rounded-lg overflow-hidden" style={{ minHeight: "600px" }}>
        <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={clientId} data-ad-slot={slot} data-ad-format="vertical" data-full-width-responsive="false" />
      </div>
    </div>
  );
}
