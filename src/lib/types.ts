// src/lib/types.ts

// Existing types (unchanged)
export interface StoryMeta {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  totalParts: number;
  publishedAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  storyIds: string[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  contact: {
    email: string;
    instagram: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface BackendConfig {
  mode: 'static' | 'api';
  apiBaseUrl: string;
  endpoints: {
    stories: string;
    categories: string;
    search: string;
  };
}

export interface PaginationConfig {
  storiesPerPage: number;
  partsPerPage: number;
}

export interface SearchIndex {
  stories: {
    id: string;
    title: string;
    keywords: string[];
    tags: string[];
    category: string;
  }[];
}

// UPDATED AdsConfig with new fields
export interface AdsConfig {
  enabled: boolean;
  requireAgeConsent: boolean;
  provider: string;
  positions: {
    [key: string]: AdPositionConfig;
  };
  devices?: {
    desktop: boolean;
    mobile: boolean;
  };
  stickyAds?: {
    enabled: boolean;
    autoRefreshMinutes: number;
    hideAfterCloseMinutes: number;
  };
  smartLink?: {
    enabled: boolean;
    text: string;
    url: string;
    backgroundColor: string;
    textColor: string;
  };
}

// NEW: Detailed ad position config
export interface AdPositionConfig {
  enabled: boolean;
  type?: string;
  code?: string;
  desktopCode?: string;
  mobileCode?: string;
  devices?: {
    desktop: boolean;
    mobile: boolean;
  };
  // For list banner
  frequency?: number;
  // For story inline
  afterParts?: number;
}

// NEW: Sticky ad config
export interface StickyAdConfig {
  enabled: boolean;
  autoRefreshMinutes: number;
  hideAfterCloseMinutes: number;
  code: string;
}

// NEW: Smart link config
export interface SmartLinkConfig {
  enabled: boolean;
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
}
