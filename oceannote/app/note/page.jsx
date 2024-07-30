'use client'

import React, { useCallback, useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { initFirebase, db } from "../firebase";
import Navbar from "../components/Navbar";
import CommandList from "../components/CommandList";
import { editorExtensions } from "../../config/editorExtensions";
import { debounce } from "../../utils/debounce";
import { saveNote, loadNote } from "../../services/noteService";

import "../styles/TiptapEditor.scss";

const DEBOUNCE_DELAY = 1000;

// This component will use useSearchParams
const NoteContent = ({ user }) => {
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId");
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedContent = useRef("");
  const lastSavedTitle = useRef("");
  const captureRef = useRef(null);

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

  const debouncedSave = useCallback(
    debounce((content, title) => saveNote(content, title, user, noteId, setIsSaving, lastSavedContent, lastSavedTitle), DEBOUNCE_DELAY),
    [noteId, user]
  );

  useEffect(() => {
    if (user && noteId) {
      loadNote(user, noteId, setNoteContent, lastSavedContent);
    }
  }, [user, noteId]);

  useEffect(() => {
    if (editor && noteContent && !editor.isFocused) {
      editor.commands.setContent(noteContent);
    }
  }, [editor, noteContent]);

  return <EditorContent editor={editor} ref={captureRef} />;
};

const Note = () => {
  initFirebase();
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [showCommandListMenu, setShowCommandListMenu] = useState(false);

  return (
    <>
      <Navbar
        commandListToggleOnClick={() => setShowCommandListMenu(!showCommandListMenu)}
      />
      {showCommandListMenu && <CommandList />}
      <div className={`${showCommandListMenu ? "opacity-20" : ""}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <NoteContent user={user} />
        </Suspense>
      </div>
    </>
  );
};

export default Note;