import { Link } from 'react-router-dom';
import type { StoryMeta } from '@/lib/types';
import { Eye, Calendar } from 'lucide-react';

interface StoryCardProps {
  story: StoryMeta;
}

const StoryCard = ({ story }: StoryCardProps) => {
  const formattedDate = new Date(story.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedViews = story.views >= 1000 
    ? `${(story.views / 1000).toFixed(1)}K` 
    : story.views.toString();

  return (
    <Link to={`/story/${story.id}`} className="story-card group block">
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3 flex items-center gap-2">
          <span className="category-badge capitalize">{story.category}</span>
          {story.featured && (
            <span className="inline-flex items-center rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
              ★ Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="story-title mb-2 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
          {story.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {story.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formattedViews} views</span>
          </div>
          <span className="text-primary/70">{story.totalParts} parts</span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {story.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;

