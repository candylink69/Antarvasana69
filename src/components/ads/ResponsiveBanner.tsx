import { useEffect, useState, useRef } from 'react';
import { getResponsiveBannerCode, getLargeBannerCode, getInlineStoryBannerCode } from '@/lib/adsSource';
import { useDeviceType, type DeviceType } from '@/hooks/useDeviceType';

interface ResponsiveBannerProps {
  className?: string;
  variant?: 'standard' | 'large' | 'inline';
}

const ResponsiveBanner = ({ className = '', variant = 'standard' }: ResponsiveBannerProps) => {
  const [adCode, setAdCode] = useState<string | null>(null);
  const deviceType = useDeviceType();
  const containerRef = useRef<HTMLDivElement>(null);
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    const loadAd = async () => {
      let code: string | null = null;
      
      switch (variant) {
        case 'large':
          code = await getLargeBannerCode(deviceType);
          break;
        case 'inline':
          code = await getInlineStoryBannerCode();
          break;
        default:
          code = await getResponsiveBannerCode(deviceType);
      }
      
      setAdCode(code);
      setAdKey(prev => prev + 1);
    };

    loadAd();
  }, [deviceType, variant]);

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

  if (!adCode) return null;

  return (
    <div className={`responsive-banner ${className}`}>
      <div 
        ref={containerRef}
        className="responsive-banner-content"
        key={adKey}
      />
      <style>{`
        .responsive-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
          overflow: hidden;
        }
        .responsive-banner-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ResponsiveBanner;
