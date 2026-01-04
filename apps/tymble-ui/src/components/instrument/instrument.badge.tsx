import type { InstrumentType } from '@tymble/schemas';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales/translation-keys';
import { Badge } from '@/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip';

type Props = {
  instrumentType: InstrumentType;
};

export const InstrumentBadge = ({ instrumentType }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className="flex flex-row gap-1.5 shadow-sm" variant="outline">
          <span
            className="size-2 rounded-full"
            style={{ background: `var(--color-${instrumentType})` }}
          />
          <span>
            {t(`instrument.type.${instrumentType}.label` as TranslationKey)}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs border border-border shadow-sm">
        <h3 className="mb-1 font-medium text-xs">
          {t(`instrument.type.${instrumentType}.label` as TranslationKey)}
        </h3>
        <p className="text-muted-foreground text-xs">
          {t(`instrument.type.${instrumentType}.description` as TranslationKey)}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
