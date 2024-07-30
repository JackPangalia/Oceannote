import { doc, getDoc, setDoc , serverTimestamp } from "firebase/firestore";
import { db } from "../app/firebase";

export const saveNote = async (content, title, user, noteId, setIsSaving, lastSavedContent, lastSavedTitle) => {
  if (!user || !noteId) return;

  setIsSaving(true);
  try {
    const noteRef = doc(db, `users/${user.uid}/notes/${noteId}`);
    await setDoc(noteRef, { content, title, lastSaved: serverTimestamp() }, { merge: true });
    lastSavedContent.current = content;
    lastSavedTitle.current = title;
    console.log("Note saved successfully");
  } catch (error) {
    console.error("Error saving note:", error);
  } finally {
    setIsSaving(false);
  }
};

export const loadNote = async (user, noteId, setNoteContent, lastSavedContent) => {
  try {
    const noteRef = doc(db, `users/${user.uid}/notes/${noteId}`);
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