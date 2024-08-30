import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase"; // Make sure this path is correct
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import IconFolder2 from "./icons/IconFolder2";
import IconDelete from "./icons/IconDelete";
import IconPlus from "./icons/IconPlus";

const RecentlyDeletedToggle = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [user, loading] = useAuthState(getAuth());

  useEffect(() => {
    if (!loading) {
      const q = query(
        collection(db, `users/${user.uid}/notes`),
        where("folderId", "==", "recentlyDeleted")
      );

      onSnapshot(q, (querySnapshot) => {
        const notesInFolder = [];
        querySnapshot.forEach((doc) => {
          notesInFolder.push({ ...doc.data(), id: doc.id });
        });
        setDeletedNotes(notesInFolder);
      });
    
    }
  }, [ user]);

  const recoverNote = async (noteId) => {
    try {
      await updateDoc(doc(db, `users/${user.uid}/notes/${noteId}`), {
        folderId: "notes",
      });
    } catch (error) {
      console.log("error transering folders", error);
    }
  };

  const handlePermanentlyDelete = async (noteId) => {
    try {
      const noteRef = doc(db, `users/${user.uid}/notes/${noteId}`);
      await deleteDoc(noteRef);

    } catch (err) {
      console.error('Error permanently deleting note: ', err);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (deletedNotes.length === 0) {
    return <div>No recently deleted notes.</div>;
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Recently Deleted Notes</h2>
      <ul>
        {deletedNotes.map((note) => (
          <li
            key={note.id}
            className="border-b border-zinc-500 py-2 flex items-center justify-between"
          >
            <div className="darK:text-gray-100">
              {note.title || "Untitled Note"}
            </div>
            <div className="flex gap-2">
              <p className="mr-3 dark:text-zinc-500 text-gray-500">
                {note.deletedAt
                  ? new Date(note.deletedAt.seconds * 1000).toLocaleDateString()
                  : "No date"}
              </p>
              <button
                className="hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors duration-150"
                onClick={() => recoverNote(note.id)}
              >
                <IconPlus />
              </button>
              <button onClick = {() => handlePermanentlyDelete(note.id)} className = 'hover:text-red-400 transition-colors duration-150'>
                <IconDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyDeletedToggle;
