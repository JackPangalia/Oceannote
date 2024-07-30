'use client';

import { useState } from 'react';
import IconBxSearchAlt from "./icons/IconBxSearchAlt";

const CommandList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const commands = [
    { name: 'Highlight', shortcut: 'CTRL + SHIFT + H' },
    { name: 'Task List', shortcut: 'CTRL + SHIFT + 9' },
    { name: 'Bullet point', shortcut: 'CTRL + SHIFT + 9' },
    { name: 'Code block', shortcut: 'CTRL + E' },
    { name: 'Bold', shortcut: 'CTRL + B' },
    { name: 'Italic', shortcut: 'CTRL + I' },
    { name: 'Underline', shortcut: 'CTRL + U' },
    { name: 'Header 1', shortcut: 'CTRL + ALT + 1' },
    { name: 'Header 2', shortcut: 'CTRL + ALT + 2' },
    { name: 'Header 3', shortcut: 'CTRL + ALT + 3' },
    { name: 'Justify left', shortcut: 'CTRL + SHIFT + L'},
    { name: 'Justify right', shortcut: 'CTRL + SHIFT + R'},
    { name: 'Justify center', shortcut: 'CTRL + SHIFT + E'},
    { name: "Horizontal Rule", shortcut: '---'}
  ];

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-y-scroll dark:bg-darkMode bg-lightMode z-50 w-[20rem] sm:w-[25rem] lg:w-[27rem] h-[27rem] shadow-md border-black border-[1px] p-4 rounded-md flex flex-col gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className='flex items-center py-1 px-1 gap-4 mb-3'>
        <IconBxSearchAlt className='size-5' />
        <input
          placeholder="Search for commands"
          className="w-full outline-none bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredCommands.map((command, index) => (
        <div key={index} className='bg-zinc-200 dark:bg-darkMode py-2 px-4 flex justify-between rounded-md border-zinc-800 dark:border-zinc-500 shadow border-[1px]'>
          <span>{command.name}</span>
          <span>{command.shortcut}</span>
        </div>
      ))}
    </div>
  );
};

export default CommandList;
