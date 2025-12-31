import type { MouseEventHandler } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip';
import { getChartColorByIndex } from '@/utils/getChartColorByIndex';

type Props = {
  item: {
    name: string;
    value: number;
  };
  widthPercent: number;
  index: number;
  hoveredIndex: number | null;
  onHover: (index: number) => void;
  onLeave: MouseEventHandler<HTMLDivElement>;
};

export const SegmentBarItem = ({
  item,
  widthPercent,
  index,
  hoveredIndex,
  onHover,
  onLeave,
}: Props) => {
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && !isHovered;

  const color = getChartColorByIndex(index);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="h-full grow cursor-pointer not-last:pr-1"
          onMouseEnter={() => onHover(index)}
          onMouseLeave={onLeave}
          style={{
            width: `${widthPercent}%`,
            minWidth: widthPercent > 0 ? 4 : 0,
          }}
        >
          <div
            className="h-full shrink-0 rounded transition-opacity"
            style={{
              backgroundColor: color,
              opacity: isDimmed ? 0.6 : 1,
            }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded" style={{ backgroundColor: color }} />
          <span className="font-medium">{item.name}</span>
          <span className="text-muted">{item.value.toFixed(2)}%</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
