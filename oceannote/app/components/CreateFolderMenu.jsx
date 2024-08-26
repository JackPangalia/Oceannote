"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import IconArrowReturnRight from "./icons/IconArrowReturnRight";

const CreateFolderMenu = ({isMenuOpen, closeMenu}) => {
  const [folderName, setFolderName] = useState("");
  const [folderCreated, setFolderCreated] = useState(false)
  const auth = getAuth();
  const user = auth.currentUser;

  const createFolder = async () => {
    if (!user || !folderName.trim()) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/folders`), {
        name: folderName,
        createdAt: serverTimestamp(),
      });
      setFolderName(""); // Reset the input after creating the folder
      closeMenu();
    } catch (error) {
      console.error("Error creating folder: ", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createFolder();
    }
  };

  return (
    <div className={`${isMenuOpen ? 'flex' : 'hidden'} flex flex-col absolute top-40 py-[7.8px] px-[7.8px] rounded-md shadow-md border-[1px] dark:bg-darkMode bg-lightMode border-zinc-800`}>
      <p className="text-sm">New folder</p>
      <div className="flex items-center gap-3 mt-1">
        <input
          placeholder="Enter folder name"
          className="text-sm outline-none bg-zinc-100 dark:bg-transparent w-[100%]"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyPress={handleKeyPress} // Create folder on "Enter" key press
        />
        <button
          className="hover:text-red-400 transition-all duration-200"
          onClick={createFolder} // Create folder on button click
        >
          <IconArrowReturnRight />
        </button>
      </div>
    </div>
  );
};

export default CreateFolderMenu;
