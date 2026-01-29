// src/components/ads/AdStickyBottom.tsx
import { useEffect, useState } from 'react';
import { getAdCode, isMobile, shouldShowAd } from '@/lib/adsSource';

interface AdStickyBottomProps {
  autoRefreshMinutes?: number;
}

const AdStickyBottom = ({ autoRefreshMinutes = 10 }: AdStickyBottomProps) => {
  const [show, setShow] = useState(false);
  const [adCode, setAdCode] = useState<string | null>(null);

  const loadAd = async () => {
    const shouldShow = await shouldShowAd('stickyBottom');
    if (shouldShow) {
      const code = await getAdCode('stickyBottom');
      setAdCode(code);
      setShow(true);
    }
  };

  useEffect(() => {
    loadAd();
    
    // Auto-refresh for story pages (check if on story page)
    const isStoryPage = window.location.pathname.includes('/story/') || 
                       window.location.pathname.includes('/read/');
    
    if (isStoryPage && autoRefreshMinutes > 0) {
      const refreshInterval = autoRefreshMinutes * 60 * 1000;
      const intervalId = setInterval(loadAd, refreshInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [autoRefreshMinutes]);

  if (!show || !adCode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t">
      <div 
        className="ad-sticky-bottom"
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
      <button 
        onClick={() => setShow(false)}
        className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 text-sm"
      >
        ✕
      </button>
    </div>
  );
};

export default AdStickyBottom;
