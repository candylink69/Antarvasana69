/**
 * Sitemap Generator - Fully Automatic/Dynamic
 * 
 * This module generates sitemap.xml by:
 * 1. Reading static routes from configuration
 * 2. Dynamically fetching all stories from data files
 * 3. Dynamically fetching all categories from index.json
 * 
 * No manual URL entries required - everything is data-driven.
 */

export interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

export const SITE_URL = 'https://antarvasana69.vercel.app';

// Static routes that exist in App.tsx - these are auto-included
export const STATIC_ROUTES: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/categories', changefreq: 'weekly', priority: 0.8 },
  { loc: '/search', changefreq: 'weekly', priority: 0.7 },
  { loc: '/contact', changefreq: 'yearly', priority: 0.5 },
  { loc: '/dmca', changefreq: 'yearly', priority: 0.3 },
  { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
];

export function generateSitemapXml(urls: SitemapUrl[]): string {
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

