import { Add01Icon } from '@hugeicons/core-free-icons';
import { useCallback, useRef, useState } from 'react';
import { SearchInstruments } from '@/components/instrument/search/search.instruments';
import { useCommand } from '@/hooks/use-command';
import { useTranslation } from '@/hooks/use-translation';
import { Card } from '@/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Icon } from '@/ui/icon';

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId }: Props) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const addAsset = () => {
    // TODO: Implement asset creation API call
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
  };

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
          <SearchInstruments isActive={dialogOpen} onSelect={addAsset} />
        </DialogContent>
      </Dialog>
    </>
  );
};
