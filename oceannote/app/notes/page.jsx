"use client";

//* ICON COMPONENT IMPORTS *//
import IconJournalBookmarkFill from "../components/icons/IconJournalBookmarkFill";
import IconPlus from "../components/icons/IconPlus";
import IconListUl from "../components/icons/IconListUl";
//* JSX COMPONENTS IMPORTS*//
import Notetab from "../components/Notetab";
import Navbar from "../components/Navbar";
import NoteInspectorMenu from "../components/NoteInspectorMenu";
import IconTableCellsLarge from "../components/icons/IconTableCellsLarge";
// import Inspector from "../components/Inspector";

//* FIREBASE IMPORTS *//
import { initFirebase } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
  deleteDoc,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

//* NEXTJS IMPORTS *//
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Inspector from "../components/Inspector";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  noteId: null,
};

const Notes = () => {
  // Init firebase
  initFirebase();

  // define the auth information
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const userId = user?.uid;

  // router
  const router = useRouter();

  // Notes
  const [quickNotes, setQuickNotes] = useState([]);

  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  // Retrive the notes from the database
  useEffect(() => {
    if (!loading) {
      const q = query(collection(db, `users/${userId}/quicknotes`));

      onSnapshot(q, (querySnapshot) => {
        let quickNotesArrary = [];

        querySnapshot.forEach((doc) => {
          quickNotesArrary.push({ ...doc.data(), id: doc.id });
        });

        setQuickNotes(quickNotesArrary);
      });
    }
  }, [loading]);

  const handleContextMenu = (e, noteId) => {
    e.preventDefault();

    const { pageX, pageY } = e;
    setContextMenu({ show: true, x: pageX, y: pageY, noteId: noteId });
  };

  console.log(contextMenu);

  const contextMenuClose = () => setContextMenu({ show: false });

  // Function to create quick note
  const createQuickNote = async () => {
    try {
      const notebookRef = await addDoc(
        collection(db, `users/${userId}/quicknotes/`),
        {
          title: "untitled note",
          content: "",
        }
      );

      // if the notebook has been created successfully
      if (notebookRef) {
        router.push("/note");
      }
    } catch (error) {
      console.error("There was an error: ", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    console.log("deleting");
    try {
      const noteRef = doc(db, `users/${userId}/quicknotes/${noteId}`);

      await deleteDoc(noteRef);
    } catch (error) {
      console.error("There deleting note: ", error);
    }
  };

  // Function to parse through html to convert it into a string of text
  function htmlToText(html) {
    // Create a temporary element (not added to the DOM) to parse the HTML
    var tempElement = document.createElement("div");
    tempElement.innerHTML = html;

    // Extract text content from the element
    return tempElement.textContent || tempElement.innerText || "";
  }

  //* ACCOUNT FOR PROFILE LOADING *//
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Inspector />
      {/* ABSOLUTE POSITION OF THE NOTES INSPECTOR MENU */}
      {contextMenu.show && (
        <NoteInspectorMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={contextMenuClose}
          onClickDelete={() => handleDeleteNote(contextMenu.noteId)}
        />
      )}

      <div className="px-[2rem] py-10 max-w-[1500px] mx-auto ">
        <div className = 'flex items-center'>
          <h1 className="flex items-center gap-3 text-2xl mt-2">
            Jacks Notes <IconJournalBookmarkFill className="size-5" />
          </h1>

          <div className="py-2 px-4 dark:bg-darkMode bg-zinc-100 gap-3 flex items-center mt-2 rounded-md ml-10 text-gray-500">
            <button>
              <IconListUl />
            </button>
            <button>
              <IconTableCellsLarge />
            </button>
          </div>
        </div>
        <main className="mt-10 grid grid-cols-4 gap-5">
          <button
            onClick={createQuickNote}
            className="dark:bg-darkMode bg-zinc-100 rounded-lg hover:bg-zinc-200 flex flex-col px-4 py-2 max-w-[22.5rem] transition-all duration-200 items-center justify-center"
          >
            <IconPlus />
          </button>
          {quickNotes.map((note, index) => (
            <Notetab
              link={{
                pathname: "/note",
                query: {
                  noteId: note.id,
                },
              }}
              onContextMenu={(e) => handleContextMenu(e, note.id)}
              id={note.id}
              key={index}
              title={note.title}
              paragraphSnippet={htmlToText(note.content.slice(0, 48))}
            />
          ))}
        </main>
      </div>
    </>
  );
};

export default Notes;
