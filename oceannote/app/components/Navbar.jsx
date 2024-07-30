"use client";

//* ICON COMPONENT IMPORTS *//
import IconJournalBookmarkFill from "./icons/IconJournalBookmarkFill";
import IconMoonStars from "./icons/IconMoonStars";
import IconListNested from "./icons/IconListNested";
import IconSun from "./icons/IconSun";

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
          className={`text-md text-gray-500 p-4 ${
            showNavbar || pathname === "/notes" ? "fade-in" : "fade-out"
          } `}
        >
          Oceannote / Notes
        </h1>

        <nav
          className={`${
            showNavbar || pathname === "/notes" ? "fade-in" : "fade-out"
          } p-4 w-fit px-[2rem] absolute right-0`}
        >
          <ul className="flex gap-6 text-gray-500 items-center">
            <li className = 'md:block hidden'>
              <button
                className="mt-2 hover:text-black dark:hover:text-white transition-all duration-150"
                onClick={() => commandListToggleOnClick()}
              >
                <IconListNested />
              </button>
            </li>
            <li>
              <Link
                href="/notes"
                className="hover:text-black dark:hover:text-white transition-all duration-150"
              >
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
    </>
  );
};

export default Navbar;
