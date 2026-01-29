// src/lib/adsSource.ts

import type { AdsConfig, StickyAdConfig, SmartLinkConfig } from './types';
import { hasAgeConsent } from './dataSource';

let cachedAdsConfig: AdsConfig | null = null;

export async function getAdsConfig(): Promise<AdsConfig> {
  if (!cachedAdsConfig) {
    try {
      const response = await fetch('/data/config/ads.json');
      cachedAdsConfig = await response.json();
    } catch {
      // Default config if file doesn't exist
      cachedAdsConfig = {
        enabled: false,
        requireAgeConsent: true,
        provider: 'custom',
        positions: {},
        devices: {
          desktop: true,
          mobile: true
        },
        stickyAds: {
          enabled: true,
          autoRefreshMinutes: 10,
          hideAfterCloseMinutes: 10
        },
        smartLink: {
          enabled: true,
          text: "pyasi bhabhiyo ki pyas bujani hai kya?🥵 asli mard ho vo yaha 👉🏻 click 👈🏻kare 🤤",
          url: "YOUR_SMART_LINK_URL",
          backgroundColor: "#ff3366",
          textColor: "#ffffff"
        }
      };
    }
  }
  return cachedAdsConfig;
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
  
  // Check device type
  const isMobileDevice = isMobile();
  if (positionConfig.devices) {
    if (isMobileDevice && !positionConfig.devices.mobile) return false;
    if (!isMobileDevice && !positionConfig.devices.desktop) return false;
  }
  
  return true;
}

// Device detection
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

export async function getAdCode(position: string): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!await shouldShowAd(position)) return null;
  
  const positionConfig = config.positions[position];
  if (!positionConfig || !positionConfig.code) return null;
  
  const isMobileDevice = isMobile();
  
  // Return device-specific code if available
  if (isMobileDevice && positionConfig.mobileCode) {
    return positionConfig.mobileCode;
  }
  
  if (!isMobileDevice && positionConfig.desktopCode) {
    return positionConfig.desktopCode;
  }
  
  // Fallback to generic code
  return positionConfig.code;
}

// Specific function for story inline ads
export async function getStoryInlineAdConfig(): Promise<{
  enabled: boolean;
  afterParts: number;
  code: string;
  mobileCode?: string;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const inlineConfig = config.positions['storyInline'];
  if (!inlineConfig || !inlineConfig.enabled) return null;
  
  const isMobileDevice = isMobile();
  
  return {
    enabled: true,
    afterParts: inlineConfig.afterParts || 2,
    code: isMobileDevice && inlineConfig.mobileCode 
      ? inlineConfig.mobileCode 
      : (inlineConfig.desktopCode || inlineConfig.code || '')
  };
}

// List banner config (every 6 stories)
export async function getListBannerConfig(): Promise<{
  enabled: boolean;
  frequency: number;
  code: string;
  mobileCode?: string;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const bannerConfig = config.positions['listBanner'];
  if (!bannerConfig || !bannerConfig.enabled) return null;
  
  const isMobileDevice = isMobile();
  
  return {
    enabled: true,
    frequency: bannerConfig.frequency || 6,
    code: isMobileDevice && bannerConfig.mobileCode 
      ? bannerConfig.mobileCode 
      : (bannerConfig.desktopCode || bannerConfig.code || '')
  };
}

// Sticky ad config
export async function getStickyAdConfig(): Promise<StickyAdConfig | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const stickyConfig = config.positions['stickyBottom'];
  if (!stickyConfig || !stickyConfig.enabled) return null;
  
  const isMobileDevice = isMobile();
  
  return {
    enabled: true,
    autoRefreshMinutes: config.stickyAds?.autoRefreshMinutes || 10,
    hideAfterCloseMinutes: config.stickyAds?.hideAfterCloseMinutes || 10,
    code: isMobileDevice && stickyConfig.mobileCode 
      ? stickyConfig.mobileCode 
      : (stickyConfig.desktopCode || stickyConfig.code || '')
  };
}

// Smart link config
export async function getSmartLinkConfig(): Promise<SmartLinkConfig | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const smartConfig = config.positions['smartLink'];
  if (!smartConfig || !smartConfig.enabled) return null;
  
  return {
    enabled: true,
    text: config.smartLink?.text || "pyasi bhabhiyo ki pyas bujani hai kya?🥵 asli mard ho vo yaha 👉🏻 click 👈🏻kare 🤤",
    url: config.smartLink?.url || "YOUR_SMART_LINK_URL",
    backgroundColor: config.smartLink?.backgroundColor || "#ff3366",
    textColor: config.smartLink?.textColor || "#ffffff"
  };
}

// Refresh config (useful when settings change)
export function refreshAdsConfig(): void {
  cachedAdsConfig = null;
}
