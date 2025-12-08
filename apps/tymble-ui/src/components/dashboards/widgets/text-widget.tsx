import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { cn } from '@/ui/utils';
import { TextWidgetToolbar } from './text-widget-toolbar';
import { WidgetLayout } from './widget-layout';

export const TextWidget = ({
  content,
  isEditing,
  transparent,
}: {
  content: string;
  isEditing?: boolean;
  transparent?: boolean;
}) => {
  const classNames = cn(
    'prose prose-neutral dark:prose-invert max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h1:leading-[1em] focus:outline-none',
    isEditing ? 'tiptap-readonly' : 'min-h-[100px]'
  );
  const editor = useEditor({
    extensions: [StarterKit, BubbleMenuExtension],
    content,
    editable: isEditing,
    editorProps: {
      attributes: {
        class: classNames,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!isEditing);
    }
  }, [editor, isEditing]);

  return (
    <WidgetLayout
      className="pb-2"
      isEditing={isEditing}
      transparent={transparent}
    >
      {isEditing && editor && (
        <BubbleMenu editor={editor}>
          <TextWidgetToolbar editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </WidgetLayout>
  );
};
