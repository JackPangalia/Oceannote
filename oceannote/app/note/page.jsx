"use client";

// TIPTAP IMPORST
import Youtube from '@tiptap/extension-youtube'
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

// Firebase imports
import { initFirebase } from "../firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Next js imports
import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";

import "../styles/TiptapEditor.scss";
import Navbar from "../components/Navbar";
import ShortCutSideBarList from "../components/ShortCutSideBarList";

const CustomDocument = Document.extend({
  content: "heading block*",
});

const DEBOUNCE_DELAY = 1000; // 1 second delay

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const Note = () => {
  initFirebase();

  const auth = getAuth();
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();

  const noteId = searchParams.get("noteId");

  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedContent = useRef("");

  const [isShortCutSideBarToggleActive, setIsShortCutSideBarToggleActive] = useState(false)

  // Function to handle the shortCutSideBarToggle active state change
  const handleShortCutSideBarToggle = () => {
    setIsShortCutSideBarToggleActive(!isShortCutSideBarToggleActive)
  }

  const debouncedSave = useCallback(
    debounce((content) => saveNote(content), DEBOUNCE_DELAY),
    [noteId, user]
  );

  const editor = useEditor({
    extensions: [
      Strike,
      HorizontalRule,
      Dropcursor,
      Underline,
      CustomDocument,
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
        HTMLAttributes: {
          class: 'bg-blue-300',
        },
      }),
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        placeholder: "Start typing ...",
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
    ],
    content: noteContent,
    editorProps: {
      attributes: {
        class:
          "min-h-screen max-w-[8.5in] mx-auto pt-20 text-lg px-1 pb-5 outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setNoteContent(content);
      if (content !== lastSavedContent.current) {
        debouncedSave(content);
      }
    },
  });

  useEffect(() => {
    if (user && noteId) {
      loadNote();
    }
  }, [user, noteId]);

  useEffect(() => {
    if (editor && noteContent) {
      console.log("editor and note content");
      // Check if the editor is not currently focused to avoid interference
      if (!editor.isFocused) {
        console.log("editor is currently focused");
        editor.commands.setContent(noteContent);
      } else {
        console.log("Editor is currently focused, skipping setContent");
      }
    }
  }, [editor, noteContent]);

  const loadNote = async () => {
    try {
      const noteRef = doc(db, `users/${user.uid}/quicknotes/${noteId}`);
      const noteSnap = await getDoc(noteRef);

      if (noteSnap.exists()) {
        const data = noteSnap.data();
        setNoteContent(data.content);
        lastSavedContent.current = data.content;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error loading note:", error);
    }
  };

  const saveNote = async (content) => {
    if (!user || !noteId || content === lastSavedContent.current) return;

    setIsSaving(true);
    try {
      const noteRef = doc(db, `users/${user.uid}/quicknotes/${noteId}`);
      await setDoc(noteRef, { content }, { merge: true });
      lastSavedContent.current = content;
      console.log("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div>Please sign in to view and edit notes.</div>;
  }

  return (
    <>
      <Navbar shortCutSideBarToggleOnClick={handleShortCutSideBarToggle}/>

      {isShortCutSideBarToggleActive && <ShortCutSideBarList />}
      <EditorContent editor={editor} />


      {/* {isSaving && <div className="fixed bottom-4 right-4 bg-darkMode text-white px-4 py-2 rounded text-sm">Saving...</div>} */}
    </>
  );
};

export default Note;
