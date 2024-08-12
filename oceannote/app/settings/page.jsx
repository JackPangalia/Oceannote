"use client";

//* ICON IMPORTS *//
import IconProfile from "../components/icons/IconProfile";
import IconShortcut from "../components/icons/IconShortcut";
import IconKeyboard from "../components/icons/IconKeyboard";

import { useState } from "react";

//* COMPONENT IMPORTS *//
import ProfileToggle from "../components/ProfileToggle";
import CommandsToggle from "../components/CommandsToggle";
import PreferencesToggle from "../components/PreferencesToggle";
import Navbar from "../components/Navbar";

const Settings = () => {
  const [isAccountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [isCommandsSettingsOpen, setCommandsSettingsOpen] = useState(true);

  const handleSettingsMenus = (menu) => {
    if (menu === "account") {
      setAccountSettingsOpen(true);
      setCommandsSettingsOpen(false);
    } else if (menu === "commands") {
      setAccountSettingsOpen(false);
      setCommandsSettingsOpen(true);
    } else if (menu === "preferences") {
      setAccountSettingsOpen(false);
      setCommandsSettingsOpen(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-[2rem] max-w-[1500px] mx-auto mt-3 flex">
        <aside className="md:w-[25%]">
          <h1 className="text-xl">Settings</h1>
          <ul className="mt-5 flex flex-col gap-3 ml-3">
            <li>
              <button
                onClick={() => handleSettingsMenus("account")}
                className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-150"
              >
                <IconProfile /> Account
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSettingsMenus("commands")}
                className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-150"
              >
                <IconKeyboard />
                Commands and text formating
              </button>
            </li>
          </ul>
        </aside>

        <div className="md:w-[75%]">
          {isAccountSettingsOpen && <ProfileToggle />}
          {isCommandsSettingsOpen && <CommandsToggle />}
        </div>
      </div>
    </>
  );
};

export default Settings;
