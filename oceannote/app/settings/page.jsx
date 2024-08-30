"use client";

//* ICON IMPORTS *//
import IconProfile from "../components/icons/IconProfile";
import IconKeyboard from "../components/icons/IconKeyboard";
import IconDelete from "../components/icons/IconDelete";
import IconArrow90degLeft from "../components/icons/IconArrow90degLeft";

import { useState } from "react";
import Link from "next/link";

//* COMPONENT IMPORTS *//
import ProfileToggle from "../components/ProfileToggle";
import CommandsToggle from "../components/CommandsToggle";
import Navbar from "../components/Navbar";
import RecentlyDeletedToggle from "../components/RecentlyDeletedToggle";

import { getAuth, deleteUser } from "firebase/auth";
import { deleteDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import according to your project structure

const Settings = () => {
  const [isAccountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [isCommandsSettingsOpen, setCommandsSettingsOpen] = useState(false);
  const [isRecentlyDeletedToggleOpen, setRecentlyDeletedToggleOpen] =
    useState(false);
  const [isMenuOpen, setMenuOpen] = useState(true);

  const deleteUserAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently logged in.");
      return;
    }

    try {
      // Delete user data in Firestore
      const userId = user.uid;

      // Delete user's collections and documents (e.g., notes, folders)
      const userCollections = ["notes", "folders"]; // Add other collections as needed

      for (const collectionName of userCollections) {
        const collectionRef = collection(
          db,
          `users/${userId}/${collectionName}`
        );
        const querySnapshot = await getDocs(collectionRef);

        // Delete each document in the collection
        const deletePromises = querySnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);
      }

      // Delete user profile document
      await deleteDoc(doc(db, `users/${userId}`));

      // Delete the user from Firebase Authentication
      await deleteUser(user);

      console.log("User account and data deleted successfully.");
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const handleSettingsMenus = (menu) => {
    setMenuOpen(false);

    if (menu === "commands") {
      setRecentlyDeletedToggleOpen(false);
      setCommandsSettingsOpen(true);
    } else if (menu === "recentlyDeleted") {
      setRecentlyDeletedToggleOpen(true);
      setCommandsSettingsOpen(false);
    }
  };

  const handleBackToMenu = () => {
    setMenuOpen(true);
    setRecentlyDeletedToggleOpen(false);
    setCommandsSettingsOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="px-[2rem] max-w-[1500px] mx-auto mt-16 flex flex-col md:flex-row">
        {/* Only hide the aside in mobile mode */}
        <aside
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:w-[20%] flex flex-col justify-between h-[86vh] mr-16`}
        >
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <button
                  onClick={() => handleSettingsMenus("commands")}
                  className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-150 border-b-[1px] border-t-[1px] border-zinc-500 w-full py-1"
                >
                  <IconKeyboard />
                  Commands and text formatting
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSettingsMenus("recentlyDeleted")}
                  className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-150 border-b-[1px] border-t-[1px] border-zinc-500 w-full py-1"
                >
                  <IconDelete />
                  Recently deleted
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 mt-auto sm:mt-5 ">
            <Link href="/signup" className="text-lg font-semibold">
              Logout
            </Link>
            <button className="text-start text-lg text-red-400">
              Delete account
            </button>
          </div>
        </aside>

        <div className="md:w-[75%]">
          {/* Show the back button only in mobile mode */}
          <button
            onClick={handleBackToMenu}
            className={` mb-4 md:hidden ${isMenuOpen ? "hidden" : "block"}`}
          >
            <IconArrow90degLeft />
          </button>
          {isCommandsSettingsOpen && <CommandsToggle />}
          {isRecentlyDeletedToggleOpen && <RecentlyDeletedToggle />}
        </div>
      </div>
    </>
  );
};

export default Settings;
