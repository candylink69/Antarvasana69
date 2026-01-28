// API Adapter - For future backend integration
// This file will be used when backend.json mode = "api"

import type { StoryMeta, Category, SiteConfig, PaginationConfig, SearchIndex, BackendConfig } from './types';

let backendConfig: BackendConfig | null = null;

async function getBackendConfig(): Promise<BackendConfig> {
  if (!backendConfig) {
    const response = await fetch('/data/config/backend.json');
    backendConfig = await response.json();
  }
  return backendConfig;
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  const config = await getBackendConfig();
  const response = await fetch(`${config.apiBaseUrl}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

export const apiAdapter = {
  async getSiteConfig(): Promise<SiteConfig> {
    return apiRequest<SiteConfig>('/config/site');
  },

  async getPaginationConfig(): Promise<PaginationConfig> {
    return apiRequest<PaginationConfig>('/config/pagination');
  },

  async getCategories(): Promise<Category[]> {
    const config = await getBackendConfig();
    return apiRequest<Category[]>(config.endpoints.categories);
  },

  async getCategory(slug: string): Promise<Category | null> {
    try {
      const config = await getBackendConfig();
      return await apiRequest<Category>(`${config.endpoints.categories}/${slug}`);
    } catch {
      return null;
    }
  },

  async getStoryMeta(storyId: string): Promise<StoryMeta | null> {
    try {
      const config = await getBackendConfig();
      return await apiRequest<StoryMeta>(`${config.endpoints.stories}/${storyId}`);
    } catch {
      return null;
    }
  },

  async getStoryPart(storyId: string, partNumber: number): Promise<string | null> {
    try {
      const config = await getBackendConfig();
      return await apiRequest<string>(`${config.endpoints.stories}/${storyId}/parts/${partNumber}`);
    } catch {
      return null;
    }
  },

  async getAllStories(): Promise<StoryMeta[]> {
    const config = await getBackendConfig();
    return apiRequest<StoryMeta[]>(config.endpoints.stories);
  },

  async getSearchIndex(): Promise<SearchIndex> {
    const config = await getBackendConfig();
    return apiRequest<SearchIndex>(config.endpoints.search);
  },

  async searchStories(query: string): Promise<StoryMeta[]> {
    const config = await getBackendConfig();
    return apiRequest<StoryMeta[]>(`${config.endpoints.search}?q=${encodeURIComponent(query)}`);
  },

  async getStoriesByCategory(categorySlug: string): Promise<StoryMeta[]> {
    const config = await getBackendConfig();
    return apiRequest<StoryMeta[]>(`${config.endpoints.stories}?category=${categorySlug}`);
  }
};

