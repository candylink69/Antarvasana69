import { useState, useEffect } from 'react';
import { hasAgeConsent, setAgeConsent } from '@/lib/dataSource';

interface AgeGateProps {
  onConsent: () => void;
}

const AgeGate = ({ onConsent }: AgeGateProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    if (!hasAgeConsent()) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = () => {
    setAgeConsent(true);
    setIsVisible(false);
    onConsent();
  };

  const handleDecline = () => {
    // Redirect to Google or show message
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="age-gate-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="animate-scale-in w-full max-w-md rounded-xl bg-card p-8 text-center shadow-2xl">
        {/* Warning Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <svg 
            className="h-8 w-8 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          Adult Content Warning
        </h1>

        {/* Message */}
        <p className="mb-6 text-muted-foreground">
          This website contains adult content intended for individuals aged 
          <span className="font-bold text-primary"> 18 years or older</span>. 
          By entering, you confirm that you are of legal age in your jurisdiction.
        </p>

        {/* Age Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-lg font-bold text-primary">
          <span>18+</span>
          <span className="text-sm font-normal">Adults Only</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleConsent}
            className="btn-primary w-full sm:w-auto"
          >
            I am 18+ - Enter
          </button>
          <button
            onClick={handleDecline}
            className="btn-secondary w-full sm:w-auto"
          >
            Exit
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-muted-foreground">
          By clicking "I am 18+ - Enter", you agree to our Terms of Service 
          and confirm you are of legal age.
        </p>
      </div>
    </div>
  );
};

export default AgeGate;

