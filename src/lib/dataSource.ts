// Data Source - The ONLY data access layer
// Switches between JSON and API adapters based on backend.json config

import { jsonAdapter } from './jsonAdapter';
import { apiAdapter } from './apiAdapter';
import type { StoryMeta, Category, SiteConfig, PaginationConfig, SearchIndex, BackendConfig } from './types';

type DataAdapter = typeof jsonAdapter;

let cachedConfig: BackendConfig | null = null;
let activeAdapter: DataAdapter | null = null;

async function getBackendConfig(): Promise<BackendConfig> {
  if (!cachedConfig) {
    const response = await fetch('/data/config/backend.json');
    cachedConfig = await response.json();
  }
  return cachedConfig;
}

async function getAdapter(): Promise<DataAdapter> {
  if (!activeAdapter) {
    const config = await getBackendConfig();
    activeAdapter = config.mode === 'api' ? apiAdapter : jsonAdapter;
  }
  return activeAdapter;
}

// Age consent management
const AGE_CONSENT_KEY = 'antarvasana69_age_consent';

export function hasAgeConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AGE_CONSENT_KEY) === 'true';
}

export function setAgeConsent(consent: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AGE_CONSENT_KEY, consent.toString());
  }
}

export function clearAgeConsent(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AGE_CONSENT_KEY);
  }
}

// Data access functions
export const dataSource = {
  async getSiteConfig(): Promise<SiteConfig> {
    const adapter = await getAdapter();
    return adapter.getSiteConfig();
  },

  async getPaginationConfig(): Promise<PaginationConfig> {
    const adapter = await getAdapter();
    return adapter.getPaginationConfig();
  },

  async getCategories(): Promise<Category[]> {
    const adapter = await getAdapter();
    return adapter.getCategories();
  },

  async getCategory(slug: string): Promise<Category | null> {
    const adapter = await getAdapter();
    return adapter.getCategory(slug);
  },

  async getStoryMeta(storyId: string): Promise<StoryMeta | null> {
    const adapter = await getAdapter();
    return adapter.getStoryMeta(storyId);
  },

  async getStoryPart(storyId: string, partNumber: number): Promise<string | null> {
    const adapter = await getAdapter();
    return adapter.getStoryPart(storyId, partNumber);
  },

  async getStoryParts(storyId: string, startPart: number, count: number): Promise<string[]> {
    const parts: string[] = [];
    const adapter = await getAdapter();
    
    for (let i = startPart; i < startPart + count; i++) {
      const part = await adapter.getStoryPart(storyId, i);
      if (part) {
        parts.push(part);
      }
    }
    
    return parts;
  },

  async getAllStories(): Promise<StoryMeta[]> {
    const adapter = await getAdapter();
    return adapter.getAllStories();
  },

  async getStoriesPaginated(page: number): Promise<{ stories: StoryMeta[]; totalPages: number }> {
    const adapter = await getAdapter();
    const config = await adapter.getPaginationConfig();
    const allStories = await adapter.getAllStories();
    
    const startIndex = (page - 1) * config.storiesPerPage;
    const stories = allStories.slice(startIndex, startIndex + config.storiesPerPage);
    const totalPages = Math.ceil(allStories.length / config.storiesPerPage);
    
    return { stories, totalPages };
  },

  async searchStories(query: string): Promise<StoryMeta[]> {
    const adapter = await getAdapter();
    return adapter.searchStories(query);
  },

  async getStoriesByCategory(categorySlug: string): Promise<StoryMeta[]> {
    const adapter = await getAdapter();
    return adapter.getStoriesByCategory(categorySlug);
  },

  async getSearchIndex(): Promise<SearchIndex> {
    const adapter = await getAdapter();
    return adapter.getSearchIndex();
  }
};

