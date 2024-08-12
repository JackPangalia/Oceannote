import Link from "next/link";
import { useTheme } from "next-themes";

const Notetab = ({ title, paragraphSnippet, onContextMenu, link, bgColor }) => {
  const { resolvedTheme } = useTheme();

  // FUNCTION THAT SETS THE NOTEBOOK BACKGROUND COLOR
  const setNoteBoxBackgroundColor = (noteColor) => {
    if (noteColor === "#f4f4f5" && resolvedTheme === "dark") {
      return "#1F2123";
    } else if (noteColor === "#1F2123" && resolvedTheme === "light") {
      return "#f4f4f5";
    } else {
      return noteColor;
    }
  };

  return (
    <Link
      style={{ backgroundColor: bgColor }}
      href={link}
      className="dark:text-black h-[4rem] flex flex-col px-5 py-3 text-sm transition-all duration-500 rounded-md border-zinc-800 dark:border-zinc-600 border-[1px] shadow-md"
      onContextMenu={onContextMenu}
    >
      <h4 className="font-bold line-clamp-2 overflow-ellipsis overflow-hidden">{title}</h4>
      <p className="text-sm line-clamp-2 overflow-ellipsis overflow-hidden">{paragraphSnippet}</p>
    </Link>
  );
};

export default Notetab;
