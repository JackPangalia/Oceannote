"use client";


//* ICON COMPONENT IMPORTS *//
import IconJournalBookmarkFill from "./icons/IconJournalBookmarkFill";
import IconMoonStars from "./icons/IconMoonStars";
import IconProfile from "./icons/IconProfile";
import IconListNested from "./icons/IconListNested";
import IconSun from "./icons/IconSun";

//* OTHER IMPORTS *//
import Link from "next/link";
import { useTheme } from "next-themes";

const Navbar = ({ shortCutSideBarToggleOnClick }) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="p-4 flex w-full justify-end absolute">
      <nav>
        <ul className="flex gap-6 text-gray-500 items-center">
        <li>
            <button className = 'mt-2 hover:text-black dark:hover:text-white transition-all duration-150' onClick = {() => shortCutSideBarToggleOnClick}>
              <IconListNested />
            </button>
          </li>
          <li>
            <Link href="/notes" className = 'hover:text-black dark:hover:text-white transition-all duration-150'>
              <IconJournalBookmarkFill />
            </Link>
          </li>
          <li>
            <button
              className="mt-2 hover:text-black dark:hover:text-white transition-all duration-150"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? <IconSun /> : <IconMoonStars />}
            </button>
          </li>
          
          {/* <li>
            <button className="mt-2">
              <IconProfile />
            </button>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
