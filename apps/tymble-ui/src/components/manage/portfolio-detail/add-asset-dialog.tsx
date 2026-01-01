import { useForm } from '@tanstack/react-form';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { type StockSearchResult, searchStocks } from '@/api/portfolios';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/ui/command';
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
import { Popover, PopoverAnchor, PopoverContent } from '@/ui/popover';
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

const DEBOUNCE_MS = 300;

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId: _portfolioId }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const executeSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchStocks(query);
      setSearchResults(result.quotes || []);
    } catch {
      toast.error('Failed to search stocks');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      executeSearch(searchQuery);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, executeSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length < 2) {
      setSearchResults([]);
    }
  };

  const addAsset = (stock: StockSearchResult) => {
    // TODO: Implement asset creation API call
    toast.info(`Adding ${stock.symbol} to portfolio - Coming soon!`);
    setSearchQuery('');
    setSearchResults([]);
    setPopoverOpen(false);
    setDialogOpen(false);
  };

  const openCustomForm = () => {
    setPopoverOpen(false);
    setShowCustomForm(true);
  };

  const cancelCustomForm = () => {
    setShowCustomForm(false);
    customForm.reset();
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setSearchQuery('');
      setSearchResults([]);
      setPopoverOpen(false);
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
              <Button onClick={cancelCustomForm} type="button" variant="outline">
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
          <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
            <PopoverAnchor asChild>
              <Command className="rounded-md border" shouldFilter={false}>
                <CommandInput
                  onFocus={() => setPopoverOpen(true)}
                  onValueChange={handleSearchChange}
                  placeholder="Search by symbol or name..."
                  value={searchQuery}
                />
              </Command>
            </PopoverAnchor>
            <PopoverContent
              align="start"
              className="w-[--radix-popover-trigger-width] p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
              sideOffset={0}
            >
              <Command shouldFilter={false}>
                <CommandList>
                  <CommandGroup>
                    <CommandItem onSelect={openCustomForm}>
                      <Plus className="size-4" />
                      <span>Custom asset</span>
                    </CommandItem>
                  </CommandGroup>

                  {searchResults.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup heading="Search results">
                        {searchResults.map((stock) => (
                          <CommandItem
                            key={stock.symbol}
                            onSelect={() => addAsset(stock)}
                            value={stock.symbol}
                          >
                            <div className="flex flex-1 items-center justify-between">
                              <div>
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="text-muted-foreground text-xs">
                                  {stock.shortname || stock.longname}
                                </div>
                              </div>
                              <span className="text-muted-foreground text-xs">
                                {stock.exchDisp} • {stock.typeDisp}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}

                  {isSearching && <CommandEmpty>Searching...</CommandEmpty>}

                  {!isSearching &&
                    searchQuery.length >= 2 &&
                    searchResults.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </DialogContent>
    </Dialog>
  );
};
