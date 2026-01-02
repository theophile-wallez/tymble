import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { useForm } from '@tanstack/react-form';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { type StockSearchResult, searchStocks } from '@/api/portfolios';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/ui/command';
import { Icon } from '@/ui/icon';
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

export const AddAssetForm = ({ portfolioId: _portfolioId }: Props) => {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
  };

  const openCustomForm = () => {
    setOpen(false);
    setShowCustomForm(true);
  };

  const cancelCustomForm = () => {
    setShowCustomForm(false);
    customForm.reset();
  };

  if (showCustomForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add a custom asset</CardTitle>
              <CardDescription>
                Manually enter the details of your asset.
              </CardDescription>
            </div>
            <Button onClick={cancelCustomForm} size="icon-sm" variant="ghost">
              <Icon icon={Cancel01Icon} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

            <div className="flex justify-end gap-2">
              <Button
                onClick={cancelCustomForm}
                type="button"
                variant="outline"
              >
                Cancel
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a new asset</CardTitle>
        <CardDescription>
          Search for a stock, ETF, or other instrument to add to your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverAnchor asChild>
            <Command className="rounded-md border" shouldFilter={false}>
              <CommandInput
                onFocus={() => setOpen(true)}
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
                    <Icon icon={Add01Icon} />
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
                                {stock.name}
                              </div>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {stock.exchange} • {stock.type}
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
      </CardContent>
    </Card>
  );
};
