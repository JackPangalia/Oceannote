import IconFolder2 from "./icons/IconFolder2";

const FolderTab = ({ bgColor, title , isSelected, onContextMenu, onClick }) => {
  return (
    <button
      style={{ backgroundColor: bgColor }}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={`${
        isSelected
          ? "text-black dark:text-white bg-zinc-200 dark:bg-zinc-800"
          : "text-black dark:text-gray-500"
      } flex items-center bg-lightMode dark:bg-darkMode border-zinc-800 border-[1px] rounded-md shadow-md px-2 py-1 transition-all duration-500`}
    >
      <IconFolder2 className="text-zinc-500 dark:text-gray-500 mr-2" />
      {title}
    </button>
  );
};

export default FolderTab;
