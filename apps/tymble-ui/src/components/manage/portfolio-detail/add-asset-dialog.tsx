import { Add01Icon } from '@hugeicons/core-free-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { type StockSearchResult, searchStocks } from '@/api/portfolios';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import { Icon } from '@/ui/icon';
import { Skeleton } from '@/ui/skeleton';

const DEBOUNCE_MS = 300;

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId: _portfolioId }: Props) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSearchState = useCallback(() => {
    if (resetRef.current) {
      clearTimeout(resetRef.current);
    }
    resetRef.current = setTimeout(() => {
      setSearchQuery('');
      setSearchResults([]);
    }, 300);
  }, []);

  const executeSearch = useCallback(
    async (query: string) => {
      setIsSearching(true);
      try {
        const result = await searchStocks(query);
        setSearchResults(result.quotes || []);
      } catch {
        toast.error(t('manage.addAssetDialog.searchFailed'));
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (searchQuery.length === 0) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchQuery.length >= 2) {
        executeSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, executeSearch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setDialogOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      executeSearch('');
    }
  }, [dialogOpen, executeSearch]);

  useEffect(
    () => () => {
      if (resetRef.current) {
        clearTimeout(resetRef.current);
      }
    },
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length === 0) {
      executeSearch('');
      return;
    }
    if (value.length < 2) {
      setSearchResults([]);
    }
  };

  const addAsset = (stock: StockSearchResult) => {
    // TODO: Implement asset creation API call
    toast.info(t('manage.addAssetDialog.addingAsset'));
    setDialogOpen(false);
    resetSearchState();
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetSearchState();
    }
  };

  return (
    <>
      <Card
        className="flex h-full min-h-[180px] cursor-pointer items-center justify-center border-2 border-dashed transition-colors hover:border-primary hover:bg-muted/50"
        onClick={() => setDialogOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setDialogOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Icon className="size-8" icon={Add01Icon} />
          <span className="font-medium">
            {t('manage.addAssetDialog.trigger')}
          </span>
        </div>
      </Card>

      <CommandDialog
        description={t('manage.addAssetDialog.description')}
        onOpenChange={handleDialogChange}
        open={dialogOpen}
        title={t('manage.addAssetDialog.title')}
      >
        <CommandInput
          onValueChange={handleSearchChange}
          placeholder={t('manage.addAssetDialog.searchPlaceholder')}
          value={searchQuery}
        />
        <CommandList>
          {isSearching && searchQuery.length === 0 && (
            <CommandGroup>
              {Array.from({ length: 5 }).map((_, index) => (
                <CommandItem disabled key={`suggested-skeleton-${index}`}>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup>
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
                    {stock.exchange} •{' '}
                    <Badge className="capitalize" variant="outline">
                      {stock.type}
                    </Badge>
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          {!isSearching &&
            searchQuery.length >= 2 &&
            searchResults.length === 0 && (
              <CommandEmpty>
                {t('manage.addAssetDialog.noResults')}
              </CommandEmpty>
            )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
