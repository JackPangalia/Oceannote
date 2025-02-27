
"use client";

//* ICON COMPONENT IMPORTS *//
import IconJournalBookmarkFill from "./icons/IconJournalBookmarkFill";
import IconMoonStars from "./icons/IconMoonStars";
import IconListNested from "./icons/IconListNested";
import IconSun from "./icons/IconSun";
import IconSettingsOutline from "./icons/IconSettingsOutline";
import NavbarNoteTabSlider from "./NavbarNoteTabSlider";

//* OTHER IMPORTS *//
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = ({ commandListToggleOnClick }) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseY = event.clientY;

      const threshold = 45;

      if (mouseY <= threshold) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <header className="mx-[1rem] flex relative">
        <h1
          className={`absolute text-md text-500 p-4 ${
            showNavbar || pathname === "/notes" ? "fade-in" : "fade-out"
          } `}
        >
          {pathname === "/notes" && "Oceannote / Notes"}
          {pathname === "/note" && "Oceannote / Note taking"}
          {pathname === "/settings" && "Oceannote / Settings"}
        </h1>

        {/* <NavbarNoteTabSlider /> */}

       <nav
          className={`${
            showNavbar || pathname === "/notes" ? "fade-in" : "fade-out"
          } p-4 w-fit px-[2rem] absolute right-0`}
        >
          <ul className="flex gap-6 text-gray-500 items-center">
            <li>
              <Link
                href="/notes"
                className="hover:text-black dark:hover:text-white transition-all duration-150"
              >
                <IconJournalBookmarkFill />
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="hover:text-black dark:hover:text-white transition-all duration-150"
              >
                <IconSettingsOutline />
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
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
