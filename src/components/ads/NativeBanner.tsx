import { useEffect, useState, useRef } from 'react';
import { getNativeBannerCode } from '@/lib/adsSource';

interface NativeBannerProps {
  className?: string;
}

const NativeBanner = ({ className = '' }: NativeBannerProps) => {
  const [adCode, setAdCode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    const loadAd = async () => {
      const code = await getNativeBannerCode();
      setAdCode(code);
      setAdKey(prev => prev + 1);
    };

    loadAd();
  }, []);

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
    <div className={`native-banner ${className}`}>
      <div 
        ref={containerRef}
        className="native-banner-content"
        key={adKey}
      />
      <style>{`
        .native-banner {
          margin: 20px 0;
          padding: 12px;
          background: hsl(var(--card));
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
        }
        .native-banner-content {
          min-height: 50px;
        }
      `}</style>
    </div>
  );
};

export default NativeBanner;

