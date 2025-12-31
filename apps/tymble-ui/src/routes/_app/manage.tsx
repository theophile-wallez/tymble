import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Briefcase,
  MoreHorizontal,
  Pencil,
  Plus,
  PlusCircle,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  createPortfolio,
  deletePortfolio,
  fetchPortfolios,
  type Portfolio,
} from '@/api/portfolios';
import { DataTable } from '@/components/table/data-table';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentTitle,
} from '@/layouts/content.layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog';
import { Badge } from '@/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

export const Route = createFileRoute('/_app/manage')({
  component: ManagePage,
});

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

const PORTFOLIO_TYPES = [
  { value: 'PEA', label: 'PEA' },
  { value: 'PEA-PME', label: 'PEA-PME' },
  { value: 'CTO', label: 'CTO (Compte-Titres Ordinaire)' },
  { value: 'PEE', label: 'PEE (Plan Épargne Entreprise)' },
  { value: 'PERCO', label: 'PERCO' },
  { value: 'PER', label: 'PER (Plan Épargne Retraite)' },
  { value: 'ASSURANCE_VIE', label: 'Assurance Vie' },
  { value: 'OTHER', label: 'Other' },
] as const;

const PROVIDERS = [
  { value: 'trade_republic', label: 'Trade Republic' },
  { value: 'boursobank', label: 'Boursobank' },
  { value: 'degiro', label: 'DEGIRO' },
  { value: 'fortuneo', label: 'Fortuneo' },
  { value: 'bourse_direct', label: 'Bourse Direct' },
  { value: 'saxo', label: 'Saxo Banque' },
  { value: 'interactive_brokers', label: 'Interactive Brokers' },
  { value: 'etoro', label: 'eToro' },
  { value: 'revolut', label: 'Revolut' },
  { value: 'other', label: 'Other' },
] as const;

const getProviderLabel = (value: string) =>
  PROVIDERS.find((p) => p.value === value)?.label ?? value;

const getTypeLabel = (value: string) =>
  PORTFOLIO_TYPES.find((t) => t.value === value)?.label ?? value;

const PortfolioSubComponent = ({ row }: { row: Row<Portfolio> }) => {
  const portfolio = row.original;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div>
        <p className="text-muted-foreground text-xs">Type</p>
        <p className="font-medium text-sm">{getTypeLabel(portfolio.type)}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">Provider</p>
        <p className="font-medium text-sm">
          {getProviderLabel(portfolio.provider)}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">Created</p>
        <p className="font-medium text-sm">
          {format(new Date(portfolio.createdAt), 'MMM d, yyyy')}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">Last updated</p>
        <p className="font-medium text-sm">
          {format(new Date(portfolio.updatedAt), 'MMM d, yyyy')}
        </p>
      </div>
      {portfolio.description && (
        <div className="col-span-full">
          <p className="text-muted-foreground text-xs">Description</p>
          <p className="text-sm">{portfolio.description}</p>
        </div>
      )}
    </div>
  );
};

function ManagePage() {
  const queryClient = useQueryClient();
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null
  );

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: fetchPortfolios,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    mutationKey: ['deletePortfolio'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfolio deleted successfully!');
      setPortfolioToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to delete portfolio. Please try again.'
      );
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, portfolio: Portfolio) => {
    e.stopPropagation();
    setPortfolioToDelete(portfolio);
  };

  const confirmDelete = () => {
    if (portfolioToDelete) {
      deleteMutation.mutate(portfolioToDelete.id);
    }
  };

  const columns = useMemo<ColumnDef<Portfolio>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="py-2">
            <span className="font-medium">{row.getValue('name')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <div className="py-2">
            <Badge variant="outline">{row.getValue('type')}</Badge>
          </div>
        ),
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => (
          <div className="py-2">
            {getProviderLabel(row.getValue('provider'))}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <div className="py-2">
            {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  size="icon-sm"
                  variant="ghost"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement add asset
                    toast.info('Add asset coming soon!');
                  }}
                >
                  <PlusCircle className="size-4" />
                  Add asset
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement edit
                    toast.info('Edit coming soon!');
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => handleDeleteClick(e, row.original)}
                  variant="destructive"
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  const createMutation = useMutation({
    mutationFn: createPortfolio,
    mutationKey: ['createPortfolio'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfolio created successfully!');
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

  const hasPortfolios = portfolios && portfolios.length > 0;

  if (isLoading) {
    return (
      <ContentLayout cy="manage">
        <ContentHeader cy="manage">
          <ContentTitle cy="manage">
            <Briefcase className="size-4" />
            Manage
          </ContentTitle>
        </ContentHeader>
        <ContentBody
          className="flex flex-1 items-center justify-center"
          cy="manage"
        >
          <div className="text-muted-foreground">Loading...</div>
        </ContentBody>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout cy="manage">
      <ContentHeader cy="manage">
        <ContentTitle cy="manage">
          <Briefcase className="size-4" />
          Manage
        </ContentTitle>
      </ContentHeader>
      <ContentBody className="flex-1" cy="manage">
        {hasPortfolios ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                You have {portfolios.length} portfolio(s).
              </p>
            </div>
            <Card>
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={portfolios}
                  emptyMessage="No portfolios found."
                  renderSubComponent={PortfolioSubComponent}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Wallet className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-xl">No portfolio yet</h2>
                <p className="mt-1 text-muted-foreground">
                  Create your first portfolio to start tracking your
                  investments.
                </p>
              </div>
            </div>

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
                                <SelectItem
                                  key={provider.value}
                                  value={provider.value}
                                >
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
                            A short description to help you identify this
                            portfolio.
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
                          ? 'Creating...'
                          : 'Create portfolio'}
                      </Button>
                    </form.AppForm>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </ContentBody>

      <AlertDialog
        onOpenChange={(open: boolean) => !open && setPortfolioToDelete(null)}
        open={!!portfolioToDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete portfolio</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium">{portfolioToDelete?.name}</span>?
              This action cannot be undone. All associated transactions will
              also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={confirmDelete}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
