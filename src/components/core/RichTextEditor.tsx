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

import { useCurrentEditor } from "@tiptap/react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import {
  BoldIcon,
  ItalicIcon,
  Link2,
  Link2Off,
  List,
  ListOrdered,
} from "lucide-react";

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
    <div className="flex items-center gap-3 px-1 py-2 border-b border-border">
      <Button
        title="Bold"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("bold") ? "bg-muted text-primary" : ""
        )}
      >
        <BoldIcon />
      </Button>
      <Button
        title="Italic"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("italic") ? "bg-muted text-primary" : ""
        )}
      >
        <ItalicIcon />
      </Button>

      <Button
        title="Bullet List"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("bulletList") ? "bg-muted text-primary" : ""
        )}
      >
        <List />
      </Button>
      <Button
        title="Ordered List"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("orderedList") ? "bg-muted text-primary" : ""
        )}
      >
        <ListOrdered />
      </Button>
      <Button
        title="Link"
        type="button"
        variant="ghost"
        size="icon"
        onClick={setLink}
        className={cn(
          "hover:bg-muted hover:text-primary",
          editor.isActive("link") ? "bg-muted text-primary" : ""
        )}
      >
        <Link2 />
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
      >
        <Link2Off />
      </Button>
    </div>
  );
};

interface RichTextEditorProps {
  handleChange: (html: string) => void;
  content: object | string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  handleChange,
  content,
}) => {
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
          return false;
        }
      },
    }),
  ];

  return (
    <div className=" border border-border rounded-sm">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={(content) => {
          handleChange(content.editor.getHTML());
        }}
      ></EditorProvider>
    </div>
  );
};
