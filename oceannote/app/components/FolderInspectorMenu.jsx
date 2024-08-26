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
} from "firebase/firestore";
import { initFirebase } from "../firebase";
import { db } from "../firebase";
import { useTheme } from "next-themes";
import IconTag from "./icons/IconTag";
import IconCloseCircle from "./icons/IconCloseCircle";

const FolderInspectorMenu = ({ x, y, closeContextMenu, folderId, userId }) => {
  initFirebase();
  const { resolvedTheme } = useTheme();

  const contextMenuRef = useRef();
  useOnClickOutside(contextMenuRef, closeContextMenu);

  // SUB MENU STATES
  const [isColorPickerActive, setColorPickerActive] = useState(false);
  const [isDeleteMenuActive, setDeleteMenuActive] = useState(false);
  const [isRenamingActive, setRenamingActive] = useState(false);
  const [newTitle, setNewTitle] = useState('')

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
    try {
      await updateDoc(doc(db, `users/${userId}/folders/${folderId}`), {
        name: newTitle
      })
    } catch (error) {
      console.log("error updating folder tab title: ", error);
    }
  }

  const handleDeleteFolder = async (folderId) => {
    console.log("hello world");
    try {
      const folderRef = doc(db, `users/${userId}/folders/${folderId}`);

      await deleteDoc(folderRef);
    } catch (error) {
      console.error("There deleting note: ", error);
    }
  };

  return (
    <div ref={contextMenuRef}>
      {/* COLOR PICKER SELECTOR */}
      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${
          isColorPickerActive ? "grid" : "hidden"
        } bg-lightMode dark:bg-zinc-800 dark:border-none shadow-md border-zinc-800 border-[1px] absolute p-2 grid grid-cols-2 gap-1 rounded-md`}
      >
        <button
          className="bg-red-300 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#fca5a5")}
        ></button>
        <button
          className="bg-orange-300 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#fdba74")}
        ></button>
        <button
          className="bg-yellow-200 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#fde68a")}
        ></button>
        <button
          className="bg-green-300 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#86efac")}
        ></button>
        <button
          className="bg-blue-300 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#93c5fd")}
        ></button>
        <button
          className="bg-violet-300 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#c4b5fd")}
        ></button>
        <button
          className="bg-pink-200 p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#fbcfe8")}
        ></button>
        <button
          className="bg-white p-2 rounded-lg"
          onClick={() => handleColorChange(folderId, "#f4f4f5")}
        ></button>
      </div>

      {/* COMFIRM DELETE SUB MENU */}
      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${
          isDeleteMenuActive ? "flex" : "hidden"
        } absolute dark:bg-zinc-800 dark:border-none bg-lightMode shadow-md border-zinc-800 border-[1px] p-2 flex-col rounded-md`}
      >
        <label className="text-sm mb-2">permanent delete</label>
        <button
          onClick={() => handleDeleteFolder(folderId)}
          className="mr-auto text-[12px] border-zinc-800 bg-red-300 hover:bg-red-400 dark:text-black transition-all duration-200 border-[1px] px-[6.5px] py-[3px] rounded shadow-md"
        >
          delete
        </button>
      </div>

      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${isRenamingActive ? 'block' : 'hidden'} absolute dark:bg-zinc-800 dark:border-none bg-lightMode shadow-md border-zinc-800 border-[1px] p-2 flex-col rounded-md`}
      >
        <p className="text-sm mb-1">Rename</p>
        <div className="flex items-center gap-3">
          <input
            onChange = {(e) => setNewTitle(e.target.value)}
            value = {newTitle}
            placeholder="Enter new folder name"
            className="text-sm outline-none bg-zinc-100 dark:bg-transparent w-[100%]"
          />
          <button className="hover:text-red-400 transition-all duration-200" onClick = {() => updateTitle(folderId, newTitle)}>
            <IconArrowReturnRight />
          </button>
        </div>
      </div>

      <div
        style={{ top: `${y}px`, left: `${x}px` }}
        className="absolute z-50 text-black dark:text-white bg-lightMode dark:bg-zinc-800 shadow-md dark:border-none border-zinc-800 border-[1px] px-3 py-2 flex items-center gap-2 rounded-md "
      >
        <button
          className="text-lg"
          onClick={() => {
            handleSubMenus("deleteMenu");
          }}
        >
          <IconDelete />
        </button>
        <button className="text-lg" onClick={() => handleSubMenus("colorMenu")}>
          <IconBxPaint />
        </button>
        <button className="text-lg" onClick = {() => handleSubMenus("renameMenu")}>
          <IconRename />
        </button>
      </div>
    </div>
  );
};

export default FolderInspectorMenu;
