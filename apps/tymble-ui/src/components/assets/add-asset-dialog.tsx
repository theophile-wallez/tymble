import { Add01Icon } from '@hugeicons/core-free-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateAsset, SearchedInstrument } from '@tymble/schemas';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createAsset } from '@/api/assets';
import { SearchInstruments } from '@/components/instrument/search/search.instruments';
import { useCommand } from '@/hooks/use-command';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Icon } from '@/ui/icon';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { cn } from '@/ui/utils';
import { InstrumentPreviewCard } from '../instrument/instrument-preview-card';

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<SearchedInstrument>();
  const [direction, setDirection] = useState(1);
  const selectedInstrumentRef = useRef(false);

  const [data, setData] = useState<Pick<CreateAsset['dto'], 'fee'>>({
    fee: '',
  });

  const toggleDialogOpen = useCallback(() => {
    setDialogOpen((open) => !open);
  }, []);

  useCommand({
    onToggle: toggleDialogOpen,
    shortcut: {
      key: 'a',
    },
    enabled: !dialogOpen,
  });

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
  };

  useEffect(() => {
    const isSelected = Boolean(selectedInstrument);
    if (selectedInstrumentRef.current !== isSelected) {
      setDirection(isSelected ? 1 : -1);
      selectedInstrumentRef.current = isSelected;
    }
  }, [selectedInstrument]);

  // declare new react query mutation to create an asset
  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    mutationKey: ['createAsset'],
    onSuccess: () => {
      toast.success('Asset created successfully');
      queryClient.invalidateQueries({
        queryKey: ['portfolio', portfolioId],
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create asset');
    },
  });

  const onAddAsset = useCallback(() => {
    if (!selectedInstrument) {
      const errorMessage = t(
        'manage.addAssetDialog.error.noInstrumentSelected'
      );
      toast.error(errorMessage);
      console.error(errorMessage);
      return;
    }
    createAssetMutation.mutate({
      instrumentId: selectedInstrument.id,
      portfolioId,
      fee: data.fee || '0',
    });
  }, [
    selectedInstrument,
    data.fee,
    portfolioId,
    t,
    createAssetMutation.mutate,
  ]);

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
        <DialogContent
          className={cn(
            'top-[18vh] translate-y-0 overflow-hidden bg-background p-0 md:top-[12vh]',
            selectedInstrument && 'p-6'
          )}
          showCloseButton={false}
        >
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            {selectedInstrument ? (
              // STEP 2: Preview the selected instrument and add an optional fee
              <motion.div
                animate="animate"
                custom={direction}
                exit="exit"
                initial="initial"
                key="selected-instrument"
                transition={{ duration: 0.15, ease: 'easeOut' }}
                variants={{
                  initial: (dir: number) => ({
                    x: `${110 * dir}%`,
                    opacity: 0,
                  }),
                  animate: { x: '0%', opacity: 1 },
                  exit: (dir: number) => ({
                    x: `${-110 * dir}%`,
                    opacity: 0,
                  }),
                }}
              >
                <DialogHeader>
                  <DialogTitle>{t('manage.addAssetDialog.title')}</DialogTitle>
                  <DialogDescription>
                    {t('manage.addAssetDialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <InstrumentPreviewCard instrument={selectedInstrument} />
                  <div className="space-y-2">
                    <Label htmlFor="fee">
                      {t('manage.addAssetDialog.fee')}
                    </Label>
                    <Input
                      autoFocus={true}
                      id="fee"
                      max={1}
                      min={0}
                      name="fee"
                      onChange={(e) =>
                        setData({ ...data, fee: e.target.value })
                      }
                      placeholder={t('manage.addAssetDialog.feePlaceholder')}
                      step={0.01}
                      type="number"
                      value={data.fee}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => setSelectedInstrument(undefined)}
                    type="submit"
                    variant="outline"
                  >
                    {t('manage.addAssetDialog.goBackButton')}
                  </Button>
                  <Button onClick={onAddAsset} type="button">
                    {createAssetMutation.isPending
                      ? t('manage.addAssetDialog.addingAssetButton')
                      : t('manage.addAssetDialog.addAssetButton')}
                  </Button>
                </DialogFooter>
              </motion.div>
            ) : (
              // STEP 1: Search for an instrument
              <motion.div
                animate="animate"
                custom={direction}
                exit="exit"
                initial="initial"
                key="search-instruments"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                variants={{
                  initial: (dir: number) => ({
                    x: `${110 * dir}%`,
                    opacity: 0,
                  }),
                  animate: { x: '0%', opacity: 1 },
                  exit: (dir: number) => ({
                    x: `${-110 * dir}%`,
                    opacity: 0,
                  }),
                }}
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>{t('manage.addAssetDialog.title')}</DialogTitle>
                  <DialogDescription>
                    {t('manage.addAssetDialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <SearchInstruments
                  isActive={dialogOpen}
                  onSelect={setSelectedInstrument}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};
