// Types for the data layer
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

// Ad position config
export interface AdPositionConfig {
  enabled: boolean;
  type?: string;
  code?: string;
  afterParts?: number;
  width?: number;
  height?: number;
  url?: string;
  text?: string;
}

export interface AdsConfig {
  enabled: boolean;
  requireAgeConsent: boolean;
  provider: string;
  stickyRefreshMinutes?: number;
  stickyHideMinutes?: number;
  storyInlineAfterParts?: number;
  listBannerAfterItems?: number;
  positions: Record<string, AdPositionConfig>;
  allowedPages?: string[];
  blockedPages?: string[];
}

