import { instrumentTypeSchema } from '@tymble/schemas';
import type { TranslationKey } from '@/locales/translation-keys';
import { t } from '@/utils/i18n';

export const INSTRUMENT_TYPES = Object.values(instrumentTypeSchema.enum).map(
  (value) => ({
    value,
    label: t(`instrument.type.${value}.label` as TranslationKey),
  })
);
