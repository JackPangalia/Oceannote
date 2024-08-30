"use client";

//* ICON COMPONENT IMPORTS *//
import IconJournalBookmarkFill from "../components/icons/IconJournalBookmarkFill";
import IconPlus from "../components/icons/IconPlus";
import IconListUl from "../components/icons/IconListUl";
import IconFolder from "../components/icons/IconFolder";
import IconBxSearchAlt from "../components/icons/IconBxSearchAlt";
import IconPlusCircle from "../components/icons/IconPlusCircle";
import IconBxNote from "../components/icons/IconBxNote";
import IconFolder2 from "../components/icons/IconFolder2";
import IconFolderPlus from "../components/icons/IconFolderPlus";

//* JSX COMPONENTS IMPORTS*//
import Notetab from "../components/Notetab";
import Navbar from "../components/Navbar";
import NoteInspectorMenu from "../components/NoteInspectorMenu";
import NotebookTab from "../components/NotebookTab";
import CommandList from "../components/CommandList";
import CreateFolderMenu from "../components/CreateFolderMenu";
import FolderInspectorMenu from "../components/FolderInspectorMenu";
import FolderTab from "../components/FolderTab";
import QuoteInput from "../components/QuoteInput";
import ImageBanner from "../components/ImageBanner";

//* HOOKS *//
import useFolders from "../hooks/useFolders";

//* FIREBASE IMPORTS *//
import { initFirebase } from "../firebase";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  where,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

//* NEXTJS IMPORTS *//
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const noteTabInitialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  noteId: null,
};

