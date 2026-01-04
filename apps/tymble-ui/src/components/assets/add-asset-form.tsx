import { createAssetSchema, type SearchedInstrument } from '@tymble/schemas';
import type z from 'zod';
import { useAppForm } from '@/form/form';

const formDataSchema = createAssetSchema.dto.pick({
  fee: true,
});

type FormData = z.infer<typeof formDataSchema>;

type Props = {
  onSubmit: (data: FormData) => void;
  instrument: SearchedInstrument;
};

export const AddAssetForm = ({ onSubmit, instrument }: Props) => {
  const form = useAppForm({
    defaultValues: {
      fee: '',
    },
    validators: {
      onSubmit: formDataSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form.AppForm>
      <form.AppField
        children={(field) => (
          <field.Input
            id="fee"
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            type="number"
            value={field.state.value}
          />
        )}
        name="fee"
      />
    </form.AppForm>
  );
};
