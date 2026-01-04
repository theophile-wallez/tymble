import type { SearchInstrument } from '@tymble/schemas';
import { CommandItem } from '@/ui/command';
import { InstrumentBadge } from '../instrument.badge';

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
        <InstrumentBadge instrumentType={instrument.type} />
      </span>
    </div>
  </CommandItem>
);
