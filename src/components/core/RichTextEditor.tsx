import { EditorProvider } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import History from "@tiptap/extension-history";

import { useCurrentEditor } from "@tiptap/react";
import { useCallback, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import {
  BoldIcon,
  Check,
  ItalicIcon,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  LoaderPinwheel,
  SlidersHorizontal,
  Sparkle,
  Undo,
} from "lucide-react";
import {
  customizeContent,
  fixTypos,
  improveContent,
} from "../../services/groqService";
import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const MenuBar: React.FC = () => {
  const { editor } = useCurrentEditor();

  const setLink = useCallback(() => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // if the user doesn't select any text, set the link on the current word
    if (!editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      return;
    }

    // set link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-3 px-1 py-2 border border-b-0 border-border rounded-t-sm">
      <Button
        title="Bold (Ctrl/⌘ + B)"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("bold") ? "bg-muted text-primary" : ""
        )}
        aria-pressed={editor.isActive("bold")}
      >
        <BoldIcon />
        <span className="sr-only">Bold</span>
      </Button>
      <Button
        title="Italic (Ctrl/⌘ + I)"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("italic") ? "bg-muted text-primary" : ""
        )}
        aria-pressed={editor.isActive("italic")}
      >
        <ItalicIcon />
        <span className="sr-only">Italic</span>
      </Button>
      <Button
        title="Bullet List (Ctrl/⌘ + Shift + 8)"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("bulletList") ? "bg-muted text-primary" : ""
        )}
        aria-pressed={editor.isActive("bulletList")}
      >
        <List />
        <span className="sr-only">Bullet List</span>
      </Button>
      <Button
        title="Ordered List (Ctrl/⌘ + Shift + 7)"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("orderedList") ? "bg-muted text-primary" : ""
        )}
        aria-pressed={editor.isActive("orderedList")}
      >
        <ListOrdered />
        <span className="sr-only">Ordered List</span>
      </Button>
      <Button
        title="Add Link"
        type="button"
        variant="ghost"
        size="icon"
        onClick={setLink}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("link") ? "bg-muted text-primary" : ""
        )}
        aria-pressed={editor.isActive("link")}
      >
        <Link2 />
        <span className="sr-only">Link</span>
      </Button>
      <Button
        title="Unset Link"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().unsetLink().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("unsetLink") ? "bg-muted text-primary" : ""
        )}
        aria-pressed={editor.isActive("unsetLink")}
      >
        <Link2Off />
        <span className="sr-only">Unset Link</span>
      </Button>
      <Button
        title="Undo (Ctrl/⌘ + Z)"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("undo") ? "bg-muted text-primary" : ""
        )}
      >
        <Undo />
        <span className="sr-only">Undo</span>
      </Button>
      <Button
        title="Redo (Ctrl/⌘ + Y)"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("redo") ? "bg-muted text-primary" : ""
        )}
      >
        <Undo className="transform rotate-180" />
        <span className="sr-only">Redo</span>
      </Button>
    </div>
  );
};

interface AiActionButtonsProps {
  handleChange: (content: string) => void;
  content: string;
  isRegenerating: boolean;
  setIsRegenerating: (isRegenerating: boolean) => void;
  isFixingTypos: boolean;
  setIsFixingTypos: (isFixingTypos: boolean) => void;
  isCustomizing: boolean;
  setIsCustomizing: (isCustomizing: boolean) => void;
}

