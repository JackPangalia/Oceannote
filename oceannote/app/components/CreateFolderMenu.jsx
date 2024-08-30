"use client";
import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import IconArrowReturnRight from "./icons/IconArrowReturnRight";

const CreateFolderMenu = ({ isMenuOpen, closeMenu }) => {
  const [folderName, setFolderName] = useState("");
  const [isNameTaken, setIsNameTaken] = useState(false)
  const auth = getAuth();
  const user = auth.currentUser;

  const createFolder = async () => {
    if (!user || !folderName.trim()) return;

    // Reference to the folders collection
    const folderRef = collection(db, `users/${user.uid}/folders`);

    // Query to check if a folder with the same name already exists
    const q = query(folderRef, where("name", "==", folderName.trim()));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsNameTaken(true)
        return;
      }

      // Proceed to create the new folder if no duplicate is found
      await addDoc(folderRef, {
        name: folderName.trim(),
        color: "#f4f4f5", // Default color or any other properties you want to set
        createdAt: serverTimestamp(),
        isDeletable: true, // Or any default properties
      });

      setFolderName(""); // Reset the input after creating the folder
      closeMenu();
      setIsNameTaken(false)
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
    <div
      className={`${
        isMenuOpen ? "flex" : "hidden"
      } flex flex-col absolute top-40 py-[7.8px] px-[7.8px] rounded-md shadow-md border-[1px] dark:bg-darkMode bg-lightMode border-zinc-800 dark:border-zinc-500`}
    >
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

      <div className={`${isNameTaken ? 'block' : 'hidden'} left-0 absolute top-16 bg-lightMode dark:bg-darkMode border-zinc-800 dark:border-zinc-500 border-[1px] px-2 py-1 rounded-md shadow-md text-sm`}>
        A folder with this name is taken{" "}
        <span className="text-red-400 font-semibold">!</span>
      </div>
    </div>
  );
};

export default CreateFolderMenu;
