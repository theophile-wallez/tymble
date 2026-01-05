import type { SearchedInstrument } from '@tymble/schemas';
import { CommandItem } from '@/ui/command';
import { Skeleton } from '@/ui/skeleton';
import { InstrumentBadge } from '../instrument.badge';

type Instrument = SearchedInstrument;

type Props = {
  instrument: Instrument;
  onSelect: (instrument: Instrument) => void;
};

export const InstrumentRow = ({ instrument, onSelect }: Props) => (
  <CommandItem
    data-cy={`instrument-row-${instrument.symbol}`}
    onSelect={() => onSelect(instrument)}
    value={instrument.symbol}
  >
    <div className="flex flex-1 items-center justify-between">
      <div>
        <div className="font-medium">{instrument.symbol}</div>
        <div className="text-muted-foreground text-xs">{instrument.name}</div>
      </div>
      <span className="text-muted-foreground text-xs">
        <InstrumentBadge instrumentType={instrument.type} />
      </span>
    </div>
  </CommandItem>
);

export const InstrumentRowSkeleton = () => (
  <CommandItem disabled>
    <div className="flex flex-1 items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  </CommandItem>
);
