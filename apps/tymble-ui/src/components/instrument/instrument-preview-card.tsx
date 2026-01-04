import type { SearchedInstrument } from '@tymble/schemas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

type Props = {
  instrument: SearchedInstrument;
};

// TODO
export const InstrumentPreviewCard = ({ instrument }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>{instrument.name}</CardTitle>
      <CardDescription>{instrument.symbol}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{instrument.type}</p>
      <p>{instrument.exchange}</p>
      <p>{instrument.currency}</p>
    </CardContent>
  </Card>
);
