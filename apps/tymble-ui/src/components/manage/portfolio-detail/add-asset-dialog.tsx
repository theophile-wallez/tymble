import { Add01Icon } from '@hugeicons/core-free-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SearchedInstrument } from '@tymble/schemas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createAsset } from '@/api/assets';
import { searchStocks } from '@/api/instruments';
import { useCommand } from '@/hooks/use-command';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import {
  CommandBase,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Icon } from '@/ui/icon';
import { Skeleton } from '@/ui/skeleton';

const DEBOUNCE_MS = 300;

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId }: Props) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionErrorRef = useRef(false);
  const searchErrorRef = useRef(false);
  const queryClient = useQueryClient();

  const toggleDialogOpen = useCallback(() => {
    setDialogOpen((open) => !open);
  }, []);

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

  useCommand({
    onToggle: toggleDialogOpen,
    shortcut: {
      key: 'a',
    },
    enabled: !dialogOpen,
  });

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

  // @ts-expect-error - TODO: Implement asset creation API call
  const _createAssetMutation = useMutation({
    mutationFn: createAsset,
    mutationKey: ['createAsset'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['portfolio', portfolioId],
      });
      toast.success(t('manage.addAssetDialog.addedAsset'));
      setDialogOpen(false);
      resetSearchState();
    },
    onError: (error) => {
      toast.error(error.message || t('manage.addAssetDialog.addAssetFailed'));
    },
  });

  const addAsset = () => {
    // TODO: Implement asset creation API call
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
    enabled: dialogOpen && debouncedQuery.length >= 1,
    retry: false,
  });

  let searchResults: SearchedInstrument[] = [];
  if (searchQuery.length === 0) {
    searchResults = suggestionsQuery.data?.instruments ?? [];
  } else if (searchQuery.length >= 1) {
    searchResults = searchQueryResult.data?.instruments ?? [];
  }

  const isLoadingSuggestions =
    searchQuery.length === 0 && suggestionsQuery.isFetching;
  const isLoadingSearch =
    searchQuery.length >= 1 && searchQueryResult.isFetching;
  const isTypingWithoutResults =
    searchQuery.length > 0 && searchQuery.length < 1;

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
        className="flex h-full min-h-[180px] cursor-pointer items-center justify-center border-2 border-dashed shadow-none transition-colors hover:border-primary-background hover:bg-muted/50"
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

      <Dialog onOpenChange={handleDialogChange} open={dialogOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>{t('manage.addAssetDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('manage.addAssetDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogContent
          className="top-[12vh] translate-y-0 overflow-hidden bg-accent p-0 sm:top-[18vh]"
          showCloseButton={false}
        >
          <CommandBase shouldFilter={false}>
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
                    onSelect={() => addAsset()}
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
          </CommandBase>
        </DialogContent>
      </Dialog>
    </>
  );
};
