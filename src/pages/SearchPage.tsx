import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { dataSource } from '@/lib/dataSource';
import type { StoryMeta } from '@/lib/types';
import StoryCard from '@/components/StoryCard';
import SearchBar from '@/components/SearchBar';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        const stories = await dataSource.searchStories(query);
        setResults(stories);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="page-container">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
          Search Stories
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Find stories by title, keywords, or tags
        </p>
        <div className="mx-auto max-w-xl">
          <SearchBar initialQuery={query} autoFocus />
        </div>
      </header>

      {/* Results */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-card p-5">
              <div className="mb-3 h-5 w-20 rounded bg-muted"></div>
              <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
              <div className="mb-4 h-4 w-full rounded bg-muted"></div>
              <div className="h-4 w-1/2 rounded bg-muted"></div>
            </div>
          ))}
        </div>
      ) : searched && query ? (
        <>
          {/* Results Info */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
          </div>

          {/* Results Grid */}
          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-card p-12 text-center">
              <p className="mb-2 text-lg text-foreground">No stories found</p>
              <p className="mb-6 text-muted-foreground">
                Try different keywords or browse our categories
              </p>
              <Link to="/categories" className="btn-secondary">
                Browse Categories
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">
            Enter a search term to find stories
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

