import { useEffect, useState, useRef, useCallback } from 'react';
import { getStickyAdConfig, getResponsiveBannerCode } from '@/lib/adsSource';
import { useDeviceType } from '@/hooks/useDeviceType';
import { X } from 'lucide-react';

interface StickyAdProps {
  pageName: string;
}

const StickyAd = ({ pageName }: StickyAdProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [adCode, setAdCode] = useState<string | null>(null);
  const [config, setConfig] = useState<{ refreshMinutes: number; hideMinutes: number } | null>(null);
  const [adKey, setAdKey] = useState(0);
  const deviceType = useDeviceType();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Allowed pages for sticky ad
  const allowedPages = ['home', 'story', 'search', 'category', 'categories'];

  const loadAd = useCallback(async () => {
    const code = await getResponsiveBannerCode(deviceType);
    setAdCode(code);
    setAdKey(prev => prev + 1);
  }, [deviceType]);

  useEffect(() => {
    const init = async () => {
      if (!allowedPages.includes(pageName)) {
        setIsVisible(false);
        return;
      }

      const stickyConfig = await getStickyAdConfig();
      if (!stickyConfig.enabled) {
        setIsVisible(false);
        return;
      }

      setConfig({
        refreshMinutes: stickyConfig.refreshMinutes,
        hideMinutes: stickyConfig.hideMinutes
      });

      // Check if hidden due to close
      const hideUntil = localStorage.getItem('sticky_ad_hide_until');
      if (hideUntil && Date.now() < parseInt(hideUntil)) {
        setIsVisible(false);
        // Set timer to show again
        const remainingTime = parseInt(hideUntil) - Date.now();
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(true);
          loadAd();
        }, remainingTime);
        return;
      }

      await loadAd();
      setIsVisible(true);
    };

    init();

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pageName, loadAd]);

  // Set up refresh timer
  useEffect(() => {
    if (!isVisible || !config) return;

    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);

    refreshTimerRef.current = setInterval(() => {
      loadAd();
    }, config.refreshMinutes * 60 * 1000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [isVisible, config, loadAd]);

  // Execute ad scripts when adCode changes
  useEffect(() => {
    if (!adCode || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Create a wrapper for the ad
    const wrapper = document.createElement('div');
    wrapper.innerHTML = adCode;

    // Execute scripts
    const scripts = wrapper.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    container.appendChild(wrapper);
  }, [adCode, adKey]);

  const handleClose = () => {
    if (!config) return;

    setIsVisible(false);
    
    const hideUntilTime = Date.now() + config.hideMinutes * 60 * 1000;
    localStorage.setItem('sticky_ad_hide_until', hideUntilTime.toString());

    // Timer to show again after hide duration
    hideTimerRef.current = setTimeout(() => {
      localStorage.removeItem('sticky_ad_hide_until');
      setIsVisible(true);
      loadAd();
    }, config.hideMinutes * 60 * 1000);
  };

  if (!isVisible || !adCode) return null;

  return (
    <div className="sticky-ad-container">
      <button 
        onClick={handleClose}
        className="sticky-ad-close"
        aria-label="Close advertisement"
      >
        <X className="h-4 w-4" />
      </button>
      <div 
        ref={containerRef}
        className="sticky-ad-content"
        key={adKey}
      />
      <style>{`
        .sticky-ad-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.95);
          border-top: 1px solid hsl(var(--border));
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sticky-ad-close {
          position: absolute;
          top: 4px;
          right: 8px;
          background: hsl(var(--muted));
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
        }
        .sticky-ad-close:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        .sticky-ad-content {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }
      `}</style>
    </div>
  );
};

export default StickyAd;

