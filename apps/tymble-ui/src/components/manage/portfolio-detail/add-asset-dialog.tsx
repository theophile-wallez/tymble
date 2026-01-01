import { Add01Icon } from '@hugeicons/core-free-icons';
import { useQuery } from '@tanstack/react-query';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionErrorRef = useRef(false);
  const searchErrorRef = useRef(false);

  const resetSearchState = useCallback(() => {
    if (resetRef.current) {
      clearTimeout(resetRef.current);
    }
    resetRef.current = setTimeout(() => {
      setSearchQuery('');
      setDebouncedQuery('');
    }, 300);
  }, []);

  useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, dialogOpen]);

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

  const suggestionsQuery = useQuery({
    queryKey: ['instrument-suggestions'],
    queryFn: () => searchStocks(''),
    enabled: dialogOpen && searchQuery.length === 0,
    retry: false,
  });

  const searchQueryResult = useQuery({
    queryKey: ['instrument-search', debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery),
    enabled: dialogOpen && debouncedQuery.length >= 2,
    retry: false,
  });

  let searchResults: StockSearchResult[] = [];
  if (searchQuery.length === 0) {
    searchResults = suggestionsQuery.data?.quotes ?? [];
  } else if (searchQuery.length >= 2) {
    searchResults = searchQueryResult.data?.quotes ?? [];
  }

  const isLoadingSuggestions =
    searchQuery.length === 0 && suggestionsQuery.isFetching;
  const isLoadingSearch =
    searchQuery.length >= 2 && searchQueryResult.isFetching;
  const isTypingWithoutResults =
    searchQuery.length > 0 && searchQuery.length < 2;

  useEffect(() => {
    if (suggestionsQuery.isError) {
      if (!suggestionErrorRef.current) {
        toast.error(t('manage.addAssetDialog.searchFailed'));
        suggestionErrorRef.current = true;
      }
      return;
    }
    suggestionErrorRef.current = false;
  }, [suggestionsQuery.isError, t]);

  useEffect(() => {
    if (searchQueryResult.isError) {
      if (!searchErrorRef.current) {
        toast.error(t('manage.addAssetDialog.searchFailed'));
        searchErrorRef.current = true;
      }
      return;
    }
    searchErrorRef.current = false;
  }, [searchQueryResult.isError, t]);

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
        className="top-[12vh] translate-y-0 sm:top-[18vh]"
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
          {(isLoadingSuggestions ||
            isTypingWithoutResults ||
            isLoadingSearch) && (
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

          {!isLoadingSearch &&
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
