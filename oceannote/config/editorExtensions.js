import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import BulletList from "@tiptap/extension-bullet-list";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Typography from "@tiptap/extension-typography";

export const editorExtensions = [
  Typography,
  Strike,
  HorizontalRule,
  Dropcursor,
  Underline,
  Text,
  Paragraph,
  TaskList,
  BulletList,
  ListItem,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    defaultProtocol: "https",
  }),
  TaskItem.configure({
    nested: true,
  }),
  StarterKit.configure({
    document: true,
  }),
  Placeholder.configure({
    placeholder: "Title",
  }),
  Youtube.configure({
    controls: false,
    nocookie: true,
  }),
];