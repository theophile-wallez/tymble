import { useEffect, useRef, useState } from 'react';
import GridLayout, { type Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { ResizeHandle } from '../widgets/resize-handle';
import { GridBackground } from './grid-background';

type DashboardGridProps = {
  isEditing: boolean;
  layout: Layout[];
  onLayoutChange: (layout: Layout[]) => void;
  children: React.ReactNode;
};

export const DashboardGrid = ({
  isEditing,
  layout,
  onLayoutChange,
  children,
}: DashboardGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {isEditing && (
        <GridBackground
          cols={12}
          containerPadding={[0, 0]}
          margin={[10, 10]}
          rowHeight={30}
        />
      )}
      <GridLayout
        className="layout"
        cols={12}
        containerPadding={[0, 0]}
        draggableHandle=".drag-handle"
        isDraggable={isEditing}
        isResizable={isEditing}
        layout={layout}
        margin={[10, 10]}
        onLayoutChange={onLayoutChange}
        resizeHandle={<ResizeHandle />}
        rowHeight={30}
        width={width}
      >
        {children}
      </GridLayout>
    </div>
  );
};
