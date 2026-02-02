// JSON Adapter - Reads data from local JSON/TXT files
import type { StoryMeta, Category, SiteConfig, PaginationConfig, SearchIndex } from './types';

const BASE_PATH = '/data';

export async function fetchJSON<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_PATH}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchText(path: string): Promise<string> {
  const response = await fetch(`${BASE_PATH}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.text();
}

export const jsonAdapter = {
  async getSiteConfig(): Promise<SiteConfig> {
    return fetchJSON<SiteConfig>('/config/site.json');
  },

  async getPaginationConfig(): Promise<PaginationConfig> {
    return fetchJSON<PaginationConfig>('/config/pagination.json');
  },

  async getCategories(): Promise<Category[]> {
    // Fetch category index dynamically - no hardcoded list
    try {
      const response = await fetch(`${BASE_PATH}/categories/index.json`);
      if (!response.ok) {
        throw new Error('Category index not found');
      }
      const index = await response.json() as { categories: string[] };
      const categories = await Promise.all(
        index.categories.map(slug => 
          fetchJSON<Category>(`/categories/${slug}.json`).catch(() => null)
        )
      );
      return categories.filter((c): c is Category => c !== null);
    } catch {
      // Fallback: try common categories if no index exists
      console.warn('No category index found, using fallback');
      return [];
    }
  },

  async getCategory(slug: string): Promise<Category | null> {
    try {
      return await fetchJSON<Category>(`/categories/${slug}.json`);
    } catch {
      return null;
    }
  },

  async getStoryMeta(storyId: string): Promise<StoryMeta | null> {
    try {
      return await fetchJSON<StoryMeta>(`/stories/${storyId}/meta.json`);
    } catch {
      return null;
    }
  },

  async getStoryPart(storyId: string, partNumber: number): Promise<string | null> {
    try {
      const partId = String(partNumber).padStart(3, '0');
      return await fetchText(`/stories/${storyId}/part-${partId}.txt`);
    } catch {
      return null;
    }
  },

  async getAllStories(): Promise<StoryMeta[]> {
    const searchIndex = await fetchJSON<SearchIndex>('/search/index.json');
    const stories = await Promise.all(
      searchIndex.stories.map(s => this.getStoryMeta(s.id))
    );
    return stories.filter((s): s is StoryMeta => s !== null);
  },

  async getSearchIndex(): Promise<SearchIndex> {
    return fetchJSON<SearchIndex>('/search/index.json');
  },

  async searchStories(query: string): Promise<StoryMeta[]> {
    const searchIndex = await this.getSearchIndex();
    const lowerQuery = query.toLowerCase();
    
    const matchingIds = searchIndex.stories
      .filter(s => 
        s.title.toLowerCase().includes(lowerQuery) ||
        s.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
        s.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
      .map(s => s.id);

    const stories = await Promise.all(
      matchingIds.map(id => this.getStoryMeta(id))
    );
    
    return stories.filter((s): s is StoryMeta => s !== null);
  },

  async getStoriesByCategory(categorySlug: string): Promise<StoryMeta[]> {
    const category = await this.getCategory(categorySlug);
    if (!category) return [];

    const stories = await Promise.all(
      category.storyIds.map(id => this.getStoryMeta(id))
    );
    
    return stories.filter((s): s is StoryMeta => s !== null);
  }
};
      
