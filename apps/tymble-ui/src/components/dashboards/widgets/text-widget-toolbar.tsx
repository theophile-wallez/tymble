import type { Editor } from '@tiptap/react';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';
import { Toggle } from '../../../ui/toggle';

type Props = {
  editor: Editor | null;
};

export const TextWidgetToolbar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  const isBold = editor.isActive('bold');
  console.log({ isBold });
  return (
    <div className="mb-2 flex flex-wrap gap-1 rounded-md border bg-muted/30 p-1 backdrop-blur-sm">
      <Toggle
        aria-label="Toggle bold"
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        pressed={isBold}
        size="sm"
      >
        <Bold className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        pressed={editor.isActive('italic')}
        size="sm"
      >
        <Italic className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle strikethrough"
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        pressed={editor.isActive('strike')}
        size="sm"
      >
        <Strikethrough className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle code"
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        pressed={editor.isActive('code')}
        size="sm"
      >
        <Code className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle heading 1"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        pressed={editor.isActive('heading', { level: 1 })}
        size="sm"
      >
        <Heading1 className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle heading 2"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        pressed={editor.isActive('heading', { level: 2 })}
        size="sm"
      >
        <Heading2 className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle bullet list"
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        pressed={editor.isActive('bulletList')}
        size="sm"
      >
        <List className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle ordered list"
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        pressed={editor.isActive('orderedList')}
        size="sm"
      >
        <ListOrdered className="size-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle blockquote"
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        pressed={editor.isActive('blockquote')}
        size="sm"
      >
        <Quote className="size-4" />
      </Toggle>
    </div>
  );
};
