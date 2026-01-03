import {
  Cancel01Icon,
  Mail01Icon,
  MapPinIcon,
  PencilEdit01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type UpdateUser, updateUserSchema } from '@tymble/schemas';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateUser } from '@/api/auth';
import { authQueryOptions, useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/ui/field';
import { Icon } from '@/ui/icon';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';

export const Route = createFileRoute('/_app/profile')({
  component: RouteComponent,
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

function RouteComponent() {
  const { data: user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateUser,
    mutationKey: ['updateUser'],
    onSuccess: async () => {
      await queryClient.invalidateQueries(authQueryOptions);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const form = useAppForm({
    defaultValues: {
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName,
      bio: user?.bio,
    } satisfies UpdateUser['dto'] as UpdateUser['dto'],
    validators: {
      onSubmit: updateUserSchema.dto,
    },
    onSubmit: ({ value }) => {
      updateMutation.mutate({
        firstName: value.firstName,
        lastName: value.lastName,
        bio: value.bio ?? null,
      });
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Profile Header Card */}
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-start gap-6 pb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage alt={user.firstName} src={user.avatarUrl ?? ''} />
              <AvatarFallback className="text-2xl">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-base">
                    <Icon className="size-4" icon={Mail01Icon} />
                    {user.email}
                    {user.emailVerifiedAt && (
                      <Badge className="text-xs" variant="secondary">
                        Verified
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'secondary' : 'outline'}
                >
                  {isEditing ? (
                    <>
                      <Icon className="mr-1 size-4" icon={Cancel01Icon} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Icon className="mr-1 size-4" icon={PencilEdit01Icon} />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          {isEditing && (
            <CardContent className="overflow-hidden border-t pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup className="gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <form.AppField
                      children={(field) => (
                        <Field>
                          <FieldLabel>First Name</FieldLabel>
                          <field.Input
                            onBlur={field.handleBlur}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => field.handleChange(e.target.value)}
                            value={field.state.value}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                      name="firstName"
                    />
                    <form.AppField
                      children={(field) => (
                        <Field>
                          <FieldLabel>Last Name</FieldLabel>
                          <field.Input
                            onBlur={field.handleBlur}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => field.handleChange(e.target.value)}
                            value={field.state.value}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                      name="lastName"
                    />
                  </div>
                  <form.AppField
                    children={(field) => (
                      <Field>
                        <FieldLabel>Bio</FieldLabel>
                        <field.Input
                          onBlur={field.handleBlur}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.handleChange(e.target.value)
                          }
                          placeholder="Tell us about yourself..."
                          value={field.state.value ?? undefined}
                        />
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    )}
                    name="bio"
                  />
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <form.AppForm>
                      <form.Button
                        disabled={updateMutation.isPending}
                        type="submit"
                      >
                        {updateMutation.isPending
                          ? 'Saving...'
                          : 'Save Changes'}
                      </form.Button>
                    </form.AppForm>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          )}
          <CardContent className="mt-6 space-y-6">
            {!isEditing && user.bio && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">About</Label>
                <p className="text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {user.countryCode && (
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="text-muted-foreground" icon={MapPinIcon} />
                  <span className="text-muted-foreground">Country:</span>
                  <span className="font-medium">{user.countryCode}</span>
                </div>
              )}
              {user.birthdate && (
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="text-muted-foreground" icon={UserIcon} />
                  <span className="text-muted-foreground">Born:</span>
                  <span className="font-medium">
                    {format(new Date(user.birthdate), 'PP')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Your personal preferences and account status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground text-sm">Language</span>
              <span className="font-medium text-sm uppercase">
                {user.language}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground text-sm">Theme</span>
              <span className="font-medium text-sm capitalize">
                {user.theme}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground text-sm">
                Account Type
              </span>
              <Badge variant={user.isSuperuser ? 'default' : 'secondary'}>
                {user.isSuperuser ? 'Admin' : 'Standard'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Account creation and update timestamps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Joined</Label>
              <p className="font-medium text-sm">
                {format(new Date(user.createdAt), 'PPP p')}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Last Updated
              </Label>
              <p className="font-medium text-sm">
                {format(new Date(user.updatedAt), 'PPP p')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
