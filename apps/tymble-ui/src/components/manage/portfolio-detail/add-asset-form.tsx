import { useForm } from '@tanstack/react-form';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { searchStocks, type StockSearchResult } from '@/api/portfolios';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

type Props = {
  portfolioId: string;
};

export const AddAssetForm = ({ portfolioId: _portfolioId }: Props) => {
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);

  const form = useForm({
    defaultValues: {
      search: '',
      quantity: '',
      price: '',
    },
    onSubmit: ({ value }) => {
      if (!selectedStock) {
        toast.error('Please select a stock first');
        return;
      }

      // TODO: Implement asset creation
      toast.info(
        `Adding ${value.quantity} shares of ${selectedStock.symbol} at $${value.price} - Coming soon!`
      );

      // Reset form
      setSelectedStock(null);
      setSearchResults([]);
      form.reset();
    },
  });

  const handleSearch = async (query: string) => {
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
  };

  const selectStock = (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setSearchResults([]);
    form.setFieldValue('search', stock.symbol);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a new asset</CardTitle>
        <CardDescription>
          Search for a stock, ETF, or other instrument to add to your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Stock Search */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search instrument</Label>
            <div className="relative">
              <form.Field name="search">
                {(field) => (
                  <>
                    <div className="relative">
                      <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                      <Input
                        id="search"
                        className="pl-9"
                        placeholder="Search by symbol or name..."
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          handleSearch(e.target.value);
                          if (selectedStock && e.target.value !== selectedStock.symbol) {
                            setSelectedStock(null);
                          }
                        }}
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && !selectedStock && (
                      <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
                        {searchResults.map((stock) => (
                          <button
                            key={stock.symbol}
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-left hover:bg-accent"
                            onClick={() => selectStock(stock)}
                          >
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-muted-foreground text-sm">
                                {stock.shortname || stock.longname}
                              </div>
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {stock.exchDisp} • {stock.typeDisp}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </form.Field>

              {isSearching && (
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
            </div>

            {selectedStock && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-sm">
                <span className="font-medium">{selectedStock.symbol}</span>
                <span className="text-muted-foreground">
                  {selectedStock.shortname || selectedStock.longname}
                </span>
              </div>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <form.Field name="quantity">
                {(field) => (
                  <Input
                    id="quantity"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Average price</Label>
              <form.Field name="price">
                {(field) => (
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                selectedStock === null ||
                form.state.values.quantity === '' ||
                form.state.values.price === ''
              }
            >
              Add asset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
