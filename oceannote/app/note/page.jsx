'use client'

// Imports
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Local imports
import { initFirebase, db } from "../firebase";
import Navbar from "../components/Navbar";
import CommandList from "../components/CommandList";
import { editorExtensions } from "../../config/editorExtensions";
import { debounce } from "../../utils/debounce";
import { saveNote, loadNote } from "../../services/noteService";

// Styles
import "../styles/TiptapEditor.scss";

// Constants
const DEBOUNCE_DELAY = 1000; // 1 second delay

const Note = () => {
  // Firebase initialization
  initFirebase();
  const auth = getAuth();
  const [user] = useAuthState(auth);

  // State and refs
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId");
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCommandListMenu, setShowCommandListMenu] = useState(false);
  const lastSavedContent = useRef("");
  const lastSavedTitle = useRef("");
  const captureRef = useRef(null);

  // Editor configuration
  const editor = useEditor({
    extensions: editorExtensions,
    content: noteContent,
    editorProps: {
      attributes: {
        class: "min-h-screen max-w-[8.5in] mx-auto xl:pt-20 lg:pt-10 md:pt-5 text-lg px-[2rem] pb-5 outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const firstLine = editor.state.doc.firstChild?.textContent || "Untitled Note";
      setNoteContent(content);
      if (content !== lastSavedContent.current || firstLine !== lastSavedTitle.current) {
        debouncedSave(content, firstLine);
      }
    },
  });

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((content, title) => saveNote(content, title, user, noteId, setIsSaving, lastSavedContent, lastSavedTitle), DEBOUNCE_DELAY),
    [noteId, user]
  );

  // Load note on component mount
  useEffect(() => {
    if (user && noteId) {
      loadNote(user, noteId, setNoteContent, lastSavedContent);
    }
  }, [user, noteId]);

  // Update editor content when noteContent changes
  useEffect(() => {
    if (editor && noteContent && !editor.isFocused) {
      editor.commands.setContent(noteContent);
    }
  }, [editor, noteContent]);

  return (
    <>
      <Navbar
        commandListToggleOnClick={() => setShowCommandListMenu(!showCommandListMenu)}
      />
      {showCommandListMenu && <CommandList />}
      <div className={`${showCommandListMenu ? "opacity-20" : ""}`}>
        <EditorContent editor={editor} ref={captureRef} />
      </div>
    </>
  );
};

export default Note;