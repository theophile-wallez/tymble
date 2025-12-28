import type { CSSProperties } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip';

type Props = {
  item: {
    name: string;
    value: number;
  };
  widthPercent: number;
  index: number;
};

const colors: CSSProperties['backgroundColor'][] = [
  '#ff6b6b',
  '#20c997',
  '#fcc419',
  '#4c6ef5',
  '#e64980',
  '#868e96',
];

export const SegmentBarItem = ({ item, widthPercent, index }: Props) => {
  const color = colors[index % colors.length];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="h-full cursor-pointer rounded transition-opacity hover:opacity-80"
          style={{
            backgroundColor: color,
            width: `${widthPercent}%`,
            minWidth: widthPercent > 0 ? '4px' : '0',
          }}
        />
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
