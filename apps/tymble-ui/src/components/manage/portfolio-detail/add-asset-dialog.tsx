import { Add01Icon } from '@hugeicons/core-free-icons';
import { useForm } from '@tanstack/react-form';
import type { InstrumentType } from '@tymble/schemas';
import { useState } from 'react';
import { toast } from 'sonner';
import { type StockSearchResult, searchStocks } from '@/api/portfolios';
import { useTranslation } from '@/hooks/use-translation';
import { AsyncSelect } from '@/ui/async-select';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Icon } from '@/ui/icon';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
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
] as const satisfies { value: InstrumentType; label: string }[];

type Props = {
  portfolioId: string;
};

export const AddAssetDialog = ({ portfolioId: _portfolioId }: Props) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const customForm = useForm({
    defaultValues: {
      symbol: '',
      name: '',
      type: '',
      exchange: '',
      currency: '',
    },
    onSubmit: () => {
      // TODO: Implement custom asset creation API call
      toast.info(t('manage.addAssetDialog.addingCustomAsset'));
      customForm.reset();
      setShowCustomForm(false);
      setDialogOpen(false);
    },
  });

  const fetchInstruments = async (query?: string) => {
    if (!query || query.length < 2) {
      return [];
    }
    const result = await searchStocks(query);
    return result.quotes || [];
  };

  const handleInstrumentSelect = (value: string) => {
    setSelectedInstrument(value);
    if (value) {
      // TODO: Implement asset creation API call
      toast.info(t('manage.addAssetDialog.addingAsset'));
      setSelectedInstrument('');
      setDialogOpen(false);
    }
  };

  const cancelCustomForm = () => {
    setShowCustomForm(false);
    customForm.reset();
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedInstrument('');
      setShowCustomForm(false);
      customForm.reset();
    }
  };

  return (
    <Dialog onOpenChange={handleDialogChange} open={dialogOpen}>
      <DialogTrigger asChild>
        <Card className="flex h-full min-h-[180px] cursor-pointer items-center justify-center border-2 border-dashed transition-colors hover:border-primary hover:bg-muted/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Icon className="size-8" icon={Add01Icon} />
            <span className="font-medium">
              {t('manage.addAssetDialog.trigger')}
            </span>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showCustomForm
              ? t('manage.addAssetDialog.titleCustom')
              : t('manage.addAssetDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {showCustomForm
              ? t('manage.addAssetDialog.descriptionCustom')
              : t('manage.addAssetDialog.description')}
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
                <Label htmlFor="symbol">
                  {t('manage.addAssetDialog.symbol')} *
                </Label>
                <customForm.Field name="symbol">
                  {(field) => (
                    <Input
                      id="symbol"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t('manage.addAssetDialog.symbolPlaceholder')}
                      required
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  {t('manage.addAssetDialog.name')} *
                </Label>
                <customForm.Field name="name">
                  {(field) => (
                    <Input
                      id="name"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t('manage.addAssetDialog.namePlaceholder')}
                      required
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="type">{t('manage.addAssetDialog.type')} *</Label>
              <customForm.Field name="type">
                {(field) => (
                  <Select
                    onValueChange={(value) => field.handleChange(value)}
                    value={field.state.value}
                  >
                    <SelectTrigger id="type">
                      <SelectValue
                        placeholder={t('manage.addAssetDialog.typePlaceholder')}
                      />
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
                <Label htmlFor="exchange">
                  {t('manage.addAssetDialog.exchange')}
                </Label>
                <customForm.Field name="exchange">
                  {(field) => (
                    <Input
                      id="exchange"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t(
                        'manage.addAssetDialog.exchangePlaceholder'
                      )}
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="currency">
                  {t('manage.addAssetDialog.currency')}
                </Label>
                <customForm.Field name="currency">
                  {(field) => (
                    <Input
                      id="currency"
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t(
                        'manage.addAssetDialog.currencyPlaceholder'
                      )}
                      value={field.state.value}
                    />
                  )}
                </customForm.Field>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={cancelCustomForm}
                type="button"
                variant="outline"
              >
                {t('manage.addAssetDialog.back')}
              </Button>
              <Button
                disabled={
                  customForm.state.values.symbol === '' ||
                  customForm.state.values.name === '' ||
                  customForm.state.values.type === ''
                }
                type="submit"
              >
                {t('manage.addAssetDialog.addAsset')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <AsyncSelect<StockSearchResult>
              clearable={false}
              fetcher={fetchInstruments}
              getDisplayValue={(option) => (
                <span>
                  {option.symbol} - {option.name}
                </span>
              )}
              getOptionValue={(option) => option.symbol}
              label="Instrument"
              noResultsMessage={t('manage.addAssetDialog.noResults')}
              onChange={handleInstrumentSelect}
              placeholder={t('manage.addAssetDialog.searchPlaceholder')}
              renderOption={(option) => (
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <div className="font-medium">{option.symbol}</div>
                    <div className="text-muted-foreground text-xs">
                      {option.name}
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {option.exchange} • {option.type}
                  </span>
                </div>
              )}
              triggerClassName="w-full"
              value={selectedInstrument}
              width="100%"
            />

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-xs">
                {t('manage.addAssetDialog.or')}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              className="w-full"
              onClick={() => setShowCustomForm(true)}
              variant="outline"
            >
              <Icon className="size-4" icon={Add01Icon} />
              {t('manage.addAssetDialog.addCustomAsset')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
