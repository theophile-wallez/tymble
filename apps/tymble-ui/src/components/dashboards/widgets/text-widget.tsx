import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { TextWidgetToolbar } from './text-widget-toolbar';
import { WidgetLayout } from './widget-layout';

type Props = {
  content: string;
  isEditing?: boolean;
  transparent?: boolean;
};

export const TextWidget = ({ content, isEditing, transparent }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
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
      {isEditing && <TextWidgetToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </WidgetLayout>
  );
};
