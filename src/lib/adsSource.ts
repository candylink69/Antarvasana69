// Ads Source - The ONLY ads access layer
// All ad logic flows through here

import type { AdsConfig } from './types';
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
        positions: {}
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
    afterParts: inlineConfig.afterParts || 2,
    code: inlineConfig.code
  };
}

// Refresh config (useful when settings change)
export function refreshAdsConfig(): void {
  cachedAdsConfig = null;
}

