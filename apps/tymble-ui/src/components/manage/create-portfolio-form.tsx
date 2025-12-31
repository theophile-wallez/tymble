import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createPortfolio } from '@/api/portfolios';
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

export const CreatePortfolioForm = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPortfolio,
    mutationKey: ['createPortfolio'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfolio created successfully!');
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to create portfolio. Please try again.'
      );
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      type: '',
      provider: '',
      description: '',
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="size-4" />
          Create a portfolio
        </CardTitle>
        <CardDescription>
          Add your first investment portfolio to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  <FieldLabel htmlFor="name">Portfolio name</FieldLabel>
                  <field.Input
                    id="name"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g., My PEA Portfolio"
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
                  <FieldLabel htmlFor="type">Portfolio type</FieldLabel>
                  <Select
                    onValueChange={(value) => field.handleChange(value)}
                    value={field.state.value}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select a portfolio type" />
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
                    The type of investment account (PEA, CTO, etc.)
                  </FieldDescription>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
              name="type"
            />

            <form.AppField
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="provider">Provider</FieldLabel>
                  <Select
                    onValueChange={(value) => field.handleChange(value)}
                    value={field.state.value}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select your broker" />
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
                    The broker or bank where your portfolio is held.
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
                    Description (optional)
                  </FieldLabel>
                  <field.Input
                    id="description"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Add a description..."
                    value={field.state.value}
                  />
                  <FieldDescription>
                    A short description to help you identify this portfolio.
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
                {createMutation.isPending ? 'Creating...' : 'Create portfolio'}
              </Button>
            </form.AppForm>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
