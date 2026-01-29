// src/lib/adsSource.ts
import type { AdsConfig, AdPositionConfig } from './types';
import { hasAgeConsent } from './dataSource';

let cachedAdsConfig: AdsConfig | null = null;

export async function getAdsConfig(): Promise<AdsConfig> {
  if (!cachedAdsConfig) {
    try {
      const response = await fetch('/data/config/ads.json');
      cachedAdsConfig = await response.json();
    } catch {
      // Default config with backward compatibility
      cachedAdsConfig = {
        enabled: false,
        requireAgeConsent: true,
        provider: 'custom',
        positions: {}
      };
    }
  }
  return cachedAdsConfig;
}

// Check if user is on mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

export async function shouldShowAd(position: string): Promise<boolean> {
  const config = await getAdsConfig();
  
  // Ads globally disabled
  if (!config.enabled) return false;
  
  // Check age consent if required
  if (config.requireAgeConsent && !hasAgeConsent()) return false;
  
  // Check if position is enabled
  const positionConfig = config.positions[position];
  if (!positionConfig || !positionConfig.enabled) return false;
  
  // Check device type (backward compatible)
  const isMobileDevice = isMobile();
  if (positionConfig.devices) {
    if (isMobileDevice && !positionConfig.devices.mobile) return false;
    if (!isMobileDevice && !positionConfig.devices.desktop) return false;
  }
  
  return true;
}

// Backward compatible getAdCode
export async function getAdCode(position: string): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!await shouldShowAd(position)) return null;
  
  const positionConfig = config.positions[position];
  if (!positionConfig) return null;
  
  const isMobileDevice = isMobile();
  
  // Backward compatibility: check old 'code' field first
  if (positionConfig.code && !positionConfig.desktopCode && !positionConfig.mobileCode) {
    return positionConfig.code;
  }
  
  // New structure: device-specific codes
  if (isMobileDevice && positionConfig.mobileCode) {
    return positionConfig.mobileCode;
  }
  
  if (!isMobileDevice && positionConfig.desktopCode) {
    return positionConfig.desktopCode;
  }
  
  // Fallback to old 'code' field
  return positionConfig.code || null;
}

// For sticky ads with auto-refresh
export async function getStickyAdConfig(): Promise<{
  enabled: boolean;
  code: string;
  autoRefreshMinutes: number;
  hideAfterCloseMinutes: number;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const stickyConfig = config.positions['stickyBottom'];
  if (!stickyConfig || !stickyConfig.enabled) return null;
  
  const code = await getAdCode('stickyBottom');
  if (!code) return null;
  
  return {
    enabled: true,
    code,
    autoRefreshMinutes: config.stickyAds?.autoRefreshMinutes || 10,
    hideAfterCloseMinutes: config.stickyAds?.hideAfterCloseMinutes || 10
  };
}

// For list banner (every 6 stories)
export async function getListBannerConfig(): Promise<{
  enabled: boolean;
  frequency: number;
  code: string;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const bannerConfig = config.positions['listBanner'];
  if (!bannerConfig || !bannerConfig.enabled) return null;
  
  const code = await getAdCode('listBanner');
  if (!code) return null;
  
  return {
    enabled: true,
    frequency: bannerConfig.frequency || 6,
    code
  };
}

// For smart link
export async function getSmartLinkConfig(): Promise<{
  enabled: boolean;
  code: string;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const smartConfig = config.positions['smartLink'];
  if (!smartConfig || !smartConfig.enabled) return null;
  
  const code = await getAdCode('smartLink');
  if (!code) return null;
  
  return {
    enabled: true,
    code
  };
}

// Keep existing function for backward compatibility
export async function getStoryInlineAdConfig(): Promise<{
  enabled: boolean;
  afterParts: number;
  code: string;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const inlineConfig = config.positions['storyInline'];
  if (!inlineConfig || !inlineConfig.enabled) return null;
  
  const code = await getAdCode('storyInline');
  if (!code) return null;
  
  return {
    enabled: true,
    afterParts: inlineConfig.afterParts || 2,
    code
  };
}

// Refresh config
export function refreshAdsConfig(): void {
  cachedAdsConfig = null;
}
