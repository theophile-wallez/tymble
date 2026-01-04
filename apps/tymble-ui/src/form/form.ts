import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});
