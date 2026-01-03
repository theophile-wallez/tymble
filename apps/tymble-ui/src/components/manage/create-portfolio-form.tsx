import { Add01Icon } from '@hugeicons/core-free-icons';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPortfolioSchema } from '@tymble/schemas';
import { toast } from 'sonner';
import { createPortfolio } from '@/api/portfolios';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/ui/field';
import { Icon } from '@/ui/icon';
import { Input } from '@/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { PORTFOLIO_TYPES, PROVIDERS } from './portfolio-constants';

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

type Props = {
  hideCard?: boolean;
  onSuccess?: () => void;
};

export const CreatePortfolioForm = ({ hideCard, onSuccess }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPortfolio,
    mutationKey: ['createPortfolio'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success(t('manage.portfolio.createSuccess'));
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || t('manage.portfolio.createError'));
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      type: '',
      provider: '',
      description: '',
    },
    validators: {
      onSubmit: createPortfolioSchema.dto,
    },
    onSubmit: ({ value }) => {
      createMutation.mutate({
        name: value.name,
        type: value.type,
        provider: value.provider,
        description: value.description || undefined,
      });
    },
  });

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="name">
                {t('manage.portfolio.name')}
              </FieldLabel>
              <field.Input
                id="name"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t('manage.portfolio.namePlaceholder')}
                required
                value={field.state.value}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
          name="name"
        />

        <form.AppField
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="type">
                {t('manage.portfolio.type')}
              </FieldLabel>
              <Select
                onValueChange={(value) => field.handleChange(value)}
                value={field.state.value}
              >
                <SelectTrigger id="type">
                  <SelectValue
                    placeholder={t('manage.portfolio.typePlaceholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {PORTFOLIO_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {t('manage.portfolio.typeDescription')}
              </FieldDescription>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
          name="type"
        />

        <form.AppField
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="provider">
                {t('manage.portfolio.provider')}
              </FieldLabel>
              <Select
                onValueChange={(value) => field.handleChange(value)}
                value={field.state.value}
              >
                <SelectTrigger id="provider">
                  <SelectValue
                    placeholder={t('manage.portfolio.providerPlaceholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {t('manage.portfolio.providerDescription')}
              </FieldDescription>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
          name="provider"
        />

        <form.AppField
          children={(field) => (
            <Field>
              <FieldLabel htmlFor="description">
                {t('manage.portfolio.description')}
              </FieldLabel>
              <field.Input
                id="description"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t('manage.portfolio.descriptionPlaceholder')}
                value={field.state.value}
              />
              <FieldDescription>
                {t('manage.portfolio.descriptionHelp')}
              </FieldDescription>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
          name="description"
        />

        <form.AppForm>
          <Button
            className="w-full"
            disabled={createMutation.isPending}
            type="submit"
          >
            {createMutation.isPending
              ? t('manage.portfolio.creating')
              : t('manage.portfolio.createButton')}
          </Button>
        </form.AppForm>
      </FieldGroup>
    </form>
  );

  if (hideCard) {
    return formContent;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4" icon={Add01Icon} />
          {t('manage.portfolio.createTitle')}
        </CardTitle>
        <CardDescription>
          {t('manage.portfolio.createDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
};
