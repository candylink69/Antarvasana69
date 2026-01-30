import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataSource } from '@/lib/dataSource';
import type { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import SmartLinkBox from '@/components/ads/SmartLinkBox';
import ResponsiveBanner from '@/components/ads/ResponsiveBanner';
import StickyAd from '@/components/ads/StickyAd';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await dataSource.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Render categories with ads interspersed (after every 6 categories)
  const renderCategoriesWithAds = () => {
    if (categories.length === 0) return null;

    const interval = 6;

    // If less than interval, show all + one ad at bottom
    if (categories.length < interval) {
      return (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <ResponsiveBanner className="my-8" />
        </>
      );
    }

    // Split into chunks with ads between
    const chunks: JSX.Element[] = [];
    
    for (let i = 0; i < categories.length; i += interval) {
      const chunk = categories.slice(i, i + interval);
      
      chunks.push(
        <div key={`chunk-${i}`} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chunk.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      );
      
      // Add ad after each chunk
      if (i + interval < categories.length) {
        chunks.push(<ResponsiveBanner key={`ad-${i}`} className="my-8" />);
      }
    }

    // Add final ad
    chunks.push(<ResponsiveBanner key="ad-end" className="my-8" />);

    return <>{chunks}</>;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
          Browse Categories
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explore stories by category. Find your favorite genre and dive in.
        </p>
      </header>

      {/* Smart Link Box */}
      <SmartLinkBox />

      {/* Categories Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-card p-6">
              <div className="mb-3 h-6 w-24 rounded bg-muted"></div>
              <div className="h-4 w-full rounded bg-muted"></div>
            </div>
          ))}
        </div>
      ) : (
        renderCategoriesWithAds()
      )}

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link to="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>

      {/* Sticky Ad */}
      <StickyAd pageName="categories" />
    </div>
  );
};

// Separate component for category card
const CategoryCard = ({ category }: { category: Category }) => (
  <Link
    to={`/category/${category.slug}`}
    className="story-card group block p-6"
  >
    <h3 className="mb-2 flex items-center justify-between text-lg font-semibold capitalize text-foreground">
      {category.name}
      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </h3>
    <p className="mb-4 text-sm text-muted-foreground">
      {category.description}
    </p>
    <span className="text-xs text-primary">
      {category.storyIds.length} {category.storyIds.length === 1 ? 'story' : 'stories'}
    </span>
  </Link>
);

export default CategoriesPage;

