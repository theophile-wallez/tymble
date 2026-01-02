import {
  CodeIcon,
  Heading01Icon,
  Heading02Icon,
  LeftToRightBlockQuoteIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
} from '@hugeicons/core-free-icons';
import { type Editor, useEditorState } from '@tiptap/react';
import { Icon } from '@/ui/icon';
import { Toggle } from '@/ui/toggle';

type Props = {
  editor: Editor;
};

export const EditorToolbar = ({ editor }: Props) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isStrikethrough: ctx.editor.isActive('strike'),
      isCode: ctx.editor.isActive('code'),
      isHeading1: ctx.editor.isActive('heading', { level: 1 }),
      isHeading2: ctx.editor.isActive('heading', { level: 2 }),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isBlockquote: ctx.editor.isActive('blockquote'),
    }),
  });

  return (
    <div className="mb-2 flex flex-wrap gap-1 rounded-md border bg-muted/80 p-1 backdrop-blur-sm">
      <Toggle
        aria-label="Toggle bold"
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        pressed={editorState.isBold}
        size="sm"
      >
        <Icon icon={TextBoldIcon} />
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        pressed={editorState.isItalic}
        size="sm"
      >
        <Icon icon={TextItalicIcon} />
      </Toggle>
      <Toggle
        aria-label="Toggle strikethrough"
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        pressed={editorState.isStrikethrough}
        size="sm"
      >
        <Icon icon={TextStrikethroughIcon} />
      </Toggle>
      <Toggle
        aria-label="Toggle code"
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        pressed={editorState.isCode}
        size="sm"
      >
        <Icon icon={CodeIcon} />
      </Toggle>
      <Toggle
        aria-label="Toggle heading 1"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        pressed={editorState.isHeading1}
        size="sm"
      >
        <Icon icon={Heading01Icon} />
      </Toggle>
      <Toggle
        aria-label="Toggle heading 2"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        pressed={editorState.isHeading2}
        size="sm"
      >
        <Icon icon={Heading02Icon} />
      </Toggle>
      <Toggle
        aria-label="Toggle bullet list"
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        pressed={editorState.isBulletList}
        size="sm"
      >
        <Icon icon={LeftToRightListBulletIcon} />
      </Toggle>
      <Toggle
        aria-label="Toggle ordered list"
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        pressed={editorState.isOrderedList}
        size="sm"
      >
        <Icon icon={LeftToRightListNumberIcon} />
      </Toggle>
      <Toggle
        aria-label="Toggle blockquote"
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        pressed={editorState.isBlockquote}
        size="sm"
      >
        <Icon icon={LeftToRightBlockQuoteIcon} />
      </Toggle>
    </div>
  );
};
