/**
 * Vite Plugin: Auto Sitemap Generator
 * 
 * This plugin automatically generates sitemap.xml during build
 * by scanning the public/data directory for stories and categories.
 * 
 * No manual URL maintenance required - fully data-driven.
 */

import type { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

const SITE_URL = 'https://antarvasana69.vercel.app';

// Static routes matching App.tsx
const STATIC_ROUTES: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/categories', changefreq: 'weekly', priority: 0.8 },
  { loc: '/search', changefreq: 'weekly', priority: 0.7 },
  { loc: '/contact', changefreq: 'yearly', priority: 0.5 },
  { loc: '/dmca', changefreq: 'yearly', priority: 0.3 },
  { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
];

function getStoryIds(dataDir: string): string[] {
  const storiesDir = path.join(dataDir, 'stories');
  if (!fs.existsSync(storiesDir)) return [];

  return fs.readdirSync(storiesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name.startsWith('story-'))
    .map(entry => entry.name);
}

function getCategorySlugs(dataDir: string): string[] {
  const indexPath = path.join(dataDir, 'categories', 'index.json');
  if (!fs.existsSync(indexPath)) return [];

  try {
    const content = fs.readFileSync(indexPath, 'utf-8');
    const data = JSON.parse(content) as { categories: string[] };
    return data.categories;
  } catch {
    return [];
  }
}

function getStoryLastMod(dataDir: string, storyId: string): string | undefined {
  const metaPath = path.join(dataDir, 'stories', storyId, 'meta.json');
  try {
    if (fs.existsSync(metaPath)) {
      const content = fs.readFileSync(metaPath, 'utf-8');
      const meta = JSON.parse(content);
      return meta.updatedAt || meta.publishedAt;
    }
  } catch {
    // Skip
  }
  return undefined;
}

function generateSitemapXml(dataDir: string): string {
  const urls: SitemapUrl[] = [...STATIC_ROUTES];

  // Add categories dynamically
  const categories = getCategorySlugs(dataDir);
  for (const slug of categories) {
    urls.push({
      loc: `/category/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }

  // Add stories dynamically
  const stories = getStoryIds(dataDir);
  for (const storyId of stories) {
    const lastmod = getStoryLastMod(dataDir, storyId);
    urls.push({
      loc: `/story/${storyId}`,
      changefreq: 'monthly',
      priority: 0.9,
      lastmod,
    });
  }

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

export function sitemapPlugin(): Plugin {
  return {
    name: 'vite-plugin-auto-sitemap',
    
    // Generate sitemap when build starts
    buildStart() {
      const publicDir = path.resolve(process.cwd(), 'public');
      const dataDir = path.join(publicDir, 'data');
      
      console.log('\n🗺️  Auto-generating sitemap.xml...');
      
      const sitemap = generateSitemapXml(dataDir);
      const outputPath = path.join(publicDir, 'sitemap.xml');
      
      fs.writeFileSync(outputPath, sitemap, 'utf-8');
      
      const stories = getStoryIds(dataDir);
      const categories = getCategorySlugs(dataDir);
      
      console.log(`   📚 Stories: ${stories.length}`);
      console.log(`   📂 Categories: ${categories.length}`);
      console.log(`   🌐 Base URL: ${SITE_URL}`);
      console.log('   ✅ Sitemap generated!\n');
    },
    
    // Also regenerate on dev server start for testing
    configureServer(server) {
      const publicDir = path.resolve(process.cwd(), 'public');
      const dataDir = path.join(publicDir, 'data');
      
      // Generate on server start
      const sitemap = generateSitemapXml(dataDir);
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
      
      // Watch for data changes and regenerate
      server.watcher.on('change', (file) => {
        if (file.includes('/data/stories/') || file.includes('/data/categories/')) {
          console.log('🗺️  Data changed, regenerating sitemap...');
          const newSitemap = generateSitemapXml(dataDir);
          fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), newSitemap, 'utf-8');
          console.log('✅ Sitemap updated!');
        }
      });
    },
  };
}

export default sitemapPlugin;

