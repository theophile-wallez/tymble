import { TiptapEditor } from '@/components/editor';
import { cn } from '@/ui/utils';
import { WidgetLayout } from './widget-layout';

export const TextWidget = ({
  content,
  isEditing,
  transparent,
}: {
  content: string;
  isEditing?: boolean;
  transparent?: boolean;
}) => (
  <WidgetLayout
    cardClassName={cn('overflow-hidden', isEditing && 'overflow-auto')}
    className="pb-2"
    isEditing={isEditing}
    transparent={transparent}
  >
    <TiptapEditor content={content} editable={isEditing} />
  </WidgetLayout>
);
