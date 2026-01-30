import { ReactNode } from 'react';
import ResponsiveBanner from './ResponsiveBanner';

interface ListAdsIntersperseProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  interval?: number;
  minItemsForAd?: number;
  keyExtractor: (item: T) => string;
  gridClassName?: string;
  showMinimumAd?: boolean;
}

function ListAdsIntersperse<T>({
  items,
  renderItem,
  interval = 6,
  minItemsForAd = 1,
  keyExtractor,
  gridClassName = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  showMinimumAd = true
}: ListAdsIntersperseProps<T>) {
  if (items.length === 0) return null;

  // If less than interval items, show items + one ad at bottom if showMinimumAd
  if (items.length < interval) {
    return (
      <>
        <div className={gridClassName}>
          {items.map((item, index) => (
            <div key={keyExtractor(item)}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
        {showMinimumAd && items.length >= minItemsForAd && (
          <ResponsiveBanner className="my-8" />
        )}
      </>
    );
  }

  // Split items into chunks with ads between them
  const chunks: { type: 'items' | 'ad'; items?: T[]; key: string }[] = [];
  
  for (let i = 0; i < items.length; i += interval) {
    const chunk = items.slice(i, i + interval);
    chunks.push({
      type: 'items',
      items: chunk,
      key: `chunk-${i}`
    });
    
    // Add ad after each chunk except the last one (or add at end too)
    if (i + interval < items.length) {
      chunks.push({
        type: 'ad',
        key: `ad-${i}`
      });
    }
  }

  // Always add ad at the end for consistency
  if (showMinimumAd) {
    chunks.push({
      type: 'ad',
      key: 'ad-end'
    });
  }

  return (
    <>
      {chunks.map((chunk) => {
        if (chunk.type === 'ad') {
          return <ResponsiveBanner key={chunk.key} className="my-8" />;
        }
        
        return (
          <div key={chunk.key} className={gridClassName}>
            {chunk.items?.map((item, index) => (
              <div key={keyExtractor(item)}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

export default ListAdsIntersperse;