const AiActionButtons: React.FC<AiActionButtonsProps> = ({
  content,
  handleChange,
  isRegenerating,
  setIsRegenerating,
  isFixingTypos,
  setIsFixingTypos,
  isCustomizing,
  setIsCustomizing,
}) => {
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);

  // Handle regenerate
  const handleRewrite = async () => {
    try {
      // set isRegenerating to true
      setIsRegenerating(true);
      // run the AI model to rewrite the content
      const regeneratedContent = await improveContent(content);
      // set the content to the regenerated content
      editor?.chain().focus().setContent(regeneratedContent).run();
      // call the handleChange function to update the content
      handleChange(regeneratedContent);
    } catch (error) {
      console.log(error);
    } finally {
      // set isRegenerating to false
      setIsRegenerating(false);
    }
  };

  // Handle fix typos
  const handleFixTypos = async () => {
    try {
      // set isRegenerating to true
      setIsFixingTypos(true);
      // run the AI model to rewrite the content
      const fixedContent = await fixTypos(content);
      // set the content to the regenerated content
      editor?.chain().focus().setContent(fixedContent).run();
      // call the handleChange function to update the content
      handleChange(fixedContent);
    } catch (error) {
      console.log(error);
    } finally {
      // set isRegenerating to false
      setIsFixingTypos(false);
    }
  };

  // Handle customize
  const handleCustomize = async (prompt: string) => {
    try {
      // set isCustomizing to true
      setIsCustomizing(true);
      // run the AI model to customize the content
      const customizedContent = await customizeContent(content, prompt);
      // set the content to the customized content
      editor?.chain().focus().setContent(customizedContent).run();
      // call the handleChange function to update the content
      handleChange(customizedContent);
    } catch (error) {
      console.log(error);
    } finally {
      // set isCustomizing to false
      setIsCustomizing(false);
    }
  };

  // Trim the content to check if it's empty
  const trimmedContent = content.replace(/<[^>]*>/g, "").trim();

  if (!editor) {
    return null;
  }

  return (
    <div className="relative flex justify-center flex-wrap gap-2 mt-4">
      <Button
        shiny
        title="Rewrite Content"
        variant="ghost"
        type="button"
        onClick={handleRewrite}
        disabled={!trimmedContent || isRegenerating}
      >
        {isRegenerating ? (
          <LoaderPinwheel className="animate-spin size-4" />
        ) : (
          <Sparkle className="size-4" />
        )}
        Improve Writing
      </Button>
      <Button
        shiny
        title="Fix Spelling & Grammar"
        variant="ghost"
        type="button"
        onClick={handleFixTypos}
        disabled={!trimmedContent || isFixingTypos}
      >
        {isFixingTypos ? (
          <LoaderPinwheel className="animate-spin size-4" />
        ) : (
          <Check className="size-4" />
        )}
        Fix Typos
      </Button>
      <Select
        open={isOpen}
        onOpenChange={setIsOpen}
        onValueChange={(value) => handleCustomize(value)}
      >
        <Button
          shiny
          variant="ghost"
          type="button"
          className="px-0"
          onClick={() => setIsOpen(!isOpen)}
          disabled={!trimmedContent || isCustomizing}
        >
          <SelectTrigger className="rounded-md w-auto gap-2">
            {isCustomizing ? (
              <LoaderPinwheel className="animate-spin size-4" />
            ) : (
              <SlidersHorizontal className="size-4" />
            )}
            <SelectValue placeholder="Customize" />
          </SelectTrigger>
        </Button>

        <SelectContent>
          <SelectItem value="Make the response shorter by removing unnecessary information, focusing only on key points.">
            Shorter
          </SelectItem>
          <SelectItem value="Make the response longer by adding more information, focusing on key points and details.">
            Longer
          </SelectItem>
          <SelectItem value="Make the response more formal by using more professional language and tone.">
            More Formal
          </SelectItem>
          <SelectItem value="Make the response more informal by using more casual language and tone.">
            More Informal
          </SelectItem>
          <SelectItem value="Make the response more creative by using more creative language and tone.">
            More Creative
          </SelectItem>
          <SelectItem value="Make the response more technical by using more technical language and tone.">
            More Technical
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Component to handle editor content updates
const EditorContentUpdater: React.FC<{ content: string }> = ({ content }) => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return null;
};

interface RichTextEditorProps {
  handleChange: (html: string) => void;
  content: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  handleChange,
  content,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isFixingTypos, setIsFixingTypos] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Define extensions array
  const extensions = [
    Document,
    Text,
    Bold,
    Italic,
    Paragraph,
    ListItem,
    BulletList,
    OrderedList,
    History,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      isAllowedUri: (url, ctx) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false;
          }

          // disallowed protocols
          const disallowedProtocols = ["ftp", "file", "mailto"];
          const protocol = parsedUrl.protocol.replace(":", "");

          if (disallowedProtocols.includes(protocol)) {
            return false;
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map((p) =>
            typeof p === "string" ? p : p.scheme
          );

          if (!allowedProtocols.includes(protocol)) {
            return false;
          }

          // disallowed domains
          const disallowedDomains = [
            "example-phishing.com",
            "malicious-site.net",
          ];
          const domain = parsedUrl.hostname;

          if (disallowedDomains.includes(domain)) {
            return false;
          }

          // all checks have passed
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      shouldAutoLink: (url) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`https://${url}`);

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = [
            "example-no-autolink.com",
            "another-no-autolink.com",
          ];
          const domain = parsedUrl.hostname;

          return !disallowedDomains.includes(domain);
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    }),
  ];

  return (
    <div role="textbox" aria-label="Rich Text Editor">
      <EditorProvider
        editorContainerProps={{
          className:
            "editor-container relative border border-border rounded-b-sm min-h-28",
          children:
            isRegenerating || isCustomizing ? (
              <div
                className="absolute top-4 left-4 right-4 z-10 grid gap-2"
                role="status"
                aria-label="Regenerating content"
              >
                <Skeleton className="h-[10px] w-full" />
                <Skeleton className="h-[10px] w-3/4" />
                <Skeleton className="h-[10px] w-1/2" />
              </div>
            ) : null,
        }}
        editorProps={{
          attributes: {
            class: clsx(isRegenerating || isCustomizing ? "opacity-0" : ""),
          },
        }}
        slotBefore={<MenuBar />}
        slotAfter={
          <AiActionButtons
            content={content}
            handleChange={handleChange}
            isRegenerating={isRegenerating}
            setIsRegenerating={setIsRegenerating}
            isFixingTypos={isFixingTypos}
            setIsFixingTypos={setIsFixingTypos}
            isCustomizing={isCustomizing}
            setIsCustomizing={setIsCustomizing}
          />
        }
        extensions={extensions}
        content={content}
        onUpdate={(content) => {
          handleChange(content.editor.getHTML());
        }}
      >
        <EditorContentUpdater content={content} />
      </EditorProvider>
    </div>
  );
};
