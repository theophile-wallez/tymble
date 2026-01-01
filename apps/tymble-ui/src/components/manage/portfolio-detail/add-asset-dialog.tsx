import { useForm } from '@tanstack/react-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { type StockSearchResult, searchStocks } from '@/api/portfolios';
import { AsyncSelect } from '@/ui/async-select';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

const INSTRUMENT_TYPES = [
  { value: 'stock', label: 'Stock' },
  { value: 'bond', label: 'Bond' },
  { value: 'etf', label: 'ETF' },
  { value: 'crypto', label: 'Crypto' },
] as const;

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId: _portfolioId }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const customForm = useForm({
    defaultValues: {
      symbol: '',
      name: '',
      type: '',
      exchange: '',
      currency: '',
    },
    onSubmit: ({ value }) => {
      // TODO: Implement custom asset creation API call
      toast.info(`Adding custom asset ${value.symbol} - Coming soon!`);
      customForm.reset();
      setShowCustomForm(false);
      setDialogOpen(false);
    },
  });

  const fetchInstruments = async (query?: string) => {
    if (!query || query.length < 2) {
      return [];
    }
    const result = await searchStocks(query);
    return result.quotes || [];
  };

  const handleInstrumentSelect = (value: string) => {
    setSelectedInstrument(value);
    if (value) {
      // TODO: Implement asset creation API call
      toast.info(`Adding ${value} to portfolio - Coming soon!`);
      setSelectedInstrument('');
      setDialogOpen(false);
    }
  };

  const cancelCustomForm = () => {
    setShowCustomForm(false);
    customForm.reset();
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedInstrument('');
      setShowCustomForm(false);
      customForm.reset();
    }
  };

  return (
    <Dialog onOpenChange={handleDialogChange} open={dialogOpen}>
      <DialogTrigger asChild>
        <Card className="flex h-full min-h-[180px] cursor-pointer items-center justify-center border-2 border-dashed transition-colors hover:border-primary hover:bg-muted/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Plus className="size-8" />
            <span className="font-medium">Add Asset</span>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showCustomForm ? 'Add a custom asset' : 'Add a new asset'}
          </DialogTitle>
          <DialogDescription>
            {showCustomForm
              ? 'Manually enter the details of your asset.'
              : 'Search for a stock, ETF, or other instrument to add to your portfolio.'}
          </DialogDescription>
        </DialogHeader>

        {showCustomForm ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              customForm.handleSubmit();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="symbol">Symbol *</Label>
                <customForm.Field name="symbol">
                  {(field) => (
                    <Input
                      id="symbol"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. AAPL"
                      required
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name *</Label>
                <customForm.Field name="name">
                  {(field) => (
                    <Input
                      id="name"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Apple Inc."
                      required
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Type *</Label>
              <customForm.Field name="type">
                {(field) => (
                  <Select
                    onValueChange={(value) => field.handleChange(value)}
                    value={field.state.value}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTRUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </customForm.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="exchange">Exchange</Label>
                <customForm.Field name="exchange">
                  {(field) => (
                    <Input
                      id="exchange"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. NASDAQ"
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="currency">Currency</Label>
                <customForm.Field name="currency">
                  {(field) => (
                    <Input
                      id="currency"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. USD"
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={cancelCustomForm}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                disabled={
                  customForm.state.values.symbol === '' ||
                  customForm.state.values.name === '' ||
                  customForm.state.values.type === ''
                }
                type="submit"
              >
                Add asset
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <AsyncSelect<StockSearchResult>
              clearable={false}
              fetcher={fetchInstruments}
              getDisplayValue={(option) => (
                <span>
                  {option.symbol} - {option.shortname || option.longname}
                </span>
              )}
              getOptionValue={(option) => option.symbol}
              label="Instrument"
              noResultsMessage="No instruments found. Try a different search."
              onChange={handleInstrumentSelect}
              placeholder="Search by symbol or name..."
              renderOption={(option) => (
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <div className="font-medium">{option.symbol}</div>
                    <div className="text-muted-foreground text-xs">
                      {option.shortname || option.longname}
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {option.exchDisp} • {option.typeDisp}
                  </span>
                </div>
              )}
              triggerClassName="w-full"
              value={selectedInstrument}
              width="100%"
            />

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-xs">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              className="w-full"
              onClick={() => setShowCustomForm(true)}
              variant="outline"
            >
              <Plus className="size-4" />
              Add custom asset
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
