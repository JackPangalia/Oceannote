const NavbarNoteTabSlider = () => {
  return (
    <ul className="mx-auto flex gap-2 items-center pt-5 w-[50vw] overflow-x-scroll scrollbar-hidden">
      <button className=" px-2 rounded-md min-w-32 border-zinc-800 dark:border-zinc-500 border-[1px] text-sm hover:bg-lightMode dark:hover:bg-zinc-800 transition-colors duration-150">
        item one
      </button>
      <button className=" px-2 rounded-md min-w-32 border-zinc-800 dark:border-zinc-500 border-[1px] text-sm hover:bg-lightMode dark:hover:bg-zinc-800 transition-colors duration-150">
        item one
      </button>
      <button className=" px-2 rounded-md min-w-32 border-zinc-800 dark:border-zinc-500 border-[1px] text-sm hover:bg-lightMode dark:hover:bg-zinc-800 transition-colors duration-150">
        item one
      </button>
    </ul>
  );
};

export default NavbarNoteTabSlider;
