import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataSource } from '@/lib/dataSource';
import type { StoryMeta } from '@/lib/types';
import StoryReader from '@/components/StoryReader';
import Pagination from '@/components/Pagination';
import AdStoryTop from '@/components/ads/AdStoryTop';
import AdStoryInline from '@/components/ads/AdStoryInline';
import AdSmartLink from '@/components/ads/AdSmartLink';
import AdStickyBottom from '@/components/ads/AdStickyBottom';
import AdNativeBanner from '@/components/ads/AdNativeBanner';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';

const PARTS_PER_PAGE = 5;

const StoryPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<StoryMeta | null>(null);
  const [parts, setParts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStory = async () => {
      if (!storyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const storyMeta = await dataSource.getStoryMeta(storyId);
        if (!storyMeta) {
          setError('Story not found');
          return;
        }
        
        setStory(storyMeta);
        setTotalPages(Math.ceil(storyMeta.totalParts / PARTS_PER_PAGE));
      } catch (err) {
        setError('Failed to load story');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [storyId]);

  useEffect(() => {
    const loadParts = async () => {
      if (!storyId || !story) return;

      setLoading(true);
      try {
        const startPart = (currentPage - 1) * PARTS_PER_PAGE + 1;
        const loadedParts = await dataSource.getStoryParts(storyId, startPart, PARTS_PER_PAGE);
        setParts(loadedParts);
      } catch (err) {
        console.error('Failed to load parts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, [storyId, story, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !story) {
    return (
      <div className="page-container">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-muted"></div>
          <div className="mb-4 h-10 w-3/4 rounded bg-muted"></div>
          <div className="mb-8 h-20 w-full rounded bg-muted"></div>
          <div className="h-96 w-full rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="page-container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Story Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(story.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const startPartNumber = (currentPage - 1) * PARTS_PER_PAGE + 1;

  return (
    <div className="page-container">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Link 
          to="/" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stories
        </Link>

        {/* Story Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link 
              to={`/category/${story.category}`}
              className="category-badge capitalize"
            >
              {story.category}
            </Link>
            {story.featured && (
              <span className="inline-flex items-center rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                Featured
              </span>
            )}
          </div>

          <h1 className="story-title mb-4 text-3xl font-bold md:text-4xl">
            {story.title}
          </h1>

          <p className="mb-6 text-lg text-muted-foreground">
            {story.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{story.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{story.totalParts} parts</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <span 
                key={tag} 
                className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>
        {/* Smart Link Box */}
         <AdSmartLink />

        {/* Ad Slot - Story Top */}
        <AdStoryTop />
        {/* Native Banner */}
         <AdNativeBanner />
        {/* Page Info */}
        {totalPages > 1 && (
          <div className="mb-6 rounded-lg bg-card p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Reading Parts {startPartNumber} - {Math.min(startPartNumber + PARTS_PER_PAGE - 1, story.totalParts)} of {story.totalParts}
            </p>
          </div>
        )}

        {/* Story Parts */}
        <div className="space-y-8">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-lg bg-card"></div>
              ))}
            </div>
          ) : (
            parts.map((content, index) => (
              <div key={index}>
                <StoryReader 
                  content={content} 
                  partNumber={startPartNumber + index} 
                />
                {/* Inline ad after every 2 parts */}
                {(index + 1) % 2 === 0 && index < parts.length - 1 && (
                  <AdStoryInline />
                )}
              </div>
            ))
          )}
        </div>

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

        {/* Navigation Links */}
        <div className="mt-12 flex justify-center">
          <Link to="/" className="btn-secondary">
            Browse More Stories
          </Link>
        </div>
      </div>
      {/* Sticky Bottom Ad (auto-refreshes every 10 minutes) */}
      <AdStickyBottom autoRefreshMinutes={10} />
    </div>
  );
};

export default StoryPage;

