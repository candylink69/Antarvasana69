// Ads Source - The ONLY ads access layer
// All ad logic flows through here

import type { AdsConfig } from './types';
import { hasAgeConsent } from './dataSource';
import { getDeviceType, type DeviceType } from '@/hooks/useDeviceType';

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
        stickyRefreshMinutes: 10,
        stickyHideMinutes: 10,
        storyInlineAfterParts: 2,
        listBannerAfterItems: 6,
        allowedPages: [],
        blockedPages: []
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
  
  return true;
}

export async function getAdCode(position: string): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!await shouldShowAd(position)) return null;
  
  const positionConfig = config.positions[position];
  return positionConfig?.code || null;
}

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
  
  return {
    enabled: true,
    afterParts: inlineConfig.afterParts || config.storyInlineAfterParts || 2,
    code: inlineConfig.code
  };
}

// Get smart link config
export async function getSmartLinkConfig(): Promise<{
  enabled: boolean;
  url: string;
  text: string;
} | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const smartLink = config.positions['smartLink'];
  if (!smartLink || !smartLink.enabled) return null;
  
  return {
    enabled: true,
    url: smartLink.url || '',
    text: smartLink.text || ''
  };
}

// Get device-responsive banner code
export async function getResponsiveBannerCode(deviceType?: DeviceType): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const device = deviceType || getDeviceType();
  
  // Desktop: 728x90, Mobile: 320x50
  const position = device === 'mobile' ? 'banner320x50' : 'banner728x90';
  const positionConfig = config.positions[position];
  
  if (!positionConfig || !positionConfig.enabled) return null;
  
  return positionConfig.code || null;
}

// Get large banner for end of story (300x250 mobile, 728x90 desktop)
export async function getLargeBannerCode(deviceType?: DeviceType): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const device = deviceType || getDeviceType();
  
  const position = device === 'mobile' ? 'banner300x250' : 'banner728x90';
  const positionConfig = config.positions[position];
  
  if (!positionConfig || !positionConfig.enabled) return null;
  
  return positionConfig.code || null;
}

// Get inline story banner (always 320x50 to blend with text)
export async function getInlineStoryBannerCode(): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const positionConfig = config.positions['banner320x50'];
  
  if (!positionConfig || !positionConfig.enabled) return null;
  
  return positionConfig.code || null;
}

// Get native banner code
export async function getNativeBannerCode(): Promise<string | null> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return null;
  if (config.requireAgeConsent && !hasAgeConsent()) return null;
  
  const positionConfig = config.positions['nativeBanner'];
  
  if (!positionConfig || !positionConfig.enabled) return null;
  
  return positionConfig.code || null;
}

// Get sticky ad config
export async function getStickyAdConfig(): Promise<{
  enabled: boolean;
  refreshMinutes: number;
  hideMinutes: number;
}> {
  const config = await getAdsConfig();
  
  return {
    enabled: config.enabled && hasAgeConsent(),
    refreshMinutes: config.stickyRefreshMinutes || 10,
    hideMinutes: config.stickyHideMinutes || 10
  };
}

// Get list banner interval
export async function getListBannerInterval(): Promise<number> {
  const config = await getAdsConfig();
  return config.listBannerAfterItems || 6;
}

// Get inline story ad interval
export async function getStoryInlineInterval(): Promise<number> {
  const config = await getAdsConfig();
  return config.storyInlineAfterParts || 2;
}

// Check if ads are allowed on current page
export async function isAdAllowedOnPage(pageName: string): Promise<boolean> {
  const config = await getAdsConfig();
  
  if (!config.enabled) return false;
  if (config.requireAgeConsent && !hasAgeConsent()) return false;
  
  // Check blocked pages first
  if (config.blockedPages?.includes(pageName)) return false;
  
  // If allowedPages is defined and not empty, check if current page is in it
  if (config.allowedPages && config.allowedPages.length > 0) {
    return config.allowedPages.includes(pageName);
  }
  
  return true;
}

// Refresh config (useful when settings change)
export function refreshAdsConfig(): void {
  cachedAdsConfig = null;
}
