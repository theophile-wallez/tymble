import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
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
  const editor = useEditor({
    extensions: [StarterKit, BubbleMenuExtension],
    content,
    editable: isEditing,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-h1:text-3xl max-w-none focus:outline-none min-h-[100px]',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!isEditing);
    }
  }, [editor, isEditing]);

  return (
    <WidgetLayout isEditing={isEditing} title="Notes" transparent={transparent}>
      {isEditing && editor && (
        <BubbleMenu editor={editor}>
          <TextWidgetToolbar editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </WidgetLayout>
  );
};
