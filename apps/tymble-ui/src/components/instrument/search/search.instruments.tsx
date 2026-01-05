import { useQuery } from '@tanstack/react-query';
import type { SearchedInstrument } from '@tymble/schemas';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { searchStocks } from '@/api/instruments';
import { useTranslation } from '@/hooks/use-translation';
import {
  CommandBase,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import { Skeleton } from '@/ui/skeleton';
import { levenshteinDistance } from '@/utils/levenshteinDistance';
import { InstrumentRow } from './instrument.row';

type Props = {
  isActive: boolean;
  onSelect: (instrument: SearchedInstrument) => void;
};

export const SearchInstruments = ({ isActive, onSelect }: Props) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionErrorRef = useRef(false);
  const searchErrorRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, isActive]);

  useEffect(
    () => () => {
      if (resetRef.current) {
        clearTimeout(resetRef.current);
      }
    },
    []
  );

  const suggestionsQuery = useQuery({
    queryKey: ['instrument-suggestions'],
    queryFn: () => searchStocks(''),
    enabled: isActive && searchQuery.length === 0,
    retry: false,
  });

  const searchQueryResult = useQuery({
    queryKey: ['instrument-search', debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery),
    enabled: isActive && debouncedQuery.length >= 1,
    retry: false,
  });

  // sorted to match the closest to the search query
  // TODO: Sort by market capitalization
  const searchResults: SearchedInstrument[] =
    searchQueryResult.data?.instruments.sort((a, b) => {
      const aDistance =
        levenshteinDistance(debouncedQuery, a.name) +
        levenshteinDistance(debouncedQuery, a.symbol);
      const bDistance =
        levenshteinDistance(debouncedQuery, b.name) +
        levenshteinDistance(debouncedQuery, b.symbol);
      return aDistance - bDistance;
    }) ?? [];

  const isLoadingSuggestions =
    searchQuery.length === 0 && suggestionsQuery.isFetching;
  const isLoadingSearch =
    searchQuery.length >= 1 && searchQueryResult.isFetching;

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

  console.log('isLoadingSuggestions: ', isLoadingSuggestions);
  console.log('isLoadingSearch: ', isLoadingSearch);

  return (
    <CommandBase shouldFilter={false}>
      <CommandInput
        onValueChange={setSearchQuery}
        placeholder={t('manage.addAssetDialog.searchPlaceholder')}
        value={searchQuery}
      />
      <CommandList
        style={{
          scrollbarGutter: 'stable',
        }}
      >
        {(isLoadingSuggestions || isLoadingSearch) && (
          <CommandGroup
            heading={
              isLoadingSuggestions ? 'Suggested results' : 'Search results'
            }
          >
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
        {!isLoadingSuggestions &&
          suggestionsQuery.data &&
          searchQuery.length === 0 && (
            <CommandGroup heading="Suggested results">
              {suggestionsQuery.data?.instruments.map((instrument) => (
                <InstrumentRow
                  instrument={instrument}
                  key={instrument.id}
                  onSelect={onSelect}
                />
              ))}
            </CommandGroup>
          )}
        {searchResults.length > 0 && searchQuery.length > 0 && (
          <CommandGroup heading="Search results">
            {searchResults.map((instrument) => (
              <InstrumentRow
                instrument={instrument}
                key={instrument.id}
                onSelect={onSelect}
              />
            ))}
          </CommandGroup>
        )}

        {!isLoadingSearch &&
          searchQuery.length !== 0 &&
          searchResults.length === 0 && (
            <CommandEmpty>{t('manage.addAssetDialog.noResults')}</CommandEmpty>
          )}
      </CommandList>
    </CommandBase>
  );
};
