"use client";
import IconDelete from "./icons/IconDelete";
import IconBxPaint from "./icons/IconBxPaint";
import IconRename from "./icons/IconRename";
import IconArrowReturnRight from "./icons/IconArrowReturnRight";
import { useRef } from "react";
import { useOnClickOutside } from "../utils/useOnClickOutside";
import { useState } from "react";

const NoteInspectorMenu = ({ x, y, closeContextMenu, onClickDelete }) => {
  const contextMenuRef = useRef();
  useOnClickOutside(contextMenuRef, closeContextMenu);

  // SUB MENU STATES
  const [isColorPickerActive, setColorPickerActive] = useState(false);
  const [isDeleteMenuActive, setDeleteMenuActive] = useState(false);
  const [isRenamingActive, setRenamingActive] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState('')

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

  return (
    <div ref={contextMenuRef}>
      {/* COLOR PICKER SELECTOR */}
      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${
          isColorPickerActive ? "grid" : "hidden"
        } bg-zinc-100 shadow-md border-zinc-200 border-[1px] absolute p-2 rounded-md grid grid-cols-2 gap-1`}
      >
        <button className="bg-red-400 p-2 rounded-lg"></button>
        <button className="bg-blue-400 p-2 rounded-lg"></button>
        <button className="bg-emerald-400 p-2 rounded-lg"></button>
        <button className="bg-purple-400 p-2 rounded-lg"></button>
        <button className="bg-pink-200 p-2 rounded-lg"></button>
        <button className="bg-white p-2 rounded-lg"></button>
      </div>

      {/* COMFIRM DELETE SUB MENU */}
      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${
          isDeleteMenuActive ? "flex" : "hidden"
        } absolute bg-zinc-100 shadow-md border-zinc-200 border-[1px] p-2 flex-col rounded-md`}
      >
        <label className="text-sm mb-1">Enter <span className = 'text-red-500'>"confirm"</span> to delete</label>
        <div className="flex items-center gap-3">
          <input
            onChange = {(event) => setDeleteConfirmation(event.target.value)}
            value = {deleteConfirmation}
            placeholder="enter here"
            className="text-sm px-2 pb-[2px] outline-none border-gray-500 border-[1px] rounded-md w-[80%]"
          />
          <button className="hover:text-red-400 transition-all duration-200" onClick = {() => {
            if (deleteConfirmation === 'confirm') {
              onClickDelete()
            }
          }}>
            <IconArrowReturnRight />
          </button>
        </div>
      </div>

      {/* RENAME SUB MENU */}
      <div
        style={{ top: `${y + 41}px`, left: `${x}px` }}
        className={`${
          isRenamingActive ? "flex" : "hidden"
        } absolute bg-zinc-100 shadow-md border-zinc-200 border-[1px] p-2 flex-col rounded-md`}
      >
        <label className="text-sm mb-1">Enter a new title</label>
        <div className="flex items-center gap-3">
          <input
            placeholder="title"
            className="text-sm px-2 pb-[2px] outline-none border-gray-500 border-[1px] rounded-md w-[80%]"
          />
          <button className="hover:text-red-400 transition-all duration-200">
            <IconArrowReturnRight />
          </button>
        </div>
      </div>

      <div
        style={{ top: `${y}px`, left: `${x}px` }}
        className="absolute z-50 text-black bg-zinc-100 shadow-md border-zinc-200 border-[1px] px-4 py-2 rounded-md flex items-center gap-2"
      >
        <button
          className="text-lg"
          onClick={() => {
            handleSubMenus('deleteMenu')
          }}
        >
          <IconDelete />
        </button>
        <button className="text-lg" onClick={() => handleSubMenus("colorMenu")}>
          <IconBxPaint />
        </button>
        <button
          className="text-lg"
          onClick={() => handleSubMenus("renameMenu")}
        >
          <IconRename />
        </button>
      </div>
    </div>
  );
};

export default NoteInspectorMenu;
