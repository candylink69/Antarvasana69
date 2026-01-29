import { useState, useEffect } from 'react';
import { dataSource } from '@/lib/dataSource';
import type { StoryMeta } from '@/lib/types';
import StoryCard from '@/components/StoryCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import AdHomeTop from '@/components/ads/AdHomeTop';
import AdListBanner from '@/components/ads/AdListBanner';
import AdSmartLink from '@/components/ads/AdSmartLink';
import AdStickyBottom from '@/components/ads/AdStickyBottom';

const HomePage = () => {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const result = await dataSource.getStoriesPaginated(currentPage);
        setStories(result.stories);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="story-title mb-4 text-4xl font-bold md:text-5xl">
          <span className="text-primary">A</span>ntarvasana69
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Read exclusive adult stories online. New stories added regularly.
        </p>
        <div className="mx-auto max-w-xl">
          <SearchBar />
          {/* Smart Link Box */}
          <AdSmartLink />
        </div>
      </section>

      {/* Ad Slot - Home Top */}
      <AdHomeTop />

      {/* Stories Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Latest Stories</h2>
          {totalPages > 1 && (
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-card p-5">
                <div className="mb-3 h-5 w-20 rounded bg-muted"></div>
                <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
                <div className="mb-4 h-4 w-full rounded bg-muted"></div>
                <div className="h-4 w-1/2 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        ) : stories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
  <div key={story.id}>
    <StoryCard story={story} />
    {/* Show ad after every 6 stories */}
    {(index + 1) % 6 === 0 && (
      <AdListBanner />
    )}
  </div>
))}
          </div>
        ) : (
          <div className="rounded-lg bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">No stories found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
      {/* Sticky Bottom Ad */}
       <AdStickyBottom />
    </div>
  );
};

export default HomePage;

