import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataSource } from '@/lib/dataSource';
import type { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
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
          ))}
        </div>
      )}

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link to="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CategoriesPage;

