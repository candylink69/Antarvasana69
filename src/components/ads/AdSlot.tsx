import { useEffect, useState } from 'react';
import { shouldShowAd, getAdCode } from '@/lib/adsSource';

interface AdSlotProps {
  position: string;
  className?: string;
}

const AdSlot = ({ position, className = '' }: AdSlotProps) => {
  const [show, setShow] = useState(false);
  const [adCode, setAdCode] = useState<string | null>(null);

  useEffect(() => {
    const checkAd = async () => {
      const shouldShow = await shouldShowAd(position);
      if (shouldShow) {
        const code = await getAdCode(position);
        setAdCode(code);
        setShow(true);
      }
    };
    checkAd();
  }, [position]);

  if (!show || !adCode) return null;

  return (
    <div 
      className={`ad-slot ad-${position} ${className}`}
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
};

export default AdSlot;

