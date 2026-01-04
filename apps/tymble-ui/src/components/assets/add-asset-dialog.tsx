import { Add01Icon } from '@hugeicons/core-free-icons';
import { useMutation } from '@tanstack/react-query';
import type { CreateAsset, SearchedInstrument } from '@tymble/schemas';
import { useCallback, useState } from 'react';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<SearchedInstrument>();

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

  // declare new react query mutation to create an asset
  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    mutationKey: ['createAsset'],
    onSuccess: () => {
      toast.success('Asset created successfully');
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
            'top-[18vh] translate-y-0 overflow-hidden bg-background p-0 transition-all md:top-[12vh]',
            selectedInstrument && 'p-6'
          )}
          showCloseButton={false}
        >
          <DialogHeader className={cn(!selectedInstrument && 'sr-only')}>
            <DialogTitle>{t('manage.addAssetDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('manage.addAssetDialog.description')}
            </DialogDescription>
          </DialogHeader>
          {selectedInstrument ? (
            <>
              <div className="space-y-6">
                <InstrumentPreviewCard instrument={selectedInstrument} />
                <div className="space-y-2">
                  <Label htmlFor="fee">{t('manage.addAssetDialog.fee')}</Label>
                  <Input
                    autoFocus={true}
                    id="fee"
                    max={1}
                    min={0}
                    name="fee"
                    onChange={(e) => setData({ ...data, fee: e.target.value })}
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
                  type="button"
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
            </>
          ) : (
            <SearchInstruments
              isActive={dialogOpen}
              onSelect={setSelectedInstrument}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
