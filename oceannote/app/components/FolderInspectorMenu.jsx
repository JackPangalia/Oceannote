"use client";
import IconDelete from "./icons/IconDelete";
import IconBxPaint from "./icons/IconBxPaint";
import IconRename from "./icons/IconRename";
import IconArrowReturnRight from "./icons/IconArrowReturnRight";
import { useRef } from "react";
import { useOnClickOutside } from "../../utils/useOnClickOutside";
import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  where,
  collection,
  query,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { initFirebase } from "../firebase";
import { db } from "../firebase";
import { useTheme } from "next-themes";
import IconTag from "./icons/IconTag";
import IconCloseCircle from "./icons/IconCloseCircle";

const FolderInspectorMenu = ({ x, y, closeContextMenu, folderId, userId, folderName, isDeletable }) => {
  initFirebase();
  const { resolvedTheme } = useTheme();

  const contextMenuRef = useRef();
  useOnClickOutside(contextMenuRef, closeContextMenu);

  // SUB MENU STATES
  const [isColorPickerActive, setColorPickerActive] = useState(false);
  const [isDeleteMenuActive, setDeleteMenuActive] = useState(false);
  const [isRenamingActive, setRenamingActive] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleSubMenus = (menu) => {
    if (menu === "colorMenu") {
      setColorPickerActive(true);
      setDeleteMenuActive(false);
      setRenamingActive(false);
    } else if (menu === "deleteMenu") {
      setColorPickerActive(false);
      setDeleteMenuActive(true);
      setRenamingActive(false);
    } else if (menu === "renameMenu") {
      setColorPickerActive(false);
      setDeleteMenuActive(false);
      setRenamingActive(true);
    }
  };

  // FUNCTION TO HANDLE THE COLOR CHANGE
  const handleColorChange = async (folderId, color) => {
    try {
      await updateDoc(doc(db, `users/${userId}/folders/${folderId}`), {
        color: color,
      });
    } catch (error) {
      console.log("error updating folder tab color: ", error);
    }
  };

  const updateTitle = async (folderId, newTitle) => {
    if (!userId || !folderName || !isDeletable) return;

    try {
      await updateDoc(doc(db, `users/${userId}/folders/${folderId}`), {
        name: newTitle,
      });
    } catch (error) {
      console.log("error updating folder tab title: ", error);
    }
  };

  const handleDeleteFolder = async (folderName, folderId) => {
    if (!userId || !folderName || !isDeletable) return;
  
    try {
      // Query to get all notes within the folder
      const notesQuery = query(
        collection(db, `users/${userId}/notes`),
        where("folderId", "==", folderName)
      );
  
      const notesSnapshot = await getDocs(notesQuery);
  
      // Move each note to the 'recentlyDeleted' folder by updating its folderId
      const movePromises = notesSnapshot.docs.map(async (doc) => {
        const noteRef = doc.ref;
  
        await updateDoc(noteRef, {
          folderId: "recentlyDeleted",
          deletedAt: serverTimestamp(), // Add a timestamp for when it was deleted
        });
      });
  
      await Promise.all(movePromises);
  
      // Delete the folder itself
      const folderRef = doc(db, `users/${userId}/folders/${folderId}`);
      await deleteDoc(folderRef);
  
      console.log("Folder and its notes moved to 'Recently Deleted' successfully.");
    } catch (error) {
      console.error("Error moving folder and notes: ", error);
    }
  };
  

  return (
    <div ref={contextMenuRef}>
      {/* COLOR PICKER SELECTOR */}
      <div
        style={{ top: `${y + 41}px`, left: `${x + 35}px` }}
        className={`${
          isColorPickerActive ? "grid" : "hidden"
        } bg-lightMode dark:bg-zinc-800 shadow-md dark:border-zinc-500 border-zinc-800 border-[1px] absolute p-2 grid grid-cols-2 gap-1 rounded-md`}
      >
        <button
          className="bg-red-300 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#fca5a5")}
        ></button>
        <button
          className="bg-orange-300 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#fdba74")}
        ></button>
        <button
          className="bg-yellow-200 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#fde68a")}
        ></button>
        <button
          className="bg-green-300 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#86efac")}
        ></button>
        <button
          className="bg-blue-300 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#93c5fd")}
        ></button>
        <button
          className="bg-violet-300 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#c4b5fd")}
        ></button>
        <button
          className="bg-pink-200 p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#fbcfe8")}
        ></button>
        <button
          className="bg-white p-2 rounded-full border-zinc-800 border-[1px]"
          onClick={() => handleColorChange(folderId, "#f4f4f5")}
        ></button>
      </div>

      {/* COMFIRM DELETE SUB MENU */}
      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${
          isDeleteMenuActive ? "flex" : "hidden"
        } absolute dark:bg-zinc-800 dark:border-zinc-500 bg-lightMode shadow-md border-zinc-800 border-[1px] p-2 flex-col rounded-md`}
      >
        <label className="text-sm mb-2">Delete folder and notes</label>
        <button onClick = {() => handleDeleteFolder(folderName, folderId)}className="mr-auto text-[12px] border-zinc-800 bg-red-300 hover:bg-red-400 dark:text-black transition-all duration-200 border-[1px] px-[6.5px] py-[3px] rounded shadow-md">
          delete
        </button>
      </div>

      <div
        style={{ top: `${y + 41}px`, left: `${x + 65}px` }}
        className={`${
          isRenamingActive ? "block" : "hidden"
        } absolute dark:bg-zinc-800 dark:border-zinc-500 bg-lightMode shadow-md border-zinc-800 border-[1px] p-2 flex-col rounded-md`}
      >
        <p className="text-sm mb-1">Rename</p>
        <div className="flex items-center gap-3">
          <input
            onChange={(e) => setNewTitle(e.target.value)}
            value={newTitle}
            placeholder="Enter new folder name"
            className="text-sm outline-none bg-zinc-100 dark:bg-transparent w-[100%]"
          />
          <button
            className="hover:text-red-400 transition-all duration-200"
            onClick={() => updateTitle(folderId, newTitle)}
          >
            <IconArrowReturnRight />
          </button>
        </div>
      </div>

      <div
        style={{ top: `${y}px`, left: `${x}px` }}
        className="absolute z-50 text-black dark:text-white bg-lightMode dark:bg-zinc-800 shadow-md dark:border-zinc-500 border-zinc-800 border-[1px] px-3 py-2 flex items-center gap-2 rounded-md "
      >
        <button
          className={`text-lg ${isDeletable ? 'block' : 'hidden'}`}
          onClick={() => {
            handleSubMenus("deleteMenu");
          }}
        >
          <IconDelete />
        </button>
        <button className="text-lg" onClick={() => handleSubMenus("colorMenu")}>
          <IconBxPaint />
        </button>
        <button
          className={`text-lg ${isDeletable ? 'block' : 'hidden'}`}
          
          onClick={() => handleSubMenus("renameMenu")}
        >
          <IconRename />
        </button>
      </div>
    </div>
  );
};

export default FolderInspectorMenu;
