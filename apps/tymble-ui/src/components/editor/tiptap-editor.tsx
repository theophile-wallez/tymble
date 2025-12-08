import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { cn } from '@/ui/utils';
import { EditorToolbar } from './editor-toolbar';

type TiptapEditorProps = {
  content: string;
  editable?: boolean;
  className?: string;
};

export const TiptapEditor = ({
  content,
  editable,
  className,
}: TiptapEditorProps) => {
  const classNames = cn(
    'prose prose-neutral dark:prose-invert max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-p:text-base prose-h1:leading-[1em] prose-p:leading-1 focus:outline-none',
    editable ? 'min-h-[100px]' : 'tiptap-readonly',
    className
  );

  const editor = useEditor({
    extensions: [StarterKit, BubbleMenuExtension],
    content,
    editable,
    editorProps: {
      attributes: {
        class: classNames,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!editable);
    }
  }, [editor, editable]);

  return (
    <>
      {editable && editor && (
        <BubbleMenu editor={editor}>
          <EditorToolbar editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </>
  );
};
