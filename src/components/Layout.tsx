import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgeGate from '@/components/AgeGate';
import AdFooter from '@/components/ads/AdFooter';
import { hasAgeConsent } from '@/lib/dataSource';

const Layout = () => {
  const [showContent, setShowContent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(true);

  useEffect(() => {
    // Check if user has already consented
    const consent = hasAgeConsent();
    setShowContent(consent);
    setCheckingConsent(false);
  }, []);

  const handleConsent = () => {
    setShowContent(true);
  };

  // Show loading state while checking consent
  if (checkingConsent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Age Gate - Shows before any content */}
      {!showContent && <AgeGate onConsent={handleConsent} />}

      {/* Main Content */}
      {showContent && (
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <AdFooter />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Layout;
