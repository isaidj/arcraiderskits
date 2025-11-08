'use client';

import { useEffect, useRef } from 'react';
import { useAds } from '@/contexts/AdsContext';

export default function MobileAdBanner() {
  const { adsEnabled } = useAds();
  const adRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE;

  useEffect(() => {
    if (adsEnabled && !hasLoadedRef.current && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasLoadedRef.current = true;
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adsEnabled]);

  if (!adsEnabled) {
    return null;
  }

  return (
    <div 
      className="relative bottom-0 left-0 right-0 xl:hidden z-40 bg-[#0a0a0a] border-t border-red-600/20 mt-8"
      style={{ maxHeight: '60px' }}
    >
      <div 
        ref={adRef}
        className="w-full flex items-center justify-center overflow-hidden"
        style={{ height: '50px', maxHeight: '50px' }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '320px', height: '50px', maxHeight: '50px' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format="rectangle"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}
