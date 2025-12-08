import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
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
    extensions: [StarterKit],
    content,
    editable: isEditing,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px]',
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
      <EditorContent editor={editor} />
    </WidgetLayout>
  );
};
