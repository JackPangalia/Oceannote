"use client";
import IconDelete from "./icons/IconDelete";
import IconBxPaint from "./icons/IconBxPaint";
import IconRename from "./icons/IconRename";
import IconArrowReturnRight from "./icons/IconArrowReturnRight";
import { useRef } from "react";
import { useOnClickOutside } from "../../utils/useOnClickOutside";
import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { initFirebase } from "../firebase";
import { db } from "../firebase";
import { useTheme } from "next-themes";
import IconTag from "./icons/IconTag";
import IconCloseCircle from "./icons/IconCloseCircle";
import IconFolder2 from "./icons/IconFolder2";

const NoteInspectorMenu = ({
  x,
  y,
  tags,
  closeContextMenu,
  onClickDelete,
  noteId,
  userId,
  folders,
}) => {
  initFirebase();

  console.log("tags ", tags);
  const { resolvedTheme } = useTheme();

  const contextMenuRef = useRef();
  useOnClickOutside(contextMenuRef, closeContextMenu);

  // SUB MENU STATES
  const [isColorPickerActive, setColorPickerActive] = useState(false);
  const [isDeleteMenuActive, setDeleteMenuActive] = useState(false);
  const [isAddingTagMenuActive, setAddingTagMenuActive] = useState(false);
  const [isTransferFolderMenuActive, setTransferFolderMenuActive] =
    useState(false);
  const [tag, setTag] = useState("");

  const handleSubMenus = (menu) => {
    if (menu === "colorMenu") {
      setColorPickerActive(true);
      setDeleteMenuActive(false);
      setAddingTagMenuActive(false);
      setTransferFolderMenuActive(false);
    } else if (menu === "deleteMenu") {
      setColorPickerActive(false);
      setDeleteMenuActive(true);
      setAddingTagMenuActive(false);
      setTransferFolderMenuActive(false);
    } else if (menu === "addTagMenu") {
      setColorPickerActive(false);
      setDeleteMenuActive(false);
      setAddingTagMenuActive(true);
      setTransferFolderMenuActive(false);
    } else if (menu == "transferFolderMenu") {
      setColorPickerActive(false);
      setDeleteMenuActive(false);
      setAddingTagMenuActive(false);
      setTransferFolderMenuActive(true);
    }
  };

  // FUNCTION TO HANDLE THE COLOR CHANGE
  const handleColorChange = async (noteId, color) => {
    try {
      await updateDoc(doc(db, `users/${userId}/notes/${noteId}`), {
        color: color,
      });
    } catch (error) {
      console.log("error updating notebook color: ", error);
    }
  };

  const addTag = async (noteId, tagName) => {
    try {
      await updateDoc(doc(db, `users/${userId}/notes/${noteId}`), {
        tags: arrayUnion(tagName),
      });
    } catch (error) {
      console.log("Error adding tag: ", error);
    }
  };

  const removeTag = async (noteId, tagName) => {
    try {
      await updateDoc(doc(db, `users/${userId}/notes/${noteId}`), {
        tags: arrayRemove(tagName),
      });
      console.log("Tag deleted successfully");
    } catch (error) {
      console.log("Error deleting tag: ", error);
    }
  };

  const transferFolder = async (noteId, folderName) => {
    try {
      await updateDoc(doc(db, `users/${userId}/notes/${noteId}`), {
        folderId: folderName
      })
    } catch (error) {
      console.log('error transering folders', error)
    }
  }

  const handleAddTagKeyDown = (event) => {
    if (event.key === "Enter") {
      addTag(noteId, tag);
      setTag(""); // Clear the input field after adding the tag
    }
  };

  return (
    <div ref={contextMenuRef}>
      {/* COLOR PICKER SELECTOR */}
      <div
        style={{ top: `${y + 41}px`, left: `${x + 35}px` }}
        className={`${
          isColorPickerActive ? "grid" : "hidden"
        } bg-lightMode dark:bg-zinc-800 dark:border-none shadow-md border-zinc-800 border-[1px] absolute p-2 grid grid-cols-2 gap-1 rounded-md`}
      >
        <button
          className="bg-red-300 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#fca5a5")}
        ></button>
        <button
          className="bg-orange-300 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#fdba74")}
        ></button>
        <button
          className="bg-yellow-200 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#fde68a")}
        ></button>
        <button
          className="bg-green-300 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#86efac")}
        ></button>
        <button
          className="bg-blue-300 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#93c5fd")}
        ></button>
        <button
          className="bg-violet-300 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#c4b5fd")}
        ></button>
        <button
          className="bg-pink-200 p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#fbcfe8")}
        ></button>
        <button
          className="bg-white p-2 rounded-lg"
          onClick={() => handleColorChange(noteId, "#f4f4f5")}
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
          onClick={() => onClickDelete()}
          className="mr-auto text-[12px] border-zinc-800 bg-red-300 hover:bg-red-400 dark:text-black transition-all duration-200 border-[1px] px-[6.5px] py-[3px] rounded shadow-md"
        >
          delete
        </button>
      </div>

      {/* ADD TAG MENU */}
      <div
        style={{ top: `${y + 41}px`, left: `${x + 60}px` }}
        className={`${
          isAddingTagMenuActive ? "flex" : "hidden"
        } absolute dark:bg-zinc-800 dark:border-none bg-lightMode shadow-md border-zinc-800 border-[1px] p-2 flex-col rounded-md`}
      >
        <div className="mb-2 flex gap-2">
          {tags?.length > 0 ? (
            tags?.map((tag, index) => (
              <button
                className="relative group"
                key={index}
                onClick={() => removeTag(noteId, tag)}
              >
                <span className="absolute top-0 right-0 z-50 bg-lightMode dark:bg-zinc-800 shadow-md text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <IconCloseCircle />
                </span>
                <span className="text-[12px] bg-zinc-800 dark:bg-zinc-100 dark:text-black text-white px-[6.5px] py-[3px] rounded z-0">
                  {tag}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm">add tags</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            onChange={(event) => setTag(event.target.value)}
            onKeyDown={handleAddTagKeyDown}
            value={tag}
            placeholder="enter here"
            className="text-sm outline-none bg-zinc-100 dark:bg-transparent w-[100%] pl-1"
          />
          <button
            className="hover:text-red-400 transition-all duration-200"
            onClick={() => {
              addTag(noteId, tag);
            }}
          >
            <IconArrowReturnRight />
          </button>
        </div>
      </div>

      {/* MOVE FOLDER MENU */}
      <div
        className={`${
          isTransferFolderMenuActive ? "block" : "hidden"
        } bg-lightMode dark:bg-darkMode absolute border-[1px] border-zinc-800 shadow-md rounded-md p-2 flex flex-col gap-2 text-sm min-w-50`}
        style={{ top: `${y + 41}px`, left: `${x + 85}px` }}
      >
        <p>Select a new folder</p>
        {folders.map((folder, index) => (
          <button
            onClick = {() => transferFolder(noteId, folder.name)}
            className="dark:bg-darkMode bg-lightMode px-2 rounded border-[1px] border-zinc-800 dark:border-zinc-500 text-start"
            key={index}
          >
            {folder.name}
          </button>
        ))}
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
        <button
          className="text-lg"
          onClick={() => handleSubMenus("addTagMenu")}
        >
          <IconTag />
        </button>
        <button
          className="text-lg"
          onClick={() => handleSubMenus("transferFolderMenu")}
        >
          <IconFolder2 />
        </button>
      </div>
    </div>
  );
};

export default NoteInspectorMenu;
