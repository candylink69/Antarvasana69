import { useEffect, useRef, useCallback } from 'react';

interface StoryReaderProps {
  content: string;
  partNumber: number;
}

const StoryReader = ({ content, partNumber }: StoryReaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent copy/cut/contextmenu
  const handleCopy = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Block Ctrl+C, Ctrl+A, Ctrl+X
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'x')) {
      e.preventDefault();
      return false;
    }
    // Block Cmd+C, Cmd+A, Cmd+X (Mac)
    if (e.metaKey && (e.key === 'c' || e.key === 'a' || e.key === 'x')) {
      e.preventDefault();
      return false;
    }
  }, []);

  const handleSelectStart = useCallback((e: Event) => {
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add event listeners
    container.addEventListener('copy', handleCopy);
    container.addEventListener('cut', handleCopy);
    container.addEventListener('contextmenu', handleContextMenu);
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('selectstart', handleSelectStart);

    // Cleanup
    return () => {
      container.removeEventListener('copy', handleCopy);
      container.removeEventListener('cut', handleCopy);
      container.removeEventListener('contextmenu', handleContextMenu);
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('selectstart', handleSelectStart);
    };
  }, [handleCopy, handleContextMenu, handleKeyDown, handleSelectStart]);

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div 
      ref={containerRef}
      className="protected-content story-reader-container animate-fade-in rounded-lg"
    >
      {/* Part Header */}
      <div className="mb-6 border-b border-border pb-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Part {partNumber}
        </span>
      </div>

      {/* Story Content */}
      <div className="story-text space-y-6">
        {paragraphs.map((paragraph, index) => {
          // Check if it's a title line (first line of first paragraph usually)
          const isTitle = index === 0 && paragraph.includes(' - Part');
          
          if (isTitle) {
            return null; // Skip title as we show part number above
          }

          return (
            <p key={index} className="text-story-text leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default StoryReader;

