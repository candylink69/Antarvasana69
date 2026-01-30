import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataSource } from '@/lib/dataSource';
import type { StoryMeta, Category } from '@/lib/types';
import StoryCard from '@/components/StoryCard';
import { ArrowLeft } from 'lucide-react';
import SmartLinkBox from '@/components/ads/SmartLinkBox';
import ListAdsIntersperse from '@/components/ads/ListAdsIntersperse';
import StickyAd from '@/components/ads/StickyAd';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const cat = await dataSource.getCategory(slug);
        if (!cat) {
          setError('Category not found');
          return;
        }

        setCategory(cat);
        const categoryStories = await dataSource.getStoriesByCategory(slug);
        setStories(categoryStories);
      } catch (err) {
        setError('Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-muted"></div>
          <div className="mb-4 h-10 w-1/2 rounded bg-muted"></div>
          <div className="mb-12 h-6 w-3/4 rounded bg-muted"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="page-container">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Category Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/categories" className="btn-primary">
            View All Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back Button */}
      <Link 
        to="/categories" 
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All Categories
      </Link>

      {/* Category Header */}
      <header className="mb-12">
        <h1 className="story-title mb-4 text-3xl font-bold capitalize md:text-4xl">
          {category.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {category.description}
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          {stories.length} {stories.length === 1 ? 'story' : 'stories'}
        </div>
      </header>

      {/* Smart Link Box */}
      <SmartLinkBox />

      {/* Stories Grid with Ads */}
      {stories.length > 0 ? (
        <ListAdsIntersperse
          items={stories}
          renderItem={(story) => <StoryCard story={story} />}
          keyExtractor={(story) => story.id}
          interval={6}
          showMinimumAd={true}
        />
      ) : (
        <div className="rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No stories in this category yet.
          </p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Browse All Stories
          </Link>
        </div>
      )}

      {/* Sticky Ad */}
      <StickyAd pageName="category" />
    </div>
  );
};

export default CategoryPage;

