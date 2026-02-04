/**
 * Sitemap Generation Script
 * 
 * This script runs at build time to generate a dynamic sitemap.xml
 * It reads all stories and categories from the data files automatically.
 * 
 * Usage: npx ts-node scripts/generate-sitemap.ts
 * Or: Called by Vite plugin during build
 */

import * as fs from 'fs';
import * as path from 'path';

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

const SITE_URL = 'https://antarvasana69.vercel.app';
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');

// Static routes - these match App.tsx routes
const STATIC_ROUTES: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/categories', changefreq: 'weekly', priority: 0.8 },
  { loc: '/search', changefreq: 'weekly', priority: 0.7 },
  { loc: '/contact', changefreq: 'yearly', priority: 0.5 },
  { loc: '/dmca', changefreq: 'yearly', priority: 0.3 },
  { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
];

/**
 * Get all story IDs by scanning the stories directory
 */
function getStoryIds(): string[] {
  const storiesDir = path.join(DATA_DIR, 'stories');
  
  if (!fs.existsSync(storiesDir)) {
    console.warn('Stories directory not found:', storiesDir);
    return [];
  }

  const entries = fs.readdirSync(storiesDir, { withFileTypes: true });
  const storyIds = entries
    .filter(entry => entry.isDirectory() && entry.name.startsWith('story-'))
    .map(entry => entry.name);

  console.log(`Found ${storyIds.length} stories:`, storyIds);
  return storyIds;
}

/**
 * Get all category slugs from the index.json
 */
function getCategorySlugs(): string[] {
  const indexPath = path.join(DATA_DIR, 'categories', 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    console.warn('Category index not found:', indexPath);
    return [];
  }

  try {
    const content = fs.readFileSync(indexPath, 'utf-8');
    const data = JSON.parse(content) as { categories: string[] };
    console.log(`Found ${data.categories.length} categories:`, data.categories);
    return data.categories;
  } catch (error) {
    console.error('Error reading category index:', error);
    return [];
  }
}

/**
 * Get story last modified date from meta.json
 */
function getStoryLastMod(storyId: string): string | undefined {
  const metaPath = path.join(DATA_DIR, 'stories', storyId, 'meta.json');
  
  try {
    if (fs.existsSync(metaPath)) {
      const content = fs.readFileSync(metaPath, 'utf-8');
      const meta = JSON.parse(content);
      return meta.updatedAt || meta.publishedAt;
    }
  } catch {
    // Ignore errors, just skip lastmod
  }
  return undefined;
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemap(): string {
  const urls: SitemapUrl[] = [...STATIC_ROUTES];

  // Add all categories dynamically
  const categories = getCategorySlugs();
  for (const slug of categories) {
    urls.push({
      loc: `/category/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }

  // Add all stories dynamically
  const stories = getStoryIds();
  for (const storyId of stories) {
    const lastmod = getStoryLastMod(storyId);
    urls.push({
      loc: `/story/${storyId}`,
      changefreq: 'monthly',
      priority: 0.9,
      lastmod,
    });
  }

  // Generate XML
  const urlEntries = urls.map(url => {
    let entry = `  <url>\n    <loc>${SITE_URL}${url.loc}</loc>\n`;
    if (url.lastmod) {
      entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
    entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    entry += `  </url>`;
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Main execution
 */
function main() {
  console.log('🗺️  Generating sitemap...');
  console.log('📁 Data directory:', DATA_DIR);
  
  const sitemap = generateSitemap();
  const outputPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  
  console.log('✅ Sitemap generated successfully!');
  console.log('📄 Output:', outputPath);
  console.log('🌐 Base URL:', SITE_URL);
}

main();

