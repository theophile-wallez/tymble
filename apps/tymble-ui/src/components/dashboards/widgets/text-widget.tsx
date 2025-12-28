import { TiptapEditor } from '@/components/editor';
import { cn } from '@/ui/utils';
import { WidgetLayout } from './widget-layout';

type Props = {
  content: string;
  isEditing?: boolean;
  transparent?: boolean;
};

export const TextWidget = ({ content, isEditing, transparent }: Props) => (
  <WidgetLayout
    cardClassName={cn('overflow-hidden', isEditing && 'overflow-auto')}
    className="pb-2"
    isEditing={isEditing}
    transparent={transparent}
  >
    <TiptapEditor content={content} editable={isEditing} />
  </WidgetLayout>
);
