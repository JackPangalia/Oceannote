"use client";

//* ICON COMPONENT IMPORTS *//
import IconJournalBookmarkFill from "../components/icons/IconJournalBookmarkFill";
import IconPlus from "../components/icons/IconPlus";
import IconListUl from "../components/icons/IconListUl";
import IconFolder from "../components/icons/IconFolder";
import IconBxSearchAlt from "../components/icons/IconBxSearchAlt";

//* JSX COMPONENTS IMPORTS*//
import Notetab from "../components/Notetab";
import Navbar from "../components/Navbar";
import NoteInspectorMenu from "../components/NoteInspectorMenu";
import NotebookTab from "../components/NotebookTab";
import CommandList from "../components/CommandList";

//* FIREBASE IMPORTS *//
import { initFirebase } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

//* NEXTJS IMPORTS *//
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");

  // context menu object
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  const [showCommandListMenu, setShowCommandListMenu] = useState(false);

  // Retrive the notes from the database
  useEffect(() => {
    if (!loading) {
      const q = query(collection(db, `users/${userId}/notes`));

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
        collection(db, `users/${userId}/notes/`),
        {
          title: "untitled note",
          content: "",
          color: "#f4f4f5",
          tags: ["all"],
        }
      );

      // if the notebook has been created successfully
      if (notebookRef) {
        router.push(`/note?noteId=${notebookRef.id}`);
      }
    } catch (error) {
      console.error("There was an error: ", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const noteRef = doc(db, `users/${userId}/notes/${noteId}`);

      await deleteDoc(noteRef);
    } catch (error) {
      console.error("There deleting note: ", error);
    }
  };

  function removeFirstElementAndExtractText(htmlString) {
    // Create a new DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Get the body element from the parsed document
    const body = doc.body;

    // Remove the first child element from the body
    if (body.firstChild) {
      body.removeChild(body.firstChild);
    }

    // Extract and return the text content from the modified body
    return body.textContent.trim();
  }

  const searchNotes = (query, notes) => {
    return notes.filter((note) => {
      const queryLower = query.toLowerCase();
      const titleMatches = note.title.toLowerCase().includes(queryLower);
      const tagsMatch =
        note.tags &&
        note.tags.some((tag) => tag.toLowerCase().includes(queryLower));
      const contentMatches = note.content.toLowerCase().includes(queryLower);
      return titleMatches || tagsMatch || contentMatches;
    });
  };

  //* ACCOUNT FOR PROFILE LOADING *//
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        <h1>Loading</h1>
      </div>
    );
  }

  // Find the selected note
  const selectedNote = quickNotes.find(
    (note) => note.id === contextMenu.noteId
  );

  const isEditedWithin = (lastSaved, days) => {
    if (!lastSaved) return false;

    const now = new Date();
    const daysAgo = new Date(now);
    daysAgo.setDate(now.getDate() - days);

    return lastSaved.toDate() >= daysAgo;
  };

  const getFilteredNotes = (notes) => {
    const notesWithin1Day = [];
    const notesWithin7Days = [];
    const notesWithin30Days = [];

    notes.forEach((note) => {
      if (isEditedWithin(note.lastSaved, 1)) {
        notesWithin1Day.push(note);
      } else if (isEditedWithin(note.lastSaved, 7)) {
        notesWithin7Days.push(note);
      } else if (isEditedWithin(note.lastSaved, 30)) {
        notesWithin30Days.push(note);
      }
    });

    return { notesWithin1Day, notesWithin7Days, notesWithin30Days };
  };

  const { notesWithin1Day, notesWithin7Days, notesWithin30Days } =
    getFilteredNotes(searchNotes(searchQuery, quickNotes));

  // console.log(notesWithin1Day, notesWithin7Days, notesWithin30Days);
  console.log(notesWithin7Days.length);

  return (
    <div className="">
      <Navbar
        commandListToggleOnClick={() =>
          setShowCommandListMenu(!showCommandListMenu)
        }
      />
      {showCommandListMenu && <CommandList />}

      {/* ABSOLUTE POSITION OF THE NOTES INSPECTOR MENU */}
      {contextMenu.show && (
        <NoteInspectorMenu
          tags={selectedNote?.tags}
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={contextMenuClose}
          onClickDelete={() => handleDeleteNote(contextMenu.noteId)}
          noteId={contextMenu.noteId}
          userId={userId}
        />
      )}

      <div
        className={`px-[2rem] max-w-[1500px] mx-auto mt-3 ${
          showCommandListMenu && "opacity-15"
        }`}
      >
        <div className="flex items-center sm:justify-start ">
          <div className="py-[7.8px] px-[8px] dark:bg-darkMode bg-lightMode border-zinc-800 hover:bg-zinc-200 transition-all duration-200 border-[1px] gap-3 flex items-center mt-2 rounded-md shadow-md">
            <button
              className="dark:hover:text-white hover:text-black"
              onClick={createQuickNote}
            >
              <IconPlus />
            </button>
          </div>

          <div className="py-[4px] px-5 ml-4 mt-2 gap-3 dark:bg-darkMode text-gray-500 bg-lightMode border-zinc-800 transition-all duration-200 border-[1px] flex items-center rounded-md shadow-md">
            <button>
              <IconBxSearchAlt />
            </button>
            <input
              placeholder="Search all notes"
              className="bg-transparent outline-none  md:w-[13.5rem] w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-7 gap-6 flex flex-col pb-10">
          {/* <span className="text-lg">Notebooks</span> */}
          {/* <div className="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-5 gap-3 w-full">
            <NotebookTab color={"#f4f4f5"} />
            <NotebookTab color={"#fef08a"} />
            <NotebookTab color="#93c5fd" />
            <NotebookTab color={"#f4f4f5"} />
            <NotebookTab color={"#86efac"} />
            <NotebookTab color={"#fbcfe8"} />
          </div> */}
          <span className="text-xl">Today</span>
          <main className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-1 w-full rounded">
            {searchNotes(searchQuery, notesWithin1Day).map((note, index) => (
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
                bgColor={note.color}
                title={note.title}
                paragraphSnippet={removeFirstElementAndExtractText(
                  note.content
                )}
              />
            ))}
          </main>
          {notesWithin7Days.length > 0 && (
            <>
              <span className="text-xl">Previous 7 days</span>
              <main className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-1 w-full rounded">
                {searchNotes(searchQuery, notesWithin7Days).map(
                  (note, index) => (
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
                      bgColor={note.color}
                      title={note.title}
                      paragraphSnippet={removeFirstElementAndExtractText(
                        note.content
                      )}
                    />
                  )
                )}
              </main>
            </>
          )}
          {notesWithin30Days.length > 0 && (
            <>
              <span className="text-xl">Previous 30 days</span>
              <main className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-1 w-full rounded">
                {searchNotes(searchQuery, notesWithin7Days).map(
                  (note, index) => (
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
                      bgColor={note.color}
                      title={note.title}
                      paragraphSnippet={removeFirstElementAndExtractText(
                        note.content
                      )}
                    />
                  )
                )}
              </main>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
