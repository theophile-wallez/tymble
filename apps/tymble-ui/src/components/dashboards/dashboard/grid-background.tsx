import { cn } from '@/ui/utils';

type GridBackgroundProps = {
  cols: number;
  rowHeight: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  rows?: number;
};

export const GridBackground = ({
  cols,
  rowHeight,
  margin = [10, 10],
  containerPadding = [10, 10],
  rows = 30, // Default number of rows to render
}: GridBackgroundProps) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: `${rowHeight}px`,
        gap: `${margin[1]}px ${margin[0]}px`,
        padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          className={cn(
            'rounded-md border border-border/50 border-dashed bg-muted/20 transition-opacity duration-300'
          )} // biome-ignore lint/suspicious/noArrayIndexKey: This is a static grid background
          key={i}
        />
      ))}
    </div>
  );
};