const folderTabInitalContextMenu = {
  show: false,
  x: 0,
  y: 0,
  folderId: null,
  folderName: null,
  isDeletable: null,
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
  const [noteTabContextMenu, setNoteTabContextMenu] = useState(
    noteTabInitialContextMenu
  );
  const [folderTabContextMenu, setFolderTabContextMenu] = useState(
    folderTabInitalContextMenu
  );

  const [showCommandListMenu, setShowCommandListMenu] = useState(false);

  const [isCreatingFolder, setCreatingFolder] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("notes");

  if (!user) {
    router.push("/");
  }

  // Retrive the notes from the database
  useEffect(() => {
    if (!loading) {
      const q = query(
        collection(db, `users/${userId}/notes`),
        where("folderId", "==", selectedFolder)
      );

      onSnapshot(q, (querySnapshot) => {
        const notesInFolder = [];
        querySnapshot.forEach((doc) => {
          notesInFolder.push({ ...doc.data(), id: doc.id });
        });
        setQuickNotes(notesInFolder);
      });
    }
  }, [loading, selectedFolder]);

  // Fetch folders and listen to changes in the folder state
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${userId}/folders`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const folderList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFolders(folderList);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [user, userId]);

  const handleNoteTabContextMenu = (e, noteId) => {
    e.preventDefault();

    const { pageX, pageY } = e;
    setNoteTabContextMenu({ show: true, x: pageX, y: pageY, noteId: noteId });
  };

  const handleFolderTabContextMenu = (e, folderId, folderName, isDeletable) => {
    e.preventDefault();

    const { pageX, pageY } = e;
    console.log(pageX);
    setFolderTabContextMenu({
      show: true,
      x: pageX,
      y: pageY,
      folderId: folderId,
      folderName: folderName,
      isDeletable: isDeletable,
    });
  };

  const noteTabContextMenuClose = () => setNoteTabContextMenu({ show: false });
  const folderTabContextMenuClose = () =>
    setFolderTabContextMenu({ show: false });

  // Function to create quick note
  const createQuickNote = async (folderId = "notes") => {
    if (!user) return;

    try {
      const notebookRef = await addDoc(
        collection(db, `users/${userId}/notes/`),
        {
          title: "untitled note",
          content: "",
          color: "#f4f4f5",
          tags: ["all"],
          folderId: folderId,
          lastSaved: serverTimestamp(),
          createdAt: serverTimestamp(),
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

  const moveToRecentlyDeleted = async (noteId) => {
    console.log('moving')
    if (!user) return;
  
    try {
      // Ensure correct document reference
      const noteRef = doc(db, `users/${user.uid}/notes/${noteId}`);
  
      // Move the note to "Recently Deleted" by updating its folderId
      await updateDoc(noteRef, {
        folderId: "recentlyDeleted",
        deletedAt: serverTimestamp(), // Add a timestamp for when it was deleted
      });
  
      console.log("Note moved to 'Recently Deleted'.");
    } catch (error) {
      console.error("Error moving note to 'Recently Deleted':", error);
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
      console.log(note.folderId)
      const queryLower = query.toLowerCase();
      const titleMatches = note.title.toLowerCase().includes(queryLower);
      const tagsMatch =
        note.tags &&
        note.tags.some((tag) => tag.toLowerCase().includes(queryLower));
      const contentMatches = note.content.toLowerCase().includes(queryLower);
      return titleMatches || tagsMatch || contentMatches;
    });
  };

  // Find the selected note
  const selectedNote = quickNotes.find(
    (note) => note.id === noteTabContextMenu.noteId
  );

  const selectedFolderFromContextMenu = folders.find(
    (folder) => folder.id === folderTabContextMenu.folderId
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
    const notesAfter7Days = [];

    notes.forEach((note) => {
      if (isEditedWithin(note.lastSaved, 1)) {
        notesWithin1Day.push(note);
      } else if (isEditedWithin(note.lastSaved, 7)) {
        notesWithin7Days.push(note);
      } else {
        notesAfter7Days.push(note);
      }
    });

    return { notesWithin1Day, notesWithin7Days, notesAfter7Days };
  };

  // Load the selected folder from localStorage when the component mounts
  useEffect(() => {
    const savedFolder = localStorage.getItem("selectedFolder");
    if (savedFolder) {
      setSelectedFolder(savedFolder);
    }
  }, []);

  // Handle folder selection and save it to localStorage
  const handleFolderSelect = (folderName) => {
    setSelectedFolder(folderName);
    localStorage.setItem("selectedFolder", folderName);
  };

  const { notesWithin1Day, notesWithin7Days, notesAfter7Days } =
    getFilteredNotes(searchNotes(searchQuery, quickNotes));

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
      <Navbar
        commandListToggleOnClick={() =>
          setShowCommandListMenu(!showCommandListMenu)
        }
      />
      {showCommandListMenu && <CommandList />}

      {noteTabContextMenu.show && (
        <NoteInspectorMenu
          folders={folders}
          tags={selectedNote?.tags}
          x={noteTabContextMenu.x}
          y={noteTabContextMenu.y}
          closeContextMenu={noteTabContextMenuClose}
          onClickDelete={() => moveToRecentlyDeleted(noteTabContextMenu.noteId)}
          noteId={noteTabContextMenu.noteId}
          userId={userId}
        />
      )}

      {folderTabContextMenu.show && (
        <FolderInspectorMenu
          folderName={folderTabContextMenu.folderName}
          x={folderTabContextMenu.x}
          y={folderTabContextMenu.y}
          closeContextMenu={folderTabContextMenuClose}
          folderId={folderTabContextMenu.folderId}
          userId={userId}
          isDeletable={folderTabContextMenu.isDeletable}
        />
      )}

      <div
        className={`px-[2rem] max-w-[1500px] mx-auto mt-16 ${
          showCommandListMenu && "opacity-15"
        }`}
      >
        {/* <ImageBanner /> */}
        <QuoteInput />
        <div
          className={`${
            quickNotes.length <= 0 ? "hidden" : "block"
          } flex items-center sm:justify-start mt-5`}
        >
          <div className="py-[7.8px] px-[7.8px] dark:bg-darkMode bg-lightMode border-zinc-800 dark:border-zinc-700 hover:bg-zinc-200 transition-all duration-200 border-[1px] gap-3 flex items-center mt-2 rounded-md shadow-md">
            <button
              className="dark:hover:text-white hover:text-black"
              onClick={() => setCreatingFolder(!isCreatingFolder)}
            >
              <IconFolderPlus className="text-gray-500" />
            </button>

            <CreateFolderMenu
              isMenuOpen={isCreatingFolder}
              closeMenu={() => setCreatingFolder(false)}
            />
          </div>
          <div className="ml-4 py-[7.8px] px-[7.8px] dark:bg-darkMode bg-lightMode border-zinc-800 dark:border-zinc-700 hover:bg-zinc-200 transition-all duration-200 border-[1px] gap-3 flex items-center mt-2 rounded-md shadow-md">
            <button
              className="dark:hover:text-white hover:text-black"
              onClick={() => createQuickNote(selectedFolder)}
            >
              <IconBxNote className="text-gray-500" />
            </button>
          </div>
          <div className="py-[4px] px-5 ml-4 mt-2 gap-3 dark:bg-darkMode text-gray-500 bg-lightMode border-zinc-800 dark:border-zinc-700 transition-all duration-200 border-[1px] flex items-center rounded-md shadow-md">
            <button>
              <IconBxSearchAlt />
            </button>
            <input
              placeholder="Search all notes"
              className="bg-transparent outline-none md:w-[13.5rem] w-full pb-[1px]"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="mt-7">
            <h4 className="text-xl mb-6 border-b-[1px] border-t-[1px] dark:border-zinc-700 p-1">
              Folders / {selectedFolder}
            </h4>
            <div className="flex flex-wrap gap-3 ">
              {folders.map((folder) => (
                <FolderTab
                  key={folder.id}
                  title={folder.name}
                  bgColor={folder.color}
                  isSelected={folder.name === selectedFolder}
                  onContextMenu={(e) =>
                    handleFolderTabContextMenu(
                      e,
                      folder.id,
                      folder.name,
                      folder.isDeletable
                    )
                  }
                  onClick={() => handleFolderSelect(folder.name)}
                />
              ))}
            </div>
          </div>
          {quickNotes.length <= 0 && (
            <div className="flex flex-col justify-center items-center h-[50vh]">
              <span className="text-xl">
                Add your first note to "{selectedFolder}"
              </span>
              <button
                className="text-xl mt-4 hover:text-gray-500 transition-all duration-150"
                onClick={() => createQuickNote(selectedFolder)}
              >
                <IconBxNote />
              </button>
            </div>
          )}

          <div className="mt-7 gap-6 flex flex-col pb-10">
            {notesWithin1Day.length > 0 && (
              <>
                <span className="text-xl  border-b-[1px] border-t-[1px] dark:border-zinc-700 p-1">
                  Today
                </span>
                <main className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-1 w-full rounded">
                  {searchNotes(searchQuery, notesWithin1Day).map(
                    (note, index) => (
                        <Notetab
                        link={{
                          pathname: "/note",
                          query: {
                            noteId: note.id,
                          },
                        }}
                        onContextMenu={(e) =>
                          handleNoteTabContextMenu(e, note.id)
                        }
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

            {notesWithin7Days.length > 0 && (
              <>
                <span className="text-xl">Previous Week</span>
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
                        onContextMenu={(e) =>
                          handleNoteTabContextMenu(e, note.id)
                        }
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

            {notesWithin7Days.length > 0 && (
              <>
                <span className="text-xl">Later</span>
                <main className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-3 gap-1 w-full rounded">
                  {searchNotes(searchQuery, notesAfter7Days).map(
                    (note, index) => (
                      <Notetab
                        link={{
                          pathname: "/note",
                          query: {
                            noteId: note.id,
                          },
                        }}
                        onContextMenu={(e) =>
                          handleNoteTabContextMenu(e, note.id)
                        }
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
    </>
  );
};

export default Notes;
