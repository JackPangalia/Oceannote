"use client";

import { useState } from "react";
import IconBxSearchAlt from "./icons/IconBxSearchAlt";

const CommandsToggle = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const commands = [
    { name: "Highlight", shortcut: "CTRL + SHIFT + H" },
    { name: "Task List", shortcut: "CTRL + SHIFT + 9" },
    { name: "Bullet point", shortcut: "CTRL + SHIFT + 9" },
    { name: "Code block", shortcut: "CTRL + E" },
    { name: "Bold", shortcut: "CTRL + B" },
    { name: "Italic", shortcut: "CTRL + I" },
    { name: "Underline", shortcut: "CTRL + U" },
    { name: "Header 1", shortcut: "CTRL + ALT + 1" },
    { name: "Header 2", shortcut: "CTRL + ALT + 2" },
    { name: "Header 3", shortcut: "CTRL + ALT + 3" },
    { name: "Justify left", shortcut: "CTRL + SHIFT + L" },
    { name: "Justify right", shortcut: "CTRL + SHIFT + R" },
    { name: "Justify center", shortcut: "CTRL + SHIFT + E" },
    { name: "Horizontal Rule", shortcut: "---" },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl">Commands and test formating</h2>
      <div className='flex items-center py-2 px-4 gap-4 mb-3 mt-4 bg-lightMode dark:bg-darkMode rounded-md border-zinc-800 dark:border-zinc-500 shadow border-[1px]'>
        <IconBxSearchAlt className='size-5' />
        <input
          placeholder="Search for commands"
          className="w-full outline-none bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className=" rounded-md flex flex-col gap-2">
        {filteredCommands.map((command, index) => (
          <div
            key={index}
            className="bg-lightMode dark:bg-darkMode py-2 px-4 flex justify-between rounded-md border-zinc-800 dark:border-zinc-500 shadow border-[1px]"
          >
            <span>{command.name}</span>
            <span>{command.shortcut}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandsToggle;
