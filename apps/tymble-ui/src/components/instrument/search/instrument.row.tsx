import type { SearchInstrument } from '@tymble/schemas';
import { INSTRUMENT_TYPE_TO_INFO_MAP } from '@/constants/instrumentType';
import { Badge } from '@/ui/badge';
import { CommandItem } from '@/ui/command';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip';

type Instrument = SearchInstrument['res']['instruments'][number];

type Props = {
  instrument: Instrument;
  onSelect: (instrumentId: string) => void;
};

export const InstrumentRow = ({ instrument, onSelect }: Props) => (
  <CommandItem
    data-cy={`instrument-row-${instrument.symbol}`}
    onSelect={() => onSelect(instrument.id)}
    value={instrument.symbol}
  >
    <div className="flex flex-1 items-center justify-between">
      <div>
        <div className="font-medium">{instrument.symbol}</div>
        <div className="text-muted-foreground text-xs">{instrument.name}</div>
      </div>
      <span className="text-muted-foreground text-xs">
        {instrument.exchange} •{' '}
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline">
              {INSTRUMENT_TYPE_TO_INFO_MAP[instrument.type].label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {INSTRUMENT_TYPE_TO_INFO_MAP[instrument.type].description}
          </TooltipContent>
        </Tooltip>
      </span>
    </div>
  </CommandItem>
);
